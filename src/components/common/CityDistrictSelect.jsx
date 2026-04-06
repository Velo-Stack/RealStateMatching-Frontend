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
  w-full rounded-xl border border-white/10 bg-white/5
  px-4 py-3 text-sm text-white outline-none transition-all duration-300
  hover:bg-white/10 focus:border-amber-500/60 focus:bg-white/10
  focus:shadow-[0_0_20px_rgba(212,175,55,0.22)]
`.replace(/\s+/g, ' ').trim();

const searchInputClasses = `
  w-full rounded-lg border border-white/10 bg-black/20
  px-10 py-2.5 text-sm text-white placeholder-slate-500 outline-none
  transition-all duration-300 focus:border-amber-500/60
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
}) => {
  const { cities, citiesLoading, cityOptions } = useMeta();
  const [districtSearch, setDistrictSearch] = useState('');
  const [debouncedDistrictSearch, setDebouncedDistrictSearch] = useState('');
  const [isDistrictDropdownOpen, setIsDistrictDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  const selectedCityValue = toSelectValue(cityValue);
  const selectedDistrictValue = toSelectValue(districtValue);

  const selectedCityId = useCityId
    ? toNumericIdOrNull(selectedCityValue)
    : toNumericIdOrNull(cities.find((city) => city.name === selectedCityValue)?.id);

  const { isLoading: neighborhoodsLoading, neighborhoodOptions } =
    useNeighborhoods(selectedCityId);

  const deferredDistrictSearch = useDeferredValue(debouncedDistrictSearch);
  const displayCities = cities.length > 0 ? cities : FALLBACK_CITIES;

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedDistrictSearch(districtSearch);
    }, 250);

    return () => window.clearTimeout(timeoutId);
  }, [districtSearch]);

  useEffect(() => {
    setDistrictSearch('');
    setDebouncedDistrictSearch('');
    setIsDistrictDropdownOpen(false);
  }, [selectedCityId]);

  useEffect(() => {
    if (!isDistrictDropdownOpen) return;

    const timeoutId = window.setTimeout(() => {
      searchInputRef.current?.focus();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [isDistrictDropdownOpen]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!dropdownRef.current?.contains(event.target)) {
        setIsDistrictDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const filteredNeighborhoodOptions = useMemo(() => {
    const normalizedQuery = normalizeSearchText(deferredDistrictSearch);
    if (!normalizedQuery) return neighborhoodOptions;

    return neighborhoodOptions.filter((option) =>
      normalizeSearchText(option.label).includes(normalizedQuery),
    );
  }, [deferredDistrictSearch, neighborhoodOptions]);

  const selectedNeighborhoodLabel =
    neighborhoodOptions.find(
      (option) => String(option.value) === selectedDistrictValue,
    )?.label || '';

  const handleCityChange = (event) => {
    onCityChange(event);
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

  const districtButtonLabel = !selectedCityId
    ? 'اختر المدينة أولًا'
    : selectedNeighborhoodLabel || 'اختر الحي';

  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className={labelClasses}>المدينة</label>
        <select
          name={cityName}
          className={inputClasses}
          value={selectedCityValue}
          onChange={handleCityChange}
          required={required}
          disabled={citiesLoading}
        >
          <option value="">
            {citiesLoading ? 'جاري التحميل...' : 'اختر المدينة'}
          </option>
          {useCityId
            ? cityOptions.map((option) => (
                <option key={option.value} value={String(option.value)}>
                  {option.label}
                </option>
              ))
            : displayCities.map((city) => (
                <option key={city.id} value={city.name}>
                  {city.name}
                </option>
              ))}
        </select>
      </div>

      <div>
        <label className={labelClasses}>الحي</label>
        {useCityId && selectedCityId ? (
          <div ref={dropdownRef} className="relative">
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
              className={`${dropdownButtonClasses} flex items-center justify-between gap-3 text-right ${
                !selectedNeighborhoodLabel ? 'text-slate-500' : 'text-white'
              }`}
            >
              <span className="truncate">
                {neighborhoodsLoading ? 'جاري تحميل الأحياء...' : districtButtonLabel}
              </span>
              <CaretDown
                size={16}
                className={`shrink-0 text-slate-400 transition-transform duration-200 ${
                  isDistrictDropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {isDistrictDropdownOpen && (
              <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-2xl border border-white/10 bg-[#0f172a]/98 shadow-2xl shadow-black/30 backdrop-blur-xl">
                <div className="border-b border-white/8 p-3">
                  <div className="relative">
                    <MagnifyingGlass
                      size={16}
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
                    />
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={districtSearch}
                      onChange={(event) => setDistrictSearch(event.target.value)}
                      placeholder="ابحث عن الحي"
                      className={searchInputClasses}
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
                          className={`flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-right text-sm transition-all duration-200 ${
                            isSelected
                              ? 'bg-amber-500/15 text-white'
                              : 'text-slate-300 hover:bg-white/5 hover:text-white'
                          }`}
                        >
                          <span className="truncate">{option.label}</span>
                          {isSelected && (
                            <Check size={16} weight="bold" className="shrink-0 text-amber-400" />
                          )}
                        </button>
                      );
                    })
                  ) : (
                    <div className="px-3 py-4 text-sm text-slate-500">
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
    </div>
  );
};

export default CityDistrictSelect;
