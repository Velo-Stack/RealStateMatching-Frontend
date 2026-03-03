import { Buildings, Handshake, Target, User, Users } from "phosphor-react";
import { ROLES } from "../../../utils/rbac";

export const COLORS = {
  emerald: "#d4af37",
  cyan: "#3b82f6",
  violet: "#8b5cf6",
  amber: "#f59e0b",
  pink: "#ec4899",
  blue: "#10b981",
};

export const CHART_THEME_COLORS = {
  dark: {
    emerald: COLORS.emerald,
    cyan: COLORS.cyan,
    grid: "rgba(255,255,255,0.05)",
    axis: "rgba(255,255,255,0.1)",
    tickPrimary: "#94a3b8",
    tickSecondary: "#64748b",
    tooltipBg: "#1a2235",
    tooltipBorder: "rgba(255,255,255,0.1)",
    tooltipText: "#e2e8f0",
    tooltipLabel: "#94a3b8",
    cursor: "rgba(255,255,255,0.08)",
  },
  light: {
    emerald: "#b8962e",
    cyan: "#2563eb",
    grid: "rgba(15,23,42,0.08)",
    axis: "rgba(15,23,42,0.15)",
    tickPrimary: "#1f2937",
    tickSecondary: "#374151",
    tooltipBg: "#ffffff",
    tooltipBorder: "rgba(15,23,42,0.15)",
    tooltipText: "#111827",
    tooltipLabel: "#374151",
    cursor: "rgba(15,23,42,0.06)",
  },
};

export const teamTypeColors = {
  LANDS: "from-amber-500 to-yellow-500",
  PROPERTIES: "from-violet-500 to-purple-500",
  MAINTENANCE: "from-amber-500 to-orange-500",
  RENTAL: "from-blue-500 to-indigo-500",
  ASSET_MANAGEMENT: "from-rose-500 to-pink-500",
};

export const TEAM_QUICK_ACTIONS = [
  {
    icon: Buildings,
    title: "إضافة عرض جديد",
    subtitle: "إضافة عقار للعرض",
    color: "from-amber-400 to-amber-600",
    path: "/offers",
    allowedRoles: [ROLES.ADMIN, ROLES.MANAGER, ROLES.EMPLOYEE, ROLES.BROKER],
  },
  {
    icon: Target,
    title: "طلب عميل جديد",
    subtitle: "تسجيل طلب بحث",
    color: "from-blue-500 to-indigo-500",
    path: "/requests",
    allowedRoles: [ROLES.ADMIN, ROLES.MANAGER, ROLES.EMPLOYEE, ROLES.BROKER],
  },
  {
    icon: Handshake,
    title: "عرض المطابقات",
    subtitle: "التطابقات المحتملة",
    color: "from-violet-500 to-violet-600",
    path: "/matches",
    allowedRoles: [ROLES.ADMIN, ROLES.MANAGER, ROLES.BROKER],
  },
  {
    icon: User,
    title: "حسابي",
    subtitle: "إدارة معلوماتي",
    color: "from-slate-500 to-slate-600",
    path: "/teams",
    allowedRoles: [
      ROLES.ADMIN,
      ROLES.MANAGER,
      ROLES.EMPLOYEE,
      ROLES.BROKER,
      ROLES.DATA_ENTRY_ONLY,
    ],
  },
];

export const ADMIN_QUICK_ACTIONS = [
  {
    icon: Buildings,
    title: "إضافة عرض جديد",
    subtitle: "إضافة عقار للعرض",
    color: "from-amber-400 to-amber-600",
    path: "/offers",
  },
  {
    icon: Target,
    title: "طلب عميل جديد",
    subtitle: "تسجيل طلب بحث",
    color: "from-blue-500 to-indigo-500",
    path: "/requests",
  },
  {
    icon: Handshake,
    title: "عرض المطابقات",
    subtitle: "التطابقات المحتملة",
    color: "from-violet-500 to-violet-600",
    path: "/matches",
  },
  {
    icon: Users,
    title: "إدارة الفرق",
    subtitle: "إدارة المستخدمين",
    color: "from-amber-500 to-amber-600",
    path: "/teams",
  },
];
