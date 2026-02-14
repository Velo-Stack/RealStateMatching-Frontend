import { memo, useState } from "react";
import { motion } from "framer-motion";
import { Funnel, ArrowsClockwise, X } from "phosphor-react";
import {
  USAGE_CLASSIFICATION_OPTIONS,
  CONTRACT_TYPE_OPTIONS,
  PURPOSE_OPTIONS,
} from "../../../constants/enums";
import { inputClasses, labelClasses } from "../../../constants/styles";

const OffersFilters = memo(({ filters, hasActiveFilters, handleChange, clearFilters }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const getFilterLabel = (key, value) => {
    const labels = {
      usage: USAGE_CLASSIFICATION_OPTIONS.find((opt) => opt.value === value)?.label,
      contractType: CONTRACT_TYPE_OPTIONS.find((opt) => opt.value === value)?.label,
      purpose: PURPOSE_OPTIONS.find((opt) => opt.value === value)?.label,
    };
    return labels[key] || value;
  };

  const activeFilters = Object.entries(filters).filter(([, val]) => val !== "");

  return (
    <motion.div
      className="bg-[#111827]/60 backdrop-blur-xl rounded-2xl border border-white/5 overflow-hidden"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-5 py-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors border-b border-white/5"
      >
        <div className="flex items-center gap-2">
          <Funnel size={16} className="text-slate-500" />
          <span className="text-sm text-slate-400">تصفية النتائج</span>
          {hasActiveFilters && (
            <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-1 rounded-full">
              {activeFilters.length} فعال
            </span>
          )}
        </div>
        <div className="text-xs text-slate-500">
          {isExpanded ? "إخفاء" : "إظهار"}
        </div>
      </button>

      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="p-5 space-y-5 border-t border-white/5"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className={labelClasses}>الاستخدام</label>
              <select
                name="usage"
                value={filters.usage}
                onChange={handleChange}
                className={inputClasses}
              >
                <option value="">الكل</option>
                {USAGE_CLASSIFICATION_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClasses}>المدينة</label>
              <input
                name="city"
                type="text"
                value={filters.city}
                onChange={handleChange}
                placeholder="ابحث عن مدينة"
                className={inputClasses}
              />
            </div>

            <div>
              <label className={labelClasses}>الحي</label>
              <input
                name="district"
                type="text"
                value={filters.district}
                onChange={handleChange}
                placeholder="ابحث عن حي"
                className={inputClasses}
              />
            </div>

            <div>
              <label className={labelClasses}>نوع التعاقد</label>
              <select
                name="contractType"
                value={filters.contractType}
                onChange={handleChange}
                className={inputClasses}
              >
                <option value="">الكل</option>
                {CONTRACT_TYPE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClasses}>الغرض</label>
              <select
                name="purpose"
                value={filters.purpose}
                onChange={handleChange}
                className={inputClasses}
              >
                <option value="">الكل</option>
                {PURPOSE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <h4 className="text-sm text-slate-400 mb-3">نطاق السعر</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClasses}>من</label>
                <input
                  name="minPrice"
                  type="number"
                  value={filters.minPrice}
                  onChange={handleChange}
                  placeholder="السعر الأدنى"
                  className={inputClasses}
                />
              </div>
              <div>
                <label className={labelClasses}>إلى</label>
                <input
                  name="maxPrice"
                  type="number"
                  value={filters.maxPrice}
                  onChange={handleChange}
                  placeholder="السعر الأعلى"
                  className={inputClasses}
                />
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm text-slate-400 mb-3">نطاق المساحة (م²)</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClasses}>من</label>
                <input
                  name="minArea"
                  type="number"
                  value={filters.minArea}
                  onChange={handleChange}
                  placeholder="المساحة الصغرى"
                  className={inputClasses}
                />
              </div>
              <div>
                <label className={labelClasses}>إلى</label>
                <input
                  name="maxArea"
                  type="number"
                  value={filters.maxArea}
                  onChange={handleChange}
                  placeholder="المساحة الكبرى"
                  className={inputClasses}
                />
              </div>
            </div>
          </div>

          {hasActiveFilters && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={clearFilters}
              className="w-full py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg flex items-center justify-center gap-2 transition-colors border border-red-500/20"
            >
              <ArrowsClockwise size={14} />
              مسح الفلاتر
            </motion.button>
          )}
        </motion.div>
      )}

      {activeFilters.length > 0 && (
        <div className="px-5 py-3 bg-white/[0.02] border-t border-white/5 flex flex-wrap gap-2">
          {activeFilters.map(([key, value]) => (
            <motion.div
              key={key}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-full text-xs text-emerald-300"
            >
              <span>{getFilterLabel(key, value) || value}</span>
              <button
                onClick={() =>
                  handleChange({
                    target: { name: key, value: "" },
                  })
                }
                className="hover:text-emerald-200"
              >
                <X size={12} />
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
});

OffersFilters.displayName = "OffersFilters";
export default OffersFilters;

