import { memo, useCallback, useMemo } from "react";
import { StatusBadge, STATUS_CONFIGS } from "../../../components/common";
import Table from "../../../components/Table";
import { inputClasses } from "../../../constants/styles";
import { STATUS_UPDATE_OPTIONS } from "../constants/matchesConstants";
import EmptyState from "./EmptyState";
import MatchDetailsPanel from "./MatchDetailsPanel";
import MatchItem from "./MatchItem";

const MatchesList = ({
  filteredMatches,
  isLoading,
  canUpdateStatus,
  updateStatus,
  onMatchClick,
}) => {
  const matchRows = filteredMatches || [];
  const shouldAnimateScore = matchRows.length <= 80;

  const columns = useMemo(
    () => [
    {
      header: "العرض",
      key: "offer",
      render: (row) => <MatchItem row={row} type="offer" />,
    },
    {
      header: "الطلب",
      key: "request",
      render: (row) => <MatchItem row={row} type="request" />,
    },
    {
      header: "نسبة التوافق",
      key: "score",
      render: (row) => <MatchDetailsPanel score={row.score} shouldAnimate={shouldAnimateScore} />,
    },
    {
      header: "الحالة",
      key: "status",
      render: (row) => (
        <StatusBadge status={row.status} config={STATUS_CONFIGS[row.status]} />
      ),
    },
    ],
    [shouldAnimateScore],
  );

  const actions = useCallback(
    (row) =>
      canUpdateStatus ? (
        <select
          value={row.status}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => updateStatus({ id: row.id, status: e.target.value })}
          className={inputClasses}
        >
          {STATUS_UPDATE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : null,
    [canUpdateStatus, updateStatus],
  );

  const getMatchRowKey = useCallback(
    (match) =>
      String(
        match.id ??
          `${match.offerId || match.offer?.id || ""}-${match.requestId || match.request?.id || ""}`,
      ),
    [],
  );

  if (!isLoading && matchRows.length === 0) {
    return <EmptyState />;
  }

  return (
    <Table
      columns={columns}
      data={matchRows}
      loading={isLoading}
      actions={actions}
      onRowClick={onMatchClick}
      getRowKey={getMatchRowKey}
      virtualizedRowHeight={88}
    />
  );
};

export default memo(MatchesList);
