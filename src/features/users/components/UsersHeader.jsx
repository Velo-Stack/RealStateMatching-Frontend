import { motion } from "framer-motion";
import { Plus, ShieldCheck } from "phosphor-react";

const UsersHeader = ({
  openCreateModal,
  openRolePermissions,
  canCreateUser,
  canManagePermissions,
  canManageRolePermissions = false,
}) => (
  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
    <div>
      <p className="text-slate-400 text-sm">إدارة المستخدمين والصلاحيات في النظام</p>
    </div>
    <div className="flex flex-wrap items-center gap-2">
      {canManageRolePermissions && (
      <motion.button
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        type="button"
        onClick={openRolePermissions}
        className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-2.5 text-sm font-semibold text-emerald-300 transition-all duration-300 hover:bg-emerald-500/20"
      >
        <ShieldCheck size={20} weight="bold" />
        صلاحيات الأدوار
      </motion.button>
      )}
      {canCreateUser && (
      <motion.button
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        type="button"
        onClick={openCreateModal}
        className="theme-button-white inline-flex items-center gap-2 rounded-xl text-sm font-semibold px-5 py-2.5 transition-all duration-300"
      >
        <Plus size={20} weight="bold" />
        إنشاء مستخدم جديد
      </motion.button>
      )}
    </div>
  </div>
);

export default UsersHeader;
