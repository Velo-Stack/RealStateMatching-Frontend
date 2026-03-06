import Modal from "../../../components/Modal";
import {
  CONTRACT_TYPES,
  EXCLUSIVITY_TYPES,
  LAND_STATUSES,
  MATCH_STATUSES,
  PRIORITY_TYPES,
  PROPERTY_TYPES,
  PURPOSE_TYPES,
  SUBMITTED_BY_TYPES,
  USAGE_TYPES,
  getLabelByValue,
} from "../../../constants/enums";

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

const formatSingleValue = (primaryValue, secondaryValue, suffix = "") => {
  const primary = toNumber(primaryValue);
  const secondary = toNumber(secondaryValue);
  const resolved = primary ?? secondary;

  if (resolved === null) return "-";
  return `${resolved.toLocaleString("ar-EG")}${suffix}`;
};

const formatDateTime = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString("ar-EG");
};

const formatLocation = (city, district) => {
  const parts = [city, district].filter(Boolean);
  if (parts.length === 0) return "-";
  return parts.join(" - ");
};

const hasValue = (value) =>
  value !== null && value !== undefined && String(value).trim() !== "";

const getEnumLabel = (enumObject, value) =>
  hasValue(value) ? getLabelByValue(enumObject, value) : null;

const DetailItem = ({ label, value }) => (
  <div className="flex items-center justify-between gap-3 text-sm">
    <span className="text-slate-400">{label}</span>
    <span className="font-medium text-white">{value || "-"}</span>
  </div>
);

const MatchRow = ({ label, isMatch, details }) => (
  <div
    className="p-3 rounded-xl border flex items-center justify-between gap-3"
    style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--border-color)" }}
  >
    <div className="text-sm">
      <p className="text-white font-medium">{label}</p>
      <p className="text-xs text-slate-400 mt-0.5">{details}</p>
    </div>
    <span
      className={`text-xs font-bold ${isMatch ? "text-emerald-400" : "text-rose-400"}`}
    >
      {isMatch ? "متطابق" : "غير متطابق"}
    </span>
  </div>
);

const SectionCard = ({ title, children, actionLabel, onAction }) => (
  <section
    className="p-4 rounded-xl border space-y-3"
    style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--border-color)" }}
  >
    <div className="flex items-center justify-between gap-3">
      <h3 className="text-sm font-bold text-white">{title}</h3>
      {onAction && (
        <button
          type="button"
          onClick={onAction}
          className="px-3 py-1.5 rounded-lg text-xs font-medium border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </div>
    {children}
  </section>
);

const MatchDetailsModal = ({ isOpen, onClose, match, onOpenOffer, onOpenRequest }) => {
  if (!match) return null;

  const offer = match.offer || {};
  const request = match.request || {};

  const rawScore = toNumber(match.score);
  const scorePercent =
    rawScore === null ? null : rawScore <= 1 ? rawScore * 100 : rawScore;

  const offerArea = toRange(offer.areaFrom, offer.areaTo);
  const requestArea = toRange(request.areaFrom, request.areaTo);
  const offerPrice = toRange(offer.priceFrom, offer.priceTo);
  const requestBudget = toRange(request.budgetFrom, request.budgetTo);

  const typeMatch =
    normalizeText(offer.type) !== "" &&
    normalizeText(offer.type) === normalizeText(request.type);
  const usageMatch =
    normalizeText(offer.usage) !== "" &&
    normalizeText(offer.usage) === normalizeText(request.usage);
  const cityMatch =
    normalizeText(offer.city) !== "" &&
    normalizeText(offer.city) === normalizeText(request.city);
  const districtMatch =
    normalizeText(offer.district) !== "" &&
    normalizeText(offer.district) === normalizeText(request.district);
  const purposeMatch =
    normalizeText(offer.purpose) !== "" &&
    normalizeText(offer.purpose) === normalizeText(request.purpose);
  const areaMatch = rangesOverlap(offerArea, requestArea);
  const priceMatch = rangesOverlap(offerPrice, requestBudget);

  const matchRows = [
    {
      label: "نوع العقار",
      isMatch: typeMatch,
      details: `${getLabelByValue(PROPERTY_TYPES, offer.type)} / ${getLabelByValue(PROPERTY_TYPES, request.type)}`,
    },
    {
      label: "الاستخدام",
      isMatch: usageMatch,
      details: `${getLabelByValue(USAGE_TYPES, offer.usage)} / ${getLabelByValue(USAGE_TYPES, request.usage)}`,
    },
    {
      label: "المدينة",
      isMatch: cityMatch,
      details: `${offer.city || "-"} / ${request.city || "-"}`,
    },
    {
      label: "الحي",
      isMatch: districtMatch,
      details: `${offer.district || "-"} / ${request.district || "-"}`,
    },
    {
      label: "المساحة",
      isMatch: areaMatch,
      details: `${formatSingleValue(offer.areaFrom, offer.areaTo, " م²")} / ${formatSingleValue(request.areaFrom, request.areaTo, " م²")}`,
    },
    {
      label: "السعر مقابل الميزانية",
      isMatch: priceMatch,
      details: `${formatSingleValue(offer.priceFrom, offer.priceTo, " ر.س")} / ${formatSingleValue(request.budgetFrom, request.budgetTo, " ر.س")}`,
    },
  ];

  if (hasValue(offer.purpose) || hasValue(request.purpose)) {
    matchRows.push({
      label: "الغرض",
      isMatch: purposeMatch,
      details: `${getLabelByValue(PURPOSE_TYPES, offer.purpose)} / ${getLabelByValue(PURPOSE_TYPES, request.purpose)}`,
    });
  }

  const handleOpenOffer = () => {
    if (!offer?.id || !onOpenOffer) return;
    onOpenOffer(offer);
    onClose();
  };

  const handleOpenRequest = () => {
    if (!request?.id || !onOpenRequest) return;
    onOpenRequest(request);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="تفاصيل التطابق">
      <div className="space-y-5 text-right">
        <SectionCard
          title="الطلب"
          actionLabel="عرض الطلب بالكامل"
          onAction={request?.id ? handleOpenRequest : null}
        >
          <DetailItem label="نوع العقار" value={getLabelByValue(PROPERTY_TYPES, request.type)} />
          <DetailItem label="الاستخدام" value={getLabelByValue(USAGE_TYPES, request.usage)} />
          <DetailItem label="الموقع" value={formatLocation(request.city, request.district)} />
          <DetailItem label="المساحة المطلوبة" value={formatSingleValue(request.areaFrom, request.areaTo, " م²")} />
          <DetailItem label="الميزانية" value={formatSingleValue(request.budgetFrom, request.budgetTo, " ر.س")} />
          <DetailItem label="الأولوية" value={getLabelByValue(PRIORITY_TYPES, request.priority)} />
          {getEnumLabel(PURPOSE_TYPES, request.purpose) && (
            <DetailItem label="الغرض" value={getLabelByValue(PURPOSE_TYPES, request.purpose)} />
          )}
          {getEnumLabel(LAND_STATUSES, request.landStatus) && (
            <DetailItem label="حالة الأرض" value={getLabelByValue(LAND_STATUSES, request.landStatus)} />
          )}
          {getEnumLabel(SUBMITTED_BY_TYPES, request.submittedBy) && (
            <DetailItem label="مقدم الطلب" value={getLabelByValue(SUBMITTED_BY_TYPES, request.submittedBy)} />
          )}
          {hasValue(request.team?.name) && <DetailItem label="الفريق" value={request.team?.name} />}
          {hasValue(request.createdAt) && (
            <DetailItem label="تاريخ إنشاء الطلب" value={formatDateTime(request.createdAt)} />
          )}
          <DetailItem label="العميل" value={request.createdBy?.name || "-"} />
          <DetailItem
            label="رقم الموبايل"
            value={request.brokerContactPhone || request.createdBy?.phone || "-"}
          />
          {hasValue(request.description) && (
            <div
              className="mt-2 rounded-xl border p-3"
              style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--border-color)" }}
            >
              <p className="text-xs text-slate-400 mb-1">وصف الطلب</p>
              <p className="text-sm text-white whitespace-pre-wrap">{request.description}</p>
            </div>
          )}
        </SectionCard>

        <SectionCard
          title="العرض"
          actionLabel="عرض العرض بالكامل"
          onAction={offer?.id ? handleOpenOffer : null}
        >
          <DetailItem label="نوع العقار" value={getLabelByValue(PROPERTY_TYPES, offer.type)} />
          <DetailItem label="الاستخدام" value={getLabelByValue(USAGE_TYPES, offer.usage)} />
          <DetailItem label="الموقع" value={formatLocation(offer.city, offer.district)} />
          <DetailItem label="المساحة" value={formatSingleValue(offer.areaFrom, offer.areaTo, " م²")} />
          <DetailItem label="السعر المطلوب" value={formatSingleValue(offer.priceFrom, offer.priceTo, " ر.س")} />
          {getEnumLabel(PURPOSE_TYPES, offer.purpose) && (
            <DetailItem label="الغرض" value={getLabelByValue(PURPOSE_TYPES, offer.purpose)} />
          )}
          {getEnumLabel(CONTRACT_TYPES, offer.contractType) && (
            <DetailItem label="طبيعة التعاقد" value={getLabelByValue(CONTRACT_TYPES, offer.contractType)} />
          )}
          {getEnumLabel(EXCLUSIVITY_TYPES, offer.exclusivity) && (
            <DetailItem label="الحصرية" value={getLabelByValue(EXCLUSIVITY_TYPES, offer.exclusivity)} />
          )}
          {getEnumLabel(LAND_STATUSES, offer.landStatus) && (
            <DetailItem label="حالة الأرض" value={getLabelByValue(LAND_STATUSES, offer.landStatus)} />
          )}
          {getEnumLabel(SUBMITTED_BY_TYPES, offer.submittedBy) && (
            <DetailItem label="مقدم العرض" value={getLabelByValue(SUBMITTED_BY_TYPES, offer.submittedBy)} />
          )}
          {hasValue(offer.team?.name) && <DetailItem label="الفريق" value={offer.team?.name} />}
          {hasValue(offer.createdAt) && (
            <DetailItem label="تاريخ إنشاء العرض" value={formatDateTime(offer.createdAt)} />
          )}
          <DetailItem label="صاحب العرض" value={offer.createdBy?.name || "-"} />
          <DetailItem
            label="رقم الموبايل"
            value={offer.brokerContactPhone || offer.createdBy?.phone || "-"}
          />
          {hasValue(offer.description) && (
            <div
              className="mt-2 rounded-xl border p-3"
              style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--border-color)" }}
            >
              <p className="text-xs text-slate-400 mb-1">وصف العرض</p>
              <p className="text-sm text-white whitespace-pre-wrap">{offer.description}</p>
            </div>
          )}
        </SectionCard>

        <SectionCard title="ما الذي تطابق بين الاثنين؟">
          <DetailItem
            label="نسبة التطابق"
            value={scorePercent === null ? "-" : `${scorePercent.toFixed(1)}%`}
          />
          <DetailItem label="حالة التطابق" value={getLabelByValue(MATCH_STATUSES, match.status)} />
          <DetailItem label="تاريخ إنشاء التطابق" value={formatDateTime(match.createdAt)} />
          <div className="space-y-2 pt-1">
            {matchRows.map((row) => (
              <MatchRow
                key={row.label}
                label={row.label}
                isMatch={row.isMatch}
                details={row.details}
              />
            ))}
          </div>
        </SectionCard>
      </div>
    </Modal>
  );
};

export default MatchDetailsModal;
