const ReportsTable = ({ selectedReport }) => (
  <div className="bg-cyan-500/5 border border-cyan-500/20 rounded-xl p-4 flex items-start gap-3">
    <div className="h-8 w-8 rounded-lg bg-cyan-500/10 flex items-center justify-center shrink-0 mt-0.5">
      <span className="text-cyan-400 text-lg">💡</span>
    </div>
    <div>
      <p className="text-sm text-cyan-400 font-medium mb-1">ملاحظة</p>
      <p className="text-xs text-slate-500">
        سيتم تصدير جميع بيانات {selectedReport?.label} المتاحة في النظام. قد يستغرق
        التصدير بعض الوقت حسب حجم البيانات.
      </p>
    </div>
  </div>
);

export default ReportsTable;
