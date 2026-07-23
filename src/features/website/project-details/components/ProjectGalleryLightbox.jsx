import { useState } from 'react';
import { resolveUploadUrl } from '../../../../utils/uploads';

const ProjectGalleryLightbox = ({ images = [] }) => {
  const [activeIndex, setActiveIndex] = useState(null); // null = closed
  const base = import.meta.env.BASE_URL || "/";

  return (
    <div className="font-cairo">
      <h2 className="text-2xl font-bold text-[#1f1f1f] mb-6 border-r-4 border-[#9d7857] pr-3">معرض الصور</h2>
      
      {/* Grid Images */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((url, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className="overflow-hidden rounded-2xl aspect-video relative group shadow-sm border border-gray-100 bg-gray-50 focus:outline-none"
          >
            <img
              src={resolveUploadUrl(url)}
              alt={`صورة المشروع ${i + 1}`}
              className="w-full h-full object-cover hover:scale-105 transition duration-500"
              loading="lazy"
              onError={(e) => {
                e.target.src = `${base}images/placeholder-project.jpg`;
              }}
            />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition duration-300 pointer-events-none" />
          </button>
        ))}
      </div>

      {/* Lightbox Overlay */}
      {activeIndex !== null && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setActiveIndex(null)}
        >
          {/* Close Button */}
          <button
            className="absolute top-6 right-6 text-white text-3xl hover:text-gray-300 transition-colors focus:outline-none z-50 bg-black/40 w-12 h-12 rounded-full flex items-center justify-center"
            onClick={() => setActiveIndex(null)}
          >
            ✕
          </button>

          {/* Active Image */}
          <div 
            className="relative max-w-5xl max-h-[85vh] w-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking the image container
          >
            <img
              src={resolveUploadUrl(images[activeIndex])}
              alt="صورة المعرض الكبيرة"
              className="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl border border-white/10"
              onError={(e) => {
                e.target.src = `${base}images/placeholder-project.jpg`;
              }}
            />
            
            {/* Image Counter */}
            <div className="absolute bottom-[-40px] left-1/2 transform -translate-x-1/2 text-white/80 text-sm bg-black/40 px-4 py-1.5 rounded-full font-sans">
              {activeIndex + 1} / {images.length}
            </div>
          </div>

          {/* Navigation Controls */}
          {activeIndex > 0 && (
            <button
              className="absolute right-6 md:right-12 top-1/2 -translate-y-1/2 text-white text-5xl hover:text-gray-300 transition-colors focus:outline-none bg-black/40 w-14 h-14 rounded-full flex items-center justify-center"
              onClick={(e) => { e.stopPropagation(); setActiveIndex(i => i - 1); }}
            >
              ‹
            </button>
          )}
          {activeIndex < images.length - 1 && (
            <button
              className="absolute left-6 md:left-12 top-1/2 -translate-y-1/2 text-white text-5xl hover:text-gray-300 transition-colors focus:outline-none bg-black/40 w-14 h-14 rounded-full flex items-center justify-center"
              onClick={(e) => { e.stopPropagation(); setActiveIndex(i => i + 1); }}
            >
              ›
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ProjectGalleryLightbox;
