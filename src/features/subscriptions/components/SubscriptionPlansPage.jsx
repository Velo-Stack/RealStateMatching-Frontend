import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Crown } from "phosphor-react";
import { useAuth } from "../../../context/AuthContext";
import { useFeatureFlags } from "../../../hooks/useFeatureFlags";
import useEntitlements from "../../../hooks/useEntitlements";
import {
  fetchPlans,
  fetchMySubscription,
  checkoutPlanApi,
  confirmMockPaymentApi,
} from "../services/subscriptionsApi";

const SubscriptionPlansPage = () => {
  const { refreshSession } = useAuth();
  const queryClient = useQueryClient();
  const { isFeatureEnabled } = useFeatureFlags();
  const { planCode } = useEntitlements();
  const enabled = isFeatureEnabled("subscriptions.enabled");

  const { data: plans = [] } = useQuery({
    queryKey: ["subscription-plans"],
    queryFn: fetchPlans,
    enabled,
  });

  const { data: me } = useQuery({
    queryKey: ["subscription-me"],
    queryFn: fetchMySubscription,
    enabled,
  });

  const checkout = useMutation({
    mutationFn: async (code) => {
      const session = await checkoutPlanApi(code);
      if (session.mockPaymentToken) {
        await confirmMockPaymentApi(session.mockPaymentToken);
      }
      return session;
    },
    onSuccess: async () => {
      await refreshSession();
      queryClient.invalidateQueries({ queryKey: ["subscription-me"] });
    },
  });

  if (!enabled) {
    return <div className="p-6 text-center text-slate-400">نظام الاشتراكات غير مفعّل</div>;
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <Crown size={24} className="text-amber-400" />
          خطط الاشتراك
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          خطتك الحالية: <span className="text-emerald-400">{planCode}</span>
          {me?.subscription?.currentPeriodEnd && (
            <span className="mr-2"> — ينتهي {new Date(me.subscription.currentPeriodEnd).toLocaleDateString("ar-SA")}</span>
          )}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`rounded-xl border p-5 space-y-4 ${
              plan.code === planCode
                ? "border-emerald-500/40 bg-emerald-500/5"
                : "border-white/10 bg-[#111827]/60"
            }`}
          >
            <div>
              <h3 className="text-lg font-bold text-slate-100">{plan.nameAr}</h3>
              <p className="text-2xl font-bold text-emerald-400 mt-2">
                {plan.priceMonthly > 0 ? `${plan.priceMonthly} ر.س/شهر` : plan.code === "ENTERPRISE" ? "حسب الطلب" : "مجاني"}
              </p>
            </div>
            <ul className="text-xs text-slate-400 space-y-1">
              <li>• {plan.features?.maxOffers ? `${plan.features.maxOffers} عروض` : "عروض غير محدودة"}</li>
              <li>• {plan.features?.maps ? "خرائط ✓" : "خرائط ✗"}</li>
              <li>• {plan.features?.advancedSearch ? "بحث متقدم ✓" : "بحث متقدم ✗"}</li>
              <li>• {plan.features?.calculator ? "حاسبة سعي ✓" : "حاسبة سعي ✗"}</li>
            </ul>
            {plan.code !== planCode && plan.code !== "ENTERPRISE" && (
              <button
                type="button"
                disabled={checkout.isPending}
                onClick={() => checkout.mutate(plan.code)}
                className="theme-button-primary w-full py-2 rounded-lg text-sm disabled:opacity-50"
              >
                {checkout.isPending ? "جاري..." : plan.priceMonthly > 0 ? "اشترك الآن" : "تفعيل مجاني"}
              </button>
            )}
            {plan.code === planCode && (
              <span className="block text-center text-xs text-emerald-400">الخطة الحالية</span>
            )}
          </div>
        ))}
      </div>

      {checkout.isError && (
        <p className="text-sm text-rose-400">{checkout.error?.response?.data?.message || "فشل الاشتراك"}</p>
      )}
    </div>
  );
};

export default SubscriptionPlansPage;
