import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
} from "@chakra-ui/react";

const FriendRequestModal = ({ isOpen, onClose, requester, onAccept, onReject }) => {
  // State để lưu trữ trạng thái đồng ý hoặc từ chối
  const [loading, setLoading] = useState(false);

  // Xử lý khi người dùng nhấn đồng ý yêu cầu kết bạn
  const handleAccept = async () => {
    setLoading(true);
    await onAccept(requester._id);
    setLoading(false);
    onClose(); // Đóng modal sau khi xử lý yêu cầu
  };

  // Xử lý khi người dùng nhấn từ chối yêu cầu kết bạn
  const handleReject = async () => {
    setLoading(true);
    await onReject(requester._id);
    setLoading(false);
    onClose(); // Đóng modal sau khi xử lý yêu cầu
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Yêu Cầu Kết Bạn</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
        {requester && (
          <p>{requester.name} muốn kết bạn với bạn. Bạn có muốn chấp nhận yêu cầu này?</p>
        )}
      </ModalBody>

        <ModalFooter>
          <Button colorScheme="green" mr={3} onClick={handleAccept} isLoading={loading}>
            Đồng ý
          </Button>
          <Button variant="ghost" onClick={handleReject} isLoading={loading}>
            Từ chối
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default FriendRequestModal;
