import { motion as Motion } from "framer-motion";
import { Buildings, MagnifyingGlass } from "phosphor-react";

const SubmissionLandingView = ({ onSelectOffer, onSelectRequest }) => (
  <Motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.4 }}
    className="text-center space-y-8"
  >
    <div className="space-y-3">
      <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-l from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/25">
        <Buildings size={32} weight="duotone" className="text-white" />
      </div>
      <h1 className="text-2xl font-bold text-white">نظام إدارة العقارات</h1>
      <p className="text-slate-400 text-sm">
        استخدم هذه الصفحة لإضافة عرض عقاري أو طلب جديد
      </p>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <Motion.button
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        onClick={onSelectOffer}
        className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 text-right transition-all duration-300 hover:border-emerald-500/30 hover:bg-emerald-500/10"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-l from-emerald-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4">
          <Buildings size={24} weight="duotone" className="text-emerald-400" />
        </div>
        <h3 className="font-bold text-white mb-1">إضافة عرض</h3>
        <p className="text-xs text-slate-400">أضف عرض عقاري جديد للنظام</p>
      </Motion.button>

      <Motion.button
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        onClick={onSelectRequest}
        className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 text-right transition-all duration-300 hover:border-violet-500/30 hover:bg-violet-500/5"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-l from-violet-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="w-12 h-12 rounded-xl bg-violet-500/10 flex items-center justify-center mb-4">
          <MagnifyingGlass
            size={24}
            weight="duotone"
            className="text-violet-400"
          />
        </div>
        <h3 className="font-bold text-white mb-1">إضافة طلب</h3>
        <p className="text-xs text-slate-400">أضف طلب عقاري جديد للنظام</p>
      </Motion.button>
    </div>
  </Motion.div>
);

export default SubmissionLandingView;


