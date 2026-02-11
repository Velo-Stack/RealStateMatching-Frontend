import { motion } from "framer-motion";
import { LOGIN_TEXT } from "../constants/loginConstants";
import { useLogin } from "../hooks/useLogin";
import LoginForm from "./LoginForm";
import LoginHeader from "./LoginHeader";

const LoginPage = () => {
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
  const currentTheme =
    document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
  const logoSrc = currentTheme === "light" ? "/logo-black.png" : "/logo-white.png";

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
          className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-emerald-500/20 to-cyan-500/10 blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            x: [0, -30, 0],
            y: [0, 40, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-cyan-500/15 to-emerald-500/5 blur-3xl"
        />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-50" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="login-card bg-[#111827]/80 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl shadow-black/20">
          <LoginHeader />

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="flex justify-center mb-8"
          >
            <div className="relative h-20 w-20 flex items-center justify-center">
              <img src={logoSrc} alt="رواسخ العقارية" className="h-20 w-20 object-contain" />
            </div>
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
        </div>

        <p className="text-center text-slate-600 text-xs mt-6">{LOGIN_TEXT.footer}</p>
      </motion.div>
    </div>
  );
};

export default LoginPage;
