import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { USERS_QUERY_KEY } from "../constants/usersConstants";
import { deleteUserApi } from "../services/usersApi";

export const useDeleteUserMutation = (queryClient) =>
  useMutation({
    mutationFn: deleteUserApi,
    onSuccess: () => {
      toast.success("تم حذف المستخدم");
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "حدث خطأ");
    },
  });
