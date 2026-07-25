import { useState } from "react";
import { toast } from "sonner";
import axios from "axios";
import { ArrowLeft } from "lucide-react";
import PhoneInput from "../../../../components/common/PhoneInput";
import "./InterestForm.css";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

const InterestForm = ({ projectId, unitId, unitCode, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    note: "",
  });

  const [touched, setTouched] = useState({ phone: false });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    setFormData({ ...formData, phone: value });
  };

  const handlePhoneBlur = () => {
    setTouched({ ...touched, phone: true });
  };

  const getPhoneError = () => {
    if (!formData.phone) return "رقم الجوال مطلوب";
    if (formData.phone.length !== 9) return "يجب أن يكون رقم الجوال 9 أرقام";
    if (!formData.phone.startsWith("5")) return "يجب أن يبدأ رقم الجوال بـ 5";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (getPhoneError()) {
      setTouched({ phone: true });
      toast.error("يرجى التأكد من ادخال رقم الجوال بشكل صحيح");
      return;
    }

    setIsSubmitting(true);
    try {
      await axios.post(`${API_BASE}/public/projects/${projectId}/interest`, {
        name: formData.name.trim(),
        phone: formData.phone,
        email: formData.email.trim() || undefined,
        note: formData.note.trim() || undefined,
        unitId: unitId || undefined,
      });

      toast.success(
        "شكراً لاهتمامك! تم إرسال طلبك بنجاح وسيتواصل معك فريقنا قريباً. 🎉"
      );

      if (onSubmit) onSubmit({ ...formData, projectId, unitId });
      setFormData({ name: "", phone: "", email: "", note: "" });
      setTouched({ phone: false });
    } catch (err) {
      toast.error(
        err?.response?.data?.error || "حدث خطأ، يرجى المحاولة مجدداً"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      id="interest-form-section"
      className="rounded-2xl border border-gray-100 bg-white p-5 shadow-[0_10px_30px_rgba(0,0,0,0.05)] sm:p-7 md:p-8 font-cairo"
      dir="rtl"
    >
      <div className="mb-6">
        <h2 className="flex items-center gap-2.5 text-xl font-bold text-gray-900 sm:text-2xl">
          <span className="inline-block h-5 w-1.5 rounded-full bg-[#9d7857]" />
          سجل اهتمامك
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          سيتواصل معك فريق رواسخ خلال 24 ساعة
        </p>
        {unitCode && (
          <div className="mt-3 inline-flex rounded-full bg-[#9d7857]/10 px-4 py-1.5 text-sm font-semibold text-[#9d7857]">
            الوحدة المختارة: {unitCode}
          </div>
        )}
      </div>

      <div className="mb-6 h-px bg-gradient-to-l from-transparent via-gray-200 to-transparent" />

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-gray-700">
              الاسم <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="اكتب اسمك بالكامل"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
              className="interest-input"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-gray-700">
              رقم الجوال <span className="text-rose-500">*</span>
            </label>
            <PhoneInput
              name="phone"
              value={formData.phone}
              onChange={handlePhoneChange}
              onBlur={handlePhoneBlur}
              error={getPhoneError()}
              touched={touched.phone}
              placeholder="5xxxxxxxx"
              required
              variant="plain"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-gray-700">
              الإيميل <span className="font-normal text-gray-400">(اختياري)</span>
            </label>
            <input
              type="email"
              placeholder="name@example.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="interest-input"
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-gray-700">
            ملاحظات إضافية{" "}
            <span className="font-normal text-gray-400">(اختياري)</span>
          </label>
          <textarea
            placeholder="اكتب أي تفاصيل إضافية تود مشاركتها..."
            value={formData.note}
            onChange={(e) =>
              setFormData({ ...formData, note: e.target.value })
            }
            rows={4}
            className="interest-input resize-none"
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="interest-submit-btn disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <svg
                  className="h-4 w-4 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.37 0 0 5.37 0 12h4z"
                  />
                </svg>
                <span>جاري الإرسال...</span>
              </>
            ) : (
              <>
                <span>إرسال الطلب</span>
                <ArrowLeft className="h-4 w-4" strokeWidth={2.4} />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default InterestForm;
