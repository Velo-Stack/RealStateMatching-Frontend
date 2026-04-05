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

const getScoreColor = (score) => {
  if (score >= 80) return { bg: "bg-emerald-500/20", text: "text-emerald-400", label: "ممتاز" };
  if (score >= 60) return { bg: "bg-amber-500/20", text: "text-amber-400", label: "جيد" };
  if (score >= 40) return { bg: "bg-orange-500/20", text: "text-orange-400", label: "متوسط" };
  return { bg: "bg-red-500/20", text: "text-red-400", label: "ضعيف" };
};

const SummaryItem = ({ label, value }) => (
  <div className="flex items-center justify-between gap-3 text-sm">
    <span style={{ color: "var(--text-color)" }}>{label}</span>
    <span className="font-medium" style={{ color: "var(--text-color)" }}>
      {value || "-"}
    </span>
  </div>
);

const ReasonItem = ({ isMatch, message, weight, icon }) => (
  <div
    className="flex items-center gap-3 p-3 rounded-xl border transition-all"
    style={{ backgroundColor: "var(--card-bg)", borderColor: isMatch ? "rgba(16, 185, 129, 0.3)" : "var(--border-color)" }}
  >
    <span className="text-lg">{icon}</span>
    <div className="flex-1">
      <p className="text-sm" style={{ color: "var(--text-color)" }}>
        {message}
      </p>
      {weight && (
        <span className="text-xs text-slate-500">الوزن: {weight}%</span>
      )}
    </div>
    <span className={`text-xs font-bold px-2 py-1 rounded-lg ${isMatch ? "bg-emerald-500/20 text-emerald-400" : "bg-slate-500/20"}`} style={!isMatch ? { color: "var(--text-color)" } : undefined}>
      {isMatch ? "✓ متطابق" : "✗"}
    </span>
  </div>
);

const MatchDetailsModal = ({ isOpen, onClose, match }) => {
  if (!match) return null;

  const offer = match.offer || {};
  const request = match.request || {};
  const score = match.score || 0;
  const scoreColor = getScoreColor(score);

  // Calculate matches based on Backend algorithm
  const typeMatch = normalizeText(offer.type) === normalizeText(request.type) && normalizeText(offer.type) !== "";
  const usageMatch = normalizeText(offer.usage) === normalizeText(request.usage) && normalizeText(offer.usage) !== "";
  const purposeMatch =
    normalizeText(offer.purpose) === normalizeText(request.purpose) &&
    normalizeText(offer.purpose) !== "";

  // Location matching (prefer IDs)
  let cityMatch = false;
  let districtMatch = false;
  
  if (offer.cityId && request.cityId) {
    cityMatch = offer.cityId === request.cityId;
    if (cityMatch && offer.neighborhoodId && request.neighborhoodId) {
      districtMatch = offer.neighborhoodId === request.neighborhoodId;
    }
  } else if (offer.city && request.city) {
    cityMatch = normalizeText(offer.city) === normalizeText(request.city);
    if (cityMatch && offer.district && request.district) {
      districtMatch = normalizeText(offer.district) === normalizeText(request.district);
    }
  }

  const offerArea = toRange(offer.areaFrom, offer.areaTo);
  const requestArea = toRange(request.areaFrom, request.areaTo);
  const areaMatch = rangesOverlap(offerArea, requestArea);

  const offerPrice = toRange(offer.priceFrom, offer.priceTo);
  const requestBudget = toRange(request.budgetFrom, request.budgetTo);
  const priceMatch = rangesOverlap(offerPrice, requestBudget);

  // Reasons ordered by weight (Backend algorithm)
  const reasons = [
    { isMatch: typeMatch, message: typeMatch ? `النوع متطابق: ${offer.type || "-"}` : "النوع غير متطابق", weight: 15, icon: "🏢" },
    { isMatch: usageMatch, message: usageMatch ? `الاستخدام متطابق: ${offer.usage || "-"}` : "الاستخدام غير متطابق", weight: 15, icon: "🏷️" },
    { isMatch: areaMatch, message: areaMatch ? "المساحة ضمن النطاق المطلوب" : "المساحة غير ضمن النطاق المطلوب", weight: 20, icon: "📐" },
    { isMatch: priceMatch, message: priceMatch ? "السعر مناسب للميزانية" : "السعر غير مناسب للميزانية", weight: 20, icon: "💰" },
    { isMatch: cityMatch, message: cityMatch ? `المدينة متطابقة: ${offer.city || "-"}` : "المدينة غير متطابقة", weight: 10, icon: "📍" },
    { isMatch: districtMatch, message: districtMatch ? `الحي متطابق: ${offer.district || "-"}` : "الحي غير متطابق", weight: 10, icon: "🗺️" },
    { isMatch: purposeMatch, message: purposeMatch ? `الغرض متطابق: ${offer.purpose || "-"}` : "الغرض غير متطابق", weight: 10, icon: "🎯" },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="تفاصيل التطابق">
      <div className="space-y-5 text-right">
        {/* Score Section */}
        <section className="p-5 rounded-2xl border bg-gradient-to-br from-slate-800/50 to-slate-900/50" style={{ borderColor: "var(--border-color)" }}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold" style={{ color: "var(--text-color)" }}>نسبة التطابق</h3>
            <span className={`text-2xl font-bold ${scoreColor.text}`}>{score}%</span>
          </div>
          
          {/* Progress Bar */}
          <div className="relative h-3 bg-slate-700/50 rounded-full overflow-hidden">
            <div 
              className={`absolute inset-y-0 right-0 ${scoreColor.bg} transition-all duration-500 rounded-full`}
              style={{ width: `${score}%` }}
            >
              <div className={`absolute inset-0 ${scoreColor.bg.replace('/20', '/40')} animate-pulse`} />
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-2">
            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${scoreColor.bg} ${scoreColor.text}`}>
              {scoreColor.label}
            </span>
            <span className="text-xs text-slate-500">
              يتم الحساب بناءً على 7 معايير
            </span>
          </div>
        </section>

        <section className="p-4 rounded-xl border space-y-3" style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--border-color)" }}>
          <h3 className="text-sm font-bold" style={{ color: "var(--text-color)" }}>ملخص العرض</h3>
          <SummaryItem label="النوع" value={offer.type || "-"} />
          <SummaryItem label="الاستخدام" value={offer.usage || "-"} />
          <SummaryItem label="الموقع" value={formatLocation(offer.city, offer.district)} />
          <SummaryItem label="المساحة" value={formatRange(offer.areaFrom, offer.areaTo)} />
          <SummaryItem label="السعر" value={formatRange(offer.priceFrom, offer.priceTo)} />
          <SummaryItem label="الغرض" value={offer.purpose || "-"} />
        </section>

        <section className="p-4 rounded-xl border space-y-3" style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--border-color)" }}>
          <h3 className="text-sm font-bold" style={{ color: "var(--text-color)" }}>ملخص الطلب</h3>
          <SummaryItem label="النوع" value={request.type || "-"} />
          <SummaryItem label="الاستخدام" value={request.usage || "-"} />
          <SummaryItem label="الموقع" value={formatLocation(request.city, request.district)} />
          <SummaryItem label="المساحة المطلوبة" value={formatRange(request.areaFrom, request.areaTo)} />
          <SummaryItem label="الميزانية" value={formatRange(request.budgetFrom, request.budgetTo)} />
          <SummaryItem label="الغرض" value={request.purpose || "-"} />
        </section>

        <section className="p-4 rounded-xl border space-y-3" style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--border-color)" }}>
          <h3 className="text-sm font-bold mb-3" style={{ color: "var(--text-color)" }}>تفاصيل التطابق (مرتبة حسب الأهمية)</h3>
          {reasons.map((reason, index) => (
            <ReasonItem 
              key={`${reason.message}-${index}`} 
              isMatch={reason.isMatch} 
              message={reason.message}
              weight={reason.weight}
              icon={reason.icon}
            />
          ))}
          
          <div className="mt-4 p-3 rounded-lg bg-slate-700/30 border border-slate-600/30">
            <p className="text-xs text-slate-400 leading-relaxed">
              💡 ملاحظة: نوع العقار التفصيلي (شقة/فلة/أرض) وحالة الأرض (خام/مطورة) غير مشمولين في حساب التطابق حالياً.
            </p>
          </div>
        </section>
      </div>
    </Modal>
  );
};

export default MatchDetailsModal;
