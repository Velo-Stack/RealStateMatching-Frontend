import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { calculateCommissionApi, saveCommissionApi } from "../services/commissionApi";

export const useCommissionCalculate = () => {
  const calculate = useMutation({
    mutationFn: calculateCommissionApi,
    onError: () => toast.error("تعذر حساب السعي"),
  });

  const save = useMutation({
    mutationFn: saveCommissionApi,
    onSuccess: () => toast.success("تم حفظ الحساب"),
    onError: () => toast.error("تعذر حفظ الحساب"),
  });

  return { calculate, save };
};
