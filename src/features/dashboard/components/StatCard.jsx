import { motion } from "framer-motion";
import { ArrowDown, ArrowUp } from "phosphor-react";

const StatCard = ({
  label,
  value,
  icon: Icon,
  trend,
  trendValue,
  delay = 0,
  gradient,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay }}
    whileHover={{ y: -4, scale: 1.02 }}
    className="relative overflow-hidden bg-[#111827]/60 backdrop-blur-xl rounded-2xl border border-white/5 p-6 group cursor-pointer"
  >
    <div
      className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br ${gradient}`}
    />

    <div className="relative flex items-start justify-between mb-4">
      <div
        className={`h-12 w-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white shadow-lg`}
      >
        <Icon size={24} weight="duotone" />
      </div>
      {trend && (
        <div
          className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-lg ${
            trend === "up"
              ? "bg-emerald-500/10 text-emerald-400"
              : "bg-red-500/10 text-red-400"
          }`}
        >
          {trend === "up" ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
          {trendValue}%
        </div>
      )}
    </div>

    <h3 className="relative text-3xl font-bold text-white mb-1">{value}</h3>
    <p className="relative text-sm text-slate-400">{label}</p>
  </motion.div>
);

export default StatCard;
