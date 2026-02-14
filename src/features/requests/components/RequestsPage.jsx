import { motion } from "framer-motion";
import Modal from "../../../components/Modal";
import { CityDistrictSelect } from "../../../components/common";
import {
  inputClasses,
  labelClasses,
  submitButtonClasses,
} from "../../../constants/styles";
import {
  PROPERTY_SUBTYPE_OPTIONS_BY_USAGE,
  PRIORITY_OPTIONS,
  PROPERTY_TYPE_OPTIONS,
  PURPOSE_OPTIONS,
  REQUEST_SUBMITTED_BY_OPTIONS,
  USAGE_CLASSIFICATION_OPTIONS,
} from "../../../constants/enums";
import { useRequestsPage } from "../hooks/useRequestsPage";
import { hasRole, ROLES } from "../../../utils/rbac";
import RequestsFilters from "./RequestsFilters";
import RequestsHeader from "./RequestsHeader";
import RequestsList from "./RequestsList";
import RequestsStats from "./RequestsStats";

const RequestsPage = () => {
  const {
    user,
    requests,
    isLoading,
    isSubmitting,
    formModal,
    confirmDelete,
    handleSubmit,
    filters,
    handleChange,
    clearFilters,
    hasActiveFilters,
  } = useRequestsPage();
  const canCreate = hasRole(user, [ROLES.ADMIN, ROLES.MANAGER, ROLES.EMPLOYEE]);

  const handleUsageChange = (e) => {
    const { value } = e.target;
    e.target.setCustomValidity("");
    formModal.setValue("usage", value);
    formModal.setValue("propertySubType", "");
  };

  const handlePropertySubTypeChange = (e) => {
    e.target.setCustomValidity("");
    formModal.handleChange(e);
  };

  const handlePhoneChange = (e) => {
    e.target.setCustomValidity("");
    const digitsOnly = e.target.value.replace(/\D/g, "").slice(0, 15);
    formModal.setValue("brokerContactPhone", digitsOnly);
  };

  const handlePhonePaste = (e) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData("text");
    const digitsOnly = pastedText.replace(/\D/g, "").slice(0, 15);
    formModal.setValue("brokerContactPhone", digitsOnly);
  };

  const handlePhoneKeyDown = (e) => {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    const allowedControlKeys = [
      "Backspace",
      "Delete",
      "ArrowLeft",
      "ArrowRight",
      "Tab",
      "Home",
      "End",
    ];
    if (allowedControlKeys.includes(e.key)) return;
    if (!/^\d$/.test(e.key)) {
      e.preventDefault();
    }
  };

  return (
    <div className="space-y-6">
      <RequestsHeader
        openCreate={canCreate ? formModal.openCreate : undefined}
      />
      <RequestsStats requests={requests} />
      <RequestsFilters
        filters={filters}
        handleChange={handleChange}
        clearFilters={clearFilters}
        hasActiveFilters={hasActiveFilters}
      />

      <RequestsList
        requests={requests}
        isLoading={isLoading}
        user={user}
        openEdit={formModal.openEdit}
        confirmDelete={confirmDelete}
      />

      <Modal
        isOpen={formModal.isOpen}
        onClose={formModal.close}
        title={formModal.isEditing ? "تعديل الطلب" : "إضافة طلب جديد"}
      >
        <form onSubmit={handleSubmit} className="w-full space-y-5 text-right">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClasses}>نوع العقار</label>
              <select
                name="type"
                className={inputClasses}
                value={formModal.formData.type}
                onChange={formModal.handleChange}
                required
              >
                {PROPERTY_TYPE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClasses}>الاستخدام</label>
              <select
                name="usage"
                className={inputClasses}
                value={formModal.formData.usage}
                onChange={handleUsageChange}
                onInvalid={(e) =>
                  e.target.setCustomValidity("الرجاء اختيار الاستخدام")
                }
                required
              >
                <option value="">اختر</option>
                {USAGE_CLASSIFICATION_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="hidden md:block" />
            <div className="md:col-span-2">
              <label className={labelClasses}>نوع العقار</label>
              <select
                name="propertySubType"
                className={inputClasses}
                value={formModal.formData.propertySubType}
                onChange={handlePropertySubTypeChange}
                onInvalid={(e) =>
                  e.target.setCustomValidity("الرجاء اختيار نوع العقار")
                }
                disabled={!formModal.formData.usage}
                required={!!formModal.formData.usage}
              >
                <option value="">
                  {formModal.formData.usage ? "اختر" : "اختر الاستخدام أولًا"}
                </option>
                {(
                  PROPERTY_SUBTYPE_OPTIONS_BY_USAGE[formModal.formData.usage] ||
                  []
                ).map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <fieldset
            disabled={!formModal.formData.usage}
            className="space-y-5 border-0 p-0 m-0"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClasses}>الغرض</label>
                <select
                  name="purpose"
                  className={inputClasses}
                  value={formModal.formData.purpose}
                  onChange={formModal.handleChange}
                >
                  <option value="">اختر</option>
                  {PURPOSE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClasses}>الأولوية</label>
                <select
                  name="priority"
                  className={inputClasses}
                  value={formModal.formData.priority}
                  onChange={formModal.handleChange}
                >
                  {PRIORITY_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className={labelClasses}>مقدم الطلب</label>
              <select
                name="submittedBy"
                className={inputClasses}
                value={formModal.formData.submittedBy}
                onChange={formModal.handleChange}
              >
                <option value="">اختر</option>
                {REQUEST_SUBMITTED_BY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <CityDistrictSelect
              cityValue={formModal.formData.cityId}
              districtValue={formModal.formData.neighborhoodId}
              onCityChange={formModal.handleChange}
              onDistrictChange={formModal.handleChange}
              cityName="cityId"
              districtName="neighborhoodId"
              useCityId
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClasses}>المساحة من</label>
                <input
                  name="areaFrom"
                  type="number"
                  className={inputClasses}
                  value={formModal.formData.areaFrom}
                  onChange={formModal.handleChange}
                />
              </div>
              <div>
                <label className={labelClasses}>المساحة إلى</label>
                <input
                  name="areaTo"
                  type="number"
                  className={inputClasses}
                  value={formModal.formData.areaTo}
                  onChange={formModal.handleChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClasses}>الميزانية من</label>
                <input
                  name="budgetFrom"
                  type="number"
                  className={inputClasses}
                  value={formModal.formData.budgetFrom}
                  onChange={formModal.handleChange}
                />
              </div>
              <div>
                <label className={labelClasses}>الميزانية إلى</label>
                <input
                  name="budgetTo"
                  type="number"
                  className={inputClasses}
                  value={formModal.formData.budgetTo}
                  onChange={formModal.handleChange}
                />
              </div>
            </div>

            <div>
              <label className={labelClasses}>وصف الطلب</label>
              <textarea
                name="description"
                rows={3}
                className={inputClasses}
                value={formModal.formData.description}
                onChange={formModal.handleChange}
              />
            </div>

            <div>
              <label className={labelClasses}>رقم التواصل</label>
              <input
                name="brokerContactPhone"
                className={inputClasses}
                value={formModal.formData.brokerContactPhone}
                onChange={handlePhoneChange}
                onPaste={handlePhonePaste}
                onKeyDown={handlePhoneKeyDown}
                onInvalid={(e) =>
                  e.target.setCustomValidity("يجب إدخال أرقام فقط")
                }
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={15}
                dir="ltr"
              />
            </div>
          </fieldset>

          <div className="mt-6">
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={isSubmitting}
              className={submitButtonClasses}
            >
              {isSubmitting
                ? "جاري الحفظ..."
                : formModal.isEditing
                  ? "تحديث"
                  : "حفظ"}
            </motion.button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default RequestsPage;
