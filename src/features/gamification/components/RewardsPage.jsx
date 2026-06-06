import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Gift } from "phosphor-react";
import { useAuth } from "../../../context/AuthContext";
import { useFeatureFlags } from "../../../hooks/useFeatureFlags";
import { hasPermission } from "../../../utils/rbac";
import RewardsCatalog from "./RewardsCatalog";
import { fetchMyPoints, fetchRewards, redeemRewardApi } from "../services/gamificationApi";

const RewardsPage = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { isFeatureEnabled } = useFeatureFlags();
  const enabled = isFeatureEnabled("broker_points.enabled");
  const canRedeem = hasPermission(user, "brokers.rewards.redeem");

  const { data: pointsData } = useQuery({
    queryKey: ["my-points-balance"],
    queryFn: () => fetchMyPoints({ limit: 1 }),
    enabled: enabled && canRedeem,
  });

  const { data: rewards = [], isLoading } = useQuery({
    queryKey: ["broker-rewards"],
    queryFn: fetchRewards,
    enabled: enabled && canRedeem,
  });

  const redeem = useMutation({
    mutationFn: (rewardId) => redeemRewardApi(rewardId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-points"] });
      queryClient.invalidateQueries({ queryKey: ["my-points-balance"] });
      queryClient.invalidateQueries({ queryKey: ["my-tier"] });
      queryClient.invalidateQueries({ queryKey: ["broker-rewards"] });
    },
  });

  if (!enabled) {
    return (
      <div className="p-6 text-center text-slate-400">
        نظام المكافآت غير مفعّل حالياً.
      </div>
    );
  }

  if (!canRedeem) {
    return (
      <div className="p-6 text-center text-slate-400">
        ليس لديك صلاحية استبدال المكافآت.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 text-white">
          <Gift size={24} className="text-emerald-400" />
          <h1 className="text-2xl font-bold">المكافآت</h1>
        </div>
        <p className="text-slate-400 text-sm mt-1">
          رصيدك: {pointsData?.balance ?? 0} نقطة — استبدل نقاطك بمكافآت حصرية
        </p>
      </div>

      {isLoading ? (
        <div className="text-slate-400 text-sm">جاري التحميل...</div>
      ) : (
        <RewardsCatalog
          rewards={rewards}
          balance={pointsData?.balance ?? 0}
          redeemingId={redeem.isPending ? redeem.variables : null}
          onRedeem={(reward) => {
            if (window.confirm(`استبدال "${reward.title}" مقابل ${reward.pointsCost} نقطة؟`)) {
              redeem.mutate(reward.id);
            }
          }}
        />
      )}

      {redeem.isError ? (
        <p className="text-rose-400 text-sm">
          {redeem.error?.response?.data?.message || "تعذر استبدال المكافأة"}
        </p>
      ) : null}
      {redeem.isSuccess ? (
        <p className="text-emerald-400 text-sm">تم إرسال طلب الاستبدال — بانتظار الموافقة</p>
      ) : null}
    </div>
  );
};

export default RewardsPage;
