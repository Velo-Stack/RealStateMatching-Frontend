import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editMessage } from "../services/chatApi";
import { CHAT_QUERY_KEYS } from "../../../shared/query/queryKeys";
import { toast } from "sonner";

export const useEditMessageMutation = (conversationId) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: editMessage,
        onSuccess: (updatedMessage) => {
            // Update the messages cache
            queryClient.setQueryData(
                CHAT_QUERY_KEYS.messages(conversationId),
                (oldMessages) => {
                    if (!oldMessages) return oldMessages;
                    return oldMessages.map((msg) =>
                        msg.id === updatedMessage.id ? updatedMessage : msg
                    );
                }
            );
            toast.success("تم تعديل الرسالة بنجاح");
        },
        onError: (error) => {
            const errorMessage = error.response?.data?.message;
            if (errorMessage === "Message can only be edited within 24 hours of sending") {
                toast.error("لا يمكن تعديل الرسالة بعد مرور 24 ساعة");
            } else if (errorMessage === "You can only edit your own messages") {
                toast.error("يمكنك تعديل رسائلك فقط");
            } else {
                toast.error("فشل تعديل الرسالة");
            }
        },
    });
};
