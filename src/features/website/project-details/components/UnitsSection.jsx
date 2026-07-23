import { useState } from "react";

const STATUS_MAP = {
  AVAILABLE: { label: "متاح", color: "bg-emerald-500" },
  RESERVED:  { label: "محجوز", color: "bg-amber-500" },
  SOLD:      { label: "مباع",  color: "bg-rose-500" },
  // legacy lowercase
  available: { label: "متاح", color: "bg-emerald-500" },
  reserved:  { label: "محجوز", color: "bg-amber-500" },
  sold:      { label: "مباع",  color: "bg-rose-500" },
};

const UnitCard = ({ unit, onSelectUnit, isSelected }) => {
  const statusInfo = STATUS_MAP[unit.status] || STATUS_MAP.AVAILABLE;
  const price = typeof unit.price === "number"
    ? unit.price.toLocaleString("ar-SA")
    : unit.price;

  return (
    <div
      onClick={() => unit.status !== "SOLD" && unit.status !== "sold" && onSelectUnit(unit)}
      className={`relative rounded-2xl border-2 p-5 transition-all duration-200 font-cairo
        ${isSelected
          ? "border-[#9d7857] shadow-lg bg-[#9d7857]/5"
          : "border-gray-200 bg-white hover:border-[#9d7857]/50 hover:shadow-md"}
        ${unit.status === "SOLD" || unit.status === "sold"
          ? "opacity-60 cursor-not-allowed"
          : "cursor-pointer"}`}
    >
      {/* Status badge */}
      <span className={`absolute top-4 left-4 ${statusInfo.color} text-white text-xs font-bold px-3 py-1 rounded-full`}>
        {statusInfo.label}
      </span>

      {isSelected && (
        <span className="absolute top-4 right-4 w-5 h-5 bg-[#9d7857] rounded-full flex items-center justify-center">
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </span>
      )}

      <div className="mt-4">
        <h3 className="text-xl font-extrabold text-gray-800 mb-0.5">{unit.code}</h3>
        <p className="text-[#9d7857] font-bold text-sm mb-3">{price} ر.س</p>
      </div>

      <div className="grid grid-cols-3 gap-1 text-gray-600 text-xs border-t border-gray-100 pt-3">
        <div className="flex flex-col items-center gap-0.5">
          <span className="text-base">🏢</span>
          <span className="text-center leading-tight">{unit.floor}</span>
        </div>
        <div className="flex flex-col items-center gap-0.5">
          <span className="text-base">📐</span>
          <span>{unit.area} م²</span>
        </div>
        <div className="flex flex-col items-center gap-0.5">
          <span className="text-base">🛏️</span>
          <span>{unit.bedrooms} غرف</span>
        </div>
      </div>
    </div>
  );
};

const UnitsSection = ({ units = [], onUnitSelect }) => {
  const [filterFloor, setFilterFloor] = useState("");
  const [filterBedrooms, setFilterBedrooms] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [selectedUnit, setSelectedUnit] = useState(null);

  if (!units || units.length === 0) return null;

  // Build unique filter options from actual data
  const floors = [...new Set(units.map((u) => u.floor))].sort();
  const bedroomOptions = [...new Set(units.map((u) => u.bedrooms))].sort((a, b) => a - b);

  // Apply filters
  const filtered = units.filter((u) => {
    if (filterFloor && u.floor !== filterFloor) return false;
    if (filterBedrooms && String(u.bedrooms) !== filterBedrooms) return false;
    if (filterStatus && u.status !== filterStatus && u.status?.toLowerCase() !== filterStatus.toLowerCase()) return false;
    return true;
  });

  const handleSelectUnit = (unit) => {
    const next = selectedUnit?.id === unit.id ? null : unit;
    setSelectedUnit(next);
    if (onUnitSelect) onUnitSelect(next);
  };

  const stats = {
    total: units.length,
    available: units.filter((u) => u.status === "AVAILABLE" || u.status === "available").length,
    reserved: units.filter((u) => u.status === "RESERVED" || u.status === "reserved").length,
    sold: units.filter((u) => u.status === "SOLD" || u.status === "sold").length,
  };

  return (
    <div className="bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-gray-100 font-cairo" dir="rtl">
      <h2 className="text-2xl md:text-3xl font-bold text-[#1f1f1f] mb-6 text-center">
        وحدات المشروع
      </h2>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {[
          { label: "إجمالي الوحدات", value: stats.total, color: "text-gray-700" },
          { label: "متاح", value: stats.available, color: "text-emerald-600" },
          { label: "محجوز", value: stats.reserved, color: "text-amber-600" },
          { label: "مباع", value: stats.sold, color: "text-rose-500" },
        ].map((s) => (
          <div key={s.label} className="bg-gray-50 rounded-2xl p-3 text-center border border-gray-100">
            <p className={`text-2xl font-extrabold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
        <select
          className="w-full px-4 py-3 bg-white rounded-xl border border-gray-200 text-gray-600 focus:outline-none focus:border-[#9d7857] transition-all text-sm"
          value={filterFloor}
          onChange={(e) => setFilterFloor(e.target.value)}
        >
          <option value="">الدور — الكل</option>
          {floors.map((f) => <option key={f} value={f}>{f}</option>)}
        </select>

        <select
          className="w-full px-4 py-3 bg-white rounded-xl border border-gray-200 text-gray-600 focus:outline-none focus:border-[#9d7857] transition-all text-sm"
          value={filterBedrooms}
          onChange={(e) => setFilterBedrooms(e.target.value)}
        >
          <option value="">غرف النوم — الكل</option>
          {bedroomOptions.map((b) => <option key={b} value={String(b)}>{b} غرف</option>)}
        </select>

        <select
          className="w-full px-4 py-3 bg-white rounded-xl border border-gray-200 text-gray-600 focus:outline-none focus:border-[#9d7857] transition-all text-sm"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="">الحالة — الكل</option>
          <option value="AVAILABLE">متاح</option>
          <option value="RESERVED">محجوز</option>
          <option value="SOLD">مباع</option>
        </select>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <p className="text-center text-gray-400 py-12 text-sm">لا توجد وحدات تطابق الفلاتر المحددة</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((unit) => (
            <UnitCard
              key={unit.id}
              unit={unit}
              isSelected={selectedUnit?.id === unit.id}
              onSelectUnit={handleSelectUnit}
            />
          ))}
        </div>
      )}

      {selectedUnit && (
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500 mb-2">
            لقد اخترت الوحدة <strong className="text-[#9d7857]">{selectedUnit.code}</strong> — اضغط على "سجل اهتمامك" أدناه لإتمام الطلب
          </p>
          <button
            onClick={() => document.getElementById("interest-form-section")?.scrollIntoView({ behavior: "smooth" })}
            className="bg-[#9d7857] text-white text-sm font-bold px-6 py-2.5 rounded-xl hover:bg-[#856345] transition-colors"
          >
            سجل اهتمامك بهذه الوحدة ←
          </button>
        </div>
      )}
    </div>
  );
};

export default UnitsSection;
