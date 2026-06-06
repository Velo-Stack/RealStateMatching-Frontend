import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerAccount } from "../services/registrationsApi";

export const useRegister = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    type: "",
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    officeName: "",
    licenseNumber: "",
    cityId: "",
    notes: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => Math.max(0, prev - 1));

  const submit = async (event) => {
    event.preventDefault();
    if (submitting) return;

    if (form.password !== form.confirmPassword) {
      setError("كلمة المرور غير متطابقة");
      return;
    }

    setError("");
    setSubmitting(true);

    try {
      await registerAccount({
        type: form.type,
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
        officeName: form.type === "OFFICE" ? form.officeName : undefined,
        licenseNumber: form.type === "OFFICE" ? form.licenseNumber : undefined,
        cityId: form.cityId || undefined,
        notes: form.notes || undefined,
      });
      navigate("/register/success");
    } catch (err) {
      setError(err?.response?.data?.message || "تعذر إرسال طلب التسجيل");
    } finally {
      setSubmitting(false);
    }
  };

  return {
    step,
    setStep,
    form,
    updateField,
    nextStep,
    prevStep,
    error,
    submitting,
    submit,
  };
};
