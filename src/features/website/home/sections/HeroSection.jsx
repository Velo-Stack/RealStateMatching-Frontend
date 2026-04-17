import { useEffect, useMemo, useState } from "react";
import { heroSlides as fallbackSlides } from "../data/heroData";

const HeroSection = ({ slides = [], settings = {} }) => {
  const imageBasePath = import.meta.env.BASE_URL || "/";
  const normalizedSlides = useMemo(
    () => (slides.length ? slides : fallbackSlides),
    [slides]
  );

  const [current, setCurrent] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  // 🔥 trigger zoom on first slide after paint
  useEffect(() => {
    const id = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(id);
  }, []);

  // 🔥 autoplay
  useEffect(() => {
    if (!normalizedSlides.length) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % normalizedSlides.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [normalizedSlides.length]);

  // 🔥 scroll tracking
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const logoSrc = settings.logoUrl || `${imageBasePath}rawash-white.png`;

  // 🔥 split title for stagger
  const splitText = (text) => text.split(" ");

  return (
    <section className="relative h-screen w-full overflow-hidden font-cairo">

      {normalizedSlides.map((slide, index) => {
        const imageUrl =
          slide.imageUrl ||
          `${imageBasePath}${String(slide.image || "").replace(/^\/+/, "")}`;

        return (
          <div
            key={slide.id || `${slide.title}-${index}`}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === current ? "opacity-100" : "opacity-0"
            }`}
          >
            {/* 🔥 STRONG ZOOM */}
            <div
              className={`absolute inset-0 bg-cover bg-center transition-transform duration-[8000ms] ease-linear ${
                index === current && mounted
                  ? "scale-[1.25] translate-y-10"
                  : "scale-100 translate-y-0"
              }`}
              style={{
                backgroundImage: `url(${imageUrl})`,
              }}
            />

            {/* overlay */}
            <div className="absolute inset-0 bg-black/50" />

            {/* 🔥 Content */}
            <div
              className="absolute inset-0 z-10 flex flex-col items-center justify-center px-4 text-center transition-all duration-500"
              style={{
                opacity: Math.max(1 - scrollY / 300, 0),
                transform: `translateY(${scrollY * 0.4}px)`,
                filter: `blur(${scrollY / 80}px)`, // 🔥 blur effect
              }}
            >
              <img
                src={logoSrc}
                alt="logo"
                className="mb-6 w-44 opacity-90 md:w-72 animate-fadeUp"
              />

              {/* 🔥 STAGGER TITLE */}
              <h1
                dir="rtl"
                className="max-w-2xl text-2xl font-bold leading-relaxed text-white md:text-4xl flex flex-wrap justify-center gap-2"
              >
                {splitText(slide.title).map((word, i) => (
                  <span
                    key={i}
                    className="opacity-0 animate-fadeWord"
                    style={{
                      animationDelay: `${i * 0.2}s`,
                      animationFillMode: "forwards",
                    }}
                  >
                    {word}
                  </span>
                ))}
              </h1>

              {/* 🔥 subtitle */}
              {slide.subtitle && (
                <p className="mt-4 max-w-2xl text-sm text-white/80 md:text-base opacity-0 animate-fadeUp delay-[1s]">
                  {slide.subtitle}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </section>
  );
};

export default HeroSection;