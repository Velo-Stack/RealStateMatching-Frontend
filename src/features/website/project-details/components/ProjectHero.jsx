import { FaMapMarkerAlt } from "react-icons/fa";

const ProjectHero = ({ project, baseUrl }) => {
  return (
    <section className="relative mt-20 h-[70vh] overflow-hidden">
      {/* Background Image with Parallax */}
      <div
        className="absolute inset-0 bg-cover bg-center transform scale-105"
        style={{
          backgroundImage: `url(${baseUrl}${project.image})`,
        }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

      {/* Content */}
      <div className="absolute inset-0 flex items-end">
        <div className="w-full px-6 md:px-16 pb-16" dir="rtl">
          {/* Badge */}
          <div className="inline-block mb-4">
            <span className="bg-[#9d7857] text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
              للبيع على الخارطة
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
            {project.title}
          </h1>

          {/* Location */}
          <div className="flex items-center gap-2 text-white/90 text-lg">
            <FaMapMarkerAlt className="text-[#9d7857]" />
            <span>{project.location}</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectHero;
