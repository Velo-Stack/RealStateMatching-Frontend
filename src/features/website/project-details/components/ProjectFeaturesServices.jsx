import { FaCheckCircle, FaStar } from "react-icons/fa";

const ProjectFeaturesServices = ({ features = [], services = [] }) => {
  const hasFeatures = features && features.length > 0;
  const hasServices = services && services.length > 0;

  if (!hasFeatures && !hasServices) return null;

  return (
    <div className="grid md:grid-cols-2 gap-8 font-cairo" dir="rtl">
      {/* Features Column */}
      {hasFeatures && (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-4">
          <h3 className="text-xl font-bold text-[#1f1f1f] flex items-center gap-2 border-b border-gray-100 pb-3">
            <FaStar className="text-[#9d7857]" size={18} />
            <span>مميزات المشروع</span>
          </h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {features.map((feature, index) => (
              <li key={index} className="flex items-center gap-2 text-gray-600 text-sm">
                <FaCheckCircle className="text-emerald-500 flex-shrink-0" size={14} />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Services Column */}
      {hasServices && (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-4">
          <h3 className="text-xl font-bold text-[#1f1f1f] flex items-center gap-2 border-b border-gray-100 pb-3">
            <FaStar className="text-[#9d7857]" size={18} />
            <span>الخدمات والمرافق</span>
          </h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {services.map((service, index) => (
              <li key={index} className="flex items-center gap-2 text-gray-600 text-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-[#9d7857] flex-shrink-0" />
                <span>{service}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProjectFeaturesServices;
