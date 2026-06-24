import { JOIN_US_COLORS } from '../constants/joinUsConstants';

const JoinUsHero = () => {
  const base = import.meta.env.BASE_URL || '/';

  return (
    <section className="relative mt-20 min-h-[280px] md:min-h-[340px] flex items-end overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.55)), url(${base}images/join-us-hero.webp), linear-gradient(135deg, #1a3310 0%, #2D5016 50%, #1a3310 100%)`,
        }}
      />
      <div className="relative w-full px-4 sm:px-6 md:px-16 py-10 md:py-14 text-right" dir="rtl">
        <p className="text-sm md:text-base mb-2" style={{ color: JOIN_US_COLORS.gold }}>
          استبيان تمكين الوسطاء العقاريين
        </p>
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3">
          نحو العمل الاحترافي في السوق العقاري
        </h1>
        <p className="text-white/90 text-sm md:text-base max-w-2xl leading-relaxed">
          أجب على أسئلة الاستبيان لنتمكن من تقديم أفضل الفرص والبرامج التي تناسب طموحاتك في السوق العقاري
        </p>
      </div>
    </section>
  );
};

export default JoinUsHero;
