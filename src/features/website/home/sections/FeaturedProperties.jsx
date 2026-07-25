import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bath,
  BedDouble,
  ChevronLeft,
  ChevronRight,
  Maximize2,
} from "lucide-react";
import { resolveUploadUrl } from "../../../../utils/uploads";
import "./FeaturedProperties.css";

const statusLabels = {
  AVAILABLE: "للبيع",
  SOLD: "مباع",
};

const imageVariants = {
  enter: (direction) => ({
    opacity: 0,
    scale: 1.04,
    x: direction > 0 ? 48 : -48,
  }),
  center: {
    opacity: 1,
    scale: 1,
    x: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  },
  exit: (direction) => ({
    opacity: 0,
    scale: 0.99,
    x: direction > 0 ? -40 : 40,
    transition: { duration: 0.35, ease: [0.4, 0, 1, 1] },
  }),
};

const cardVariants = {
  enter: { opacity: 0, y: 36 },
  center: {
    opacity: 1,
    y: 0,
    transition: { delay: 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
  exit: { opacity: 0, y: 16, transition: { duration: 0.2 } },
};

const FeaturedProperties = ({ items = [] }) => {
  const properties = useMemo(
    () => (Array.isArray(items) ? items.filter((item) => item?.title) : []),
    [items]
  );

  const [[index, direction], setIndex] = useState([0, 0]);
  const count = properties.length;
  const safeIndex = count ? ((index % count) + count) % count : 0;
  const current = properties[safeIndex];

  useEffect(() => {
    if (count <= 1) return undefined;
    const timer = setInterval(() => {
      setIndex(([prev]) => [prev + 1, 1]);
    }, 7500);
    return () => clearInterval(timer);
  }, [count, safeIndex]);

  const paginate = (dir) => {
    if (count <= 1) return;
    setIndex(([prev]) => [prev + dir, dir]);
  };

  if (!count) {
    return (
      <section className="bg-[#f7f7f7] px-6 py-20 font-cairo md:px-16" dir="rtl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-2 text-sm font-semibold text-[#9d7857]">مختارات رواسخ</p>
          <h2 className="mb-3 text-3xl font-bold text-slate-900 md:text-4xl">
            مشاريعنا المميزة
          </h2>
          <p className="text-slate-500">لا توجد مشاريع مميزة للعرض حالياً.</p>
        </div>
      </section>
    );
  }

  const base = import.meta.env.BASE_URL || "/";
  const imageUrl = current.imageUrl
    ? resolveUploadUrl(current.imageUrl)
    : `${base}images/placeholder-project.jpg`;
  const statusText = statusLabels[current.status] || current.status;
  const description = current.subtitle || current.location || "";

  return (
    <section className="featured-section bg-[#f7f7f7] py-16 font-cairo md:py-20">
      <div className="mx-auto mb-8 max-w-3xl px-6 text-center md:mb-10" dir="rtl">
        <p className="mb-2 text-sm font-semibold text-[#9d7857]">مختارات رواسخ</p>
        <h2 className="mb-3 text-3xl font-bold text-slate-900 md:text-4xl">
          مشاريعنا المميزة
        </h2>
        <p className="text-[15px] text-slate-500">
          تصفح قائمة مشاريعنا المختارة بعناية
        </p>
      </div>

      <div className="featured-showcase">
        <button
          type="button"
          className="featured-arrow featured-arrow--prev"
          aria-label="السابق"
          onClick={() => paginate(-1)}
          disabled={count <= 1}
        >
          <ChevronRight strokeWidth={2} />
        </button>

        <div className="featured-showcase-stage">
          <div className="featured-showcase-media-wrap">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={current.id || safeIndex}
                className="featured-showcase-media"
                custom={direction}
                variants={imageVariants}
                initial="enter"
                animate="center"
                exit="exit"
              >
                <div
                  className="featured-showcase-image"
                  style={{ backgroundImage: `url(${imageUrl})` }}
                  role="img"
                  aria-label={current.title}
                />
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="featured-info-card-wrap">
            <AnimatePresence mode="wait">
              <motion.article
                key={`card-${current.id || safeIndex}`}
                className="featured-info-card"
                variants={cardVariants}
                initial="enter"
                animate="center"
                exit="exit"
                whileHover={{
                  y: -12,
                  boxShadow:
                    "0 28px 60px rgba(0, 0, 0, 0.18), 0 8px 20px rgba(157, 120, 87, 0.14)",
                  transition: {
                    duration: 0.45,
                    ease: [0.22, 1, 0.36, 1],
                  },
                }}
              >
                <span className="featured-info-badge">
                  {current.badge || "جديد مميز"}
                </span>

                <div className="featured-info-body" dir="rtl">
                  <h3 className="featured-info-title">{current.title}</h3>

                  {description ? (
                    <p className="featured-info-desc">{description}</p>
                  ) : null}

                  {(current.beds != null && current.beds !== "") ||
                  (current.baths != null && current.baths !== "") ||
                  current.sizeLabel ? (
                    <div className="featured-info-specs">
                      {current.beds != null && current.beds !== "" && (
                        <div className="featured-info-spec">
                          <div className="featured-info-spec-label">غرف النوم</div>
                          <div className="featured-info-spec-value">
                            <BedDouble size={18} strokeWidth={1.6} />
                            <span>{current.beds}</span>
                          </div>
                        </div>
                      )}
                      {current.baths != null && current.baths !== "" && (
                        <div className="featured-info-spec">
                          <div className="featured-info-spec-label">الحمامات</div>
                          <div className="featured-info-spec-value">
                            <Bath size={18} strokeWidth={1.6} />
                            <span>{current.baths}</span>
                          </div>
                        </div>
                      )}
                      {current.sizeLabel && (
                        <div className="featured-info-spec">
                          <div className="featured-info-spec-label">المساحة</div>
                          <div className="featured-info-spec-value">
                            <Maximize2 size={17} strokeWidth={1.6} />
                            <span>{current.sizeLabel}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : null}

                  <div className="featured-info-footer">
                    <div className="featured-info-meta">
                      {statusText && (
                        <span className="featured-info-status">{statusText}</span>
                      )}
                      {current.priceLabel && (
                        <span className="featured-info-price">
                          {current.priceLabel}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.article>
            </AnimatePresence>
          </div>
        </div>

        <button
          type="button"
          className="featured-arrow featured-arrow--next"
          aria-label="التالي"
          onClick={() => paginate(1)}
          disabled={count <= 1}
        >
          <ChevronLeft strokeWidth={2} />
        </button>
      </div>
    </section>
  );
};

export default FeaturedProperties;
