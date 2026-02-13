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
    offers,
    requests,
    offersLoading,
    requestsLoading,
  } = useDashboardData();

  if (!isAdmin) {
    return (
      <TeamDashboard
        user={user}
        teamData={teamData}
        summary={summary}
        loading={loading}
        offers={offers}
        requests={requests}
        offersLoading={offersLoading}
        requestsLoading={requestsLoading}
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
      offers={offers}
      requests={requests}
      offersLoading={offersLoading}
      requestsLoading={requestsLoading}
    />
  );
};

export default DashboardPage;
