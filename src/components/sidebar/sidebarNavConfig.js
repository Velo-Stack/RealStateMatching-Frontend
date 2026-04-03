import {
  Bell,
  Buildings,
  ChatCircle,
  FileArrowDown,
  Globe,
  Handshake,
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
  WEBSITE_CMS: "website_cms",
};

export const SIDEBAR_NAV_ITEMS = [
  {
    to: "/app",
    icon: SquaresFour,
    label: "لوحة التحكم",
    visibility: SIDEBAR_VISIBILITY.ALWAYS,
  },
  {
    to: "/app/offers",
    icon: Buildings,
    label: "العروض العقارية",
    visibility: SIDEBAR_VISIBILITY.ADMIN_MANAGER_EMPLOYEE_BROKER,
  },
  {
    to: "/app/requests",
    icon: MagnifyingGlass,
    label: "طلبات العملاء",
    visibility: SIDEBAR_VISIBILITY.ADMIN_MANAGER_EMPLOYEE_BROKER,
  },
  {
    to: "/app/matches",
    icon: Handshake,
    label: "التطابقات الذكية",
    visibility: SIDEBAR_VISIBILITY.ADMIN,
  },
  {
    to: "/app/notifications",
    icon: Bell,
    label: "التنبيهات",
    visibility: SIDEBAR_VISIBILITY.ALWAYS,
  },
  {
    to: "/app/users",
    icon: Users,
    label: "المستخدمين",
    visibility: SIDEBAR_VISIBILITY.ADMIN,
  },
  {
    to: "/app/audit-logs",
    icon: Scroll,
    label: "سجلات التدقيق",
    visibility: SIDEBAR_VISIBILITY.AUDIT,
  },
  {
    to: "/app/reports",
    icon: FileArrowDown,
    label: "التقارير",
    visibility: SIDEBAR_VISIBILITY.REPORTS,
  },
  {
    to: "/app/website",
    icon: Globe,
    label: "Website CMS",
    visibility: SIDEBAR_VISIBILITY.WEBSITE_CMS,
  },
  {
    to: "/app/teams",
    icon: UsersThree,
    label: "إدارة الفرق",
    visibility: SIDEBAR_VISIBILITY.ADMIN,
  },
  {
    to: "/app/chat",
    icon: ChatCircle,
    label: "المحادثات",
    visibility: SIDEBAR_VISIBILITY.ADMIN_MANAGER_DATA_ENTRY,
  },
];
