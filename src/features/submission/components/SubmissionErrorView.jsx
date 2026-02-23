import { motion as Motion } from "framer-motion";
import { WarningCircle } from "phosphor-react";

const SubmissionErrorView = ({ title, message }) => (
  <Motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    className="text-center space-y-4 py-8"
  >
    <WarningCircle size={64} weight="duotone" className="text-red-400 mx-auto" />
    <h2 className="text-xl font-bold text-white">{title}</h2>
    <p className="text-slate-400 text-sm">{message}</p>
  </Motion.div>
);

export default SubmissionErrorView;
