import { Buildings, MapPin } from "phosphor-react";
import { getGapTimeText, getRelativeTimeText } from "../utils/offersUtils";
import { getPropertySubTypeLabel } from "../../../constants/enums";
import { getOfferCode } from "../../../utils/entityCodes";

const OfferItem = ({ offer, type, createdAt, prevCreatedAt }) => {
  if (type === "type") {
    return (
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 flex items-center justify-center">
          <Buildings size={16} className="text-emerald-400" />
        </div>
        <div className="min-w-0">
          <span className="block">{getPropertySubTypeLabel(offer.usage, offer.propertySubType)}</span>
          <span className="mt-1 inline-flex rounded-lg border border-emerald-500/25 bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-300">
            {getOfferCode(offer)}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="text-slate-400">
      <div className="flex items-center gap-1">
        <MapPin size={14} className="text-emerald-400" />
        <span>
          {offer.cityRel?.name || offer.city || "-"} - {offer.neighborhoodRel?.name || offer.district || "-"}
        </span>
      </div>
      <div className="mt-1 text-xs text-slate-500">
        تم الإنشاء: {getRelativeTimeText(createdAt)}
      </div>
      <div className="text-xs text-slate-600">
        الفارق عن العرض السابق: {getGapTimeText(createdAt, prevCreatedAt)}
      </div>
    </div>
  );
};

export default OfferItem;


