import { ChartLineUp } from "phosphor-react";

const ReportsHeader = () => (
  <div className="flex items-center gap-4">
    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 flex items-center justify-center">
      <ChartLineUp size={24} className="text-emerald-400" weight="duotone" />
    </div>
    <div>
      <p className="text-white font-semibold">تصدير التقارير</p>
      <p className="text-sm text-slate-500">تحميل بيانات النظام بصيغ مختلفة</p>
    </div>
  </div>
);

export default ReportsHeader;
