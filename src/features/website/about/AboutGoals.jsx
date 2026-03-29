const goals = [
  {
    title: "تطوير مشاريع",
    desc: "سكنية وتجارية بمواصفات عالمية",
  },
  {
    title: "جودة عالية",
    desc: "في البناء والتصميم بمعايير تلبي تطلعات العملاء",
  },
  {
    title: "توفير منتجات",
    desc: "عقارية مميزة تلبي الطلبات في السوق السعودي",
  },
  {
    title: "إدارة وتطوير",
    desc: "المشاريع وفق أسس ومعايير احترافية",
  },
  {
    title: "اعتماد تقنيات",
    desc: "حديثة لضمان مشاريع صديقة للبيئة ومستدامة",
  },
  {
    title: "التوسع",
    desc: "في مناطق حيوية مع حلول مبتكرة",
  },
];

const AboutGoals = () => {
  return (
    <section className="relative py-24 px-6 md:px-16 bg-[#f8f9fa]">
      <h2 className="text-4xl font-bold text-center mb-16">مستهدفات الشركة</h2>

      <div className="grid md:grid-cols-3 gap-10">
        {goals.map((g, i) => (
          <div
            key={i}
            className="group text-right bg-white p-8 shadow-md hover:shadow-xl transition duration-500 hover:-translate-y-2"
          >
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="w-2 h-6 bg-[#9d7857]" />
              {g.title}
            </h3>

            <p className="text-gray-600 leading-relaxed">{g.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AboutGoals;
