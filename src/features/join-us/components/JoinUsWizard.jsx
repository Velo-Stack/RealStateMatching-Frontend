import { useState } from 'react';
import { JOIN_US_COLORS } from '../constants/joinUsConstants';
import useJoinApplicationForm from '../hooks/useJoinApplicationForm';
import useJoinUsCities from '../hooks/useJoinUsCities';
import { submitJoinApplication } from '../services/joinUsApi';
import JoinUsSuccess from './JoinUsSuccess';
import StepPersonal from './steps/StepPersonal';
import StepLicense from './steps/StepLicense';
import StepWork from './steps/StepWork';
import StepDevelopment from './steps/StepDevelopment';

const STEP_TITLES = ['البيانات الشخصية', 'الرخصة والمهنة', 'طبيعة العمل', 'التمكين والتطوير'];

const JoinUsWizard = () => {
  const { cityOptions, isLoading: citiesLoading } = useJoinUsCities();
  const {
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
  } = useJoinApplicationForm();

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    const message = validateStep(4);
    if (message) {
      setError(message);
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      await submitJoinApplication(buildFormData());
      setSubmitted(true);
    } catch (err) {
      setError(err?.response?.data?.message || 'حدث خطأ أثناء الإرسال');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    window.location.reload();
  };

  if (submitted) {
    return <JoinUsSuccess onReset={handleReset} />;
  }

  return (
    <div className="w-full max-w-lg sm:max-w-2xl md:max-w-3xl mx-auto" dir="rtl">
      <div className="mb-6">
        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
          <span>القسم {step}</span>
          <span>{step} / 4</span>
        </div>
        <div className="h-2 rounded-full bg-gray-200 overflow-hidden">
          <div
            className="h-full transition-all duration-300"
            style={{
              width: `${(step / 4) * 100}%`,
              backgroundColor: JOIN_US_COLORS.green,
            }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-2">{STEP_TITLES[step - 1]}</p>
      </div>

      {error ? (
        <div className="mb-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 text-right">
          {error}
        </div>
      ) : null}

      <div className="mb-8">
        {step === 1 ? (
          <StepPersonal
            form={form}
            updateField={updateField}
            cityOptions={cityOptions}
            citiesLoading={citiesLoading}
          />
        ) : null}
        {step === 2 ? (
          <StepLicense
            form={form}
            updateField={updateField}
            updateFile={updateFile}
            toggleArrayField={toggleArrayField}
          />
        ) : null}
        {step === 3 ? (
          <StepWork
            form={form}
            updateField={updateField}
            toggleArrayField={toggleArrayField}
          />
        ) : null}
        {step === 4 ? (
          <StepDevelopment
            form={form}
            updateField={updateField}
            updateFile={updateFile}
            toggleArrayField={toggleArrayField}
          />
        ) : null}
      </div>

      <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-between">
        <button
          type="button"
          onClick={prevStep}
          disabled={step === 1 || submitting}
          className="w-full sm:w-auto px-6 py-3 rounded-xl border-2 font-medium disabled:opacity-40 transition-colors"
          style={{ borderColor: JOIN_US_COLORS.green, color: JOIN_US_COLORS.green }}
        >
          السابق
        </button>
        {step < 4 ? (
          <button
            type="button"
            onClick={nextStep}
            className="w-full sm:w-auto px-8 py-3 rounded-xl text-white font-medium transition-opacity hover:opacity-90"
            style={{ backgroundColor: JOIN_US_COLORS.green }}
          >
            التالي
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full sm:w-auto px-8 py-3 rounded-xl text-white font-medium transition-opacity hover:opacity-90 disabled:opacity-60"
            style={{ backgroundColor: JOIN_US_COLORS.gold }}
          >
            {submitting ? 'جاري الإرسال...' : 'إرسال الطلب'}
          </button>
        )}
      </div>
    </div>
  );
};

export default JoinUsWizard;
