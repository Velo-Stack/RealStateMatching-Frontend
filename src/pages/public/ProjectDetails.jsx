import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { usePublicProjectQuery } from '../../features/website/project-details/hooks/usePublicProjectQuery';
import {
  ProjectHero,
  ProjectInfoCard,
  ProjectGalleryLightbox,
  ProjectFeaturesServices,
  ProjectMapSection,
  InterestForm,
  UnitsSection
} from '../../features/website/project-details/components';

/* ─── Skeleton ──────────────────────────────────────────────────────────────── */
const ProjectDetailsSkeleton = () => (
  <div className="animate-pulse space-y-12 font-cairo pb-24 bg-[#f8f9fa]">
    <div className="h-[60vh] sm:h-[70vh] bg-gray-200 relative mt-20" />
    <div className="max-w-7xl mx-auto px-4 md:px-16 space-y-10">
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3" />
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-3/4" />
        </div>
        <div className="bg-gray-200 h-56 rounded-3xl" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-gray-200 aspect-video rounded-2xl" />
        ))}
      </div>
    </div>
  </div>
);

/* ─── Not Found ─────────────────────────────────────────────────────────────── */
const ProjectNotFound = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa] font-cairo" dir="rtl">
    <div className="text-center p-8 bg-white rounded-3xl border border-gray-100 shadow-sm max-w-md mx-4">
      <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
          d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">مشروع غير موجود</h2>
      <p className="text-gray-500 text-sm mb-6">عذراً، لم نتمكن من العثور على المشروع المطلوب.</p>
      <Link to="/projects"
        className="inline-block bg-[#9d7857] text-white px-8 py-3 rounded-full text-sm font-bold shadow-md hover:bg-[#856345] transition-colors">
        العودة للمشاريع
      </Link>
    </div>
  </div>
);

/* ─── Main Page ─────────────────────────────────────────────────────────────── */
const ProjectDetails = () => {
  const { slug } = useParams();
  const { data: project, isLoading, isError } = usePublicProjectQuery(slug);
  const [selectedUnit, setSelectedUnit] = useState(null);

  if (isLoading) return <ProjectDetailsSkeleton />;
  if (isError || !project) return <ProjectNotFound />;

  const units = project.projectUnits || [];

  return (
    <div className="bg-white font-cairo">
      {/* 1. Hero */}
      <ProjectHero project={project} />

      <section className="py-12 px-4 sm:px-8 md:px-16 bg-[#f8f9fa]">
        <div className="max-w-7xl mx-auto space-y-12">

          {/* 2. Info Card */}
          <ProjectInfoCard project={project} />

          {/* 3. Image Gallery */}
          {project.galleryImages?.length > 0 && (
            <ProjectGalleryLightbox images={project.galleryImages} />
          )}

          {/* 4. Features & Services */}
          {((project.features?.length > 0) || (project.services?.length > 0)) && (
            <ProjectFeaturesServices
              features={project.features}
              services={project.services}
            />
          )}

          {/* 5. Units Section */}
          {units.length > 0 && (
            <UnitsSection
              units={units}
              onUnitSelect={setSelectedUnit}
            />
          )}

          {/* 6. Map */}
          {project.latitude && project.longitude && (
            <ProjectMapSection
              lat={project.latitude}
              lng={project.longitude}
              title={project.title}
              googleMapsUrl={project.googleMapsUrl}
            />
          )}

          {/* 7. Interest Form */}
          <div id="interest-form-section" className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-10">
            <InterestForm
              projectId={project.id}
              unitId={selectedUnit?.id}
              unitCode={selectedUnit?.code}
            />
          </div>

        </div>
      </section>
    </div>
  );
};

export default ProjectDetails;
