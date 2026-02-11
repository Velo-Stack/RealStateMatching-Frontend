const MatchesHeader = ({ filteredCount, totalCount }) => (
  <p className="text-slate-400 text-sm">
    عرض <span className="text-white font-semibold">{filteredCount}</span> من أصل{" "}
    {totalCount} مطابقة
  </p>
);

export default MatchesHeader;
