import { FaMapMarkerAlt } from "react-icons/fa";

const ProjectMapSection = ({ lat, lng, title, googleMapsUrl }) => {
  // Free live direct embed embedUrl — doesn't require a Google Maps API Key
  const embedUrl = `https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`;

  return (
    <div className="font-cairo space-y-4" dir="rtl">
      <h2 className="text-2xl font-bold text-[#1f1f1f] border-r-4 border-[#9d7857] pr-3">موقع المشروع</h2>
      
      <div className="w-full h-[400px] rounded-3xl overflow-hidden shadow-sm border border-gray-100 bg-gray-50">
        <iframe
          src={embedUrl}
          title={`موقع ${title}`}
          className="w-full h-full border-0"
          loading="lazy"
          allowFullScreen
        />
      </div>
      
      {googleMapsUrl && (
        <div className="flex justify-start">
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-[#9d7857] hover:text-[#856345] transition-colors text-sm font-semibold"
          >
            <FaMapMarkerAlt />
            <span>فتح في خرائط Google Maps</span>
          </a>
        </div>
      )}
    </div>
  );
};

export default ProjectMapSection;
