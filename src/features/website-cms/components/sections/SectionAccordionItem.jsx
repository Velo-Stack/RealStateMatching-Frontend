import { useState } from "react";
import { motion } from "framer-motion";
import { Layout, CheckCircle, Trash } from "phosphor-react";
import FormField from "../shared/FormField";
import ImageUploadField from "../ImageUploadField";
import { inputClasses, textAreaClasses } from "../../constants/websiteCmsConstants";

const SectionAccordionItem = ({ item, form, existing, onFormChange, onSave, onDelete, uploadMutation }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="rounded-xl border border-white/10 bg-slate-900/40 overflow-hidden">
      {/* Section Header */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-emerald-500/10 p-2">
            <Layout size={20} className="text-emerald-400" />
          </div>
          <div className="text-right">
            <h4 className="font-semibold text-white">{item.title}</h4>
            <p className="text-xs text-slate-500">{item.key}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {existing && <span className="text-xs text-emerald-400">● محفوظ</span>}
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <svg
              className="h-5 w-5 text-slate-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </motion.div>
        </div>
      </button>

      {/* Section Content */}
      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="border-t border-white/10 p-4 space-y-4"
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField label="العنوان">
              <input
                className={inputClasses}
                placeholder="أدخل العنوان"
                value={form.title}
                onChange={(e) => onFormChange(item.key, "title", e.target.value)}
              />
            </FormField>

            <FormField label="العنوان الفرعي">
              <input
                className={inputClasses}
                placeholder="أدخل العنوان الفرعي"
                value={form.subtitle}
                onChange={(e) => onFormChange(item.key, "subtitle", e.target.value)}
              />
            </FormField>
          </div>

          <FormField label="الوصف">
            <textarea
              className={textAreaClasses}
              placeholder="أدخل الوصف"
              value={form.description}
              onChange={(e) => onFormChange(item.key, "description", e.target.value)}
              rows={3}
            />
          </FormField>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField label="نص الزر الأساسي">
              <input
                className={inputClasses}
                placeholder="مثال: اعرف المزيد"
                value={form.primaryButtonText}
                onChange={(e) => onFormChange(item.key, "primaryButtonText", e.target.value)}
              />
            </FormField>

            <FormField label="رابط الزر الأساسي">
              <input
                className={inputClasses}
                placeholder="/about"
                value={form.primaryButtonUrl}
                onChange={(e) => onFormChange(item.key, "primaryButtonUrl", e.target.value)}
                dir="ltr"
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField label="نص الزر الثانوي">
              <input
                className={inputClasses}
                placeholder="مثال: تواصل معنا"
                value={form.secondaryButtonText}
                onChange={(e) => onFormChange(item.key, "secondaryButtonText", e.target.value)}
              />
            </FormField>

            <FormField label="رابط الزر الثانوي">
              <input
                className={inputClasses}
                placeholder="/contact"
                value={form.secondaryButtonUrl}
                onChange={(e) => onFormChange(item.key, "secondaryButtonUrl", e.target.value)}
                dir="ltr"
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField label="الترتيب">
              <input
                type="number"
                className={inputClasses}
                placeholder="0"
                value={form.sortOrder}
                onChange={(e) => onFormChange(item.key, "sortOrder", e.target.value)}
                dir="ltr"
              />
            </FormField>

            <FormField label="الحالة">
              <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300 cursor-pointer hover:bg-white/10 transition-colors">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => onFormChange(item.key, "isActive", e.target.checked)}
                  className="h-4 w-4"
                />
                <span>مفعّل</span>
              </label>
            </FormField>
          </div>

          <ImageUploadField
            label="صورة القسم"
            value={form.imageUrl}
            onChange={(value) => onFormChange(item.key, "imageUrl", value)}
            uploadMutation={uploadMutation}
          />

          <FormField label="محتوى JSON (اختياري)" hint="يمكنك إضافة بيانات إضافية بصيغة JSON">
            <textarea
              className={`${textAreaClasses} font-mono text-xs`}
              placeholder='{"key": "value"}'
              value={form.content}
              onChange={(e) => onFormChange(item.key, "content", e.target.value)}
              dir="ltr"
              rows={4}
            />
          </FormField>

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              className="theme-button-primary inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold shadow-lg shadow-emerald-500/20"
              onClick={() => onSave(item.key)}
            >
              <CheckCircle size={18} weight="bold" />
              {existing ? "حفظ التعديلات" : "إنشاء القسم"}
            </button>

            {existing && (
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-300 hover:bg-red-500/20 transition-colors"
                onClick={() => {
                  if (confirm(`هل أنت متأكد من حذف قسم ${item.title}؟`)) {
                    onDelete(existing.id);
                  }
                }}
              >
                <Trash size={16} />
                حذف القسم
              </button>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default SectionAccordionItem;
