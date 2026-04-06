const toNumber = (value) => {
  if (value === null || value === undefined || value === "") return null;
  const parsed = Number(String(value).replace(/,/g, ""));
  return Number.isFinite(parsed) ? parsed : null;
};

const getPrimaryValue = (firstValue, secondValue) => {
  const first = toNumber(firstValue);
  const second = toNumber(secondValue);
  return first ?? second;
};

const formatPrimaryValue = (firstValue, secondValue) => {
  const resolved = getPrimaryValue(firstValue, secondValue);
  if (resolved === null) return "-";
  return resolved.toLocaleString("ar-EG");
};

const OfferDetailsPanel = ({ offer, type }) => {
  if (type === "area") {
    return (
      <span className="text-emerald-400 font-medium">
        {formatPrimaryValue(offer.areaFrom, offer.areaTo)}
      </span>
    );
  }

  if (type === "price") {
    return (
      <span className="text-emerald-400 font-medium">
        {formatPrimaryValue(offer.priceFrom, offer.priceTo)}
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


