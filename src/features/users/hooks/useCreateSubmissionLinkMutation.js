import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { createSubmissionLinkApi } from "../services/usersApi";

export const useCreateSubmissionLinkMutation = (onSuccessCallback) =>
    useMutation({
        mutationFn: createSubmissionLinkApi,
        onSuccess: (data) => {
            toast.success("تم إنشاء رابط التقديم بنجاح");
            onSuccessCallback?.(data);
        },
        onError: (err) => {
            toast.error(
                err.response?.data?.message || "حدث خطأ أثناء إنشاء رابط التقديم"
            );
        },
    });
