export {
  SAUDI_PHONE_PATTERN,
  normalizeSaudiPhoneDigits,
  formatSaudiPhoneDisplay,
  validateSaudiPhone,
} from "./saudiPhone";
export { validateEmail } from "./email";
export {
  normalizeNationalIdDigits,
  validateNationalId,
} from "./nationalId";
export {
  parseNumericField,
  validateNumericRange,
  validateAreaRange,
  validateBudgetRange,
} from "./ranges";

export const LIVE_VALIDATE_FIELDS = {
  phone: ["brokerContactPhone", "phone"],
  email: ["email"],
  number: ["price", "area", "budgetFrom", "budgetTo"],
};

export const shouldValidateLive = (fieldName) =>
  LIVE_VALIDATE_FIELDS.phone.includes(fieldName) ||
  LIVE_VALIDATE_FIELDS.email.includes(fieldName) ||
  LIVE_VALIDATE_FIELDS.number.includes(fieldName);
