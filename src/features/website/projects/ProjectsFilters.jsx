import useMeta from "../../../hooks/useMeta";

const ProjectsFilters = ({ filters, onChange }) => {
  const { cities = [] } = useMeta();

  return (
    <div className="flex flex-wrap gap-4 mb-16 justify-center items-center font-cairo">
      {/* City Filter */}
      <div className="relative min-w-[160px]">
        <select
          value={filters.city || ""}
          onChange={(e) => onChange({ ...filters, city: e.target.value || undefined })}
          className="w-full appearance-none px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 focus:outline-none focus:border-[#9d7857] focus:ring-1 focus:ring-[#9d7857] transition-all cursor-pointer pr-10 pl-4"
        >
          <option value="">جميع المدن</option>
          {cities.map((city) => {
            const cityName = city.nameAr || city.name;
            return (
              <option key={city.id} value={cityName}>
                {cityName}
              </option>
            );
          })}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
          </svg>
        </div>
      </div>

      {/* Type Filter */}
      <div className="relative min-w-[160px]">
        <select
          value={filters.type || ""}
          onChange={(e) => onChange({ ...filters, type: e.target.value || undefined })}
          className="w-full appearance-none px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 focus:outline-none focus:border-[#9d7857] focus:ring-1 focus:ring-[#9d7857] transition-all cursor-pointer pr-10 pl-4"
        >
          <option value="">جميع الأنواع</option>
          <option value="RESIDENTIAL">سكني</option>
          <option value="COMMERCIAL">تجاري</option>
          <option value="MIXED_USE">متعدد الاستخدامات</option>
          <option value="LAND">أراضي</option>
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
          </svg>
        </div>
      </div>

      {/* Status Filter */}
      <div className="relative min-w-[160px]">
        <select
          value={filters.status || ""}
          onChange={(e) => onChange({ ...filters, status: e.target.value || undefined })}
          className="w-full appearance-none px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 focus:outline-none focus:border-[#9d7857] focus:ring-1 focus:ring-[#9d7857] transition-all cursor-pointer pr-10 pl-4"
        >
          <option value="">جميع الحالات</option>
          <option value="ACTIVE">متاح</option>
          <option value="COMING_SOON">قريباً</option>
          <option value="COMPLETED">مكتمل</option>
          <option value="SOLD_OUT">مباع بالكامل</option>
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
          </svg>
        </div>
      </div>

      {/* Clear Filters Button */}
      {Object.keys(filters).length > 0 && (
        <button
          onClick={() => onChange({})}
          className="px-4 py-2 text-sm font-semibold text-red-500 hover:text-red-600 transition-colors"
        >
          إعادة تعيين
        </button>
      )}
    </div>
  );
};

export default ProjectsFilters;
