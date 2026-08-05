import { motion } from "framer-motion";
import { ArrowRight } from "phosphor-react";
import { LOGIN_TEXT } from "../constants/loginConstants";

const SubmitButton = ({ submitting }) => (
  <motion.button
    whileHover={{ scale: 1.015, y: -1 }}
    whileTap={{ scale: 0.98 }}
    type="submit"
    disabled={submitting}
    className="group relative mt-4 flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl py-3.5 text-base font-bold text-[#1c1408] bg-gradient-to-r from-[#e7c25a] via-[#d4af37] to-[#b8962e] shadow-md shadow-[#d4af37]/20 transition-all duration-300 hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
  >
    <span className="relative z-10 flex items-center justify-center gap-2">
      {submitting ? (
        <>
          <motion.span
            animate={{ rotate: 360 }}
            transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
            className="h-5 w-5 rounded-full border-2 border-[#1c1408]/25 border-t-[#1c1408]"
          />
          {LOGIN_TEXT.submittingLabel}
        </>
      ) : (
        <>
          {LOGIN_TEXT.submitLabel}
          <ArrowRight size={19} className="transition-transform group-hover:-translate-x-1" />
        </>
      )}
    </span>
    <div className="absolute inset-0 bg-gradient-to-l from-white/25 to-white/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
  </motion.button>
);

export default SubmitButton;
