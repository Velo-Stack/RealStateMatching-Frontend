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
    fetchSelfRegistrationStatus()
      .then((data) => setRegistrationEnabled(Boolean(data?.enabled)))
      .catch(() => setRegistrationEnabled(false));
  }, []);

  if (!loading && user) {
    return <Navigate to="/app" replace />;
  }

  const currentTheme =
    document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
  const base = import.meta.env.BASE_URL || "/";
  const brandImageSrc =
    currentTheme === "light"
      ? `${base}rawash-black.png`
      : `${base}rawash-white.png`;

  return (
    <div className="login-page min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-[rgba(212,175,55,0.22)] to-[rgba(184,150,46,0.08)] blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            x: [0, -30, 0],
            y: [0, 40, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-[rgba(212,175,55,0.18)] to-[rgba(184,150,46,0.06)] blur-3xl"
        />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-50" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md"
      >
        <div
          className="login-card relative overflow-hidden rounded-3xl border border-white/10 bg-[#111827]/80 p-8 shadow-2xl shadow-black/20 backdrop-blur-2xl"
        >
          <div
            className="absolute inset-x-8 top-0 h-px"
            style={{
              background:
                "linear-gradient(to right, transparent, var(--accent), transparent)",
              opacity: 0.6,
            }}
          />

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="flex justify-center mb-6"
          >
            <Link
              to="/"
              aria-label="الذهاب إلى الموقع التعريفي"
              className="relative flex w-full items-center justify-center rounded-lg outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#111827]"
              style={{ "--tw-ring-color": "var(--accent)" }}
            >
              <img
                src={brandImageSrc}
                alt="Rawash"
                className="h-20 w-full max-w-[19rem] object-contain"
              />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="mb-8 text-center"
          >
            <h1 className="login-title mb-1.5 bg-gradient-to-l from-[var(--accent-light)] to-[var(--accent-dark)] bg-clip-text text-2xl font-bold text-transparent">
              {LOGIN_TEXT.title}
            </h1>
            <p className="login-subtitle text-sm text-slate-400">{LOGIN_TEXT.subtitle}</p>
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
            <p className="text-center text-slate-400 text-sm mt-6">
              ليس لديك حساب؟{" "}
              <Link
                to="/register"
                className="font-semibold transition-colors"
                style={{ color: "var(--accent-light)" }}
              >
                إنشاء حساب جديد
              </Link>
            </p>
          ) : null}

          <div className="mt-6 pt-6 border-t border-white/10">
            <Link
              to="/"
              className="group flex items-center justify-center gap-2 w-full rounded-xl border border-white/10 bg-white/5 py-3 text-sm text-slate-300 transition-all hover:border-[color:var(--accent)]/40 hover:bg-white/10 hover:text-white"
            >
              <House size={18} weight="duotone" className="transition-colors group-hover:text-[var(--accent)]" />
              العودة للموقع الرئيسي
            </Link>
          </div>
        </div>

        <p className="text-center text-slate-500 text-xs mt-6">{LOGIN_TEXT.footer}</p>
      </motion.div>
    </div>
  );
};

export default LoginPage;
