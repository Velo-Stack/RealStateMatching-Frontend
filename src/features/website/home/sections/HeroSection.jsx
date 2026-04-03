import { useEffect, useMemo, useState } from "react";
import { heroSlides as fallbackSlides } from "../data/heroData";

const HeroSection = ({ slides = [], settings = {} }) => {
  const imageBasePath = import.meta.env.BASE_URL || "/";
  const normalizedSlides = useMemo(
    () => (slides.length ? slides : fallbackSlides),
    [slides],
  );
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!normalizedSlides.length) return undefined;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % normalizedSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [normalizedSlides.length]);

  useEffect(() => {
    if (current >= normalizedSlides.length) {
      setCurrent(0);
    }
  }, [current, normalizedSlides.length]);

  const logoSrc = settings.logoUrl || `${imageBasePath}rawash-white.png`;

  return (
    <section className="relative h-screen w-full overflow-hidden group font-cairo">
      {normalizedSlides.map((slide, index) => {
        const imageUrl =
          slide.imageUrl ||
          `${imageBasePath}${String(slide.image || "").replace(/^\/+/, "")}`;

        return (
          <div
            key={slide.id || `${slide.title}-${index}`}
            className={`absolute inset-0 transition-all duration-1000 ${
              index === current ? "opacity-100 scale-100" : "opacity-0 scale-110"
            }`}
            style={{
              backgroundImage: `url(${imageUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="absolute inset-0 bg-black/50" />
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-4 text-center">
              <img
                src={logoSrc}
                alt="logo"
                className="mb-6 w-50 opacity-90 md:w-80"
              />
              <h1
                dir="rtl"
                className="max-w-2xl text-2xl font-bold leading-relaxed text-white md:text-4xl animate-fadeUp"
              >
                {slide.title}
              </h1>
              {slide.subtitle ? (
                <p className="mt-4 max-w-2xl text-sm text-white/80 md:text-base">
                  {slide.subtitle}
                </p>
              ) : null}
            </div>
          </div>
        );
      })}

      <button
        onClick={() =>
          setCurrent((prev) =>
            prev === normalizedSlides.length - 1 ? 0 : prev + 1,
          )
        }
        className="absolute left-6 top-1/2 z-20 -translate-y-1/2 bg-white px-3 py-2 text-black opacity-0 transition duration-300 group-hover:opacity-100"
      >
        ›
      </button>

      <button
        onClick={() =>
          setCurrent((prev) =>
            prev === 0 ? normalizedSlides.length - 1 : prev - 1,
          )
        }
        className="absolute right-6 top-1/2 z-20 -translate-y-1/2 bg-white px-3 py-2 text-black opacity-0 transition duration-300 group-hover:opacity-100"
      >
        ‹
      </button>

      <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 gap-6">
        {normalizedSlides.map((_, index) => (
          <span
            key={index}
            onClick={() => setCurrent(index)}
            className={`cursor-pointer text-sm transition ${
              index === current
                ? "scale-110 font-bold text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            {String(index + 1).padStart(2, "0")}
          </span>
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
