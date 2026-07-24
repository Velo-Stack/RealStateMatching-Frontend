import { investorAdvantagesSectionData } from "./data/advantagesData";

const AdvantagesSection = ({ advantages = [] }) => {
  const base = import.meta.env.BASE_URL || "/";
  // The API advantages array doesn't have a banner image, so we keep the static one as fallback
  const fallback = investorAdvantagesSectionData;
  const image = fallback.image;
  const imageAlt = fallback.imageAlt || "مزايا الاستثمار";
  
  const imageSrc =
    image?.startsWith("http") || image?.startsWith("/")
      ? image
      : `${base}${image ?? ""}`;

  if (!advantages?.length) return null;

  const rightColumnItems = advantages.filter((_, index) => index % 2 === 0);
  const leftColumnItems = advantages.filter((_, index) => index % 2 !== 0);

  return (
    <section className="relative pt-24 bg-[#e9dfd1]" dir="rtl">
      <div className="px-6 md:px-16 mb-16 text-right">
        <h2 className="text-4xl md:text-5xl font-bold text-black">
          مزايا الاستثمار معنا
        </h2>
      </div>

      <div className="px-6 md:px-16 grid md:grid-cols-2 gap-10">
        <div className="space-y-10">
          {rightColumnItems.map((item, index) => (
            <div key={item.id} className="flex items-start gap-4 group">
              <div className="text-[#9d7857] font-bold text-xl relative">
                {(index * 2 + 1).toString().padStart(2, "0")}
                <span className="absolute -top-2 right-0 w-8 h-[2px] bg-[#9d7857]" />
              </div>
              
              <div>
                <h3 className="font-semibold text-lg text-black mb-2">{item.title}</h3>
                <p className="text-gray-800 leading-7 text-sm md:text-base group-hover:text-black transition">
                  {item.body}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-10">
          {leftColumnItems.map((item, index) => (
            <div key={item.id} className="flex items-start gap-4 group">
              <div className="text-[#9d7857] font-bold text-xl relative">
                {(index * 2 + 2).toString().padStart(2, "0")}
                <span className="absolute -top-2 right-0 w-8 h-[2px] bg-[#9d7857]" />
              </div>
              
              <div>
                <h3 className="font-semibold text-lg text-black mb-2">{item.title}</h3>
                <p className="text-gray-800 leading-7 text-sm md:text-base group-hover:text-black transition">
                  {item.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-16">
        <img
          src={imageSrc}
          alt={imageAlt}
          className="w-full h-[300px] md:h-[400px] object-cover"
        />
      </div>
    </section>
  );
};

export default AdvantagesSection;
