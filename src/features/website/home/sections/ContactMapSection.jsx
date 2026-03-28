const ContactMapSection = () => {
  return (
    <section className="font-cairo" dir="rtl">

      {/* Map with floating card overlay */}
      <div className="relative">

        {/* Map */}
        <div className="w-full h-[700px] md:h-[550px] grayscale hover:grayscale-0 transition-all duration-700">
          <iframe
            src="https://www.google.com/maps?q=Riyadh,Saudi+Arabia&output=embed"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            title="موقعنا على الخريطة"
          />
        </div>

        {/* Floating contact info card over the map */}
        <div className="absolute bottom-0 right-0 md:right-16 md:bottom-10 z-20
                        bg-white shadow-2xl p-8 md:p-10 w-full md:w-[380px]
                        border-t-4 border-[#9d7857]">
          <p className="text-[#9d7857] text-xs tracking-[3px] uppercase mb-3 font-light">تواصل معنا</p>
          <h3 className="text-2xl font-bold text-slate-900 mb-6 leading-snug">
            نحن هنا لمساعدتك في كل خطوة
          </h3>

          {/* Contact rows */}
          <div className="space-y-4 text-sm text-gray-600">

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 flex items-center justify-center bg-[#9d7857]/10 text-[#9d7857] flex-shrink-0">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.3 3.18 2 2 0 0 1 3.22 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 8.09a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 15l.92 1.92z" />
                </svg>
              </div>
              <span dir="ltr" className="text-right">+966 54 616 6418</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 flex items-center justify-center bg-[#9d7857]/10 text-[#9d7857] flex-shrink-0">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </div>
              <span>info@rawasikh.com</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 flex items-center justify-center bg-[#9d7857]/10 text-[#9d7857] flex-shrink-0">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <span>الرياض، المملكة العربية السعودية</span>
            </div>

          </div>

          {/* WhatsApp CTA button */}
          <a
            href="https://wa.me/966546166418"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 w-full bg-[#9d7857] text-white py-3 px-6 text-sm font-semibold
                       hover:bg-[#8a6a4a] transition-all duration-300 tracking-wide
                       flex items-center justify-center gap-3 group"
          >
            {/* WhatsApp Icon */}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.558 4.118 1.528 5.845L.057 23.5l5.803-1.522A11.95 11.95 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.797 9.797 0 0 1-5.031-1.386l-.361-.214-3.44.902.918-3.354-.234-.375A9.818 9.818 0 0 1 2.182 12C2.182 6.57 6.57 2.182 12 2.182c5.43 0 9.818 4.388 9.818 9.818 0 5.43-4.388 9.818-9.818 9.818z"/>
            </svg>
            تواصل معنا عبر الواتساب
            <span className="transition-transform duration-300 group-hover:-translate-x-1">←</span>
          </a>

        </div>
      </div>

      {/* Bottom CTA banner */}
      <div className="relative bg-[#1a1a1a] py-16 px-6 md:px-20 text-center overflow-hidden">

        {/* Decorative lines */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-[#9d7857] to-transparent" />

        {/* Background pattern (subtle) */}
        <div className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: "repeating-linear-gradient(45deg, #9d7857 0, #9d7857 1px, transparent 0, transparent 50%)",
            backgroundSize: "20px 20px",
          }}
        />

        <div className="relative z-10">
          <p className="text-[#9d7857] text-xs tracking-[4px] uppercase mb-5 font-light">شريكك العقاري الموثوق</p>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
            تواصل معنا لتحقيق
            <span className="text-[#9d7857]"> حلمك العقاري</span>
          </h2>
          <p className="max-w-xl mx-auto text-gray-400 leading-relaxed mb-10 text-sm md:text-base">
            لا تتردد في التواصل معنا للحصول على استشارة مجانية أو لمعرفة المزيد عن أحدث مشاريعنا العقارية.
            دعنا نكون شريكك في تحقيق أهدافك.
          </p>

          <div className="flex items-center justify-center">
            <button className="border border-white/20 text-white/80 px-8 py-3 text-sm font-semibold
                               hover:border-white hover:text-white transition-all duration-300 tracking-wide">
              تصفح العقارات
            </button>
          </div>
        </div>

      </div>

    </section>
  );
};

export default ContactMapSection;