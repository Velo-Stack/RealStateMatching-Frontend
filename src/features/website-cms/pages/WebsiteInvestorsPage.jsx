import { useCallback, useState } from "react";
import StickyActionBar from "../components/shared/StickyActionBar";
import InvestorsSection from "../components/sections/InvestorsSection";
import InvestorLivePreview from "../components/InvestorLivePreview";
import { motion } from "framer-motion";

// Maps each accordion key in InvestorsSection to the element id the public
// investors page exposes for that section, so the live preview can auto-scroll.
const SECTION_ANCHORS = {
  stats: "cms-investor-stats",
  about: "cms-investor-about",
  chairman: "cms-investor-chairman",
  events: "cms-investor-events",
  announcements: "cms-investor-announcements",
  advantages: "cms-investor-advantages",
};

const WebsiteInvestorsPage = () => {
  const [openKey, setOpenKey] = useState("about");
  const [previewPayload, setPreviewPayload] = useState({
    content: {},
    stats: null,
    events: null,
    announcements: null,
    advantages: null,
  });

  const toggleSection = (key) => setOpenKey((prev) => (prev === key ? null : key));

  const handleDraftChange = useCallback((key, draft) => {
    setPreviewPayload((prev) =>
      key === "content"
        ? { ...prev, content: { ...prev.content, ...draft } }
        : { ...prev, [key]: draft }
    );
  }, []);

  const activeAnchor = openKey ? SECTION_ANCHORS[openKey] : null;

  return (
    <div className="space-y-6 pb-12 font-cairo" dir="rtl">
      <StickyActionBar
        title="علاقات المستثمرين"
        subtitle="إدارة أقسام وبيانات صفحة علاقات المستثمرين العامة"
        isDirty={false}
        isSaving={false}
        saveLabel="التغييرات تُحفظ فورياً"
        onSave={() => {}}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <InvestorsSection
            openKey={openKey}
            onToggle={toggleSection}
            onDraftChange={handleDraftChange}
          />
        </motion.div>

        <InvestorLivePreview payload={previewPayload} anchor={activeAnchor} />
      </div>
    </div>
  );
};

export default WebsiteInvestorsPage;
