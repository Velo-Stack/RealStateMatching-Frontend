import { useMatchesData } from "../hooks/useMatchesData";
import { useMatchesFilters } from "../hooks/useMatchesFilters";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import MatchDetailsModal from "./MatchDetailsModal";
import MatchesFilters from "./MatchesFilters";
import MatchesHeader from "./MatchesHeader";
import MatchesList from "./MatchesList";
import MatchesStats from "./MatchesStats";
import OfferDetailsModal from "../../offers/components/OfferDetailsModal";
import RequestDetailsModal from "../../requests/components/RequestDetailsModal";

const MatchesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const { statusFilter, setStatusFilter } = useMatchesFilters();

  const {
    matches,
    pagination,
    isLoading,
    updateStatus,
    stats,
    canUpdateStatus,
  } = useMatchesData({ statusFilter, currentPage });

  useEffect(() => {
    const matchId = searchParams.get("matchId");
    if (matchId && matches.length > 0) {
      const match = matches.find((m) => m.id === parseInt(matchId, 10));
      if (match) {
        setSelectedMatch(match);
        searchParams.delete("matchId");
        setSearchParams(searchParams, { replace: true });
      }
    }
  }, [searchParams, matches, setSearchParams]);

  const handleStatusFilterChange = (nextStatus) => {
    setStatusFilter(nextStatus);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      <MatchesStats stats={stats} matches={matches} />

      <div className="flex items-center justify-between">
        <MatchesHeader
          filteredCount={pagination.total}
          totalCount={stats.total}
        />
        <MatchesFilters
          statusFilter={statusFilter}
          setStatusFilter={handleStatusFilterChange}
        />
      </div>

      <MatchesList
        filteredMatches={matches}
        isLoading={isLoading}
        canUpdateStatus={canUpdateStatus}
        updateStatus={updateStatus}
        onMatchClick={setSelectedMatch}
        currentPage={pagination.page}
        onPageChange={setCurrentPage}
        totalPages={pagination.totalPages}
        totalCount={pagination.total}
      />

      <MatchDetailsModal
        isOpen={!!selectedMatch}
        onClose={() => setSelectedMatch(null)}
        match={selectedMatch}
        onOpenOffer={(offer) => setSelectedOffer(offer)}
        onOpenRequest={(request) => setSelectedRequest(request)}
      />

      <OfferDetailsModal
        isOpen={!!selectedOffer}
        onClose={() => setSelectedOffer(null)}
        offer={selectedOffer}
      />

      <RequestDetailsModal
        isOpen={!!selectedRequest}
        onClose={() => setSelectedRequest(null)}
        request={selectedRequest}
      />
    </div>
  );
};

export default MatchesPage;
