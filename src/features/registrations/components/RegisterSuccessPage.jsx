import { Link } from "react-router-dom";
import { CheckCircle } from "phosphor-react";

const RegisterSuccessPage = () => {
  const base = import.meta.env.BASE_URL || "/";
  const brandImageSrc = `${base}rawash-black.png`;

  return (
    <div className="login-page min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#faf7f0] via-[#f5f0e1] to-[#ede7d5]" dir="rtl">
      <div className="w-full max-w-md bg-[#eef2f7]/95 backdrop-blur-2xl border border-slate-300/80 rounded-3xl p-8 text-center shadow-2xl shadow-slate-900/10">
        <Link to="/" className="inline-block mb-4">
          <img src={brandImageSrc} alt="Rawash" className="h-16 mx-auto object-contain" />
        </Link>
        <CheckCircle size={56} className="mx-auto text-[#b8962e] mb-4" weight="fill" />
        <h1 className="text-2xl font-bold text-slate-900 mb-2">تم استلام طلبك بنجاح</h1>
        <p className="text-slate-600 text-sm leading-relaxed font-medium">
          طلب التسجيل قيد المراجعة من فريق الإدارة. ستتمكن من تسجيل الدخول فور الموافقة على حسابك.
        </p>
        <Link
          to="/login"
          className="inline-block mt-6 rounded-2xl px-6 py-3 text-sm font-bold text-[#1c1408] bg-gradient-to-r from-[#e7c25a] via-[#d4af37] to-[#b8962e] shadow-md hover:brightness-105 transition-all"
        >
          العودة لتسجيل الدخول
        </Link>
      </div>
    </div>
  );
};

export default RegisterSuccessPage;
