import { POLLING_INTERVALS } from "../../../shared/query/pollingConfig";
import { CHAT_QUERY_KEYS } from "../../../shared/query/queryKeys";

export { CHAT_QUERY_KEYS };

export const MESSAGES_REFETCH_INTERVAL = POLLING_INTERVALS.chatMessages;

export const NEW_CONVERSATION_INITIAL_STATE = {
  title: "",
  participantIds: [],
};
