import { useParams, Link } from 'react-router-dom';
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
import { mockUnits } from '../../features/website/project-details/data/mockUnits';

const ProjectDetailsSkeleton = () => (
  <div className="animate-pulse space-y-16 font-cairo pb-24">
    {/* Hero Pulse */}
    <div className="h-[70vh] bg-gray-200 relative mt-20" />
    
    <div className="max-w-7xl mx-auto px-6 md:px-16 space-y-16">
      {/* Info Card Pulse */}
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4" />
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-3/4" />
        </div>
        <div className="bg-gray-100 h-64 rounded-3xl" />
      </div>

      {/* Gallery Pulse */}
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 rounded w-1/4" />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-gray-200 aspect-video rounded-2xl" />
          <div className="bg-gray-200 aspect-video rounded-2xl" />
          <div className="bg-gray-200 aspect-video rounded-2xl" />
        </div>
      </div>
    </div>
  </div>
);

const ProjectNotFound = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa] font-cairo" dir="rtl">
    <div className="text-center p-8 bg-white rounded-3xl border border-gray-100 shadow-sm max-w-md">
      <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">مشروع غير موجود</h2>
      <p className="text-gray-500 text-sm mb-6">عذراً، لم نتمكن من العثور على المشروع المطلوبة أو ربما تم تغييره.</p>
      <Link to="/projects" className="inline-block bg-[#9d7857] text-white px-8 py-3 rounded-full text-sm font-bold shadow-md hover:bg-[#856345] transition-colors">
        العودة للمشاريع
      </Link>
    </div>
  </div>
);

const ProjectDetails = () => {
  const { slug } = useParams();
  const { data: project, isLoading, isError } = usePublicProjectQuery(slug);

  // Handle form submission - ready for backend integration
  const handleInterestSubmit = (formData) => {
    console.log("Interest form submitted:", formData);
  };

  if (isLoading) return <ProjectDetailsSkeleton />;
  if (isError || !project) return <ProjectNotFound />;

  const displayUnits = project.unitsList?.length > 0 ? project.unitsList : mockUnits;

  return (
    <div className="bg-white font-cairo">
      {/* 1. Hero with cover image */}
      <ProjectHero project={project} />

      <section className="py-16 px-6 md:px-16 bg-[#f8f9fa]">
        <div className="max-w-7xl mx-auto space-y-16">

          {/* 2. Basic Info & Details */}
          <ProjectInfoCard project={project} />

          {/* 3. Image Gallery Lightbox */}
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

          {/* 5. Units Section & Filtering */}
          <UnitsSection units={displayUnits} />

          {/* 6. Direct Maps Embed */}
          {project.latitude && project.longitude && (
            <ProjectMapSection
              lat={project.latitude}
              lng={project.longitude}
              title={project.title}
              googleMapsUrl={project.googleMapsUrl}
            />
          )}

          {/* 7. Interest Register Form */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
            <InterestForm
              projectId={project.id}
              onSubmit={handleInterestSubmit}
            />
          </div>

        </div>
      </section>
    </div>
  );
};

export default ProjectDetails;
