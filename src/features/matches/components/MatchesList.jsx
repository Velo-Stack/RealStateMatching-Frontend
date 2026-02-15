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
  const columns = [
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
      render: (row) => <MatchDetailsPanel score={row.score} />,
    },
    {
      header: "الحالة",
      key: "status",
      render: (row) => (
        <StatusBadge status={row.status} config={STATUS_CONFIGS[row.status]} />
      ),
    },
  ];

  const actions = (row) =>
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
    ) : null;

  if (!isLoading && (!filteredMatches || filteredMatches.length === 0)) {
    return <EmptyState />;
  }

  return (
    <Table
      columns={columns}
      data={filteredMatches}
      loading={isLoading}
      actions={actions}
      onRowClick={onMatchClick}
    />
  );
};

export default MatchesList;
