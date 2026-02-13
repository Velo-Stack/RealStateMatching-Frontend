import { MapPin, Target } from "phosphor-react";
import { getGapTimeText, getRelativeTimeText } from "../utils/requestsUtils";

const RequestItem = ({ request, type, createdAt, prevCreatedAt }) => {
  if (type === "type") {
    return (
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 flex items-center justify-center">
          <Target size={16} className="text-cyan-400" />
        </div>
        <span>{request.type}</span>
      </div>
    );
  }

  return (
    <div className="text-slate-400">
      <div className="flex items-center gap-1">
        <MapPin size={14} className="text-emerald-400" />
        <span>
          {request.city} - {request.district}
        </span>
      </div>
      <div className="mt-1 text-xs text-slate-500">
        تم الإنشاء: {getRelativeTimeText(createdAt)}
      </div>
      <div className="text-xs text-slate-600">
        الفارق عن الطلب السابق: {getGapTimeText(createdAt, prevCreatedAt)}
      </div>
    </div>
  );
};

export default RequestItem;
