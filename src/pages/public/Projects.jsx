import PublicNavbar from "../../components/navigation/PublicNavbar";
import PageBanner from "../../components/common/PageBanner";
import ProjectsGrid from "../../features/website/projects/ProjectsGrid";
import Footer from "../../features/website/home/sections/Footer";

const Projects = () => {
  return (
    <div className="bg-white font-cairo">
      <PublicNavbar />

      <PageBanner
        title="المشاريع"
        eyebrow="فرص عقارية مختارة"
        description="استعرض مجموعة من المشاريع والعقارات المميزة في مواقع استراتيجية، مع تفاصيل واضحة تساعدك تختار الخيار الأنسب بسرعة وثقة."
        breadcrumbs={[
          { label: "الرئيسية", to: "/" },
          { label: "المشاريع", to: "/projects", current: true },
        ]}
        image="images/bannar-1.png"
      />

      <ProjectsGrid />

      <Footer />
    </div>
  );
};

export default Projects;
