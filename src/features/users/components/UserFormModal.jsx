import { motion } from "framer-motion";
import { useState } from "react";
import { Eye, EyeSlash } from "phosphor-react";
import Modal from "../../../components/Modal";
import { inputClasses, labelClasses } from "../constants/usersConstants";
import { ROLE_OPTIONS } from "../../../constants/enums";

const PHONE_REQUIRED_ROLES = ["MANAGER", "EMPLOYEE", "DATA_ENTRY_ONLY"];

const UserFormModal = ({
  isModalOpen,
  closeModal,
  isEditMode,
  handleSubmit,
  formData,
  handleChange,
  isPending,
  isUserDetailsLoading,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPhoneRequired = PHONE_REQUIRED_ROLES.includes(formData.role);

  const onSubmit = (e) => {
    e.preventDefault();
    if (isUserDetailsLoading) return;
    if (isPhoneRequired && !formData.phone?.trim()) {
      return;
    }
    handleSubmit(e);
  };

  return (
    <Modal
      isOpen={isModalOpen}
      onClose={closeModal}
      title={isEditMode ? "تعديل المستخدم" : "إنشاء مستخدم جديد"}
    >
      <form onSubmit={onSubmit} className="space-y-5 text-right">
        <div>
          <label className={labelClasses}>الاسم الكامل</label>
          <input
            name="name"
            className={inputClasses}
            value={formData.name}
            onChange={handleChange}
            placeholder="أدخل اسم المستخدم"
            required
          />
        </div>
        <div>
          <label className={labelClasses}>البريد الإلكتروني</label>
          <input
            type="email"
            name="email"
            className={inputClasses}
            value={formData.email}
            onChange={handleChange}
            placeholder="user@example.com"
            required
            dir="ltr"
          />
        </div>
        <div>
          <label className={labelClasses}>
            كلمة المرور
            {isEditMode && (
              <span className="text-slate-500 text-xs mr-2">
                (اتركها فارغة للإبقاء على الحالية)
              </span>
            )}
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              className={`${inputClasses} pr-12`}
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required={!isEditMode}
              dir="ltr"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-colors hover:bg-white/5"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeSlash size={20} weight="bold" className="text-slate-400" />
              ) : (
                <Eye size={20} weight="bold" className="text-slate-400" />
              )}
            </button>
          </div>
        </div>
        <div>
          <label className={labelClasses}>الدور</label>
          <select
            name="role"
            className={inputClasses}
            value={formData.role}
            onChange={handleChange}
          >
            {ROLE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClasses}>
            رقم الهاتف
            {isPhoneRequired ? (
              <span className="text-rose-400 text-xs mr-2">*</span>
            ) : (
              <span className="text-slate-500 text-xs mr-2">(اختياري)</span>
            )}
          </label>
          {/* طلب أبو سلطان: إخفاء الرقم المثال مؤقتًا، ونتركه هنا كتعليق لسهولة إرجاعه لاحقًا.
          placeholder="+9660500499849"
          */}
          <input
            type="tel"
            name="phone"
            className={inputClasses}
            value={formData.phone}
            onChange={(e) => {
              const cleaned = e.target.value.replace(/[^0-9+]/g, "");
              handleChange({ target: { name: "phone", value: cleaned } });
            }}
            placeholder="أدخل رقم الهاتف"
            required={isPhoneRequired}
            dir="ltr"
          />
          {isPhoneRequired && !formData.phone?.trim() && (
            <p className="mt-1.5 text-xs text-rose-400">
              رقم الهاتف مطلوب لهذا الدور
            </p>
          )}
        </div>
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          type="submit"
          disabled={isPending || isUserDetailsLoading}
          className="theme-button-primary w-full rounded-xl text-sm font-bold py-3.5 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isUserDetailsLoading
            ? "جاري تحميل البيانات..."
            : isPending
              ? "جاري الحفظ..."
              : isEditMode
                ? "تحديث المستخدم"
                : "حفظ المستخدم"}
        </motion.button>
      </form>
    </Modal>
  );
};

export default UserFormModal;
