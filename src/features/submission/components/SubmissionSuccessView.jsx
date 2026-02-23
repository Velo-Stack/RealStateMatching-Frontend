import { motion as Motion } from "framer-motion";
import { ArrowCounterClockwise, CheckCircle } from "phosphor-react";

const SubmissionSuccessView = ({ onReset }) => (
  <Motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.4 }}
    className="text-center space-y-6 py-8"
  >
    <Motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", duration: 0.6, delay: 0.1 }}
    >
      <CheckCircle
        size={80}
        weight="duotone"
        className="text-emerald-400 mx-auto"
      />
    </Motion.div>
    <div className="space-y-2">
      <h2 className="text-2xl font-bold text-white">تم الإرسال بنجاح!</h2>
      <p className="text-slate-400 text-sm">
        تم إرسال البيانات بنجاح وسيتم مراجعتها في أقرب وقت
      </p>
    </div>
    <Motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onReset}
      className="inline-flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-6 py-3 text-sm font-medium text-white hover:bg-white/10 transition-all"
    >
      <ArrowCounterClockwise size={18} />
      إضافة بيانات جديدة
    </Motion.button>
  </Motion.div>
);

export default SubmissionSuccessView;


