import { Users as UsersIcon } from "phosphor-react";

const EmptyState = () => (
  <div className="bg-[#111827]/60 backdrop-blur-xl rounded-2xl border border-white/5 p-12 text-center">
    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-slate-700/50 to-slate-800/50 flex items-center justify-center">
      <UsersIcon size={32} className="text-slate-500" />
    </div>
    <p className="text-slate-400 text-sm">لا يوجد مستخدمين حتى الآن</p>
  </div>
);

export default EmptyState;
