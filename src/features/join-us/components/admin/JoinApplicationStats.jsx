const BarChart = ({ title, data, labels }) => {
  const entries = Object.entries(data || {});
  const max = Math.max(...entries.map(([, v]) => v), 1);

  return (
    <div className="bg-[#111827]/60 rounded-2xl border border-white/5 p-5">
      <h3 className="text-white font-medium mb-4 text-sm">{title}</h3>
      {entries.length === 0 ? (
        <p className="text-slate-500 text-sm">لا توجد بيانات</p>
      ) : (
        <div className="space-y-3">
          {entries.map(([key, value]) => (
            <div key={key}>
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>{labels?.[key] || key}</span>
                <span>{value}</span>
              </div>
              <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                <div
                  className="h-full bg-emerald-500/70 rounded-full"
                  style={{ width: `${(value / max) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const StatCard = ({ label, value, accent = 'text-white' }) => (
  <div className="bg-[#111827]/60 rounded-2xl border border-white/5 p-5">
    <p className="text-slate-400 text-sm mb-1">{label}</p>
    <p className={`text-3xl font-bold ${accent}`}>{value}</p>
  </div>
);

const JoinApplicationStats = ({ stats }) => {
  if (!stats) return null;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard label="إجمالي الطلبات" value={stats.total} accent="text-emerald-400" />
        <StatCard label="قيد المراجعة" value={stats.pending} />
        <StatCard label="تمت المراجعة" value={stats.reviewed} />
        <StatCard label="مقبول" value={stats.accepted} accent="text-emerald-400" />
        <StatCard label="مرفوض" value={stats.rejected} accent="text-red-400" />
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        <BarChart
          title="رخصة فال"
          data={stats.falLicense}
          labels={{ yes: 'نعم', pending: 'قيد الإصدار', no: 'لا' }}
        />
        <BarChart title="سنوات الخبرة" data={stats.experienceYears} />
        <BarChart title="التخصصات" data={stats.specializations} />
      </div>
    </div>
  );
};

export default JoinApplicationStats;
