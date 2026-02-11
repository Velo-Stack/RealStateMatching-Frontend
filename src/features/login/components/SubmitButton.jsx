import { motion } from "framer-motion";
import { ArrowRight } from "phosphor-react";
import { LOGIN_TEXT } from "../constants/loginConstants";

const SubmitButton = ({ submitting }) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    type="submit"
    disabled={submitting}
    className="theme-button-white relative w-full mt-2 overflow-hidden rounded-xl bg-gradient-to-l from-emerald-500 to-cyan-500 text-white text-sm font-bold py-4 shadow-lg shadow-emerald-500/25 transition-all duration-300 hover:shadow-emerald-500/40 disabled:opacity-60 disabled:cursor-not-allowed group"
  >
    <span className="relative z-10 flex items-center justify-center gap-2">
      {submitting ? (
        <>
          <motion.span
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
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
    <div className="absolute inset-0 bg-gradient-to-l from-cyan-500 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
  </motion.button>
);

export default SubmitButton;
