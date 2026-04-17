import { useState } from "react";

const UnitCard = ({ unit }) => {
  const getStatusBadge = (status) => {
    const statusConfig = {
      available: { label: "متاح", color: "bg-[#1f2937]" },
      reserved: { label: "محجوز", color: "bg-[#f59e0b]" },
      sold: { label: "متاح", color: "bg-[#dc2626]" },
    };

    const config = statusConfig[status] || statusConfig.available;

    return (
      <span className={`${config.color} text-white px-4 py-1 rounded-md text-sm font-semibold`}>
        {config.label}
      </span>
    );
  };

  return (
    <div className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-2xl font-bold text-gray-800 mb-1">{unit.code}</h3>
          <p className="text-lg text-gray-600">{unit.price.toLocaleString()} ر.س</p>
        </div>
        {getStatusBadge(unit.status)}
      </div>
      <div className="space-y-2 text-gray-600 text-sm">
        <div className="flex justify-between">
          <span>🏠 {unit.floor}</span>
          <span>📐 {unit.area}</span>
          <span>🛏️ {unit.bedrooms}</span>
        </div>
      </div>
    </div>
  );
};

const UnitsSection = ({ units, onFilterChange }) => {
  const [filters, setFilters] = useState({
    floor: "",
    bedrooms: "",
    features: "",
  });

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    if (onFilterChange) {
      onFilterChange(newFilters);
    }
  };

  return (
    <div className="mt-16 bg-white p-8 md:p-12 rounded-[20px] shadow-sm border border-gray-200" dir="rtl">
      
      <h2 className="text-2xl md:text-3xl font-bold text-[#1f1f1f] mb-8 text-center">
        تفاصيل الوحدات
      </h2>

      {/* Filters */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <select 
          className="w-full px-4 py-3 bg-white rounded-lg outline-none text-gray-600 border !border-gray-300 focus:!border-[#9d7857] transition-all"
          value={filters.floor}
          onChange={(e) => handleFilterChange("floor", e.target.value)}
        >
          <option value="">الدور</option>
          <option value="ground">الأرضي</option>
          <option value="first">الأول</option>
          <option value="second">الثاني</option>
        </select>

        <select 
          className="w-full px-4 py-3 bg-white rounded-lg outline-none text-gray-600 border !border-gray-300 focus:!border-[#9d7857] transition-all"
          value={filters.bedrooms}
          onChange={(e) => handleFilterChange("bedrooms", e.target.value)}
        >
          <option value="">العدد</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
        </select>

        <select 
          className="w-full px-4 py-3 bg-white rounded-lg outline-none text-gray-600 border !border-gray-300 focus:!border-[#9d7857] transition-all"
          value={filters.features}
          onChange={(e) => handleFilterChange("features", e.target.value)}
        >
          <option value="">مميزات المشروع</option>
          <option value="parking">موقف سيارة</option>
          <option value="garden">حديقة</option>
          <option value="balcony">شرفة</option>
        </select>
      </div>

      {/* Units Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {units.map((unit) => (
          <UnitCard key={unit.id} unit={unit} />
        ))}
      </div>

    </div>
  );
};

export default UnitsSection;
