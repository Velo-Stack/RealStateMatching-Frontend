import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { CaretDown, CaretUp, ImageSquare, Layout, Star } from "phosphor-react";
import StickyActionBar from "../components/shared/StickyActionBar";
import { useHeroSlidesQuery } from "../hooks/useHeroSlidesQuery";
import { useWebsiteSectionsQuery } from "../hooks/useWebsiteSectionsQuery";
import { useFeaturedOffersQuery } from "../hooks/useFeaturedOffersQuery";
import {
  useFeaturedOfferMutations,
  useHeroSlideMutations,
  useWebsiteImageUploadMutation,
  useWebsiteSectionMutations,
} from "../hooks/useWebsiteCmsMutations";
import {
  SECTION_KEYS,
  emptyHero,
  emptyFeatured,
  createSectionForm,
} from "../constants/websiteCmsConstants";
import HeroSection from "../components/sections/HeroSection";
import FeaturedSection from "../components/sections/FeaturedSection";
import HomeSectionsSection from "../components/sections/HomeSectionsSection";
import HomeLivePreview from "../components/HomeLivePreview";
import { toast } from "sonner";

// Some CMS sub-sections share one visual section on the public page (e.g. the stats
// builder is rendered inside the "About" section), so scrolling should target the
// section that's actually visible instead of a non-existent element.
const SCROLL_TARGET_OVERRIDES = {
  home_stats: "home_about",
};

const WebsiteHomePage = () => {
  const heroSlidesQuery = useHeroSlidesQuery();
  const sectionsQuery = useWebsiteSectionsQuery();
  const featuredOffersQuery = useFeaturedOffersQuery();

  const heroMutations = useHeroSlideMutations();
  const sectionMutations = useWebsiteSectionMutations();
  const featuredMutations = useFeaturedOfferMutations();
  const uploadMutation = useWebsiteImageUploadMutation();

  // Accordion states
  const [isHeroOpen, setIsHeroOpen] = useState(true);
  const [isFeaturedOpen, setIsFeaturedOpen] = useState(false);
  const [isOtherSectionsOpen, setIsOtherSectionsOpen] = useState(false);
  // Which of the "other sections" (about, discover, stats, vision, contact) is expanded
  const [openSectionKey, setOpenSectionKey] = useState(null);

  // Which section the live preview should currently be scrolled to
  const activeSectionKey = isHeroOpen
    ? "hero"
    : isFeaturedOpen
      ? "featured"
      : isOtherSectionsOpen && openSectionKey
        ? SCROLL_TARGET_OVERRIDES[openSectionKey] || openSectionKey
        : null;

  const [heroForm, setHeroForm] = useState(emptyHero);
  const [heroEditingId, setHeroEditingId] = useState(null);
  const [featuredForm, setFeaturedForm] = useState(emptyFeatured);
  const [featuredEditingId, setFeaturedEditingId] = useState(null);
  const [sectionForms, setSectionForms] = useState(() =>
    Object.fromEntries(SECTION_KEYS.map((item) => [item.key, createSectionForm(item.key)])),
  );

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

  // We check if any mutation is pending to disable the save button, although sections save individually
  const isSaving = heroMutations.isPending || featuredMutations.isPending || sectionMutations.isPending;

  return (
    <div className="space-y-6 pb-12 font-cairo" dir="rtl">
      <StickyActionBar 
        title="أقسام الصفحة الرئيسية"
        subtitle="إدارة شرائح الهيرو، العروض المميزة، وباقي أقسام الصفحة"
        isDirty={false} 
        isSaving={isSaving}
        saveLabel="جميع الأقسام تُحفظ تلقائياً"
        onSave={() => {}}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* Hero Slides Sub-Section */}
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 overflow-hidden shadow-xl">
            <button
              onClick={() => setIsHeroOpen(!isHeroOpen)}
              className="w-full flex items-center justify-between p-3 hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <div className="bg-emerald-500/20 p-1.5 rounded-lg text-emerald-400">
                  <ImageSquare size={18} weight="duotone" />
                </div>
                <h3 className="text-sm font-bold text-white">شرائح الهيرو (المعروضة أعلى الرئيسية)</h3>
              </div>
              {isHeroOpen ? <CaretUp size={18} className="text-slate-400" /> : <CaretDown size={18} className="text-slate-400" />}
            </button>

            {isHeroOpen && (
              <div className="p-3 border-t border-emerald-500/20 bg-slate-900/50 backdrop-blur-md">
                <HeroSection
                  heroForm={heroForm}
                  setHeroForm={setHeroForm}
                  heroEditingId={heroEditingId}
                  saveHero={saveHero}
                  handleCancelHeroEdit={handleCancelHeroEdit}
                  uploadMutation={uploadMutation}
                  heroSlidesQuery={heroSlidesQuery}
                  handleEditHero={handleEditHero}
                  heroMutations={heroMutations}
                />
              </div>
            )}
          </div>

          {/* Featured Offers Sub-Section */}
          <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 overflow-hidden shadow-xl">
            <button
              onClick={() => setIsFeaturedOpen(!isFeaturedOpen)}
              className="w-full flex items-center justify-between p-3 hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <div className="bg-amber-500/20 p-1.5 rounded-lg text-amber-400">
                  <Star size={18} weight="duotone" />
                </div>
                <h3 className="text-sm font-bold text-white">العروض المميزة (Featured Offers)</h3>
              </div>
              {isFeaturedOpen ? <CaretUp size={18} className="text-slate-400" /> : <CaretDown size={18} className="text-slate-400" />}
            </button>

            {isFeaturedOpen && (
              <div className="p-3 border-t border-amber-500/20 bg-slate-900/50 backdrop-blur-md">
                <FeaturedSection
                  featuredForm={featuredForm}
                  setFeaturedForm={setFeaturedForm}
                  featuredEditingId={featuredEditingId}
                  saveFeatured={saveFeatured}
                  handleCancelFeaturedEdit={handleCancelFeaturedEdit}
                  uploadMutation={uploadMutation}
                  featuredOffersQuery={featuredOffersQuery}
                  handleEditFeatured={handleEditFeatured}
                  featuredMutations={featuredMutations}
                />
              </div>
            )}
          </div>

          {/* Other Sections */}
          <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 overflow-hidden shadow-xl">
            <button
              onClick={() => setIsOtherSectionsOpen(!isOtherSectionsOpen)}
              className="w-full flex items-center justify-between p-3 hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <div className="bg-cyan-500/20 p-1.5 rounded-lg text-cyan-400">
                  <Layout size={18} weight="duotone" />
                </div>
                <h3 className="text-sm font-bold text-white">الأقسام الأخرى (نبذة، إحصائيات...)</h3>
              </div>
              {isOtherSectionsOpen ? <CaretUp size={18} className="text-slate-400" /> : <CaretDown size={18} className="text-slate-400" />}
            </button>

            {isOtherSectionsOpen && (
              <div className="p-3 border-t border-cyan-500/20 bg-slate-900/50 backdrop-blur-md">
                <HomeSectionsSection
                  SECTION_KEYS={SECTION_KEYS}
                  sectionForms={sectionForms}
                  setSectionForms={setSectionForms}
                  saveSection={saveSection}
                  uploadMutation={uploadMutation}
                  sectionMutations={sectionMutations}
                  sectionsMap={sectionsMap}
                  openSectionKey={openSectionKey}
                  onOpenSectionChange={setOpenSectionKey}
                />
              </div>
            )}
          </div>
        </motion.div>

        <HomeLivePreview
          heroForm={heroForm}
          heroEditingId={heroEditingId}
          featuredForm={featuredForm}
          featuredEditingId={featuredEditingId}
          sectionForms={sectionForms}
          activeSectionKey={activeSectionKey}
        />
      </div>
    </div>
  );
};

export default WebsiteHomePage;
