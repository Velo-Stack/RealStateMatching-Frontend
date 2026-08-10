const NATIONAL_ID_PATTERN = /^\d{10}$/;

/**
 * Normalizes National ID value: converts Arabic-Indic numerals to ASCII digits
 * and strips any non-numeric characters, truncating at 10 digits.
 */
export const normalizeNationalIdDigits = (value) => {
  if (!value) return "";
  return String(value)
    .replace(/[٠-٩]/g, (d) => "٠١٢٣٤٥٦٧٨٩".indexOf(d))
    .replace(/[^\d]/g, "")
    .slice(0, 10);
};

/**
 * Validates Saudi National ID / Iqama number (must be exactly 10 digits).
 */
export const validateNationalId = (nationalId, { required = true } = {}) => {
  const normalized = normalizeNationalIdDigits(nationalId);
  if (!normalized) {
    return required ? "رقم الهوية الشخصية / الوطنية مطلوب إجبارياً" : null;
  }
  if (!NATIONAL_ID_PATTERN.test(normalized)) {
    return "رقم الهوية الشخصية / الوطنية يجب أن يتكون من 10 أرقام بالضبط";
  }
  return null;
};
