import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import {
  Plus, Trash, X, Buildings, PencilSimple, Eye, EyeSlash, Star, Package, EnvelopeSimple,
  Tag, MapPin, Sparkle, CaretDown, CaretUp,
} from "phosphor-react";
import { motion } from "framer-motion";
import FormGroup from "../components/shared/FormGroup";
import FormField from "../components/shared/FormField";
import StickyActionBar from "../components/shared/StickyActionBar";
import ProjectLivePreview from "../components/ProjectLivePreview";
import { Image, UploadSimple } from "phosphor-react";
import MapLocationPicker from "../../../components/maps/MapLocationPicker";
import { inputClasses } from "../constants/websiteCmsConstants";
import { useProjectDetailQuery } from "../hooks/useProjectsQuery";
import { useProjectsMutations } from "../hooks/useProjectsMutations";
import useMeta from "../../../hooks/useMeta";
import { resolveUploadUrl } from "../../../utils/uploads";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchProjectUnitsApi, createProjectUnitApi, updateProjectUnitApi, deleteProjectUnitApi, fetchProjectInterestsApi, markInterestReadApi } from "../services/projectsCmsApi";
import { toast } from "sonner";

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
    <div className="space-y-1.5">
      <label className="block text-xs font-medium text-slate-300">{label}</label>
      <div className="flex gap-2">
        <input
          className={inputClasses}
          value={val}
          placeholder={placeholder}
          onChange={(e) => setVal(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), add())}
        />
        <button type="button" onClick={add} className="bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 px-3 rounded-lg text-emerald-400 transition-colors">
          <Plus size={16} />
        </button>
      </div>
      {items.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {items.map((item, i) => (
            <span key={i} className="flex items-center gap-1.5 bg-white/10 border border-white/10 text-slate-200 text-xs px-2.5 py-1 rounded-full">
              {item}
              <button type="button" onClick={() => onRemove(i)} className="text-red-400 hover:text-red-300 leading-none">
                <X size={11} />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── compact accordion wrapper (mirrors the Home CMS section style) ────────────

const ACCORDION_COLORS = {
  emerald: { border: "border-emerald-500/20", bg: "bg-emerald-500/5", iconBg: "bg-emerald-500/20", iconText: "text-emerald-400" },
  amber: { border: "border-amber-500/20", bg: "bg-amber-500/5", iconBg: "bg-amber-500/20", iconText: "text-amber-400" },
  cyan: { border: "border-cyan-500/20", bg: "bg-cyan-500/5", iconBg: "bg-cyan-500/20", iconText: "text-cyan-400" },
  purple: { border: "border-purple-500/20", bg: "bg-purple-500/5", iconBg: "bg-purple-500/20", iconText: "text-purple-400" },
  pink: { border: "border-pink-500/20", bg: "bg-pink-500/5", iconBg: "bg-pink-500/20", iconText: "text-pink-400" },
  rose: { border: "border-rose-500/20", bg: "bg-rose-500/5", iconBg: "bg-rose-500/20", iconText: "text-rose-400" },
  blue: { border: "border-blue-500/20", bg: "bg-blue-500/5", iconBg: "bg-blue-500/20", iconText: "text-blue-400" },
  orange: { border: "border-orange-500/20", bg: "bg-orange-500/5", iconBg: "bg-orange-500/20", iconText: "text-orange-400" },
};

const EditorAccordion = ({ title, icon: Icon, color, isOpen, onToggle, badge, children }) => {
  const c = ACCORDION_COLORS[color] || ACCORDION_COLORS.emerald;
  return (
    <div className={`rounded-xl border ${c.border} ${c.bg} overflow-hidden shadow-xl`}>
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between p-3 hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <div className={`${c.iconBg} p-1.5 rounded-lg ${c.iconText}`}>
            {Icon && <Icon size={16} weight="duotone" />}
          </div>
          <h3 className="text-sm font-bold text-white">{title}</h3>
          {badge}
        </div>
        {isOpen ? <CaretUp size={16} className="text-slate-400" /> : <CaretDown size={16} className="text-slate-400" />}
      </button>

      {isOpen && (
        <div className={`p-3 border-t ${c.border} bg-slate-900/50 backdrop-blur-md space-y-3`}>
          {children}
        </div>
      )}
    </div>
  );
};

// ─── units manager ──────────────────────────────────────────────────────────────

const UNIT_STATUS_OPTS = [
  { value: "AVAILABLE", label: "متاح" },
  { value: "RESERVED", label: "محجوز" },
  { value: "SOLD",     label: "مباع"  },
];

const emptyUnit = { code: "", price: "", status: "AVAILABLE", floor: "", area: "", bedrooms: "" };

const ProjectUnitsManager = ({ projectId, units, isLoading }) => {
  const qc = useQueryClient();

  const [unitForm, setUnitForm] = useState(emptyUnit);
  const [editingUnitId, setEditingUnitId] = useState(null);
  const [showUnitForm, setShowUnitForm] = useState(false);

  const invalidate = () => qc.invalidateQueries({ queryKey: ["project-units-admin", projectId] });

  const createMut = useMutation({
    mutationFn: (data) => createProjectUnitApi(projectId, data),
    onSuccess: () => { toast.success("تمت إضافة الوحدة"); setUnitForm(emptyUnit); setShowUnitForm(false); invalidate(); },
    onError: () => toast.error("فشل إضافة الوحدة"),
  });
  const updateMut = useMutation({
    mutationFn: ({ unitId, data }) => updateProjectUnitApi(projectId, unitId, data),
    onSuccess: () => { toast.success("تم تعديل الوحدة"); setEditingUnitId(null); setUnitForm(emptyUnit); setShowUnitForm(false); invalidate(); },
    onError: () => toast.error("فشل تعديل الوحدة"),
  });
  const deleteMut = useMutation({
    mutationFn: (unitId) => deleteProjectUnitApi(projectId, unitId),
    onSuccess: () => { toast.success("تم حذف الوحدة"); invalidate(); },
    onError: () => toast.error("فشل حذف الوحدة"),
  });

  const handleSaveUnit = () => {
    if (!unitForm.code || !unitForm.price || !unitForm.floor || !unitForm.area) {
      toast.error("يرجى ملء جميع الحقول الأساسية");
      return;
    }
    const payload = { ...unitForm, price: parseFloat(unitForm.price), area: parseFloat(unitForm.area), bedrooms: parseInt(unitForm.bedrooms) || 0 };
    if (editingUnitId) {
      updateMut.mutate({ unitId: editingUnitId, data: payload });
    } else {
      createMut.mutate(payload);
    }
  };

  const STATUS_BADGE = { AVAILABLE: "bg-emerald-500/20 text-emerald-400", RESERVED: "bg-amber-500/20 text-amber-400", SOLD: "bg-red-500/20 text-red-400" };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-white font-semibold text-sm">
          <Package size={16} className="text-blue-400" />
          <span>وحدات المشروع</span>
          {units.length > 0 && <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full">{units.length}</span>}
        </div>
        {!showUnitForm && (
          <button type="button" onClick={() => { setShowUnitForm(true); setEditingUnitId(null); setUnitForm(emptyUnit); }}
            className="flex items-center gap-1.5 text-xs bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 text-blue-400 px-3 py-1.5 rounded-lg transition-colors">
            <Plus size={14} /> إضافة وحدة
          </button>
        )}
      </div>

      {showUnitForm && (
        <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-3 space-y-3">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-slate-400 block mb-1">الكود*</label>
              <input className={inputClasses} placeholder="C1" value={unitForm.code} onChange={e => setUnitForm(p => ({ ...p, code: e.target.value }))} />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">السعر (ر.س)*</label>
              <input type="number" className={inputClasses} placeholder="780000" value={unitForm.price} onChange={e => setUnitForm(p => ({ ...p, price: e.target.value }))} />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">الحالة</label>
              <select className={inputClasses} value={unitForm.status} onChange={e => setUnitForm(p => ({ ...p, status: e.target.value }))}>
                {UNIT_STATUS_OPTS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">الدور*</label>
              <input className={inputClasses} placeholder="الأرضي" value={unitForm.floor} onChange={e => setUnitForm(p => ({ ...p, floor: e.target.value }))} />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">المساحة (م²)*</label>
              <input type="number" className={inputClasses} placeholder="130" value={unitForm.area} onChange={e => setUnitForm(p => ({ ...p, area: e.target.value }))} />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">غرف النوم</label>
              <input type="number" className={inputClasses} placeholder="3" value={unitForm.bedrooms} onChange={e => setUnitForm(p => ({ ...p, bedrooms: e.target.value }))} />
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <button type="button" onClick={() => { setShowUnitForm(false); setEditingUnitId(null); }}
              className="text-xs border border-white/10 text-slate-400 px-4 py-2 rounded-lg hover:bg-white/5">إلغاء</button>
            <button type="button" onClick={handleSaveUnit} disabled={createMut.isPending || updateMut.isPending}
              className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg transition-colors disabled:opacity-60">
              {editingUnitId ? "حفظ التعديل" : "إضافة الوحدة"}
            </button>
          </div>
        </div>
      )}

      {isLoading ? (
        <p className="text-xs text-slate-500 text-center py-3">جاري تحميل الوحدات...</p>
      ) : units.length === 0 ? (
        <p className="text-xs text-slate-500 text-center py-3">لا توجد وحدات مضافة بعد</p>
      ) : (
        <div className="space-y-2">
          {units.map(u => (
            <div key={u.id} className="flex items-center justify-between gap-3 rounded-xl border border-white/5 bg-white/5 px-4 py-3">
              <div className="flex items-center gap-3 min-w-0">
                <span className="font-bold text-white text-sm">{u.code}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_BADGE[u.status] || "bg-white/10 text-slate-400"}`}>
                  {UNIT_STATUS_OPTS.find(o => o.value === u.status)?.label}
                </span>
                <span className="text-xs text-slate-400 hidden sm:block">{u.floor} • {u.area}م² • {u.bedrooms} غرف</span>
                <span className="text-xs text-[#9d7857] font-semibold hidden md:block">{Number(u.price).toLocaleString("ar-SA")} ر.س</span>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <button type="button" onClick={() => { setEditingUnitId(u.id); setUnitForm({ code: u.code, price: u.price, status: u.status, floor: u.floor, area: u.area, bedrooms: u.bedrooms }); setShowUnitForm(true); }}
                  className="text-xs border border-white/10 bg-white/5 hover:bg-white/10 text-slate-300 px-2 py-1.5 rounded-lg">
                  <PencilSimple size={14} />
                </button>
                <button type="button" onClick={() => { if (confirm("حذف هذه الوحدة؟")) deleteMut.mutate(u.id); }}
                  className="text-xs border border-red-500/20 bg-red-500/10 hover:bg-red-500/20 text-red-300 px-2 py-1.5 rounded-lg">
                  <Trash size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── interests panel ────────────────────────────────────────────────────────────

const ProjectInterestsPanel = ({ projectId }) => {
  const qc = useQueryClient();
  const { data: interests = [], isLoading } = useQuery({
    queryKey: ["project-interests-admin", projectId],
    queryFn: () => fetchProjectInterestsApi(projectId),
    enabled: !!projectId,
  });

  const markReadMut = useMutation({
    mutationFn: (interestId) => markInterestReadApi(projectId, interestId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["project-interests-admin", projectId] }),
  });

  const unread = interests.filter(i => !i.isRead).length;

  return (
    <div id="interests-panel" className="space-y-3">
      <div className="flex items-center gap-2 text-white font-semibold text-sm">
        <EnvelopeSimple size={16} className="text-orange-400" />
        <span>طلبات الاهتمام</span>
        {unread > 0 && <span className="text-xs bg-orange-500/20 text-orange-400 border border-orange-500/20 px-2 py-0.5 rounded-full">{unread} جديد</span>}
      </div>

      {isLoading ? (
        <p className="text-xs text-slate-500 text-center py-3">جاري التحميل...</p>
      ) : interests.length === 0 ? (
        <p className="text-xs text-slate-500 text-center py-3">لا توجد طلبات اهتمام بعد</p>
      ) : (
        <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
          {interests.map(i => (
            <div key={i.id} className={`flex items-start justify-between gap-3 rounded-xl border px-4 py-3 transition-colors
              ${i.isRead ? "border-white/5 bg-white/3" : "border-orange-500/20 bg-orange-500/5"}`}>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-white">{i.name}</p>
                  {!i.isRead && <span className="w-2 h-2 rounded-full bg-orange-400 flex-shrink-0" />}
                  {i.unit && <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full">وحدة {i.unit.code}</span>}
                </div>
                <p className="text-xs text-slate-400 mt-0.5">📞 {i.phone}{i.email ? ` • ${i.email}` : ""}</p>
                {i.note && <p className="text-xs text-slate-500 mt-1 truncate">{i.note}</p>}
                <p className="text-xs text-slate-600 mt-1">{new Date(i.createdAt).toLocaleDateString("ar-SA", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
              </div>
              {!i.isRead && (
                <button type="button" onClick={() => markReadMut.mutate(i.id)}
                  className="flex-shrink-0 text-xs border border-orange-500/20 bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 px-3 py-1.5 rounded-lg transition-colors">
                  قُرئ
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── section anchors (map accordion key → live-preview element id) ────────────

const SECTION_ANCHORS = {
  basic: "cms-project-info",
  pricing: "cms-project-info",
  location: "cms-project-map",
  features: "cms-project-features",
  visibility: "cms-project-info",
  images: "cms-project-gallery",
  units: "cms-project-units",
  interests: "cms-project-interest",
};

// ─── main component ─────────────────────────────────────────────────────────────

const ProjectEditorPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get("tab");

  const mutations = useProjectsMutations();
  const { cities = [], cityOptions = [] } = useMeta();

  const isNew = id === "new";
  const { data: projectDetail, isLoading } = useProjectDetailQuery(isNew ? null : id);

  const [form, setForm] = useState(emptyForm);
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Which accordion section is currently open (single-open, like the Home CMS editor)
  const [openKey, setOpenKey] = useState("basic");
  const toggleSection = (key) => setOpenKey((prev) => (prev === key ? null : key));

  // Initialize form when data loads
  useEffect(() => {
    if (!isNew && projectDetail) {
      const cityEntry = cities.find(
        (c) => c.name === projectDetail.city || c.nameAr === projectDetail.city
      );
      setForm({
        ...emptyForm,
        ...projectDetail,
        cityId: cityEntry ? String(cityEntry.id) : "",
        features: Array.isArray(projectDetail.features) ? projectDetail.features : [],
        services: Array.isArray(projectDetail.services) ? projectDetail.services : [],
        latitude: projectDetail.latitude ?? "",
        longitude: projectDetail.longitude ?? "",
        areaFrom: projectDetail.areaFrom ?? "",
        areaTo: projectDetail.areaTo ?? "",
        priceFrom: projectDetail.priceFrom ?? "",
        priceTo: projectDetail.priceTo ?? "",
        totalUnits: projectDetail.totalUnits ?? "",
        completionDate: projectDetail.completionDate
          ? new Date(projectDetail.completionDate).toISOString().split("T")[0]
          : "",
      });
    } else if (isNew) {
      setForm(emptyForm);
    }
  }, [projectDetail, isNew, cities]);

  // Revalidate whenever touched fields change
  useEffect(() => {
    setErrors(validate(form));
  }, [form]);

  // Auto scroll to interests if tab=interests
  useEffect(() => {
    if (initialTab === "interests") {
      setOpenKey("interests");
      setTimeout(() => {
        const el = document.getElementById("interests-panel");
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 500);
    }
  }, [initialTab]);

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

  const isDirty = Object.keys(touched).length > 0;

  const handleCancel = () => {
    if (isDirty) {
      if (window.confirm("لديك تغييرات غير محفوظة، هل أنت تأكد من الخروج دون حفظ؟")) {
        navigate("/app/website/projects");
      }
    } else {
      navigate("/app/website/projects");
    }
  };

  const handleSubmit = async () => {
    // Touch all fields to show all errors
    const allTouched = Object.fromEntries(Object.keys(emptyForm).map((k) => [k, true]));
    setTouched(allTouched);
    const errs = validate(form);
    if (Object.keys(errs).length) {
      toast.error("يرجى تصحيح الأخطاء في النموذج قبل الحفظ");
      return;
    }

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

      if (!isNew) {
        await mutations.updateMutation.mutateAsync({ id, data: payload });
        toast.success("تم حفظ التعديلات بنجاح");
        setTouched({});
      } else {
        const res = await mutations.createMutation.mutateAsync(payload);
        toast.success("تم إنشاء المشروع بنجاح");
        navigate(`/app/website/projects/${res.id}`, { replace: true });
      }
    } catch {
      // Error handled by mutation
    } finally {
      setSubmitting(false);
    }
  };

  const galleryProject = projectDetail ?? null;
  const editingId = !isNew ? id : null;

  // Shared units query — feeds both the Units accordion and the live preview payload.
  const unitsQuery = useQuery({
    queryKey: ["project-units-admin", editingId],
    queryFn: () => fetchProjectUnitsApi(editingId),
    enabled: !!editingId,
  });
  const units = useMemo(() => unitsQuery.data || [], [unitsQuery.data]);

  // Build the payload streamed to the live preview iframe: the in-progress form,
  // normalized to the same shape the public project page expects.
  const previewPayload = useMemo(() => {
    const num = (v) => (v === "" || v == null ? null : Number(v));
    return {
      ...form,
      id: editingId || "__cms_preview__",
      areaFrom: num(form.areaFrom),
      areaTo: num(form.areaTo),
      priceFrom: num(form.priceFrom),
      priceTo: num(form.priceTo),
      totalUnits: num(form.totalUnits),
      latitude: num(form.latitude),
      longitude: num(form.longitude),
      coverImageUrl: galleryProject?.coverImageUrl || null,
      galleryImages: galleryProject?.galleryImages || [],
      projectUnits: units,
    };
  }, [form, editingId, galleryProject, units]);

  const activeAnchor = openKey ? SECTION_ANCHORS[openKey] : null;

  if (isLoading && !isNew) {
    return <div className="p-8 text-center text-slate-400">جاري تحميل بيانات المشروع...</div>;
  }

  return (
    <div className="space-y-6 pb-12 font-cairo" dir="rtl">
      <StickyActionBar
        title={isNew ? "إضافة مشروع جديد" : form.title || "تعديل المشروع"}
        subtitle={isNew ? "أدخل تفاصيل المشروع الجديد" : "تعديل بيانات المشروع الحالي"}
        isDirty={isDirty}
        isSaving={submitting}
        onSave={handleSubmit}
        onBack={handleCancel}
        backUrl="/app/website/projects"
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          {/* ── البيانات الأساسية ── */}
          <EditorAccordion title="البيانات الأساسية" icon={Buildings} color="emerald" isOpen={openKey === "basic"} onToggle={() => toggleSection("basic")}>
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

            <FormField label="الوصف">
              <textarea
                className={`${inputClasses} min-h-[70px] resize-y`}
                value={form.description || ""}
                placeholder="وصف مختصر يُعرض في صفحة المشروع وبطاقة المشروع..."
                onChange={(e) => set("description", e.target.value)}
              />
            </FormField>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
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
              <FormField label="رقم الترخيص">
                <input
                  className={inputClasses}
                  value={form.licenseNumber || ""}
                  placeholder="مثال: 1234567890"
                  onChange={(e) => set("licenseNumber", e.target.value)}
                />
              </FormField>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
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
          </EditorAccordion>

          {/* ── الأسعار والمساحات ── */}
          <EditorAccordion title="الأسعار والمساحات" icon={Tag} color="amber" isOpen={openKey === "pricing"} onToggle={() => toggleSection("pricing")}>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              <FormField label="السعر من (ريال)">
                <input type="number" className={inputClasses} value={form.priceFrom} placeholder="500,000" onChange={(e) => set("priceFrom", e.target.value)} onBlur={() => touch("priceFrom")} />
              </FormField>
              <FormField label="السعر حتى (ريال)">
                <input type="number" className={`${inputClasses} ${touched.priceTo && errors.priceTo ? "border-red-500/50" : ""}`} value={form.priceTo} placeholder="2,000,000" onChange={(e) => set("priceTo", e.target.value)} onBlur={() => touch("priceTo")} />
                {touched.priceTo && <FieldError msg={errors.priceTo} />}
              </FormField>
              <FormField label="المساحة من (م²)">
                <input type="number" className={inputClasses} value={form.areaFrom} placeholder="80" onChange={(e) => set("areaFrom", e.target.value)} onBlur={() => touch("areaFrom")} />
              </FormField>
              <FormField label="المساحة حتى (م²)">
                <input type="number" className={`${inputClasses} ${touched.areaTo && errors.areaTo ? "border-red-500/50" : ""}`} value={form.areaTo} placeholder="500" onChange={(e) => set("areaTo", e.target.value)} onBlur={() => touch("areaTo")} />
                {touched.areaTo && <FieldError msg={errors.areaTo} />}
              </FormField>
            </div>
            <FormField label="إجمالي الوحدات">
              <input type="number" className="w-full max-w-[180px] rounded-lg border border-white/10 bg-[#111827]/60 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-emerald-500/40 focus:outline-none" value={form.totalUnits} placeholder="120" onChange={(e) => set("totalUnits", e.target.value)} />
            </FormField>
          </EditorAccordion>

          {/* ── الموقع والعنوان ── */}
          <EditorAccordion title="الموقع والعنوان" icon={MapPin} color="cyan" isOpen={openKey === "location"} onToggle={() => toggleSection("location")}>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
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

            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3 space-y-3">
              <p className="text-xs text-slate-400 flex items-center gap-2">
                📍 <span>انقر على الخريطة أو ابحث عن موقع لتحديده تلقائياً</span>
              </p>
              <MapLocationPicker
                latitude={form.latitude}
                longitude={form.longitude}
                mapAddress={form.address || ""}
                onChange={handleMapChange}
                height={260}
              />
              <div className="grid grid-cols-2 gap-3">
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
          </EditorAccordion>

          {/* ── المميزات والخدمات ── */}
          <EditorAccordion title="المميزات والخدمات" icon={Sparkle} color="purple" isOpen={openKey === "features"} onToggle={() => toggleSection("features")}>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
          </EditorAccordion>

          {/* ── إعدادات الظهور ── */}
          <EditorAccordion title="إعدادات الظهور" icon={Eye} color="pink" isOpen={openKey === "visibility"} onToggle={() => toggleSection("visibility")}>
            <div className="flex flex-wrap items-center gap-3">
              <label className="flex cursor-pointer items-center gap-2.5 rounded-lg p-2 transition-colors hover:bg-white/5">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => set("isActive", e.target.checked)}
                  className="h-4 w-4 rounded accent-emerald-500"
                />
                <span className="text-xs text-slate-200">مفعّل (يظهر للزوار)</span>
              </label>
              <label className="flex cursor-pointer items-center gap-2.5 rounded-lg p-2 transition-colors hover:bg-white/5">
                <input
                  type="checkbox"
                  checked={form.isFeatured}
                  onChange={(e) => set("isFeatured", e.target.checked)}
                  className="h-4 w-4 rounded accent-amber-400"
                />
                <span className="text-xs font-medium text-amber-400 flex items-center gap-1"><Star size={14} weight="fill" /> مشروع مميز (Featured)</span>
              </label>
              <div className="mr-auto flex items-center gap-2.5">
                <label className="text-xs text-slate-400">ترتيب الظهور:</label>
                <input
                  type="number"
                  className="w-16 rounded-lg border border-white/10 bg-[#111827]/60 px-2 py-1.5 text-sm text-white text-center focus:border-emerald-500/40 focus:outline-none"
                  value={form.sortOrder}
                  onChange={(e) => set("sortOrder", e.target.value)}
                  dir="ltr"
                />
                <span className="text-xs text-slate-500">(الأقل = أول)</span>
              </div>
            </div>
          </EditorAccordion>

          {/* ── صور المشروع (تعديل فقط) ── */}
          {editingId ? (
            <EditorAccordion title="صور المشروع" icon={Image} color="rose" isOpen={openKey === "images"} onToggle={() => toggleSection("images")}>
              <div className="space-y-2">
                <label className="block text-xs font-medium text-slate-300">الصورة الرئيسية (Cover)</label>
                <div className="overflow-hidden rounded-xl border border-white/10 bg-slate-950/40">
                  {galleryProject?.coverImageUrl ? (
                    <img src={resolveUploadUrl(galleryProject.coverImageUrl)} alt="cover" className="h-32 w-full object-cover" />
                  ) : (
                    <div className="flex h-32 items-center justify-center text-slate-500">
                      <Image size={24} />
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <label className="theme-button-white inline-flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold">
                    <UploadSimple size={16} weight="bold" />
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
                      className="flex items-center gap-1.5 rounded-lg border border-red-500/20 bg-red-500/10 px-2.5 py-2 text-xs text-red-300 hover:bg-red-500/20 transition-colors"
                    >
                      <Trash size={14} /> حذف الصورة
                    </button>
                  )}
                </div>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3 space-y-3">
                <h4 className="text-xs font-semibold text-white">معرض الصور (Gallery)</h4>
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
                  className="block w-full cursor-pointer text-xs text-slate-400 file:mr-3 file:cursor-pointer file:rounded-lg file:border-0 file:bg-emerald-500/10 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-emerald-400 hover:file:bg-emerald-500/20"
                />
                {galleryProject?.galleryImages?.length > 0 ? (
                  <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                    {galleryProject.galleryImages.map((img, i) => (
                      <div key={i} className="group relative aspect-video overflow-hidden rounded-lg border border-white/10 bg-black/40">
                        <img src={resolveUploadUrl(img)} alt="" className="h-full w-full object-cover" />
                        <button
                          type="button"
                          onClick={() =>
                            mutations.galleryDeleteMutation.mutate({
                              id: editingId,
                              filename: img.split("/").pop(),
                            })
                          }
                          className="absolute right-1.5 top-1.5 rounded-md bg-red-500/90 p-1 text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 hover:bg-red-500"
                        >
                          <Trash size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-xs text-slate-500 py-3">لا توجد صور في المعرض بعد</p>
                )}
              </div>
            </EditorAccordion>
          ) : (
            <p className="rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3 text-xs text-amber-300">
              💡 بعد حفظ بيانات المشروع ستتمكن من رفع الصور والمعرض وإدارة الوحدات عبر زر التعديل.
            </p>
          )}

          {/* ── وحدات المشروع (تعديل فقط) ── */}
          {editingId && (
            <EditorAccordion title="وحدات المشروع" icon={Package} color="blue" isOpen={openKey === "units"} onToggle={() => toggleSection("units")}>
              <ProjectUnitsManager projectId={editingId} units={units} isLoading={unitsQuery.isLoading} />
            </EditorAccordion>
          )}

          {/* ── طلبات الاهتمام (تعديل فقط) ── */}
          {editingId && (
            <EditorAccordion title="طلبات الاهتمام" icon={EnvelopeSimple} color="orange" isOpen={openKey === "interests"} onToggle={() => toggleSection("interests")}>
              <ProjectInterestsPanel projectId={editingId} />
            </EditorAccordion>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleCancel}
              className="rounded-xl border border-white/10 px-6 py-2.5 text-sm font-semibold text-slate-300 transition-colors hover:bg-white/5"
            >
              إلغاء
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="flex items-center gap-2 rounded-xl bg-emerald-500 px-8 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition-colors hover:bg-emerald-600 disabled:opacity-60"
            >
              {submitting ? "جاري الحفظ..." : editingId ? "حفظ التعديلات" : "إنشاء المشروع"}
            </button>
          </div>
        </motion.div>

        <ProjectLivePreview payload={previewPayload} anchor={activeAnchor} />
      </div>
    </div>
  );
};

export default ProjectEditorPage;
