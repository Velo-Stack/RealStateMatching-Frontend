import { useMeta, useNeighborhoods } from '../../hooks';
import { inputClasses, labelClasses } from '../../constants/styles';

const FALLBACK_CITIES = [
  { id: 1, name: '\u0627\u0644\u0631\u064A\u0627\u0636' },
  { id: 2, name: '\u062C\u062F\u0629' },
  { id: 3, name: '\u0645\u0643\u0629 \u0627\u0644\u0645\u0643\u0631\u0645\u0629' },
  { id: 4, name: '\u0627\u0644\u0645\u062F\u064A\u0646\u0629 \u0627\u0644\u0645\u0646\u0648\u0631\u0629' },
  { id: 5, name: '\u0627\u0644\u062F\u0645\u0627\u0645' },
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

  const selectedCityValue = toSelectValue(cityValue);
  const selectedDistrictValue = toSelectValue(districtValue);

  const selectedCityId = useCityId
    ? toNumericIdOrNull(selectedCityValue)
    : toNumericIdOrNull(cities.find((city) => city.name === selectedCityValue)?.id);

  const { isLoading: neighborhoodsLoading, neighborhoodOptions } = useNeighborhoods(selectedCityId);

  const displayCities = cities.length > 0 ? cities : FALLBACK_CITIES;

  const handleCityChange = (event) => {
    onCityChange(event);

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
    ? '\u0627\u062E\u062A\u0631 \u0627\u0644\u0645\u062F\u064A\u0646\u0629 \u0623\u0648\u0644\u0627\u064B'
    : neighborhoodsLoading
      ? '\u062C\u0627\u0631\u064A \u062A\u062D\u0645\u064A\u0644 \u0627\u0644\u0623\u062D\u064A\u0627\u0621...'
      : '\u0627\u062E\u062A\u0631 \u0627\u0644\u062D\u064A';

  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className={labelClasses}>{'\u0627\u0644\u0645\u062F\u064A\u0646\u0629'}</label>
        <select
          name={cityName}
          className={inputClasses}
          value={selectedCityValue}
          onChange={handleCityChange}
          required={required}
          disabled={citiesLoading}
        >
          <option value="">
            {citiesLoading ? '\u062C\u0627\u0631\u064A \u0627\u0644\u062A\u062D\u0645\u064A\u0644...' : '\u0627\u062E\u062A\u0631 \u0627\u0644\u0645\u062F\u064A\u0646\u0629'}
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
        <label className={labelClasses}>{'\u0627\u0644\u062D\u064A'}</label>
        {useCityId && selectedCityId ? (
          <select
            name={districtName}
            className={inputClasses}
            value={selectedDistrictValue}
            onChange={onDistrictChange}
            required={required}
            disabled={!selectedCityId || neighborhoodsLoading}
          >
            <option value="">{neighborhoodPlaceholder}</option>
            {neighborhoodOptions.map((option) => (
              <option key={option.value} value={String(option.value)}>
                {option.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            name={districtName}
            className={inputClasses}
            value={selectedDistrictValue}
            onChange={onDistrictChange}
            placeholder={'\u0623\u062F\u062E\u0644 \u0627\u0644\u062D\u064A'}
            required={required}
            disabled={!selectedCityValue}
          />
        )}
      </div>
    </div>
  );
};

export default CityDistrictSelect;
