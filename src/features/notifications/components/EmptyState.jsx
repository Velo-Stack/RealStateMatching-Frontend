import { Bell } from "phosphor-react";

const EmptyState = () => (
  <div className="bg-[#111827]/60 backdrop-blur-xl rounded-2xl border border-white/5 p-12 text-center">
    <div className="w-20 h-20 mx-auto mb-4 rounded-3xl bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20 flex items-center justify-center">
      <Bell size={36} className="text-emerald-400" weight="duotone" />
    </div>
    <h3 className="text-lg font-semibold text-white mb-2">لا توجد تنبيهات</h3>
    <p className="text-slate-500 text-sm">
      ستظهر هنا جميع الإشعارات والتحديثات الجديدة
    </p>
  </div>
);

export default EmptyState;
