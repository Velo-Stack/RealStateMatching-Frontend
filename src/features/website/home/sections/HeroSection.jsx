import { useEffect, useMemo, useRef, useState } from "react";
import "./HeroSection.css";

const HeroSection = ({ slides = [], settings = {} }) => {
  const imageBasePath = import.meta.env.BASE_URL || "/";
  const normalizedSlides = useMemo(
    () =>
      Array.isArray(slides)
        ? slides.filter((slide) => slide?.imageUrl || slide?.image)
        : [],
    [slides]
  );

  const [current, setCurrent] = useState(0);
  const contentRefs = useRef([]);

  useEffect(() => {
    setCurrent(0);
  }, [normalizedSlides.length]);

  useEffect(() => {
    if (normalizedSlides.length <= 1) return undefined;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % normalizedSlides.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [normalizedSlides.length]);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          contentRefs.current.forEach((el) => {
            if (el) {
              const opacity = Math.max(1 - scrollY / 300, 0);
              const translateY = scrollY * 0.4;
              const blur = scrollY / 80;
              el.style.opacity = opacity;
              el.style.transform = `translateY(${translateY}px)`;
              el.style.filter = `blur(${blur}px)`;
            }
          });
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const logoSrc = settings.logoUrl || `${imageBasePath}rawash-white.png`;
  const splitText = (text = "") => String(text).split(" ").filter(Boolean);

  if (!normalizedSlides.length) {
    return (
      <section className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-neutral-900 font-cairo">
        <div className="absolute inset-0 bg-black/40" />
        <img
          src={logoSrc}
          alt="logo"
          className="relative z-10 w-44 opacity-90 md:w-72"
        />
      </section>
    );
  }

  return (
    <section className="relative h-screen w-full overflow-hidden font-cairo">
      {normalizedSlides.map((slide, index) => {
        const imageUrl =
          slide.imageUrl ||
          `${imageBasePath}${String(slide.image || "").replace(/^\/+/, "")}`;
        const isActive = index === current;

        return (
          <div
            key={slide.id || `${slide.title}-${index}`}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              isActive ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="hero-kenburns-frame absolute inset-0 overflow-hidden">
              <div
                className={`hero-kenburns-media absolute inset-0 bg-cover bg-center ${
                  isActive ? "is-active" : ""
                }`}
                style={{ backgroundImage: `url(${imageUrl})` }}
                aria-hidden
              />
            </div>

            <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/45 to-black/60" />

            <div
              ref={(el) => (contentRefs.current[index] = el)}
              className="absolute inset-0 z-10 flex flex-col items-center justify-center px-4 text-center transition-all duration-500 will-change-transform"
            >
              <img
                src={logoSrc}
                alt="logo"
                className="mb-6 w-44 animate-fadeUp opacity-90 md:w-72"
              />

              <h1
                dir="rtl"
                className="flex max-w-2xl flex-wrap justify-center gap-2 text-2xl font-bold leading-relaxed text-white md:text-4xl"
              >
                {splitText(slide.title).map((word, i) => (
                  <span
                    key={`${word}-${i}`}
                    className="animate-fadeWord opacity-0"
                    style={{
                      animationDelay: `${i * 0.2}s`,
                      animationFillMode: "forwards",
                    }}
                  >
                    {word}
                  </span>
                ))}
              </h1>

              {slide.subtitle && (
                <p className="mt-4 max-w-2xl animate-fadeUp text-sm text-white/80 opacity-0 delay-[1s] md:text-base">
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
