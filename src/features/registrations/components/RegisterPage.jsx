import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { UploadSimple, CheckCircle, X, Check, ShieldCheck, FileText, CalendarBlank } from "phosphor-react";
import { useRegister } from "../hooks/useRegister";
import { REGISTRATION_TYPES } from "../constants/registrationsConstants";
import { fetchSelfRegistrationStatus } from "../services/registrationsApi";
import PhoneInput from "../../../components/common/PhoneInput";
import ValidatedInput from "../../../components/common/ValidatedInput";
import { validateSaudiPhone } from "../../../shared/validation/saudiPhone";
import { validateEmail } from "../../../shared/validation/email";

const inputClasses =
  "w-full rounded-xl border border-white/10 bg-[#111827]/60 px-4 py-2.5 text-sm text-white focus:border-emerald-500/40 focus:outline-none transition-colors";
const labelClasses = "block text-sm font-medium text-slate-300 mb-1.5 text-right";

const RegisterPage = () => {
  const [enabled, setEnabled] = useState(null);
  const [touched, setTouched] = useState({});
  const {
    step,
    form,
    updateField,
    nextStep,
    prevStep,
    error,
    setError,
    submitting,
    submit,
  } = useRegister();

  useEffect(() => {
    fetchSelfRegistrationStatus()
      .then((data) => setEnabled(Boolean(data?.enabled)))
      .catch(() => setEnabled(false));
  }, []);

  if (enabled === null) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-400 text-sm">
        جاري التحميل...
      </div>
    );
  }

  if (!enabled) {
    return <Navigate to="/login" replace />;
  }

  const touch = (field) => setTouched((prev) => ({ ...prev, [field]: true }));

  const isOffice = form.type === "OFFICE";
  const docStepIndex = isOffice ? 3 : 2;
  const finalStepIndex = isOffice ? 4 : 3;

  const validateStepOne = () => {
    const nextTouched = { name: true, email: true, phone: true, birthDate: true };
    setTouched((prev) => ({ ...prev, ...nextTouched }));

    if (!form.name.trim()) {
      setError("الاسم الكامل مطلوب");
      return false;
    }
    if (validateEmail(form.email)) {
      setError("البريد الإلكتروني غير صحيح");
      return false;
    }
    if (validateSaudiPhone(form.phone)) {
      setError("رقم الجوال غير صالح");
      return false;
    }
    if (!form.birthDate) {
      setError("تاريخ الميلاد مطلوب إجبارياً");
      return false;
    }
    setError("");
    return true;
  };

  const validateDocStep = () => {
    if (!form.nationalIdFile) {
      setError("إرفاق ملف أو صورة الهوية الشخصية مطلوب إجبارياً");
      return false;
    }
    setError("");
    return true;
  };

  const emailError = validateEmail(form.email);
  const phoneError = validateSaudiPhone(form.phone);

  const handleFileUpload = (field, file) => {
    if (!file) return;
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
    if (!allowedTypes.includes(file.type)) {
      setError("يُسمح برفع صور (JPG/PNG/WebP) أو ملفات PDF فقط");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("الحد الأقصى لحجم الملف هو 5 ميجابايت");
      return;
    }
    setError("");
    updateField(field, file);
  };

  return (
    <div className="login-page min-h-screen flex items-center justify-center p-4" dir="rtl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl bg-[#111827]/85 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl"
      >
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-white">إنشاء حساب جديد</h1>
          <p className="text-slate-400 text-sm mt-1.5">سيتم مراجعة طلبك من قبل إدارة منصة رواسخ</p>

          {step > 0 ? (
            <div className="flex items-center justify-center gap-2 mt-4">
              {[1, isOffice ? 2 : null, docStepIndex, finalStepIndex]
                .filter(Boolean)
                .map((idx, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div
                      className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center transition-all ${
                        step >= idx
                          ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20"
                          : "bg-white/5 text-slate-500 border border-white/10"
                      }`}
                    >
                      {step > idx ? <Check size={14} weight="bold" /> : i + 1}
                    </div>
                    {i < (isOffice ? 3 : 2) ? (
                      <div
                        className={`w-6 h-0.5 transition-colors ${
                          step > idx ? "bg-emerald-500" : "bg-white/10"
                        }`}
                      />
                    ) : null}
                  </div>
                ))}
            </div>
          ) : null}
        </div>

        {error ? (
          <div className="mb-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 text-right flex items-center gap-2">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        ) : null}

        {/* Step 0: Type Selection */}
        {step === 0 ? (
          <div className="space-y-3">
            <p className="text-sm text-slate-400 text-right mb-2 font-medium">اختر نوع الحساب للانضمام:</p>
            {REGISTRATION_TYPES.map((type) => (
              <button
                key={type.value}
                type="button"
                onClick={() => {
                  updateField("type", type.value);
                  setError("");
                  nextStep();
                }}
                className={`w-full text-right rounded-2xl border p-4 transition-all duration-200 ${
                  form.type === type.value
                    ? "border-emerald-500/60 bg-emerald-500/10 shadow-lg shadow-emerald-500/5"
                    : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/[0.07]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-semibold text-base">{type.label}</p>
                    <p className="text-slate-400 text-xs mt-1 leading-relaxed">{type.description}</p>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                      form.type === type.value
                        ? "border-emerald-500 bg-emerald-500 text-slate-950"
                        : "border-slate-500"
                    }`}
                  >
                    {form.type === type.value ? <Check size={12} weight="bold" /> : null}
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : null}

        {/* Step 1: Personal Info */}
        {step === 1 ? (
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              if (!validateStepOne()) return;
              nextStep();
            }}
          >
            <div>
              <label className={labelClasses}>الاسم الكامل <span className="text-emerald-400">*</span></label>
              <input
                className={inputClasses}
                placeholder="أدخل اسمك كما هو في الهوية"
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
                required
              />
            </div>
            <div>
              <ValidatedInput
                label="البريد الإلكتروني"
                name="email"
                type="email"
                dir="ltr"
                value={form.email}
                onChange={(e) => updateField("email", e.target.value)}
                onBlur={() => touch("email")}
                error={emailError}
                touched={touched.email}
                required
              />
            </div>
            <div>
              <PhoneInput
                label="رقم الجوال"
                name="phone"
                value={form.phone}
                onChange={(e) => updateField("phone", e.target.value)}
                onBlur={() => touch("phone")}
                error={phoneError}
                touched={touched.phone}
                required
              />
            </div>
            <div>
              <label className={labelClasses}>
                تاريخ الميلاد <span className="text-emerald-400">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  className={`${inputClasses} calendar-picker-dark`}
                  value={form.birthDate}
                  onChange={(e) => updateField("birthDate", e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={prevStep}
                className="flex-1 rounded-xl border border-white/10 py-3 text-sm font-medium text-slate-300 hover:bg-white/5 transition-colors"
              >
                رجوع
              </button>
              <button
                type="submit"
                className="flex-1 theme-button-primary rounded-xl py-3 text-sm font-bold shadow-lg shadow-emerald-500/20"
              >
                التالي
              </button>
            </div>
          </form>
        ) : null}

        {/* Step 2 (Office details) */}
        {step === 2 && isOffice ? (
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              if (!form.officeName.trim() || !form.licenseNumber.trim()) {
                setError("اسم المكتب ورقم الترخيص مطلوبان للمكاتب");
                return;
              }
              setError("");
              nextStep();
            }}
          >
            <div>
              <label className={labelClasses}>اسم المكتب العقاري <span className="text-emerald-400">*</span></label>
              <input
                className={inputClasses}
                placeholder="أدخل اسم المكتب التجاري"
                value={form.officeName}
                onChange={(e) => updateField("officeName", e.target.value)}
                required
              />
            </div>
            <div>
              <label className={labelClasses}>رقم الترخيص / السجل التجارية <span className="text-emerald-400">*</span></label>
              <input
                className={inputClasses}
                placeholder="أدخل رقم الترخيص الرسمي"
                value={form.licenseNumber}
                onChange={(e) => updateField("licenseNumber", e.target.value)}
                required
              />
            </div>
            <div>
              <label className={labelClasses}>معرف المدينة (اختياري)</label>
              <input
                type="number"
                dir="ltr"
                placeholder="مثال: 1"
                className={inputClasses}
                value={form.cityId}
                onChange={(e) => updateField("cityId", e.target.value)}
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={prevStep}
                className="flex-1 rounded-xl border border-white/10 py-3 text-sm font-medium text-slate-300 hover:bg-white/5 transition-colors"
              >
                رجوع
              </button>
              <button
                type="submit"
                className="flex-1 theme-button-primary rounded-xl py-3 text-sm font-bold shadow-lg shadow-emerald-500/20"
              >
                التالي
              </button>
            </div>
          </form>
        ) : null}

        {/* Documents Upload Step */}
        {step === docStepIndex ? (
          <form
            className="space-y-5"
            onSubmit={(e) => {
              e.preventDefault();
              if (!validateDocStep()) return;
              nextStep();
            }}
          >
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 text-right">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm mb-1">
                <ShieldCheck size={20} />
                <span>سرية وأمان المستندات</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                جميع المرفقات والوثائق الرسمية المشفرة محفوظة بسيرفراتنا المحمية، ولا يتم الاطلاع عليها إلا من قِبل إدارة منصة رواسخ لغرض التدقيق فقط.
              </p>
            </div>

            {/* National ID Upload (REQUIRED) */}
            <div>
              <label className={labelClasses}>
                الهوية الشخصية / الوطنية <span className="text-emerald-400">* (مطلوب إجبارياً)</span>
              </label>
              {form.nationalIdFile ? (
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-white">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <CheckCircle size={24} className="text-emerald-400 shrink-0" />
                    <div className="truncate text-right">
                      <p className="text-sm font-medium truncate">{form.nationalIdFile.name}</p>
                      <p className="text-xs text-slate-400">
                        {(form.nationalIdFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => updateField("nationalIdFile", null)}
                    className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full p-5 border-2 border-dashed border-white/15 rounded-xl cursor-pointer hover:border-emerald-500/50 hover:bg-white/[0.02] transition-all text-center">
                  <UploadSimple size={32} className="text-emerald-400 mb-2" />
                  <span className="text-sm font-medium text-slate-200">اضغط لرفع صورة أو ملف الهوية</span>
                  <span className="text-xs text-slate-500 mt-1">صيغ مسموحة: JPG, PNG, WEBP, PDF (أقصى حجم 5MB)</span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,application/pdf"
                    className="hidden"
                    onChange={(e) => handleFileUpload("nationalIdFile", e.target.files[0])}
                  />
                </label>
              )}
            </div>

            {/* Val License Upload (OPTIONAL) */}
            <div>
              <label className={labelClasses}>
                رخصة فال العقارية <span className="text-slate-400 font-normal">(اختياري)</span>
              </label>
              {form.valLicenseFile ? (
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-white">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <CheckCircle size={24} className="text-emerald-400 shrink-0" />
                    <div className="truncate text-right">
                      <p className="text-sm font-medium truncate">{form.valLicenseFile.name}</p>
                      <p className="text-xs text-slate-400">
                        {(form.valLicenseFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => updateField("valLicenseFile", null)}
                    className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full p-4 border border-dashed border-white/10 rounded-xl cursor-pointer hover:border-emerald-500/40 hover:bg-white/[0.02] transition-all text-center">
                  <UploadSimple size={26} className="text-slate-400 mb-1" />
                  <span className="text-xs font-medium text-slate-300">اضغط لرفع نسخة من رخصة فال (اختياري)</span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,application/pdf"
                    className="hidden"
                    onChange={(e) => handleFileUpload("valLicenseFile", e.target.files[0])}
                  />
                </label>
              )}
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={prevStep}
                className="flex-1 rounded-xl border border-white/10 py-3 text-sm font-medium text-slate-300 hover:bg-white/5 transition-colors"
              >
                رجوع
              </button>
              <button
                type="submit"
                className="flex-1 theme-button-primary rounded-xl py-3 text-sm font-bold shadow-lg shadow-emerald-500/20"
              >
                التالي
              </button>
            </div>
          </form>
        ) : null}

        {/* Final Step: Password & Terms & Pledge */}
        {step === finalStepIndex ? (
          <form className="space-y-4" onSubmit={submit}>
            <div>
              <label className={labelClasses}>كلمة المرور <span className="text-emerald-400">*</span></label>
              <input
                type="password"
                dir="ltr"
                className={inputClasses}
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => updateField("password", e.target.value)}
                required
                minLength={8}
              />
            </div>
            <div>
              <label className={labelClasses}>تأكيد كلمة المرور <span className="text-emerald-400">*</span></label>
              <input
                type="password"
                dir="ltr"
                className={inputClasses}
                placeholder="••••••••"
                value={form.confirmPassword}
                onChange={(e) => updateField("confirmPassword", e.target.value)}
                required
                minLength={8}
              />
            </div>

            {isOffice ? (
              <div>
                <label className={labelClasses}>ملاحظات إضافية (اختياري)</label>
                <textarea
                  className={`${inputClasses} min-h-[70px]`}
                  placeholder="أي معلومات إضافية تود إبلاغ الإدارة بها..."
                  value={form.notes}
                  onChange={(e) => updateField("notes", e.target.value)}
                />
              </div>
            ) : null}

            {/* Terms & Conditions Box */}
            <div className="pt-2">
              <label className={labelClasses}>الشروط والأحكام لتسجيل المستخدم في المنصة العقارية</label>
              <div className="p-3 bg-[#0d131f] border border-white/10 rounded-xl max-h-44 overflow-y-auto text-xs leading-relaxed text-slate-300 space-y-2.5 mb-3 select-none">
                <p className="font-bold text-white text-center">الميثاق والشروط العامة</p>
                <p>يُعد إنشاؤك للحساب أو تقديم الطلب بمثابة موافقة صريحة وكاملة على جميع الأحكام والبنود التالية:</p>
                
                <div>
                  <h5 className="font-bold text-emerald-400 mb-1">1. الأهلية وصحة البيانات:</h5>
                  <p className="text-slate-400">يلتزم المستخدم بتقديم معلومات ومستندات رسمية صحيحة ودقيقة، ويتحمل كامل المسؤولية النظامية والقانونية عن أي بيانات خاطئة أو مضللة.</p>
                </div>

                <div>
                  <h5 className="font-bold text-emerald-400 mb-1">2. عمولة الوساطة العقارية (السعي):</h5>
                  <p className="text-slate-400">تقر بصفتك مستخدماً للتطبيق بأن شركة رواسخ العقارية هي الجهة المخولة بتحديد ونسب السعي وفق النظام واللوائح الصادرة عن الهيئة العامة للعقار والالتزام بالسداد فور إتمام الصفقة.</p>
                </div>

                <div>
                  <h5 className="font-bold text-emerald-400 mb-1">3. حظر التحايل:</h5>
                  <p className="text-slate-400">يُحظر الاتفاق المباشر أو التحايل للتهرب من دفع عمولة السعي المستحقة للشركة، وتحتفظ الشركة بحقها في اتخاذ الإجراءات النظامية عند ثبوت ذلك.</p>
                </div>
              </div>

              <div className="space-y-2.5 text-right">
                <label className="flex items-start gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={form.agreedToTerms}
                    onChange={(e) => updateField("agreedToTerms", e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded border-white/20 bg-slate-900 text-emerald-500 focus:ring-emerald-500 cursor-pointer"
                  />
                  <span className="text-xs text-slate-200 font-medium">
                    أوافق على الشروط والأحكام الموضحة أعلاه <span className="text-emerald-400">*</span>
                  </span>
                </label>

                <label className="flex items-start gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={form.pledgeCorrectData}
                    onChange={(e) => updateField("pledgeCorrectData", e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded border-white/20 bg-slate-900 text-emerald-500 focus:ring-emerald-500 cursor-pointer"
                  />
                  <span className="text-xs text-slate-200 font-medium">
                    أتعهد بأن جميع البيانات المدخلة والوثائق المرفقة صحيحة ورسمية وأتحمل كافة المسؤوليات النظامية <span className="text-emerald-400">*</span>
                  </span>
                </label>
              </div>
            </div>

            <div className="flex gap-3 pt-3">
              <button
                type="button"
                onClick={prevStep}
                className="flex-1 rounded-xl border border-white/10 py-3 text-sm font-medium text-slate-300 hover:bg-white/5 transition-colors"
              >
                رجوع
              </button>
              <button
                type="submit"
                disabled={submitting || !form.agreedToTerms || !form.pledgeCorrectData}
                className="flex-1 theme-button-primary rounded-xl py-3 text-sm font-bold shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "جاري الإرسال..." : "إرسال طلب التسجيل"}
              </button>
            </div>
          </form>
        ) : null}

        <p className="text-center text-slate-500 text-xs sm:text-sm mt-6">
          لديك حساب بالفعل؟{" "}
          <Link to="/login" className="text-emerald-400 hover:text-emerald-300 font-medium">
            تسجيل الدخول
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
