import { useDashboardData } from "../hooks/useDashboardData";
import AdminDashboard from "./AdminDashboard";
import TeamDashboard from "./TeamDashboard";

const DashboardPage = () => {
  const {
    user,
    isAdmin,
    teamData,
    summary,
    topBrokers,
    topAreas,
    loading,
    brokersLoading,
    areasLoading,
  } = useDashboardData();

  if (!isAdmin) {
    return (
      <TeamDashboard
        user={user}
        teamData={teamData}
        summary={summary}
        loading={loading}
      />
    );
  }

  return (
    <AdminDashboard
      user={user}
      summary={summary}
      topBrokers={topBrokers}
      topAreas={topAreas}
      loading={loading}
      brokersLoading={brokersLoading}
      areasLoading={areasLoading}
    />
  );
};

export default DashboardPage;
