import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { USERS_QUERY_KEY } from "../constants/usersConstants";
import { toggleUserStatusApi } from "../services/usersApi";

export const useToggleUserStatusMutation = (queryClient) =>
  useMutation({
    mutationFn: toggleUserStatusApi,
    onSuccess: () => {
      toast.success("تم تحديث الحالة بنجاح");
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "حدث خطأ");
    },
  });
