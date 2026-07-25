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

const InvestorRelations = () => {
  const { data, isLoading } = useInvestorsQuery();

  if (isLoading) {
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

      <AboutSymbolSection content={data?.content?.about_symbol} />

      <StatsSection stats={data?.stats || []} />

      <ChairmanMessageSection content={data?.content?.chairman_message} />

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

      <EventsSection events={data?.events || []} />

      <AnnouncementsSection announcements={data?.announcements || []} />

      <AdvantagesSection advantages={data?.advantages || []} />

      <Footer />
    </div>
  );
};

export default InvestorRelations;
