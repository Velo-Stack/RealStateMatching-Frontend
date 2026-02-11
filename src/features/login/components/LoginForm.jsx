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
        className="mb-6 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 text-right flex items-center gap-3"
      >
        <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
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
