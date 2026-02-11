export const CHAT_QUERY_KEYS = {
  conversations: ["conversations"],
  users: ["users"],
  messages: (conversationId) => ["messages", conversationId],
};

export const MESSAGES_REFETCH_INTERVAL = 5000;

export const NEW_CONVERSATION_INITIAL_STATE = {
  title: "",
  participantIds: [],
};
