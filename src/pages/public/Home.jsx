import DiscoverSection from "../../components/common/DiscoverSection";
import FadeInSection from "../../components/common/FadeInSection";
import AboutSection from "../../features/website/home/sections/AboutSection";
import AboutVisionSection from "../../features/website/home/sections/AboutVisionSection";
import ContactMapSection from "../../features/website/home/sections/ContactMapSection";
import FeaturedProperties from "../../features/website/home/sections/FeaturedProperties";
import Footer from "../../features/website/home/sections/Footer";
import HeroSection from "../../features/website/home/sections/HeroSection";
import StatsSection from "../../features/website/home/sections/StatsSection";
import { useWebsiteHomeQuery } from "../../features/website/home/hooks/useWebsiteHomeQuery";

const Home = () => {
  const { data } = useWebsiteHomeQuery();
  const settings = data?.settings || {};
  const sections = data?.sections || {};
  const heroSlides = data?.heroSlides || [];
  const featuredOffers = data?.featuredOffers || [];

  return (
    <div className="bg-white">
      <HeroSection slides={heroSlides} settings={settings} />

      <FadeInSection direction="up">
        <FeaturedProperties items={featuredOffers} />
      </FadeInSection>

      <DiscoverSection
        image={sections.home_discover?.imageUrl || "images/cta.jpg"}
        mainTitle={
          sections.home_discover?.title || "نعيد تعريف مفهوم السكن العصري"
        }
        smallTitle={
          sections.home_discover?.subtitle ||
          "لأننا نؤمن أن كل منزل يجب أن يعكس شخصيتك ويمنحك الراحة التي تستحقها"
        }
        mobileHeight="460px"
        height="500px"
      />

      <FadeInSection direction="up" delay={0.1}>
        <AboutSection content={sections.home_about} />
      </FadeInSection>

      <StatsSection content={sections.home_stats} />

      <FadeInSection direction="up" delay={0.1}>
        <AboutVisionSection content={sections.home_vision} />
      </FadeInSection>

      <FadeInSection direction="up" delay={0.1}>
        <ContactMapSection content={sections.home_contact} settings={settings} />
      </FadeInSection>

      <Footer settings={settings} featuredOffers={featuredOffers} />
    </div>
  );
};

export default Home;
