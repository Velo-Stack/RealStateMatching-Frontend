const AboutSection = ({ content }) => {
  const base = import.meta.env.BASE_URL || "/";
  const extraStats = content?.content?.stats || [];

  return (
    <section className="bg-[#f8f9fa] pb-10 pt-24 font-cairo">
      <div className="grid items-center gap-16 px-6 md:grid-cols-2 md:px-16">
        <div className="text-right">
          <h2 className="mb-6 text-4xl font-bold leading-tight text-[#2f2f2f] md:text-5xl">
            {content?.title || "مرحبًا بك في شركة رواسخ العقارية"}
          </h2>

          <p className="mb-10 text-lg leading-relaxed text-gray-600">
            {content?.description ||
              "نقدم لك أفضل الحلول العقارية بخبرة طويلة ورؤية حديثة تلبي احتياجاتك وتحقق تطلعاتك."}
          </p>

          {extraStats.length ? (
            <div className="mb-10 grid grid-cols-2 gap-4">
              {extraStats.map((item, index) => (
                <div
                  key={`${item.label}-${index}`}
                  className="rounded-2xl border border-white/20 bg-white/80 p-4 shadow-sm"
                >
                  <div className="text-2xl font-bold text-[#9d7857]">
                    {item.value}
                  </div>
                  <div className="mt-1 text-sm text-slate-500">{item.label}</div>
                </div>
              ))}
            </div>
          ) : null}

          <div className="relative mr-auto w-full max-w-[520px]">
            <img
              src={content?.imageUrl || `${base}images/bg_1.jpg`}
              alt={content?.title || "about"}
              className="h-[320px] w-full object-cover"
            />

            <div className="absolute right-10 top-1/2 max-w-[80%] -translate-y-1/2 bg-[#2f2f2f] p-8 text-white shadow-xl">
              <p className="mb-6 text-lg leading-relaxed">
                {content?.subtitle ||
                  "شراء العقارات أصبح أسهل مع خدماتنا المتكاملة وخبرتنا في السوق."}
              </p>

              {(content?.primaryButtonText || content?.secondaryButtonText) ? (
                <div className="flex flex-wrap gap-4">
                  {content?.primaryButtonText ? (
                    <a
                      href={content.primaryButtonUrl || "#"}
                      className="text-[#9d7857]"
                    >
                      {content.primaryButtonText} →
                    </a>
                  ) : null}
                  {content?.secondaryButtonText ? (
                    <a
                      href={content.secondaryButtonUrl || "#"}
                      className="text-white/70"
                    >
                      {content.secondaryButtonText}
                    </a>
                  ) : null}
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <div className="relative h-[520px] w-full">
          <div className="relative h-[520px] w-full overflow-hidden">
            <img
              src={content?.imageUrl || `${base}images/bg_2.jpg`}
              alt="about"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-black/20" />

            <div className="absolute bottom-10 left-10 max-w-[80%] bg-[#2f2f2f] p-8 text-white shadow-xl">
              <p className="mb-6 text-lg leading-relaxed">
                {content?.subtitle ||
                  "نوفر لك أفضل خيارات الإيجار والشراء بما يناسب احتياجاتك وأسلوب حياتك."}
              </p>
              {content?.primaryButtonText ? (
                <a href={content.primaryButtonUrl || "#"} className="text-[#9d7857]">
                  {content.primaryButtonText} →
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
