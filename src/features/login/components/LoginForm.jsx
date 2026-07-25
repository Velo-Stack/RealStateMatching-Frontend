import { motion } from "framer-motion";
import LoginFields from "./LoginFields";
import SubmitButton from "./SubmitButton";

const LoginForm = ({
  error,
  email,
  onEmailChange,
  password,
  onPasswordChange,
  showPassword,
  onToggleShowPassword,
  submitting,
  onSubmit,
}) => (
  <>
    {error && (
      <motion.div
        initial={{ opacity: 0, y: -10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        style={{
          backgroundColor: "var(--danger-bg)",
          borderColor: "var(--danger-border)",
          color: "var(--danger)",
        }}
        className="mb-6 flex items-center gap-3 rounded-xl border px-4 py-3 text-right text-sm"
      >
        <span
          style={{ backgroundColor: "var(--danger)" }}
          className="h-2 w-2 shrink-0 animate-pulse rounded-full"
        />
        {error}
      </motion.div>
    )}

    <form onSubmit={onSubmit} className="space-y-5">
      <LoginFields
        email={email}
        onEmailChange={onEmailChange}
        password={password}
        onPasswordChange={onPasswordChange}
        showPassword={showPassword}
        onToggleShowPassword={onToggleShowPassword}
      />
      <SubmitButton submitting={submitting} />
    </form>
  </>
);

export default LoginForm;
