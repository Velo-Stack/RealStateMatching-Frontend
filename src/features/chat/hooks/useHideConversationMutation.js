import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { CHAT_QUERY_KEYS } from "../constants/chatConstants";
import { hideConversation } from "../services/chatApi";

export const useHideConversationMutation = (queryClient, onSuccessCallback) =>
  useMutation({
    mutationFn: hideConversation,
    onSuccess: (data) => {
      toast.success("تم حذف المحادثة بنجاح");
      queryClient.invalidateQueries({ queryKey: CHAT_QUERY_KEYS.conversations });
      if (onSuccessCallback) onSuccessCallback(data);
    },
    onError: () => toast.error("فشل حذف المحادثة"),
  });
