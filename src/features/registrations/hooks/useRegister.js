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
    birthDate: "",
    password: "",
    confirmPassword: "",
    officeName: "",
    licenseNumber: "",
    cityId: "",
    notes: "",
    nationalIdNumber: "",
    nationalIdFile: null,
    valLicenseFile: null,
    falLicenseNumber: "",
    falLicenseExpiry: "",
    agreedToTerms: false,
    pledgeCorrectData: false,
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const updateField = (field, value) => {
    setError("");
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    setError("");
    setStep((prev) => prev + 1);
  };
  const prevStep = () => {
    setError("");
    setStep((prev) => Math.max(0, prev - 1));
  };

  const submit = async (event) => {
    if (event && event.preventDefault) event.preventDefault();
    if (submitting) return;

    if (!form.birthDate) {
      setError("تاريخ الميلاد مطلوب");
      return;
    }

    if (!form.nationalIdNumber?.trim()) {
      setError("رقم الهوية الشخصية / الوطنية مطلوب");
      return;
    }

    if (!form.nationalIdFile) {
      setError("إرفاق ملف/صورة الهوية الشخصية مطلوب");
      return;
    }

    if (!form.agreedToTerms) {
      setError("يجب الموافقة على الشروط والأحكام");
      return;
    }

    if (!form.pledgeCorrectData) {
      setError("يجب الموافقة والتعهد بأن جميع البيانات المدخلة صحيحة");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("كلمة المرور غير متطابقة");
      return;
    }

    setError("");
    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("type", form.type);
      formData.append("name", form.name);
      formData.append("email", form.email);
      formData.append("phone", form.phone);
      formData.append("birthDate", form.birthDate);
      formData.append("password", form.password);
      formData.append("nationalIdNumber", form.nationalIdNumber.trim());
      formData.append("agreedToTerms", "true");
      formData.append("pledgeCorrectData", "true");

      if (form.type === "OFFICE") {
        if (form.officeName) formData.append("officeName", form.officeName);
        if (form.licenseNumber) formData.append("licenseNumber", form.licenseNumber);
      }
      if (form.cityId) formData.append("cityId", form.cityId);
      if (form.notes) formData.append("notes", form.notes);

      if (form.nationalIdFile) {
        formData.append("national_id", form.nationalIdFile);
      }

      if (form.valLicenseFile) {
        formData.append("val_license", form.valLicenseFile);
      }
      if (form.falLicenseNumber) {
        formData.append("falLicenseNumber", form.falLicenseNumber);
      }
      if (form.falLicenseExpiry) {
        formData.append("falLicenseExpiry", form.falLicenseExpiry);
      }

      await registerAccount(formData);
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
    setError,
    submitting,
    submit,
  };
};
