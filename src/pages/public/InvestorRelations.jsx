import { useEffect, useMemo, useState } from "react";
import PageBanner from "../../components/common/PageBanner";
import DiscoverSection from "../../components/common/DiscoverSection";
import PublicNavbar from "../../components/navigation/PublicNavbar";
import Footer from "../../features/website/home/sections/Footer";
import AboutSymbolSection from "../../features/website/Investors/AboutSymbolSection";
import StatsSection from "../../features/website/Investors/StatsSection";
import ChairmanMessageSection from "../../features/website/Investors/ChairmanMessageSection";
import EventsSection from "../../features/website/Investors/EventsSection";
import AnnouncementsSection from "../../features/website/Investors/AnnouncementsSection";
import AdvantagesSection from "../../features/website/Investors/AdvantagesSection";
import { useInvestorsQuery } from "../../features/website/Investors/hooks/useInvestorsQuery";
import { CircleNotch } from "phosphor-react";

const PREVIEW_SOURCE = "rwasihk-cms-preview";

// Merge a live "new item" CMS form on top of an existing list (stats / events /
// announcements / advantages). The in-progress item is prepended so it's visible
// immediately, before the CMS user clicks "إضافة".
const mergeListOverride = (baseList, form) => {
  if (!form) return baseList || [];
  const hasContent = Object.values(form).some(
    (v) => typeof v === "string" && v.trim()
  );
  if (!hasContent) return baseList || [];
  return [{ ...form, id: "__cms_preview_new__" }, ...(baseList || [])];
};

// Merge live CMS content forms (keyed by content key, e.g. about_symbol) on top
// of the fetched content map.
const mergeContentOverride = (baseContent, overrideMap) => {
  if (!overrideMap) return baseContent;
  const merged = { ...baseContent };
  for (const [key, form] of Object.entries(overrideMap)) {
    if (!form) continue;
    merged[key] = { ...merged[key], ...form };
  }
  return merged;
};

const InvestorRelations = () => {
  const { data, isLoading } = useInvestorsQuery();

  const isPreview = useMemo(() => {
    if (typeof window === "undefined") return false;
    return new URLSearchParams(window.location.search).get("cmsPreview") === "1";
  }, []);

  const [previewOverrides, setPreviewOverrides] = useState({
    content: null,
    stats: null,
    events: null,
    announcements: null,
    advantages: null,
  });

  // Tell the parent (CMS editor) that this preview iframe is mounted and ready
  // to receive data, then listen for live "update" and "scroll" messages.
  useEffect(() => {
    if (!isPreview) return undefined;

    const handleMessage = (event) => {
      const msg = event.data;
      if (!msg || msg.source !== PREVIEW_SOURCE) return;

      if (msg.type === "update") {
        setPreviewOverrides((prev) => ({ ...prev, ...msg.payload }));
        return;
      }

      if (msg.type === "scroll" && msg.anchor) {
        const el = document.getElementById(msg.anchor);
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

  const effectiveContent = useMemo(() => {
    const base = data?.content || {};
    return isPreview ? mergeContentOverride(base, previewOverrides.content) : base;
  }, [isPreview, data?.content, previewOverrides.content]);

  const effectiveStats = useMemo(() => {
    const base = data?.stats || [];
    return isPreview ? mergeListOverride(base, previewOverrides.stats) : base;
  }, [isPreview, data?.stats, previewOverrides.stats]);

  const effectiveEvents = useMemo(() => {
    const base = data?.events || [];
    return isPreview ? mergeListOverride(base, previewOverrides.events) : base;
  }, [isPreview, data?.events, previewOverrides.events]);

  const effectiveAnnouncements = useMemo(() => {
    const base = data?.announcements || [];
    return isPreview
      ? mergeListOverride(base, previewOverrides.announcements)
      : base;
  }, [isPreview, data?.announcements, previewOverrides.announcements]);

  const effectiveAdvantages = useMemo(() => {
    const base = data?.advantages || [];
    return isPreview ? mergeListOverride(base, previewOverrides.advantages) : base;
  }, [isPreview, data?.advantages, previewOverrides.advantages]);

  if (isLoading && !isPreview) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-white">
        <CircleNotch size={48} className="animate-spin text-[#9d7857]" />
      </div>
    );
  }

  return (
    <div className="bg-white font-cairo">
      <PublicNavbar />

      <PageBanner
        title="علاقات المستثمرين"
        description="نؤمن بالشفافية والنمو المستدام ونبني علاقات قوية مع مستثمرينا."
        image="images/bannar-5.png"
      />

      <div id="cms-investor-about">
        <AboutSymbolSection content={effectiveContent.about_symbol} />
      </div>

      <div id="cms-investor-stats">
        <StatsSection stats={effectiveStats} />
      </div>

      <div id="cms-investor-chairman">
        <ChairmanMessageSection content={effectiveContent.chairman_message} />
      </div>

      <DiscoverSection
        image="images/bg_1.jpg"
        smallTitle="تابع مستجداتنا"
        mainTitle="شركة رواسخ"
        description="اطلع على أخبارنا وآخر الإعلانات والفعاليات المتعلقة برواسخ العقارية"
        height="560px"
        mobileHeight="440px"
        topBleedColor="#efe9e0"
        bottomBleedColor="#f8f4ee"
      />

      <div id="cms-investor-events">
        <EventsSection events={effectiveEvents} />
      </div>

      <div id="cms-investor-announcements">
        <AnnouncementsSection announcements={effectiveAnnouncements} />
      </div>

      <div id="cms-investor-advantages">
        <AdvantagesSection advantages={effectiveAdvantages} />
      </div>

      <Footer />
    </div>
  );
};

export default InvestorRelations;
