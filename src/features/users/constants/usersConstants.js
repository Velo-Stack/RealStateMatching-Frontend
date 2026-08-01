import { Shield, UserCircle, Users as UsersIcon, UserGear, Database } from "phosphor-react";
import { USERS_QUERY_KEYS } from "../../../shared/query/queryKeys";

export const USERS_QUERY_KEY = USERS_QUERY_KEYS.list;

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
  permissionMode: "ROLE_DEFAULT",
  permissions: [],
};

export const permissionModeOptions = [
  { value: "ROLE_DEFAULT", label: "صلاحيات الدور الافتراضية" },
  { value: "CUSTOM", label: "صلاحيات مخصصة" },
  { value: "CUSTOM_EMPTY", label: "بدون صلاحيات" },
];

export const permissionScopeOptions = [
  { value: "", label: "بدون نطاق" },
  { value: "OWN", label: "بياناته فقط" },
  { value: "TEAM", label: "الفريق" },
  { value: "ALL", label: "الكل" },
];

export const permissionResourceLabels = {
  offers: "العروض العقارية",
  requests: "طلبات العملاء",
  matches: "التطابقات",
  users: "المستخدمون",
  teams: "الفرق",
  conversations: "المحادثات",
  notifications: "الإشعارات",
  dashboard: "لوحة التحكم",
  reports: "التقارير",
  auditLogs: "سجل النشاط",
  locations: "المواقع والمدن",
  meta: "البيانات العامة",
  website: "إدارة الموقع",
  submissionLinks: "روابط الإرسال",
  uploads: "رفع الملفات",
  featureFlags: "إعدادات النظام",
  tools: "الأدوات",
  brokers: "النقاط والمكافآت",
  offices: "المكاتب العقارية",
  distribution: "توزيع الطلبات",
  registrations: "طلبات التسجيل",
  lands: "تقييم الأراضي",
  feasibility: "دراسة الجدوى",
  subscriptions: "الاشتراكات",
  savedSearches: "عمليات البحث المحفوظة",
  joinApplications: "طلبات الانضمام",
};

export const permissionKeyLabels = {
  "offers.read": "عرض العروض",
  "offers.create": "إضافة عرض",
  "offers.update": "تعديل العروض",
  "offers.delete": "حذف العروض",
  "requests.read": "عرض الطلبات",
  "requests.create": "إضافة طلب",
  "requests.update": "تعديل الطلبات",
  "requests.delete": "حذف الطلبات",
  "requests.assign": "تعيين الطلبات للمندوبين",
  "matches.read": "عرض التطابقات",
  "matches.update": "تحديث حالة التطابق",
  "users.read": "عرض المستخدمين",
  "users.create": "إضافة مستخدم",
  "users.update": "تعديل المستخدمين",
  "users.delete": "حذف المستخدمين",
  "users.managePermissions": "إدارة صلاحيات المستخدمين",
  "teams.read": "عرض الفرق",
  "teams.create": "إنشاء فريق",
  "teams.update": "تعديل الفرق",
  "teams.delete": "حذف الفرق",
  "teams.manageMembers": "إدارة أعضاء الفريق",
  "conversations.read": "عرض المحادثات",
  "conversations.create": "بدء محادثة",
  "conversations.update": "تعديل المحادثات",
  "conversations.message": "إرسال رسائل",
  "notifications.read": "عرض الإشعارات",
  "notifications.update": "إدارة الإشعارات",
  "dashboard.read": "عرض لوحة التحكم",
  "reports.export": "تصدير التقارير",
  "auditLogs.read": "عرض سجل النشاط",
  "locations.read": "عرض المواقع والمدن",
  "meta.read": "عرض البيانات العامة",
  "website.manage": "إدارة محتوى الموقع",
  "submissionLinks.create": "إنشاء روابط إرسال",
  "uploads.create": "رفع ملفات",
  "featureFlags.read": "عرض إعدادات النظام",
  "featureFlags.manage": "تعديل إعدادات النظام",
  "tools.commission.read": "عرض حاسبة العمولة",
  "tools.commission.calculate": "حساب العمولة",
  "tools.commission.manageRules": "إدارة قواعد العمولة",
  "brokers.points.read": "عرض نقاط الوسطاء",
  "brokers.rewards.redeem": "استبدال المكافآت",
  "brokers.gamification.manage": "إدارة نظام النقاط والمكافآت",
  "offices.read": "عرض المكاتب",
  "offices.create": "إضافة مكتب",
  "offices.update": "تعديل المكاتب",
  "offices.delete": "حذف المكاتب",
  "offices.manageMembers": "إدارة أعضاء المكتب",
  "distribution.manage": "إدارة قواعد التوزيع",
  "registrations.read": "عرض طلبات التسجيل",
  "registrations.approve": "الموافقة على طلبات التسجيل",
  "lands.evaluate": "تقييم الأراضي",
  "lands.comparables.manage": "إدارة الأراضي المقارنة",
  "feasibility.run": "تشغيل دراسة الجدوى",
  "feasibility.templates.manage": "إدارة قوالب دراسة الجدوى",
  "subscriptions.read": "عرض الاشتراكات",
  "subscriptions.manage": "إدارة الاشتراكات",
  "savedSearches.manage": "إدارة عمليات البحث المحفوظة",
  "joinApplications.read": "عرض طلبات الانضمام",
  "joinApplications.manage": "إدارة طلبات الانضمام",
};

const permissionActionLabels = {
  read: "عرض",
  create: "إضافة",
  update: "تعديل",
  delete: "حذف",
  manage: "إدارة",
  export: "تصدير",
  assign: "تعيين",
  message: "إرسال رسائل",
  calculate: "حساب",
  redeem: "استبدال",
  approve: "موافقة",
  evaluate: "تقييم",
  run: "تشغيل",
  managePermissions: "إدارة الصلاحيات",
  manageMembers: "إدارة الأعضاء",
  manageRules: "إدارة القواعد",
  manageTemplates: "إدارة القوالب",
};

export const getPermissionResourceLabel = (resource) => {
  if (!resource) return "";
  if (permissionResourceLabels[resource]) return permissionResourceLabels[resource];

  const nested = resource
    .split(".")
    .map((part) => permissionResourceLabels[part])
    .filter(Boolean);

  return nested.length ? nested.join(" - ") : resource;
};

export const getPermissionLabel = (permissionKey) => {
  if (!permissionKey) return "";
  if (permissionKeyLabels[permissionKey]) return permissionKeyLabels[permissionKey];

  const parts = permissionKey.split(".");
  const action = parts[parts.length - 1];
  const resource = parts.slice(0, -1).join(".") || parts[0];
  const resourceLabel = getPermissionResourceLabel(resource);
  const actionLabel = permissionActionLabels[action];

  if (resourceLabel && actionLabel) return `${actionLabel} ${resourceLabel}`;
  return permissionKey;
};

export const inputClasses =
  "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition-all duration-300 focus:bg-white/10 focus:border-emerald-500/50 focus:shadow-[0_0_20px_rgba(16,185,129,0.15)]";

export const labelClasses = "block mb-2 text-sm font-medium text-slate-300";


