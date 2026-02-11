import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { CHAT_QUERY_KEYS } from "../constants/chatConstants";
import { sendMessage } from "../services/chatApi";

export const useSendMessageMutation = (
  queryClient,
  selectedConversationId,
  onSuccessCallback,
) =>
  useMutation({
    mutationFn: sendMessage,
    onSuccess: () => {
      onSuccessCallback();
      queryClient.invalidateQueries({
        queryKey: CHAT_QUERY_KEYS.messages(selectedConversationId),
      });
    },
    onError: () => toast.error("فشل إرسال الرسالة"),
  });
