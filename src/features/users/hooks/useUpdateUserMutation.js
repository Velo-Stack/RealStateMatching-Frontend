import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { USERS_QUERY_KEY } from "../constants/usersConstants";
import { updateUserApi } from "../services/usersApi";

export const useUpdateUserMutation = (queryClient, onSuccessCallback) =>
  useMutation({
    mutationFn: updateUserApi,
    onSuccess: () => {
      toast.success("تم تحديث المستخدم بنجاح");
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
      onSuccessCallback();
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "حدث خطأ أثناء تحديث المستخدم");
    },
  });
