import { useState, useEffect } from "react";
import { Plus, Trash, X, Buildings, PencilSimple, Eye, EyeSlash, Star } from "phosphor-react";
import { motion, AnimatePresence } from "framer-motion";
import FormGroup from "../shared/FormGroup";
import FormField from "../shared/FormField";
import { Image, UploadSimple } from "phosphor-react";
import MapLocationPicker from "../../../../components/maps/MapLocationPicker";
import { inputClasses } from "../../constants/websiteCmsConstants";
import { useProjectsQuery, useProjectDetailQuery } from "../../hooks/useProjectsQuery";
import { useProjectsMutations } from "../../hooks/useProjectsMutations";
import useMeta from "../../../../hooks/useMeta";
import { resolveUploadUrl } from "../../../../utils/uploads";

// ─── helpers ───────────────────────────────────────────────────────────────────

const buildSlug = (title) =>
  title
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\u0600-\u06FF-]/g, "")   // keep Arabic + latin + hyphen
    .replace(/-+/g, "-")
    .slice(0, 80);

const emptyForm = {
  title: "", slug: "", description: "",
  status: "ACTIVE", type: "RESIDENTIAL",
  cityId: "", city: "", address: "",
  latitude: "", longitude: "", googleMapsUrl: "",
  areaFrom: "", areaTo: "",
  priceFrom: "", priceTo: "",
  totalUnits: "", completionDate: "",
  ownerName: "", licenseNumber: "",
  features: [], services: [],
  isActive: true, isFeatured: false, sortOrder: 0,
};

// Per-field validation rules
const validate = (f) => {
  const errors = {};
  if (!f.title?.trim()) errors.title = "العنوان مطلوب";
  if (!f.slug?.trim()) errors.slug = "الرابط (Slug) مطلوب";
  if (!/^[a-z0-9\u0600-\u06FF-]+$/.test(f.slug || ""))
    errors.slug = "يجب أن يحتوي على أحرف وأرقام وشرطات فقط";
  if (f.priceFrom && f.priceTo && Number(f.priceFrom) > Number(f.priceTo))
    errors.priceTo = "السعر الأقصى يجب أن يكون أكبر من السعر الأدنى";
  if (f.areaFrom && f.areaTo && Number(f.areaFrom) > Number(f.areaTo))
    errors.areaTo = "المساحة القصوى يجب أن تكون أكبر من الأدنى";
  if (f.latitude && (Number(f.latitude) < -90 || Number(f.latitude) > 90))
    errors.latitude = "خط العرض يجب أن يكون بين -90 و 90";
  if (f.longitude && (Number(f.longitude) < -180 || Number(f.longitude) > 180))
    errors.longitude = "خط الطول يجب أن يكون بين -180 و 180";
  return errors;
};

// ─── sub-components ────────────────────────────────────────────────────────────

const FieldError = ({ msg }) =>
  msg ? (
    <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
      <span>⚠</span> {msg}
    </p>
  ) : null;

const TagInput = ({ label, items, onAdd, onRemove, placeholder }) => {
  const [val, setVal] = useState("");
  const add = () => { if (val.trim()) { onAdd(val.trim()); setVal(""); } };
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-slate-300">{label}</label>
      <div className="flex gap-2">
        <input
          className={inputClasses}
          value={val}
          placeholder={placeholder}
          onChange={(e) => setVal(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), add())}
        />
        <button type="button" onClick={add} className="bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 px-3 rounded-xl text-emerald-400 transition-colors">
          <Plus size={18} />
        </button>
      </div>
      {items.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-1">
          {items.map((item, i) => (
            <span key={i} className="flex items-center gap-1.5 bg-white/10 border border-white/10 text-slate-200 text-xs px-3 py-1.5 rounded-full">
              {item}
              <button type="button" onClick={() => onRemove(i)} className="text-red-400 hover:text-red-300 leading-none">
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

const SectionTitle = ({ children }) => (
  <div className="mt-6 mb-4 flex items-center gap-3">
    <div className="h-px flex-1 bg-gradient-to-r from-emerald-500/30 to-transparent" />
    <span className="text-sm font-semibold text-emerald-400 uppercase tracking-wide whitespace-nowrap">{children}</span>
    <div className="h-px flex-1 bg-gradient-to-l from-emerald-500/30 to-transparent" />
  </div>
);

// ─── status helpers ────────────────────────────────────────────────────────────

const STATUS_LABELS = {
  ACTIVE: "متاح",
  SOLD_OUT: "مباع بالكامل",
  COMING_SOON: "قريباً",
  COMPLETED: "مكتمل",
};

const STATUS_COLORS = {
  ACTIVE: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  SOLD_OUT: "bg-red-500/10 text-red-400 border-red-500/20",
  COMING_SOON: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  COMPLETED: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
};

// ─── main component ─────────────────────────────────────────────────────────────

const ProjectsSection = () => {
  const { data: projects = [], isLoading } = useProjectsQuery();
  const mutations = useProjectsMutations();
  const { cities = [], cityOptions = [] } = useMeta();

  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Revalidate whenever touched fields change
  useEffect(() => {
    setErrors(validate(form));
  }, [form]);

  const set = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));
  const touch = (key) => setTouched((prev) => ({ ...prev, [key]: true }));

  // Auto-slug when title changes (only if slug wasn't manually touched)
  const handleTitleChange = (val) => {
    set("title", val);
    if (!touched.slug) set("slug", buildSlug(val));
  };

  const handleCityChange = (cityId) => {
    const found = cities.find((c) => String(c.id) === String(cityId));
    set("cityId", cityId);
    set("city", found ? found.nameAr || found.name : "");
  };

  const handleMapChange = ({ latitude, longitude, mapAddress }) => {
    setForm((prev) => ({
      ...prev,
      latitude: latitude ?? prev.latitude,
      longitude: longitude ?? prev.longitude,
      googleMapsUrl:
        latitude != null && longitude != null
          ? `https://www.google.com/maps?q=${latitude},${longitude}`
          : prev.googleMapsUrl,
      address: mapAddress || prev.address,
    }));
  };

  const handleEdit = (project) => {
    const cityEntry = cities.find(
      (c) => c.name === project.city || c.nameAr === project.city
    );
    setEditingId(project.id);
    setForm({
      ...emptyForm,
      ...project,
      cityId: cityEntry ? String(cityEntry.id) : "",
      features: Array.isArray(project.features) ? project.features : [],
      services: Array.isArray(project.services) ? project.services : [],
      latitude: project.latitude ?? "",
      longitude: project.longitude ?? "",
      areaFrom: project.areaFrom ?? "",
      areaTo: project.areaTo ?? "",
      priceFrom: project.priceFrom ?? "",
      priceTo: project.priceTo ?? "",
      totalUnits: project.totalUnits ?? "",
      completionDate: project.completionDate
        ? new Date(project.completionDate).toISOString().split("T")[0]
        : "",
    });
    setTouched({});
    setErrors({});
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancel = () => {
    setEditingId(null);
    setForm(emptyForm);
    setTouched({});
    setErrors({});
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Touch all fields to show all errors
    const allTouched = Object.fromEntries(Object.keys(emptyForm).map((k) => [k, true]));
    setTouched(allTouched);
    const errs = validate(form);
    if (Object.keys(errs).length) return;

    setSubmitting(true);
    try {
      const payload = { ...form };
      ["latitude", "longitude", "areaFrom", "areaTo", "priceFrom", "priceTo", "totalUnits", "sortOrder"].forEach((key) => {
        payload[key] = payload[key] !== "" && payload[key] != null ? Number(payload[key]) : null;
      });
      payload.completionDate = payload.completionDate ? new Date(payload.completionDate).toISOString() : null;
      // These fields are managed by separate upload endpoints — exclude from general update
      delete payload.coverImageUrl;
      delete payload.galleryImages;
      // cityId is internal; city name is stored on the record
      delete payload.cityId;

      if (editingId) {
        await mutations.updateMutation.mutateAsync({ id: editingId, data: payload });
      } else {
        await mutations.createMutation.mutateAsync(payload);
      }
      handleCancel();
    } finally {
      setSubmitting(false);
    }
  };

  // ─ Fetch live detail for image section (always fresh, separate from list cache)
  const { data: projectDetail } = useProjectDetailQuery(editingId);

  // Use live detail for images; fall back to list data if detail is still loading
  const galleryProject = projectDetail ?? projects.find((p) => p.id === editingId) ?? null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4">
        <h2 className="flex items-center gap-2 text-xl font-bold text-white">
          <Buildings className="text-emerald-400" weight="duotone" />
          إدارة المشاريع
          {projects.length > 0 && (
            <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs text-emerald-400">{projects.length}</span>
          )}
        </h2>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition-all hover:bg-emerald-600"
          >
            <Plus size={18} weight="bold" />
            مشروع جديد
          </button>
        )}
      </div>

      {/* Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
          >
            <FormGroup title={editingId ? "✏️ تعديل المشروع" : "➕ إضافة مشروع جديد"}>
              <form onSubmit={handleSubmit} noValidate className="space-y-2">

                {/* ── الأساسيات ── */}
                <SectionTitle>البيانات الأساسية</SectionTitle>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <FormField label="عنوان المشروع" required>
                      <input
                        className={`${inputClasses} ${touched.title && errors.title ? "border-red-500/50" : ""}`}
                        value={form.title}
                        placeholder="مثال: مشروع بوابة الرياض السكني"
                        onChange={(e) => handleTitleChange(e.target.value)}
                        onBlur={() => touch("title")}
                      />
                      {touched.title && <FieldError msg={errors.title} />}
                    </FormField>
                  </div>
                  <div>
                    <FormField label="الرابط (Slug)" required>
                      <input
                        className={`${inputClasses} ${touched.slug && errors.slug ? "border-red-500/50" : ""}`}
                        value={form.slug}
                        dir="ltr"
                        placeholder="mithaal-riyadh-residential"
                        onChange={(e) => set("slug", e.target.value)}
                        onBlur={() => touch("slug")}
                      />
                      <p className="mt-1 text-xs text-slate-500">
                        يُولَّد تلقائياً من العنوان — يستخدم في رابط صفحة المشروع:{" "}
                        <span className="text-emerald-400/70 font-mono">/projects/{form.slug || "..."}</span>
                      </p>
                      {touched.slug && <FieldError msg={errors.slug} />}
                    </FormField>
                  </div>
                </div>

                <FormField label="الوصف">
                  <textarea
                    className={`${inputClasses} min-h-[90px] resize-y`}
                    value={form.description || ""}
                    placeholder="وصف مختصر يُعرض في صفحة المشروع وبطاقة المشروع..."
                    onChange={(e) => set("description", e.target.value)}
                  />
                </FormField>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <FormField label="نوع المشروع">
                    <select className={inputClasses} value={form.type} onChange={(e) => set("type", e.target.value)}>
                      <option value="RESIDENTIAL">سكني</option>
                      <option value="COMMERCIAL">تجاري</option>
                      <option value="MIXED_USE">متعدد الاستخدام</option>
                      <option value="INDUSTRIAL">صناعي</option>
                      <option value="LAND">أراضي</option>
                    </select>
                  </FormField>
                  <FormField label="حالة المشروع">
                    <select className={inputClasses} value={form.status} onChange={(e) => set("status", e.target.value)}>
                      <option value="ACTIVE">متاح — يُعرض للبيع الآن</option>
                      <option value="COMING_SOON">قريباً — التسجيل مفتوح</option>
                      <option value="COMPLETED">مكتمل — تم التسليم</option>
                      <option value="SOLD_OUT">مباع بالكامل</option>
                    </select>
                  </FormField>
                  <div>
                    <FormField label="رقم الترخيص">
                      <input
                        className={inputClasses}
                        value={form.licenseNumber || ""}
                        placeholder="مثال: 1234567890"
                        onChange={(e) => set("licenseNumber", e.target.value)}
                      />
                      <p className="mt-1 text-xs text-slate-500">رقم الترخيص الصادر من وزارة الإسكان / الجهات المعنية</p>
                    </FormField>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormField label="مالك / مطوّر المشروع">
                    <input
                      className={inputClasses}
                      value={form.ownerName || ""}
                      placeholder="مثال: شركة أملاك للتطوير"
                      onChange={(e) => set("ownerName", e.target.value)}
                    />
                  </FormField>
                  <FormField label="تاريخ الإنجاز المتوقع">
                    <input
                      type="date"
                      className={inputClasses}
                      value={form.completionDate || ""}
                      onChange={(e) => set("completionDate", e.target.value)}
                    />
                  </FormField>
                </div>

                {/* ── الأسعار والمساحات ── */}
                <SectionTitle>الأسعار والمساحات</SectionTitle>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  <div>
                    <FormField label="السعر من (ريال)">
                      <input type="number" className={inputClasses} value={form.priceFrom} placeholder="500,000" onChange={(e) => set("priceFrom", e.target.value)} onBlur={() => touch("priceFrom")} />
                    </FormField>
                  </div>
                  <div>
                    <FormField label="السعر حتى (ريال)">
                      <input type="number" className={`${inputClasses} ${touched.priceTo && errors.priceTo ? "border-red-500/50" : ""}`} value={form.priceTo} placeholder="2,000,000" onChange={(e) => set("priceTo", e.target.value)} onBlur={() => touch("priceTo")} />
                      {touched.priceTo && <FieldError msg={errors.priceTo} />}
                    </FormField>
                  </div>
                  <div>
                    <FormField label="المساحة من (م²)">
                      <input type="number" className={inputClasses} value={form.areaFrom} placeholder="80" onChange={(e) => set("areaFrom", e.target.value)} onBlur={() => touch("areaFrom")} />
                    </FormField>
                  </div>
                  <div>
                    <FormField label="المساحة حتى (م²)">
                      <input type="number" className={`${inputClasses} ${touched.areaTo && errors.areaTo ? "border-red-500/50" : ""}`} value={form.areaTo} placeholder="500" onChange={(e) => set("areaTo", e.target.value)} onBlur={() => touch("areaTo")} />
                      {touched.areaTo && <FieldError msg={errors.areaTo} />}
                    </FormField>
                  </div>
                </div>
                <FormField label="إجمالي الوحدات">
                  <input type="number" className="w-full max-w-[180px] rounded-xl border border-white/10 bg-[#111827]/60 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-emerald-500/40 focus:outline-none" value={form.totalUnits} placeholder="120" onChange={(e) => set("totalUnits", e.target.value)} />
                </FormField>

                {/* ── الموقع ── */}
                <SectionTitle>الموقع والعنوان</SectionTitle>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormField label="المدينة">
                    <select
                      className={inputClasses}
                      value={form.cityId}
                      onChange={(e) => handleCityChange(e.target.value)}
                    >
                      <option value="">— اختر المدينة —</option>
                      {cityOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </FormField>
                  <FormField label="العنوان التفصيلي">
                    <input
                      className={inputClasses}
                      value={form.address || ""}
                      placeholder="مثال: طريق الملك عبدالله، حي العقيق"
                      onChange={(e) => set("address", e.target.value)}
                    />
                  </FormField>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 space-y-4">
                  <p className="text-sm text-slate-400 flex items-center gap-2">
                    📍 <span>انقر على الخريطة أو ابحث عن موقع لتحديده تلقائياً</span>
                  </p>
                  <MapLocationPicker
                    latitude={form.latitude}
                    longitude={form.longitude}
                    mapAddress={form.address || ""}
                    onChange={handleMapChange}
                    height={300}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <FormField label="خط العرض (Latitude)">
                        <input
                          type="number"
                          step="any"
                          dir="ltr"
                          className={`${inputClasses} ${touched.latitude && errors.latitude ? "border-red-500/50" : ""}`}
                          value={form.latitude}
                          placeholder="24.7136"
                          onChange={(e) => set("latitude", e.target.value)}
                          onBlur={() => touch("latitude")}
                        />
                        {touched.latitude && <FieldError msg={errors.latitude} />}
                      </FormField>
                    </div>
                    <div>
                      <FormField label="خط الطول (Longitude)">
                        <input
                          type="number"
                          step="any"
                          dir="ltr"
                          className={`${inputClasses} ${touched.longitude && errors.longitude ? "border-red-500/50" : ""}`}
                          value={form.longitude}
                          placeholder="46.6753"
                          onChange={(e) => set("longitude", e.target.value)}
                          onBlur={() => touch("longitude")}
                        />
                        {touched.longitude && <FieldError msg={errors.longitude} />}
                      </FormField>
                    </div>
                  </div>
                </div>

                {/* ── المميزات والخدمات ── */}
                <SectionTitle>المميزات والخدمات</SectionTitle>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <TagInput
                    label="مميزات المشروع"
                    items={form.features}
                    placeholder="مثال: مسبح، صالة رياضية..."
                    onAdd={(v) => set("features", [...form.features, v])}
                    onRemove={(i) => set("features", form.features.filter((_, idx) => idx !== i))}
                  />
                  <TagInput
                    label="خدمات المشروع"
                    items={form.services}
                    placeholder="مثال: أمن 24 ساعة، صيانة..."
                    onAdd={(v) => set("services", [...form.services, v])}
                    onRemove={(i) => set("services", form.services.filter((_, idx) => idx !== i))}
                  />
                </div>

                {/* ── إعدادات الظهور ── */}
                <SectionTitle>إعدادات الظهور</SectionTitle>
                <div className="flex flex-wrap items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-4">
                  <label className="flex cursor-pointer items-center gap-3 rounded-xl p-2 transition-colors hover:bg-white/5">
                    <input
                      type="checkbox"
                      checked={form.isActive}
                      onChange={(e) => set("isActive", e.target.checked)}
                      className="h-5 w-5 rounded accent-emerald-500"
                    />
                    <span className="text-sm text-slate-200">مفعّل (يظهر للزوار)</span>
                  </label>
                  <label className="flex cursor-pointer items-center gap-3 rounded-xl p-2 transition-colors hover:bg-white/5">
                    <input
                      type="checkbox"
                      checked={form.isFeatured}
                      onChange={(e) => set("isFeatured", e.target.checked)}
                      className="h-5 w-5 rounded accent-amber-400"
                    />
                    <span className="text-sm font-medium text-amber-400 flex items-center gap-1"><Star size={16} weight="fill" /> مشروع مميز (Featured)</span>
                  </label>
                  <div className="mr-auto flex items-center gap-3">
                    <label className="text-sm text-slate-400">ترتيب الظهور:</label>
                    <input
                      type="number"
                      className="w-20 rounded-xl border border-white/10 bg-[#111827]/60 px-3 py-2 text-sm text-white text-center focus:border-emerald-500/40 focus:outline-none"
                      value={form.sortOrder}
                      onChange={(e) => set("sortOrder", e.target.value)}
                      dir="ltr"
                    />
                    <span className="text-xs text-slate-500">(الأقل = أول)</span>
                  </div>
                </div>

                {/* ── رفع الصور (تعديل فقط) ── */}
                {editingId && (
                  <>
                    <SectionTitle>صور المشروع</SectionTitle>
                    {/* Cover Image - self-contained uploader */}
                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-slate-300">الصورة الرئيسية (Cover)</label>
                      <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-950/40">
                        {galleryProject?.coverImageUrl ? (
                          <img src={resolveUploadUrl(galleryProject.coverImageUrl)} alt="cover" className="h-40 w-full object-cover" />
                        ) : (
                          <div className="flex h-40 items-center justify-center text-slate-500">
                            <Image size={28} />
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <label className="theme-button-white inline-flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold">
                          <UploadSimple size={18} weight="bold" />
                          {mutations.coverUploadMutation.isPending ? "جاري الرفع..." : "رفع صورة"}
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            disabled={mutations.coverUploadMutation.isPending}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                mutations.coverUploadMutation.mutate({ id: editingId, file });
                                e.target.value = null;
                              }
                            }}
                          />
                        </label>
                        {galleryProject?.coverImageUrl && (
                          <button
                            type="button"
                            onClick={() => mutations.coverDeleteMutation.mutate(editingId)}
                            className="flex items-center gap-1.5 rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-300 hover:bg-red-500/20 transition-colors"
                          >
                            <Trash size={16} /> حذف الصورة
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 space-y-4">
                      <h4 className="text-sm font-semibold text-white">معرض الصور (Gallery)</h4>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files.length) {
                            mutations.galleryUploadMutation.mutate({
                              id: editingId,
                              files: Array.from(e.target.files),
                            });
                            e.target.value = null;
                          }
                        }}
                        className="block w-full cursor-pointer text-sm text-slate-400 file:mr-4 file:cursor-pointer file:rounded-xl file:border-0 file:bg-emerald-500/10 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-emerald-400 hover:file:bg-emerald-500/20"
                      />
                      {galleryProject?.galleryImages?.length > 0 ? (
                        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                          {galleryProject.galleryImages.map((img, i) => (
                            <div key={i} className="group relative aspect-video overflow-hidden rounded-xl border border-white/10 bg-black/40">
                              <img src={resolveUploadUrl(img)} alt="" className="h-full w-full object-cover" />
                              <button
                                type="button"
                                onClick={() =>
                                  mutations.galleryDeleteMutation.mutate({
                                    id: editingId,
                                    // img is like /uploads/projects/{id}/filename.jpg — extract just filename
                                    filename: img.split("/").pop(),
                                  })
                                }
                                className="absolute right-2 top-2 rounded-lg bg-red-500/90 p-1.5 text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 hover:bg-red-500"
                              >
                                <Trash size={14} />
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-center text-sm text-slate-500 py-4">لا توجد صور في المعرض بعد</p>
                      )}
                    </div>
                  </>
                )}

                {!editingId && (
                  <p className="rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3 text-xs text-amber-300">
                    💡 بعد حفظ بيانات المشروع ستتمكن من رفع الصور والمعرض عبر زر التعديل.
                  </p>
                )}

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 border-t border-white/5 pt-6">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="rounded-xl border border-white/10 px-6 py-2.5 text-sm font-semibold text-slate-300 transition-colors hover:bg-white/5"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex items-center gap-2 rounded-xl bg-emerald-500 px-8 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition-colors hover:bg-emerald-600 disabled:opacity-60"
                  >
                    {submitting ? "جاري الحفظ..." : editingId ? "حفظ التعديلات" : "إنشاء المشروع"}
                  </button>
                </div>
              </form>
            </FormGroup>
          </motion.div>
        )}
      </AnimatePresence>

      {/* List */}
      {!showForm && (
        <div className="space-y-3">
          {isLoading ? (
            <div className="text-center py-10 text-slate-400">جاري التحميل...</div>
          ) : projects.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-white/10 py-16 text-slate-500">
              <Buildings size={56} weight="duotone" className="opacity-20" />
              <p>لا توجد مشاريع مضافة حتى الآن</p>
              <button onClick={() => setShowForm(true)} className="text-sm text-emerald-400 hover:underline">
                أضف أول مشروع
              </button>
            </div>
          ) : (
            projects.map((project) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-4 rounded-2xl border border-white/10 bg-slate-900/40 p-4 transition-colors hover:border-emerald-500/20"
              >
                {/* thumbnail */}
                {project.coverImageUrl ? (
                  <img
                    src={resolveUploadUrl(project.coverImageUrl)}
                    alt={project.title}
                    className="h-16 w-24 flex-shrink-0 rounded-xl object-cover"
                  />
                ) : (
                  <div className="flex h-16 w-24 flex-shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5">
                    <Buildings size={28} className="text-slate-600" weight="duotone" />
                  </div>
                )}

                {/* info */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-white">{project.title}</h3>
                    {project.isFeatured && (
                      <span className="flex items-center gap-1 rounded-full bg-amber-500/15 px-2 py-0.5 text-xs text-amber-400 border border-amber-500/20">
                        <Star size={12} weight="fill" /> مميز
                      </span>
                    )}
                    <span className={`rounded-full border px-2 py-0.5 text-xs ${STATUS_COLORS[project.status] || "bg-white/10 text-slate-400"}`}>
                      {STATUS_LABELS[project.status] || project.status}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-slate-400">
                    {project.city || "بدون مدينة"}
                    {project.priceFrom && ` — يبدأ من ${Number(project.priceFrom).toLocaleString("ar-SA")} ﷼`}
                  </p>
                </div>

                {/* actions */}
                <div className="flex flex-shrink-0 items-center gap-2">
                  <button
                    onClick={() => mutations.statusMutation.mutate({ id: project.id, data: { isActive: !project.isActive } })}
                    className={`rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
                      project.isActive
                        ? "border-slate-600 text-slate-400 hover:bg-white/5"
                        : "border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                    }`}
                    title={project.isActive ? "إيقاف العرض" : "تفعيل العرض"}
                  >
                    {project.isActive ? <EyeSlash size={16} /> : <Eye size={16} />}
                  </button>
                  <button
                    onClick={() => handleEdit(project)}
                    className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-slate-200 transition-colors hover:bg-white/10"
                  >
                    <PencilSimple size={16} /> تعديل
                  </button>
                  <button
                    onClick={() => {
                      if (confirm("هل أنت متأكد من حذف هذا المشروع؟ لا يمكن التراجع.")) {
                        mutations.deleteMutation.mutate(project.id);
                      }
                    }}
                    className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs font-medium text-red-300 transition-colors hover:bg-red-500/20"
                    title="حذف المشروع"
                  >
                    <Trash size={16} />
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default ProjectsSection;
