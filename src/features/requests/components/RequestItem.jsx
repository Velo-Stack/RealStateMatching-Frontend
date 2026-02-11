import { MapPin, Target } from "phosphor-react";

const RequestItem = ({ request, type }) => {
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
    <div className="flex items-center gap-1 text-slate-400">
      <MapPin size={14} className="text-emerald-400" />
      <span>
        {request.city} - {request.district}
      </span>
    </div>
  );
};

export default RequestItem;
