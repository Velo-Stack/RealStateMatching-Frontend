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

const toTimestamp = (value) => {
  if (!value) return null;
  const date = new Date(value);
  const time = date.getTime();
  return Number.isNaN(time) ? null : time;
};

export const getActivityStats = (items = []) => {
  const times = items
    .map((item) => toTimestamp(item?.createdAt))
    .filter((time) => time !== null)
    .sort((a, b) => b - a);

  if (times.length === 0) {
    return { lastMs: null, avgGapMs: null };
  }

  const now = Date.now();
  const lastMs = Math.max(0, now - times[0]);

  if (times.length < 2) {
    return { lastMs, avgGapMs: null };
  }

  let totalGap = 0;
  for (let i = 0; i < times.length - 1; i += 1) {
    totalGap += Math.max(0, times[i] - times[i + 1]);
  }

  const avgGapMs = Math.round(totalGap / (times.length - 1));
  return { lastMs, avgGapMs };
};

export const formatDuration = (ms) => {
  if (ms === null || ms === undefined) return "غير متاح";
  const minutes = Math.floor(ms / 60000);
  if (minutes < 1) return "أقل من دقيقة";
  if (minutes === 1) return "دقيقة";
  if (minutes === 2) return "دقيقتين";
  if (minutes <= 10) return `${minutes} دقائق`;
  if (minutes < 60) return `${minutes} دقيقة`;
  const hours = Math.floor(minutes / 60);
  if (hours === 1) return "ساعة";
  if (hours === 2) return "ساعتين";
  if (hours <= 10) return `${hours} ساعات`;
  if (hours < 24) return `${hours} ساعة`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "يوم";
  if (days === 2) return "يومين";
  if (days <= 10) return `${days} أيام`;
  return `${days} يوم`;
};
