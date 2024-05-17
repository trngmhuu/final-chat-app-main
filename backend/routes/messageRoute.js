const express = require("express");
const multer = require("multer");
const { protect } = require("../middlewares/authMiddleware");
const { allMessages, sendMessage, deleteMessage, uploadFile, replayMessage } = require("../controllers/messageController");
const router = express.Router();

// Cấu hình lưu trữ file với multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Thư mục lưu trữ file
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // Tên file
  },
});

const upload = multer({ storage: storage });

// Endpoint để lấy tất cả các tin nhắn trong một cuộc trò chuyện
router.get("/:chatId", protect, allMessages);

// Endpoint để gửi một tin nhắn mới
router.post("/", protect, sendMessage);

// Endpoint để xóa một tin nhắn
router.delete("/:messageId", protect, deleteMessage);

// Endpoint để gửi file
router.post('/upload-file', protect, upload.single('file'), uploadFile);

// Endpoint để gửi tin nhắn replay
router.post('/replay', protect, replayMessage);

module.exports = router;
