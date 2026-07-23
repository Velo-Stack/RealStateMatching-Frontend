import { FaMapMarkerAlt } from "react-icons/fa";
import { resolveUploadUrl } from "../../../../utils/uploads";

const statusColors = {
  ACTIVE: 'bg-emerald-500',
  SOLD_OUT: 'bg-rose-500',
  COMING_SOON: 'bg-amber-500',
  COMPLETED: 'bg-slate-500',
};

const statusLabels = {
  ACTIVE: 'متاح',
  SOLD_OUT: 'مباع بالكامل',
  COMING_SOON: 'قريباً',
  COMPLETED: 'مكتمل',
};

const ProjectHero = ({ project }) => {
  const base = import.meta.env.BASE_URL || "/";
  const bgImage = project.coverImageUrl 
    ? resolveUploadUrl(project.coverImageUrl) 
    : `${base}images/placeholder-project.jpg`;

  return (
    <section className="relative mt-20 h-[70vh] overflow-hidden">
      {/* Background Image with Parallax */}
      <div
        className="absolute inset-0 bg-cover bg-center transform scale-105"
        style={{
          backgroundImage: `url(${bgImage})`,
        }}
        onError={(e) => {
          e.target.style.backgroundImage = `url(${base}images/placeholder-project.jpg)`;
        }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

      {/* Content */}
      <div className="absolute inset-0 flex items-end">
        <div className="w-full px-6 md:px-16 pb-16" dir="rtl">
          {/* Status Badge */}
          {project.status && (
            <div className="inline-block mb-4">
              <span className={`${statusColors[project.status] || 'bg-[#9d7857]'} text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg`}>
                {statusLabels[project.status] || project.status}
              </span>
            </div>
          )}

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg font-cairo">
            {project.title}
          </h1>

          {/* Location */}
          <div className="flex items-center gap-2 text-white/90 text-lg font-cairo">
            <FaMapMarkerAlt className="text-[#9d7857]" />
            <span>{project.city || 'الرياض'}</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectHero;
