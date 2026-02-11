import { motion } from "framer-motion";
import { Plus } from "phosphor-react";

const UsersHeader = ({ openCreateModal }) => (
  <div className="flex items-center justify-between">
    <div>
      <p className="text-slate-400 text-sm">إدارة المستخدمين والصلاحيات في النظام</p>
    </div>
    <motion.button
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      type="button"
      onClick={openCreateModal}
      className="theme-button-white inline-flex items-center gap-2 rounded-xl bg-gradient-to-l from-emerald-500 to-cyan-500 text-white text-sm font-semibold px-5 py-2.5 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-300"
    >
      <Plus size={20} weight="bold" />
      إنشاء مستخدم جديد
    </motion.button>
  </div>
);

export default UsersHeader;
