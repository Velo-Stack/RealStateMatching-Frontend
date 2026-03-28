import DiscoverSection from "../../components/common/DiscoverSection";
import FadeInSection from "../../components/common/FadeInSection";
import FeaturedProperties from "../../features/website/home/sections/FeaturedProperties";
import HeroSection from "../../features/website/home/sections/HeroSection";
import AboutSection from "../../features/website/home/sections/AboutSection";
import AboutVisionSection from "../../features/website/home/sections/AboutVisionSection";
import StatsSection from "../../features/website/home/sections/StatsSection";
import ContactMapSection from "../../features/website/home/sections/ContactMapSection";
import Footer from "../../features/website/home/sections/Footer";

const Home = () => {
  return (
    <div className="bg-white">
      <HeroSection />

      <FadeInSection direction="up">
        <FeaturedProperties />
      </FadeInSection>

      <DiscoverSection
        image={"images/cta.jpg"}
        mainTitle={"نعيد تعريف مفهوم السكن العصري"}
        smallTitle={"لأننا نؤمن أن كل منزل يجب أن يعكس شخصيتك ويمنحك الراحة التي تستحقها"}
        mobileHeight="460px"
        height="500px"
      />

      <FadeInSection direction="up" delay={0.1}>
        <AboutSection />
      </FadeInSection>

      <StatsSection />

      <FadeInSection direction="up" delay={0.1}>
        <AboutVisionSection />
      </FadeInSection>

      <FadeInSection direction="up" delay={0.1}>
        <ContactMapSection />
      </FadeInSection>

      <Footer />
    </div>
  );
};

export default Home;

