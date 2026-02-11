import { Buildings, Handshake, Target } from "phosphor-react";
import { ADMIN_QUICK_ACTIONS } from "../constants/dashboardConstants";
import ChartCard from "./ChartCard";
import DashboardHeader from "./DashboardHeader";
import QuickAction from "./QuickAction";
import StatsSection from "./StatsSection";
import TopAreasChart from "./TopAreasChart";
import TopBrokersChart from "./TopBrokersChart";

const AdminDashboard = ({
  user,
  summary,
  topBrokers,
  topAreas,
  loading,
  brokersLoading,
  areasLoading,
}) => (
  <div className="space-y-6">
    <DashboardHeader
      title={user?.name}
      subtitle="إليك نظرة عامة على أداء النظام اليوم"
    />

    <StatsSection
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      items={[
        {
          label: "إجمالي العروض",
          value: summary?.offers ?? (loading ? "..." : 0),
          icon: Buildings,
          gradient: "from-emerald-500 to-emerald-600",
          delay: 0,
        },
        {
          label: "إجمالي الطلبات",
          value: summary?.requests ?? (loading ? "..." : 0),
          icon: Target,
          gradient: "from-cyan-500 to-cyan-600",
          delay: 0.1,
        },
        {
          label: "إجمالي المطابقات",
          value: summary?.matches ?? (loading ? "..." : 0),
          icon: Handshake,
          gradient: "from-violet-500 to-violet-600",
          delay: 0.2,
        },
      ]}
    />

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <ChartCard
        title="إجراءات سريعة"
        subtitle="الوصول السريع للأقسام الرئيسية"
        delay={0.4}
      >
        <div className="space-y-3">
          {ADMIN_QUICK_ACTIONS.map((action) => (
            <QuickAction
              key={action.title}
              icon={action.icon}
              title={action.title}
              subtitle={action.subtitle}
              color={action.color}
            />
          ))}
        </div>
      </ChartCard>

      <ChartCard title="أفضل السماسرة" subtitle="حسب عدد الصفقات المنجزة" delay={0.5}>
        <TopBrokersChart topBrokers={topBrokers} brokersLoading={brokersLoading} />
      </ChartCard>

      <ChartCard title="أفضل المناطق" subtitle="حسب عدد العروض المتاحة" delay={0.6}>
        <TopAreasChart topAreas={topAreas} areasLoading={areasLoading} />
      </ChartCard>
    </div>
  </div>
);

export default AdminDashboard;
