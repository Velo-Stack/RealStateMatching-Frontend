const fallbackVisionPoints = [
  {
    title: "الاستثمار في المشاريع السكنية والتجارية",
    text: "تطوير مجتمعات حضرية جديدة في الرياض تلبي احتياجات السكان وتدعم الاقتصاد المحلي بمعايير عالمية.",
  },
  {
    title: "دعم البنية التحتية",
    text: "المشاركة في بناء وتطوير مشاريع كبرى تلبي احتياجات السوق العقاري والاقتصادي الوطني.",
  },
  {
    title: "الاستدامة البيئية",
    text: "تعزيز استخدام التكنولوجيا النظيفة والبناء الأخضر في جميع مشاريعنا.",
  },
  {
    title: "التطوير السكني والتجاري",
    text: "إنشاء مجتمعات حضرية متكاملة تحسن جودة الحياة وتتوافق مع أفضل الممارسات العالمية.",
  },
];

const AboutVisionSection = ({ content }) => {
  const points =
    Array.isArray(content?.content?.points) && content.content.points.length
      ? content.content.points
      : fallbackVisionPoints;

  return (
    <section className="relative overflow-hidden bg-[#f8f9fa] font-cairo" dir="rtl">
      <div className="absolute inset-0 bg-[#f8f9fa]" />
      <div className="absolute left-0 right-0 top-0 h-[3px] bg-gradient-to-r from-transparent via-[#9d7857] to-transparent" />

      <div className="relative z-10 px-6 py-24 md:px-20">
        <div className="mb-16 text-right">
          <p className="mb-4 text-sm font-light uppercase tracking-[4px] text-[#9d7857]">
            {content?.subtitle || "رؤية المملكة 2030"}
          </p>
          <h2 className="text-4xl font-bold leading-tight text-slate-900 md:text-5xl">
            {content?.title || "دور رواسخ العقارية"}
            <br />
            <span className="text-[#9d7857]">
              {(content?.description || "في بناء المستقبل").split("\n")[0]}
            </span>
          </h2>
          <div className="mt-6 flex justify-start gap-1">
            <div className="h-[3px] w-16 rounded-full bg-[#9d7857]" />
            <div className="h-[3px] w-4 rounded-full bg-[#9d7857]/40" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {points.map((point, index) => (
            <div
              key={`${point.title}-${index}`}
              className="group relative overflow-hidden border border-gray-200 bg-white p-8 transition-all duration-500 hover:border-[#9d7857]/50 hover:shadow-md"
            >
              <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-[#9d7857] transition-all duration-500 group-hover:w-full" />
              <div className="absolute right-0 top-0 h-[2px] w-0 bg-[#9d7857] transition-all duration-500 group-hover:w-full" />
              <div className="mb-5 text-2xl text-[#9d7857]">◆</div>
              <h3 className="mb-3 text-xl font-bold leading-snug text-slate-800">
                {point.title}
              </h3>
              <p className="text-sm leading-relaxed text-gray-500 md:text-base">
                {point.text}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-[#9d7857] to-transparent" />
    </section>
  );
};

export default AboutVisionSection;
