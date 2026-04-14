import { ChartLineUp } from "phosphor-react";

const ReportsHeader = () => (
  <div className="flex items-center gap-4">
    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20">
      <ChartLineUp size={24} className="text-emerald-400" weight="duotone" />
    </div>
    <div>
      <p className="font-semibold text-white">تصدير التقارير</p>
      <p className="text-sm text-slate-500">
        اختر نوع التقرير والحقول المطلوبة قبل تحميل الملف
      </p>
    </div>
  </div>
);

export default ReportsHeader;
