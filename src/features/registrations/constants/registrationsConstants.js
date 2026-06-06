export const REGISTRATION_TYPES = [
  { value: "BROKER", label: "وسيط عقاري", description: "للوسطاء الأفراد" },
  { value: "OFFICE", label: "مكتب عقاري", description: "للمكاتب والشركات" },
  { value: "INVESTOR", label: "مستثمر", description: "للمستثمرين الباحثين عن فرص" },
  { value: "DATA_ENTRY", label: "إدخال بيانات", description: "للمساعدين في إدخال العروض والطلبات" },
];

export const TYPE_LABELS = Object.fromEntries(
  REGISTRATION_TYPES.map((item) => [item.value, item.label]),
);

export const STATUS_LABELS = {
  PENDING: "قيد المراجعة",
  APPROVED: "مقبول",
  REJECTED: "مرفوض",
};

export const EMPTY_FORM = {
  type: "",
  name: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
  officeName: "",
  licenseNumber: "",
  cityId: "",
  notes: "",
};
