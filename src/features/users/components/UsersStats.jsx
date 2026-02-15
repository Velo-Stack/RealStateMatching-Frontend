import { motion } from "framer-motion";
import { roleConfig } from "../constants/usersConstants";

const UsersStats = ({ usersByRole }) => (
  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
    {Object.entries(roleConfig).map(([role, config], index) => {
      const Icon = config.icon;
      const count = usersByRole[role]?.length || 0;

      return (
        <motion.div
          key={role}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-[#111827]/60 backdrop-blur-xl rounded-xl border border-white/5 p-5"
        >
          <div className="flex items-center justify-between mb-3">
            <div
              className={`h-10 w-10 rounded-xl ${config.bg} border ${config.border} flex items-center justify-center`}
            >
              <Icon size={20} className={config.text} weight="duotone" />
            </div>
            <span className={`text-2xl font-bold ${config.text}`}>{count}</span>
          </div>
          <p className="text-sm text-slate-400">{config.label}</p>
        </motion.div>
      );
    })}
  </div>
);

export default UsersStats;
