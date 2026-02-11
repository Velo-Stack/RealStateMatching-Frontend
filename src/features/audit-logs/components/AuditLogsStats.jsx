const AuditLogsStats = ({ stats }) => (
  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
    <div className="bg-[#111827]/60 backdrop-blur-xl rounded-xl border border-white/5 p-4">
      <p className="text-xs text-slate-500 mb-1">إجمالي العمليات</p>
      <p className="text-2xl font-bold text-white">{stats.total}</p>
    </div>
    <div className="bg-[#111827]/60 backdrop-blur-xl rounded-xl border border-emerald-500/20 p-4">
      <p className="text-xs text-emerald-400/70 mb-1">إنشاء</p>
      <p className="text-2xl font-bold text-emerald-400">{stats.creates}</p>
    </div>
    <div className="bg-[#111827]/60 backdrop-blur-xl rounded-xl border border-amber-500/20 p-4">
      <p className="text-xs text-amber-400/70 mb-1">تحديث</p>
      <p className="text-2xl font-bold text-amber-400">{stats.updates}</p>
    </div>
    <div className="bg-[#111827]/60 backdrop-blur-xl rounded-xl border border-red-500/20 p-4">
      <p className="text-xs text-red-400/70 mb-1">حذف</p>
      <p className="text-2xl font-bold text-red-400">{stats.deletes}</p>
    </div>
  </div>
);

export default AuditLogsStats;
