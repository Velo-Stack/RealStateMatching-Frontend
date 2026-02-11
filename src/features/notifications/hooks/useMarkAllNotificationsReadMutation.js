import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { NOTIFICATIONS_QUERY_KEY } from "../constants/notificationsConstants";
import { markAllNotificationsRead } from "../services/notificationsApi";

export const useMarkAllNotificationsReadMutation = (notifications) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      await markAllNotificationsRead(notifications);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });
      toast.success("تم تعليم جميع التنبيهات كمقروءة");
    },
    onError: () => {
      toast.error("حدث خطأ");
    },
  });

  return mutation;
};
