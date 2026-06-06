export const SAUDI_PHONE_PATTERN = /^5\d{8}$/;

export const normalizeSaudiPhoneDigits = (value) =>
  String(value || "").replace(/\D/g, "").slice(0, 9);

export const formatSaudiPhoneDisplay = (value) => {
  const digits = normalizeSaudiPhoneDigits(value);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)} ${digits.slice(3)}`;
  return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
};

export const validateSaudiPhone = (phone, { required = true } = {}) => {
  const digits = normalizeSaudiPhoneDigits(phone);
  if (!digits) {
    return required ? "رقم الجوال مطلوب" : null;
  }
  if (!SAUDI_PHONE_PATTERN.test(digits)) {
    return "رقم الجوال يجب أن يبدأ بـ 5 ويتكون من 9 أرقام";
  }
  return null;
};
