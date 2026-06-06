import Modal from "../../../components/Modal";
import PhoneInput from "../../../components/common/PhoneInput";
import FormattedNumberInput from "../../../components/common/FormattedNumberInput";
import { validateSaudiPhone } from "../../../shared/validation/saudiPhone";

const inputClasses =
  "w-full rounded-xl border border-white/10 bg-[#111827]/60 px-4 py-2.5 text-sm text-white focus:border-emerald-500/40 focus:outline-none";
const labelClasses = "block text-sm font-medium text-slate-300 mb-1.5";

const OfficeFormModal = ({
  isOpen,
  onClose,
  form,
  setForm,
  onSubmit,
  isEditing,
  isPending,
  phoneTouched = false,
  onPhoneBlur,
}) => {
  const phoneError = validateSaudiPhone(form.phone, { required: false });

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? "تعديل مكتب" : "مكتب جديد"}>
      <form onSubmit={onSubmit} className="space-y-4 text-right">
        <div>
          <label className={labelClasses}>اسم المكتب</label>
          <input className={inputClasses} value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} required />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClasses}>الاسم بالإنجليزية</label>
            <input className={inputClasses} dir="ltr" value={form.nameEn} onChange={(e) => setForm((p) => ({ ...p, nameEn: e.target.value }))} />
          </div>
          <div>
            <label className={labelClasses}>رقم الترخيص</label>
            <input className={inputClasses} dir="ltr" value={form.licenseNumber} onChange={(e) => setForm((p) => ({ ...p, licenseNumber: e.target.value }))} />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <PhoneInput
              label="الهاتف"
              name="phone"
              value={form.phone}
              onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
              onBlur={onPhoneBlur}
              error={phoneError}
              touched={phoneTouched}
            />
          </div>
          <div>
            <label className={labelClasses}>البريد</label>
            <input type="email" className={inputClasses} dir="ltr" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} />
          </div>
        </div>
        <div>
          <label className={labelClasses}>العنوان</label>
          <input className={inputClasses} value={form.address} onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <FormattedNumberInput
              label="معرف المدينة"
              name="cityId"
              dir="ltr"
              value={form.cityId}
              onChange={(e) => setForm((p) => ({ ...p, cityId: e.target.value }))}
              maxDigits={6}
            />
          </div>
          <div>
            <FormattedNumberInput
              label="معرف المدير"
              name="managerUserId"
              dir="ltr"
              value={form.managerUserId}
              onChange={(e) => setForm((p) => ({ ...p, managerUserId: e.target.value }))}
              maxDigits={8}
            />
          </div>
          <div>
            <FormattedNumberInput
              label="معرف الفريق"
              name="teamId"
              dir="ltr"
              value={form.teamId}
              onChange={(e) => setForm((p) => ({ ...p, teamId: e.target.value }))}
              maxDigits={8}
            />
          </div>
        </div>
        {isEditing ? (
          <label className="flex items-center gap-2 text-sm text-slate-300">
            <input type="checkbox" checked={form.isActive} onChange={(e) => setForm((p) => ({ ...p, isActive: e.target.checked }))} />
            المكتب نشط
          </label>
        ) : null}
        <button type="submit" disabled={isPending} className="theme-button-primary w-full rounded-xl py-3 text-sm font-bold disabled:opacity-60">
          {isPending ? "جاري الحفظ..." : "حفظ"}
        </button>
      </form>
    </Modal>
  );
};

export default OfficeFormModal;
