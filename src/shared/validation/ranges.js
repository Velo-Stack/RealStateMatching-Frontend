import { removeCommas } from "../../utils/numberFormatting";

export const parseNumericField = (value) => {
  if (value === null || value === undefined || value === "") return null;
  const parsed = Number(removeCommas(value));
  return Number.isFinite(parsed) ? parsed : null;
};

export const validateNumericRange = (
  fromValue,
  toValue,
  { fieldLabel = "القيمة", required = true } = {},
) => {
  const errors = {};
  const fromNum = parseNumericField(fromValue);
  const toNum = parseNumericField(toValue);

  if (required && fromNum === null) {
    errors.from = `${fieldLabel} (من) مطلوبة`;
  }
  if (required && toNum === null) {
    errors.to = `${fieldLabel} (إلى) مطلوبة`;
  }

  if (fromNum !== null && toNum !== null && toNum < fromNum) {
    errors.to = `${fieldLabel} (إلى) يجب أن تكون أكبر من أو تساوي ${fieldLabel} (من)`;
  }

  return errors;
};

export const validateAreaRange = (areaFrom, areaTo) =>
  validateNumericRange(areaFrom, areaTo, { fieldLabel: "المساحة" });

export const validateBudgetRange = (budgetFrom, budgetTo) =>
  validateNumericRange(budgetFrom, budgetTo, { fieldLabel: "الميزانية" });
