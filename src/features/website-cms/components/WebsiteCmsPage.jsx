import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  ArrowsClockwise,
  CheckCircle,
  PencilSimple,
  Plus,
  Trash,
} from "phosphor-react";
import PageHeader from "../../../components/common/PageHeader";
import ImageUploadField from "./ImageUploadField";
import { useWebsiteSettingsQuery } from "../hooks/useWebsiteSettingsQuery";
import { useHeroSlidesQuery } from "../hooks/useHeroSlidesQuery";
import { useWebsiteSectionsQuery } from "../hooks/useWebsiteSectionsQuery";
import { useFeaturedOffersQuery } from "../hooks/useFeaturedOffersQuery";
import {
  useFeaturedOfferMutations,
  useHeroSlideMutations,
  useWebsiteImageUploadMutation,
  useWebsiteSectionMutations,
  useWebsiteSettingsMutation,
} from "../hooks/useWebsiteCmsMutations";

const inputClasses =
  "w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40";
const textAreaClasses = `${inputClasses} min-h-[110px] resize-y`;
const cardClasses =
  "rounded-3xl border border-white/10 bg-white/[0.03] p-5 shadow-[0_10px_40px_rgba(15,23,42,0.2)]";

const SECTION_KEYS = [
  { key: "home_about", title: "About" },
  { key: "home_discover", title: "Discover" },
  { key: "home_stats", title: "Stats" },
  { key: "home_vision", title: "Vision" },
  { key: "home_contact", title: "Contact" },
];

const emptySettings = {
  siteName: "",
  siteTagline: "",
  logoUrl: "",
  footerLogoUrl: "",
  contactEmail: "",
  contactPhone: "",
  whatsappNumber: "",
  address: "",
  facebookUrl: "",
  instagramUrl: "",
  linkedinUrl: "",
  xUrl: "",
  mapEmbedUrl: "",
};

const emptyHero = {
  title: "",
  subtitle: "",
  imageUrl: "",
  buttonText: "",
  buttonUrl: "",
  sortOrder: 0,
  isActive: true,
};

const emptyFeatured = {
  title: "",
  subtitle: "",
  location: "",
  priceLabel: "",
  imageUrl: "",
  beds: "",
  baths: "",
  sizeLabel: "",
  badge: "",
  offerId: "",
  sortOrder: 0,
  isActive: true,
};

const createSectionForm = (sectionKey) => ({
  sectionKey,
  title: "",
  subtitle: "",
  description: "",
  imageUrl: "",
  primaryButtonText: "",
  primaryButtonUrl: "",
  secondaryButtonText: "",
  secondaryButtonUrl: "",
  content: "",
  sortOrder: 0,
  isActive: true,
});

const SectionCard = ({ title, subtitle, children }) => (
  <section className={cardClasses}>
    <div className="mb-5">
      <h2 className="text-lg font-semibold text-white">{title}</h2>
      <p className="mt-1 text-sm text-slate-400">{subtitle}</p>
    </div>
    {children}
  </section>
);

const WebsiteCmsPage = () => {
  const settingsQuery = useWebsiteSettingsQuery();
  const heroSlidesQuery = useHeroSlidesQuery();
  const sectionsQuery = useWebsiteSectionsQuery();
  const featuredOffersQuery = useFeaturedOffersQuery();

  const settingsMutation = useWebsiteSettingsMutation();
  const heroMutations = useHeroSlideMutations();
  const sectionMutations = useWebsiteSectionMutations();
  const featuredMutations = useFeaturedOfferMutations();
  const uploadMutation = useWebsiteImageUploadMutation();

  const [settingsForm, setSettingsForm] = useState(emptySettings);
  const [heroForm, setHeroForm] = useState(emptyHero);
  const [heroEditingId, setHeroEditingId] = useState(null);
  const [featuredForm, setFeaturedForm] = useState(emptyFeatured);
  const [featuredEditingId, setFeaturedEditingId] = useState(null);
  const [sectionForms, setSectionForms] = useState(() =>
    Object.fromEntries(SECTION_KEYS.map((item) => [item.key, createSectionForm(item.key)])),
  );

  useEffect(() => {
    if (settingsQuery.data) {
      setSettingsForm({ ...emptySettings, ...settingsQuery.data });
    }
  }, [settingsQuery.data]);

  useEffect(() => {
    if (!sectionsQuery.data) return;
    setSectionForms((prev) => {
      const next = { ...prev };
      for (const item of SECTION_KEYS) {
        const existing = sectionsQuery.data.find((section) => section.sectionKey === item.key);
        next[item.key] = existing
          ? {
              sectionKey: existing.sectionKey,
              title: existing.title || "",
              subtitle: existing.subtitle || "",
              description: existing.description || "",
              imageUrl: existing.imageUrl || "",
              primaryButtonText: existing.primaryButtonText || "",
              primaryButtonUrl: existing.primaryButtonUrl || "",
              secondaryButtonText: existing.secondaryButtonText || "",
              secondaryButtonUrl: existing.secondaryButtonUrl || "",
              content: existing.content ? JSON.stringify(existing.content, null, 2) : "",
              sortOrder: existing.sortOrder ?? 0,
              isActive: Boolean(existing.isActive),
            }
          : createSectionForm(item.key);
      }
      return next;
    });
  }, [sectionsQuery.data]);

  const sectionsMap = useMemo(
    () => new Map((sectionsQuery.data || []).map((item) => [item.sectionKey, item])),
    [sectionsQuery.data],
  );

  const refreshAll = () => {
    settingsQuery.refetch();
    heroSlidesQuery.refetch();
    sectionsQuery.refetch();
    featuredOffersQuery.refetch();
  };

  const saveSettings = async (event) => {
    event.preventDefault();
    await settingsMutation.mutateAsync(settingsForm);
  };

  const saveHero = async (event) => {
    event.preventDefault();
    const payload = {
      ...heroForm,
      sortOrder: Number(heroForm.sortOrder) || 0,
      isActive: Boolean(heroForm.isActive),
    };
    if (heroEditingId) {
      await heroMutations.updateHeroSlide.mutateAsync({ id: heroEditingId, payload });
    } else {
      await heroMutations.createHeroSlide.mutateAsync(payload);
    }
    setHeroEditingId(null);
    setHeroForm(emptyHero);
  };

  const saveSection = async (sectionKey) => {
    const current = sectionForms[sectionKey];
    let content = null;
    try {
      content = current.content.trim() ? JSON.parse(current.content) : null;
    } catch {
      toast.error(`JSON غير صالح في ${sectionKey}`);
      return;
    }
    const payload = {
      ...current,
      content,
      sortOrder: Number(current.sortOrder) || 0,
      isActive: Boolean(current.isActive),
    };
    const existing = sectionsMap.get(sectionKey);
    if (existing) {
      await sectionMutations.updateWebsiteSection.mutateAsync({
        id: existing.id,
        payload,
      });
    } else {
      await sectionMutations.createWebsiteSection.mutateAsync(payload);
    }
  };

  const saveFeatured = async (event) => {
    event.preventDefault();
    const payload = {
      ...featuredForm,
      offerId: featuredForm.offerId ? Number(featuredForm.offerId) : "",
      beds: featuredForm.beds === "" ? "" : Number(featuredForm.beds),
      baths: featuredForm.baths === "" ? "" : Number(featuredForm.baths),
      sortOrder: Number(featuredForm.sortOrder) || 0,
      isActive: Boolean(featuredForm.isActive),
    };
    if (featuredEditingId) {
      await featuredMutations.updateFeaturedOffer.mutateAsync({
        id: featuredEditingId,
        payload,
      });
    } else {
      await featuredMutations.createFeaturedOffer.mutateAsync(payload);
    }
    setFeaturedEditingId(null);
    setFeaturedForm(emptyFeatured);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        subtitle="إدارة محتوى الـ landing page من داخل لوحة التحكم"
        actions={[
          {
            key: "refresh",
            label: "تحديث",
            icon: ArrowsClockwise,
            onClick: refreshAll,
            className: "theme-button-white",
          },
        ]}
      />

      <div className="grid grid-cols-1 gap-6">
        <SectionCard title="General Settings" subtitle="بيانات الموقع الأساسية">
          <form onSubmit={saveSettings} className="space-y-5">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {[
                ["siteName", "اسم الموقع"],
                ["siteTagline", "الشعار النصي"],
                ["contactEmail", "البريد الإلكتروني"],
                ["contactPhone", "رقم الهاتف"],
                ["whatsappNumber", "واتساب"],
                ["address", "العنوان"],
                ["facebookUrl", "Facebook"],
                ["instagramUrl", "Instagram"],
                ["linkedinUrl", "LinkedIn"],
                ["xUrl", "X"],
              ].map(([key, label]) => (
                <div key={key}>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    {label}
                  </label>
                  <input
                    className={inputClasses}
                    value={settingsForm[key]}
                    onChange={(event) =>
                      setSettingsForm((prev) => ({ ...prev, [key]: event.target.value }))
                    }
                    dir={String(key).toLowerCase().includes("url") || String(key).toLowerCase().includes("email") || String(key).toLowerCase().includes("phone") ? "ltr" : undefined}
                  />
                </div>
              ))}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                رابط الخريطة
              </label>
              <input
                className={inputClasses}
                value={settingsForm.mapEmbedUrl}
                onChange={(event) =>
                  setSettingsForm((prev) => ({ ...prev, mapEmbedUrl: event.target.value }))
                }
                dir="ltr"
              />
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <ImageUploadField
                label="Logo"
                value={settingsForm.logoUrl}
                onChange={(value) => setSettingsForm((prev) => ({ ...prev, logoUrl: value }))}
                uploadMutation={uploadMutation}
              />
              <ImageUploadField
                label="Footer Logo"
                value={settingsForm.footerLogoUrl}
                onChange={(value) =>
                  setSettingsForm((prev) => ({ ...prev, footerLogoUrl: value }))
                }
                uploadMutation={uploadMutation}
              />
            </div>

            <button
              type="submit"
              disabled={settingsMutation.isPending}
              className="theme-button-primary inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold disabled:opacity-60"
            >
              <CheckCircle size={18} weight="bold" />
              {settingsMutation.isPending ? "جاري الحفظ..." : "حفظ الإعدادات"}
            </button>
          </form>
        </SectionCard>

        <SectionCard title="Hero Slides" subtitle="إدارة شرائح الهيرو">
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <form onSubmit={saveHero} className="space-y-4">
              <input className={inputClasses} placeholder="العنوان" value={heroForm.title} onChange={(e) => setHeroForm((prev) => ({ ...prev, title: e.target.value }))} required />
              <textarea className={textAreaClasses} placeholder="الوصف" value={heroForm.subtitle} onChange={(e) => setHeroForm((prev) => ({ ...prev, subtitle: e.target.value }))} />
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <input className={inputClasses} placeholder="نص الزر" value={heroForm.buttonText} onChange={(e) => setHeroForm((prev) => ({ ...prev, buttonText: e.target.value }))} />
                <input className={inputClasses} placeholder="رابط الزر" value={heroForm.buttonUrl} onChange={(e) => setHeroForm((prev) => ({ ...prev, buttonUrl: e.target.value }))} dir="ltr" />
              </div>
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <input type="number" className={inputClasses} placeholder="الترتيب" value={heroForm.sortOrder} onChange={(e) => setHeroForm((prev) => ({ ...prev, sortOrder: e.target.value }))} dir="ltr" />
                <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
                  <input type="checkbox" checked={heroForm.isActive} onChange={(e) => setHeroForm((prev) => ({ ...prev, isActive: e.target.checked }))} />
                  مفعل
                </label>
              </div>
              <ImageUploadField
                label="صورة الشريحة"
                value={heroForm.imageUrl}
                onChange={(value) => setHeroForm((prev) => ({ ...prev, imageUrl: value }))}
                uploadMutation={uploadMutation}
              />
              <div className="flex gap-3">
                <button type="submit" className="theme-button-primary inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold">
                  <Plus size={18} weight="bold" />
                  {heroEditingId ? "تحديث الشريحة" : "إضافة شريحة"}
                </button>
                {heroEditingId ? (
                  <button type="button" className="theme-button-white rounded-xl px-5 py-3 text-sm font-semibold" onClick={() => { setHeroEditingId(null); setHeroForm(emptyHero); }}>
                    إلغاء
                  </button>
                ) : null}
              </div>
            </form>

            <div className="space-y-4">
              {(heroSlidesQuery.data || []).map((item) => (
                <div key={item.id} className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
                  <img src={item.imageUrl} alt={item.title} className="mb-3 h-32 w-full rounded-xl object-cover" />
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-white">{item.title}</h3>
                      <p className="text-sm text-slate-400">{item.subtitle}</p>
                    </div>
                    <span className="text-xs text-slate-500">#{item.sortOrder}</span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button type="button" className="theme-button-white inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold" onClick={() => { setHeroEditingId(item.id); setHeroForm({ title: item.title || "", subtitle: item.subtitle || "", imageUrl: item.imageUrl || "", buttonText: item.buttonText || "", buttonUrl: item.buttonUrl || "", sortOrder: item.sortOrder ?? 0, isActive: Boolean(item.isActive) }); }}>
                      <PencilSimple size={16} />
                      تعديل
                    </button>
                    <button type="button" className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-200" onClick={() => heroMutations.toggleHeroSlideStatus.mutate({ id: item.id, isActive: !item.isActive })}>
                      {item.isActive ? "إخفاء" : "تفعيل"}
                    </button>
                    <button type="button" className="inline-flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-300" onClick={() => heroMutations.deleteHeroSlide.mutate(item.id)}>
                      <Trash size={16} />
                      حذف
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Home Sections" subtitle="النصوص والصور الخاصة بأقسام الصفحة">
          <div className="space-y-6">
            {SECTION_KEYS.map((item) => {
              const form = sectionForms[item.key];
              const existing = sectionsMap.get(item.key);
              return (
                <div key={item.key} className="rounded-2xl border border-white/10 bg-slate-950/30 p-5">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-white">{item.title}</h3>
                      <p className="text-xs text-slate-500">{item.key}</p>
                    </div>
                    {existing ? (
                      <button type="button" className="inline-flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-300" onClick={() => sectionMutations.deleteWebsiteSection.mutate(existing.id)}>
                        <Trash size={16} />
                        حذف
                      </button>
                    ) : null}
                  </div>
                  <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    <input className={inputClasses} placeholder="العنوان" value={form.title} onChange={(e) => setSectionForms((prev) => ({ ...prev, [item.key]: { ...prev[item.key], title: e.target.value } }))} />
                    <input className={inputClasses} placeholder="العنوان الفرعي" value={form.subtitle} onChange={(e) => setSectionForms((prev) => ({ ...prev, [item.key]: { ...prev[item.key], subtitle: e.target.value } }))} />
                  </div>
                  <textarea className={`${textAreaClasses} mt-4`} placeholder="الوصف" value={form.description} onChange={(e) => setSectionForms((prev) => ({ ...prev, [item.key]: { ...prev[item.key], description: e.target.value } }))} />
                  <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
                    <input className={inputClasses} placeholder="Primary Button Text" value={form.primaryButtonText} onChange={(e) => setSectionForms((prev) => ({ ...prev, [item.key]: { ...prev[item.key], primaryButtonText: e.target.value } }))} />
                    <input className={inputClasses} placeholder="Primary Button URL" value={form.primaryButtonUrl} onChange={(e) => setSectionForms((prev) => ({ ...prev, [item.key]: { ...prev[item.key], primaryButtonUrl: e.target.value } }))} dir="ltr" />
                    <input className={inputClasses} placeholder="Secondary Button Text" value={form.secondaryButtonText} onChange={(e) => setSectionForms((prev) => ({ ...prev, [item.key]: { ...prev[item.key], secondaryButtonText: e.target.value } }))} />
                    <input className={inputClasses} placeholder="Secondary Button URL" value={form.secondaryButtonUrl} onChange={(e) => setSectionForms((prev) => ({ ...prev, [item.key]: { ...prev[item.key], secondaryButtonUrl: e.target.value } }))} dir="ltr" />
                  </div>
                  <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
                    <input type="number" className={inputClasses} placeholder="الترتيب" value={form.sortOrder} onChange={(e) => setSectionForms((prev) => ({ ...prev, [item.key]: { ...prev[item.key], sortOrder: e.target.value } }))} dir="ltr" />
                    <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
                      <input type="checkbox" checked={form.isActive} onChange={(e) => setSectionForms((prev) => ({ ...prev, [item.key]: { ...prev[item.key], isActive: e.target.checked } }))} />
                      مفعل
                    </label>
                  </div>
                  <div className="mt-4">
                    <ImageUploadField label="صورة القسم" value={form.imageUrl} onChange={(value) => setSectionForms((prev) => ({ ...prev, [item.key]: { ...prev[item.key], imageUrl: value } }))} uploadMutation={uploadMutation} />
                  </div>
                  <textarea className={`${textAreaClasses} mt-4 font-mono text-xs`} placeholder="JSON content" value={form.content} onChange={(e) => setSectionForms((prev) => ({ ...prev, [item.key]: { ...prev[item.key], content: e.target.value } }))} dir="ltr" />
                  <button type="button" className="theme-button-primary mt-4 inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold" onClick={() => saveSection(item.key)}>
                    <CheckCircle size={18} weight="bold" />
                    {existing ? "حفظ التعديلات" : "إنشاء القسم"}
                  </button>
                </div>
              );
            })}
          </div>
        </SectionCard>

        <SectionCard title="Featured Offers" subtitle="العقارات المميزة في الصفحة الرئيسية">
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <form onSubmit={saveFeatured} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <input className={inputClasses} placeholder="العنوان" value={featuredForm.title} onChange={(e) => setFeaturedForm((prev) => ({ ...prev, title: e.target.value }))} required />
                <input className={inputClasses} placeholder="Offer ID اختياري" value={featuredForm.offerId} onChange={(e) => setFeaturedForm((prev) => ({ ...prev, offerId: e.target.value }))} dir="ltr" />
                <input className={inputClasses} placeholder="العنوان الفرعي" value={featuredForm.subtitle} onChange={(e) => setFeaturedForm((prev) => ({ ...prev, subtitle: e.target.value }))} />
                <input className={inputClasses} placeholder="الموقع" value={featuredForm.location} onChange={(e) => setFeaturedForm((prev) => ({ ...prev, location: e.target.value }))} />
                <input className={inputClasses} placeholder="السعر" value={featuredForm.priceLabel} onChange={(e) => setFeaturedForm((prev) => ({ ...prev, priceLabel: e.target.value }))} />
                <input className={inputClasses} placeholder="Badge" value={featuredForm.badge} onChange={(e) => setFeaturedForm((prev) => ({ ...prev, badge: e.target.value }))} />
                <input type="number" className={inputClasses} placeholder="Bedrooms" value={featuredForm.beds} onChange={(e) => setFeaturedForm((prev) => ({ ...prev, beds: e.target.value }))} dir="ltr" />
                <input type="number" className={inputClasses} placeholder="Bathrooms" value={featuredForm.baths} onChange={(e) => setFeaturedForm((prev) => ({ ...prev, baths: e.target.value }))} dir="ltr" />
                <input className={inputClasses} placeholder="Size Label" value={featuredForm.sizeLabel} onChange={(e) => setFeaturedForm((prev) => ({ ...prev, sizeLabel: e.target.value }))} />
                <input type="number" className={inputClasses} placeholder="الترتيب" value={featuredForm.sortOrder} onChange={(e) => setFeaturedForm((prev) => ({ ...prev, sortOrder: e.target.value }))} dir="ltr" />
              </div>
              <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
                <input type="checkbox" checked={featuredForm.isActive} onChange={(e) => setFeaturedForm((prev) => ({ ...prev, isActive: e.target.checked }))} />
                مفعل
              </label>
              <ImageUploadField label="صورة العقار" value={featuredForm.imageUrl} onChange={(value) => setFeaturedForm((prev) => ({ ...prev, imageUrl: value }))} uploadMutation={uploadMutation} />
              <div className="flex gap-3">
                <button type="submit" className="theme-button-primary inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold">
                  <Plus size={18} weight="bold" />
                  {featuredEditingId ? "تحديث العنصر" : "إضافة عنصر"}
                </button>
                {featuredEditingId ? (
                  <button type="button" className="theme-button-white rounded-xl px-5 py-3 text-sm font-semibold" onClick={() => { setFeaturedEditingId(null); setFeaturedForm(emptyFeatured); }}>
                    إلغاء
                  </button>
                ) : null}
              </div>
            </form>

            <div className="space-y-4">
              {(featuredOffersQuery.data || []).map((item) => (
                <div key={item.id} className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.title} className="mb-3 h-32 w-full rounded-xl object-cover" />
                  ) : null}
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-white">{item.title}</h3>
                      <p className="text-sm text-slate-400">{item.location}</p>
                      <p className="text-sm text-emerald-400">{item.priceLabel}</p>
                    </div>
                    <span className="text-xs text-slate-500">#{item.sortOrder}</span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button type="button" className="theme-button-white inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold" onClick={() => { setFeaturedEditingId(item.id); setFeaturedForm({ title: item.title || "", subtitle: item.subtitle || "", location: item.location || "", priceLabel: item.priceLabel || "", imageUrl: item.imageUrl || "", beds: item.beds ?? "", baths: item.baths ?? "", sizeLabel: item.sizeLabel || "", badge: item.badge || "", offerId: item.offerId ?? "", sortOrder: item.sortOrder ?? 0, isActive: Boolean(item.isActive) }); }}>
                      <PencilSimple size={16} />
                      تعديل
                    </button>
                    <button type="button" className="inline-flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-300" onClick={() => featuredMutations.deleteFeaturedOffer.mutate(item.id)}>
                      <Trash size={16} />
                      حذف
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  );
};

export default WebsiteCmsPage;
