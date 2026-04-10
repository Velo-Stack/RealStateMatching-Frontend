const ContactMapSection = ({ content, settings = {} }) => {
  // طلب أبو سلطان: إخفاء رقم التواصل مؤقتًا، ونتركه هنا كتعليق لسهولة إرجاعه لاحقًا.
  // const phone = settings.contactPhone || "+9660500499849";
  const email = settings.contactEmail || "info@rawasikh.com";
  const address = settings.address || "الرياض، المملكة العربية السعودية";
  const mapUrl =
    settings.mapEmbedUrl ||
    "https://www.google.com/maps?q=Riyadh,Saudi+Arabia&output=embed";
  // طلب أبو سلطان: إخفاء رقم الواتساب مؤقتًا، ونتركه هنا كتعليق لسهولة إرجاعه لاحقًا.
  // const whatsappHref = settings.whatsappNumber
  //   ? `https://wa.me/${String(settings.whatsappNumber).replace(/[^\d]/g, "")}`
  //   : "https://wa.me/966500499849";

  return (
    <section className="font-cairo" dir="rtl">
      <div className="relative">
        <div className="h-[700px] w-full grayscale transition-all duration-700 hover:grayscale-0 md:h-[550px]">
          <iframe
            src={mapUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            title="موقعنا على الخريطة"
          />
        </div>

        <div className="absolute bottom-0 right-0 z-20 w-full border-t-4 border-[#9d7857] bg-white p-8 shadow-2xl md:bottom-10 md:right-16 md:w-[380px] md:p-10">
          <p className="mb-3 text-xs font-light uppercase tracking-[3px] text-[#9d7857]">
            {content?.subtitle || "تواصل معنا"}
          </p>
          <h3 className="mb-6 text-2xl font-bold leading-snug text-slate-900">
            {content?.title || "نحن هنا لمساعدتك في كل خطوة"}
          </h3>

          <div className="space-y-4 text-sm text-gray-600">
            {/* طلب أبو سلطان: إخفاء رقم التواصل مؤقتًا، ونترك الكود كتعليق لسهولة إرجاعه لاحقًا.
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center bg-[#9d7857]/10 text-[#9d7857]">
                ☎
              </div>
              <span dir="ltr" className="text-right">
                {phone}
              </span>
            </div>
            */}

            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center bg-[#9d7857]/10 text-[#9d7857]">
                ✉
              </div>
              <span>{email}</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center bg-[#9d7857]/10 text-[#9d7857]">
                ⌖
              </div>
              <span>{address}</span>
            </div>

            <div className="mt-2 h-px w-full bg-gradient-to-l from-[#9d7857]/40 via-[#9d7857]/10 to-transparent" />
          </div>

          {/* طلب أبو سلطان: إخفاء زر الواتساب مؤقتًا، ونترك الكود كتعليق لسهولة إرجاعه لاحقًا.
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 flex w-full items-center justify-center gap-3 bg-[#9d7857] px-6 py-3 text-sm font-semibold tracking-wide text-white transition-all duration-300 hover:bg-[#8a6a4a]"
          >
            تواصل معنا عبر الواتساب
          </a>
          */}

          <div className="mt-8 overflow-hidden rounded-sm border border-[#9d7857]/15 bg-gradient-to-l from-[#9d7857]/8 via-[#9d7857]/4 to-transparent px-6 py-3 text-center text-xs font-semibold tracking-[0.3em] text-[#9d7857]">
            RAWASIKH
          </div>
        </div>
      </div>

      <div className="relative overflow-hidden bg-[#1a1a1a] px-6 py-16 text-center md:px-20">
        <div className="absolute left-0 right-0 top-0 h-[3px] bg-gradient-to-r from-transparent via-[#9d7857] to-transparent" />
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, #9d7857 0, #9d7857 1px, transparent 0, transparent 50%)",
            backgroundSize: "20px 20px",
          }}
        />

        <div className="relative z-10">
          <p className="mb-5 text-xs font-light uppercase tracking-[4px] text-[#9d7857]">
            شريكك العقاري الموثوق
          </p>
          <h2 className="mb-6 text-3xl font-bold leading-tight text-white md:text-4xl">
            {content?.description || "تواصل معنا لتحقيق"}
            <span className="text-[#9d7857]"> حلمك العقاري</span>
          </h2>
          <p className="mx-auto mb-10 max-w-xl text-sm leading-relaxed text-gray-400 md:text-base">
            لا تتردد في التواصل معنا للحصول على استشارة مجانية أو لمعرفة المزيد عن أحدث مشاريعنا العقارية.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ContactMapSection;
