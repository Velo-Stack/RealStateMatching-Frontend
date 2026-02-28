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

const normalizeEntityId = (value) => {
  if (value === undefined || value === null || value === "") return null;
  return String(value);
};

const extractParticipantUserIds = (conversation) => {
  if (!Array.isArray(conversation?.participants)) return [];
  return conversation.participants
    .map((participant) =>
      normalizeEntityId(
        participant?.user?.id ?? participant?.id ?? participant?.userId,
      ),
    )
    .filter(Boolean);
};

const extractConversationCreatorIds = (conversation) =>
  [
    conversation?.createdById,
    conversation?.creatorId,
    conversation?.createdBy?.id,
    conversation?.userId,
  ]
    .map((value) => normalizeEntityId(value))
    .filter(Boolean);

const getConversationActivityTimestamp = (conversation) => {
  const candidates = [
    conversation?.lastMessageAt,
    conversation?.updatedAt,
    conversation?.lastMessage?.createdAt,
    conversation?.createdAt,
  ];

  for (const value of candidates) {
    const timestamp = value ? Date.parse(value) : NaN;
    if (Number.isFinite(timestamp)) return timestamp;
  }

  return 0;
};

const conversationBelongsToCurrentUser = ({
  conversation,
  userId,
  currentTeamIds,
}) => {
  if (!userId) return false;

  const participantIds = extractParticipantUserIds(conversation);
  if (participantIds.includes(userId)) return true;

  const creatorIds = extractConversationCreatorIds(conversation);
  if (creatorIds.includes(userId)) return true;

  const conversationTeamId = normalizeTeamId(
    conversation?.team?.id || conversation?.teamId,
  );
  if (conversationTeamId && currentTeamIds.has(conversationTeamId)) return true;

  const hasExplicitAssociationData =
    participantIds.length > 0 ||
    creatorIds.length > 0 ||
    Boolean(conversationTeamId);

  // If backend omits explicit ownership fields, trust scoped endpoint response.
  return !hasExplicitAssociationData;
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
  const currentUserId = useMemo(() => normalizeEntityId(user?.id), [user?.id]);

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
    const withoutSelf = users.filter(
      (candidate) => candidate.id !== user?.id && candidate?.status === "ACTIVE",
    );

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

    const scopedConversations = conversations.filter((conversation) =>
      conversationBelongsToCurrentUser({
        conversation,
        userId: currentUserId,
        currentTeamIds,
      }),
    );

    const seenConversationIds = new Set();
    const uniqueScopedConversations = scopedConversations.filter(
      (conversation) => {
        const conversationId = normalizeEntityId(conversation?.id);
        if (!conversationId) return true;
        if (seenConversationIds.has(conversationId)) return false;
        seenConversationIds.add(conversationId);
        return true;
      },
    );

    return [...uniqueScopedConversations].sort(
      (a, b) =>
        getConversationActivityTimestamp(b) - getConversationActivityTimestamp(a),
    );
  }, [conversations, user, currentUserId, currentTeamIds]);

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
