const AboutMission = () => {
  const base = import.meta.env.BASE_URL || "/";

  return (
    <section className="relative py-24 px-6 md:px-16 text-center text-white overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${base}images/cta.jpg)` }}
      />

      <div className="absolute inset-0 bg-black/70" />

      <div className="relative z-10 max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">الرسالة</h2>

        <p className="text-lg leading-relaxed text-white/90">
          تقديم حلول عقارية مبتكرة ومستدامة تتماشى مع احتياجات السوق السعودي،
          وتدعم تحقيق رؤية 2030 من خلال تحسين جودة الحياة والمساهمة في التنمية
          الاقتصادية.
        </p>
      </div>
    </section>
  );
};

export default AboutMission;
