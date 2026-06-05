import { Gift } from "phosphor-react";
import { formatPoints } from "../utils/gamificationFormatters";

const RewardsCatalog = ({ rewards = [], balance = 0, onRedeem, redeemingId = null }) => {
  if (!rewards.length) {
    return (
      <div className="text-center text-slate-500 text-sm py-8">
        لا توجد مكافآت متاحة حالياً
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {rewards.map((reward) => {
        const canAfford = balance >= reward.pointsCost;
        const outOfStock = reward.stock != null && reward.stock <= 0;
        const disabled = !canAfford || outOfStock || redeemingId === reward.id;

        return (
          <div
            key={reward.id}
            className="bg-[#111827]/60 backdrop-blur-xl rounded-2xl border border-white/5 p-5 flex flex-col"
          >
            <div className="flex items-start gap-3 mb-3">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                <Gift size={22} />
              </div>
              <div>
                <h3 className="text-white font-semibold">{reward.title}</h3>
                {reward.description ? (
                  <p className="text-slate-400 text-sm mt-1">{reward.description}</p>
                ) : null}
              </div>
            </div>

            <div className="mt-auto pt-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs text-slate-500">التكلفة</p>
                <p className="text-emerald-400 font-semibold">
                  {formatPoints(reward.pointsCost)} نقطة
                </p>
                {reward.stock != null ? (
                  <p className="text-xs text-slate-500 mt-1">المتبقي: {reward.stock}</p>
                ) : null}
              </div>
              <button
                type="button"
                disabled={disabled}
                onClick={() => onRedeem?.(reward)}
                className="px-4 py-2 rounded-xl text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                {redeemingId === reward.id ? "جاري..." : "استبدال"}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RewardsCatalog;
