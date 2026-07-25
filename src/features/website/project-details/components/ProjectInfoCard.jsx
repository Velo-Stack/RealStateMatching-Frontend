import {
  Building2,
  CalendarDays,
  FileBadge2,
  Home,
  MapPin,
  Maximize2,
  Tag,
} from "lucide-react";

const typeLabels = {
  RESIDENTIAL: "سكني",
  COMMERCIAL: "تجاري",
  MIXED_USE: "متعدد الاستخدامات",
  LAND: "أراضي",
};

const statusLabels = {
  ACTIVE: "متاح",
  SOLD_OUT: "مباع بالكامل",
  COMING_SOON: "قريباً",
  COMPLETED: "مكتمل",
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
  if (project.priceFrom && project.priceTo) {
    return `${Number(project.priceFrom).toLocaleString("ar-SA")} - ${Number(project.priceTo).toLocaleString("ar-SA")} ﷼`;
  }
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
    });
  } catch {
    return null;
  }
};

const StatItem = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-3">
    <span className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#9d7857]/10 text-[#9d7857]">
      <Icon className="h-5 w-5" strokeWidth={1.8} />
    </span>
    <div className="min-w-0">
      <p className="text-sm font-bold text-gray-900">{label}</p>
      <p className="mt-0.5 text-sm text-gray-500">{value}</p>
    </div>
  </div>
);

const ProjectInfoCard = ({ project }) => {
  const typeText = typeLabels[project.type] || project.type;
  const statusText = statusLabels[project.status] || project.status;
  const areaValue = formatArea(project);
  const priceValue = formatPrice(project);
  const completionText = formatDate(project.completionDate);
  const addedText = formatDate(project.createdAt);
  const locationText =
    [project.address, project.city].filter(Boolean).join("، ") ||
    project.city ||
    null;

  const stats = [
    typeText && { icon: Building2, label: "نوع المشروع", value: typeText },
    statusText && { icon: Tag, label: "الحالة", value: statusText },
    areaValue && { icon: Maximize2, label: "المساحة", value: areaValue },
    project.totalUnits && {
      icon: Home,
      label: "عدد الوحدات",
      value: String(project.totalUnits),
    },
    completionText && {
      icon: CalendarDays,
      label: "تاريخ التسليم",
      value: completionText,
    },
    addedText && {
      icon: CalendarDays,
      label: "تاريخ الإضافة",
      value: addedText,
    },
    project.licenseNumber && {
      icon: FileBadge2,
      label: "رقم الترخيص",
      value: project.licenseNumber,
    },
  ].filter(Boolean);

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-[0_10px_30px_rgba(0,0,0,0.05)] sm:p-7 md:p-8 font-cairo" dir="rtl">
      {/* Header: badges + price */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {project.isFeatured && (
            <span className="rounded-md bg-amber-400 px-3 py-1 text-xs font-bold text-white">
              مميز
            </span>
          )}
          {statusText && (
            <span className="rounded-md bg-[#9d7857] px-3 py-1 text-xs font-bold text-white">
              {statusText}
            </span>
          )}
          {typeText && (
            <span className="rounded-md bg-gray-900 px-3 py-1 text-xs font-bold text-white">
              {typeText}
            </span>
          )}
        </div>

        {priceValue && (
          <p className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            {priceValue}
          </p>
        )}
      </div>

      {/* Title + location */}
      <h1 className="mt-4 text-2xl font-bold text-gray-900 sm:text-3xl md:text-[2rem]">
        {project.title}
      </h1>

      {locationText && (
        <div className="mt-2.5 flex items-center gap-1.5 text-sm text-gray-500 sm:text-[15px]">
          <MapPin className="h-4 w-4 shrink-0 text-[#9d7857]" strokeWidth={2} />
          <span>{locationText}</span>
        </div>
      )}

      {/* Accent divider */}
      <div className="mt-6 flex items-center">
        <div className="h-[3px] w-16 rounded-full bg-[#9d7857]" />
        <div className="h-px flex-1 bg-gray-200" />
      </div>

      {/* Stats grid */}
      {stats.length > 0 && (
        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat) => (
            <StatItem
              key={stat.label}
              icon={stat.icon}
              label={stat.label}
              value={stat.value}
            />
          ))}
        </div>
      )}

      {/* Description */}
      {project.description && (
        <div className="mt-8">
          <h2 className="mb-3 flex items-center gap-2.5 text-lg font-bold text-gray-900 sm:text-xl">
            <span className="inline-block h-5 w-1.5 rounded-full bg-[#9d7857]" />
            الوصف
          </h2>
          <p className="text-sm leading-8 text-gray-600 whitespace-pre-line sm:text-[15px]">
            {project.description}
          </p>
        </div>
      )}
    </div>
  );
};

export default ProjectInfoCard;
