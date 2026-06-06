import { motion as Motion } from "framer-motion";
import { toast } from "sonner";
import Modal from "../../../components/Modal";
import { CityDistrictSelect } from "../../../components/common";
import ValidatedInput from "../../../components/common/ValidatedInput";
import ValidatedSelect from "../../../components/common/ValidatedSelect";
import PhoneInput from "../../../components/common/PhoneInput";
import FormattedNumberInput from "../../../components/common/FormattedNumberInput";
import {
  inputClasses,
  labelClasses,
  submitButtonClasses,
} from "../../../constants/styles";
import {
  BROKERS_COUNT_OPTIONS,
  CONTRACT_TYPE_OPTIONS,
  EXCLUSIVITY_OPTIONS,
  OFFER_SUBMITTED_BY_OPTIONS,
  OFFER_PURPOSE_OPTIONS,
  PROPERTY_SUBTYPE_OPTIONS_BY_USAGE,
  USAGE_CLASSIFICATION_OPTIONS,
} from "../../../constants/enums";
import { shouldShowOfferLengths } from "../utils/offersUtils";
import { useOfferFormValidation } from "../hooks/useOfferFormValidation";
import MapLocationPicker from "../../../components/maps/MapLocationPicker";
import { useFeatureFlags } from "../../../hooks/useFeatureFlags";

const OfferFormSection = ({
  formModal,
  handleSubmit,
  isSubmitting,
  handleUsageChange,
  handlePropertySubTypeChange,
  handleAreaChange,
  handleAreaPaste,
  handleAreaKeyDown,
  handlePriceChange,
  handlePricePaste,
  handlePriceKeyDown,
  handlePhoneChange,
  handlePhonePaste,
  handlePhoneKeyDown,
}) => {
  const { isFeatureEnabled } = useFeatureFlags();
  const mapsEnabled = isFeatureEnabled("maps.enabled");

  const { errors, touched, validateForm, touchAllFields, handleBlur, handleLiveChange } =
    useOfferFormValidation();

  const localHandleSubmit = (e) => {
    e.preventDefault();
    touchAllFields(formModal.formData);
    const isValid = validateForm(formModal.formData);
    if (!isValid) {
      toast.error("الرجاء تصحيح الأخطاء في النموذج");
      return;
    }
    handleSubmit(e);
  };

  const handleFieldChange = (e, customHandler) => {
    if (customHandler) {
      customHandler(e);
    } else {
      formModal.handleChange(e);
    }

    const fieldName = e.target.name;
    const nextFormData = {
      ...formModal.formData,
      [fieldName]: e.target.value,
    };
    handleLiveChange(fieldName, nextFormData);
  };

  return (
    <Modal
      isOpen={formModal.isOpen}
      onClose={formModal.close}
      title={formModal.isEditing ? "تعديل العرض" : "إضافة عرض جديد"}
    >
      <form onSubmit={localHandleSubmit} className="space-y-6 text-right">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
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
            </div>

            <div className="md:col-span-2">
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
                  PROPERTY_SUBTYPE_OPTIONS_BY_USAGE[formModal.formData.usage] ||
                  []
                ).map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </ValidatedSelect>
            </div>
          </div>
        </div>

        {/* قسم تفاصيل العرض */}
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
            تفاصيل العرض
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
              {OFFER_PURPOSE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </ValidatedSelect>

            <ValidatedSelect
              label="طبيعة التعاقد"
              name="contractType"
              value={formModal.formData.contractType}
              onChange={(e) => handleFieldChange(e)}
              onBlur={() => handleBlur("contractType", formModal.formData)}
              error={errors.contractType}
              touched={touched.contractType}
              required
            >
              <option value="">اختر</option>
              {CONTRACT_TYPE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </ValidatedSelect>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ValidatedSelect
              label="الحصرية"
              name="exclusivity"
              value={formModal.formData.exclusivity}
              onChange={(e) => handleFieldChange(e)}
              onBlur={() => handleBlur("exclusivity", formModal.formData)}
              error={errors.exclusivity}
              touched={touched.exclusivity}
              required
            >
              <option value="">اختر</option>
              {EXCLUSIVITY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </ValidatedSelect>

            <ValidatedSelect
              label="مقدم العرض"
              name="submittedBy"
              value={formModal.formData.submittedBy}
              onChange={(e) => handleFieldChange(e)}
              onBlur={() => handleBlur("submittedBy", formModal.formData)}
              error={errors.submittedBy}
              touched={touched.submittedBy}
              required
            >
              <option value="">اختر</option>
              {OFFER_SUBMITTED_BY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </ValidatedSelect>
          </div>

          <ValidatedSelect
            label="عدد الوسطاء إلى المالك"
            name="brokersCount"
            value={formModal.formData.brokersCount}
            onChange={(e) => handleFieldChange(e)}
            onBlur={() => handleBlur("brokersCount", formModal.formData)}
            error={errors.brokersCount}
            touched={touched.brokersCount}
            required
          >
            <option value="">اختر</option>
            {BROKERS_COUNT_OPTIONS.map((opt) => (
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
            onCityChange={formModal.handleChange}
            onDistrictChange={formModal.handleChange}
            cityName="cityId"
            districtName="neighborhoodId"
            useCityId
            required
          />

          <FormattedNumberInput
            label="المساحة"
            name="area"
            value={
              formModal.formData.area ??
              formModal.formData.areaFrom ??
              formModal.formData.areaTo ??
              ""
            }
            onChange={(e) => handleFieldChange(e)}
            onBlur={() => handleBlur("area", formModal.formData)}
            error={errors.area}
            touched={touched.area}
            placeholder="0"
            required
          />

          {shouldShowOfferLengths(formModal.formData.propertySubType) && (
            <ValidatedInput
              label="الأطوال"
              name="lengths"
              as="textarea"
              rows={2}
              value={formModal.formData.lengths}
              onChange={(e) => handleFieldChange(e)}
              onBlur={() => handleBlur("lengths", formModal.formData)}
              error={errors.lengths}
              touched={touched.lengths}
              required
            />
          )}

          <ValidatedInput
            label="الواجهات"
            name="facades"
            as="textarea"
            rows={2}
            value={formModal.formData.facades}
            onChange={(e) => handleFieldChange(e)}
            onBlur={() => handleBlur("facades", formModal.formData)}
            error={errors.facades}
            touched={touched.facades}
            required
          />
        </fieldset>

        {/* قسم السعر والوصف */}
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
            السعر والوصف
          </h3>

          <FormattedNumberInput
            label="السعر"
            name="price"
            maxLength={15}
            value={formModal.formData.price}
            onChange={(e) => handleFieldChange(e)}
            onBlur={() => handleBlur("price", formModal.formData)}
            error={errors.price}
            touched={touched.price}
            required
          />

          <ValidatedInput
            label="الوصف"
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
        </fieldset>

        {/* قسم معلومات التواصل */}
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
            معلومات التواصل
          </h3>

          <PhoneInput
            label="رقم التواصل"
            name="brokerContactPhone"
            value={formModal.formData.brokerContactPhone}
            onChange={(e) => handleFieldChange(e)}
            onBlur={() => handleBlur("brokerContactPhone", formModal.formData)}
            error={errors.brokerContactPhone}
            touched={touched.brokerContactPhone}
            required
          />

          <ValidatedInput
            label="رابط الموقع (Google Maps)"
            name="coordinates"
            dir="ltr"
            value={formModal.formData.coordinates}
            onChange={(e) => handleFieldChange(e)}
          />

          {mapsEnabled && (
            <div className="space-y-2">
              <p className={labelClasses}>تحديد الموقع على الخريطة</p>
              <MapLocationPicker
                latitude={formModal.formData.latitude}
                longitude={formModal.formData.longitude}
                mapAddress={formModal.formData.mapAddress}
                onChange={({ latitude, longitude, mapAddress }) => {
                  formModal.setFormData((prev) => ({
                    ...prev,
                    latitude,
                    longitude,
                    mapAddress,
                    coordinates:
                      latitude != null && longitude != null
                        ? `https://www.google.com/maps?q=${latitude},${longitude}`
                        : prev.coordinates,
                  }));
                }}
              />
            </div>
          )}
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

export default OfferFormSection;
