import { useMatchesData } from "../hooks/useMatchesData";
import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { MATCHES_PAGE_SIZE } from "../constants/matchesConstants";
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

  // Handle matchId from URL (from notifications)
  useEffect(() => {
    const matchId = searchParams.get('matchId');
    if (matchId && matches.length > 0) {
      const match = matches.find(m => m.id === parseInt(matchId));
      if (match) {
        setSelectedMatch(match);
        // Remove matchId from URL
        searchParams.delete('matchId');
        setSearchParams(searchParams, { replace: true });
      }
    }
  }, [searchParams, matches, setSearchParams]);

  const totalFiltered = filteredMatches.length;
  const totalPages = Math.max(1, Math.ceil(totalFiltered / MATCHES_PAGE_SIZE));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedMatches = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * MATCHES_PAGE_SIZE;
    const endIndex = startIndex + MATCHES_PAGE_SIZE;
    return filteredMatches.slice(startIndex, endIndex);
  }, [filteredMatches, safeCurrentPage]);

  const handleStatusFilterChange = (nextStatus) => {
    setStatusFilter(nextStatus);
    setCurrentPage(1);
  };

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
          setStatusFilter={handleStatusFilterChange}
        />
      </div>

      <MatchesList
        filteredMatches={paginatedMatches}
        isLoading={isLoading}
        canUpdateStatus={canUpdateStatus}
        updateStatus={updateStatus}
        onMatchClick={setSelectedMatch}
        currentPage={safeCurrentPage}
        onPageChange={setCurrentPage}
        totalPages={totalPages}
        totalCount={totalFiltered}
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
