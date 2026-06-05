import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { uploadUserAvatarApi, deleteUserAvatarApi } from "../services/usersApi";
import { USERS_QUERY_KEYS } from "../../../shared/query/queryKeys";

export const useUploadUserAvatarMutation = () => {
  const queryClient = useQueryClient();

  const upload = useMutation({
    mutationFn: uploadUserAvatarApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEYS.all });
      toast.success("تم تحديث الصورة الشخصية");
    },
    onError: (error) => {
      const message = error?.response?.data?.message || error?.response?.data?.error;
      toast.error(message || "تعذر رفع الصورة");
    },
  });

  const remove = useMutation({
    mutationFn: deleteUserAvatarApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEYS.all });
      toast.success("تم حذف الصورة الشخصية");
    },
    onError: () => {
      toast.error("تعذر حذف الصورة");
    },
  });

  return { upload, remove };
};
