import { Buildings, MapPin } from "phosphor-react";

const OfferItem = ({ offer, type }) => {
  if (type === "type") {
    return (
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 flex items-center justify-center">
          <Buildings size={16} className="text-emerald-400" />
        </div>
        <span>{offer.type}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1 text-slate-400">
      <MapPin size={14} className="text-cyan-400" />
      <span>
        {offer.city} - {offer.district}
      </span>
    </div>
  );
};

export default OfferItem;
