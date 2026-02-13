import { useMatchesData } from "../hooks/useMatchesData";
import MatchesFilters from "./MatchesFilters";
import MatchesHeader from "./MatchesHeader";
import MatchesList from "./MatchesList";
import MatchesStats from "./MatchesStats";

const MatchesPage = () => {
  const {
    matches,
    filteredMatches,
    isLoading,
    statusFilter,
    setStatusFilter,
    updateStatus,
    stats,
    canUpdateStatus,
  } = useMatchesData();

  return (
    <div className="space-y-6">
      <MatchesStats stats={stats} matches={matches} />

      <div className="flex items-center justify-between">
        <MatchesHeader
          filteredCount={filteredMatches.length}
          totalCount={matches.length}
        />
        <MatchesFilters
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />
      </div>

      <MatchesList
        filteredMatches={filteredMatches}
        isLoading={isLoading}
        canUpdateStatus={canUpdateStatus}
        updateStatus={updateStatus}
      />
    </div>
  );
};

export default MatchesPage;
