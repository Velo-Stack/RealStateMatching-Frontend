import PageBanner from "../../components/common/PageBanner";
import AboutIntro from "../../features/website/about/AboutIntro";
import AboutGoals from "../../features/website/about/AboutGoals";
import AboutVision from "../../features/website/about/AboutVision";
import AboutMission from "../../features/website/about/AboutMission";

const About = () => {
  return (
    <div className="bg-white font-cairo">
      <PageBanner
        title="من نحن"
        image="images/bannar-2.png"
        description={
          "اكتشف مجموعة متميزة من المشاريع العقارية المصممة بعناية لتلبي تطلعاتك وتوفر لك تجربة سكنية واستثمارية فريدة."
        }
      />

      <AboutIntro />
      <AboutGoals />
      <AboutVision />
      <AboutMission />
    </div>
  );
};

export default About;
