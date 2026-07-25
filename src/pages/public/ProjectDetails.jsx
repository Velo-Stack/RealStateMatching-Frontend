import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { usePublicProjectQuery } from "../../features/website/project-details/hooks/usePublicProjectQuery";
import {
  ProjectBreadcrumb,
  ProjectInfoCard,
  ProjectGalleryLightbox,
  ProjectFeaturesServices,
  ProjectMapSection,
  InterestForm,
  UnitsSection,
} from "../../features/website/project-details/components";

const ProjectDetailsSkeleton = () => (
  <div className="animate-pulse space-y-10 bg-[#f8f9fa] pb-24 font-cairo">
    <div className="relative h-28 bg-[#ebe4db] sm:h-32" />
    <div className="mx-auto max-w-7xl space-y-8 px-4 md:px-16">
      <div className="grid h-72 grid-cols-4 gap-2 md:h-[420px]">
        <div className="col-span-2 row-span-2 rounded-xl bg-gray-200" />
        <div className="rounded-xl bg-gray-200" />
        <div className="rounded-xl bg-gray-200" />
        <div className="rounded-xl bg-gray-200" />
        <div className="rounded-xl bg-gray-200" />
      </div>
      <div className="grid gap-6 lg:grid-cols-5">
        <div className="h-80 rounded-2xl bg-gray-200 lg:col-span-3" />
        <div className="h-80 rounded-2xl bg-gray-200 lg:col-span-2" />
      </div>
    </div>
  </div>
);

const ProjectNotFound = () => (
  <div
    className="flex min-h-screen items-center justify-center bg-[#f8f9fa] font-cairo"
    dir="rtl"
  >
    <div className="mx-4 max-w-md rounded-3xl border border-gray-100 bg-white p-8 text-center shadow-sm">
      <h2 className="mb-2 text-2xl font-bold text-gray-800">مشروع غير موجود</h2>
      <p className="mb-6 text-sm text-gray-500">
        عذراً، لم نتمكن من العثور على المشروع المطلوب.
      </p>
      <Link
        to="/projects"
        className="inline-block rounded-full bg-[#9d7857] px-8 py-3 text-sm font-bold text-white shadow-md transition-colors hover:bg-[#856345]"
      >
        العودة للمشاريع
      </Link>
    </div>
  </div>
);

const ProjectDetails = () => {
  const { slug } = useParams();
  const { data: project, isLoading, isError } = usePublicProjectQuery(slug);
  const [selectedUnit, setSelectedUnit] = useState(null);

  const galleryImages = useMemo(() => {
    if (!project) return [];
    return [project.coverImageUrl, ...(project.galleryImages || [])].filter(
      Boolean
    );
  }, [project]);

  if (isLoading) return <ProjectDetailsSkeleton />;
  if (isError || !project) return <ProjectNotFound />;

  const units = project.projectUnits || [];
  const hasMap = Boolean(project.latitude && project.longitude);

  return (
    <div className="bg-white font-cairo">
      <ProjectBreadcrumb title={project.title} />

      <section className="bg-[#f8f9fa] px-4 py-8 sm:px-8 sm:py-10 md:px-16">
        <div className="mx-auto max-w-7xl space-y-10 md:space-y-12">
          {galleryImages.length > 0 && (
            <ProjectGalleryLightbox
              images={galleryImages}
              title={project.title}
            />
          )}

          {/* Details + Interest (wider) + sticky Map on the right */}
          <div className="flex flex-col gap-6 lg:flex-row" dir="ltr">
            <div className="min-w-0 flex-[1.7] space-y-5">
              <ProjectInfoCard project={project} />
              <ProjectFeaturesServices
                features={project.features}
                services={project.services}
              />

              {units.length > 0 && (
                <UnitsSection units={units} onUnitSelect={setSelectedUnit} />
              )}

              <InterestForm
                projectId={project.id}
                unitId={selectedUnit?.id}
                unitCode={selectedUnit?.code}
              />
            </div>

            {hasMap && (
              <div className="w-full shrink-0 lg:sticky lg:top-24 lg:w-[34%] lg:self-start">
                <ProjectMapSection
                  lat={project.latitude}
                  lng={project.longitude}
                  title={project.title}
                  googleMapsUrl={project.googleMapsUrl}
                  compact
                />
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProjectDetails;
