import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { NOTIFICATIONS_QUERY_KEY } from "../constants/notificationsConstants";
import { markNotificationRead } from "../services/notificationsApi";

export const useMarkNotificationReadMutation = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: markNotificationRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });
    },
    onError: () => {
      toast.error("حدث خطأ أثناء تحديث حالة التنبيه");
    },
  });

  return mutation;
};
