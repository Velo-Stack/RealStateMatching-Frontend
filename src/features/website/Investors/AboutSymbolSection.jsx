import { useEffect, useRef, useState } from "react";
import { aboutSymbolSectionData } from "./data/aboutSymbolData";
import { resolveUploadUrl } from "../../../utils/uploads";
import "./AboutSymbolSection.css";

const AboutSymbolSection = ({ content }) => {
  const base = import.meta.env.BASE_URL || "/";
  const [open, setOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);
  const detailsRef = useRef(null);
  const [detailsHeight, setDetailsHeight] = useState("0px");

  const fallback = aboutSymbolSectionData;
  const title = content?.title || fallback.title;
  const image = content?.imageUrl || fallback.image;
  const imageAlt = fallback.imageAlt || "رمز السهم";

  const allParagraphs = content?.body
    ? content.body.split("\n").filter(Boolean)
    : null;
  const introParagraphs = allParagraphs
    ? allParagraphs.slice(0, 1)
    : fallback.introParagraphs;
  const detailsParagraphs = allParagraphs
    ? allParagraphs.slice(1)
    : fallback.detailsParagraphs;

  const readMoreLabel = fallback.readMoreLabel || "اقرأ المزيد";
  const readLessLabel = fallback.readLessLabel || "عرض أقل";

  const isUpload =
    image?.includes("/uploads/") || image?.includes("api/uploads");
  const imageSrc = isUpload
    ? resolveUploadUrl(image)
    : image?.startsWith("http") || image?.startsWith("/")
      ? image
      : `${base}${image ?? ""}`;

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (open) {
      setDetailsHeight(`${detailsRef.current?.scrollHeight ?? 0}px`);
    } else {
      setDetailsHeight("0px");
    }
  }, [open, detailsParagraphs]);

  return (
    <section
      ref={sectionRef}
      className={`about-symbol font-cairo ${isVisible ? "is-visible" : ""}`}
      dir="rtl"
    >
      <div className="about-symbol__inner">
        <div className="about-symbol__media">
          <div className="about-symbol__media-frame">
            <img src={imageSrc} alt={imageAlt} className="about-symbol__img" />
          </div>
          <span className="about-symbol__accent" aria-hidden="true" />
          <span className="about-symbol__glow" aria-hidden="true" />
        </div>

        <div className="about-symbol__content">
          <p className="about-symbol__eyebrow">عن رواسخ</p>

          <h2 className="about-symbol__title">{title}</h2>

          <div className="about-symbol__rule" aria-hidden="true" />

          {introParagraphs.map((paragraph, index) => (
            <p key={`intro-${index}`} className="about-symbol__text">
              {paragraph}
            </p>
          ))}

          <div
            className="about-symbol__details"
            style={{ maxHeight: detailsHeight }}
          >
            <div ref={detailsRef}>
              {detailsParagraphs.map((paragraph, index) => (
                <p key={`details-${index}`} className="about-symbol__text">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          {detailsParagraphs.length > 0 && (
            <button
              type="button"
              onClick={() => setOpen((prev) => !prev)}
              className={`about-symbol__more ${open ? "is-open" : ""}`}
            >
              <span>{open ? readLessLabel : readMoreLabel}</span>
              <span className="about-symbol__more-icon" aria-hidden="true">
                ↓
              </span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default AboutSymbolSection;
