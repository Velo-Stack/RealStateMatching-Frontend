import { LOGIN_TEXT } from "../constants/loginConstants";

const LoginHeader = () => (
  <div className="text-center mb-8">
    <h1
      className="login-title text-3xl font-bold mb-2"
      style={{ color: "var(--text-color)" }}
    >
      {LOGIN_TEXT.title}
    </h1>
    <p
      className="login-subtitle text-slate-400 text-3xl font-bold"
      style={{ color: "var(--brand-title-color)" }}
    >
      {LOGIN_TEXT.brandTitle}
    </p>
  </div>
);

export default LoginHeader;
