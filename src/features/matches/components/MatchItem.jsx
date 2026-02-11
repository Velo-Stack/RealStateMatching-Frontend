import { Buildings, Target } from "phosphor-react";

const MatchItem = ({ row, type }) => {
  if (type === "offer") {
    return (
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 flex items-center justify-center shrink-0">
          <Buildings size={18} className="text-emerald-400" />
        </div>
        <div>
          <p className="text-sm text-white font-medium">
            {row.offer?.type || "غير محدد"}
          </p>
          <p className="text-xs text-slate-500">
            {row.offer?.city} -{" "}
            {row.offer?.priceFrom
              ? Number(row.offer.priceFrom).toLocaleString() + " ج.م"
              : ""}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-violet-500/20 flex items-center justify-center shrink-0">
        <Target size={18} className="text-cyan-400" />
      </div>
      <div>
        <p className="text-sm text-white font-medium">
          {row.request?.type || "غير محدد"}
        </p>
        <p className="text-xs text-slate-500">
          {row.request?.city} -{" "}
          {row.request?.budgetFrom
            ? Number(row.request.budgetFrom).toLocaleString() + " ج.م"
            : ""}
        </p>
      </div>
    </div>
  );
};

export default MatchItem;
