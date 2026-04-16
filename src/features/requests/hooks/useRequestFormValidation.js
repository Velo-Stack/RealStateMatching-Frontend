import { useState, useCallback } from "react";
import { validateRequestForm } from "../utils/requestValidation";

export const useRequestFormValidation = () => {
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    const validateForm = useCallback((formData) => {
        const validationErrors = validateRequestForm(formData);
        setErrors(validationErrors);
        return Object.keys(validationErrors).length === 0;
    }, []);

    const validateField = useCallback((fieldName, value, formData) => {
        const validationErrors = validateRequestForm({ ...formData, [fieldName]: value });
        setErrors((prev) => ({
            ...prev,
            [fieldName]: validationErrors[fieldName] || null,
        }));
    }, []);

    const touchField = useCallback((fieldName) => {
        setTouched((prev) => ({ ...prev, [fieldName]: true }));
    }, []);

    const touchAllFields = useCallback((formData) => {
        const allFields = Object.keys(formData).reduce((acc, key) => {
            acc[key] = true;
            return acc;
        }, {});
        setTouched(allFields);
    }, []);

    const resetValidation = useCallback(() => {
        setErrors({});
        setTouched({});
    }, []);

    const handleBlur = useCallback(
        (fieldName, formData) => {
            touchField(fieldName);
            validateField(fieldName, formData[fieldName], formData);
        },
        [touchField, validateField]
    );

    return {
        errors,
        touched,
        validateForm,
        validateField,
        touchField,
        touchAllFields,
        resetValidation,
        handleBlur,
    };
};
