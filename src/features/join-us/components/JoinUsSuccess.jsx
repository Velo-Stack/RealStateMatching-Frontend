import { JOIN_US_COLORS } from '../constants/joinUsConstants';

const JoinUsSuccess = ({ onReset }) => {
  const pageUrl = `${window.location.origin}${(import.meta.env.BASE_URL || '/').replace(/\/$/, '')}/join-us`;
  const shareText = `انضم إلى فريق رواسخ العقارية! 🏢\n\nقدّم طلبك عبر استبيان تمكين الوسطاء العقاريين:\n${pageUrl}`;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;

  return (
    <div className="text-center py-8 px-4" dir="rtl">
      <div
        className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center text-2xl text-white"
        style={{ backgroundColor: JOIN_US_COLORS.green }}
      >
        ✓
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-3">تم إرسال طلبك بنجاح!</h2>
      <p className="text-gray-600 mb-8 max-w-md mx-auto">
        شكراً لتقديمك. سيقوم فريقنا بمراجعة طلبك والتواصل معك قريباً.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center px-6 py-3 rounded-xl text-white font-medium transition-opacity hover:opacity-90"
          style={{ backgroundColor: '#25D366' }}
        >
          شارك مع أصدقائك عبر واتساب
        </a>
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center justify-center px-6 py-3 rounded-xl border-2 font-medium transition-colors"
          style={{ borderColor: JOIN_US_COLORS.green, color: JOIN_US_COLORS.green }}
        >
          تقديم طلب آخر
        </button>
      </div>
    </div>
  );
};

export default JoinUsSuccess;
