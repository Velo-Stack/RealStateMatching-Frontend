import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useRegister } from "../hooks/useRegister";
import { REGISTRATION_TYPES } from "../constants/registrationsConstants";
import { fetchSelfRegistrationStatus } from "../services/registrationsApi";
import PhoneInput from "../../../components/common/PhoneInput";
import ValidatedInput from "../../../components/common/ValidatedInput";
import { validateSaudiPhone } from "../../../shared/validation/saudiPhone";
import { validateEmail } from "../../../shared/validation/email";

const inputClasses =
  "w-full rounded-xl border border-white/10 bg-[#111827]/60 px-4 py-2.5 text-sm text-white focus:border-emerald-500/40 focus:outline-none";
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

  const validateStepOne = () => {
    const nextTouched = { name: true, email: true, phone: true };
    setTouched((prev) => ({ ...prev, ...nextTouched }));
    return (
      form.name.trim() &&
      !validateEmail(form.email) &&
      !validateSaudiPhone(form.phone)
    );
  };

  const emailError = validateEmail(form.email);
  const phoneError = validateSaudiPhone(form.phone);

  return (
    <div className="login-page min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg bg-[#111827]/80 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl"
      >
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-white">إنشاء حساب جديد</h1>
          <p className="text-slate-400 text-sm mt-2">سيتم مراجعة طلبك من قبل الإدارة</p>
        </div>

        {error ? (
          <div className="mb-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 text-right">
            {error}
          </div>
        ) : null}

        {step === 0 ? (
          <div className="space-y-3">
            <p className="text-sm text-slate-400 text-right mb-2">اختر نوع الحساب</p>
            {REGISTRATION_TYPES.map((type) => (
              <button
                key={type.value}
                type="button"
                onClick={() => {
                  updateField("type", type.value);
                  nextStep();
                }}
                className={`w-full text-right rounded-xl border p-4 transition-colors ${
                  form.type === type.value
                    ? "border-emerald-500/40 bg-emerald-500/10"
                    : "border-white/10 bg-white/5 hover:border-white/20"
                }`}
              >
                <p className="text-white font-medium">{type.label}</p>
                <p className="text-slate-400 text-xs mt-1">{type.description}</p>
              </button>
            ))}
          </div>
        ) : null}

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
              <label className={labelClasses}>الاسم الكامل</label>
              <input className={inputClasses} value={form.name} onChange={(e) => updateField("name", e.target.value)} required />
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
            <div className="flex gap-2">
              <button type="button" onClick={prevStep} className="flex-1 rounded-xl border border-white/10 py-2.5 text-sm text-slate-300">رجوع</button>
              <button type="submit" className="flex-1 theme-button-primary rounded-xl py-2.5 text-sm font-bold">التالي</button>
            </div>
          </form>
        ) : null}

        {step === 2 && form.type === "OFFICE" ? (
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              nextStep();
            }}
          >
            <div>
              <label className={labelClasses}>اسم المكتب</label>
              <input className={inputClasses} value={form.officeName} onChange={(e) => updateField("officeName", e.target.value)} required />
            </div>
            <div>
              <label className={labelClasses}>رقم الترخيص</label>
              <input className={inputClasses} value={form.licenseNumber} onChange={(e) => updateField("licenseNumber", e.target.value)} required />
            </div>
            <div>
              <label className={labelClasses}>معرف المدينة (اختياري)</label>
              <input type="number" dir="ltr" className={inputClasses} value={form.cityId} onChange={(e) => updateField("cityId", e.target.value)} />
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={prevStep} className="flex-1 rounded-xl border border-white/10 py-2.5 text-sm text-slate-300">رجوع</button>
              <button type="submit" className="flex-1 theme-button-primary rounded-xl py-2.5 text-sm font-bold">التالي</button>
            </div>
          </form>
        ) : null}

        {step === (form.type === "OFFICE" ? 3 : 2) ? (
          <form className="space-y-4" onSubmit={submit}>
            <div>
              <label className={labelClasses}>كلمة المرور</label>
              <input type="password" dir="ltr" className={inputClasses} value={form.password} onChange={(e) => updateField("password", e.target.value)} required minLength={8} />
            </div>
            <div>
              <label className={labelClasses}>تأكيد كلمة المرور</label>
              <input type="password" dir="ltr" className={inputClasses} value={form.confirmPassword} onChange={(e) => updateField("confirmPassword", e.target.value)} required minLength={8} />
            </div>
            {form.type === "OFFICE" ? (
              <div>
                <label className={labelClasses}>ملاحظات (اختياري)</label>
                <textarea className={`${inputClasses} min-h-[80px]`} value={form.notes} onChange={(e) => updateField("notes", e.target.value)} />
              </div>
            ) : null}
            <div className="flex gap-2">
              <button type="button" onClick={prevStep} className="flex-1 rounded-xl border border-white/10 py-2.5 text-sm text-slate-300">رجوع</button>
              <button type="submit" disabled={submitting} className="flex-1 theme-button-primary rounded-xl py-2.5 text-sm font-bold disabled:opacity-60">
                {submitting ? "جاري الإرسال..." : "إرسال الطلب"}
              </button>
            </div>
          </form>
        ) : null}

        <p className="text-center text-slate-500 text-sm mt-6">
          لديك حساب؟{" "}
          <Link to="/login" className="text-emerald-400 hover:text-emerald-300">
            تسجيل الدخول
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
