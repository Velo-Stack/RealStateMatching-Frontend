import { Buildings, Handshake, Target, User, Users } from "phosphor-react";

export const COLORS = {
  emerald: "#10b981",
  cyan: "#06b6d4",
  violet: "#8b5cf6",
  amber: "#f59e0b",
  pink: "#ec4899",
  blue: "#3b82f6",
};

export const teamTypeColors = {
  LANDS: "from-emerald-500 to-cyan-500",
  PROPERTIES: "from-violet-500 to-purple-500",
  MAINTENANCE: "from-amber-500 to-orange-500",
  RENTAL: "from-cyan-500 to-blue-500",
  ASSET_MANAGEMENT: "from-rose-500 to-pink-500",
};

export const TEAM_QUICK_ACTIONS = [
  {
    icon: Buildings,
    title: "إضافة عرض جديد",
    subtitle: "إضافة عقار للعرض",
    color: "from-emerald-500 to-emerald-600",
  },
  {
    icon: Target,
    title: "طلب عميل جديد",
    subtitle: "تسجيل طلب بحث",
    color: "from-cyan-500 to-cyan-600",
  },
  {
    icon: Handshake,
    title: "عرض المطابقات",
    subtitle: "التطابقات المحتملة",
    color: "from-violet-500 to-violet-600",
  },
  {
    icon: User,
    title: "حسابي",
    subtitle: "إدارة معلوماتي",
    color: "from-slate-500 to-slate-600",
  },
];

export const ADMIN_QUICK_ACTIONS = [
  {
    icon: Buildings,
    title: "إضافة عرض جديد",
    subtitle: "إضافة عقار للعرض",
    color: "from-emerald-500 to-emerald-600",
  },
  {
    icon: Target,
    title: "طلب عميل جديد",
    subtitle: "تسجيل طلب بحث",
    color: "from-cyan-500 to-cyan-600",
  },
  {
    icon: Handshake,
    title: "عرض المطابقات",
    subtitle: "التطابقات المحتملة",
    color: "from-violet-500 to-violet-600",
  },
  {
    icon: Users,
    title: "إدارة الفرق",
    subtitle: "إدارة المستخدمين",
    color: "from-amber-500 to-amber-600",
  },
];
