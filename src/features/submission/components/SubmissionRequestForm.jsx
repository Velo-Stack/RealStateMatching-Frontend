import { motion } from "framer-motion";
import { ArrowRight, PaperPlaneTilt, SpinnerGap } from "phosphor-react";
import {
    PROPERTY_TYPE_OPTIONS,
    USAGE_CLASSIFICATION_OPTIONS,
    PROPERTY_SUBTYPE_OPTIONS_BY_USAGE,
    LAND_STATUS_OPTIONS,
    PURPOSE_OPTIONS,
    REQUEST_SUBMITTED_BY_OPTIONS,
    PRIORITY_OPTIONS,
} from "../../../constants/enums";

const inputClasses = `
  w-full rounded-xl border border-white/10 bg-white/5
  px-4 py-3 text-sm text-white placeholder-slate-500
  outline-none transition-all duration-300
  focus:border-violet-500/50 focus:bg-white/10
  focus:shadow-[0_0_20px_rgba(139,92,246,0.15)]
`.replace(/\s+/g, " ").trim();

const labelClasses = "block mb-2 text-sm font-medium text-slate-300";

const SubmissionRequestForm = ({ form, onChange, onSubmit, onBack, isSubmitting }) => {
    const subtypeOptions = PROPERTY_SUBTYPE_OPTIONS_BY_USAGE[form.usage] || [];

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit();
    };

    return (
        <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            onSubmit={handleSubmit}
            className="space-y-6"
        >
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <button
                    type="button"
                    onClick={onBack}
                    className="p-2 rounded-lg border border-white/10 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white transition-all"
                >
                    <ArrowRight size={18} />
                </button>
                <h2 className="text-xl font-bold text-white">إضافة طلب عقاري</h2>
            </div>

            {/* نوع العقار + الاستخدام */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className={labelClasses}>نوع العقار *</label>
                    <select name="type" className={inputClasses} value={form.type} onChange={onChange} required>
                        {PROPERTY_TYPE_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className={labelClasses}>الاستخدام *</label>
                    <select name="usage" className={inputClasses} value={form.usage} onChange={onChange} required>
                        <option value="">اختر الاستخدام</option>
                        {USAGE_CLASSIFICATION_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* النوع التفصيلي + حالة الأرض */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {subtypeOptions.length > 0 && (
                    <div>
                        <label className={labelClasses}>النوع التفصيلي</label>
                        <select name="propertySubType" className={inputClasses} value={form.propertySubType} onChange={onChange}>
                            <option value="">اختر النوع</option>
                            {subtypeOptions.map((opt) => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </div>
                )}
                <div>
                    <label className={labelClasses}>حالة الأرض</label>
                    <select name="landStatus" className={inputClasses} value={form.landStatus || ""} onChange={onChange}>
                        <option value="">اختر الحالة</option>
                        {LAND_STATUS_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* المدينة + الحي */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className={labelClasses}>المدينة</label>
                    <input name="city" className={inputClasses} value={form.city} onChange={onChange} placeholder="أدخل المدينة" />
                </div>
                <div>
                    <label className={labelClasses}>الحي</label>
                    <input name="district" className={inputClasses} value={form.district} onChange={onChange} placeholder="أدخل الحي" />
                </div>
            </div>

            {/* المساحة */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className={labelClasses}>المساحة من (م²) *</label>
                    <input name="areaFrom" type="number" className={inputClasses} value={form.areaFrom} onChange={onChange} placeholder="0" required />
                </div>
                <div>
                    <label className={labelClasses}>المساحة إلى (م²) *</label>
                    <input name="areaTo" type="number" className={inputClasses} value={form.areaTo} onChange={onChange} placeholder="0" required />
                </div>
            </div>

            {/* الميزانية */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className={labelClasses}>الميزانية من (ريال) *</label>
                    <input name="budgetFrom" type="number" className={inputClasses} value={form.budgetFrom} onChange={onChange} placeholder="0" required />
                </div>
                <div>
                    <label className={labelClasses}>الميزانية إلى (ريال) *</label>
                    <input name="budgetTo" type="number" className={inputClasses} value={form.budgetTo} onChange={onChange} placeholder="0" required />
                </div>
            </div>

            {/* الأولوية + الغرض */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className={labelClasses}>الأولوية *</label>
                    <select name="priority" className={inputClasses} value={form.priority} onChange={onChange} required>
                        {PRIORITY_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className={labelClasses}>الغرض</label>
                    <select name="purpose" className={inputClasses} value={form.purpose} onChange={onChange}>
                        <option value="">اختر الغرض</option>
                        {PURPOSE_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* مقدم الطلب + هاتف التواصل */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className={labelClasses}>مقدم الطلب</label>
                    <select name="submittedBy" className={inputClasses} value={form.submittedBy} onChange={onChange}>
                        <option value="">اختر</option>
                        {REQUEST_SUBMITTED_BY_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className={labelClasses}>هاتف التواصل</label>
                    <input name="brokerContactPhone" className={inputClasses} value={form.brokerContactPhone} onChange={onChange} placeholder="05xxxxxxxx" dir="ltr" />
                </div>
            </div>

            {/* الوصف */}
            <div>
                <label className={labelClasses}>الوصف</label>
                <textarea
                    name="description"
                    className={`${inputClasses} min-h-[100px] resize-none`}
                    value={form.description}
                    onChange={onChange}
                    placeholder="أدخل وصف الطلب..."
                    rows={3}
                />
            </div>

            {/* زر الإرسال */}
            <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className="w-full rounded-xl bg-gradient-to-l from-violet-500 to-purple-500 text-white text-sm font-bold py-4 shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
                {isSubmitting ? (
                    <>
                        <SpinnerGap size={20} className="animate-spin" />
                        جاري الإرسال...
                    </>
                ) : (
                    <>
                        <PaperPlaneTilt size={20} weight="fill" />
                        إرسال الطلب
                    </>
                )}
            </motion.button>
        </motion.form>
    );
};

export default SubmissionRequestForm;
