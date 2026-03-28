

const visionPoints = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
        <line x1="12" y1="12" x2="12" y2="16" />
        <line x1="10" y1="14" x2="14" y2="14" />
      </svg>
    ),
    title: "الاستثمار في المشاريع السكنية والتجارية",
    text: "تطوير مجتمعات حضرية جديدة في الرياض تلبي احتياجات السكان وتدعم الاقتصاد المحلي بمعايير عالمية.",
    always: true,
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
    title: "دعم البنية التحتية",
    text: "المشاركة في بناء وتطوير مشاريع كبرى تلبي احتياجات السوق العقاري والاقتصادي الوطني.",
    always: true,
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    title: "الاستدامة البيئية",
    text: "تعزيز استخدام التكنولوجيا النظيفة والبناء الأخضر في جميع مشاريعنا لدعم البيئة وتقليل الانبعاثات الكربونية.",
    always: false,
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
    title: "التطوير السكني والتجاري",
    text: "إنشاء مجتمعات حضرية متكاملة تُحسّن جودة الحياة وتتوافق مع أفضل الممارسات العالمية.",
    always: false,
  },
];

const AboutVisionSection = () => {
  return (
    <section className="relative font-cairo overflow-hidden bg-[#f8f9fa]" dir="rtl">

      {/* Light bg */}
      <div className="absolute inset-0 bg-[#f8f9fa]" />

      {/* Decorative accent line - top */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-[#9d7857] to-transparent" />

      {/* Content */}
      <div className="relative z-10 px-6 md:px-20 py-24">

        {/* Header */}
        <div className="mb-16 text-right">
          <p className="text-[#9d7857] text-sm tracking-[4px] uppercase mb-4 font-light">
            رؤية المملكة ٢٠٣٠
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
            دور رواسخ العقارية
            <br />
            <span className="text-[#9d7857]">في بناء المستقبل</span>
          </h2>
          {/* Accent underline */}
          <div className="mt-6 flex justify-start gap-1">
            <div className="h-[3px] w-16 bg-[#9d7857] rounded-full" />
            <div className="h-[3px] w-4 bg-[#9d7857]/40 rounded-full" />
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {visionPoints.map((point, i) => (
              <div
                key={i}
                className="group relative border border-gray-200 bg-white p-8
                           hover:border-[#9d7857]/50 hover:shadow-md
                           transition-all duration-500 overflow-hidden"
              >
                {/* Hover corner accent */}
                <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#9d7857] group-hover:w-full transition-all duration-500" />
                <div className="absolute top-0 right-0 w-0 h-[2px] bg-[#9d7857] group-hover:w-full transition-all duration-500" />

                {/* Icon */}
                <div className="text-[#9d7857] mb-5 opacity-90">
                  {point.icon}
                </div>

                {/* Title */}
                <h3 className="text-slate-800 text-xl font-bold mb-3 leading-snug">
                  {point.title}
                </h3>

                {/* Text */}
                <p className="text-gray-500 leading-relaxed text-sm md:text-base">
                  {point.text}
                </p>
              </div>
            ))}
        </div>



      </div>

      {/* Decorative accent line - bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-[#9d7857] to-transparent" />

    </section>
  );
};

export default AboutVisionSection;