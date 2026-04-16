// Validation utilities for request forms

export const VALIDATION_RULES = {
    PHONE: {
        PATTERN: /^5\d{8}$/,
        MIN_LENGTH: 9,
        MAX_LENGTH: 9,
        MESSAGE: "رقم الجوال يجب أن يبدأ بـ 5 ويتكون من 9 أرقام",
    },
    BUDGET: {
        MIN: 1,
        MAX: 999999999999999,
        MESSAGE_MIN: "الميزانية يجب أن تكون أكبر من صفر",
        MESSAGE_MAX: "الميزانية تجاوزت الحد المسموح",
    },
    AREA: {
        MIN: 1,
        MAX: 999999999,
        MESSAGE_MIN: "المساحة يجب أن تكون أكبر من صفر",
        MESSAGE_MAX: "المساحة تجاوزت الحد المسموح",
    },
    DESCRIPTION: {
        MIN_LENGTH: 10,
        MAX_LENGTH: 1000,
        MESSAGE_MIN: "الوصف يجب أن يكون 10 أحرف على الأقل",
        MESSAGE_MAX: "الوصف يجب ألا يتجاوز 1000 حرف",
    },
};

export const validatePhone = (phone) => {
    if (!phone || phone.trim() === "") {
        return "رقم التواصل مطلوب";
    }
    const cleanPhone = phone.replace(/\s/g, "");
    if (!VALIDATION_RULES.PHONE.PATTERN.test(cleanPhone)) {
        return VALIDATION_RULES.PHONE.MESSAGE;
    }
    return null;
};

export const validateBudget = (budget, fieldName = "الميزانية") => {
    if (!budget || budget === "") {
        return `${fieldName} مطلوبة`;
    }
    const numBudget = Number(String(budget).replace(/,/g, ""));
    if (isNaN(numBudget) || numBudget < VALIDATION_RULES.BUDGET.MIN) {
        return VALIDATION_RULES.BUDGET.MESSAGE_MIN;
    }
    if (numBudget > VALIDATION_RULES.BUDGET.MAX) {
        return VALIDATION_RULES.BUDGET.MESSAGE_MAX;
    }
    return null;
};

export const validateBudgetRange = (budgetFrom, budgetTo) => {
    const fromError = validateBudget(budgetFrom, "الميزانية من");
    if (fromError) return { budgetFrom: fromError };

    const toError = validateBudget(budgetTo, "الميزانية إلى");
    if (toError) return { budgetTo: toError };

    const fromVal = Number(String(budgetFrom).replace(/,/g, ""));
    const toVal = Number(String(budgetTo).replace(/,/g, ""));

    if (toVal < fromVal) {
        return {
            budgetTo: "الميزانية (إلى) يجب أن تكون أكبر من أو تساوي الميزانية (من)",
        };
    }

    return {};
};

export const validateArea = (area) => {
    if (!area || area === "") {
        return "المساحة مطلوبة";
    }
    const numArea = Number(String(area).replace(/,/g, ""));
    if (isNaN(numArea) || numArea < VALIDATION_RULES.AREA.MIN) {
        return VALIDATION_RULES.AREA.MESSAGE_MIN;
    }
    if (numArea > VALIDATION_RULES.AREA.MAX) {
        return VALIDATION_RULES.AREA.MESSAGE_MAX;
    }
    return null;
};

export const validateDescription = (description) => {
    if (!description || description.trim() === "") {
        return "الوصف مطلوب";
    }
    const length = description.trim().length;
    if (length < VALIDATION_RULES.DESCRIPTION.MIN_LENGTH) {
        return VALIDATION_RULES.DESCRIPTION.MESSAGE_MIN;
    }
    if (length > VALIDATION_RULES.DESCRIPTION.MAX_LENGTH) {
        return VALIDATION_RULES.DESCRIPTION.MESSAGE_MAX;
    }
    return null;
};

export const validateRequiredField = (value, fieldName) => {
    if (!value || value === "") {
        return `${fieldName} مطلوب`;
    }
    return null;
};

export const validateRequestForm = (formData) => {
    const errors = {};

    // Required fields
    if (!formData.usage) errors.usage = "الاستخدام مطلوب";
    if (!formData.propertySubType) errors.propertySubType = "نوع العقار مطلوب";
    if (!formData.purpose) errors.purpose = "الغرض مطلوب";
    if (!formData.submittedBy) errors.submittedBy = "مقدم الطلب مطلوب";
    if (!formData.cityId) errors.cityId = "المدينة مطلوبة";
    if (!formData.neighborhoodId) errors.neighborhoodId = "الحي مطلوب";

    // Validate with specific rules
    const phoneError = validatePhone(formData.brokerContactPhone);
    if (phoneError) errors.brokerContactPhone = phoneError;

    const areaError = validateArea(formData.area);
    if (areaError) errors.area = areaError;

    const descriptionError = validateDescription(formData.description);
    if (descriptionError) errors.description = descriptionError;

    // Budget range validation
    const budgetErrors = validateBudgetRange(
        formData.budgetFrom,
        formData.budgetTo
    );
    Object.assign(errors, budgetErrors);

    return errors;
};
