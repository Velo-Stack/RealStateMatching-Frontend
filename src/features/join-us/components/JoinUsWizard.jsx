import { useRef, useEffect, useState } from 'react';
import { motion as Motion } from 'framer-motion';
import { CaretLeft, CaretRight, CheckCircle } from 'phosphor-react';
import { JOIN_US_COLORS } from '../constants/joinUsConstants';
import useJoinApplicationForm from '../hooks/useJoinApplicationForm';
import useJoinUsCities from '../hooks/useJoinUsCities';
import { submitJoinApplication } from '../services/joinUsApi';
import JoinUsSuccess from './JoinUsSuccess';
import StepPersonal from './steps/StepPersonal';
import StepLicense from './steps/StepLicense';
import StepWork from './steps/StepWork';
import StepDevelopment from './steps/StepDevelopment';
import JoinUsProgressHeader from './ui/JoinUsProgressHeader';
import JoinUsStepTransition from './ui/JoinUsStepTransition';
import { joinUsGoldBarClass } from './ui/joinUsTheme';

const JoinUsWizard = () => {
  const cardRef = useRef(null);
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
  const [shakeError, setShakeError] = useState(false);

  useEffect(() => {
    if (error) {
      setShakeError(true);
      const t = setTimeout(() => setShakeError(false), 500);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [error]);

  useEffect(() => {
    cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [step]);

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
    <div ref={cardRef} className="w-full max-w-3xl mx-auto relative" dir="rtl">
      <div className={joinUsGoldBarClass} />

      <div className="p-6 md:p-10 pt-8">
        <JoinUsProgressHeader step={step} />

        {error ? (
          <Motion.div
            animate={shakeError ? { x: [0, -8, 8, -6, 6, 0] } : {}}
            className="mb-5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 text-right"
          >
            {error}
          </Motion.div>
        ) : null}

        <div className="mb-8 min-h-[280px]">
          <JoinUsStepTransition step={step}>
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
          </JoinUsStepTransition>
        </div>

        {step === 4 ? (
          <div className="mb-6 rounded-2xl bg-[#f0f7ed] border border-[#2D5016]/15 p-4 text-sm text-gray-700">
            <p className="font-semibold text-[#2D5016] mb-1">ملخص سريع</p>
            <p>
              {form.fullName || '—'}
              {form.cityId && cityOptions.length
                ? ` · ${cityOptions.find((c) => String(c.value) === String(form.cityId))?.label || ''}`
                : ''}
            </p>
          </div>
        ) : null}

        <div className="sticky bottom-0 -mx-6 md:-mx-10 px-6 md:px-10 py-4 bg-white/90 backdrop-blur-md border-t border-gray-100 flex flex-col-reverse sm:flex-row gap-3 sm:justify-between">
          <button
            type="button"
            onClick={prevStep}
            disabled={step === 1 || submitting}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl border-2 font-semibold disabled:opacity-40 transition-colors hover:bg-[#f0f7ed]"
            style={{ borderColor: JOIN_US_COLORS.green, color: JOIN_US_COLORS.green }}
          >
            <CaretRight size={18} weight="bold" />
            السابق
          </button>

          {step < 4 ? (
            <button
              type="button"
              onClick={nextStep}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl text-white font-semibold transition-all hover:opacity-95 shadow-lg shadow-[#2D5016]/20"
              style={{ backgroundColor: JOIN_US_COLORS.green }}
            >
              التالي
              <CaretLeft size={18} weight="bold" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl text-white font-semibold transition-all hover:opacity-95 disabled:opacity-60 shadow-lg shadow-[#C9A84C]/30"
              style={{
                background: 'linear-gradient(135deg, #C9A84C 0%, #b8943f 100%)',
              }}
            >
              <CheckCircle size={20} weight="fill" />
              {submitting ? 'جاري الإرسال...' : 'إرسال الطلب'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default JoinUsWizard;
