import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { NOTIFICATIONS_QUERY_KEY } from "../constants/notificationsConstants";
import { markNotificationRead } from "../services/notificationsApi";

export const useMarkNotificationReadMutation = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: markNotificationRead,
    onMutate: async (notificationId) => {
      await queryClient.cancelQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });

      const previousNotifications = queryClient.getQueryData(NOTIFICATIONS_QUERY_KEY);

      queryClient.setQueryData(NOTIFICATIONS_QUERY_KEY, (current) => {
        if (!Array.isArray(current)) return current;

        return current.map((notification) =>
          notification.id === notificationId
            ? { ...notification, status: "READ" }
            : notification,
        );
      });

      return { previousNotifications };
    },
    onError: (_error, _notificationId, context) => {
      if (context?.previousNotifications) {
        queryClient.setQueryData(
          NOTIFICATIONS_QUERY_KEY,
          context.previousNotifications,
        );
      }

      toast.error("تعذر تحديث حالة الإشعار");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });
    },
  });

  return mutation;
};
