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
    activityGaps,
    loading,
    brokersLoading,
    areasLoading,
    activityGapsLoading,
    offers,
    requests,
    offersLoading,
    requestsLoading,
    matches,
    matchesLoading,
    users,
    usersLoading,
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
      activityGaps={activityGaps}
      loading={loading}
      brokersLoading={brokersLoading}
      areasLoading={areasLoading}
      activityGapsLoading={activityGapsLoading}
      offers={offers}
      requests={requests}
      offersLoading={offersLoading}
      requestsLoading={requestsLoading}
      matches={matches}
      matchesLoading={matchesLoading}
      users={users}
      usersLoading={usersLoading}
    />
  );
};

export default DashboardPage;
