import { useState } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { getLoginErrorMessage } from "../utils/loginUtils";
import { isProtectedAppPath } from "../../../utils/publicRoutes";

export const useLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (submitting) return;

    setError("");
    setSubmitting(true);

    try {
      await login(email, password);
      const redirectParam = searchParams.get("redirect");
      const fromPath = location.state?.from?.pathname;
      const target =
        redirectParam && isProtectedAppPath(redirectParam)
          ? redirectParam
          : fromPath && isProtectedAppPath(fromPath)
            ? fromPath
            : "/app";
      navigate(target, { replace: true });
    } catch (err) {
      setError(getLoginErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    setShowPassword,
    error,
    submitting,
    handleSubmit,
  };
};
