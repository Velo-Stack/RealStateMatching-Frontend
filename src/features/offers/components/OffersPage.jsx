import { motion } from "framer-motion";
import Modal from "../../../components/Modal";
import { CityDistrictSelect } from "../../../components/common";
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
  PROPERTY_SUBTYPE_OPTIONS_BY_USAGE,
  PURPOSE_OPTIONS,
  USAGE_CLASSIFICATION_OPTIONS,
} from "../../../constants/enums";
import { useOffersPage } from "../hooks/useOffersPage";
import { hasRole, ROLES } from "../../../utils/rbac";
import OffersFilters from "./OffersFilters";
import OffersHeader from "./OffersHeader";
import OffersList from "./OffersList";
import OffersStats from "./OffersStats";
import OfferDetailsModal from "./OfferDetailsModal";
import { useState } from "react";

const OFFER_SUBMITTED_BY_OPTIONS_WITHOUT_BUYER =
  OFFER_SUBMITTED_BY_OPTIONS.filter((opt) => opt.value !== "BUYER");

const OffersPage = () => {
  const [selectedOffer, setSelectedOffer] = useState(null);

  const {
    user,
    offers,
    isLoading,
    isSubmitting,
    exportPDF,
    formModal,
    handleSubmit,
    confirmDelete,
    canExportPDF,
    filters,
    handleChange,
    clearFilters,
    hasActiveFilters,
  } = useOffersPage();
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

  const handlePriceChange = (e) => {
    e.target.setCustomValidity("");
    const digitsOnly = e.target.value.replace(/\D/g, "").slice(0, 15);
    formModal.setValue("price", digitsOnly);
  };

  const handlePricePaste = (e) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData("text");
    const digitsOnly = pastedText.replace(/\D/g, "").slice(0, 15);
    formModal.setValue("price", digitsOnly);
  };

  const handlePriceKeyDown = (e) => {
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

  const handleAreaChange = (e) => {
    e.target.setCustomValidity("");
    const digitsOnly = e.target.value.replace(/\D/g, "");
    formModal.setValue("area", digitsOnly);
  };

  const handleAreaPaste = (e) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData("text");
    const digitsOnly = pastedText.replace(/\D/g, "");
    formModal.setValue("area", digitsOnly);
  };

  const handleAreaKeyDown = (e) => {
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
      <OffersHeader
        openCreate={canCreate ? formModal.openCreate : undefined}
        canExportPDF={canExportPDF}
        exportPDF={exportPDF}
      />

      <OffersStats offers={offers} />
      <OffersFilters
        filters={filters}
        handleChange={handleChange}
        clearFilters={clearFilters}
        hasActiveFilters={hasActiveFilters}
      />

      <OffersList
        offers={offers}
        isLoading={isLoading}
        user={user}
        openEdit={formModal.openEdit}
        confirmDelete={confirmDelete}
        onOffersClick={setSelectedOffer}
      />

      <OfferDetailsModal
        isOpen={!!selectedOffer}
        onClose={() => setSelectedOffer(null)}
        offer={selectedOffer}
      />

      <Modal
        isOpen={formModal.isOpen}
        onClose={formModal.close}
        title={formModal.isEditing ? "تعديل العرض" : "إضافة عرض جديد"}
      >
        <form onSubmit={handleSubmit} className="space-y-5 text-right">
          <div className="grid grid-cols-2 gap-4">
            <div className="hidden md:block" />
            <div className="md:col-span-2">
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

          <div className="grid grid-cols-2 gap-4">
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
            <div className="grid grid-cols-2 gap-4">
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
                <label className={labelClasses}>طبيعة التعاقد</label>
                <select
                  name="contractType"
                  className={inputClasses}
                  value={formModal.formData.contractType}
                  onChange={formModal.handleChange}
                >
                  <option value="">اختر</option>
                  {CONTRACT_TYPE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClasses}>الحصرية</label>
                <select
                  name="exclusivity"
                  className={inputClasses}
                  value={formModal.formData.exclusivity}
                  onChange={formModal.handleChange}
                  required
                >
                  <option value="">اختر</option>
                  {EXCLUSIVITY_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClasses}>مقدم العرض</label>
                <select
                  name="submittedBy"
                  className={inputClasses}
                  value={formModal.formData.submittedBy}
                  onChange={formModal.handleChange}
                >
                  <option value="">اختر</option>
                  {OFFER_SUBMITTED_BY_OPTIONS_WITHOUT_BUYER.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className={labelClasses}>عدد الوسطاء إلى المالك</label>
              <select
                name="brokersCount"
                className={inputClasses}
                value={formModal.formData.brokersCount}
                onChange={formModal.handleChange}
              >
                <option value="">اختر</option>
                {BROKERS_COUNT_OPTIONS.map((opt) => (
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

            <div>
              <label className={labelClasses}>المساحة</label>
              <input
                name="area"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                className={inputClasses}
                value={
                  formModal.formData.area ??
                  formModal.formData.areaFrom ??
                  formModal.formData.areaTo ??
                  ""
                }
                onChange={handleAreaChange}
                onPaste={handleAreaPaste}
                onKeyDown={handleAreaKeyDown}
                onInvalid={(e) =>
                  e.target.setCustomValidity("يجب إدخال أرقام فقط")
                }
                placeholder="0"
              />
            </div>

            <div>
              <label className={labelClasses}>الحدود</label>
              <textarea
                name="boundaries"
                rows={2}
                className={inputClasses}
                value={formModal.formData.boundaries}
                onChange={formModal.handleChange}
              />
            </div>

            <div>
              <label className={labelClasses}>الأطوال</label>
              <textarea
                name="lengths"
                rows={2}
                className={inputClasses}
                value={formModal.formData.lengths}
                onChange={formModal.handleChange}
              />
            </div>

            <div>
              <label className={labelClasses}>الواجهات</label>
              <textarea
                name="facades"
                rows={2}
                className={inputClasses}
                value={formModal.formData.facades}
                onChange={formModal.handleChange}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="hidden md:block" />
              <div className="md:col-span-2">
                <label className={labelClasses}>السعر</label>
                <input
                  name="price"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={15}
                  className={inputClasses}
                  value={formModal.formData.price}
                  onChange={handlePriceChange}
                  onPaste={handlePricePaste}
                  onKeyDown={handlePriceKeyDown}
                  onInvalid={(e) =>
                    e.target.setCustomValidity("الرجاء إدخال السعر")
                  }
                  required
                />
              </div>
            </div>

            <div>
              <label className={labelClasses}>الوصف</label>
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

            <div>
              <label className={labelClasses}>رابط الموقع (Google Maps)</label>
              <input
                name="coordinates"
                className={inputClasses}
                value={formModal.formData.coordinates}
                onChange={formModal.handleChange}
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

export default OffersPage;
