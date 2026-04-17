import { useState } from "react";
import "./InterestForm.css";

const InterestForm = ({ projectId, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
  });

  const [touched, setTouched] = useState({
    phone: false,
  });

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
    setIsSubmitting(true);
    if (onSubmit) {
      await onSubmit({ ...formData, projectId });
    }
    setIsSubmitting(false);
  };

  return (
    <section className="interest-form-section" dir="rtl">
      <div className="interest-form-container">
        {/* Header */}
        <div className="interest-form-header">
          <span className="interest-form-badge">تواصل معنا</span>
          <h2 className="interest-form-title">سجّل اهتمامك بالمشروع</h2>
          <p className="interest-form-subtitle">
            أدخل بياناتك وسيتواصل معك فريقنا في أقرب وقت
          </p>
        </div>

        {/* Form Card */}
        <div className="interest-form-card">
          <form onSubmit={handleSubmit} noValidate>
            <div className="interest-form-grid">

              {/* Name Field */}
              <div className="interest-field-group">
                <label className="interest-field-label" htmlFor="interest-name">
                  الاسم الكامل
                  <span className="interest-required">*</span>
                </label>
                <div className="interest-input-wrapper">
                  <input
                    id="interest-name"
                    type="text"
                    placeholder="أدخل اسمك الكامل"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                    className="interest-input"
                  />
                  <span className="interest-input-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                  </span>
                </div>
              </div>

              {/* Phone Field */}
              <div className="interest-field-group">
                <label className="interest-field-label" htmlFor="interest-phone">
                  رقم الجوال
                  <span className="interest-required">*</span>
                </label>
                <div className="interest-input-wrapper">
                  <input
                    id="interest-phone"
                    type="text"
                    inputMode="numeric"
                    maxLength={9}
                    placeholder="5xxxxxxxx"
                    value={formData.phone}
                    onChange={handlePhoneChange}
                    onBlur={handlePhoneBlur}
                    required
                    dir="ltr"
                    className={`interest-input interest-input--phone ${
                      touched.phone && getPhoneError() ? "interest-input--error" : ""
                    } ${
                      touched.phone && !getPhoneError() && formData.phone ? "interest-input--valid" : ""
                    }`}
                  />
                  <span className="interest-input-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.1 12.13 19.79 19.79 0 0 1 1 3.5 2 2 0 0 1 2.94 1.3h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 9a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16z"/>
                    </svg>
                  </span>
                </div>
                {touched.phone && getPhoneError() && (
                  <p className="interest-field-error">{getPhoneError()}</p>
                )}
              </div>

              {/* Email Field */}
              <div className="interest-field-group">
                <label className="interest-field-label" htmlFor="interest-email">
                  البريد الإلكتروني
                  <span className="interest-required">*</span>
                </label>
                <div className="interest-input-wrapper">
                  <input
                    id="interest-email"
                    type="email"
                    placeholder="example@email.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                    className="interest-input"
                    dir="ltr"
                  />
                  <span className="interest-input-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
                    </svg>
                  </span>
                </div>
              </div>

            </div>

            {/* Submit Button */}
            <div className="interest-form-submit-row">
              <button
                type="submit"
                className={`interest-submit-btn ${isSubmitting ? "interest-submit-btn--loading" : ""}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="interest-spinner" />
                    <span>جارٍ الإرسال...</span>
                  </>
                ) : (
                  <>
                    <span>إرسال الطلب</span>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12"/>
                      <polyline points="12 5 19 12 12 19"/>
                    </svg>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

    </section>
  );
};

export default InterestForm;
