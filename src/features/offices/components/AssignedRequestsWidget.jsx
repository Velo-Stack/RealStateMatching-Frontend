import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ClipboardText } from "phosphor-react";
import { useFeatureFlags } from "../../../hooks/useFeatureFlags";
import { hasPermission } from "../../../utils/rbac";
import { fetchAssignedCount } from "../../offices/services/officesApi";

const AssignedRequestsWidget = ({ user }) => {
  const { isFeatureEnabled } = useFeatureFlags();
  const enabled =
    isFeatureEnabled("request_distribution.enabled") &&
    hasPermission(user, "requests.read");

  const { data } = useQuery({
    queryKey: ["assigned-requests-count"],
    queryFn: fetchAssignedCount,
    enabled,
    staleTime: 60_000,
  });

  if (!enabled || data?.count == null) return null;

  return (
    <Link
      to="/app/requests?assignedToMe=true"
      className="block bg-[#111827]/60 backdrop-blur-xl rounded-2xl border border-white/5 p-5 hover:border-violet-500/20 transition-colors"
    >
      <div className="flex items-center gap-2 text-white font-semibold mb-2">
        <ClipboardText size={20} className="text-violet-400" />
        طلبات معينة لي
      </div>
      <p className="text-2xl font-bold text-violet-400">{data.count}</p>
      <p className="text-sm text-slate-400 mt-2">اضغط لعرض الطلبات المخصصة لمتابعتها</p>
    </Link>
  );
};

export default AssignedRequestsWidget;
