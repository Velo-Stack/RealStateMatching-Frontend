import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { House } from "phosphor-react";
import { useAuth } from "../../../context/AuthContext";
import { LOGIN_TEXT } from "../constants/loginConstants";
import { useLogin } from "../hooks/useLogin";
import LoginForm from "./LoginForm";
import { fetchSelfRegistrationStatus } from "../../registrations/services/registrationsApi";

const LoginPage = () => {
  const { user, loading } = useAuth();
  const [registrationEnabled, setRegistrationEnabled] = useState(false);
  const {
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    setShowPassword,
    error,
    submitting,
    handleSubmit,
  } = useLogin();

  useEffect(() => {
    let isMounted = true;
    document.documentElement.setAttribute("data-theme", "light");
    fetchSelfRegistrationStatus()
      .then((data) => {
        if (isMounted) setRegistrationEnabled(Boolean(data?.enabled));
      })
      .catch(() => {
        if (isMounted) setRegistrationEnabled(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  if (!loading && user) {
    return <Navigate to="/app" replace />;
  }

  const base = import.meta.env.BASE_URL || "/";
  const brandImageSrc = `${base}rawash-black.png`;

  return (
    <div className="login-page min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-[#fbf8f0] via-[#f7f4ea] to-[#f2eee2]">
      {/* Light, memory-efficient ambient glow background without infinite Framer Motion loops */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[450px] h-[450px] rounded-full bg-gradient-to-br from-[rgba(212,175,55,0.15)] to-[rgba(184,150,46,0.05)] blur-2xl transform-gpu" />
        <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-[rgba(212,175,55,0.12)] to-[rgba(184,150,46,0.03)] blur-2xl transform-gpu" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md p-4"
      >
        <div
          className="login-card relative overflow-hidden rounded-3xl border border-slate-300/80 bg-white/95 sm:bg-[#eef2f7]/95 p-8 shadow-xl shadow-slate-900/10 backdrop-blur-md"
        >
          <div
            className="absolute inset-x-8 top-0 h-px"
            style={{
              background:
                "linear-gradient(to right, transparent, #d4af37, transparent)",
              opacity: 0.6,
            }}
          />

          <div className="flex justify-center mb-6">
            <Link
              to="/"
              aria-label="الذهاب إلى الموقع التعريفي"
              className="relative flex w-full items-center justify-center rounded-lg outline-none transition-opacity hover:opacity-90"
            >
              <img
                src={brandImageSrc}
                alt="Rawash"
                className="h-20 w-full max-w-[19rem] object-contain"
              />
            </Link>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="mb-8 text-center"
          >
            <h1 className="login-title mb-1.5 text-slate-900 text-2xl font-extrabold">
              {LOGIN_TEXT.title}
            </h1>
            <p className="login-subtitle text-sm text-slate-600 font-medium">{LOGIN_TEXT.subtitle}</p>
          </motion.div>

          <LoginForm
            error={error}
            email={email}
            onEmailChange={(event) => setEmail(event.target.value)}
            password={password}
            onPasswordChange={(event) => setPassword(event.target.value)}
            showPassword={showPassword}
            onToggleShowPassword={() => setShowPassword(!showPassword)}
            submitting={submitting}
            onSubmit={handleSubmit}
          />

          {registrationEnabled ? (
            <p className="text-center text-slate-600 text-sm mt-6">
              ليس لديك حساب؟{" "}
              <Link
                to="/register"
                className="font-bold text-[#b8962e] hover:text-[#967720] transition-colors"
              >
                إنشاء حساب جديد
              </Link>
            </p>
          ) : null}

          <div className="mt-6 pt-6 border-t border-slate-300/60">
            <Link
              to="/"
              className="group flex items-center justify-center gap-2 w-full rounded-2xl border border-slate-300 bg-white py-3 text-sm font-semibold text-slate-800 shadow-sm transition-all hover:bg-slate-50 hover:border-slate-400 hover:text-slate-950"
            >
              <House size={18} weight="duotone" className="transition-colors text-slate-600 group-hover:text-[#b8962e]" />
              العودة للموقع الرئيسي
            </Link>
          </div>
        </div>

        <p className="text-center text-slate-600 text-xs font-medium mt-6">{LOGIN_TEXT.footer}</p>
      </motion.div>
    </div>
  );
};

export default LoginPage;
