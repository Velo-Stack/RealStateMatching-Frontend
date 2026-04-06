import { useDeferredValue, useEffect, useMemo, useState } from 'react';
import { MagnifyingGlass } from 'phosphor-react';
import { useMeta, useNeighborhoods } from '../../hooks';
import { inputClasses, labelClasses } from '../../constants/styles';

const FALLBACK_CITIES = [
  { id: 1, name: 'الرياض' },
  { id: 2, name: 'جدة' },
  { id: 3, name: 'مكة المكرمة' },
  { id: 4, name: 'المدينة المنورة' },
  { id: 5, name: 'الدمام' },
];

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

  const selectedCityValue = toSelectValue(cityValue);
  const selectedDistrictValue = toSelectValue(districtValue);

  const selectedCityId = useCityId
    ? toNumericIdOrNull(selectedCityValue)
    : toNumericIdOrNull(cities.find((city) => city.name === selectedCityValue)?.id);

  const { isLoading: neighborhoodsLoading, neighborhoodOptions } = useNeighborhoods(selectedCityId);

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
  }, [selectedCityId]);

  const filteredNeighborhoodOptions = useMemo(() => {
    const normalizedQuery = normalizeSearchText(deferredDistrictSearch);
    if (!normalizedQuery) return neighborhoodOptions;

    return neighborhoodOptions.filter((option) =>
      normalizeSearchText(option.label).includes(normalizedQuery),
    );
  }, [deferredDistrictSearch, neighborhoodOptions]);

  const handleCityChange = (event) => {
    onCityChange(event);
    setDistrictSearch('');
    setDebouncedDistrictSearch('');

    if (onDistrictChange) {
      onDistrictChange({
        target: {
          name: districtName,
          value: '',
        },
      });
    }
  };

  const neighborhoodPlaceholder = !selectedCityId
    ? 'اختر المدينة أولًا'
    : neighborhoodsLoading
      ? 'جاري تحميل الأحياء...'
      : filteredNeighborhoodOptions.length === 0
        ? 'لا توجد نتائج مطابقة'
        : 'اختر الحي';

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
          <div className="space-y-3">
            <div className="relative">
              <MagnifyingGlass
                size={16}
                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
              />
              <input
                type="text"
                value={districtSearch}
                onChange={(event) => setDistrictSearch(event.target.value)}
                placeholder="ابحث في الأحياء"
                className={`${inputClasses} pr-11`}
                disabled={neighborhoodsLoading}
              />
            </div>

            <select
              name={districtName}
              className={inputClasses}
              value={selectedDistrictValue}
              onChange={onDistrictChange}
              required={required}
              disabled={!selectedCityId || neighborhoodsLoading}
            >
              <option value="">{neighborhoodPlaceholder}</option>
              {filteredNeighborhoodOptions.map((option) => (
                <option key={option.value} value={String(option.value)}>
                  {option.label}
                </option>
              ))}
            </select>
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
