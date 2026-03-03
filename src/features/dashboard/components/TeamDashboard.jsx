import { motion } from "framer-motion";
import {
  Buildings,
  Clock,
  Crown,
  Target,
  Users,
  UsersThree,
} from "phosphor-react";
import { useNavigate } from "react-router-dom";
import {
  TEAM_QUICK_ACTIONS,
  teamTypeColors,
} from "../constants/dashboardConstants";
import {
  formatDuration,
  getCreatorName,
  getLatestItemInfo,
  getTeamTypeLabel,
} from "../utils/dashboardUtils";
import { hasRole } from "../../../utils/rbac";
import ChartCard from "./ChartCard";
import DashboardHeader from "./DashboardHeader";
import OffersRequestsActivityChart from "./OffersRequestsActivityChart";
import QuickAction from "./QuickAction";
import StatsSection from "./StatsSection";
import TeamMemberCard from "./TeamMemberCard";

const TeamDashboard = ({
  user,
  teamData,
  summary,
  offers,
  requests,
  offersLoading,
  requestsLoading,
}) => {
  const navigate = useNavigate();

  if (!teamData?.team) {
    return (
      <div className="space-y-6">
        <DashboardHeader
          title={`مرحباً، ${user?.name} 👋`}
          subtitle="لم يتم تعيينك في أي فريق بعد"
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#111827]/60 backdrop-blur-xl rounded-2xl border border-white/5 p-8 text-center"
        >
          <UsersThree size={64} className="mx-auto text-slate-600 mb-4" />
          <h3 className="text-lg font-bold text-white mb-2">لست عضواً في أي فريق</h3>
          <p className="text-slate-400 text-sm">
            تواصل مع مسؤول النظام لإضافتك إلى فريق
          </p>
        </motion.div>
      </div>
    );
  }

  const latestOffer = getLatestItemInfo(offers);
  const latestRequest = getLatestItemInfo(requests);
  const latestOfferCreator = getCreatorName(latestOffer.item);
  const latestRequestCreator = getCreatorName(latestRequest.item);
  const offersActivityLoading = offersLoading || requestsLoading;
  const availableQuickActions = TEAM_QUICK_ACTIONS.filter((action) =>
    !action.allowedRoles ? true : hasRole(user, action.allowedRoles),
  );

  const latestOfferValue =
    latestOffer.timeMs === null ? "غير متاح" : `منذ ${formatDuration(latestOffer.timeMs)}`;
  const latestRequestValue =
    latestRequest.timeMs === null ? "غير متاح" : `منذ ${formatDuration(latestRequest.timeMs)}`;

  return (
    <div className="space-y-6">
      <DashboardHeader title={user?.name}>
        <div className="flex items-center gap-3 mt-2">
          <span
            className={`px-3 py-1 rounded-lg text-sm font-medium bg-gradient-to-r ${
              teamTypeColors[teamData.team.type] || teamTypeColors.LANDS
            } text-white`}
          >
            {teamData.team.name}
          </span>
          <span className="text-slate-400 text-sm">
            {getTeamTypeLabel(teamData.team.type)}
          </span>
        </div>
      </DashboardHeader>

      <StatsSection
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        items={[
          {
            label: "عروض الفريق",
            value: summary?.offers ?? (offersLoading ? "..." : offers.length),
            icon: Buildings,
            gradient: "from-amber-400 to-amber-600",
            delay: 0,
          },
          {
            label: "طلبات الفريق",
            value: summary?.requests ?? (requestsLoading ? "..." : requests.length),
            icon: Target,
            gradient: "from-blue-500 to-indigo-500",
            delay: 0.1,
          },
          {
            label: "أعضاء الفريق",
            value: teamData.members?.length || 0,
            icon: Users,
            gradient: "from-amber-500 to-amber-600",
            delay: 0.2,
          },
          {
            label: latestOfferCreator
              ? `آخر عرض تمت إضافته • ${latestOfferCreator}`
              : "آخر عرض تمت إضافته",
            value: latestOfferValue,
            icon: Clock,
            gradient: "from-amber-400 to-amber-600",
            delay: 0.3,
          },
          {
            label: latestRequestCreator
              ? `آخر طلب تمت إضافته • ${latestRequestCreator}`
              : "آخر طلب تمت إضافته",
            value: latestRequestValue,
            icon: Clock,
            gradient: "from-blue-500 to-indigo-500",
            delay: 0.4,
          },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="مدير الفريق" subtitle="المسؤول عن إدارة الفريق" delay={0.4}>
          {teamData.manager ? (
            <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20">
              <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white text-xl font-bold">
                {teamData.manager.name?.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-lg font-bold text-white">
                    {teamData.manager.name}
                  </h4>
                  <Crown size={18} className="text-amber-400" weight="fill" />
                </div>
                <p className="text-slate-400 text-sm">{teamData.manager.email}</p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-slate-500">
              لا يوجد مدير معين للفريق
            </div>
          )}
        </ChartCard>

        <ChartCard
          title="أعضاء الفريق"
          subtitle={`${teamData.members?.length || 0} أعضاء`}
          delay={0.5}
        >
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {teamData.members?.length === 0 ? (
              <div className="text-center py-8 text-slate-500">لا يوجد أعضاء</div>
            ) : (
              teamData.members?.map((member) => (
                <TeamMemberCard
                  key={member.id}
                  member={member}
                  isManager={member.teamRole === "MANAGER"}
                />
              ))
            )}
          </div>
        </ChartCard>
      </div>

      <ChartCard
        title="نشاط العروض والطلبات"
        subtitle="متابعة الإضافات عبر الوقت"
        delay={0.6}
      >
        <OffersRequestsActivityChart
          offers={offers}
          requests={requests}
          loading={offersActivityLoading}
        />
      </ChartCard>

      <ChartCard
        title="إجراءات سريعة"
        subtitle="الوصول السريع للأقسام الرئيسية"
        delay={0.7}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {availableQuickActions.map((action) => (
            <QuickAction
              key={action.title}
              icon={action.icon}
              title={action.title}
              subtitle={action.subtitle}
              color={action.color}
              onClick={action.path ? () => navigate(action.path) : undefined}
            />
          ))}
        </div>
      </ChartCard>
    </div>
  );
};

export default TeamDashboard;

