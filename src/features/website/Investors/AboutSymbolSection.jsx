import { useState } from "react";
import { aboutSymbolSectionData } from "./data/aboutSymbolData";

const AboutSymbolSection = ({ content = aboutSymbolSectionData }) => {
  const base = import.meta.env.BASE_URL || "/";
  const [open, setOpen] = useState(false);
  const {
    title,
    image,
    imageAlt,
    introParagraphs = [],
    detailsParagraphs = [],
    readMoreLabel,
    readLessLabel,
  } = content ?? aboutSymbolSectionData;
  const imageSrc =
    image?.startsWith("http") || image?.startsWith("/")
      ? image
      : `${base}${image ?? ""}`;

  return (
    <section className="py-20 px-6 md:px-16 bg-[#f9fafb]" dir="rtl">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="relative">
          <img
            src={imageSrc}
            alt={imageAlt}
            className="w-full h-[420px] object-cover rounded-[40px_0_0_0]"
          />
        </div>

        <div className="text-right">
          <h2 className="text-4xl md:text-5xl font-bold text-[#1f1f1f] mb-6">
            {title}
          </h2>

          {introParagraphs.map((paragraph, index) => (
            <p key={`intro-${index}`} className="text-gray-600 leading-8 mb-6">
              {paragraph}
            </p>
          ))}

          <div
            className={`overflow-hidden transition-all duration-700 ease-in-out ${
              open ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            {detailsParagraphs.map((paragraph, index) => (
              <p
                key={`details-${index}`}
                className="text-gray-600 leading-8 mb-6"
              >
                {paragraph}
              </p>
            ))}
          </div>

          <button
            onClick={() => setOpen(!open)}
            className="text-[#9d7857] font-semibold flex items-center gap-2 group mt-2"
          >
            {open ? readLessLabel : readMoreLabel}

            <span
              className={`transition-transform duration-300 ${
                open ? "rotate-180" : ""
              }`}
            >
              ←
            </span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default AboutSymbolSection;
