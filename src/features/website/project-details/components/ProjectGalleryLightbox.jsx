import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { resolveUploadUrl } from "../../../../utils/uploads";

const ProjectGalleryLightbox = ({ images = [], title = "معرض الصور" }) => {
  const [activeIndex, setActiveIndex] = useState(null);
  const base = import.meta.env.BASE_URL || "/";

  const uniqueImages = useMemo(() => {
    const seen = new Set();
    return images.filter((url) => {
      if (!url || seen.has(url)) return false;
      seen.add(url);
      return true;
    });
  }, [images]);

  const previewImages = uniqueImages.slice(0, 5);
  const totalCount = uniqueImages.length;
  const isOpen = activeIndex !== null;

  useEffect(() => {
    if (!isOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event) => {
      if (event.key === "Escape") setActiveIndex(null);
      if (event.key === "ArrowRight") {
        setActiveIndex((current) =>
          current === null ? current : (current + 1) % totalCount
        );
      }
      if (event.key === "ArrowLeft") {
        setActiveIndex((current) =>
          current === null
            ? current
            : (current - 1 + totalCount) % totalCount
        );
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, totalCount]);

  if (uniqueImages.length === 0) return null;

  const openAt = (index) => setActiveIndex(index);

  const goPrev = (event) => {
    event.stopPropagation();
    setActiveIndex((current) =>
      current === null ? current : (current - 1 + totalCount) % totalCount
    );
  };

  const goNext = (event) => {
    event.stopPropagation();
    setActiveIndex((current) =>
      current === null ? current : (current + 1) % totalCount
    );
  };

  const renderImage = (url, alt) => (
    <img
      src={resolveUploadUrl(url)}
      alt={alt}
      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
      loading="lazy"
      onError={(e) => {
        e.target.src = `${base}images/placeholder-project.jpg`;
      }}
    />
  );

  return (
    <div className="font-cairo space-y-5">
      <h2
        dir="rtl"
        className="border-r-4 border-[#9d7857] pr-3 text-xl font-bold text-[#1f1f1f] sm:text-2xl"
      >
        معرض الصور
      </h2>

      {/* Collage: large left + 2x2 right */}
      <div dir="ltr" className="grid grid-cols-2 gap-1.5 sm:gap-2 md:grid-cols-4 md:grid-rows-2 md:gap-2">
        {/* Main large image */}
        <button
          type="button"
          onClick={() => openAt(0)}
          className="group relative col-span-2 row-span-1 h-52 overflow-hidden rounded-xl bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#9d7857] sm:h-64 md:row-span-2 md:h-full md:min-h-[360px] lg:min-h-[420px]"
        >
          {renderImage(previewImages[0], `${title} - صورة 1`)}
          {previewImages.length === 1 ? (
            <div className="absolute inset-0 flex items-center justify-center bg-black/45 px-3 text-center transition duration-300 group-hover:bg-black/50">
              <span
                dir="rtl"
                className="font-cairo text-sm font-bold leading-relaxed text-white sm:text-base"
              >
                صور المشروع
                <span className="mt-0.5 block text-xs font-semibold text-white/90 sm:text-sm">
                  ({totalCount})
                </span>
              </span>
            </div>
          ) : (
            <div className="pointer-events-none absolute inset-0 bg-black/0 transition duration-300 group-hover:bg-black/10" />
          )}
        </button>

        {/* Up to 4 side images */}
        {previewImages.slice(1).map((url, index) => {
          const realIndex = index + 1;
          const isLastPreview = realIndex === previewImages.length - 1;

          return (
            <button
              key={`${url}-${realIndex}`}
              type="button"
              onClick={() => openAt(realIndex)}
              className="group relative h-28 overflow-hidden rounded-xl bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#9d7857] sm:h-32 md:h-full md:min-h-[176px] lg:min-h-[205px]"
            >
              {renderImage(url, `${title} - صورة ${realIndex + 1}`)}

              {isLastPreview ? (
                <div className="absolute inset-0 flex items-center justify-center bg-black/45 px-3 text-center transition duration-300 group-hover:bg-black/50">
                  <span
                    dir="rtl"
                    className="font-cairo text-sm font-bold leading-relaxed text-white sm:text-base"
                  >
                    صور المشروع
                    <span className="mt-0.5 block text-xs font-semibold text-white/90 sm:text-sm">
                      ({totalCount})
                    </span>
                  </span>
                </div>
              ) : (
                <div className="pointer-events-none absolute inset-0 bg-black/0 transition duration-300 group-hover:bg-black/10" />
              )}
            </button>
          );
        })}
      </div>

      {/* Lightbox popup */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/92 p-4 backdrop-blur-sm"
          onClick={() => setActiveIndex(null)}
          role="dialog"
          aria-modal="true"
          aria-label="معرض الصور"
        >
          <button
            type="button"
            aria-label="إغلاق"
            className="absolute top-4 left-4 z-[90] flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:top-6 sm:left-6"
            onClick={() => setActiveIndex(null)}
          >
            <X className="h-5 w-5" strokeWidth={2.4} />
          </button>

          <div
            className="relative flex w-full max-w-5xl flex-col items-center"
            onClick={(event) => event.stopPropagation()}
          >
            <img
              src={resolveUploadUrl(uniqueImages[activeIndex])}
              alt={`${title} - صورة ${activeIndex + 1}`}
              className="max-h-[75vh] w-auto max-w-full rounded-2xl object-contain shadow-2xl"
              onError={(e) => {
                e.target.src = `${base}images/placeholder-project.jpg`;
              }}
            />

            <div className="mt-4 rounded-full bg-white/10 px-4 py-1.5 text-sm text-white/90 backdrop-blur-sm font-cairo">
              {activeIndex + 1} / {totalCount}
            </div>
          </div>

          {totalCount > 1 && (
            <>
              <button
                type="button"
                aria-label="الصورة السابقة"
                className="absolute left-3 top-1/2 z-[90] flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:left-6"
                onClick={goPrev}
              >
                <ChevronLeft className="h-6 w-6" strokeWidth={2.2} />
              </button>
              <button
                type="button"
                aria-label="الصورة التالية"
                className="absolute right-3 top-1/2 z-[90] flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:right-6"
                onClick={goNext}
              >
                <ChevronRight className="h-6 w-6" strokeWidth={2.2} />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ProjectGalleryLightbox;
