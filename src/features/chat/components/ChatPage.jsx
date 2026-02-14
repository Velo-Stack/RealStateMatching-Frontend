import { useMemo } from "react";
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
  const isAdmin = hasRole(user, [ROLES.ADMIN]);
  const isManager = hasRole(user, [ROLES.MANAGER]);
  const isEmployee = hasRole(user, [ROLES.EMPLOYEE]);
  const isBroker = hasRole(user, [ROLES.BROKER]);
  const teamId = user?.teamId || user?.team?.id;
  const queryClient = useQueryClient();
  const { data: conversations = [], isLoading: convsLoading } =
    useConversationsQuery();
  const canCreateConv = isAdmin || isManager || isEmployee;
  const canSend = canCreateConv;
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

  const allowedUsers = useMemo(() => {
    if (!users.length || !user) return [];
    const withoutSelf = users.filter((u) => u.id !== user?.id);
    if (isAdmin) return withoutSelf;
    if (isBroker) return [];
    const isSameTeam = (u) => {
      const uTeamId = u?.teamId || u?.team?.id;
      return teamId && uTeamId && uTeamId === teamId;
    };
    if (isManager) {
      return withoutSelf.filter(
        (u) => u?.role === ROLES.MANAGER || isSameTeam(u),
      );
    }
    if (isEmployee) return withoutSelf.filter((u) => isSameTeam(u));
    return [];
  }, [users, user, isAdmin, isManager, isEmployee, isBroker, teamId]);

  const visibleConversations = useMemo(() => {
    if (!conversations.length) return [];
    if (isAdmin) return conversations;
    if (isBroker) return [];
    const isSameTeam = (u) => {
      const uTeamId = u?.teamId || u?.team?.id;
      return teamId && uTeamId && uTeamId === teamId;
    };

    return conversations.filter((conv) => {
      if (conv.team) {
        const convTeamId = conv.team?.id || conv.teamId;
        return teamId && convTeamId && convTeamId === teamId;
      }

      const others =
        conv.participants?.filter((p) => p.user?.id !== user?.id) || [];

      if (others.length === 0) return true;

      if (isManager) {
        return others.every((p) => {
          const participant = p.user || p;
          return participant?.role === ROLES.MANAGER || isSameTeam(participant);
        });
      }

      if (isEmployee) {
        return others.every((p) => {
          const participant = p.user || p;
          return isSameTeam(participant);
        });
      }

      return false;
    });
  }, [conversations, isAdmin, isBroker, isManager, isEmployee, teamId, user?.id]);

  if (isBroker) return null;

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
        conversations={visibleConversations}
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
            {canSend && (
              <ChatInput
                message={message}
                setMessage={setMessage}
                handleSend={handleSend}
                sendMutation={sendMutation}
              />
            )}
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
        users={allowedUsers}
        user={user}
        toggleParticipant={toggleParticipant}
        createConvMutation={createConvMutation}
        showScopeHint={isManager || isEmployee}
      />
    </div>
  );
};

export default ChatPage;
