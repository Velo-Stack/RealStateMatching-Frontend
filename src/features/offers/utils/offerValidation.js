// Validation utilities for offer forms

export const VALIDATION_RULES = {
    PHONE: {
        PATTERN: /^5\d{8}$/,
        MIN_LENGTH: 9,
        MAX_LENGTH: 9,
        MESSAGE: "رقم الجوال يجب أن يبدأ بـ 5 ويتكون من 9 أرقام",
    },
    PRICE: {
        MIN: 1,
        MAX: 999999999999999,
        MESSAGE_MIN: "السعر يجب أن يكون أكبر من صفر",
        MESSAGE_MAX: "السعر تجاوز الحد المسموح",
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
    FACADES: {
        MIN_LENGTH: 3,
        MAX_LENGTH: 500,
        MESSAGE_MIN: "الواجهات يجب أن تكون 3 أحرف على الأقل",
        MESSAGE_MAX: "الواجهات يجب ألا تتجاوز 500 حرف",
    },
    LENGTHS: {
        MIN_LENGTH: 3,
        MAX_LENGTH: 500,
        MESSAGE_MIN: "الأطوال يجب أن تكون 3 أحرف على الأقل",
        MESSAGE_MAX: "الأطوال يجب ألا تتجاوز 500 حرف",
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

export const validatePrice = (price) => {
    if (!price || price === "") {
        return "السعر مطلوب";
    }
    const numPrice = Number(String(price).replace(/,/g, ""));
    if (isNaN(numPrice) || numPrice < VALIDATION_RULES.PRICE.MIN) {
        return VALIDATION_RULES.PRICE.MESSAGE_MIN;
    }
    if (numPrice > VALIDATION_RULES.PRICE.MAX) {
        return VALIDATION_RULES.PRICE.MESSAGE_MAX;
    }
    return null;
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

export const validateFacades = (facades) => {
    if (!facades || facades.trim() === "") {
        return "الواجهات مطلوبة";
    }
    const length = facades.trim().length;
    if (length < VALIDATION_RULES.FACADES.MIN_LENGTH) {
        return VALIDATION_RULES.FACADES.MESSAGE_MIN;
    }
    if (length > VALIDATION_RULES.FACADES.MAX_LENGTH) {
        return VALIDATION_RULES.FACADES.MESSAGE_MAX;
    }
    return null;
};

export const validateLengths = (lengths) => {
    if (!lengths || lengths.trim() === "") {
        return "الأطوال مطلوبة";
    }
    const length = lengths.trim().length;
    if (length < VALIDATION_RULES.LENGTHS.MIN_LENGTH) {
        return VALIDATION_RULES.LENGTHS.MESSAGE_MIN;
    }
    if (length > VALIDATION_RULES.LENGTHS.MAX_LENGTH) {
        return VALIDATION_RULES.LENGTHS.MESSAGE_MAX;
    }
    return null;
};

export const validateRequiredField = (value, fieldName) => {
    if (!value || value === "") {
        return `${fieldName} مطلوب`;
    }
    return null;
};

export const validateOfferForm = (formData) => {
    const errors = {};

    // Required fields
    if (!formData.usage) errors.usage = "الاستخدام مطلوب";
    if (!formData.propertySubType) errors.propertySubType = "نوع العقار مطلوب";
    if (!formData.purpose) errors.purpose = "الغرض مطلوب";
    if (!formData.contractType) errors.contractType = "طبيعة التعاقد مطلوبة";
    if (!formData.exclusivity) errors.exclusivity = "الحصرية مطلوبة";
    if (!formData.submittedBy) errors.submittedBy = "مقدم العرض مطلوب";
    if (!formData.brokersCount && formData.brokersCount !== 0) {
        errors.brokersCount = "عدد الوسطاء مطلوب";
    }
    if (!formData.cityId) errors.cityId = "المدينة مطلوبة";
    if (!formData.neighborhoodId) errors.neighborhoodId = "الحي مطلوب";

    // Validate with specific rules
    const phoneError = validatePhone(formData.brokerContactPhone);
    if (phoneError) errors.brokerContactPhone = phoneError;

    const priceError = validatePrice(formData.price);
    if (priceError) errors.price = priceError;

    const areaError = validateArea(formData.area);
    if (areaError) errors.area = areaError;

    const descriptionError = validateDescription(formData.description);
    if (descriptionError) errors.description = descriptionError;

    const facadesError = validateFacades(formData.facades);
    if (facadesError) errors.facades = facadesError;

    // Lengths validation (only for certain property types)
    const shouldValidateLengths = !["APARTMENT", "FLOOR", "TOWNHOUSE"].includes(
        formData.propertySubType
    );
    if (shouldValidateLengths) {
        const lengthsError = validateLengths(formData.lengths);
        if (lengthsError) errors.lengths = lengthsError;
    }

    return errors;
};
