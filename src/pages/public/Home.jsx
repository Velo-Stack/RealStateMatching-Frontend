import { useEffect, useMemo, useState } from "react";
import DiscoverSection from "../../components/common/DiscoverSection";
import FadeInSection from "../../components/common/FadeInSection";
import AboutSection from "../../features/website/home/sections/AboutSection";
import AboutVisionSection from "../../features/website/home/sections/AboutVisionSection";
import ContactMapSection from "../../features/website/home/sections/ContactMapSection";
import FeaturedProperties from "../../features/website/home/sections/FeaturedProperties";
import Footer from "../../features/website/home/sections/Footer";
import HeroSection from "../../features/website/home/sections/HeroSection";
import { useWebsiteHomeQuery } from "../../features/website/home/hooks/useWebsiteHomeQuery";

const PREVIEW_SOURCE = "rwasihk-cms-preview";

// Merge a live CMS-editing form into an existing array of items (hero slides / featured offers).
// - If the form is currently editing an existing item, that item is patched in-place.
// - If the form is creating a new item, it's appended as a temporary preview-only item.
const mergeListOverride = (baseList, override) => {
  if (!override) return baseList;
  const { editingId, form } = override;
  if (!form) return baseList;

  if (editingId) {
    return baseList.map((item) =>
      item.id === editingId ? { ...item, ...form } : item
    );
  }

  const hasContent = Boolean(form.title?.trim() || form.imageUrl);
  if (!hasContent) return baseList;

  // Prepended (not appended) so the item being typed shows up immediately,
  // since both the hero and featured carousels start at index 0.
  return [{ ...form, id: "__cms_preview_new__", isActive: true }, ...baseList];
};

// Merge live CMS section forms (keyed by sectionKey) into the sections map from the API.
const mergeSectionsOverride = (baseSections, overrideMap) => {
  if (!overrideMap) return baseSections;
  const merged = { ...baseSections };

  for (const [key, form] of Object.entries(overrideMap)) {
    if (!form) continue;
    let content = merged[key]?.content ?? null;
    if (typeof form.content === "string") {
      if (form.content.trim() === "") {
        content = null;
      } else {
        try {
          content = JSON.parse(form.content);
        } catch {
          // keep last valid content while the JSON is being typed
        }
      }
    }
    merged[key] = { ...merged[key], ...form, content };
  }

  return merged;
};

const Home = () => {
  const { data } = useWebsiteHomeQuery();
  const settings = data?.settings || {};

  const isPreview = useMemo(() => {
    if (typeof window === "undefined") return false;
    return new URLSearchParams(window.location.search).get("cmsPreview") === "1";
  }, []);

  const [previewOverrides, setPreviewOverrides] = useState({
    hero: null,
    featured: null,
    sections: null,
  });

  // Tell the parent (CMS editor) that this preview iframe is mounted and ready to receive data,
  // then listen for live "update" (typing) and "scroll" (open a specific section) messages.
  useEffect(() => {
    if (!isPreview) return undefined;

    const handleMessage = (event) => {
      const msg = event.data;
      if (!msg || msg.source !== PREVIEW_SOURCE) return;

      if (msg.type === "update") {
        setPreviewOverrides((prev) => ({ ...prev, ...msg.payload }));
        return;
      }

      if (msg.type === "scroll" && msg.sectionKey) {
        const el = document.getElementById(`cms-section-${msg.sectionKey}`);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };

    window.addEventListener("message", handleMessage);
    try {
      window.parent?.postMessage({ source: PREVIEW_SOURCE, type: "ready" }, "*");
    } catch {
      // ignore
    }

    return () => window.removeEventListener("message", handleMessage);
  }, [isPreview]);

  const effectiveHeroSlides = useMemo(() => {
    const base = data?.heroSlides || [];
    return isPreview ? mergeListOverride(base, previewOverrides.hero) : base;
  }, [isPreview, data?.heroSlides, previewOverrides.hero]);

  const effectiveFeaturedOffers = useMemo(() => {
    const base = data?.featuredOffers || [];
    return isPreview ? mergeListOverride(base, previewOverrides.featured) : base;
  }, [isPreview, data?.featuredOffers, previewOverrides.featured]);

  const effectiveSections = useMemo(() => {
    const base = data?.sections || {};
    return isPreview ? mergeSectionsOverride(base, previewOverrides.sections) : base;
  }, [isPreview, data?.sections, previewOverrides.sections]);

  return (
    <div className="bg-white">
      <div id="cms-section-hero">
        <HeroSection slides={effectiveHeroSlides} settings={settings} />
      </div>

      <div id="cms-section-featured">
        <FadeInSection direction="up">
          <FeaturedProperties items={effectiveFeaturedOffers} />
        </FadeInSection>
      </div>

      <div id="cms-section-home_discover">
        <DiscoverSection
          image="images/cta-bg.jpg"
          smallTitle={
            effectiveSections.home_discover?.title ||
            "نعيد تعريف مفهوم السكن العصري"
          }
          mainTitle="رواسخ العقارية"
          description={
            effectiveSections.home_discover?.subtitle ||
            "لأننا نؤمن أن كل منزل يجب أن يعكس شخصيتك ويمنحك الراحة التي تستحقها"
          }
          mobileHeight="520px"
          height="640px"
          topBleedColor="#f7f7f7"
          bottomBleedColor="#ffffff"
        />
      </div>

      <div id="cms-section-home_about">
        <AboutSection
          content={effectiveSections.home_about}
          statsContent={effectiveSections.home_stats}
        />
      </div>

      <FadeInSection id="cms-section-home_vision" direction="up" delay={0.1}>
        <AboutVisionSection content={effectiveSections.home_vision} />
      </FadeInSection>

      <FadeInSection id="cms-section-home_contact" direction="up" delay={0.1}>
        <ContactMapSection
          content={effectiveSections.home_contact}
          settings={settings}
        />
      </FadeInSection>

      <Footer settings={settings} />
    </div>
  );
};

export default Home;
