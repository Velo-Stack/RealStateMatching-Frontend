import { toast } from "sonner";
import { motion as Motion } from "framer-motion";
import Modal from "../../../components/Modal";
import { CityDistrictSelect, MultiNeighborhoodSelect } from "../../../components/common";
import ValidatedInput from "../../../components/common/ValidatedInput";
import ValidatedSelect from "../../../components/common/ValidatedSelect";
import PhoneInput from "../../../components/common/PhoneInput";
import {
  inputClasses,
  labelClasses,
  submitButtonClasses,
} from "../../../constants/styles";
import {
  PROPERTY_SUBTYPE_OPTIONS_BY_USAGE,
  PRIORITY_OPTIONS,
  PURPOSE_OPTIONS,
  REQUEST_SUBMITTED_BY_OPTIONS,
  USAGE_CLASSIFICATION_OPTIONS,
} from "../../../constants/enums";
import { useRequestFormValidation } from "../hooks/useRequestFormValidation";

const RequestFormSection = ({
  formModal,
  handleSubmit,
  isSubmitting,
  handleUsageChange,
  handlePropertySubTypeChange,
  handleAreaChange,
  handleAreaPaste,
  handleAreaKeyDown,
  handleBudgetChange,
  handleBudgetPaste,
  handleBudgetKeyDown,
  handlePhoneChange,
  handlePhonePaste,
  handlePhoneKeyDown,
}) => {
  const { errors, touched, validateForm, touchAllFields, handleBlur } =
    useRequestFormValidation();

  const localHandleSubmit = (e) => {
    e.preventDefault();
    touchAllFields(formModal.formData);
    const isValid = validateForm(formModal.formData);
    if (!isValid) {
      toast.error("الرجاء تصحيح الأخطاء في النموذج");
      return;
    }
    if (formModal.formData.budgetFrom && formModal.formData.budgetTo) {
      const fromVal = Number(
        String(formModal.formData.budgetFrom).replace(/,/g, "")
      );
      const toVal = Number(
        String(formModal.formData.budgetTo).replace(/,/g, "")
      );
      if (!isNaN(fromVal) && !isNaN(toVal) && toVal < fromVal) {
        toast.error(
          "يجب أن تكون الميزانية (إلى) أكبر من أو تساوي الميزانية (من)"
        );
        return;
      }
    }
    handleSubmit(e);
  };

  const handleFieldChange = (e, customHandler) => {
    if (customHandler) {
      customHandler(e);
    } else {
      formModal.handleChange(e);
    }
    if (touched[e.target.name]) {
      handleBlur(e.target.name, {
        ...formModal.formData,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleBudgetFieldBlur = (fieldName) => {
    handleBlur(fieldName, formModal.formData);
    // Validate both budget fields when either one loses focus
    if (fieldName === "budgetFrom" || fieldName === "budgetTo") {
      const fromVal = Number(String(formModal.formData.budgetFrom || "0").replace(/,/g, ""));
      const toVal = Number(String(formModal.formData.budgetTo || "0").replace(/,/g, ""));
      
      if (formModal.formData.budgetFrom && formModal.formData.budgetTo && !isNaN(fromVal) && !isNaN(toVal)) {
        if (toVal < fromVal) {
          // Trigger validation for budgetTo field
          handleBlur("budgetTo", formModal.formData);
        }
      }
    }
  };

  return (
    <Modal
      isOpen={formModal.isOpen}
      onClose={formModal.close}
      title={formModal.isEditing ? "تعديل الطلب" : "إضافة طلب جديد"}
    >
      <form
        onSubmit={localHandleSubmit}
        className="w-full space-y-6 text-right"
      >
        {/* قسم معلومات العقار الأساسية */}
        <div 
          className="p-4 rounded-lg space-y-4 border mb-5"
          style={{
            backgroundColor: 'var(--bg-elevated)',
            borderColor: 'var(--border-default)',
          }}
        >
          <h3 
            className="text-lg font-semibold mb-3"
            style={{ color: 'var(--text-primary)' }}
          >
            معلومات العقار الأساسية
          </h3>

          <ValidatedSelect
            label="الاستخدام"
            name="usage"
            value={formModal.formData.usage}
            onChange={(e) => {
              handleFieldChange(e, handleUsageChange);
            }}
            onBlur={() => handleBlur("usage", formModal.formData)}
            error={errors.usage}
            touched={touched.usage}
            required
          >
            <option value="">اختر</option>
            {USAGE_CLASSIFICATION_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </ValidatedSelect>

          <ValidatedSelect
            label="نوع العقار"
            name="propertySubType"
            value={formModal.formData.propertySubType}
            onChange={(e) => {
              handleFieldChange(e, handlePropertySubTypeChange);
            }}
            onBlur={() => handleBlur("propertySubType", formModal.formData)}
            error={errors.propertySubType}
            touched={touched.propertySubType}
            disabled={!formModal.formData.usage}
            required
          >
            <option value="">
              {formModal.formData.usage ? "اختر" : "اختر الاستخدام أولًا"}
            </option>
            {(
              PROPERTY_SUBTYPE_OPTIONS_BY_USAGE[formModal.formData.usage] || []
            ).map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </ValidatedSelect>
        </div>

        {/* قسم تفاصيل الطلب */}
        <fieldset
          disabled={!formModal.formData.usage}
          className="p-4 rounded-lg space-y-4 border-0 m-0 border mb-5"
          style={{
            backgroundColor: 'var(--bg-elevated)',
            borderColor: 'var(--border-default)',
          }}
        >
          <h3 
            className="text-lg font-semibold mb-3"
            style={{ color: 'var(--text-primary)' }}
          >
            تفاصيل الطلب
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ValidatedSelect
              label="الغرض"
              name="purpose"
              value={formModal.formData.purpose}
              onChange={(e) => handleFieldChange(e)}
              onBlur={() => handleBlur("purpose", formModal.formData)}
              error={errors.purpose}
              touched={touched.purpose}
              required
            >
              <option value="">اختر</option>
              {PURPOSE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </ValidatedSelect>

            <ValidatedSelect
              label="الأولوية"
              name="priority"
              value={formModal.formData.priority}
              onChange={(e) => handleFieldChange(e)}
              onBlur={() => handleBlur("priority", formModal.formData)}
              error={errors.priority}
              touched={touched.priority}
            >
              {PRIORITY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </ValidatedSelect>
          </div>

          <ValidatedSelect
            label="مقدم الطلب"
            name="submittedBy"
            value={formModal.formData.submittedBy}
            onChange={(e) => handleFieldChange(e)}
            onBlur={() => handleBlur("submittedBy", formModal.formData)}
            error={errors.submittedBy}
            touched={touched.submittedBy}
            required
          >
            <option value="">اختر</option>
            {REQUEST_SUBMITTED_BY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </ValidatedSelect>
        </fieldset>

        {/* قسم الموقع والمساحة */}
        <fieldset
          disabled={!formModal.formData.usage}
          className="p-4 rounded-lg space-y-4 border-0 m-0 border mb-5"
          style={{
            backgroundColor: 'var(--bg-elevated)',
            borderColor: 'var(--border-default)',
          }}
        >
          <h3 
            className="text-lg font-semibold mb-3"
            style={{ color: 'var(--text-primary)' }}
          >
            الموقع والمساحة
          </h3>

          <CityDistrictSelect
            cityValue={formModal.formData.cityId}
            districtValue={formModal.formData.neighborhoodId}
            onCityChange={(e) => {
              formModal.handleChange(e);
              // Reset neighborhoods when city changes
              formModal.setValue("neighborhoodIds", []);
            }}
            onDistrictChange={formModal.handleChange}
            cityName="cityId"
            districtName="neighborhoodId"
            useCityId
            required
            hideDistrict
            fullWidth
          />

          <div className="w-full">
            <MultiNeighborhoodSelect
              cityId={formModal.formData.cityId}
              selectedNeighborhoodIds={formModal.formData.neighborhoodIds || []}
              onChange={(neighborhoodIds) => {
                formModal.setValue("neighborhoodIds", neighborhoodIds);
                // Also update single neighborhoodId for backward compatibility
                if (neighborhoodIds.length > 0) {
                  formModal.setValue("neighborhoodId", neighborhoodIds[0]);
                }
              }}
              error={errors.neighborhoodIds}
              touched={touched.neighborhoodIds}
              required
            />
          </div>

          <ValidatedInput
            label="المساحة"
            name="area"
            type="text"
            inputMode="numeric"
            pattern="[0-9,]*"
            value={
              formModal.formData.area ??
              formModal.formData.areaFrom ??
              formModal.formData.areaTo ??
              ""
            }
            onChange={(e) => handleFieldChange(e, handleAreaChange)}
            onPaste={handleAreaPaste}
            onKeyDown={handleAreaKeyDown}
            onBlur={() => handleBlur("area", formModal.formData)}
            error={errors.area}
            touched={touched.area}
            placeholder="0"
            required
          />
        </fieldset>

        {/* قسم الميزانية */}
        <fieldset
          disabled={!formModal.formData.usage}
          className="p-4 rounded-lg space-y-4 border-0 m-0 border mb-5"
          style={{
            backgroundColor: 'var(--bg-elevated)',
            borderColor: 'var(--border-default)',
          }}
        >
          <h3 
            className="text-lg font-semibold mb-3"
            style={{ color: 'var(--text-primary)' }}
          >
            الميزانية
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ValidatedInput
              label="الميزانية من"
              name="budgetFrom"
              type="text"
              inputMode="numeric"
              pattern="[0-9,]*"
              value={formModal.formData.budgetFrom}
              onChange={(e) => handleFieldChange(e, handleBudgetChange)}
              onPaste={handleBudgetPaste}
              onKeyDown={handleBudgetKeyDown}
              onBlur={() => handleBudgetFieldBlur("budgetFrom")}
              error={errors.budgetFrom}
              touched={touched.budgetFrom}
              placeholder="0"
              required
            />

            <ValidatedInput
              label="الميزانية إلى"
              name="budgetTo"
              type="text"
              inputMode="numeric"
              pattern="[0-9,]*"
              value={formModal.formData.budgetTo}
              onChange={(e) => handleFieldChange(e, handleBudgetChange)}
              onPaste={handleBudgetPaste}
              onKeyDown={handleBudgetKeyDown}
              onBlur={() => handleBudgetFieldBlur("budgetTo")}
              error={errors.budgetTo}
              touched={touched.budgetTo}
              placeholder="0"
              required
            />
          </div>
        </fieldset>

        {/* قسم الوصف ومعلومات التواصل */}
        <fieldset
          disabled={!formModal.formData.usage}
          className="p-4 rounded-lg space-y-4 border-0 m-0 border mb-5"
          style={{
            backgroundColor: 'var(--bg-elevated)',
            borderColor: 'var(--border-default)',
          }}
        >
          <h3 
            className="text-lg font-semibold mb-3"
            style={{ color: 'var(--text-primary)' }}
          >
            الوصف ومعلومات التواصل
          </h3>

          <ValidatedInput
            label="وصف الطلب"
            name="description"
            as="textarea"
            rows={3}
            value={formModal.formData.description}
            onChange={(e) => handleFieldChange(e)}
            onBlur={() => handleBlur("description", formModal.formData)}
            error={errors.description}
            touched={touched.description}
            required
          />

          <PhoneInput
            label="رقم التواصل"
            name="brokerContactPhone"
            value={formModal.formData.brokerContactPhone}
            onChange={(e) => handleFieldChange(e, handlePhoneChange)}
            onPaste={handlePhonePaste}
            onKeyDown={handlePhoneKeyDown}
            onBlur={() => handleBlur("brokerContactPhone", formModal.formData)}
            error={errors.brokerContactPhone}
            touched={touched.brokerContactPhone}
            required
          />
        </fieldset>

        <div className="mt-6 pt-4 border-t">
          <Motion.button
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
          </Motion.button>
        </div>
      </form>
    </Modal>
  );
};

export default RequestFormSection;
