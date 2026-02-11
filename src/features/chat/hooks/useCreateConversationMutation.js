import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { CHAT_QUERY_KEYS } from "../constants/chatConstants";
import { createConversation } from "../services/chatApi";

export const useCreateConversationMutation = (queryClient, onSuccessCallback) =>
  useMutation({
    mutationFn: createConversation,
    onSuccess: (data) => {
      toast.success("تم إنشاء المحادثة");
      queryClient.invalidateQueries({ queryKey: CHAT_QUERY_KEYS.conversations });
      onSuccessCallback(data);
    },
    onError: () => toast.error("فشل إنشاء المحادثة"),
  });
