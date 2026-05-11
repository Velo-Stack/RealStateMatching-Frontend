import { useState } from "react";
import PhoneInput from "../../../../components/common/PhoneInput";

const InterestForm = ({ projectId, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
  });

  const [touched, setTouched] = useState({
    phone: false,
  });

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit({ ...formData, projectId });
    }
  };

  return (
    <div className="bg-white py-12" dir="rtl">
      
      <h2 className="text-3xl font-bold text-[#1f1f1f] mb-10 text-center">
        سجل اهتمامك
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="grid md:grid-cols-3 gap-6 mb-8 max-w-5xl mx-auto">
          
          <div className="relative">
            <input
              type="text"
              placeholder="الإسم*"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              style={{ borderColor: '#000', borderWidth: '2px' }}
              className="w-full px-5 py-4 bg-white rounded-xl outline-none text-gray-800 placeholder-gray-400 focus:!border-[#9d7857] transition-all text-base"
            />
          </div>

          <div className="relative">
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

          <div className="relative">
            <input
              type="email"
              placeholder="الإيميل*"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              style={{ borderColor: '#000', borderWidth: '2px' }}
              className="w-full px-5 py-4 bg-white rounded-xl outline-none text-gray-800 placeholder-gray-400 focus:!border-[#9d7857] transition-all text-base"
            />
          </div>

        </div>

        <div className="text-center">
          <button 
            type="submit"
            className="text-[#9d7857] font-medium text-base hover:text-[#8a6849] transition-colors inline-flex items-center gap-2"
          >
            <span>إرسال الطلب</span>
            <span>←</span>
          </button>
        </div>
      </form>

    </div>
  );
};

export default InterestForm;
