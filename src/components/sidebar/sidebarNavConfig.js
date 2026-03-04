import {
  Bell,
  Buildings,
  ChatCircle,
  FileArrowDown,
  MagnifyingGlass,
  Scroll,
  SquaresFour,
  Users,
  UsersThree,
} from "phosphor-react";

export const SIDEBAR_VISIBILITY = {
  ALWAYS: "always",
  ADMIN: "admin",
  ADMIN_MANAGER_EMPLOYEE: "admin_manager_employee",
  ADMIN_MANAGER_EMPLOYEE_BROKER: "admin_manager_employee_broker",
  ADMIN_MANAGER_DATA_ENTRY: "admin_manager_data_entry",
  ADMIN_BROKER: "admin_broker",
  ADMIN_MANAGER_EMPLOYEE_DATA_ENTRY: "admin_manager_employee_data_entry",
  AUDIT: "audit",
  REPORTS: "reports",
};

export const SIDEBAR_NAV_ITEMS = [
  {
    to: "/",
    icon: SquaresFour,
    label: "لوحة التحكم",
    visibility: SIDEBAR_VISIBILITY.ALWAYS,
  },
  {
    to: "/offers",
    icon: Buildings,
    label: "العروض العقارية",
    visibility: SIDEBAR_VISIBILITY.ADMIN_MANAGER_EMPLOYEE_BROKER,
  },
  {
    to: "/requests",
    icon: MagnifyingGlass,
    label: "طلبات العملاء",
    visibility: SIDEBAR_VISIBILITY.ADMIN_MANAGER_EMPLOYEE_BROKER,
  },
  {
    to: "/notifications",
    icon: Bell,
    label: "التنبيهات",
    visibility: SIDEBAR_VISIBILITY.ALWAYS,
  },
  {
    to: "/users",
    icon: Users,
    label: "المستخدمين",
    visibility: SIDEBAR_VISIBILITY.ADMIN,
  },
  {
    to: "/audit-logs",
    icon: Scroll,
    label: "سجلات التدقيق",
    visibility: SIDEBAR_VISIBILITY.AUDIT,
  },
  {
    to: "/reports",
    icon: FileArrowDown,
    label: "التقارير",
    visibility: SIDEBAR_VISIBILITY.REPORTS,
  },
  {
    to: "/teams",
    icon: UsersThree,
    label: "إدارة الفرق",
    visibility: SIDEBAR_VISIBILITY.ADMIN,
  },
  {
    to: "/chat",
    icon: ChatCircle,
    label: "المحادثات",
    visibility: SIDEBAR_VISIBILITY.ADMIN_MANAGER_DATA_ENTRY,
  },
];
