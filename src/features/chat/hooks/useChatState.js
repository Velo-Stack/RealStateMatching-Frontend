import { useState } from "react";
import { NEW_CONVERSATION_INITIAL_STATE } from "../constants/chatConstants";

export const useChatState = () => {
  const [selectedConv, setSelectedConv] = useState(null);
  const [message, setMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newConv, setNewConv] = useState(NEW_CONVERSATION_INITIAL_STATE);

  const handleSend = (e, sendMutation) => {
    e.preventDefault();
    if (!message.trim() || !selectedConv) return;
    sendMutation.mutate({ convId: selectedConv.id, body: message.trim() });
  };

  const handleCreateConv = (e, createConvMutation) => {
    e.preventDefault();
    createConvMutation.mutate(newConv);
  };

  const toggleParticipant = (userId) => {
    setNewConv((prev) => ({
      ...prev,
      participantIds: prev.participantIds.includes(userId)
        ? prev.participantIds.filter((id) => id !== userId)
        : [...prev.participantIds, userId],
    }));
  };

  const resetNewConv = () => {
    setNewConv({ ...NEW_CONVERSATION_INITIAL_STATE });
  };

  return {
    selectedConv,
    setSelectedConv,
    message,
    setMessage,
    isModalOpen,
    setIsModalOpen,
    newConv,
    setNewConv,
    handleSend,
    handleCreateConv,
    toggleParticipant,
    resetNewConv,
  };
};
