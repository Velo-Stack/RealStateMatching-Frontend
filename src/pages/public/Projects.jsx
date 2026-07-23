import { useState } from "react";
import PageBanner from "../../components/common/PageBanner";
import ProjectsFilters from "../../features/website/projects/ProjectsFilters";
import ProjectsGrid from "../../features/website/projects/ProjectsGrid";
import { usePublicProjectsQuery } from "../../features/website/projects/hooks/usePublicProjectsQuery";

const Projects = () => {
  const [filters, setFilters] = useState({});
  const { data: projects = [], isLoading } = usePublicProjectsQuery(filters);

  return (
    <div className="bg-white font-cairo">
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

      <section className="py-12 bg-white">
        <ProjectsFilters filters={filters} onChange={setFilters} />
        <ProjectsGrid projects={projects} isLoading={isLoading} />
      </section>
    </div>
  );
};

export default Projects;
