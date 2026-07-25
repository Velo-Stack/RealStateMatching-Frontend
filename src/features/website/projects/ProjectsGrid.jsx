import {
  MapPin,
  Maximize2,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { resolveUploadUrl } from "../../../utils/uploads";

const statusLabels = {
  ACTIVE: "متاح",
  SOLD_OUT: "مباع بالكامل",
  COMING_SOON: "قريباً",
  COMPLETED: "مكتمل",
};

const typeLabels = {
  RESIDENTIAL: "سكني",
  COMMERCIAL: "تجاري",
  MIXED_USE: "متعدد الاستخدامات",
  LAND: "أراضي",
};

const formatArea = (project) => {
  if (project.areaFrom && project.areaTo) {
    return `${Number(project.areaFrom).toLocaleString("ar-SA")} - ${Number(project.areaTo).toLocaleString("ar-SA")} م²`;
  }
  if (project.areaFrom || project.areaTo) {
    return `${Number(project.areaFrom || project.areaTo).toLocaleString("ar-SA")} م²`;
  }
  return null;
};

const formatPrice = (project) => {
  if (project.priceFrom) {
    return `${Number(project.priceFrom).toLocaleString("ar-SA")} ﷼`;
  }
  if (project.priceTo) {
    return `${Number(project.priceTo).toLocaleString("ar-SA")} ﷼`;
  }
  return null;
};

const formatDate = (value) => {
  if (!value) return null;
  try {
    return new Date(value).toLocaleDateString("ar-SA", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return null;
  }
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.04,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.035,
      staggerDirection: -1,
      when: "afterChildren",
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 28,
    scale: 0.94,
    filter: "blur(6px)",
  },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      type: "spring",
      stiffness: 340,
      damping: 26,
      mass: 0.85,
    },
  },
  exit: {
    opacity: 0,
    y: -16,
    scale: 0.96,
    filter: "blur(4px)",
    transition: {
      duration: 0.22,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

const ProjectCard = ({ project, viewMode }) => {
  const base = import.meta.env.BASE_URL || "/";
  const imageSrc = project.coverImageUrl
    ? resolveUploadUrl(project.coverImageUrl)
    : `${base}images/placeholder-project.jpg`;
  const areaText = formatArea(project);
  const priceText = formatPrice(project);
  const addedDate = formatDate(project.createdAt || project.publishedAt);
  const statusText = statusLabels[project.status] || project.status;
  const typeText = typeLabels[project.type] || project.type;
  const isList = viewMode === "list";
  const locationText =
    [project.district, project.city].filter(Boolean).join("، ") ||
    project.city ||
    "المملكة العربية السعودية";

  return (
    <motion.article
      layout
      variants={itemVariants}
      className={`group overflow-hidden rounded-xl border border-gray-100 bg-white font-cairo shadow-[0_10px_30px_rgba(0,0,0,0.08)] transition-[box-shadow] duration-300 hover:shadow-[0_16px_40px_rgba(0,0,0,0.12)] ${
        isList ? "flex flex-col sm:flex-row" : "flex flex-col"
      }`}
    >
      <Link
        to={`/projects/${project.slug}`}
        className={`relative block overflow-hidden bg-gray-100 ${
          isList
            ? "h-52 w-full shrink-0 sm:h-auto sm:min-h-[220px] sm:w-[42%] lg:w-[36%]"
            : "h-56 w-full"
        }`}
      >
        <motion.img
          layout
          src={imageSrc}
          alt={project.title}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
          loading="lazy"
          onError={(e) => {
            e.target.src = `${base}images/placeholder-project.jpg`;
          }}
        />

        {!isList && (
          <div className="absolute inset-x-3 top-3 flex flex-wrap gap-1.5">
            {project.isFeatured && (
              <span className="rounded-md bg-rose-500 px-2.5 py-1 text-[11px] font-bold text-white">
                مميز
              </span>
            )}
            {typeText && (
              <span className="rounded-md bg-[#9d7857] px-2.5 py-1 text-[11px] font-bold text-white">
                {typeText}
              </span>
            )}
          </div>
        )}

        {priceText && (
          <div className={`absolute bottom-3 ${isList ? "left-3" : "right-3"}`}>
            <span
              className={`inline-block rounded-md px-3 py-1.5 text-sm font-bold shadow-md ${
                isList ? "bg-white text-[#9d7857]" : "bg-[#9d7857] text-white"
              }`}
            >
              {priceText}
            </span>
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <Link
            to={`/projects/${project.slug}`}
            className="text-lg font-bold leading-snug text-gray-900 transition-colors hover:text-[#9d7857] sm:text-xl"
          >
            {project.title}
          </Link>

          {isList && (
            <div className="flex shrink-0 flex-wrap justify-end gap-1.5">
              {project.isFeatured && (
                <span className="rounded-md bg-rose-500 px-2.5 py-1 text-[11px] font-bold text-white">
                  مميز
                </span>
              )}
              {typeText && (
                <span className="rounded-md bg-[#9d7857] px-2.5 py-1 text-[11px] font-bold text-white">
                  {typeText}
                </span>
              )}
            </div>
          )}
        </div>

        <div className="mt-2.5 flex items-center gap-1.5 text-sm text-gray-500">
          <MapPin className="h-4 w-4 shrink-0 text-[#9d7857]" strokeWidth={2} />
          <span className="line-clamp-1">{locationText}</span>
        </div>

        {addedDate && (
          <p className="mt-2 text-xs text-gray-400">أُضيف: {addedDate}</p>
        )}

        {project.description && (
          <p className={`mt-3 text-sm leading-relaxed text-gray-500 ${isList ? "line-clamp-3" : "line-clamp-2"}`}>
            {project.description}
          </p>
        )}

        {areaText && (
          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-500">
            <span className="inline-flex items-center gap-1.5">
              <Maximize2 className="h-4 w-4 text-[#9d7857]/80" strokeWidth={1.8} />
              {areaText}
            </span>
          </div>
        )}

        {statusText && (
          <div className="mt-auto border-t border-gray-100 pt-4 mt-5">
            <span className="text-sm font-bold text-[#9d7857]">{statusText}</span>
          </div>
        )}
      </div>
    </motion.article>
  );
};

const SkeletonCard = ({ viewMode }) => {
  if (viewMode === "list") {
    return (
      <div className="animate-pulse overflow-hidden rounded-xl border border-gray-100 bg-white sm:flex">
        <div className="h-52 bg-gray-200 sm:h-56 sm:w-[42%]" />
        <div className="flex-1 space-y-3 p-6">
          <div className="h-6 w-2/3 rounded bg-gray-200" />
          <div className="h-4 w-1/2 rounded bg-gray-200" />
          <div className="h-4 w-1/3 rounded bg-gray-200" />
          <div className="mt-8 h-px bg-gray-100" />
          <div className="h-4 w-1/4 rounded bg-gray-200" />
        </div>
      </div>
    );
  }

  return (
    <div className="animate-pulse overflow-hidden rounded-xl border border-gray-100 bg-white">
      <div className="h-56 bg-gray-200" />
      <div className="space-y-3 p-6">
        <div className="h-6 w-3/4 rounded bg-gray-200" />
        <div className="h-4 w-1/2 rounded bg-gray-200" />
        <div className="h-4 w-1/3 rounded bg-gray-200" />
      </div>
    </div>
  );
};

const ProjectsGrid = ({ projects = [], isLoading, viewMode = "list" }) => {
  if (isLoading) {
    return (
      <div
        className={
          viewMode === "list"
            ? "flex flex-col gap-5"
            : "grid gap-5 sm:grid-cols-2 xl:grid-cols-2"
        }
      >
        {[...Array(4)].map((_, i) => (
          <SkeletonCard key={i} viewMode={viewMode} />
        ))}
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="rounded-xl border border-gray-100 bg-white px-6 py-16 text-center shadow-sm font-cairo">
        <h3 className="mb-2 text-lg font-bold text-gray-700">لا توجد مشاريع</h3>
        <p className="text-sm text-gray-500">
          عذراً، لم نتمكن من العثور على أي مشاريع تطابق الفلاتر المحددة حالياً.
        </p>
      </div>
    );
  }

  return (
    <div className="relative min-h-[200px]">
      <AnimatePresence mode="wait">
        <motion.div
          key={viewMode}
          variants={containerVariants}
          initial="hidden"
          animate="show"
          exit="exit"
          className={
            viewMode === "list"
              ? "flex flex-col gap-5"
              : "grid gap-5 sm:grid-cols-2"
          }
        >
          {projects.map((project) => (
            <ProjectCard
              key={`${viewMode}-${project.id}`}
              project={project}
              viewMode={viewMode}
            />
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default ProjectsGrid;
