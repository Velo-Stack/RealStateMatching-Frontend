const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateEmail = (email, { required = true } = {}) => {
  const trimmed = String(email || "").trim();
  if (!trimmed) {
    return required ? "البريد الإلكتروني مطلوب" : null;
  }
  if (!EMAIL_PATTERN.test(trimmed)) {
    return "البريد الإلكتروني غير صالح";
  }
  return null;
};
