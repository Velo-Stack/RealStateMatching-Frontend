import { FaMapMarkerAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import { resolveUploadUrl } from "../../../utils/uploads";

const statusColors = {
  ACTIVE: 'bg-emerald-500 text-white',
  SOLD_OUT: 'bg-rose-500 text-white',
  COMING_SOON: 'bg-amber-500 text-white',
  COMPLETED: 'bg-slate-500 text-white',
};

const statusLabels = {
  ACTIVE: 'متاح',
  SOLD_OUT: 'مباع بالكامل',
  COMING_SOON: 'قريباً',
  COMPLETED: 'مكتمل',
};

const typeLabels = {
  RESIDENTIAL: 'سكني',
  COMMERCIAL: 'تجاري',
  MIXED_USE: 'متعدد الاستخدامات',
  LAND: 'أراضي',
};

const ProjectCard = ({ project }) => {
  const base = import.meta.env.BASE_URL || "/";
  
  // Format Area
  let areaText = '';
  if (project.areaFrom && project.areaTo) {
    areaText = `${project.areaFrom} - ${project.areaTo} م²`;
  } else if (project.areaFrom || project.areaTo) {
    areaText = `${project.areaFrom || project.areaTo} م²`;
  }

  // Format Price
  let priceText = '';
  if (project.priceFrom) {
    priceText = `تبدأ من ${Number(project.priceFrom).toLocaleString('ar-SA')} ﷼`;
  }

  return (
    <div className="group relative font-cairo">
      {/* IMAGE */}
      <div className="relative h-[320px] overflow-hidden rounded-[28px] shadow-md">
        <img
          src={project.coverImageUrl ? resolveUploadUrl(project.coverImageUrl) : `${base}images/placeholder-project.jpg`}
          alt={project.title}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
          loading="lazy"
          onError={(e) => {
            e.target.src = `${base}images/placeholder-project.jpg`;
          }}
        />
        <div className="absolute inset-0 bg-black/40 transition duration-500 group-hover:bg-black/10" />
        
        {/* Status Badge */}
        {project.status && (
          <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold ${statusColors[project.status] || 'bg-[#9d7857]'}`}>
            {statusLabels[project.status] || project.status}
          </div>
        )}

        {/* Project Type Badge */}
        {project.type && (
          <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/50 text-white text-xs font-medium backdrop-blur-sm">
            {typeLabels[project.type] || project.type}
          </div>
        )}
      </div>

      {/* Floating Card */}
      <div className="absolute -bottom-16 left-1/2 w-[90%] -translate-x-1/2 
        rounded-[26px] bg-[#f8f9fa] p-5 text-center shadow-[0_20px_50px_rgba(0,0,0,0.15)] 
        transition-all duration-500 group-hover:-translate-y-2 border border-gray-100">
        
        <h3 className="text-base font-bold text-[#1f1f1f] line-clamp-1">{project.title}</h3>
        
        <div className="mt-1.5 flex items-center justify-center gap-1.5 text-gray-500 text-xs">
          <FaMapMarkerAlt className="text-[#9d7857]" />
          <span>{project.city || 'الرياض'}</span>
        </div>
        
        <div className="mt-2 flex items-center justify-center gap-4 text-xs text-gray-400">
          {areaText && <span>{areaText}</span>}
          {priceText && <span className="text-[#9d7857] font-semibold">{priceText}</span>}
        </div>

        <div className="max-h-0 overflow-hidden opacity-0 transition-all duration-500 
          group-hover:max-h-20 group-hover:opacity-100 mt-3">
          <Link
            to={`/projects/${project.slug}`}
            className="inline-block bg-[#9d7857] text-white px-6 py-2 rounded-full text-xs font-bold hover:bg-[#856345] transition-colors"
          >
            اقرأ المزيد
          </Link>
        </div>
      </div>
    </div>
  );
};

const SkeletonCard = () => (
  <div className="animate-pulse flex flex-col space-y-4">
    <div className="bg-gray-200 h-[320px] rounded-[28px]" />
    <div className="bg-gray-200 h-6 w-3/4 mx-auto rounded" />
    <div className="bg-gray-200 h-4 w-1/2 mx-auto rounded" />
  </div>
);

const ProjectsGrid = ({ projects = [], isLoading }) => {
  if (isLoading) {
    return (
      <section className="py-24 px-6 md:px-16 bg-white">
        <div className="grid gap-20 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </section>
    );
  }

  if (projects.length === 0) {
    return (
      <section className="py-24 px-6 md:px-16 bg-white text-center font-cairo">
        <div className="max-w-md mx-auto py-12 flex flex-col items-center">
          <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-7h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <h3 className="text-lg font-bold text-gray-700 mb-2">لا توجد مشاريع</h3>
          <p className="text-gray-500 text-sm">عذراً، لم نتمكن من العثور على أي مشاريع تطابق الفلاتر المحددة حالياً.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 px-6 md:px-16 bg-white pb-36">
      <div className="grid gap-20 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
};

export default ProjectsGrid;