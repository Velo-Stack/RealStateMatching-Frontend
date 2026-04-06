import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { ArrowsClockwise, Gear, Images, Layout, Star } from "phosphor-react";
import PageHeader from "../../../components/common/PageHeader";
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
import {
  SECTION_KEYS,
  emptySettings,
  emptyHero,
  emptyFeatured,
  createSectionForm,
  cardClasses,
} from "../constants/websiteCmsConstants";
import PreviewPanel from "./PreviewPanel";
import SettingsSection from "./sections/SettingsSection";
import HeroSection from "./sections/HeroSection";
import FeaturedSection from "./sections/FeaturedSection";
import HomeSectionsSection from "./sections/HomeSectionsSection";

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

  // Active section state
  const [activeSection, setActiveSection] = useState("settings");

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

  const handleEditHero = (item) => {
    setHeroEditingId(item.id);
    setHeroForm({
      title: item.title || "",
      subtitle: item.subtitle || "",
      imageUrl: item.imageUrl || "",
      buttonText: item.buttonText || "",
      buttonUrl: item.buttonUrl || "",
      sortOrder: item.sortOrder ?? 0,
      isActive: Boolean(item.isActive),
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelHeroEdit = () => {
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

  const handleEditFeatured = (item) => {
    setFeaturedEditingId(item.id);
    setFeaturedForm({
      title: item.title || "",
      subtitle: item.subtitle || "",
      location: item.location || "",
      priceLabel: item.priceLabel || "",
      imageUrl: item.imageUrl || "",
      beds: item.beds ?? "",
      baths: item.baths ?? "",
      sizeLabel: item.sizeLabel || "",
      badge: item.badge || "",
      offerId: item.offerId ?? "",
      sortOrder: item.sortOrder ?? 0,
      isActive: Boolean(item.isActive),
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelFeaturedEdit = () => {
    setFeaturedEditingId(null);
    setFeaturedForm(emptyFeatured);
  };

  // Navigation items
  const navItems = [
    { id: "settings", label: "الإعدادات العامة", icon: Gear },
    { id: "hero", label: "شرائح الهيرو", icon: Images },
    { id: "sections", label: "أقسام الصفحة الرئيسية", icon: Layout },
    { id: "featured", label: "العروض المميزة", icon: Star },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        subtitle="إدارة محتوى الموقع من لوحة التحكم"
        actions={[
          {
            key: "refresh",
            label: "تحديث الكل",
            icon: ArrowsClockwise,
            onClick: refreshAll,
            className: "theme-button-white",
          },
        ]}
      />

      {/* Main Layout: Split Screen */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left Panel: Editor */}
        <div className="order-2 lg:order-1">
          <div className={cardClasses}>
            {/* Navigation Tabs */}
            <div className="mb-6 flex flex-wrap gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                return (
                  <motion.button
                    key={item.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveSection(item.id)}
                    className={`
                      flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-all
                      ${
                        isActive
                          ? "bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg shadow-emerald-500/30"
                          : "border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
                      }
                    `}
                  >
                    <Icon size={18} weight={isActive ? "fill" : "regular"} />
                    <span>{item.label}</span>
                  </motion.button>
                );
              })}
            </div>

            {/* Content Area */}
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="min-h-[500px]"
            >
              {/* General Settings Section */}
              {activeSection === "settings" && (
                <SettingsSection
                  settingsForm={settingsForm}
                  setSettingsForm={setSettingsForm}
                  saveSettings={saveSettings}
                  settingsMutation={settingsMutation}
                  uploadMutation={uploadMutation}
                />
              )}

              {/* Hero Slides Section */}
              {activeSection === "hero" && (
                <HeroSection
                  heroForm={heroForm}
                  setHeroForm={setHeroForm}
                  heroEditingId={heroEditingId}
                  saveHero={saveHero}
                  handleCancelHeroEdit={handleCancelHeroEdit}
                  heroSlidesQuery={heroSlidesQuery}
                  handleEditHero={handleEditHero}
                  heroMutations={heroMutations}
                  uploadMutation={uploadMutation}
                />
              )}

              {/* Home Sections */}
              {activeSection === "sections" && (
                <HomeSectionsSection
                  sectionForms={sectionForms}
                  setSectionForms={setSectionForms}
                  sectionsMap={sectionsMap}
                  saveSection={saveSection}
                  sectionMutations={sectionMutations}
                  uploadMutation={uploadMutation}
                />
              )}

              {/* Featured Offers Section */}
              {activeSection === "featured" && (
                <FeaturedSection
                  featuredForm={featuredForm}
                  setFeaturedForm={setFeaturedForm}
                  featuredEditingId={featuredEditingId}
                  saveFeatured={saveFeatured}
                  handleCancelFeaturedEdit={handleCancelFeaturedEdit}
                  featuredOffersQuery={featuredOffersQuery}
                  handleEditFeatured={handleEditFeatured}
                  featuredMutations={featuredMutations}
                  uploadMutation={uploadMutation}
                />
              )}
            </motion.div>
          </div>
        </div>

        {/* Right Panel: Preview */}
        <PreviewPanel />
      </div>
    </div>
  );
};

export default WebsiteCmsPage;
