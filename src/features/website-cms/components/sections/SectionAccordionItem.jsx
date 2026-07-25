import { useState } from "react";
import { motion } from "framer-motion";
import { Layout, CheckCircle, Trash } from "phosphor-react";
import FormField from "../shared/FormField";
import ImageUploadField from "../ImageUploadField";
import { inputClasses, textAreaClasses, SECTION_FIELD_CONFIG } from "../../constants/websiteCmsConstants";
import StatsBuilderUI from "./StatsBuilderUI";


const SectionAccordionItem = ({
  item,
  form,
  existing,
  onFormChange,
  onSave,
  onDelete,
  uploadMutation,
  isExpanded: isExpandedProp,
  onToggle,
}) => {
  const [localExpanded, setLocalExpanded] = useState(false);
  const isControlled = isExpandedProp !== undefined;
  const isExpanded = isControlled ? isExpandedProp : localExpanded;

  // Only show the fields this section actually uses on the live site — the rest
  // (buttons, sort order, etc.) are saved but never rendered anywhere, so we hide
  // them here to keep the CMS matching reality.
  const fields = SECTION_FIELD_CONFIG[item.key] || {};
  const isStatsSection = item.key === "home_stats";

  const handleToggle = () => {
    if (isControlled) {
      onToggle?.(!isExpanded);
    } else {
      setLocalExpanded(!isExpanded);
    }
  };

  return (
    <div className="rounded-lg border border-white/10 bg-slate-900/40 overflow-hidden">
      {/* Section Header */}
      <button
        type="button"
        onClick={handleToggle}
        className="w-full flex items-center justify-between p-3 hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <div className="rounded-md bg-emerald-500/10 p-1.5">
            <Layout size={16} className="text-emerald-400" />
          </div>
          <div className="text-right">
            <h4 className="text-sm font-semibold text-white">{item.title}</h4>
            <p className="text-[11px] text-slate-500">{item.key}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {existing && <span className="text-[11px] text-emerald-400">● محفوظ</span>}
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <svg
              className="h-4 w-4 text-slate-400"
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
          className="border-t border-white/10 p-3 space-y-3"
        >
          {(fields.title || fields.subtitle) && (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {fields.title && (
                <FormField label={fields.title.label || "العنوان"} hint={fields.title.hint}>
                  <input
                    className={inputClasses}
                    placeholder="أدخل العنوان"
                    value={form.title}
                    onChange={(e) => onFormChange(item.key, "title", e.target.value)}
                  />
                </FormField>
              )}

              {fields.subtitle && (
                <FormField label={fields.subtitle.label || "العنوان الفرعي"} hint={fields.subtitle.hint}>
                  <input
                    className={inputClasses}
                    placeholder="أدخل العنوان الفرعي"
                    value={form.subtitle}
                    onChange={(e) => onFormChange(item.key, "subtitle", e.target.value)}
                  />
                </FormField>
              )}
            </div>
          )}

          {fields.description && (
            <FormField label={fields.description.label || "الوصف"} hint={fields.description.hint}>
              <textarea
                className={textAreaClasses}
                placeholder="أدخل الوصف"
                value={form.description}
                onChange={(e) => onFormChange(item.key, "description", e.target.value)}
                rows={2}
              />
            </FormField>
          )}

          {fields.imageUrl && (
            <ImageUploadField
              label={fields.imageUrl.label || "صورة القسم"}
              value={form.imageUrl}
              onChange={(value) => onFormChange(item.key, "imageUrl", value)}
              uploadMutation={uploadMutation}
            />
          )}

          {isStatsSection && (
            <StatsBuilderUI
              value={form.content}
              onChange={(newContent) => onFormChange(item.key, "content", newContent)}
              onSave={() => onSave(item.key)}
            />
          )}

          {fields.content && (
            <FormField label={fields.content.label || "المحتوى (JSON)"} hint={fields.content.hint}>
              <textarea
                className={`${textAreaClasses} font-mono text-xs`}
                placeholder='{"key": "value"}'
                value={form.content}
                onChange={(e) => onFormChange(item.key, "content", e.target.value)}
                dir="ltr"
                rows={3}
              />
            </FormField>
          )}

          <FormField label="الحالة" hint="لو غير مفعّل، القسم يرجع للنص الافتراضي بدل بياناتك">
            <label className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-300 cursor-pointer hover:bg-white/10 transition-colors">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => onFormChange(item.key, "isActive", e.target.checked)}
                className="h-4 w-4"
              />
              <span>مفعّل</span>
            </label>
          </FormField>

          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              className="theme-button-primary inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold shadow-lg shadow-emerald-500/20"
              onClick={() => onSave(item.key)}
            >
              <CheckCircle size={16} weight="bold" />
              {existing ? "حفظ التعديلات" : "إنشاء القسم"}
            </button>

            {existing && (
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm font-semibold text-red-300 hover:bg-red-500/20 transition-colors"
                onClick={() => {
                  if (confirm(`هل أنت متأكد من حذف قسم ${item.title}؟`)) {
                    onDelete(existing.id);
                  }
                }}
              >
                <Trash size={14} />
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
