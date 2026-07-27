import { useState, useRef, useEffect, useDeferredValue } from "react";
import { X, MapPin, Check } from "phosphor-react";
import { useNeighborhoods } from "../../hooks/useMeta";
import { labelClasses, inputClasses } from "../../constants/styles";

const normalizeSearchText = (text) => {
  if (!text) return "";
  return text
    .toLowerCase()
    .replace(/أ|إ|آ/g, "ا")
    .replace(/ة/g, "ه")
    .trim();
};

const MultiNeighborhoodSelect = ({
  cityId,
  selectedNeighborhoodIds = [],
  onChange,
  error,
  touched,
  required = false,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  const { isLoading, neighborhoodOptions } = useNeighborhoods(cityId);
  const deferredSearch = useDeferredValue(searchQuery);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchQuery("");
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  // Filter neighborhoods based on search
  const filteredNeighborhoods = neighborhoodOptions.filter((option) => {
    if (!deferredSearch) return true;
    const normalizedQuery = normalizeSearchText(deferredSearch);
    const normalizedLabel = normalizeSearchText(option.label);
    return normalizedLabel.includes(normalizedQuery);
  });

  // Get selected neighborhoods details
  const selectedNeighborhoods = neighborhoodOptions.filter((option) =>
    selectedNeighborhoodIds.includes(option.value)
  );

  const handleToggleNeighborhood = (neighborhoodId) => {
    const newIds = selectedNeighborhoodIds.includes(neighborhoodId)
      ? selectedNeighborhoodIds.filter((id) => id !== neighborhoodId)
      : [...selectedNeighborhoodIds, neighborhoodId];
    
    onChange(newIds);
    setSearchQuery("");
  };

  const handleRemoveNeighborhood = (neighborhoodId, e) => {
    e.stopPropagation();
    const newIds = selectedNeighborhoodIds.filter((id) => id !== neighborhoodId);
    onChange(newIds);
  };

  const buttonLabel = !cityId
    ? "اختر المدينة أولاً"
    : selectedNeighborhoods.length === 0
    ? "اختر الأحياء"
    : `${selectedNeighborhoods.length} حي محدد`;

  const hasError = touched && error;

  return (
    <div>
      <label className={labelClasses}>
        الأحياء {required && <span className="text-red-400">*</span>}
      </label>

      <div ref={dropdownRef} className="relative">
        {/* Selected neighborhoods tags */}
        {selectedNeighborhoods.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-2">
            {selectedNeighborhoods.map((neighborhood) => (
              <span
                key={neighborhood.value}
                className="inline-flex items-center gap-1 rounded-lg border px-2 py-1 text-xs"
                style={{
                  backgroundColor: "var(--bg-elevated)",
                  borderColor: "var(--border-default)",
                  color: "var(--text-primary)",
                }}
              >
                <MapPin size={12} />
                {neighborhood.label}
                <button
                  type="button"
                  onClick={(e) => handleRemoveNeighborhood(neighborhood.value, e)}
                  className="hover:opacity-70"
                  disabled={disabled}
                >
                  <X size={14} />
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Dropdown button */}
        <button
          type="button"
          onClick={() => !disabled && !isLoading && cityId && setIsOpen(!isOpen)}
          disabled={disabled || !cityId || isLoading}
          className={`${inputClasses} flex w-full items-center justify-between gap-3 text-right ${
            hasError ? "border-red-500" : ""
          }`}
          style={{
            backgroundColor: disabled || !cityId ? "var(--bg-disabled)" : "var(--bg-card)",
            borderColor: hasError ? "#ef4444" : "var(--border-default)",
            color: disabled || !cityId ? "var(--text-disabled)" : "var(--text-primary)",
          }}
        >
          <span className={!cityId || selectedNeighborhoods.length === 0 ? "opacity-50" : ""}>
            {buttonLabel}
          </span>
          <svg
            className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Dropdown menu */}
        {isOpen && cityId && (
          <div
            className="absolute z-50 mt-1 w-full rounded-lg border shadow-lg"
            style={{
              backgroundColor: "var(--bg-card)",
              borderColor: "var(--border-default)",
              maxHeight: "300px",
            }}
          >
            {/* Search input */}
            <div className="border-b p-2" style={{ borderColor: "var(--border-default)" }}>
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث عن حي..."
                className="w-full rounded-lg border px-3 py-2 text-sm outline-none"
                style={{
                  backgroundColor: "var(--bg-elevated)",
                  borderColor: "var(--border-default)",
                  color: "var(--text-primary)",
                }}
              />
            </div>

            {/* Neighborhoods list */}
            <div className="max-h-60 overflow-y-auto">
              {isLoading ? (
                <div className="p-4 text-center text-sm" style={{ color: "var(--text-secondary)" }}>
                  جاري التحميل...
                </div>
              ) : filteredNeighborhoods.length === 0 ? (
                <div className="p-4 text-center text-sm" style={{ color: "var(--text-secondary)" }}>
                  لا توجد نتائج
                </div>
              ) : (
                filteredNeighborhoods.map((neighborhood) => {
                  const isSelected = selectedNeighborhoodIds.includes(neighborhood.value);
                  return (
                    <button
                      key={neighborhood.value}
                      type="button"
                      onClick={() => handleToggleNeighborhood(neighborhood.value)}
                      className="flex w-full items-center justify-between gap-2 px-4 py-2 text-right text-sm transition hover:bg-opacity-50"
                      style={{
                        backgroundColor: isSelected ? "var(--accent-glow)" : "transparent",
                        color: isSelected ? "var(--accent)" : "var(--text-primary)",
                      }}
                    >
                      <span className="flex items-center gap-2">
                        <MapPin size={14} />
                        {neighborhood.label}
                      </span>
                      {isSelected && <Check size={16} weight="bold" />}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>

      {hasError && (
        <p className="mt-1 text-xs text-red-400">{error}</p>
      )}
    </div>
  );
};

export default MultiNeighborhoodSelect;
