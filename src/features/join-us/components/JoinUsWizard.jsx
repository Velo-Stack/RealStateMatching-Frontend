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
  const errorBannerRef = useRef(null);
  const { cityOptions, isLoading: citiesLoading } = useJoinUsCities();
  const {
    step,
    form,
    error,
    errorField,
    submitting,
    setSubmitting,
    setValidationError,
    clearValidation,
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
  const [agreedToTerms, setAgreedToTerms] = useState(false);

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

  useEffect(() => {
    if (!error) return undefined;

    const t = setTimeout(() => {
      if (errorField) {
        const el = document.querySelector(`[data-join-field="${errorField}"]`);
        el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        errorBannerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);

    return () => clearTimeout(t);
  }, [error, errorField]);

  const handleSubmit = async () => {
    const result = validateStep(4);
    if (result.message) {
      setValidationError(result.message, result.field);
      return;
    }

    if (!agreedToTerms) {
      setValidationError('يجب الموافقة على الشروط والأحكام لإتمام التسجيل', 'agreedToTerms');
      return;
    }

    setSubmitting(true);
    clearValidation();
    try {
      await submitJoinApplication(buildFormData());
      setSubmitted(true);
    } catch (err) {
      const backendMsg = err?.response?.data?.message;
      const genericMsg = err?.message || 'حدث خطأ أثناء الإرسال';
      setValidationError(backendMsg || genericMsg, null);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    window.location.reload();
  };

  const stepProps = { errorField, errorMessage: error };

  if (submitted) {
    return <JoinUsSuccess onReset={handleReset} />;
  }

  return (
    <div ref={cardRef} className="w-full max-w-3xl mx-auto relative" dir="rtl">
      <div className={joinUsGoldBarClass} />

      <div className="p-6 md:p-10 pt-8">
        <JoinUsProgressHeader step={step} />

        {error ? (
          <div ref={errorBannerRef}>
            <Motion.div
              animate={shakeError ? { x: [0, -8, 8, -6, 6, 0] } : {}}
              className="mb-5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 text-right"
            >
              {error}
            </Motion.div>
          </div>
        ) : null}

        <div className="mb-8 min-h-[280px]">
          <JoinUsStepTransition step={step}>
            {step === 1 ? (
              <StepPersonal
                form={form}
                updateField={updateField}
                cityOptions={cityOptions}
                citiesLoading={citiesLoading}
                {...stepProps}
              />
            ) : null}
            {step === 2 ? (
              <StepLicense
                form={form}
                updateField={updateField}
                updateFile={updateFile}
                toggleArrayField={toggleArrayField}
                {...stepProps}
              />
            ) : null}
            {step === 3 ? (
              <StepWork
                form={form}
                updateField={updateField}
                toggleArrayField={toggleArrayField}
                {...stepProps}
              />
            ) : null}
            {step === 4 ? (
              <StepDevelopment
                form={form}
                updateField={updateField}
                updateFile={updateFile}
                toggleArrayField={toggleArrayField}
                {...stepProps}
              />
            ) : null}
          </JoinUsStepTransition>
        </div>

        {step === 4 ? (
          <>
            <div className="mb-6 rounded-2xl bg-[#f0f7ed] border border-[#2D5016]/15 p-4 text-sm text-gray-700">
              <p className="font-semibold text-[#2D5016] mb-1">ملخص سريع</p>
              <p>
                {form.fullName || '—'}
                {form.cityId && cityOptions.length
                  ? ` · ${cityOptions.find((c) => String(c.value) === String(form.cityId))?.label || ''}`
                  : ''}
              </p>
            </div>

            <div className="mb-8">
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl max-h-56 overflow-y-auto text-[13px] leading-relaxed text-gray-600 mb-3 space-y-3 shadow-inner">
                <h4 className="font-bold text-gray-800 text-sm mb-2 text-center">الشروط والأحكام لتسجيل مستخدم جديد في التطبيق العقاري</h4>
                <p>أهلاً بك في التطبيق العقاري. يُرجى قراءة هذه الشروط والأحكام بعناية قبل إتمام عملية التسجيل. يُعد إنشاؤك للحساب أو استخدامك للتطبيق بمثابة موافقة صريحة وكاملة على جميع الأحكام والبنود الواردة أدناه:</p>
                
                <div>
                  <h5 className="font-bold text-gray-800 mb-1">المادة الأولى: شروط الحساب والتسجيل</h5>
                  <ul className="list-disc list-inside space-y-1 pr-2">
                    <li><strong className="text-gray-700">أهلية الاستخدام:</strong> يقر المستخدم بأنه يمتلك الأهلية القانونية والنظامية الكاملة للتعاقد واستخدام التطبيق وفقاً للأنظمة واللوائح السارية في المملكة العربية السعودية.</li>
                    <li><strong className="text-gray-700">صحة البيانات:</strong> يلتزم المستخدم بتقديم معلومات صحيحة، دقيقة، ومحدثة أثناء عملية التسجيل (مثل الاسم، رقم الهوية/الإقامة، رقم الجوال، والبريد الإلكتروني)، ويتحمل كامل المسؤولية النظامية عن أي معلومات خاطئة أو مضللة.</li>
                    <li><strong className="text-gray-700">أمان الحساب:</strong> المستخدم مسؤول مسؤولية كاملة عن الحفاظ على سرية بيانات حسابه وكلمة المرور، وعن جميع الأنشطة والتعاملات التي تتم من خلال حسابه.</li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-bold text-gray-800 mb-1">المادة الثانية: عمولة الوساطة العقارية (السعي)</h5>
                  <ul className="list-none space-y-1 pr-2">
                    <li><strong className="text-gray-700">1.1 تحديد قيمة/نسبة السعي:</strong> تقر وتوافق بصفتك مستخدماً للتطبيق على أن الشركة العقارية (المالك والمشغل للتطبيق) هي الجهة الوحيدة المخولة بتحديد قيمة أو نسبة عمولة الوساطة العقارية ("السعي") الخاصة بأي صفقة عقارية (بيع، شراء، أو إيجار) تتم أو يتم التوصل إليها من خلال التطبيق.</li>
                    <li><strong className="text-gray-700">1.2 الالتزام بالسداد:</strong> يلتزم المستخدم بدفع السعي المحدد والموضح في تفاصيل العقار أو العقد المبرم، وذلك فور استحقاقها نظاماً عند إتمام الصفقة أو توقيع العقد لحساب شركة رواسخ.</li>
                    <li><strong className="text-gray-700">1.3 الامتثال للأنظمة:</strong> تخضع نسبة أو قيمة السعي للحدود والأنظمة واللوائح الصادرة عن الهيئة العامة للعقار والجهات المختصة، وحسب المتفق عليه مع شركة رواسخ.</li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-bold text-gray-800 mb-1">المادة الثالثة: الاستخدام المقبول والالتزامات</h5>
                  <ul className="list-disc list-inside space-y-1 pr-2">
                    <li><strong className="text-gray-700">حظر التهرب من السعي:</strong> يُحظر الاتفاق المباشر أو المحاولة بين أطراف الصفقة للتحايل أو التهرب من دفع عمولة السعي المستحقة للشركة العقارية. وتحتفظ الشركة بكامل حقها القانوني والمقاضاة والمطالبة بالتعويضات وتطبيق الغرامات المقررة عند ثبوت ذلك.</li>
                    <li><strong className="text-gray-700">الاستخدام المشروع:</strong> يلتزم المستخدم بعدم استخدام التطبيق في أي أغراض غير مشروعة أو مخالفة للأنظمة العقارية واللوائح التنفيذية المعمول بها.</li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-bold text-gray-800 mb-1">المادة الرابعة: التعديلات وإلغاء الحساب</h5>
                  <ul className="list-disc list-inside space-y-1 pr-2">
                    <li><strong className="text-gray-700">تحديث الشروط:</strong> تحتفظ الشركة بحقها في تعديل أو تحديث هذه الشروط والأحكام في أي وقت، ويسري التعديل من تاريخ نشره على التطبيق.</li>
                    <li><strong className="text-gray-700">إيقاف الحساب:</strong> يحق للشركة تعليق أو إلغاء حساب أي مستخدم بشكل مباشر في حال ثبوت مخالفته لأي بند من الشروط والأحكام دون أدنى مسؤولية على الشركة.</li>
                  </ul>
                </div>

                <p className="mt-3 font-semibold text-gray-700 text-center bg-gray-200/50 p-2 rounded-lg">
                  بالضغط على زر "إرسال الطلب"، فإنك تؤكد الاطلاع والموافقة الكاملة دون أي تحفظ على جميع المواد والشروط والأحكام أعلاه.
                </p>
              </div>

              <label className="flex items-center gap-3 cursor-pointer select-none py-2" data-join-field="agreedToTerms">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => {
                    setAgreedToTerms(e.target.checked);
                    if (e.target.checked && errorField === 'agreedToTerms') {
                      clearValidation();
                    }
                  }}
                  className="w-5 h-5 rounded border-gray-300 text-[#2D5016] focus:ring-[#2D5016] focus:ring-2 focus:ring-offset-2 transition-shadow cursor-pointer"
                />
                <span className={`text-sm font-medium ${errorField === 'agreedToTerms' ? 'text-red-600' : 'text-gray-800'}`}>
                  قرأت وأوافق على الشروط والأحكام الموضحة أعلاه
                </span>
              </label>
            </div>
          </>
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
