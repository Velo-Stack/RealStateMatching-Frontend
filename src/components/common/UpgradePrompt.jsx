import { Link } from "react-router-dom";

const UpgradePrompt = ({ message, compact = false }) => (
  <div className={`rounded-xl border border-amber-500/30 bg-amber-500/10 ${compact ? "p-3" : "p-5"}`}>
    <p className={`text-amber-300 ${compact ? "text-sm" : "text-base"} mb-3`}>
      {message || "هذه الميزة تتطلب ترقية خطتك"}
    </p>
    <Link
      to="/app/subscription"
      className="inline-flex px-4 py-2 rounded-lg text-sm font-medium bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/30"
    >
      ترقية الآن
    </Link>
  </div>
);

export default UpgradePrompt;
