import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { MATCHES_QUERY_KEY } from "../constants/matchesConstants";
import { patchMatchStatus } from "../services/matchesApi";

export const useUpdateMatchStatusMutation = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: patchMatchStatus,
    onSuccess: () => {
      toast.success("تم تحديث الحالة بنجاح");
      queryClient.invalidateQueries({ queryKey: MATCHES_QUERY_KEY });
    },
    onError: () => {
      toast.error("حدث خطأ أثناء تحديث الحالة");
    },
  });

  return mutation.mutate;
};
