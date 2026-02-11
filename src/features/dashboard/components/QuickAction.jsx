import { motion } from "framer-motion";

const QuickAction = ({ icon: Icon, title, subtitle, color, onClick }) => (
  <motion.button
    whileHover={{ scale: 1.02, y: -2 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className="flex items-center gap-4 bg-[#111827]/40 hover:bg-[#111827]/60 border border-white/5 hover:border-white/10 rounded-xl p-4 text-right transition-all duration-300 w-full"
  >
    <div
      className={`h-10 w-10 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center shrink-0`}
    >
      <Icon size={20} weight="duotone" className="text-white" />
    </div>
    <div className="flex-1">
      <h4 className="text-sm font-semibold text-white">{title}</h4>
      <p className="text-xs text-slate-500">{subtitle}</p>
    </div>
  </motion.button>
);

export default QuickAction;
