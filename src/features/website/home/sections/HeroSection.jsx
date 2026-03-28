import { useState, useEffect } from "react";
import { heroSlides } from "../data/heroData";

const HeroSection = () => {
  const [current, setCurrent] = useState(0);
  const imageBasePath = import.meta.env.BASE_URL || "/";

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? heroSlides.length - 1 : prev - 1));
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden group font-cairo">
      {/* Slides */}
      {heroSlides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-all duration-1000 ${index === current ? "opacity-100 scale-100" : "opacity-0 scale-110"
            }`}
          style={{
            backgroundImage: `url(${imageBasePath}${slide.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/50" />

          {/* Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10 text-center px-4">
            {/* Logo */}
            <img
              src={`${imageBasePath}rawash-white.png`}
              alt="logo"
              className="w-50 md:w-80 mb-6 opacity-90"
            />

            {/* Title */}
            <h1
              dir="rtl"
              className="text-white text-2xl md:text-4xl font-bold leading-relaxed max-w-2xl animate-fadeUp"
            >
              {slide.title}
            </h1>
          </div>
        </div>
      ))}

      {/* Arrows (Hover only 🔥) */}
      <button
        onClick={nextSlide}
        className="absolute left-6 top-1/2 -translate-y-1/2 z-20 bg-white text-black px-3 py-2 opacity-0 group-hover:opacity-100 transition duration-300"
      >
        ›
      </button>

      <button
        onClick={prevSlide}
        className="absolute right-6 top-1/2 -translate-y-1/2 z-20 bg-white text-black px-3 py-2 opacity-0 group-hover:opacity-100 transition duration-300"
      >
        ‹
      </button>

      {/* Pagination */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-6 z-20">
        {heroSlides.map((_, index) => (
          <span
            key={index}
            onClick={() => setCurrent(index)}
            className={`cursor-pointer text-sm transition ${index === current
                ? "text-white font-bold scale-110"
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
