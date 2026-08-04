import { motion } from "framer-motion";
import { roleConfig } from "../constants/usersConstants";

const UsersStats = ({ usersByRole, filters, onFilterChange }) => (
  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
    {Object.entries(roleConfig).map(([role, config], index) => {
      const Icon = config.icon;
      const count = usersByRole[role]?.length || 0;
      const isSelected = filters?.role === role;

      return (
        <motion.div
          key={role}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          onClick={() => onFilterChange && onFilterChange({ ...filters, role: isSelected ? "" : role })}
          className={`backdrop-blur-xl rounded-xl border p-5 cursor-pointer transition-all duration-300 group
            ${
              isSelected 
                ? `${config.border} bg-white/10 shadow-[0_0_20px_rgba(255,255,255,0.05)] scale-105` 
                : 'border-white/5 bg-[#111827]/60 hover:bg-white/5 hover:border-white/20 hover:scale-105'
            }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div
              className={`h-10 w-10 rounded-xl ${config.bg} border ${config.border} flex items-center justify-center transition-transform duration-300 group-hover:scale-110 ${isSelected ? 'scale-110' : ''}`}
            >
              <Icon size={20} className={config.text} weight="duotone" />
            </div>
            <span className={`text-2xl font-bold ${config.text}`}>{count}</span>
          </div>
          <p className={`text-sm transition-colors duration-300 ${isSelected ? 'text-white' : 'text-slate-400 group-hover:text-slate-300'}`}>{config.label}</p>
        </motion.div>
      );
    })}
  </div>
);

export default UsersStats;
