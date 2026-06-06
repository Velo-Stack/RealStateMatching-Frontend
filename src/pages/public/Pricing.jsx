import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { fetchPublicPlans } from "../../features/subscriptions/services/subscriptionsApi";

const Pricing = () => {
  const { data: plans = [], isLoading } = useQuery({
    queryKey: ["public-plans"],
    queryFn: fetchPublicPlans,
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-slate-900 mb-3">خطط الأسعار</h1>
        <p className="text-slate-600">اختر الخطة المناسبة لاحتياجاتك العقارية</p>
      </div>

      {isLoading ? (
        <p className="text-center text-slate-500">جاري التحميل...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.filter((p) => p.code !== "ENTERPRISE").map((plan) => (
            <div key={plan.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold text-slate-900">{plan.nameAr}</h3>
              <p className="text-3xl font-bold text-emerald-600 mt-4">
                {plan.priceMonthly > 0 ? `${plan.priceMonthly} ر.س` : "مجاني"}
                {plan.priceMonthly > 0 && <span className="text-sm font-normal text-slate-500">/شهر</span>}
              </p>
              <ul className="mt-6 space-y-2 text-sm text-slate-600">
                <li>{plan.features?.maxOffers ? `${plan.features.maxOffers} عروض` : "عروض غير محدودة"}</li>
                <li>{plan.features?.maps ? "خرائط تفاعلية" : "بحث أساسي"}</li>
                <li>{plan.features?.advancedSearch ? "بحث متقدم" : "—"}</li>
              </ul>
              <Link
                to="/register"
                className="mt-6 block text-center py-2.5 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition-colors"
              >
                ابدأ الآن
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Pricing;
