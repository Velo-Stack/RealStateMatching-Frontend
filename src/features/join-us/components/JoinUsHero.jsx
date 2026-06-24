import { useEffect, useState } from 'react';
import { JOIN_US_COLORS } from '../constants/joinUsConstants';

const JoinUsHero = () => {
  const base = import.meta.env.BASE_URL || '/';
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(id);
  }, []);

  return (
    <section className="relative mt-20 min-h-[42vh] md:min-h-[50vh] flex items-end overflow-hidden">
      <div
        className={`absolute inset-0 bg-cover bg-center transition-transform duration-[12000ms] ease-out ${
          mounted ? 'scale-[1.08]' : 'scale-100'
        }`}
        style={{
          backgroundImage: `url(${base}images/join-us-hero.webp)`,
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to top, rgba(26,51,16,0.92) 0%, rgba(45,80,22,0.65) 45%, rgba(45,80,22,0.25) 100%)',
        }}
      />

      <div className="relative w-full px-4 sm:px-6 md:px-16 py-12 md:py-16 text-right z-10" dir="rtl">
        <span
          className="inline-block text-xs md:text-sm font-semibold px-4 py-1.5 rounded-full mb-4 border"
          style={{
            color: JOIN_US_COLORS.gold,
            borderColor: 'rgba(201, 168, 76, 0.45)',
            backgroundColor: 'rgba(201, 168, 76, 0.12)',
          }}
        >
          استبيان تمكين الوسطاء العقاريين
        </span>

        <h1 className="mb-4">
          <span className="block text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-1">
            نحو العمل الاحترافي
          </span>
          <span
            className="block text-2xl md:text-3xl lg:text-4xl font-bold"
            style={{ color: JOIN_US_COLORS.gold }}
          >
            في السوق العقاري
          </span>
        </h1>

        <p className="text-white/85 text-sm md:text-base max-w-2xl leading-relaxed mb-6">
          أجب على أسئلة الاستبيان لنتمكن من تقديم أفضل الفرص والبرامج التي تناسب طموحاتك في السوق العقاري
        </p>

        <div className="flex flex-wrap gap-3 text-xs md:text-sm">
          <span className="px-3 py-1.5 rounded-full bg-white/10 text-white/90 backdrop-blur-sm border border-white/15">
            4 خطوات سهلة
          </span>
          <span className="px-3 py-1.5 rounded-full bg-white/10 text-white/90 backdrop-blur-sm border border-white/15">
            مراجعة خلال 48 ساعة
          </span>
          <span className="px-3 py-1.5 rounded-full bg-white/10 text-white/90 backdrop-blur-sm border border-white/15">
            بياناتك محمية ومشفرة
          </span>
        </div>
      </div>
    </section>
  );
};

export default JoinUsHero;
