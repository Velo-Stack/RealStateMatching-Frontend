import { motion } from "framer-motion";
import { useState } from "react";
import { Eye, EyeSlash, Camera, Trash } from "phosphor-react";
import Modal from "../../../components/Modal";
import { inputClasses, labelClasses, permissionModeOptions } from "../constants/usersConstants";
import { ROLE_OPTIONS } from "../../../constants/enums";
import PermissionSelector from "./PermissionSelector";
import { resolveAvatarUrl } from "../../../utils/uploads";

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
  permissionsCatalog = [],
  canManageCustomPermissions = false,
  onAvatarUpload,
  onAvatarDelete,
  isAvatarPending = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [avatarError, setAvatarError] = useState("");
  const isPhoneRequired = PHONE_REQUIRED_ROLES.includes(formData.role);
  const availablePermissionModes = permissionModeOptions.filter((option) => {
    if (option.value === "ROLE_DEFAULT") return true;
    return canManageCustomPermissions;
  });

  const onSubmit = (e) => {
    e.preventDefault();
    if (isUserDetailsLoading) return;
    if (isPhoneRequired && !formData.phone?.trim()) {
      return;
    }
    if (!isEditMode && formData.permissionMode === "CUSTOM" && !formData.permissions?.length) {
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
        {isEditMode && (
          <div className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <div className="h-16 w-16 rounded-2xl overflow-hidden border border-white/10 shrink-0 bg-slate-800">
              <img
                src={resolveAvatarUrl(formData.avatarUrl)}
                alt={formData.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs font-medium text-emerald-300 hover:bg-emerald-500/20">
                <Camera size={16} />
                {isAvatarPending ? "جاري الرفع..." : "رفع صورة"}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  disabled={isAvatarPending}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    setAvatarError("");
                    if (!file) return;
                    if (file.size > 2 * 1024 * 1024) {
                      setAvatarError("الحد الأقصى 2 ميجابايت");
                      return;
                    }
                    onAvatarUpload?.(file);
                    e.target.value = "";
                  }}
                />
              </label>
              {formData.avatarUrl && (
                <button
                  type="button"
                  disabled={isAvatarPending}
                  onClick={() => onAvatarDelete?.()}
                  className="inline-flex items-center gap-2 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs font-medium text-rose-300 hover:bg-rose-500/20 disabled:opacity-50"
                >
                  <Trash size={16} />
                  حذف
                </button>
              )}
            </div>
            {avatarError && (
              <p className="w-full text-xs text-rose-400">{avatarError}</p>
            )}
          </div>
        )}
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
              className={`${inputClasses} pl-12`}
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required={!isEditMode}
              dir="ltr"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-colors hover:bg-white/5"
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
        {!isEditMode && (
          <div className="space-y-3 rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <div>
              <label className={labelClasses}>نمط الصلاحيات</label>
              <select
                name="permissionMode"
                className={inputClasses}
                value={formData.permissionMode}
                onChange={handleChange}
              >
                {availablePermissionModes.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {formData.permissionMode === "CUSTOM_EMPTY" && (
              <p className="rounded-lg border border-amber-500/20 bg-amber-500/10 px-3 py-2 text-xs text-amber-200">
                هذا المستخدم سيتمكن من تسجيل الدخول فقط، ولن تظهر له أي صفحات داخل النظام.
              </p>
            )}

            {formData.permissionMode === "CUSTOM" && (
              <div className="space-y-2">
                <p className="text-xs text-slate-400">
                  اختر الصلاحيات التي تريد منحها لهذا المستخدم.
                </p>
                <PermissionSelector
                  permissions={permissionsCatalog}
                  value={formData.permissions || []}
                  onChange={(nextPermissions) =>
                    handleChange({
                      target: { name: "permissions", value: nextPermissions },
                    })
                  }
                />
                {!formData.permissions?.length && (
                  <p className="text-xs text-rose-400">
                    يجب اختيار صلاحية واحدة على الأقل عند استخدام الصلاحيات المخصصة.
                  </p>
                )}
              </div>
            )}
          </div>
        )}
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
