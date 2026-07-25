import { useEffect, useRef, useState } from "react";
import { chairmanMessageSectionData } from "./data/chairmanMessageData";
import { resolveUploadUrl } from "../../../utils/uploads";
import "./ChairmanMessageSection.css";

const ChairmanMessageSection = ({ content }) => {
  const base = import.meta.env.BASE_URL || "/";
  const [expanded, setExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);
  const contentRef = useRef(null);
  const [height, setHeight] = useState("0px");

  const fallback = chairmanMessageSectionData;
  const titleLines = content?.title
    ? content.title.split("\n")
    : fallback.titleLines;
  const messageParagraphs = content?.body
    ? content.body.split("\n").filter(Boolean)
    : fallback.messageParagraphs;
  const image = content?.imageUrl || fallback.image;

  const collapsedHeight = fallback.collapsedHeight || 120;
  const readMoreLabel = fallback.readMoreLabel || "اقرأ المزيد";
  const readLessLabel = fallback.readLessLabel || "عرض أقل";
  const imageAlt = fallback.imageAlt || "رئيس مجلس الإدارة";
  const name =
    content?.metadata?.name || fallback.name || "عبدالعزيز بن عبد الله المقرن";
  const role =
    content?.metadata?.role || fallback.role || "رئيس مجلس الإدارة";

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
    if (expanded) {
      setHeight(`${contentRef.current?.scrollHeight ?? collapsedHeight}px`);
    } else {
      setHeight(`${collapsedHeight}px`);
    }
  }, [collapsedHeight, expanded, messageParagraphs]);

  return (
    <section
      ref={sectionRef}
      className={`chairman-message font-cairo ${isVisible ? "is-visible" : ""}`}
      dir="rtl"
    >
      <div className="chairman-message__inner">
        <div className="chairman-message__content">
          <p className="chairman-message__eyebrow">كلمة القيادة</p>

          <h2 className="chairman-message__title">
            {titleLines.map((line, index) => (
              <span key={`${line}-${index}`}>
                {line}
                {index < titleLines.length - 1 ? <br /> : null}
              </span>
            ))}
          </h2>

          <div className="chairman-message__rule" aria-hidden="true" />

          <div
            className="chairman-message__body-wrap"
            style={{ maxHeight: height }}
          >
            <div ref={contentRef} className="chairman-message__body">
              {messageParagraphs.map((paragraph, index) => (
                <p key={`message-${index}`}>{paragraph}</p>
              ))}
            </div>

            {!expanded && (
              <div className="chairman-message__fade" aria-hidden="true" />
            )}
          </div>

          <button
            type="button"
            onClick={() => setExpanded((prev) => !prev)}
            className={`chairman-message__more ${expanded ? "is-open" : ""}`}
          >
            <span>{expanded ? readLessLabel : readMoreLabel}</span>
            <span className="chairman-message__more-icon" aria-hidden="true">
              ↓
            </span>
          </button>
        </div>

        <div className="chairman-message__media">
          <div className="chairman-message__media-frame">
            <img
              src={imageSrc}
              alt={imageAlt}
              className="chairman-message__img"
            />
          </div>
          <span className="chairman-message__accent" aria-hidden="true" />

          <div className="chairman-message__person">
            <h4 className="chairman-message__name">{name}</h4>
            <p className="chairman-message__role">{role}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChairmanMessageSection;
