import { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  IconButton,
  useToast,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import axios from "axios";
import { ChatState } from "../../Context/ChatProvider";
import io from "socket.io-client";

const UpdateChatModal = ({
  messageId,
  fetchMessages,
  fetchAgain,
  setFetchAgain,
  onDelete,
  updateMessages,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const { selectedChat, setSelectedChat, user } = ChatState();

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  // const handleDeleteGroupChat = async () => {
  //   // Kiểm tra xem selectedChat có tồn tại không
  //   if (!selectedChat) {
  //     toast({
  //       title: "Không có nhóm chat được chọn",
  //       status: "error",
  //       duration: 5000,
  //       isClosable: true,
  //       position: "bottom",
  //     });
  //     return;
  //   }
  
  //   try {
  //     const config = {
  //       headers: {
  //         Authorization: `Bearer ${user.token}`,
  //       },
  //     };
  //     const { data } = await axios.delete(`/api/chat/${selectedChat._id}`, config);
  //     toast({
  //       title: data.message,
  //       status: "success",
  //       duration: 5000,
  //       isClosable: true,
  //       position: "bottom",
  //     });
  //     setFetchAgain(!fetchAgain);
  //   } catch (error) {
  //     toast({
  //       title: "Đã có lỗi xảy ra!",
  //       description: error.response.data.message,
  //       status: "error",
  //       duration: 5000,
  //       isClosable: true,
  //       position: "bottom",
  //     });
  //   }
  // };
  
  const handleDeleteMessage = async () => {
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      console.log("Message ID:", messageId); // Log the messageId
      console.log("Config:", config); // Log the config object
      const response = await axios.delete(`/api/message/${messageId}`, config);
      console.log("Response:", response); // Log the response object
      setLoading(false);
      
      
      const socket = io("http://localhost:5000");
      socket.emit("messageDeleted", messageId);
      handleClose();
      
    }catch (error) {
      const errorMessage = error.response?.data?.message || "Unknown error occurred";
      toast({
        title: "Đã có lỗi xảy ra!",
        description: errorMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };

  return (
    <>
      <IconButton
        display={{ base: "flex" }}
        icon={<DeleteIcon />}
        onClick={handleOpen}
      />

      <Modal onClose={handleClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Cảnh báo</ModalHeader>
          <ModalCloseButton />
          <ModalBody>Bạn có chắc chắn muốn xóa tin nhắn này?</ModalBody>
          <ModalFooter>
            <Button
              colorScheme="red"
              mr={3}
              onClick={handleDeleteMessage}
              isLoading={loading}
            >
              Xác nhận
            </Button>
            <Button variant="ghost" onClick={handleClose}>
              Hủy
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateChatModal;
