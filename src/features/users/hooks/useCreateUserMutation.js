import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { USERS_QUERY_KEY } from "../constants/usersConstants";
import { createUserApi } from "../services/usersApi";

export const useCreateUserMutation = (queryClient, onSuccessCallback) =>
  useMutation({
    mutationFn: createUserApi,
    onSuccess: () => {
      toast.success("تم إنشاء المستخدم بنجاح");
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
      onSuccessCallback();
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "حدث خطأ أثناء إنشاء المستخدم");
    },
  });
