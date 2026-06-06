import { useState } from "react";
import { Eye, EyeSlash, Camera, Trash } from "phosphor-react";
import PhoneInput from "../../../components/common/PhoneInput";
import { inputClasses, labelClasses, permissionModeOptions } from "../constants/usersConstants";
import { ROLE_OPTIONS } from "../../../constants/enums";
import PermissionSelector from "./PermissionSelector";
import { resolveAvatarUrl, handleAvatarImageError } from "../../../utils/uploads";
import { validateSaudiPhone } from "../../../shared/validation";

const PHONE_REQUIRED_ROLES = ["MANAGER", "EMPLOYEE", "DATA_ENTRY_ONLY"];

const UserFormFields = ({
  isEditMode = false,
  formData,
  handleChange,
  isUserDetailsLoading = false,
  permissionsCatalog = [],
  canManageCustomPermissions = false,
  onAvatarUpload,
  onAvatarDelete,
  isAvatarPending = false,
  avatarCacheKey,
  showPermissionsSection = true,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [avatarError, setAvatarError] = useState("");
  const [phoneTouched, setPhoneTouched] = useState(false);
  const isPhoneRequired = PHONE_REQUIRED_ROLES.includes(formData.role);
  const phoneError = phoneTouched ? validateSaudiPhone(formData.phone, { required: isPhoneRequired }) : null;

  const availablePermissionModes = permissionModeOptions.filter((option) => {
    if (option.value === "ROLE_DEFAULT") return true;
    return canManageCustomPermissions;
  });

  return (
    <div className="space-y-5">
      {isEditMode && (
        <div className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <div className="h-16 w-16 rounded-2xl overflow-hidden border border-white/10 shrink-0 bg-slate-800">
            <img
              key={`${formData.avatarUrl || "none"}-${avatarCacheKey || 0}`}
              src={resolveAvatarUrl(formData.avatarUrl, avatarCacheKey)}
              alt={formData.name}
              className="h-full w-full object-cover"
              onError={handleAvatarImageError}
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
          {avatarError && <p className="w-full text-xs text-rose-400">{avatarError}</p>}
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
          disabled={isUserDetailsLoading}
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
          disabled={isUserDetailsLoading}
        />
      </div>

      <div>
        <label className={labelClasses}>
          كلمة المرور
          {isEditMode && (
            <span className="text-slate-500 text-xs mr-2">(اتركها فارغة للإبقاء على الحالية)</span>
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
            disabled={isUserDetailsLoading}
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
          disabled={isUserDetailsLoading}
        >
          {ROLE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {!isEditMode && showPermissionsSection && (
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
              <PermissionSelector
                permissions={permissionsCatalog}
                value={formData.permissions || []}
                onChange={(nextPermissions) =>
                  handleChange({ target: { name: "permissions", value: nextPermissions } })
                }
              />
            </div>
          )}
        </div>
      )}

      <PhoneInput
        label="رقم الهاتف"
        name="phone"
        value={formData.phone || ""}
        onChange={(e) => {
          setPhoneTouched(true);
          handleChange(e);
        }}
        onBlur={() => setPhoneTouched(true)}
        error={phoneError}
        touched={phoneTouched}
        required={isPhoneRequired}
      />
    </div>
  );
};

export default UserFormFields;
