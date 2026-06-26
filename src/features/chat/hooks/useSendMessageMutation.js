import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { CHAT_QUERY_KEYS } from "../constants/chatConstants";
import { sendMessage } from "../services/chatApi";

const buildOptimisticMessage = (body, currentUser) => ({
  id: `optimistic-${Date.now()}`,
  body,
  senderId: currentUser?.id,
  sender: {
    id: currentUser?.id,
    name: currentUser?.name || "أنت",
  },
  createdAt: new Date().toISOString(),
  optimistic: true,
});

export const useSendMessageMutation = (
  queryClient,
  selectedConversationId,
  currentUser,
  onSuccessCallback,
) =>
  useMutation({
    mutationFn: sendMessage,
    onMutate: async ({ body }) => {
      if (!selectedConversationId) return {};

      const queryKey = CHAT_QUERY_KEYS.messages(selectedConversationId);
      await queryClient.cancelQueries({ queryKey });

      const previousMessages = queryClient.getQueryData(queryKey) || [];
      const optimisticMessage = buildOptimisticMessage(body, currentUser);

      queryClient.setQueryData(queryKey, [...previousMessages, optimisticMessage]);

      return { previousMessages, queryKey };
    },
    onSuccess: (createdMessage, _variables, context) => {
      onSuccessCallback();

      const queryKey =
        context?.queryKey || CHAT_QUERY_KEYS.messages(selectedConversationId);

      queryClient.setQueryData(queryKey, (current = []) => {
        const withoutOptimistic = current.filter((message) => !message.optimistic);
        const normalizedMessage = {
          ...createdMessage,
          sender: createdMessage.sender || {
            id: currentUser?.id,
            name: currentUser?.name || "أنت",
          },
        };

        const alreadyExists = withoutOptimistic.some(
          (message) => message.id === normalizedMessage.id,
        );

        return alreadyExists
          ? withoutOptimistic
          : [...withoutOptimistic, normalizedMessage];
      });

      queryClient.invalidateQueries({
        queryKey: CHAT_QUERY_KEYS.conversations,
      });
    },
    onError: (_error, _variables, context) => {
      if (context?.queryKey && context.previousMessages) {
        queryClient.setQueryData(context.queryKey, context.previousMessages);
      }
      toast.error("فشل إرسال الرسالة");
    },
  });
