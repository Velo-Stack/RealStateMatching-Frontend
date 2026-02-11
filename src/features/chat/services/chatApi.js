import api from "../../../utils/api";

export const fetchConversations = async () => {
  const { data } = await api.get("/conversations");
  return data;
};

export const fetchUsers = async () => {
  const { data } = await api.get("/users");
  return data;
};

export const fetchMessages = async (conversationId) => {
  const { data } = await api.get(`/conversations/${conversationId}/messages`);
  return data;
};

export const createConversation = async (payload) => {
  const { data } = await api.post("/conversations", payload);
  return data;
};

export const sendMessage = async ({ convId, body }) => {
  const { data } = await api.post(`/conversations/${convId}/messages`, { body });
  return data;
};
