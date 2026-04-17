import { FaBuilding, FaHome, FaRulerCombined, FaTasks } from "react-icons/fa";

const ProjectDetailsCard = ({ icon: Icon, label, value }) => {
  return (
    <div className="group bg-white p-6 rounded-[20px] shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[#9d7857]/10 rounded-full flex items-center justify-center group-hover:bg-[#9d7857] transition-colors">
            <Icon className="text-[#9d7857] group-hover:text-white transition-colors" />
          </div>
          <span className="text-lg font-semibold text-gray-700">{label}</span>
        </div>
        <span className="text-2xl font-bold text-[#9d7857]">{value}</span>
      </div>
    </div>
  );
};

const ProjectDetailsSection = ({ projectDetails, projectImage, baseUrl }) => {
  const details = [
    { icon: FaBuilding, label: "المباني", value: projectDetails.buildings || "1" },
    { icon: FaHome, label: "الوحدات", value: projectDetails.units || "12" },
    { icon: FaRulerCombined, label: "المسطح الكلي", value: projectDetails.totalArea || "1815.56" },
    { icon: FaTasks, label: "نسبة الإنجاز", value: projectDetails.completionRate || "80%" },
  ];

  return (
    <div className="grid md:grid-cols-2 gap-12 mb-20" dir="rtl">
      
      {/* RIGHT - Details Cards */}
      <div className="space-y-6 order-2 md:order-1">
        <h2 className="text-3xl font-bold text-[#1f1f1f] mb-8">تفاصيل المشروع</h2>

        {details.map((detail, index) => (
          <ProjectDetailsCard
            key={index}
            icon={detail.icon}
            label={detail.label}
            value={detail.value}
          />
        ))}
      </div>

      {/* LEFT - Featured Image */}
      <div className="order-1 md:order-2">
        <div className="relative group rounded-[28px] overflow-hidden shadow-2xl h-full min-h-[400px]">
          <img
            src={`${baseUrl}${projectImage}`}
            alt="تفاصيل المشروع"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
      </div>

    </div>
  );
};

export default ProjectDetailsSection;
