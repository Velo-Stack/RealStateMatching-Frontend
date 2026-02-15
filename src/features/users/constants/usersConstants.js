import { Shield, UserCircle, Users as UsersIcon, UserGear, Database } from "phosphor-react";

export const USERS_QUERY_KEY = ["users"];

export const roleConfig = {
  ADMIN: {
    label: "مدير نظام",
    bg: "bg-rose-500/10",
    text: "text-rose-400",
    border: "border-rose-500/30",
    icon: Shield,
  },
  MANAGER: {
    label: "مدير",
    bg: "bg-amber-500/10",
    text: "text-amber-400",
    border: "border-amber-500/30",
    icon: UsersIcon,
  },
  BROKER: {
    label: "وسيط",
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
    border: "border-emerald-500/30",
    icon: UserCircle,
  },
  EMPLOYEE: {
    label: "موظف",
    bg: "bg-cyan-500/10",
    text: "text-cyan-400",
    border: "border-cyan-500/30",
    icon: UserGear,
  },
  DATA_ENTRY_ONLY: {
    label: "إدخال بيانات",
    bg: "bg-violet-500/10",
    text: "text-violet-400",
    border: "border-violet-500/30",
    icon: Database,
  },
};

export const statusConfig = {
  ACTIVE: { label: "نشط", bg: "bg-emerald-500/10", text: "text-emerald-400" },
  SUSPENDED: { label: "موقوف", bg: "bg-amber-500/10", text: "text-amber-400" },
  BANNED: { label: "محظور", bg: "bg-orange-500/10", text: "text-orange-400" },
  DELETED: { label: "محذوف", bg: "bg-red-500/10", text: "text-red-400" },
};

export const emptyUser = {
  name: "",
  email: "",
  password: "",
  role: "BROKER",
  phone: "",
};

export const inputClasses =
  "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition-all duration-300 focus:border-emerald-500/50 focus:bg-white/10 focus:shadow-[0_0_20px_rgba(16,185,129,0.15)]";

export const labelClasses = "block mb-2 text-sm font-medium text-slate-300";
