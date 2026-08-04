import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import {
  X,
  EnvelopeSimple,
  Phone,
  ShieldCheck,
  CalendarBlank,
  Key,
  Shield,
  CheckCircle,
  User,
  House,
  FileText,
  ArrowsLeftRight,
  Users as UsersIcon,
  UsersThree,
  ChatTeardropText,
  Bell,
  SquaresFour,
  ChartBar,
  ClockCounterClockwise,
  MapPin,
  Database,
  Globe,
  Link as LinkIcon,
  UploadSimple,
  SlidersHorizontal,
  Calculator,
  Trophy,
  Buildings,
  TreeStructure,
  UserPlus,
  MapTrifold,
  TrendUp,
  CreditCard,
  MagnifyingGlass,
  Sparkle,
  SpinnerGap
} from "phosphor-react";
import {
  roleConfig,
  statusConfig,
  getPermissionLabel,
  getPermissionResourceLabel,
} from "../constants/usersConstants";
import { USERS_QUERY_KEYS } from "../../../shared/query/queryKeys";
import { fetchUserPermissionsApi } from "../services/usersApi";
import { getPermissionKeys } from "../../../utils/rbac";

const resourceIconMap = {
  offers: House,
  requests: FileText,
  matches: ArrowsLeftRight,
  users: UsersIcon,
  teams: UsersThree,
  conversations: ChatTeardropText,
  notifications: Bell,
  dashboard: SquaresFour,
  reports: ChartBar,
  auditLogs: ClockCounterClockwise,
  locations: MapPin,
  meta: Database,
  website: Globe,
  submissionLinks: LinkIcon,
  uploads: UploadSimple,
  featureFlags: SlidersHorizontal,
  tools: Calculator,
  brokers: Trophy,
  offices: Buildings,
  distribution: TreeStructure,
  registrations: UserPlus,
  lands: MapTrifold,
  feasibility: TrendUp,
  subscriptions: CreditCard,
  savedSearches: MagnifyingGlass,
  joinApplications: UserPlus,
};

const scopeLabelMap = {
  OWN: { label: "بياناته فقط", bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/20" },
  TEAM: { label: "الفريق", bg: "bg-purple-500/10", text: "text-purple-400", border: "border-purple-500/20" },
  ALL: { label: "الكل", bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20" },
};

const UserViewModal = ({ isOpen, onClose, user }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [permSearch, setPermSearch] = useState("");

  const { data: permData, isLoading: isPermsLoading } = useQuery({
    queryKey: USERS_QUERY_KEYS.userPermissions(user?.id),
    queryFn: () => fetchUserPermissionsApi(user.id),
    enabled: Boolean(user?.id && isOpen),
  });

  const effectivePermissions = useMemo(() => {
    if (permData?.effectivePermissions && Array.isArray(permData.effectivePermissions)) {
      return permData.effectivePermissions;
    }
    if (user?.permissionMode === "CUSTOM" && Array.isArray(user?.permissions) && user.permissions.length > 0) {
      return user.permissions.map((p) => (typeof p === "string" ? { key: p, scope: null } : p));
    }
    const fallbackKeys = getPermissionKeys(user);
    return fallbackKeys.map((key) => ({ key, scope: null }));
  }, [permData, user]);

  const groupedPermissions = useMemo(() => {
    const groups = {};
    effectivePermissions.forEach((item) => {
      const key = typeof item === "string" ? item : item.key;
      const scope = typeof item === "object" ? item.scope : null;
      if (!key) return;

      const resource = key.split(".")[0];
      const label = getPermissionLabel(key);

      if (permSearch.trim()) {
        const query = permSearch.toLowerCase();
        const resLabel = getPermissionResourceLabel(resource).toLowerCase();
        if (!label.toLowerCase().includes(query) && !key.toLowerCase().includes(query) && !resLabel.includes(query)) {
          return;
        }
      }

      if (!groups[resource]) {
        groups[resource] = [];
      }
      groups[resource].push({ key, scope, label });
    });
    return groups;
  }, [effectivePermissions, permSearch]);

  if (!user) return null;

  const role = roleConfig[user.role] || roleConfig["BROKER"];
  const status = statusConfig[user.status] || statusConfig["ACTIVE"];
  const permissionMode = permData?.user?.permissionMode || user.permissionMode || "ROLE_DEFAULT";

  const getModeBadge = () => {
    if (permissionMode === "ROLE_DEFAULT") {
      return { label: "افتراضية للدور", bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/30" };
    }
    if (permissionMode === "CUSTOM") {
      return { label: "صلاحيات مخصصة", bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/30" };
    }
    return { label: "بدون صلاحيات", bg: "bg-rose-500/10", text: "text-rose-400", border: "border-rose-500/30" };
  };

  const modeBadge = getModeBadge();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 transition-opacity"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] max-w-3xl bg-[#111827]/80 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl z-50 overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header Banner */}
            <div className="relative p-6 border-b border-white/10 bg-[#111827]/60">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    {user.avatarUrl ? (
                      <img
                        src={user.avatarUrl}
                        alt={user.name}
                        className="h-14 w-14 rounded-2xl object-cover border-2 border-white/10 shadow-md"
                      />
                    ) : (
                      <div className={`h-14 w-14 rounded-2xl flex items-center justify-center font-bold text-xl ${role.bg} ${role.text} border ${role.border} shadow-inner`}>
                        {user.name?.[0]?.toUpperCase() || <User size={28} />}
                      </div>
                    )}
                    <span className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-[#111827] ${user.status === "ACTIVE" ? "bg-emerald-500" : "bg-amber-500"}`} />
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-white tracking-wide">{user.name}</h3>
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      <span className={`px-2.5 py-0.5 rounded-lg text-xs font-semibold border ${role.bg} ${role.text} ${role.border}`}>
                        {role.label}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-lg text-xs font-semibold border ${status.bg} ${status.text} border-white/5`}>
                        {status.label}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-lg text-xs font-semibold border ${modeBadge.bg} ${modeBadge.text} ${modeBadge.border}`}>
                        {modeBadge.label}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className="h-9 w-9 flex items-center justify-center rounded-xl text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/5 transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Navigation Tabs */}
              <div className="flex items-center gap-2 mt-6 border-b border-white/5 pb-1">
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                    activeTab === "overview"
                      ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-sm"
                      : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                  }`}
                >
                  <User size={16} />
                  البيانات الحسابية
                </button>
                <button
                  onClick={() => setActiveTab("permissions")}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                    activeTab === "permissions"
                      ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-sm"
                      : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                  }`}
                >
                  <Key size={16} />
                  الصلاحيات الفعالة ({effectivePermissions.length})
                </button>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6">
              {activeTab === "overview" && (
                <div className="space-y-6">
                  {/* General Info Grid */}
                  <div>
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <EnvelopeSimple size={16} className="text-emerald-400" />
                      معلومات التواصل والتعريف
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-[#111827]/60 border border-white/5 rounded-2xl p-4 transition-all hover:border-white/10">
                        <span className="text-xs text-slate-400">البريد الإلكتروني</span>
                        <p className="text-sm font-semibold text-white mt-1 break-all">{user.email || "غير محدد"}</p>
                      </div>

                      <div className="bg-[#111827]/60 border border-white/5 rounded-2xl p-4 transition-all hover:border-white/10">
                        <span className="text-xs text-slate-400 flex items-center gap-1.5">
                          <Phone size={14} className="text-emerald-400" />
                          رقم الهاتف
                        </span>
                        <p className="text-sm font-semibold text-white mt-1 dir-ltr text-right">{user.phone || "غير محدد"}</p>
                      </div>
                    </div>
                  </div>

                  {/* System Metadata */}
                  <div>
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <ShieldCheck size={16} className="text-cyan-400" />
                      معلومات النظام والحالة
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-[#111827]/60 border border-white/5 rounded-2xl p-4 transition-all hover:border-white/10">
                        <span className="text-xs text-slate-400 flex items-center gap-1.5">
                          <CalendarBlank size={14} className="text-cyan-400" />
                          تاريخ الانضمام
                        </span>
                        <p className="text-sm font-semibold text-white mt-1">
                          {user.createdAt ? new Date(user.createdAt).toLocaleDateString("ar-EG", { year: 'numeric', month: 'long', day: 'numeric' }) : "غير متوفر"}
                        </p>
                      </div>

                      <div className="bg-[#111827]/60 border border-white/5 rounded-2xl p-4 transition-all hover:border-white/10">
                        <span className="text-xs text-slate-400 flex items-center gap-1.5">
                          <Shield size={14} className="text-amber-400" />
                          معرف المستخدم (ID)
                        </span>
                        <p className="text-xs font-mono text-slate-300 mt-1 truncate">{user.id}</p>
                      </div>
                    </div>
                  </div>

                  {/* Summary Card */}
                  <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                        <Sparkle size={20} weight="duotone" />
                      </div>
                      <div>
                        <h5 className="text-sm font-bold text-white">إجمالي الصلاحيات الفعالة</h5>
                        <p className="text-xs text-slate-400 mt-0.5">يتم تطبيق هذه الصلاحيات تلقائياً بناءً على نمط الحساب</p>
                      </div>
                    </div>
                    <span className="text-2xl font-black text-emerald-400 px-3">{effectivePermissions.length}</span>
                  </div>
                </div>
              )}

              {activeTab === "permissions" && (
                <div className="space-y-5">
                  {/* Search and Header Info */}
                  <div className="flex items-center gap-3 flex-wrap justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-400">نمط الصلاحيات:</span>
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${modeBadge.bg} ${modeBadge.text} ${modeBadge.border}`}>
                        {permissionMode === "ROLE_DEFAULT" ? `افتراضية للدور (${role.label})` : modeBadge.label}
                      </span>
                    </div>

                    <div className="relative min-w-[200px] flex-1 max-w-xs">
                      <MagnifyingGlass size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        value={permSearch}
                        onChange={(e) => setPermSearch(e.target.value)}
                        placeholder="بحث في الصلاحيات..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-1.5 pr-9 pl-3 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500/50 transition-all"
                      />
                    </div>
                  </div>

                  {isPermsLoading ? (
                    <div className="flex flex-col items-center justify-center py-12 text-slate-400 gap-3">
                      <SpinnerGap size={32} className="animate-spin text-emerald-400" />
                      <span className="text-xs">جاري جلب الصلاحيات الفعالة من السيرفر...</span>
                    </div>
                  ) : Object.keys(groupedPermissions).length === 0 ? (
                    <div className="text-center py-10 bg-[#111827]/40 border border-white/5 rounded-2xl p-6">
                      <ShieldCheck size={36} className="mx-auto text-slate-500 mb-2" />
                      <p className="text-sm text-slate-400">لا توجد صلاحيات مطابقة للبحث أو لهذا النمط.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {Object.entries(groupedPermissions).map(([resource, items]) => {
                        const IconComp = resourceIconMap[resource] || ShieldCheck;
                        const resourceName = getPermissionResourceLabel(resource);

                        return (
                          <div
                            key={resource}
                            className="bg-[#111827]/60 border border-white/10 rounded-2xl p-4 transition-all duration-300 hover:border-white/20"
                          >
                            <div className="flex items-center justify-between mb-3 border-b border-white/5 pb-2.5">
                              <div className="flex items-center gap-2.5">
                                <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                                  <IconComp size={18} weight="duotone" />
                                </div>
                                <h5 className="text-sm font-bold text-white">{resourceName}</h5>
                              </div>
                              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-white/5 text-slate-400 border border-white/5">
                                {items.length} صلاحيات
                              </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {items.map((perm) => {
                                const scopeInfo = perm.scope ? scopeLabelMap[perm.scope] : null;

                                return (
                                  <div
                                    key={perm.key}
                                    className="flex items-center justify-between bg-[#111827]/40 border border-white/5 rounded-xl px-3 py-2 text-xs text-slate-200"
                                  >
                                    <div className="flex items-center gap-2 min-w-0">
                                      <CheckCircle size={15} className="text-emerald-400 shrink-0" weight="fill" />
                                      <span className="truncate font-medium text-slate-200">{perm.label}</span>
                                    </div>
                                    {scopeInfo && (
                                      <span className={`shrink-0 px-2 py-0.5 text-[10px] font-bold rounded-md border ${scopeInfo.bg} ${scopeInfo.text} ${scopeInfo.border}`}>
                                        {scopeInfo.label}
                                      </span>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-white/10 bg-[#111827]/80 backdrop-blur-md flex items-center justify-between">
              <span className="text-xs text-slate-400">منصة راسخ — إدارة المستخدمين والتحكم بالصلاحيات</span>
              <button
                onClick={onClose}
                className="px-6 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold transition-all border border-white/10"
              >
                إغلاق
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default UserViewModal;
