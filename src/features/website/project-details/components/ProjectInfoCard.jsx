const ProjectInfoCard = ({ project }) => {
  const typeLabels = {
    RESIDENTIAL: 'سكني',
    COMMERCIAL: 'تجاري',
    MIXED_USE: 'متعدد الاستخدامات',
    LAND: 'أراضي'
  };

  const statusLabels = {
    ACTIVE: 'متاح',
    SOLD_OUT: 'مباع بالكامل',
    COMING_SOON: 'قريباً',
    COMPLETED: 'مكتمل'
  };

  // Format Area Range
  let areaValue = null;
  if (project.areaFrom && project.areaTo) {
    areaValue = `${project.areaFrom} - ${project.areaTo} م²`;
  } else if (project.areaFrom || project.areaTo) {
    areaValue = `${project.areaFrom || project.areaTo} م²`;
  }

  // Format Price Range
  let priceValue = null;
  if (project.priceFrom && project.priceTo) {
    priceValue = `${Number(project.priceFrom).toLocaleString('ar-SA')} - ${Number(project.priceTo).toLocaleString('ar-SA')} ﷼`;
  } else if (project.priceFrom) {
    priceValue = `تبدأ من ${Number(project.priceFrom).toLocaleString('ar-SA')} ﷼`;
  }

  const info = [
    { label: 'نوع المشروع', value: typeLabels[project.type] || project.type },
    { label: 'الحالة', value: statusLabels[project.status] || project.status },
    { label: 'المدينة', value: project.city },
    { label: 'نطاق المساحة', value: areaValue },
    { label: 'نطاق الأسعار', value: priceValue },
    { label: 'عدد الوحدات', value: project.totalUnits || null },
    { label: 'تاريخ التسليم المتوقع', value: project.completionDate ? new Date(project.completionDate).toLocaleDateString('ar-SA', { year: 'numeric', month: 'long' }) : null },
    { label: 'رقم الترخيص العقاري', value: project.licenseNumber || null },
  ].filter(item => item.value);

  return (
    <div className="grid md:grid-cols-3 gap-8 font-cairo" dir="rtl">
      {/* Description - taking 2 cols */}
      <div className="md:col-span-2 space-y-4">
        <h2 className="text-2xl font-bold text-[#1f1f1f] border-r-4 border-[#9d7857] pr-3">عن المشروع</h2>
        <p className="text-gray-600 leading-relaxed text-base whitespace-pre-line">{project.description}</p>
      </div>

      {/* Quick Details Box - taking 1 col */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 h-fit">
        <h3 className="text-lg font-bold text-[#1f1f1f] mb-5 pb-3 border-b border-gray-100">تفاصيل المشروع</h3>
        <dl className="space-y-4">
          {info.map(({ label, value }) => (
            <div key={label} className="flex justify-between items-center text-sm py-1">
              <dt className="text-gray-500">{label}</dt>
              <dd className="font-semibold text-[#1f1f1f] text-left">{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
};

export default ProjectInfoCard;
