import { useState } from 'react';
import {
  INITIAL_FORM,
  JOIN_US_EMPTY_FIELD_DEFAULTS,
} from '../constants/joinUsConstants';
import { validateEmail } from '../../../shared/validation/email';
import { validateSaudiPhone } from '../../../shared/validation/saudiPhone';

const VALIDATION_OK = { field: null, message: '' };
const fail = (field, message) => ({ field, message });

const useJoinApplicationForm = () => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(INITIAL_FORM);
  const [error, setError] = useState('');
  const [errorField, setErrorField] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const clearValidation = () => {
    setError('');
    setErrorField(null);
  };

  const setValidationError = (message, field = null) => {
    setError(message);
    setErrorField(field);
  };

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    clearValidation();
  };

  const updateFile = (field, file) => {
    setForm((prev) => ({
      ...prev,
      files: { ...prev.files, [field]: file },
    }));
    clearValidation();
  };

  const toggleArrayField = (field, value) => {
    setForm((prev) => {
      const current = prev[field] || [];
      const next = current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value];
      return { ...prev, [field]: next };
    });
    clearValidation();
  };

  const validateStep = (currentStep) => {
    if (currentStep === 1) {
      if (!form.fullName.trim()) return fail('fullName', 'الاسم الرباعي مطلوب');
      if (!form.gender) return fail('gender', 'الجنس مطلوب');
      if (!form.ageGroup) return fail('ageGroup', 'الفئة العمرية مطلوبة');
      if (!form.cityId) return fail('cityId', 'المدينة مطلوبة');
      if (!form.phone.trim()) return fail('phone', 'رقم الجوال مطلوب');
      const phoneErr = validateSaudiPhone(form.phone);
      if (phoneErr) return fail('phone', phoneErr);
      if (!form.email.trim()) return fail('email', 'البريد الإلكتروني مطلوب');
      const emailErr = validateEmail(form.email);
      if (emailErr) return fail('email', emailErr);
      if (!form.education) return fail('education', 'المؤهل العلمي مطلوب');
    }

    if (currentStep === 2) {
      if (!form.hasFalLicense) return fail('hasFalLicense', 'حالة رخصة فال مطلوبة');
      if (form.hasFalLicense === 'yes') {
        if (!form.falLicenseNumber.trim()) return fail('falLicenseNumber', 'رقم رخصة فال مطلوب');
        if (!form.licenseExpiry) return fail('licenseExpiry', 'تاريخ انتهاء الرخصة مطلوب');
        if (!form.files.fal_license) return fail('fal_license', 'مرفق رخصة فال مطلوب');
      }
      if (!form.experienceYears) return fail('experienceYears', 'سنوات الخبرة مطلوبة');
      if (!form.specializations.length) return fail('specializations', 'يجب اختيار تخصص واحد على الأقل');
    }

    if (currentStep === 3) {
      if (!form.preferredWorkStyle) return fail('preferredWorkStyle', 'طبيعة العمل مطلوبة');
      if (!form.techTools.length) return fail('techTools', 'يجب اختيار أداة تقنية واحدة على الأقل');
      if (!form.rewardSystem) return fail('rewardSystem', 'نظام العوائد مطلوب');
    }

    if (currentStep === 4) {
      if (!form.wantsTraining) return fail('wantsTraining', 'حقل البرامج التدريبية مطلوب');
      if (!form.files.cv) return fail('cv', 'السيرة الذاتية (CV) مطلوبة');
    }

    return VALIDATION_OK;
  };

  const nextStep = () => {
    const result = validateStep(step);
    if (result.message) {
      setValidationError(result.message, result.field);
      return false;
    }
    clearValidation();
    setStep((prev) => Math.min(prev + 1, 4));
    return true;
  };

  const prevStep = () => {
    clearValidation();
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const resolveTextField = (value, fallback) => {
    const trimmed = value.trim();
    return trimmed.length >= 10 ? trimmed : fallback;
  };

  const buildFormData = () => {
    const data = new FormData();
    const scalarFields = [
      'fullName', 'gender', 'ageGroup', 'cityId', 'phone', 'email', 'education',
      'hasFalLicense', 'falLicenseNumber', 'licenseExpiry', 'experienceYears',
      'preferredWorkStyle', 'rewardSystem', 'wantsTraining',
    ];

    scalarFields.forEach((key) => {
      if (form[key]) data.append(key, form[key]);
    });

    data.append(
      'currentChallenges',
      resolveTextField(form.currentChallenges, JOIN_US_EMPTY_FIELD_DEFAULTS.currentChallenges),
    );
    data.append(
      'dreamWorkEnvironment',
      resolveTextField(form.dreamWorkEnvironment, JOIN_US_EMPTY_FIELD_DEFAULTS.dreamWorkEnvironment),
    );

    data.append('specializations', JSON.stringify(form.specializations));
    data.append('techTools', JSON.stringify(form.techTools));
    if (form.developmentAreas.length) {
      data.append('developmentAreas', JSON.stringify(form.developmentAreas));
    }

    Object.entries(form.files).forEach(([key, file]) => {
      if (file) data.append(key, file);
    });

    return data;
  };

  return {
    step,
    form,
    error,
    errorField,
    submitting,
    setSubmitting,
    setError,
    setErrorField,
    setValidationError,
    clearValidation,
    updateField,
    updateFile,
    toggleArrayField,
    nextStep,
    prevStep,
    validateStep,
    buildFormData,
    setStep,
  };
};

export default useJoinApplicationForm;
