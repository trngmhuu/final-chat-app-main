const express = require("express");
const app = express();
require("dotenv").config();
const { notFound, errorHandler } = require("./middlewares/errorMiddleware");

app.use(express.json());

const colors = require("colors");

//------- Kết nối CSDL
const connectDB = require("./config/db");
connectDB();

//------- Định nghĩa các Route
const userRoute = require("./routes/userRoute");
app.use("/api/user/", userRoute);

const chatRoute = require("./routes/chatRoute");
app.use("/api/chat", chatRoute);

const messageRoute = require("./routes/messageRoute");
app.use("/api/message", messageRoute);
//-------

app.use(notFound);
app.use(errorHandler);

//------- Định nghĩa port
const port = process.env.PORT;
const server = app.listen(port, () =>
  console.log(`Example app listening on port ${port}!`.yellow.bold)
);

//------- Cấu hình socket.io
const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageReceived) => {
    var chat = newMessageReceived.chat;
    if (!chat.users) return console.log("chat.users không xác định");
    chat.users.forEach((user) => {
      if (user._id === newMessageReceived.sender._id) return;
      socket.in(user._id).emit("message received", newMessageReceived);
    });
  });

  socket.on("messageDeleted", (messageId) => {
    // Phát lại sự kiện cho tất cả các client khác
    socket.broadcast.emit("messageDeleted", messageId);
  });

  // Lắng nghe yêu cầu reply từ client

  socket.on("send reply", async (data) => {
    try {
      // Handle saving reply message to database here...

      // After saving to database, broadcast the reply message to relevant users
      io.emit("reply received", data);
    } catch (error) {
      console.error("Error handling reply message:", error);
    }
  });

  // Lắng nghe sự kiện xóa GroupChat từ client
socket.on("groupDeleted", (chatId) => {
  // Phát lại sự kiện xóa GroupChat tới tất cả các client khác
  socket.broadcast.emit("groupDeleted received", chatId);
});

  //renameGroup:
  socket.on("rename group", async (data) => {
    try {
      // Handle saving reply message to database here...

      // After saving to database, broadcast the reply message to relevant users
      io.emit("renameGroup received", data);
    } catch (error) {
      console.error("Error handling reply message:", error);
    }
  });
});
