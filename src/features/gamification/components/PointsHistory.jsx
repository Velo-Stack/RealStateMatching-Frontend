import { REASON_LABELS, formatPoints } from "../utils/gamificationFormatters";

const PointsHistory = ({ entries = [] }) => {
  if (!entries.length) {
    return (
      <div className="text-center text-slate-500 text-sm py-8">
        لا يوجد سجل نقاط بعد
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {entries.map((entry) => {
        const positive = entry.points >= 0;
        return (
          <div
            key={entry.id}
            className="flex items-center justify-between p-3 rounded-xl border border-white/5 bg-[#111827]/40"
          >
            <div>
              <p className="text-sm text-white">
                {REASON_LABELS[entry.reason] || entry.reason}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                {new Date(entry.createdAt).toLocaleString("ar-SA")}
              </p>
              {entry.note ? (
                <p className="text-xs text-slate-400 mt-1">{entry.note}</p>
              ) : null}
            </div>
            <span
              className={`text-sm font-semibold ${positive ? "text-emerald-400" : "text-rose-400"}`}
            >
              {positive ? "+" : ""}
              {formatPoints(entry.points)}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default PointsHistory;
