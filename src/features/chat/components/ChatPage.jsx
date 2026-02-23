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

const normalizeTeamId = (value) => {
  if (value === undefined || value === null) return null;
  return String(value);
};

const getTeamIds = (entity) => {
  const ids = new Set();

  const pushId = (value) => {
    const normalized = normalizeTeamId(value);
    if (normalized) ids.add(normalized);
  };

  pushId(entity?.teamId);
  pushId(entity?.team?.id);

  if (Array.isArray(entity?.teams)) {
    entity.teams.forEach((team) => pushId(team?.id ?? team?.teamId));
  }

  return ids;
};

const sharesAnyTeam = (currentTeamIds, entity) => {
  if (!currentTeamIds.size) return false;
  const candidateTeamIds = getTeamIds(entity);
  for (const teamId of candidateTeamIds) {
    if (currentTeamIds.has(teamId)) return true;
  }
  return false;
};

const ChatPage = () => {
  const { user } = useAuth();
  const isAdmin = hasRole(user, [ROLES.ADMIN]);
  const isManager = hasRole(user, [ROLES.MANAGER]);
  const isEmployee = hasRole(user, [ROLES.EMPLOYEE]);
  const isBroker = hasRole(user, [ROLES.BROKER]);
  const queryClient = useQueryClient();
  const { data: conversations = [], isLoading: convsLoading } =
    useConversationsQuery();
  const canCreateConv = isAdmin || isManager;
  const canSend = canCreateConv;
  const { data: users = [] } = useChatUsersQuery(canCreateConv);
  const currentTeamIds = useMemo(() => getTeamIds(user), [user]);

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
    const withoutSelf = users.filter((candidate) => candidate.id !== user?.id);

    if (isAdmin) {
      return withoutSelf.filter(
        (candidate) =>
          candidate?.role === ROLES.MANAGER ||
          sharesAnyTeam(currentTeamIds, candidate),
      );
    }

    if (isManager) {
      return withoutSelf.filter(
        (candidate) =>
          candidate?.role === ROLES.ADMIN ||
          sharesAnyTeam(currentTeamIds, candidate),
      );
    }

    return [];
  }, [users, user, isAdmin, isManager, currentTeamIds]);

  const visibleConversations = useMemo(() => {
    if (!conversations.length || !user) return [];
    if (!isAdmin && !isManager) return [];

    return conversations.filter((conv) => {
      const convTeamId = normalizeTeamId(conv.team?.id || conv.teamId);
      if (convTeamId) {
        return currentTeamIds.has(convTeamId);
      }

      const others =
        conv.participants?.filter((participant) => {
          const participantUser = participant.user || participant;
          return participantUser?.id !== user?.id;
        }) || [];

      if (others.length === 0) return true;

      if (isAdmin) {
        return others.every((p) => {
          const participant = p.user || p;
          return (
            participant?.role === ROLES.MANAGER ||
            sharesAnyTeam(currentTeamIds, participant)
          );
        });
      }

      if (isManager) {
        return others.every((p) => {
          const participant = p.user || p;
          return (
            participant?.role === ROLES.ADMIN ||
            sharesAnyTeam(currentTeamIds, participant)
          );
        });
      }

      return false;
    });
  }, [conversations, user, isAdmin, isManager, currentTeamIds]);

  if (isBroker || isEmployee) return null;

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
        showScopeHint={isManager}
      />
    </div>
  );
};

export default ChatPage;
