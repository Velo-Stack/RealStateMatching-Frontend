import { motion } from "framer-motion";
import { ArrowRight } from "phosphor-react";
import { LOGIN_TEXT } from "../constants/loginConstants";

const SubmitButton = ({ submitting }) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    type="submit"
    disabled={submitting}
    className="relative w-full mt-2 overflow-hidden rounded-xl text-sm font-bold py-4 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed group bg-slate-200 text-slate-900 border border-slate-400/35 shadow-[0_8px_20px_rgba(17,24,39,0.12)] hover:bg-slate-300 hover:shadow-[0_12px_26px_rgba(17,24,39,0.2)] dark:bg-slate-700 dark:text-slate-100 dark:border-slate-500/35 dark:shadow-[0_8px_20px_rgba(15,23,42,0.45)] dark:hover:bg-slate-600 dark:hover:shadow-[0_12px_26px_rgba(15,23,42,0.6)]"
  >
    <span className="relative z-10 flex items-center justify-center gap-2">
      {submitting ? (
        <>
          <motion.span
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-5 h-5 border-2 border-slate-400/30 border-t-slate-700 rounded-full"
          />
          {LOGIN_TEXT.submittingLabel}
        </>
      ) : (
        <>
          {LOGIN_TEXT.submitLabel}
          <ArrowRight size={18} className="group-hover:-translate-x-1 transition-transform" />
        </>
      )}
    </span>
    <div className="absolute inset-0 bg-gradient-to-l from-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
  </motion.button>
);

export default SubmitButton;
