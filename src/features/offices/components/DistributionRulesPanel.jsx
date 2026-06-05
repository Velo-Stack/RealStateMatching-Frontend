import { useQuery } from "@tanstack/react-query";
import { fetchDistributionRules } from "../services/officesApi";

const DistributionRulesPanel = ({ enabled }) => {
  const { data: rules = [], isLoading } = useQuery({
    queryKey: ["distribution-rules"],
    queryFn: fetchDistributionRules,
    enabled,
  });

  if (!enabled) {
    return <div className="text-slate-400 text-sm">توزيع الطلبات غير مفعّل.</div>;
  }

  if (isLoading) return <div className="text-slate-400 text-sm">جاري التحميل...</div>;

  return (
    <div className="bg-[#111827]/60 rounded-2xl border border-white/5 overflow-hidden">
      <div className="p-5 border-b border-white/5">
        <h2 className="text-lg font-semibold text-white">قواعد توزيع الطلبات</h2>
        <p className="text-slate-400 text-sm mt-1">يتم تطبيق القواعد حسب الأولوية عند إنشاء طلب جديد</p>
      </div>
      <div className="divide-y divide-white/5">
        {rules.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-sm">لا توجد قواعد — شغّل seed:distribution-rules</div>
        ) : (
          rules.map((rule) => (
            <div key={rule.id} className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <p className="text-white font-medium">{rule.name}</p>
                <p className="text-xs text-slate-500 mt-1">
                  أولوية {rule.priority}
                  {rule.propertyType ? ` · ${rule.propertyType}` : ""}
                  {rule.teamType ? ` · ${rule.teamType}` : ""}
                  {rule.targetTeam?.name ? ` → ${rule.targetTeam.name}` : ""}
                </p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${rule.isActive ? "bg-emerald-500/10 text-emerald-400" : "bg-slate-500/10 text-slate-400"}`}>
                {rule.isActive ? "نشط" : "موقوف"}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DistributionRulesPanel;
