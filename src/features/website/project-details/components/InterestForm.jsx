import { useState } from "react";
import { toast } from "sonner";
import axios from "axios";
import PhoneInput from "../../../../components/common/PhoneInput";

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

      toast.success("شكراً لاهتمامك! تم إرسال طلبك بنجاح وسيتواصل معك فريقنا قريباً. 🎉");

      if (onSubmit) onSubmit({ ...formData, projectId, unitId });
      setFormData({ name: "", phone: "", email: "", note: "" });
      setTouched({ phone: false });
    } catch (err) {
      toast.error(err?.response?.data?.error || "حدث خطأ، يرجى المحاولة مجدداً");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white py-10" dir="rtl">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-[#1f1f1f] mb-2">سجل اهتمامك</h2>
        {unitCode && (
          <div className="inline-block mt-2 bg-[#9d7857]/10 text-[#9d7857] px-4 py-1.5 rounded-full text-sm font-semibold">
            الوحدة المختارة: {unitCode}
          </div>
        )}
        <p className="text-gray-500 text-sm mt-3">
          سيتواصل معك فريق رواسخ خلال 24 ساعة
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 max-w-4xl mx-auto">
          <div>
            <input
              type="text"
              placeholder="الإسم*"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="w-full px-5 py-4 bg-white rounded-xl outline-none text-gray-800 placeholder-gray-400 transition-all text-base border-2 border-gray-200 focus:border-[#9d7857]"
            />
          </div>

          <div>
            <PhoneInput
              name="phone"
              value={formData.phone}
              onChange={handlePhoneChange}
              onBlur={handlePhoneBlur}
              error={getPhoneError()}
              touched={touched.phone}
              placeholder="5xxxxxxxx"
              required
            />
          </div>

          <div>
            <input
              type="email"
              placeholder="الإيميل (اختياري)"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-5 py-4 bg-white rounded-xl outline-none text-gray-800 placeholder-gray-400 transition-all text-base border-2 border-gray-200 focus:border-[#9d7857]"
            />
          </div>
        </div>

        <div className="mb-8 max-w-4xl mx-auto">
          <textarea
            placeholder="ملاحظات إضافية (اختياري)"
            value={formData.note}
            onChange={(e) => setFormData({ ...formData, note: e.target.value })}
            rows={3}
            className="w-full px-5 py-4 bg-white rounded-xl outline-none text-gray-800 placeholder-gray-400 transition-all text-base border-2 border-gray-200 focus:border-[#9d7857] resize-none"
          />
        </div>

        <div className="text-center">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-[#9d7857] hover:bg-[#856345] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold px-10 py-4 rounded-2xl transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 text-base inline-flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.37 0 0 5.37 0 12h4z"/>
                </svg>
                <span>جاري الإرسال...</span>
              </>
            ) : (
              <>
                <span>إرسال الطلب</span>
                <span>←</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default InterestForm;
