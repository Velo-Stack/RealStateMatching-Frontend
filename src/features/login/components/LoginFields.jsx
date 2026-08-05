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
      <label className="block mb-2 text-xs font-bold text-slate-700 text-right">
        {LOGIN_TEXT.emailLabel}
      </label>
      <div
        dir="ltr"
        className="login-input-shell flex items-center rounded-2xl border border-slate-300 bg-white transition-all duration-300 hover:border-[#c79a32] focus-within:border-[#c79a32] focus-within:ring-2 focus-within:ring-[#c79a32]/20 shadow-sm"
      >
        <span className="flex items-center pl-4 text-slate-500">
          <EnvelopeSimple size={19} />
        </span>
        <input
          type="email"
          className="login-input min-w-0 flex-1 border-none bg-transparent py-3.5 pl-3 pr-4 text-sm text-slate-900 placeholder-slate-400 outline-none font-medium"
          value={email}
          onChange={onEmailChange}
          placeholder={LOGIN_TEXT.emailPlaceholder}
          autoComplete="email"
          required
          dir="ltr"
        />
      </div>
    </div>

    <div>
      <label className="block mb-2 text-xs font-bold text-slate-700 text-right">
        {LOGIN_TEXT.passwordLabel}
      </label>
      <div
        dir="ltr"
        className="login-input-shell flex items-center rounded-2xl border border-slate-300 bg-white transition-all duration-300 hover:border-[#c79a32] focus-within:border-[#c79a32] focus-within:ring-2 focus-within:ring-[#c79a32]/20 shadow-sm"
      >
        <span className="flex items-center pl-4 text-slate-500">
          <Lock size={19} />
        </span>
        <input
          type={showPassword ? "text" : "password"}
          className="login-input min-w-0 flex-1 border-none bg-transparent py-3.5 pl-3 pr-2 text-sm text-slate-900 placeholder-slate-400 outline-none font-medium"
          value={password}
          onChange={onPasswordChange}
          placeholder={LOGIN_TEXT.passwordPlaceholder}
          autoComplete="current-password"
          required
          dir="ltr"
        />
        <button
          type="button"
          onClick={onToggleShowPassword}
          aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
          className="flex items-center pl-2 pr-4 text-slate-500 transition-colors hover:text-[#b8962e]"
        >
          {showPassword ? <EyeSlash size={19} /> : <Eye size={19} />}
        </button>
      </div>
    </div>
  </>
);

export default LoginFields;
