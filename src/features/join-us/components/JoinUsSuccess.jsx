import { useEffect } from 'react';
import { motion as Motion } from 'framer-motion';
import { CheckCircle, WhatsappLogo } from 'phosphor-react';
import { JOIN_US_COLORS } from '../constants/joinUsConstants';

const Confetti = () => (
  <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
    {Array.from({ length: 24 }).map((_, i) => (
      <span
        key={i}
        className="absolute w-2 h-2 rounded-sm animate-join-confetti"
        style={{
          left: `${(i * 17) % 100}%`,
          top: '-8px',
          backgroundColor: i % 2 === 0 ? JOIN_US_COLORS.gold : JOIN_US_COLORS.green,
          animationDelay: `${(i % 8) * 0.12}s`,
          animationDuration: `${1.8 + (i % 5) * 0.2}s`,
        }}
      />
    ))}
  </div>
);

const JoinUsSuccess = ({ onReset }) => {
  const pageUrl = `${window.location.origin}${(import.meta.env.BASE_URL || '/').replace(/\/$/, '')}/join-us`;
  const shareText = `السلام عليكم ورحمة الله وبركاته، أدعوك للمشاركة في استبيان رواسخ العقارية لتمكين الوسطاء العقاريين.\n\nسجّل بياناتك من هنا:\n${pageUrl}`;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes join-confetti-fall {
        0% { transform: translateY(0) rotate(0deg); opacity: 1; }
        100% { transform: translateY(420px) rotate(720deg); opacity: 0; }
      }
      .animate-join-confetti { animation: join-confetti-fall linear forwards; }
    `;
    document.head.appendChild(style);
    return () => style.remove();
  }, []);

  return (
    <div className="relative text-center py-10 px-4 md:px-8" dir="rtl">
      <Confetti />

      <Motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 18 }}
        className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center shadow-xl"
        style={{ backgroundColor: JOIN_US_COLORS.green }}
      >
        <CheckCircle size={44} weight="fill" className="text-white" />
      </Motion.div>

      <Motion.h2
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="text-2xl md:text-3xl font-bold text-gray-900 mb-3"
      >
        تم إرسال طلبك بنجاح!
      </Motion.h2>

      <span
        className="inline-block text-sm font-semibold px-4 py-1.5 rounded-full mb-4"
        style={{
          backgroundColor: 'rgba(201, 168, 76, 0.15)',
          color: '#8a6d2b',
          border: '1px solid rgba(201, 168, 76, 0.35)',
        }}
      >
        سنتواصل معك خلال 48 ساعة عمل
      </span>

      <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
        شكراً لثقتك برواسخ العقارية. سيقوم فريقنا بمراجعة طلبك بعناية والتواصل معك قريباً.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl text-white font-semibold transition-all hover:opacity-95 shadow-lg"
          style={{ backgroundColor: '#25D366' }}
        >
          <WhatsappLogo size={22} weight="fill" />
          شارك الاستبيان عبر واتساب
        </a>
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center justify-center px-6 py-3.5 rounded-2xl border-2 font-semibold transition-colors hover:bg-[#f0f7ed]"
          style={{ borderColor: JOIN_US_COLORS.green, color: JOIN_US_COLORS.green }}
        >
          تقديم طلب آخر
        </button>
      </div>
    </div>
  );
};

export default JoinUsSuccess;
