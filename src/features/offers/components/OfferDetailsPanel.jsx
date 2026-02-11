const OfferDetailsPanel = ({ offer, type }) => {
  if (type === "area") {
    return (
      <span className="text-emerald-400 font-medium">
        {offer.areaFrom ?? "-"} - {offer.areaTo ?? "-"}
      </span>
    );
  }

  if (type === "price") {
    return (
      <span className="text-cyan-400 font-medium">
        {offer.priceFrom ? Number(offer.priceFrom).toLocaleString() : "-"} -{" "}
        {offer.priceTo ? Number(offer.priceTo).toLocaleString() : "-"}
      </span>
    );
  }

  return (
    <span
      className={`px-2 py-1 rounded-lg text-xs font-medium ${
        offer.exclusivity === "EXCLUSIVE"
          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
          : "bg-slate-500/10 text-slate-400 border border-slate-500/30"
      }`}
    >
      {offer.exclusivity === "EXCLUSIVE" ? "حصري" : "عام"}
    </span>
  );
};

export default OfferDetailsPanel;
