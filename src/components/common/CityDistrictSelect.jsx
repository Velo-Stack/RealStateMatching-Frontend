import {
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { CaretDown, Check, MagnifyingGlass } from 'phosphor-react';
import { useMeta, useNeighborhoods } from '../../hooks';
import { inputClasses, labelClasses } from '../../constants/styles';

const FALLBACK_CITIES = [
  { id: 1, name: 'الرياض' },
  { id: 2, name: 'جدة' },
  { id: 3, name: 'مكة المكرمة' },
  { id: 4, name: 'المدينة المنورة' },
  { id: 5, name: 'الدمام' },
];

const dropdownButtonClasses = `
  w-full rounded-xl border px-4 py-3 text-sm outline-none transition-all duration-300
  focus:shadow-[0_0_20px_rgba(212,175,55,0.22)]
`.replace(/\s+/g, ' ').trim();

const searchInputClasses = `
  w-full rounded-lg border px-10 py-2.5 text-sm outline-none transition-all duration-300
`.replace(/\s+/g, ' ').trim();

const toNumericIdOrNull = (value) => {
  if (value === '' || value === null || value === undefined) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const toSelectValue = (value) => {
  if (value === null || value === undefined) return '';
  return String(value);
};

const normalizeSearchText = (value) =>
  String(value || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ');

const CityDistrictSelect = ({
  cityValue,
  districtValue,
  onCityChange,
  onDistrictChange,
  cityName = 'city',
  districtName = 'district',
  useCityId = false,
  required = false,
  hideDistrict = false,
  fullWidth = false,
}) => {
  const { cities, citiesLoading, cityOptions } = useMeta();
  const [citySearch, setCitySearch] = useState('');
  const [debouncedCitySearch, setDebouncedCitySearch] = useState('');
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const [districtSearch, setDistrictSearch] = useState('');
  const [debouncedDistrictSearch, setDebouncedDistrictSearch] = useState('');
  const [isDistrictDropdownOpen, setIsDistrictDropdownOpen] = useState(false);
  const cityDropdownRef = useRef(null);
  const districtDropdownRef = useRef(null);
  const citySearchInputRef = useRef(null);
  const districtSearchInputRef = useRef(null);

  const selectedCityValue = toSelectValue(cityValue);
  const selectedDistrictValue = toSelectValue(districtValue);

  const selectedCityId = useCityId
    ? toNumericIdOrNull(selectedCityValue)
    : toNumericIdOrNull(cities.find((city) => city.name === selectedCityValue)?.id);

  const { isLoading: neighborhoodsLoading, neighborhoodOptions } =
    useNeighborhoods(selectedCityId);

  const deferredCitySearch = useDeferredValue(debouncedCitySearch);
  const deferredDistrictSearch = useDeferredValue(debouncedDistrictSearch);
  const displayCities = cities.length > 0 ? cities : FALLBACK_CITIES;

  // Debounce city search
  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedCitySearch(citySearch);
    }, 250);

    return () => window.clearTimeout(timeoutId);
  }, [citySearch]);

  // Debounce district search
  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedDistrictSearch(districtSearch);
    }, 250);

    return () => window.clearTimeout(timeoutId);
  }, [districtSearch]);

  // Reset district when city changes
  useEffect(() => {
    setDistrictSearch('');
    setDebouncedDistrictSearch('');
    setIsDistrictDropdownOpen(false);
  }, [selectedCityId]);

  // Focus city search input when dropdown opens
  useEffect(() => {
    if (!isCityDropdownOpen) return;

    const timeoutId = window.setTimeout(() => {
      citySearchInputRef.current?.focus();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [isCityDropdownOpen]);

  // Focus district search input when dropdown opens
  useEffect(() => {
    if (!isDistrictDropdownOpen) return;

    const timeoutId = window.setTimeout(() => {
      districtSearchInputRef.current?.focus();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [isDistrictDropdownOpen]);

  // Handle outside clicks for city dropdown
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!cityDropdownRef.current?.contains(event.target)) {
        setIsCityDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Handle outside clicks for district dropdown
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!districtDropdownRef.current?.contains(event.target)) {
        setIsDistrictDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Filter cities based on search
  const filteredCityOptions = useMemo(() => {
    const normalizedQuery = normalizeSearchText(deferredCitySearch);
    if (!normalizedQuery) {
      return useCityId
        ? cityOptions
        : displayCities.map((city) => ({ value: city.name, label: city.name }));
    }

    const options = useCityId
      ? cityOptions
      : displayCities.map((city) => ({ value: city.name, label: city.name }));

    return options.filter((option) =>
      normalizeSearchText(option.label).includes(normalizedQuery),
    );
  }, [deferredCitySearch, cityOptions, displayCities, useCityId]);

  // Filter neighborhoods based on search
  const filteredNeighborhoodOptions = useMemo(() => {
    const normalizedQuery = normalizeSearchText(deferredDistrictSearch);
    if (!normalizedQuery) return neighborhoodOptions;

    return neighborhoodOptions.filter((option) =>
      normalizeSearchText(option.label).includes(normalizedQuery),
    );
  }, [deferredDistrictSearch, neighborhoodOptions]);

  const selectedCityLabel = useCityId
    ? cityOptions.find((option) => String(option.value) === selectedCityValue)?.label || ''
    : selectedCityValue;

  const selectedNeighborhoodLabel =
    neighborhoodOptions.find(
      (option) => String(option.value) === selectedDistrictValue,
    )?.label || '';

  const handleCitySelect = (value) => {
    onCityChange({
      target: {
        name: cityName,
        value: String(value),
      },
    });
    setIsCityDropdownOpen(false);
    setCitySearch('');
    setDebouncedCitySearch('');
    setDistrictSearch('');
    setDebouncedDistrictSearch('');
    setIsDistrictDropdownOpen(false);

    if (onDistrictChange) {
      onDistrictChange({
        target: {
          name: districtName,
          value: '',
        },
      });
    }
  };

  const handleDistrictSelect = (value) => {
    onDistrictChange?.({
      target: {
        name: districtName,
        value: String(value),
      },
    });
    setIsDistrictDropdownOpen(false);
  };

  const cityButtonLabel = selectedCityLabel || 'اختر المدينة';
  const districtButtonLabel = !selectedCityId
    ? 'اختر المدينة أولًا'
    : selectedNeighborhoodLabel || 'اختر الحي';

  return (
    <div className={hideDistrict || fullWidth ? "w-full" : "grid grid-cols-2 gap-4"}>
      {/* City Dropdown with Search */}
      <div>
        <label className={labelClasses}>المدينة</label>
        <div ref={cityDropdownRef} className="relative">
          <input
            name={cityName}
            value={selectedCityValue}
            onChange={() => {}}
            required={required}
            readOnly
            tabIndex={-1}
            aria-hidden="true"
            className="absolute h-0 w-0 opacity-0 pointer-events-none"
          />

          <button
            type="button"
            onClick={() =>
              !citiesLoading && setIsCityDropdownOpen((current) => !current)
            }
            disabled={citiesLoading}
            className={`${dropdownButtonClasses} flex items-center justify-between gap-3 text-right`}
            style={{
              backgroundColor: 'var(--bg-input)',
              borderColor: 'var(--border-default)',
              color: selectedCityLabel
                ? 'var(--text-primary)'
                : 'var(--text-dim)',
            }}
          >
            <span className="truncate">
              {citiesLoading ? 'جاري التحميل...' : cityButtonLabel}
            </span>
            <CaretDown
              size={16}
              className={`shrink-0 transition-transform duration-200 ${
                isCityDropdownOpen ? 'rotate-180' : ''
              }`}
              style={{ color: 'var(--text-dim)' }}
            />
          </button>

          {isCityDropdownOpen && (
            <div
              className="absolute z-50 mt-2 w-full overflow-hidden rounded-2xl border shadow-2xl backdrop-blur-xl"
              style={{
                backgroundColor: 'var(--card-bg)',
                borderColor: 'var(--border-default)',
                boxShadow: 'var(--shadow-lg)',
              }}
            >
              <div
                className="p-3"
                style={{ borderBottom: '1px solid var(--border-subtle)' }}
              >
                <div className="relative">
                  <MagnifyingGlass
                    size={16}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
                    style={{ color: 'var(--text-dim)' }}
                  />
                  <input
                    ref={citySearchInputRef}
                    type="text"
                    value={citySearch}
                    onChange={(event) => setCitySearch(event.target.value)}
                    placeholder="ابحث عن المدينة"
                    className={searchInputClasses}
                    style={{
                      backgroundColor: 'var(--bg-base)',
                      borderColor: 'var(--border-default)',
                      color: 'var(--text-primary)',
                    }}
                  />
                </div>
              </div>

              <div className="max-h-64 overflow-y-auto p-2">
                {filteredCityOptions.length > 0 ? (
                  filteredCityOptions.map((option) => {
                    const isSelected =
                      String(option.value) === selectedCityValue;

                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => handleCitySelect(option.value)}
                        className="flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-right text-sm transition-all duration-200"
                        style={{
                          backgroundColor: isSelected
                            ? 'var(--accent-glow)'
                            : 'transparent',
                          color: 'var(--text-primary)',
                        }}
                        onMouseEnter={(event) => {
                          if (!isSelected) {
                            event.currentTarget.style.backgroundColor =
                              'var(--glass-hover)';
                          }
                        }}
                        onMouseLeave={(event) => {
                          event.currentTarget.style.backgroundColor = isSelected
                            ? 'var(--accent-glow)'
                            : 'transparent';
                        }}
                      >
                        <span className="truncate">{option.label}</span>
                        {isSelected && (
                          <Check
                            size={16}
                            weight="bold"
                            className="shrink-0"
                            style={{ color: 'var(--accent-dark)' }}
                          />
                        )}
                      </button>
                    );
                  })
                ) : (
                  <div
                    className="px-3 py-4 text-sm"
                    style={{ color: 'var(--text-dim)' }}
                  >
                    لا توجد نتائج مطابقة
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* District Dropdown with Search */}
      {!hideDistrict && (
      <div>
        <label className={labelClasses}>الحي</label>
        {useCityId && selectedCityId ? (
          <div ref={districtDropdownRef} className="relative">
            <input
              name={districtName}
              value={selectedDistrictValue}
              onChange={() => {}}
              required={required}
              readOnly
              tabIndex={-1}
              aria-hidden="true"
              className="absolute h-0 w-0 opacity-0 pointer-events-none"
            />

            <button
              type="button"
              onClick={() =>
                !neighborhoodsLoading &&
                setIsDistrictDropdownOpen((current) => !current)
              }
              disabled={!selectedCityId || neighborhoodsLoading}
              className={`${dropdownButtonClasses} flex items-center justify-between gap-3 text-right`}
              style={{
                backgroundColor: 'var(--bg-input)',
                borderColor: 'var(--border-default)',
                color: selectedNeighborhoodLabel
                  ? 'var(--text-primary)'
                  : 'var(--text-dim)',
              }}
            >
              <span className="truncate">
                {neighborhoodsLoading ? 'جاري تحميل الأحياء...' : districtButtonLabel}
              </span>
              <CaretDown
                size={16}
                className={`shrink-0 transition-transform duration-200 ${
                  isDistrictDropdownOpen ? 'rotate-180' : ''
                }`}
                style={{ color: 'var(--text-dim)' }}
              />
            </button>

            {isDistrictDropdownOpen && (
              <div
                className="absolute z-50 mt-2 w-full overflow-hidden rounded-2xl border shadow-2xl backdrop-blur-xl"
                style={{
                  backgroundColor: 'var(--card-bg)',
                  borderColor: 'var(--border-default)',
                  boxShadow: 'var(--shadow-lg)',
                }}
              >
                <div
                  className="p-3"
                  style={{ borderBottom: '1px solid var(--border-subtle)' }}
                >
                  <div className="relative">
                    <MagnifyingGlass
                      size={16}
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
                      style={{ color: 'var(--text-dim)' }}
                    />
                    <input
                      ref={districtSearchInputRef}
                      type="text"
                      value={districtSearch}
                      onChange={(event) => setDistrictSearch(event.target.value)}
                      placeholder="ابحث عن الحي"
                      className={searchInputClasses}
                      style={{
                        backgroundColor: 'var(--bg-base)',
                        borderColor: 'var(--border-default)',
                        color: 'var(--text-primary)',
                      }}
                    />
                  </div>
                </div>

                <div className="max-h-64 overflow-y-auto p-2">
                  {filteredNeighborhoodOptions.length > 0 ? (
                    filteredNeighborhoodOptions.map((option) => {
                      const isSelected =
                        String(option.value) === selectedDistrictValue;

                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => handleDistrictSelect(option.value)}
                          className="flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-right text-sm transition-all duration-200"
                          style={{
                            backgroundColor: isSelected
                              ? 'var(--accent-glow)'
                              : 'transparent',
                            color: 'var(--text-primary)',
                          }}
                          onMouseEnter={(event) => {
                            if (!isSelected) {
                              event.currentTarget.style.backgroundColor =
                                'var(--glass-hover)';
                            }
                          }}
                          onMouseLeave={(event) => {
                            event.currentTarget.style.backgroundColor = isSelected
                              ? 'var(--accent-glow)'
                              : 'transparent';
                          }}
                        >
                          <span className="truncate">{option.label}</span>
                          {isSelected && (
                            <Check
                              size={16}
                              weight="bold"
                              className="shrink-0"
                              style={{ color: 'var(--accent-dark)' }}
                            />
                          )}
                        </button>
                      );
                    })
                  ) : (
                    <div
                      className="px-3 py-4 text-sm"
                      style={{ color: 'var(--text-dim)' }}
                    >
                      لا توجد نتائج مطابقة
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <input
            name={districtName}
            className={inputClasses}
            value={selectedDistrictValue}
            onChange={onDistrictChange}
            placeholder="أدخل الحي"
            required={required}
            disabled={!selectedCityValue}
          />
        )}
      </div>
      )}
    </div>
  );
};

export default CityDistrictSelect;
