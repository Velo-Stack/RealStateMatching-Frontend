import {
  Plus,
  Trash,
  PencilSimple,
  Eye,
  Buildings,
  File,
  UserCircle,
  UsersThree,
  Handshake,
} from "phosphor-react";

export const actionConfig = {
  CREATE: {
    label: "إنشاء",
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
    border: "border-emerald-500/30",
    icon: Plus,
  },
  UPDATE: {
    label: "تحديث",
    bg: "bg-amber-500/10",
    text: "text-amber-400",
    border: "border-amber-500/30",
    icon: PencilSimple,
  },
  DELETE: {
    label: "حذف",
    bg: "bg-red-500/10",
    text: "text-red-400",
    border: "border-red-500/30",
    icon: Trash,
  },
  READ: {
    label: "عرض",
    bg: "bg-cyan-500/10",
    text: "text-cyan-400",
    border: "border-cyan-500/30",
    icon: Eye,
  },
};

export const resourceConfig = {
  Offer: { label: "عرض عقاري", icon: Buildings, color: "text-emerald-400" },
  Request: { label: "طلب عميل", icon: File, color: "text-violet-400" },
  User: { label: "مستخدم", icon: UserCircle, color: "text-amber-400" },
  Team: { label: "فريق", icon: UsersThree, color: "text-cyan-400" },
  TeamMember: { label: "عضو فريق", icon: UsersThree, color: "text-pink-400" },
  Match: { label: "مطابقة", icon: Handshake, color: "text-rose-400" },
};

export const actionLabels = {
  CREATE: "قام بإنشاء",
  UPDATE: "قام بتحديث",
  DELETE: "قام بحذف",
};

export const resourceFilterOptions = [
  { value: "Offer", label: "العروض" },
  { value: "Request", label: "الطلبات" },
  { value: "User", label: "المستخدمين" },
  { value: "Team", label: "الفرق" },
  { value: "TeamMember", label: "أعضاء الفرق" },
  { value: "Match", label: "المطابقات" },
];

export const actionFilterOptions = [
  { value: "CREATE", label: "إنشاء" },
  { value: "UPDATE", label: "تحديث" },
  { value: "DELETE", label: "حذف" },
];
