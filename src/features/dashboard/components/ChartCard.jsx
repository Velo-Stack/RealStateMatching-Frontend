import { motion } from "framer-motion";

const ChartCard = ({ title, subtitle, children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay }}
    className="bg-[#111827]/60 backdrop-blur-xl rounded-2xl border border-white/5 p-6"
  >
    <div className="flex items-center justify-between mb-6">
      <div>
        <h3 className="text-lg font-bold text-white mb-1">{title}</h3>
        {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
      </div>
    </div>
    {children}
  </motion.div>
);

export default ChartCard;
