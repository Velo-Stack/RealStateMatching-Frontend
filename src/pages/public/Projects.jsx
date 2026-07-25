import { useState } from "react";
import PageBanner from "../../components/common/PageBanner";
import Footer from "../../features/website/home/sections/Footer";
import ProjectsFilters from "../../features/website/projects/ProjectsFilters";
import ProjectsGrid from "../../features/website/projects/ProjectsGrid";
import ProjectsToolbar from "../../features/website/projects/ProjectsToolbar";
import { usePublicProjectsQuery } from "../../features/website/projects/hooks/usePublicProjectsQuery";

const Projects = () => {
  const [filters, setFilters] = useState({});
  const [viewMode, setViewMode] = useState("list");
  const { data: projects = [], isLoading } = usePublicProjectsQuery(filters);

  return (
    <div className="bg-[#f7f8fa] font-cairo">
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

      <section className="px-4 py-8 sm:px-6 md:px-10 lg:px-16">
        <div className="mx-auto max-w-7xl space-y-5">
          <ProjectsToolbar
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            projectsCount={projects.length}
            isLoading={isLoading}
          />

          {/* dir=ltr keeps sidebar on the visual left; inner content stays RTL */}
          <div className="flex flex-col gap-6 lg:flex-row" dir="ltr">
            <div className="w-full shrink-0 lg:w-[320px] xl:w-[340px]">
              <div className="lg:sticky lg:top-24">
                <ProjectsFilters filters={filters} onChange={setFilters} />
              </div>
            </div>

            <div className="min-w-0 flex-1" dir="rtl">
              <ProjectsGrid
                projects={projects}
                isLoading={isLoading}
                viewMode={viewMode}
              />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Projects;
