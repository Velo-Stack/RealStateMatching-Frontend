import { useState } from 'react';
import { INITIAL_FORM } from '../constants/joinUsConstants';
import { validateEmail } from '../../../shared/validation/email';
import { validateSaudiPhone } from '../../../shared/validation/saudiPhone';

const useJoinApplicationForm = () => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(INITIAL_FORM);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError('');
  };

  const updateFile = (field, file) => {
    setForm((prev) => ({
      ...prev,
      files: { ...prev.files, [field]: file },
    }));
    setError('');
  };

  const toggleArrayField = (field, value) => {
    setForm((prev) => {
      const current = prev[field] || [];
      const next = current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value];
      return { ...prev, [field]: next };
    });
    setError('');
  };

  const validateStep = (currentStep) => {
    if (currentStep === 1) {
      if (!form.fullName.trim()) return 'الاسم الرباعي مطلوب';
      if (!form.gender) return 'الجنس مطلوب';
      if (!form.ageGroup) return 'الفئة العمرية مطلوبة';
      if (!form.cityId) return 'المدينة مطلوبة';
      if (!form.phone.trim()) return 'رقم الجوال مطلوب';
      const phoneErr = validateSaudiPhone(form.phone);
      if (phoneErr) return phoneErr;
      if (!form.email.trim()) return 'البريد الإلكتروني مطلوب';
      const emailErr = validateEmail(form.email);
      if (emailErr) return emailErr;
      if (!form.education) return 'المؤهل العلمي مطلوب';
    }

    if (currentStep === 2) {
      if (!form.hasFalLicense) return 'حالة رخصة فال مطلوبة';
      if (form.hasFalLicense === 'yes') {
        if (!form.falLicenseNumber.trim()) return 'رقم رخصة فال مطلوب';
        if (!form.licenseExpiry) return 'تاريخ انتهاء الرخصة مطلوب';
        if (!form.files.fal_license) return 'مرفق رخصة فال مطلوب';
      }
      if (!form.experienceYears) return 'سنوات الخبرة مطلوبة';
      if (!form.specializations.length) return 'يجب اختيار تخصص واحد على الأقل';
    }

    if (currentStep === 3) {
      if (!form.preferredWorkStyle) return 'طبيعة العمل مطلوبة';
      if (form.currentChallenges.trim().length < 10) return 'التحديات يجب أن تكون 10 أحرف على الأقل';
      if (!form.techTools.length) return 'يجب اختيار أداة تقنية واحدة على الأقل';
      if (!form.rewardSystem) return 'نظام العوائد مطلوب';
    }

    if (currentStep === 4) {
      if (!form.wantsTraining) return 'حقل البرامج التدريبية مطلوب';
      if (form.dreamWorkEnvironment.trim().length < 10) {
        return 'بيئة العمل المثالية يجب أن تكون 10 أحرف على الأقل';
      }
      if (!form.files.cv) return 'السيرة الذاتية (CV) مطلوبة';
    }

    return '';
  };

  const nextStep = () => {
    const message = validateStep(step);
    if (message) {
      setError(message);
      return false;
    }
    setError('');
    setStep((prev) => Math.min(prev + 1, 4));
    return true;
  };

  const prevStep = () => {
    setError('');
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const buildFormData = () => {
    const data = new FormData();
    const scalarFields = [
      'fullName', 'gender', 'ageGroup', 'cityId', 'phone', 'email', 'education',
      'hasFalLicense', 'falLicenseNumber', 'licenseExpiry', 'experienceYears',
      'preferredWorkStyle', 'currentChallenges', 'rewardSystem', 'wantsTraining',
      'dreamWorkEnvironment',
    ];

    scalarFields.forEach((key) => {
      if (form[key]) data.append(key, form[key]);
    });

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
    submitting,
    setSubmitting,
    setError,
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
