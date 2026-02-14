export const REQUESTS_QUERY_KEY = ["requests"];

export const REQUESTS_EMPTY_FORM = {
  type: "LAND",
  usage: "",
  propertySubType: "",
  submittedBy: "",
  description: "",
  city: "",
  district: "",
  cityId: "",
  neighborhoodId: "",
  areaFrom: "",
  areaTo: "",
  budgetFrom: "",
  budgetTo: "",
  purpose: "",
  priority: "MEDIUM",
  brokerContactPhone: "",
};

export const REQUESTS_CREATE_SUCCESS_MESSAGE = "تم إنشاء الطلب بنجاح";
export const REQUESTS_UPDATE_SUCCESS_MESSAGE = "تم تحديث الطلب بنجاح";
export const REQUESTS_DELETE_SUCCESS_MESSAGE = "تم حذف الطلب بنجاح";

export const REQUESTS_CREATE_ERROR_MESSAGE = "حدث خطأ أثناء الإنشاء";
export const REQUESTS_UPDATE_ERROR_MESSAGE = "حدث خطأ أثناء التحديث";
export const REQUESTS_DELETE_ERROR_MESSAGE = "حدث خطأ أثناء الحذف";

export const REQUESTS_DELETE_CONFIRMATION_MESSAGE = "هل أنت متأكد؟";

export const priorityConfig = {
  HIGH: {
    label: "مرتفعة",
    bg: "bg-red-500/10",
    text: "text-red-400",
    border: "border-red-500/30",
  },
  MEDIUM: {
    label: "متوسطة",
    bg: "bg-amber-500/10",
    text: "text-amber-400",
    border: "border-amber-500/30",
  },
  LOW: {
    label: "منخفضة",
    bg: "bg-slate-500/10",
    text: "text-slate-400",
    border: "border-slate-500/30",
  },
};
