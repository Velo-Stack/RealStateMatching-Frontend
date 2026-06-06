import { Link } from "react-router-dom";
import { CheckCircle } from "phosphor-react";

const RegisterSuccessPage = () => (
  <div className="login-page min-h-screen flex items-center justify-center p-4">
    <div className="w-full max-w-md bg-[#111827]/80 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 text-center shadow-2xl">
      <CheckCircle size={56} className="mx-auto text-emerald-400 mb-4" weight="fill" />
      <h1 className="text-2xl font-bold text-white mb-2">تم استلام طلبك</h1>
      <p className="text-slate-400 text-sm leading-relaxed">
        طلب التسجيل قيد المراجعة من فريق الإدارة. ستتمكن من تسجيل الدخول بعد الموافقة على حسابك.
      </p>
      <Link
        to="/login"
        className="inline-block mt-6 theme-button-primary rounded-xl px-6 py-2.5 text-sm font-bold"
      >
        العودة لتسجيل الدخول
      </Link>
    </div>
  </div>
);

export default RegisterSuccessPage;
