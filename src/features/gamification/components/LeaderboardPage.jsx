import { useQuery } from "@tanstack/react-query";
import { Crown } from "phosphor-react";
import { useAuth } from "../../../context/AuthContext";
import { useFeatureFlags } from "../../../hooks/useFeatureFlags";
import { hasPermission } from "../../../utils/rbac";
import { resolveAvatarUrl } from "../../../utils/uploads";
import BrokerTierBadge from "./BrokerTierBadge";
import { fetchLeaderboard } from "../services/gamificationApi";
import { formatPoints } from "../utils/gamificationFormatters";

const LeaderboardPage = () => {
  const { user } = useAuth();
  const { isFeatureEnabled } = useFeatureFlags();
  const enabled = isFeatureEnabled("broker_points.enabled");
  const canRead = hasPermission(user, "brokers.points.read");

  const { data: rows = [], isLoading } = useQuery({
    queryKey: ["broker-leaderboard"],
    queryFn: () => fetchLeaderboard(20),
    enabled: enabled && canRead,
  });

  if (!enabled) {
    return (
      <div className="p-6 text-center text-slate-400">
        لوحة المتصدرين غير مفعّلة حالياً.
      </div>
    );
  }

  if (!canRead) {
    return (
      <div className="p-6 text-center text-slate-400">
        ليس لديك صلاحية عرض لوحة المتصدرين.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 text-white">
          <Crown size={24} className="text-amber-400" />
          <h1 className="text-2xl font-bold">لوحة المتصدرين</h1>
        </div>
        <p className="text-slate-400 text-sm mt-1">ترتيب الوسطاء حسب إجمالي النقاط</p>
      </div>

      <div className="bg-[#111827]/60 backdrop-blur-xl rounded-2xl border border-white/5 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-slate-400 text-sm text-center">جاري التحميل...</div>
        ) : rows.length === 0 ? (
          <div className="p-8 text-slate-500 text-sm text-center">لا توجد بيانات بعد</div>
        ) : (
          <div className="divide-y divide-white/5">
            {rows.map((row) => (
              <div key={row.userId} className="flex items-center gap-4 p-4">
                <span className="w-8 text-center text-lg font-bold text-slate-400">
                  {row.rank}
                </span>
                <img
                  src={resolveAvatarUrl(row.user?.avatarUrl)}
                  alt={row.user?.name}
                  className="h-10 w-10 rounded-xl object-cover border border-white/10"
                  onError={(e) => {
                    e.currentTarget.src = "/assets/default-avatar.svg";
                  }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium truncate">{row.user?.name || "—"}</p>
                  {row.user?.brokerTier ? (
                    <div className="mt-1">
                      <BrokerTierBadge tier={row.user.brokerTier} compact />
                    </div>
                  ) : null}
                </div>
                <span className="text-emerald-400 font-semibold">
                  {formatPoints(row.points)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaderboardPage;
