import { motion as Motion } from "framer-motion";
import { ArrowRight } from "phosphor-react";
import { CityDistrictSelect } from "../../../components/common";
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

const SubmissionRequestForm = ({
  form,
  onChange,
  onUsageChange,
  onPropertySubTypeChange,
  onAreaChange,
  onAreaPaste,
  onAreaKeyDown,
  onPhoneChange,
  onPhonePaste,
  onPhoneKeyDown,
  onSubmit,
  onBack,
  isSubmitting,
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <Motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      onSubmit={handleSubmit}
      className="w-full space-y-5 text-right"
    >
      <div className="flex items-center gap-3 mb-2">
        <button
          type="button"
          onClick={onBack}
          className="p-2 rounded-lg border border-white/10 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white transition-all"
        >
          <ArrowRight size={18} />
        </button>
        <h2 className="text-xl font-bold text-white">إضافة طلب عقاري</h2>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className={labelClasses}>الاستخدام</label>
          <select
            name="usage"
            className={inputClasses}
            value={form.usage}
            onChange={onUsageChange}
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

      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className={labelClasses}>نوع العقار</label>
          <select
            name="propertySubType"
            className={inputClasses}
            value={form.propertySubType}
            onChange={onPropertySubTypeChange}
            onInvalid={(e) =>
              e.target.setCustomValidity("الرجاء اختيار نوع العقار")
            }
            disabled={!form.usage}
            required={!!form.usage}
          >
            <option value="">
              {form.usage ? "اختر" : "اختر الاستخدام أولًا"}
            </option>
            {(PROPERTY_SUBTYPE_OPTIONS_BY_USAGE[form.usage] || []).map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <fieldset disabled={!form.usage} className="space-y-5 border-0 p-0 m-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClasses}>الغرض</label>
            <select
              name="purpose"
              className={inputClasses}
              value={form.purpose}
              onChange={onChange}
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
              value={form.priority}
              onChange={onChange}
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
            value={form.submittedBy}
            onChange={onChange}
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
          cityValue={form.cityId}
          districtValue={form.neighborhoodId}
          onCityChange={onChange}
          onDistrictChange={onChange}
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
            value={form.area ?? form.areaFrom ?? form.areaTo ?? ""}
            onChange={onAreaChange}
            onPaste={onAreaPaste}
            onKeyDown={onAreaKeyDown}
            onInvalid={(e) =>
              e.target.setCustomValidity("يجب إدخال أرقام فقط")
            }
            placeholder="0"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClasses}>الميزانية من</label>
            <input
              name="budgetFrom"
              type="number"
              className={inputClasses}
              value={form.budgetFrom}
              onChange={onChange}
            />
          </div>
          <div>
            <label className={labelClasses}>الميزانية إلى</label>
            <input
              name="budgetTo"
              type="number"
              className={inputClasses}
              value={form.budgetTo}
              onChange={onChange}
            />
          </div>
        </div>

        <div>
          <label className={labelClasses}>وصف الطلب</label>
          <textarea
            name="description"
            rows={3}
            className={inputClasses}
            value={form.description}
            onChange={onChange}
          />
        </div>

        <div>
          <label className={labelClasses}>رقم التواصل</label>
          <input
            name="brokerContactPhone"
            className={inputClasses}
            value={form.brokerContactPhone}
            onChange={onPhoneChange}
            onPaste={onPhonePaste}
            onKeyDown={onPhoneKeyDown}
            onInvalid={(e) =>
              e.target.setCustomValidity("يجب إدخال أرقام فقط")
            }
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={15}
            dir="ltr"
            required
          />
        </div>
      </fieldset>

      <div className="mt-6">
        <Motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          type="submit"
          disabled={isSubmitting}
          className={submitButtonClasses}
        >
          {isSubmitting ? "جاري الحفظ..." : "حفظ"}
        </Motion.button>
      </div>
    </Motion.form>
  );
};

export default SubmissionRequestForm;
