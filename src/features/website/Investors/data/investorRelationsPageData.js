import { aboutSymbolSectionData } from "./aboutSymbolData";
import { investorAdvantagesSectionData } from "./advantagesData";
import { investorAnnouncementsSectionData } from "./announcementsData";
import { chairmanMessageSectionData } from "./chairmanMessageData";
import { investorEventsSectionData } from "./eventsData";
import { investorStatsSectionData } from "./statsData";

export const investorRelationsPageData = {
  banner: {
    title: "علاقات المستثمرين",
    description:
      "نؤمن بالشفافية والنمو المستدام ونبني علاقات قوية مع مستثمرينا.",
    image: "images/bannar-5.png",
  },
  sections: {
    aboutSymbol: aboutSymbolSectionData,
    stats: investorStatsSectionData,
    chairmanMessage: chairmanMessageSectionData,
    events: investorEventsSectionData,
    announcements: investorAnnouncementsSectionData,
    advantages: investorAdvantagesSectionData,
  },
};
