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
    <section className="relative mt-16 sm:mt-20 overflow-hidden" style={{ height: "clamp(240px, 60vw, 70vh)" }}>
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center transform scale-105"
        style={{ backgroundImage: `url(${bgImage})` }}
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

      {/* Content */}
      <div className="absolute inset-0 flex items-end">
        <div className="w-full px-4 sm:px-8 md:px-16 pb-8 sm:pb-14" dir="rtl">
          {project.status && (
            <div className="inline-block mb-3">
              <span className={`${statusColors[project.status] || 'bg-[#9d7857]'} text-white px-4 sm:px-6 py-1.5 rounded-full text-xs sm:text-sm font-semibold shadow-lg`}>
                {statusLabels[project.status] || project.status}
              </span>
            </div>
          )}

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white mb-3 drop-shadow-lg font-cairo leading-snug">
            {project.title}
          </h1>

          <div className="flex items-center gap-2 text-white/90 text-sm sm:text-lg font-cairo">
            <FaMapMarkerAlt className="text-[#9d7857] flex-shrink-0" />
            <span>{project.city || 'الرياض'}</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectHero;
