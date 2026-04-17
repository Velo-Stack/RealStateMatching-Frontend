import { useParams } from "react-router-dom";
import { projects } from "../../features/website/projects/projectsData";
import PublicNavbar from "../../components/navigation/PublicNavbar";
import Footer from "../../features/website/home/sections/Footer";
import {
  ProjectHero,
  ProjectDetailsSection,
  ProjectGallery,
  InterestForm,
  UnitsSection,
} from "../../features/website/project-details/components";
import { mockUnits } from "../../features/website/project-details/data/mockUnits";

const ProjectDetails = () => {
  const { id } = useParams();
  const base = import.meta.env.BASE_URL || "/";

  const project = projects.find((p) => p.id === Number(id));

  // Handle form submission - ready for backend integration
  const handleInterestSubmit = (formData) => {
    console.log("Interest form submitted:", formData);
    // TODO: Send to backend API
    // Example: await api.submitInterest(formData);
  };

  // Handle units filter - ready for backend integration
  const handleUnitsFilter = (filters) => {
    console.log("Units filter changed:", filters);
    // TODO: Fetch filtered units from backend
    // Example: await api.getUnits(projectId, filters);
  };

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa]">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">مشروع غير موجود</h2>
          <a href="/projects" className="text-[#9d7857] hover:underline">
            العودة للمشاريع
          </a>
        </div>
      </div>
    );
  }

  // Mock project details - replace with API data
  const projectDetails = {
    buildings: 1,
    units: 12,
    totalArea: "1815.56",
    completionRate: "80%",
  };

  // Mock gallery images - replace with API data
  const galleryImages = [project.image, project.image, project.image];

  return (
    <div className="bg-white font-cairo">
      <PublicNavbar />

      <ProjectHero project={project} baseUrl={base} />

      <section className="py-20 px-6 md:px-16 bg-[#f8f9fa]">
        <div className="max-w-7xl mx-auto">
          
          <ProjectDetailsSection
            projectDetails={projectDetails}
            projectImage={project.image}
            baseUrl={base}
          />

          <ProjectGallery images={galleryImages} baseUrl={base} />

          <InterestForm
            projectId={project.id}
            onSubmit={handleInterestSubmit}
          />

          <UnitsSection
            units={mockUnits}
            onFilterChange={handleUnitsFilter}
          />

        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ProjectDetails;
