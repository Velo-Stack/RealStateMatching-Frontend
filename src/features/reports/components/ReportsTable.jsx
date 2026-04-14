const ReportsTable = ({ selectedReport, selectedCount }) => (
  <div className="flex items-start gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10">
      <span className="text-lg text-emerald-400">i</span>
    </div>
    <div>
      <p className="mb-1 text-sm font-medium text-emerald-400">ملاحظة</p>
      <p className="text-xs text-slate-500">
        سيتم تصدير بيانات {selectedReport?.label} بالحقول المختارة فقط وعددها{" "}
        {selectedCount}. يمكنك الرجوع للحقول الأساسية في أي وقت.
      </p>
    </div>
  </div>
);

export default ReportsTable;
