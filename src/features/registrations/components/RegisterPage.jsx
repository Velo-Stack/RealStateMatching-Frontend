import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  UploadSimple,
  CheckCircle,
  X,
  Check,
  ShieldCheck,
  CalendarBlank,
  User,
  EnvelopeSimple,
  Phone,
  Buildings,
  IdentificationCard,
  MapPin,
  Lock,
  Eye,
  EyeSlash,
  FileText,
} from "phosphor-react";
import { useRegister } from "../hooks/useRegister";
import { REGISTRATION_TYPES } from "../constants/registrationsConstants";
import { fetchSelfRegistrationStatus } from "../services/registrationsApi";
import { validateSaudiPhone } from "../../../shared/validation/saudiPhone";
import { validateEmail } from "../../../shared/validation/email";
import Modal from "../../../components/Modal";

const labelClasses = "block mb-2 text-xs font-bold text-slate-700 text-right";
const inputShellClasses =
  "login-input-shell flex items-center rounded-2xl border border-slate-300 bg-white transition-all duration-300 hover:border-[#c79a32] focus-within:border-[#c79a32] focus-within:ring-2 focus-within:ring-[#c79a32]/20 shadow-sm";
const inputClasses =
  "login-input min-w-0 flex-1 border-none bg-transparent py-3.5 px-4 text-sm text-slate-900 placeholder-slate-400 outline-none font-medium w-full";

const RegisterPage = () => {
  const [enabled, setEnabled] = useState(null);
  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

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
    document.documentElement.setAttribute("data-theme", "light");
    fetchSelfRegistrationStatus()
      .then((data) => setEnabled(Boolean(data?.enabled)))
      .catch(() => setEnabled(false));
  }, []);

  if (enabled === null) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-600 text-sm">
        جاري التحميل...
      </div>
    );
  }

  if (!enabled) {
    return <Navigate to="/login" replace />;
  }

  const base = import.meta.env.BASE_URL || "/";
  const brandImageSrc = `${base}rawash-black.png`;

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
      setError("تاريخ الميلاد مطلوب");
      return false;
    }
    setError("");
    return true;
  };

  const validateDocStep = () => {
    if (!form.nationalIdNumber?.trim()) {
      setError("رقم الهوية الشخصية / الوطنية مطلوب");
      return false;
    }
    if (!form.nationalIdFile) {
      setError("إرفاق ملف أو صورة الهوية الشخصية مطلوب");
      return false;
    }
    setError("");
    return true;
  };

  const emailError = touched.email && validateEmail(form.email);
  const phoneError = touched.phone && validateSaudiPhone(form.phone);

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
    <div className="login-page min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#faf7f0] via-[#f5f0e1] to-[#ede7d5]" dir="rtl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl bg-[#eef2f7]/95 backdrop-blur-2xl border border-slate-300/80 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-slate-900/10"
      >
        <div className="text-center mb-6">
          <Link to="/" className="inline-block mb-4">
            <img src={brandImageSrc} alt="Rawash" className="h-16 mx-auto object-contain" />
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">إنشاء حساب جديد</h1>
          <p className="text-slate-600 text-sm mt-1">سيتم مراجعة طلبك من قبل إدارة منصة رواسخ</p>

          {step > 0 ? (
            <div className="flex items-center justify-center gap-2 mt-4">
              {[1, isOffice ? 2 : null, docStepIndex, finalStepIndex]
                .filter(Boolean)
                .map((idx, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div
                      className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center transition-all ${step >= idx
                        ? "bg-gradient-to-r from-[#e7c25a] to-[#b8962e] text-[#1c1408] shadow-md"
                        : "bg-white text-slate-400 border border-slate-300"
                        }`}
                    >
                      {step > idx ? <Check size={14} weight="bold" /> : i + 1}
                    </div>
                    {i < (isOffice ? 3 : 2) ? (
                      <div
                        className={`w-6 h-0.5 transition-colors ${step > idx ? "bg-[#b8962e]" : "bg-slate-300"
                          }`}
                      />
                    ) : null}
                  </div>
                ))}
            </div>
          ) : null}
        </div>

        {error ? (
          <div className="mb-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 text-right flex items-center gap-2 font-medium">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        ) : null}

        {/* Step 0: Type Selection */}
        {step === 0 ? (
          <div className="space-y-3">
            <p className="text-sm text-slate-700 text-right mb-2 font-bold">اختر نوع الحساب للانضمام:</p>
            {REGISTRATION_TYPES.map((type) => (
              <button
                key={type.value}
                type="button"
                onClick={() => {
                  updateField("type", type.value);
                  setError("");
                  nextStep();
                }}
                className={`w-full text-right rounded-2xl border p-4 transition-all duration-200 ${form.type === type.value
                  ? "border-[#c79a32] bg-white shadow-md shadow-amber-500/10 ring-2 ring-[#c79a32]/20"
                  : "border-slate-300 bg-white/70 hover:border-slate-400 hover:bg-white"
                  }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-900 font-bold text-base">{type.label}</p>
                    <p className="text-slate-600 text-xs mt-1 leading-relaxed">{type.description}</p>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center ${form.type === type.value
                      ? "border-[#c79a32] bg-[#c79a32] text-slate-950"
                      : "border-slate-400"
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
              <label className={labelClasses}>
                الاسم الكامل <span className="text-[#b8962e]">*</span>
              </label>
              <div className={inputShellClasses}>
                <span className="flex items-center pl-4 text-slate-500 pr-3">
                  <User size={19} />
                </span>
                <input
                  className={inputClasses}
                  placeholder="أدخل اسمك كما هو في الهوية"
                  value={form.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className={labelClasses}>
                البريد الإلكتروني <span className="text-[#b8962e]">*</span>
              </label>
              <div dir="ltr" className={inputShellClasses}>
                <span className="flex items-center pl-4 text-slate-500">
                  <EnvelopeSimple size={19} />
                </span>
                <input
                  type="email"
                  dir="ltr"
                  className={inputClasses}
                  placeholder="name@example.com"
                  value={form.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  onBlur={() => touch("email")}
                  required
                />
              </div>
              {emailError ? (
                <p className="text-xs text-red-500 mt-1 text-right">{emailError}</p>
              ) : null}
            </div>

            <div>
              <label className={labelClasses}>
                رقم الجوال <span className="text-[#b8962e]">*</span>
              </label>
              <div dir="ltr" className={inputShellClasses}>
                <span className="flex items-center pl-4 text-slate-500">
                  <Phone size={19} />
                </span>
                <input
                  type="tel"
                  dir="ltr"
                  className={inputClasses}
                  placeholder="5xxxxxxxx"
                  value={form.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                  onBlur={() => touch("phone")}
                  required
                />
              </div>
              {phoneError ? (
                <p className="text-xs text-red-500 mt-1 text-right">{phoneError}</p>
              ) : null}
            </div>

            <div>
              <label className={labelClasses}>
                تاريخ الميلاد <span className="text-[#b8962e]">*</span>
              </label>
              <div className={inputShellClasses}>
                <span className="flex items-center pl-4 text-slate-500 pr-3">
                  <CalendarBlank size={19} />
                </span>
                <input
                  type="date"
                  min="1930-01-01"
                  max={new Date().toISOString().split("T")[0]}
                  className={inputClasses}
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
                className="flex-1 rounded-2xl border border-slate-300 bg-white py-3 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-50 transition-colors"
              >
                رجوع
              </button>
              <button
                type="submit"
                className="flex-1 rounded-2xl py-3 text-sm font-bold text-[#1c1408] bg-gradient-to-r from-[#e7c25a] via-[#d4af37] to-[#b8962e] shadow-md hover:brightness-105 transition-colors"
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
              <label className={labelClasses}>
                اسم المكتب العقاري <span className="text-[#b8962e]">*</span>
              </label>
              <div className={inputShellClasses}>
                <span className="flex items-center pl-4 text-slate-500 pr-3">
                  <Buildings size={19} />
                </span>
                <input
                  className={inputClasses}
                  placeholder="أدخل اسم المكتب التجاري"
                  value={form.officeName}
                  onChange={(e) => updateField("officeName", e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className={labelClasses}>
                رقم الترخيص / السجل التجارية <span className="text-[#b8962e]">*</span>
              </label>
              <div className={inputShellClasses}>
                <span className="flex items-center pl-4 text-slate-500 pr-3">
                  <IdentificationCard size={19} />
                </span>
                <input
                  className={inputClasses}
                  placeholder="أدخل رقم الترخيص الرسمي"
                  value={form.licenseNumber}
                  onChange={(e) => updateField("licenseNumber", e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className={labelClasses}>معرف المدينة (اختياري)</label>
              <div dir="ltr" className={inputShellClasses}>
                <span className="flex items-center pl-4 text-slate-500">
                  <MapPin size={19} />
                </span>
                <input
                  type="number"
                  dir="ltr"
                  placeholder="مثال: 1"
                  className={inputClasses}
                  value={form.cityId}
                  onChange={(e) => updateField("cityId", e.target.value)}
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={prevStep}
                className="flex-1 rounded-2xl border border-slate-300 bg-white py-3 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-50 transition-colors"
              >
                رجوع
              </button>
              <button
                type="submit"
                className="flex-1 rounded-2xl py-3 text-sm font-bold text-[#1c1408] bg-gradient-to-r from-[#e7c25a] via-[#d4af37] to-[#b8962e] shadow-md hover:brightness-105 transition-colors"
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
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 text-right">
              <div className="flex items-center gap-2 text-[#b8962e] font-bold text-sm mb-1">
                <ShieldCheck size={20} />
                <span>سرية وأمان المستندات</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                جميع المرفقات والوثائق الرسمية المشفرة محفوظة بسيرفراتنا المحمية، ولا يتم الاطلاع عليها إلا من قِبل إدارة منصة رواسخ لغرض التدقيق فقط.
              </p>
            </div>

            {/* National ID Number Input (REQUIRED) */}
            <div>
              <label className={labelClasses}>
                رقم الهوية الشخصية / الوطنية <span className="text-[#b8962e]">* (مطلوب)</span>
              </label>
              <div className={inputShellClasses}>
                <span className="flex items-center pl-4 text-slate-500 pr-3">
                  <IdentificationCard size={19} />
                </span>
                <input
                  type="text"
                  className={inputClasses}
                  placeholder="أدخل رقم الهوية (مثال: 1012345678)"
                  value={form.nationalIdNumber}
                  onChange={(e) => updateField("nationalIdNumber", e.target.value)}
                />
              </div>
            </div>

            {/* National ID Upload (REQUIRED) */}
            <div>
              <label className={labelClasses}>
                صورة / ملف الهوية الشخصية <span className="text-[#b8962e]">* (مطلوب)</span>
              </label>

              {form.nationalIdFile ? (
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-slate-300 text-slate-900 shadow-sm">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <CheckCircle size={24} className="text-[#b8962e] shrink-0" />
                    <div className="truncate text-right">
                      <p className="text-sm font-bold truncate">{form.nationalIdFile.name}</p>
                      <p className="text-xs text-slate-500">
                        {(form.nationalIdFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => updateField("nationalIdFile", null)}
                    className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full p-5 border-2 border-dashed border-slate-300 rounded-2xl cursor-pointer hover:border-[#b8962e] bg-white transition-all text-center shadow-sm">
                  <UploadSimple size={32} className="text-[#b8962e] mb-2" />
                  <span className="text-sm font-bold text-slate-800">اضغط لرفع صورة أو ملف الهوية</span>
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

            {/* Val License Section (OPTIONAL) */}
            <div className="space-y-3 p-4 bg-white border border-slate-300 rounded-2xl shadow-sm">
              <label className="block text-sm font-bold text-[#b8962e] text-right">
                بيانات رخصة فال العقارية <span className="text-slate-500 font-normal text-xs">(اختياري)</span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 text-right">رقم رخصة فال</label>
                  <div className={inputShellClasses}>
                    <span className="flex items-center pl-4 text-slate-500 pr-3">
                      <FileText size={19} />
                    </span>
                    <input
                      className={inputClasses}
                      placeholder="مثال: 1200012345"
                      value={form.falLicenseNumber}
                      onChange={(e) => updateField("falLicenseNumber", e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 text-right">تاريخ انتهاء الرخصة</label>
                  <div className={inputShellClasses}>
                    <span className="flex items-center pl-4 text-slate-500 pr-3">
                      <CalendarBlank size={19} />
                    </span>
                    <input
                      type="date"
                      min="2020-01-01"
                      max="2100-01-01"
                      className={inputClasses}
                      value={form.falLicenseExpiry}
                      onChange={(e) => updateField("falLicenseExpiry", e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 text-right">صورة / ملف رخصة فال</label>
                {form.valLicenseFile ? (
                  <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-300 text-slate-900">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <CheckCircle size={24} className="text-[#b8962e] shrink-0" />
                      <div className="truncate text-right">
                        <p className="text-sm font-bold truncate">{form.valLicenseFile.name}</p>
                        <p className="text-xs text-slate-500">
                          {(form.valLicenseFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => updateField("valLicenseFile", null)}
                      className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-colors"
                    >
                      <X size={18} />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full p-4 border border-dashed border-slate-300 rounded-2xl cursor-pointer hover:border-[#b8962e] bg-slate-50/50 transition-all text-center">
                    <UploadSimple size={24} className="text-slate-500 mb-1" />
                    <span className="text-xs font-bold text-slate-700">اضغط لرفع نسخة من رخصة فال (اختياري)</span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,application/pdf"
                      className="hidden"
                      onChange={(e) => handleFileUpload("valLicenseFile", e.target.files[0])}
                    />
                  </label>
                )}
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={prevStep}
                className="flex-1 rounded-2xl border border-slate-300 bg-white py-3 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-50 transition-colors"
              >
                رجوع
              </button>
              <button
                type="submit"
                className="flex-1 rounded-2xl py-3 text-sm font-bold text-[#1c1408] bg-gradient-to-r from-[#e7c25a] via-[#d4af37] to-[#b8962e] shadow-md hover:brightness-105 transition-colors"
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
              <label className={labelClasses}>
                كلمة المرور <span className="text-[#b8962e]">*</span>
              </label>
              <div dir="ltr" className={inputShellClasses}>
                <span className="flex items-center pl-4 text-slate-500">
                  <Lock size={19} />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  dir="ltr"
                  className={inputClasses}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => updateField("password", e.target.value)}
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="flex items-center pl-2 pr-4 text-slate-500 transition-colors hover:text-[#b8962e]"
                >
                  {showPassword ? <EyeSlash size={19} /> : <Eye size={19} />}
                </button>
              </div>
            </div>

            <div>
              <label className={labelClasses}>
                تأكيد كلمة المرور <span className="text-[#b8962e]">*</span>
              </label>
              <div dir="ltr" className={inputShellClasses}>
                <span className="flex items-center pl-4 text-slate-500">
                  <Lock size={19} />
                </span>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  dir="ltr"
                  className={inputClasses}
                  placeholder="••••••••"
                  value={form.confirmPassword}
                  onChange={(e) => updateField("confirmPassword", e.target.value)}
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="flex items-center pl-2 pr-4 text-slate-500 transition-colors hover:text-[#b8962e]"
                >
                  {showConfirmPassword ? <EyeSlash size={19} /> : <Eye size={19} />}
                </button>
              </div>
            </div>

            {isOffice ? (
              <div>
                <label className={labelClasses}>ملاحظات إضافية (اختياري)</label>
                <div className={inputShellClasses}>
                  <textarea
                    className={`${inputClasses} min-h-[70px] resize-none`}
                    placeholder="أي معلومات إضافية تود إبلاغ الإدارة بها..."
                    value={form.notes}
                    onChange={(e) => updateField("notes", e.target.value)}
                  />
                </div>
              </div>
            ) : null}

            {/* Terms & Conditions Agreement */}
            <div className="pt-2">
              <div className="space-y-3 text-right">
                <label className="flex items-start gap-3 cursor-pointer select-none bg-white p-3.5 rounded-2xl border border-slate-300 shadow-sm hover:border-[#b8962e] transition-colors">
                  <input
                    type="checkbox"
                    checked={form.agreedToTerms}
                    onChange={(e) => updateField("agreedToTerms", e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded border-slate-300 text-[#b8962e] focus:ring-[#b8962e] cursor-pointer shrink-0"
                  />
                  <span className="text-xs text-slate-800 font-bold leading-relaxed">
                    أوافق على{" "}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setShowTermsModal(true);
                      }}
                      className="text-[#b8962e] underline font-extrabold hover:text-[#967722] transition-colors inline-block px-1 underline-offset-4 decoration-[#b8962e] decoration-2"
                    >
                      الشروط والأحكام
                    </button>{" "}
                    الموضحة للتطبيق <span className="text-[#b8962e]">* (مطلوب)</span>
                  </span>
                </label>

                <label className="flex items-start gap-3 cursor-pointer select-none bg-white p-3.5 rounded-2xl border border-slate-300 shadow-sm hover:border-[#b8962e] transition-colors">
                  <input
                    type="checkbox"
                    checked={form.pledgeCorrectData}
                    onChange={(e) => updateField("pledgeCorrectData", e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded border-slate-300 text-[#b8962e] focus:ring-[#b8962e] cursor-pointer shrink-0"
                  />
                  <span className="text-xs text-slate-800 font-bold leading-relaxed">
                    أتعهد بأن جميع البيانات المدخلة والوثائق المرفقة صحيحة ورسمية وأتحمل كافة المسؤوليات النظامية <span className="text-[#b8962e]">* (مطلوب)</span>
                  </span>
                </label>
              </div>
            </div>


            <div className="flex gap-3 pt-3">
              <button
                type="button"
                onClick={prevStep}
                className="flex-1 rounded-2xl border border-slate-300 bg-white py-3 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-50 transition-colors"
              >
                رجوع
              </button>
              <button
                type="submit"
                disabled={submitting || !form.agreedToTerms || !form.pledgeCorrectData}
                className="flex-1 rounded-2xl py-3 text-sm font-bold text-[#1c1408] bg-gradient-to-r from-[#e7c25a] via-[#d4af37] to-[#b8962e] shadow-md hover:brightness-105 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "جاري الإرسال..." : "إرسال الطلب"}
              </button>
            </div>
          </form>
        ) : null}

        <p className="text-center text-slate-600 text-xs sm:text-sm mt-6 font-medium">
          لديك حساب بالفعل؟{" "}
          <Link to="/login" className="text-[#b8962e] hover:text-[#967720] font-bold">
            تسجيل الدخول
          </Link>
        </p>
      </motion.div>

      {/* Terms & Conditions Modal */}
      <Modal
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
        title="الشروط والأحكام لتسجيل مستخدم جديد"
        maxWidthClass="max-w-2xl"
      >
        <div className="text-right text-xs leading-relaxed text-slate-700 space-y-4 font-medium" dir="rtl">
          <p className="text-slate-700 font-medium leading-relaxed bg-amber-500/10 p-3.5 rounded-xl border border-amber-500/20 text-xs">
            أهلاً بك في التطبيق العقاري. يُرجى قراءة هذه الشروط والأحكام بعناية قبل إتمام عملية التسجيل. يُعد إنشاؤك للحساب أو استخدامك للتطبيق بمثابة موافقة صريحة وكاملة على جميع الأحكام والبنود الواردة أدناه:
          </p>

          <div className="space-y-2 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <h5 className="font-bold text-[#b8962e] text-xs sm:text-sm">المادة الأولى: شروط الحساب والتسجيل</h5>
            <ul className="list-disc pr-4 space-y-1.5 text-slate-600">
              <li><strong className="text-slate-900">أهلية الاستخدام:</strong> يقر المستخدم بأنه يمتلك الأهلية القانونية والنظامية الكاملة للتعاقد واستخدام التطبيق وفقاً للأنظمة واللوائح السارية في المملكة العربية السعودية.</li>
              <li><strong className="text-slate-900">صحة البيانات:</strong> يلتزم المستخدم بتقديم معلومات صحيحة، دقيقة، ومحدثة أثناء عملية التسجيل (مثل الاسم، رقم الهوية/الإقامة، رقم الجوال، والبريد الإلكتروني)، ويتحمل كامل المسؤولية النظامية عن أي معلومات خاطئة أو مضللة.</li>
              <li><strong className="text-slate-900">أمان الحساب:</strong> المستخدم مسؤول مسؤولية كاملة عن الحفاظ على سرية بيانات حسابه وكلمة المرور، وعن جميع الأنشطة والتعاملات التي تتم من خلال حسابه.</li>
            </ul>
          </div>

          <div className="space-y-2 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <h5 className="font-bold text-[#b8962e] text-xs sm:text-sm">المادة الثانية: عمولة الوساطة العقارية (السعي)</h5>
            <ul className="list-disc pr-4 space-y-1.5 text-slate-600">
              <li><strong className="text-slate-900">1.1 تحديد قيمة/نسبة السعي:</strong> تقر وتوافق بصفتك مستخدماً للتطبيق على أن الشركة العقارية (المالك والمشغل للتطبيق) هي الجهة الوحيدة المخولة بتحديد قيمة أو نسبة عمولة الوساطة العقارية ("السعي") الخاصة بأي صفقة عقارية (بيع، شراء، أو إيجار) تتم أو يتم التوصل إليها من خلال التطبيق.</li>
              <li><strong className="text-slate-900">1.2 الالتزام بالسداد:</strong> يلتزم المستخدم بدفع السعي المحدد والموضح في تفاصيل العقار أو العقد المبرم، وذلك فور استحقاقها نظاماً عند إتمام الصفقة أو توقيع العقد لحساب شركة رواسخ.</li>
              <li><strong className="text-slate-900">1.3 الامتثال للأنظمة:</strong> تخضع نسبة أو قيمة السعي للحدود والأنظمة واللوائح الصادرة عن الهيئة العامة للعقار والجهات المختصة، وحسب المتفق عليه مع شركة رواسخ.</li>
            </ul>
          </div>

          <div className="space-y-2 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <h5 className="font-bold text-[#b8962e] text-xs sm:text-sm">المادة الثالثة: الاستخدام المقبول والالتزامات</h5>
            <ul className="list-disc pr-4 space-y-1.5 text-slate-600">
              <li><strong className="text-slate-900">حظر التهرب من السعي:</strong> يُحظر الاتفاق المباشر أو المحاولة بين أطراف الصفقة للتحايل أو التهرب من دفع عمولة السعي المستحقة للشركة العقارية. وتحتفظ الشركة بكامل حقها القانوني والمقاضاة والمطالبة بالتعويضات وتطبيق الغرامات المقررة عند ثبوت ذلك.</li>
              <li><strong className="text-slate-900">الاستخدام المشروع:</strong> يلتزم المستخدم بعدم استخدام التطبيق في أي أغراض غير مشروعة أو مخالفة للأنظمة العقارية واللوائح التنفيذية المعمول بها.</li>
            </ul>
          </div>

          <div className="space-y-2 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <h5 className="font-bold text-[#b8962e] text-xs sm:text-sm">المادة الرابعة: التعديلات وإلغاء الحساب</h5>
            <ul className="list-disc pr-4 space-y-1.5 text-slate-600">
              <li><strong className="text-slate-900">تحديث الشروط:</strong> تحتفظ الشركة بحقها في تعديل أو تحديث هذه الشروط والأحكام في أي وقت، ويسري التعديل من تاريخ نشره على التطبيق.</li>
              <li><strong className="text-slate-900">إيقاف الحساب:</strong> يحق للشركة تعليق أو إلغاء حساب أي مستخدم بشكل مباشر في حال ثبوت مخالفته لأي بند من الشروط والأحكام دون أدنى مسؤولية على الشركة.</li>
            </ul>
          </div>

          <div className="pt-2 flex items-center justify-between gap-3 border-t border-slate-200">
            <button
              type="button"
              onClick={() => {
                updateField("agreedToTerms", true);
                setShowTermsModal(false);
              }}
              className="w-full rounded-xl py-3 text-xs sm:text-sm font-bold text-[#1c1408] bg-gradient-to-r from-[#e7c25a] via-[#d4af37] to-[#b8962e] shadow-md hover:brightness-105 transition-all"
            >
              قرأت وموافق على الشروط والأحكام
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default RegisterPage;
