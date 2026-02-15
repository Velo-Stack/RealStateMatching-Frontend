import Modal from "../../../components/Modal";

const normalizeText = (value) => String(value ?? "").trim().toLowerCase();

const toNumber = (value) => {
  if (value === null || value === undefined || value === "") return null;
  const parsed = Number(String(value).replace(/,/g, ""));
  return Number.isFinite(parsed) ? parsed : null;
};

const toRange = (fromValue, toValue) => {
  const from = toNumber(fromValue);
  const to = toNumber(toValue);

  if (from === null && to === null) return null;
  if (from === null) return { min: to, max: to };
  if (to === null) return { min: from, max: from };

  return { min: Math.min(from, to), max: Math.max(from, to) };
};

const rangesOverlap = (leftRange, rightRange) => {
  if (!leftRange || !rightRange) return false;
  return leftRange.min <= rightRange.max && rightRange.min <= leftRange.max;
};

const formatRange = (fromValue, toValue) => {
  const from = toNumber(fromValue);
  const to = toNumber(toValue);

  if (from === null && to === null) return "-";
  if (from !== null && to !== null) return `${from.toLocaleString()} - ${to.toLocaleString()}`;
  return (from ?? to).toLocaleString();
};

const formatLocation = (city, district) => {
  const cityText = city || "-";
  const districtText = district || "-";
  return `${cityText} - ${districtText}`;
};

const SummaryItem = ({ label, value }) => (
  <div className="flex items-center justify-between gap-3 text-sm">
    <span style={{ color: "var(--text-color)" }}>{label}</span>
    <span className="font-medium" style={{ color: "var(--text-color)" }}>
      {value || "-"}
    </span>
  </div>
);

const ReasonItem = ({ isMatch, message }) => (
  <div
    className="flex items-center justify-between gap-3 p-3 rounded-xl border"
    style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--border-color)" }}
  >
    <p className="text-sm" style={{ color: "var(--text-color)" }}>
      {message}
    </p>
    <span className={`text-xs font-bold ${isMatch ? "text-emerald-400" : ""}`} style={!isMatch ? { color: "var(--text-color)" } : undefined}>
      {isMatch ? "✓ متطابق" : "غير مطابق"}
    </span>
  </div>
);

const MatchDetailsModal = ({ isOpen, onClose, match }) => {
  if (!match) return null;

  const offer = match.offer || {};
  const request = match.request || {};

  const usageMatch = normalizeText(offer.usage) === normalizeText(request.usage) && normalizeText(offer.usage) !== "";
  const cityMatch = normalizeText(offer.city) === normalizeText(request.city) && normalizeText(offer.city) !== "";
  const districtMatch =
    normalizeText(offer.district) === normalizeText(request.district) &&
    normalizeText(offer.district) !== "";
  const purposeMatch =
    normalizeText(offer.purpose) === normalizeText(request.purpose) &&
    normalizeText(offer.purpose) !== "";

  const offerArea = toRange(offer.areaFrom, offer.areaTo);
  const requestArea = toRange(request.areaFrom, request.areaTo);
  const areaMatch = rangesOverlap(offerArea, requestArea);

  const offerPrice = toRange(offer.priceFrom, offer.priceTo);
  const requestBudget = toRange(request.budgetFrom, request.budgetTo);
  const priceMatch = rangesOverlap(offerPrice, requestBudget);

  const reasons = [
    { isMatch: usageMatch, message: usageMatch ? `الاستخدام متطابق: ${offer.usage || "-"}` : "الاستخدام غير مطابق" },
    { isMatch: cityMatch, message: cityMatch ? "المدينة متطابقة" : "المدينة غير متطابقة" },
    { isMatch: districtMatch, message: districtMatch ? "الحي متطابق" : "الحي غير مطابق" },
    { isMatch: areaMatch, message: areaMatch ? "المساحة ضمن النطاق المطلوب" : "المساحة غير ضمن النطاق المطلوب" },
    { isMatch: priceMatch, message: priceMatch ? "السعر مناسب للطلب" : "السعر غير مناسب للميزانية" },
    { isMatch: purposeMatch, message: purposeMatch ? `الغرض متطابق: ${offer.purpose || "-"}` : "الغرض غير مطابق" },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="تفاصيل التطابق">
      <div className="space-y-5 text-right">
        <section className="p-4 rounded-xl border space-y-3" style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--border-color)" }}>
          <h3 className="text-sm font-bold" style={{ color: "var(--text-color)" }}>ملخص العرض</h3>
          <SummaryItem label="الاستخدام" value={offer.usage || "-"} />
          <SummaryItem label="الموقع" value={formatLocation(offer.city, offer.district)} />
          <SummaryItem label="المساحة" value={formatRange(offer.areaFrom, offer.areaTo)} />
          <SummaryItem label="السعر" value={formatRange(offer.priceFrom, offer.priceTo)} />
          <SummaryItem label="الغرض" value={offer.purpose || "-"} />
        </section>

        <section className="p-4 rounded-xl border space-y-3" style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--border-color)" }}>
          <h3 className="text-sm font-bold" style={{ color: "var(--text-color)" }}>ملخص الطلب</h3>
          <SummaryItem label="الاستخدام" value={request.usage || "-"} />
          <SummaryItem label="الموقع" value={formatLocation(request.city, request.district)} />
          <SummaryItem label="المساحة المطلوبة" value={formatRange(request.areaFrom, request.areaTo)} />
          <SummaryItem label="الميزانية" value={formatRange(request.budgetFrom, request.budgetTo)} />
          <SummaryItem label="الغرض" value={request.purpose || "-"} />
        </section>

        <section className="p-4 rounded-xl border space-y-3" style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--border-color)" }}>
          <h3 className="text-sm font-bold" style={{ color: "var(--text-color)" }}>أسباب التطابق</h3>
          {reasons.map((reason, index) => (
            <ReasonItem key={`${reason.message}-${index}`} isMatch={reason.isMatch} message={reason.message} />
          ))}
        </section>
      </div>
    </Modal>
  );
};

export default MatchDetailsModal;
