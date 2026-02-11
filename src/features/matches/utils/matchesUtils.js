export const getFilteredMatches = (matches, statusFilter) =>
  statusFilter === "ALL"
    ? matches
    : matches.filter((match) => match.status === statusFilter);

export const getMatchesStats = (matches) => ({
  total: matches.length,
  new: matches.filter((match) => match.status === "NEW").length,
  closed: matches.filter((match) => match.status === "CLOSED").length,
  avgScore:
    matches.length > 0
      ? Math.round(
          matches.reduce((sum, match) => sum + match.score, 0) / matches.length,
        )
      : 0,
});

export const getScoreVisualConfig = (score) => {
  const color =
    score >= 80
      ? "text-emerald-400"
      : score >= 50
        ? "text-amber-400"
        : "text-red-400";

  const gradient =
    score >= 80
      ? "bg-gradient-to-r from-emerald-500 to-cyan-500"
      : score >= 50
        ? "bg-gradient-to-r from-amber-500 to-orange-500"
        : "bg-gradient-to-r from-red-500 to-pink-500";

  return { color, gradient };
};
