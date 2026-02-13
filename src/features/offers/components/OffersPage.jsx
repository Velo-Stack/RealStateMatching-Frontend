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
  PROPERTY_TYPE_OPTIONS,
  PURPOSE_OPTIONS,
  USAGE_TYPE_OPTIONS,
} from "../../../constants/enums";
import { useOffersPage } from "../hooks/useOffersPage";
import OffersFilters from "./OffersFilters";
import OffersHeader from "./OffersHeader";
import OffersList from "./OffersList";
import OffersStats from "./OffersStats";

const OffersPage = () => {
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
  } = useOffersPage();

  return (
    <div className="space-y-6">
      <OffersHeader
        openCreate={formModal.openCreate}
        canExportPDF={canExportPDF}
        exportPDF={exportPDF}
      />

      <OffersStats offers={offers} />
      <OffersFilters />

      <OffersList
        offers={offers}
        isLoading={isLoading}
        user={user}
        openEdit={formModal.openEdit}
        confirmDelete={confirmDelete}
      />

      <Modal
        isOpen={formModal.isOpen}
        onClose={formModal.close}
        title={formModal.isEditing ? "تعديل العرض" : "إضافة عرض جديد"}
      >
        <form onSubmit={handleSubmit} className="space-y-5 text-right">
          <div className="grid grid-cols-2 gap-4">
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
                onChange={formModal.handleChange}
                required
              >
                {USAGE_TYPE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

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
            cityValue={formModal.formData.city}
            districtValue={formModal.formData.district}
            onCityChange={formModal.handleChange}
            onDistrictChange={formModal.handleChange}
            required
          />

          <div className="grid grid-cols-2 gap-4">
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClasses}>السعر من</label>
              <input
                name="priceFrom"
                type="number"
                className={inputClasses}
                value={formModal.formData.priceFrom}
                onChange={formModal.handleChange}
              />
            </div>
            <div>
              <label className={labelClasses}>السعر إلى</label>
              <input
                name="priceTo"
                type="number"
                className={inputClasses}
                value={formModal.formData.priceTo}
                onChange={formModal.handleChange}
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
            <label className={labelClasses}>الإحداثيات</label>
            <input
              name="coordinates"
              className={inputClasses}
              value={formModal.formData.coordinates}
              onChange={formModal.handleChange}
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            type="submit"
            disabled={isSubmitting}
            className={submitButtonClasses}
          >
            {isSubmitting ? "جاري الحفظ..." : formModal.isEditing ? "تحديث" : "حفظ"}
          </motion.button>
        </form>
      </Modal>
    </div>
  );
};

export default OffersPage;
