import { useState } from "react";
import { aboutSymbolSectionData } from "./data/aboutSymbolData";
import { resolveUploadUrl } from "../../../utils/uploads";

const AboutSymbolSection = ({ content }) => {
  const base = import.meta.env.BASE_URL || "/";
  const [open, setOpen] = useState(false);
  
  const fallback = aboutSymbolSectionData;
  const title = content?.title || fallback.title;
  const image = content?.imageUrl || fallback.image;
  const imageAlt = fallback.imageAlt || "رمز السهم";
  
  const allParagraphs = content?.body ? content.body.split('\n').filter(Boolean) : null;
  const introParagraphs = allParagraphs ? allParagraphs.slice(0, 1) : fallback.introParagraphs;
  const detailsParagraphs = allParagraphs ? allParagraphs.slice(1) : fallback.detailsParagraphs;

  const readMoreLabel = fallback.readMoreLabel || "اقرأ المزيد";
  const readLessLabel = fallback.readLessLabel || "عرض أقل";

  const isUpload = image?.includes("/uploads/") || image?.includes("api/uploads");
  const imageSrc = isUpload 
    ? resolveUploadUrl(image) 
    : (image?.startsWith("http") || image?.startsWith("/") ? image : `${base}${image ?? ""}`);

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

          {detailsParagraphs.length > 0 && (
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
          )}
        </div>
      </div>
    </section>
  );
};

export default AboutSymbolSection;
