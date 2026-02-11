import { Eye, EyeSlash, EnvelopeSimple, Lock } from "phosphor-react";
import { LOGIN_TEXT } from "../constants/loginConstants";

const LoginFields = ({
  email,
  onEmailChange,
  password,
  onPasswordChange,
  showPassword,
  onToggleShowPassword,
}) => (
  <>
    <div>
      <label className="block mb-2 text-sm font-medium text-slate-300">
        {LOGIN_TEXT.emailLabel}
      </label>
      <div className="relative">
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500">
          <EnvelopeSimple size={20} />
        </span>
        <input
          type="email"
          className="login-input w-full rounded-xl border border-white/10 bg-white/5 pr-12 pl-4 py-3.5 text-sm text-white placeholder-slate-500 outline-none transition-all duration-300 focus:border-emerald-500/50 focus:bg-white/10 focus:shadow-[0_0_20px_rgba(16,185,129,0.15)]"
          value={email}
          onChange={onEmailChange}
          placeholder={LOGIN_TEXT.emailPlaceholder}
          required
          dir="ltr"
        />
      </div>
    </div>

    <div>
      <label className="block mb-2 text-sm font-medium text-slate-300">
        {LOGIN_TEXT.passwordLabel}
      </label>
      <div className="relative">
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500">
          <Lock size={20} />
        </span>
        <input
          type={showPassword ? "text" : "password"}
          className="login-input w-full rounded-xl border border-white/10 bg-white/5 pr-12 pl-12 py-3.5 text-sm text-white placeholder-slate-500 outline-none transition-all duration-300 focus:border-emerald-500/50 focus:bg-white/10 focus:shadow-[0_0_20px_rgba(16,185,129,0.15)]"
          value={password}
          onChange={onPasswordChange}
          placeholder={LOGIN_TEXT.passwordPlaceholder}
          required
          dir="ltr"
        />
        <button
          type="button"
          onClick={onToggleShowPassword}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
        >
          {showPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
        </button>
      </div>
    </div>
  </>
);

export default LoginFields;
