import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const ContactMapSection = ({ content, settings = {} }) => {
  const phone = settings.contactPhone || "+9660500499849";
  const email = settings.contactEmail || "info@rawasikh.com";
  const address = settings.address || "الرياض، المملكة العربية السعودية";

  const whatsappHref = settings.whatsappNumber
    ? `https://wa.me/${String(settings.whatsappNumber).replace(/[^\d]/g, "")}`
    : "https://wa.me/966500499849";

  // 🔥 مركز الخريطة
  const center = {
    lat: 24.7136,
    lng: 46.6753,
  };

  // 🔥 20 مشروع (markers)
  const projects = [
    { id: 1, lat: 24.71, lng: 46.67 },
    { id: 2, lat: 24.72, lng: 46.68 },
    { id: 3, lat: 24.7, lng: 46.66 },
    { id: 4, lat: 24.73, lng: 46.69 },
    { id: 5, lat: 24.74, lng: 46.65 },
    { id: 6, lat: 24.75, lng: 46.64 },
    { id: 7, lat: 24.69, lng: 46.63 },
    { id: 8, lat: 24.68, lng: 46.7 },
    { id: 9, lat: 24.67, lng: 46.72 },
    { id: 10, lat: 24.76, lng: 46.73 },
    { id: 11, lat: 24.77, lng: 46.62 },
    { id: 12, lat: 24.78, lng: 46.6 },
    { id: 13, lat: 24.66, lng: 46.61 },
    { id: 14, lat: 24.65, lng: 46.74 },
    { id: 15, lat: 24.64, lng: 46.75 },
    { id: 16, lat: 24.79, lng: 46.76 },
    { id: 17, lat: 24.8, lng: 46.77 },
    { id: 18, lat: 24.63, lng: 46.78 },
    { id: 19, lat: 24.62, lng: 46.79 },
    { id: 20, lat: 24.81, lng: 46.8 },
  ];

  return (
    <section className="font-cairo" dir="rtl">
      <div className="relative">
        {/* 🔥 MAP */}
        <div className="h-[700px] w-full grayscale transition-all duration-700 hover:grayscale-0 md:h-[550px]">
          <LoadScript googleMapsApiKey="PUT_YOUR_API_KEY_HERE">
            <GoogleMap
              mapContainerStyle={{ width: "100%", height: "100%" }}
              center={center}
              zoom={11}
            >
              {projects.map((project) => (
                <Marker
                  key={project.id}
                  position={{ lat: project.lat, lng: project.lng }}
                />
              ))}
            </GoogleMap>
          </LoadScript>
        </div>

        {/* 🔥 CARD */}
        <div className="absolute bottom-0 right-0 z-20 w-full border-t-4 border-[#9d7857] bg-white p-8 shadow-2xl md:bottom-10 md:right-16 md:w-[380px] md:p-10">
          <p className="mb-3 text-xs font-light uppercase tracking-[3px] text-[#9d7857]">
            {content?.subtitle || "تواصل معنا"}
          </p>

          <h3 className="mb-6 text-2xl font-bold leading-snug text-slate-900">
            {content?.title || "نحن هنا لمساعدتك في كل خطوة"}
          </h3>

          <div className="space-y-4 text-sm text-gray-600">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center bg-[#9d7857]/10 text-[#9d7857]">
                ☎
              </div>
              <span dir="ltr" className="text-right">
                {phone}
              </span>
            </div>

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

          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 flex w-full items-center justify-center gap-3 bg-[#9d7857] px-6 py-3 text-sm font-semibold tracking-wide text-white transition-all duration-300 hover:bg-[#8a6a4a]"
          >
            تواصل معنا عبر الواتساب
          </a>
        </div>
      </div>

      {/* 🔥 CTA */}
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
            لا تتردد في التواصل معنا للحصول على استشارة مجانية أو لمعرفة المزيد
            عن أحدث مشاريعنا العقارية.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ContactMapSection;
