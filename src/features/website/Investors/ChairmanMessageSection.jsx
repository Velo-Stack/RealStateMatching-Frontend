import { useEffect, useRef, useState } from "react";
import { chairmanMessageSectionData } from "./data/chairmanMessageData";

const ChairmanMessageSection = ({ content }) => {
  const base = import.meta.env.BASE_URL || "/";
  const [expanded, setExpanded] = useState(false);
  const contentRef = useRef(null);
  const [height, setHeight] = useState("0px");
  
  // API content is passed as an object: { title, body, imageUrl }
  // We fall back to static data if not provided
  const fallback = chairmanMessageSectionData;
  const titleLines = content?.title ? content.title.split('\n') : fallback.titleLines;
  const messageParagraphs = content?.body ? content.body.split('\n').filter(Boolean) : fallback.messageParagraphs;
  const image = content?.imageUrl || fallback.image;
  
  const collapsedHeight = fallback.collapsedHeight || 120;
  const readMoreLabel = fallback.readMoreLabel || "اقرأ المزيد";
  const readLessLabel = fallback.readLessLabel || "عرض أقل";
  const imageAlt = fallback.imageAlt || "رئيس مجلس الإدارة";
  const name = fallback.name || "عبدالعزيز بن عبد الله المقرن";
  const role = fallback.role || "رئيس مجلس الإدارة";

  const imageSrc =
    image?.startsWith("http") || image?.startsWith("/")
      ? image
      : `${base}${image ?? ""}`;

  useEffect(() => {
    if (expanded) {
      setHeight(`${contentRef.current?.scrollHeight ?? collapsedHeight}px`);
    } else {
      setHeight(`${collapsedHeight}px`);
    }
  }, [collapsedHeight, expanded, messageParagraphs]);

  return (
    <section className="py-24 px-6 md:px-16 bg-white" dir="rtl">
      <div className="grid md:grid-cols-2 gap-16 items-center">
        <div>
          <h2 className="text-4xl md:text-5xl font-bold text-[#1f1f1f] mb-6 leading-tight">
            {titleLines.map((line, index) => (
              <span key={`${line}-${index}`}>
                {line}
                {index < titleLines.length - 1 ? <br /> : null}
              </span>
            ))}
          </h2>

          <div
            className="relative overflow-hidden transition-all duration-700 ease-in-out"
            style={{ maxHeight: height }}
          >
            <div
              ref={contentRef}
              className="text-gray-600 leading-8 text-[15px] space-y-4"
            >
              {messageParagraphs.map((paragraph, index) => (
                <p key={`message-${index}`}>{paragraph}</p>
              ))}
            </div>

            {!expanded && (
              <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-white to-transparent" />
            )}
          </div>

          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-6 text-[#9d7857] font-semibold flex items-center gap-2 hover:gap-3 transition-all duration-300"
          >
            {expanded ? readLessLabel : readMoreLabel}
            <span
              className={`transition-transform duration-300 ${
                expanded ? "rotate-180" : ""
              }`}
            >
              ↓
            </span>
          </button>
        </div>

        <div className="relative flex justify-center md:justify-start">
          <div className="absolute inset-0 bg-[#e9e3dc] rounded-[0_120px_0_0] md:rounded-[0_150px_0_0]" />

          <img
            src={imageSrc}
            alt={imageAlt}
            className="relative z-10 w-[85%] md:w-[90%] object-contain"
          />

          <div className="absolute bottom-[-60px] right-6 text-right">
            <h4 className="text-lg font-bold text-[#1f1f1f]">{name}</h4>
            <p className="text-sm text-gray-500">{role}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChairmanMessageSection;
