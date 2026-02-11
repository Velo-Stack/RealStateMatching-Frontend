import { motion } from "framer-motion";

const DashboardHeader = ({ title, subtitle, children }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    className="mb-6"
  >
    <h1 className="text-2xl font-bold text-white">{title}</h1>
    {subtitle && <p className="text-slate-400 text-sm mt-1">{subtitle}</p>}
    {children}
  </motion.div>
);

export default DashboardHeader;
