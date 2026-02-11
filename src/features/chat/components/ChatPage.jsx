import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../../context/AuthContext";
import { hasRole, ROLES } from "../../../utils/rbac";
import { useChatState } from "../hooks/useChatState";
import { useConversationsQuery } from "../hooks/useConversationsQuery";
import { useChatUsersQuery } from "../hooks/useChatUsersQuery";
import { useMessagesQuery } from "../hooks/useMessagesQuery";
import { useMessagesAutoScroll } from "../hooks/useMessagesAutoScroll";
import { useCreateConversationMutation } from "../hooks/useCreateConversationMutation";
import { useSendMessageMutation } from "../hooks/useSendMessageMutation";
import { getConvTitle } from "../utils/chatUtils";
import ChatSidebar from "./ChatSidebar";
import ChatHeader from "./ChatHeader";
import MessagesList from "./MessagesList";
import ChatInput from "./ChatInput";
import EmptyState from "./EmptyState";
import CreateConversationModal from "./CreateConversationModal";
import "./chatMobile.css";

const ChatPage = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { data: conversations = [], isLoading: convsLoading } =
    useConversationsQuery();
  const canCreateConv = hasRole(user, [ROLES.ADMIN, ROLES.MANAGER]);
  const { data: users = [] } = useChatUsersQuery(canCreateConv);

  const {
    selectedConv,
    setSelectedConv,
    message,
    setMessage,
    isModalOpen,
    setIsModalOpen,
    newConv,
    setNewConv,
    handleSend: baseHandleSend,
    handleCreateConv: baseHandleCreateConv,
    toggleParticipant,
    resetNewConv,
  } = useChatState();

  const { data: messages = [], isLoading: msgsLoading } = useMessagesQuery(
    selectedConv?.id,
  );
  const messagesEndRef = useMessagesAutoScroll(messages);

  const createConvMutation = useCreateConversationMutation(queryClient, (data) => {
    setSelectedConv(data);
    setIsModalOpen(false);
    resetNewConv();
  });

  const sendMutation = useSendMessageMutation(
    queryClient,
    selectedConv?.id,
    () => setMessage(""),
  );

  const handleSend = (e) => {
    baseHandleSend(e, sendMutation);
  };

  const handleCreateConv = (e) => {
    baseHandleCreateConv(e, createConvMutation);
  };

  const getConversationTitle = (conv) => getConvTitle(conv, user);

  return (
    <div
      className={`chat-page flex h-[calc(100vh-120px)] bg-[#111827]/60 backdrop-blur-xl rounded-2xl border border-white/5 overflow-hidden ${
        selectedConv ? "chat-show-messages" : "chat-show-conversations"
      }`}
    >
      <ChatSidebar
        canCreateConv={canCreateConv}
        setIsModalOpen={setIsModalOpen}
        convsLoading={convsLoading}
        conversations={conversations}
        selectedConv={selectedConv}
        setSelectedConv={setSelectedConv}
        getConvTitle={getConversationTitle}
      />

      <div className="chat-main flex-1 flex flex-col min-w-0 min-h-0">
        {selectedConv ? (
          <>
            <ChatHeader
              selectedConv={selectedConv}
              getConvTitle={getConversationTitle}
              onBack={() => setSelectedConv(null)}
            />
            <MessagesList
              msgsLoading={msgsLoading}
              messages={messages}
              user={user}
              messagesEndRef={messagesEndRef}
            />
            <ChatInput
              message={message}
              setMessage={setMessage}
              handleSend={handleSend}
              sendMutation={sendMutation}
            />
          </>
        ) : (
          <EmptyState />
        )}
      </div>

      <CreateConversationModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        handleCreateConv={handleCreateConv}
        newConv={newConv}
        setNewConv={setNewConv}
        users={users}
        user={user}
        toggleParticipant={toggleParticipant}
        createConvMutation={createConvMutation}
      />
    </div>
  );
};

export default ChatPage;
