import { useEffect, useId, useRef, useState } from "react";
import {
  Building2,
  Check,
  ChevronDown,
  Home,
  MapPinned,
  Search,
} from "lucide-react";
import useMeta from "../../../hooks/useMeta";

const TYPE_OPTIONS = [
  { value: "", label: "جميع الأنواع" },
  { value: "RESIDENTIAL", label: "سكني" },
  { value: "COMMERCIAL", label: "تجاري" },
  { value: "MIXED_USE", label: "متعدد الاستخدامات" },
  { value: "LAND", label: "أراضي" },
];

const STATUS_OPTIONS = [
  { value: "", label: "جميع الحالات" },
  { value: "ACTIVE", label: "متاح" },
  { value: "COMING_SOON", label: "قريباً" },
  { value: "COMPLETED", label: "مكتمل" },
  { value: "SOLD_OUT", label: "مباع بالكامل" },
];

const getOptionLabel = (options, value, fallback) =>
  options.find((option) => option.value === value)?.label || fallback;

const SidebarSelect = ({
  icon: Icon,
  label,
  value,
  options,
  onChange,
  isOpen,
  onToggle,
  onClose,
  searchPlaceholder = "ابحث...",
}) => {
  const rootRef = useRef(null);
  const searchRef = useRef(null);
  const listId = useId();
  const [query, setQuery] = useState("");
  const selectedLabel = getOptionLabel(options, value, options[0]?.label || "");

  const normalizedQuery = query.trim().toLowerCase();
  const filteredOptions = normalizedQuery
    ? options.filter((option) =>
        option.label.toLowerCase().includes(normalizedQuery)
      )
    : options;

  useEffect(() => {
    if (!isOpen) {
      setQuery("");
      return undefined;
    }

    const focusTimer = window.setTimeout(() => {
      searchRef.current?.focus();
    }, 0);

    const handlePointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) onClose();
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={onToggle}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listId}
        className={`flex w-full items-center gap-3 rounded-lg border bg-white px-3.5 py-3 text-right transition-colors ${
          isOpen
            ? "border-[#9d7857] ring-1 ring-[#9d7857]/30"
            : "border-gray-200 hover:border-[#9d7857]/50"
        }`}
      >
        <Icon className="h-4 w-4 shrink-0 text-[#9d7857]" strokeWidth={2} />
        <span className="min-w-0 flex-1 truncate text-sm text-gray-700">
          <span className="ml-1 text-gray-400">{label}:</span>
          {selectedLabel}
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-gray-400 transition-transform ${
            isOpen ? "rotate-180 text-[#9d7857]" : ""
          }`}
          strokeWidth={2}
        />
      </button>

      {isOpen && (
        <div className="absolute inset-x-0 top-[calc(100%+6px)] z-30 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-[0_16px_40px_rgba(0,0,0,0.14)]">
          <div className="border-b border-gray-100 p-2">
            <div className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2 focus-within:bg-white focus-within:ring-1 focus-within:ring-[#9d7857]/40">
              <Search className="h-4 w-4 shrink-0 text-gray-400" strokeWidth={2} />
              <input
                ref={searchRef}
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={searchPlaceholder}
                className="w-full bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400"
                aria-label={`بحث في ${label}`}
              />
            </div>
          </div>

          <ul id={listId} role="listbox" className="max-h-52 overflow-auto py-1.5">
            {filteredOptions.length === 0 ? (
              <li className="px-4 py-3 text-center text-sm text-gray-400">
                لا توجد نتائج
              </li>
            ) : (
              filteredOptions.map((option) => {
                const isSelected = value === option.value;
                return (
                  <li key={option.value || `${label}-all`}>
                    <button
                      type="button"
                      onClick={() => {
                        onChange(option.value);
                        onClose();
                      }}
                      className={`flex w-full items-center justify-between gap-3 px-4 py-2.5 text-sm transition-colors ${
                        isSelected
                          ? "bg-[#9d7857]/10 font-semibold text-[#9d7857]"
                          : "text-gray-700 hover:bg-gray-50 hover:text-[#9d7857]"
                      }`}
                    >
                      <span>{option.label}</span>
                      {isSelected && (
                        <Check className="h-4 w-4 text-[#9d7857]" strokeWidth={2.5} />
                      )}
                    </button>
                  </li>
                );
              })
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

const ProjectsFilters = ({ filters, onChange }) => {
  const { cities = [] } = useMeta();
  const [openDropdown, setOpenDropdown] = useState(null);

  const cityOptions = [
    { value: "", label: "جميع المدن" },
    ...cities.map((city) => {
      const cityName = city.nameAr || city.name;
      return { value: cityName, label: cityName };
    }),
  ];

  const hasActiveFilters = Object.keys(filters).length > 0;
  const closeDropdown = () => setOpenDropdown(null);

  const updateFilter = (key, value) => {
    const next = { ...filters };
    if (value) next[key] = value;
    else delete next[key];
    onChange(next);
  };

  return (
    <aside
      className="rounded-xl border border-gray-100 bg-white p-5 shadow-[0_10px_30px_rgba(0,0,0,0.06)] font-cairo md:p-6"
      dir="rtl"
    >
      <div className="mb-6">
        <h2 className="text-xl font-bold text-[#9d7857]">ابحث عن مشروعك</h2>
        <div className="mt-2 h-[3px] w-14 rounded-full bg-[#9d7857]" />
      </div>

      <div className="space-y-3.5">
        <SidebarSelect
          icon={MapPinned}
          label="المدينة"
          value={filters.city || ""}
          options={cityOptions}
          onChange={(value) => updateFilter("city", value)}
          isOpen={openDropdown === "city"}
          onToggle={() =>
            setOpenDropdown((current) => (current === "city" ? null : "city"))
          }
          onClose={closeDropdown}
          searchPlaceholder="ابحث عن مدينة..."
        />

        <SidebarSelect
          icon={Home}
          label="الحالة"
          value={filters.status || ""}
          options={STATUS_OPTIONS}
          onChange={(value) => updateFilter("status", value)}
          isOpen={openDropdown === "status"}
          onToggle={() =>
            setOpenDropdown((current) => (current === "status" ? null : "status"))
          }
          onClose={closeDropdown}
          searchPlaceholder="ابحث عن حالة..."
        />

        <SidebarSelect
          icon={Building2}
          label="النوع"
          value={filters.type || ""}
          options={TYPE_OPTIONS}
          onChange={(value) => updateFilter("type", value)}
          isOpen={openDropdown === "type"}
          onToggle={() =>
            setOpenDropdown((current) => (current === "type" ? null : "type"))
          }
          onClose={closeDropdown}
          searchPlaceholder="ابحث عن نوع..."
        />

        <button
          type="button"
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-[#9d7857] px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-[#856345]"
        >
          <Search className="h-4 w-4" strokeWidth={2.25} />
          بحث
        </button>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={() => onChange({})}
            className="w-full text-sm font-semibold text-red-500 transition-colors hover:text-red-600"
          >
            إعادة تعيين الفلاتر
          </button>
        )}
      </div>
    </aside>
  );
};

export default ProjectsFilters;
