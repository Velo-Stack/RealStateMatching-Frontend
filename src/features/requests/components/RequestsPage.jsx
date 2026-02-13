import { motion } from "framer-motion";
import Modal from "../../../components/Modal";
import { CityDistrictSelect } from "../../../components/common";
import {
  inputClasses,
  labelClasses,
  submitButtonClasses,
} from "../../../constants/styles";
import {
  PRIORITY_OPTIONS,
  PROPERTY_TYPE_OPTIONS,
  PURPOSE_OPTIONS,
  USAGE_TYPE_OPTIONS,
} from "../../../constants/enums";
import { useRequestsPage } from "../hooks/useRequestsPage";
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
  } = useRequestsPage();

  return (
    <div className="space-y-6">
      <RequestsHeader openCreate={formModal.openCreate} />
      <RequestsStats requests={requests} />
      <RequestsFilters />

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

export default RequestsPage;
