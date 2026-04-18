import PageBanner from "../../components/common/PageBanner";
import PublicNavbar from "../../components/navigation/PublicNavbar";
import Footer from "../../features/website/home/sections/Footer";
import AboutSymbolSection from "../../features/website/Investors/AboutSymbolSection";
import StatsSection from "../../features/website/Investors/StatsSection";
import ChairmanMessageSection from "../../features/website/Investors/ChairmanMessageSection";
import EventsSection from "../../features/website/Investors/EventsSection";
import AnnouncementsSection from "../../features/website/Investors/AnnouncementsSection";
import AdvantagesSection from "../../features/website/Investors/AdvantagesSection";
import { investorRelationsPageData } from "../../features/website/Investors/data/investorRelationsPageData";

const InvestorRelations = () => {
  const { banner, sections } = investorRelationsPageData;

  return (
    <div className="bg-white font-cairo">
      <PublicNavbar />

      <PageBanner {...banner} />

      <AboutSymbolSection content={sections.aboutSymbol} />

      <StatsSection content={sections.stats} />

      <ChairmanMessageSection content={sections.chairmanMessage} />

      <EventsSection content={sections.events} />

      <AnnouncementsSection content={sections.announcements} />

      <AdvantagesSection content={sections.advantages} />

      <Footer />
    </div>
  );
};

export default InvestorRelations;
