import { useEffect, useMemo, useRef, useState } from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";
import {
  DEFAULT_MAP_CENTER,
  DEFAULT_MAP_ZOOM,
  getGoogleMapsApiKey,
} from "../../../../constants/maps";
import { useGoogleMapsLoader } from "../../../../hooks/useGoogleMapsLoader";
import { fetchPublicOffersMap } from "../../../offers/services/offersMapApi";
import "./ContactMapSection.css";

const MagneticLink = ({ className, children, ...rest }) => {
  const ref = useRef(null);

  const handleMouseMove = (event) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const relX = event.clientX - rect.left - rect.width / 2;
    const relY = event.clientY - rect.top - rect.height / 2;
    el.style.transform = `translate(${relX * 0.28}px, ${relY * 0.35}px)`;
  };

  const handleMouseLeave = () => {
    const el = ref.current;
    if (el) el.style.transform = "translate(0, 0)";
  };

  return (
    <a
      ref={ref}
      className={`magnetic-btn ${className || ""}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      {...rest}
    >
      {children}
    </a>
  );
};

const ContactMapSection = ({ content, settings = {} }) => {
  const phone = settings.contactPhone || "+9660500499849";
  const email = settings.contactEmail || "info@rawasikh.com";
  const address = settings.address || "الرياض، المملكة العربية السعودية";
  const apiKey = getGoogleMapsApiKey();

  const [projects, setProjects] = useState([]);
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let active = true;
    fetchPublicOffersMap({ limit: 50 })
      .then((data) => {
        if (active) setProjects(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (active) setProjects([]);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const whatsappHref = settings.whatsappNumber
    ? `https://wa.me/${String(settings.whatsappNumber).replace(/[^\d]/g, "")}`
    : "https://wa.me/966500499849";

  const center = useMemo(() => {
    if (projects.length > 0) {
      return {
        lat: Number(projects[0].latitude),
        lng: Number(projects[0].longitude),
      };
    }
    return DEFAULT_MAP_CENTER;
  }, [projects]);

  const { isLoaded } = useGoogleMapsLoader();

  const contactRows = [
    { icon: "☎", value: phone, dir: "ltr" },
    { icon: "✉", value: email, dir: "rtl" },
    { icon: "⌖", value: address, dir: "rtl" },
  ];

  return (
    <section
      ref={sectionRef}
      className={`contact-map font-cairo ${isVisible ? "is-visible" : ""}`}
      dir="rtl"
    >
      <div className="contact-map__split">
        <div className="contact-map__info-col">
          <div className="contact-map__info-inner">
            <p className="contact-map__eyebrow">
              {content?.subtitle || "تواصل معنا"}
            </p>

            <h3 className="contact-map__title">
              {content?.title || "نحن هنا لمساعدتك في كل خطوة"}
            </h3>

            <div className="contact-map__rows">
              {contactRows.map((row, index) => (
                <div
                  key={row.value}
                  className="contact-map__row"
                  style={{ "--row-delay": `${0.2 + index * 0.1}s` }}
                >
                  <span className="contact-map__row-icon">{row.icon}</span>
                  <span dir={row.dir}>{row.value}</span>
                </div>
              ))}

              {projects.length > 0 && (
                <p className="contact-map__count">
                  {projects.length} عقار مسجّل على الخريطة
                </p>
              )}
            </div>

            <MagneticLink
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="contact-map__whatsapp"
            >
              تواصل معنا عبر الواتساب
            </MagneticLink>
          </div>
        </div>

        <div className="contact-map__map-col">
          <div className="contact-map__map-sticky">
            {apiKey && isLoaded ? (
              <GoogleMap
                mapContainerStyle={{ width: "100%", height: "100%" }}
                center={center}
                zoom={DEFAULT_MAP_ZOOM}
              >
                {projects.map((project) => (
                  <Marker
                    key={project.id}
                    position={{
                      lat: Number(project.latitude),
                      lng: Number(project.longitude),
                    }}
                  />
                ))}
              </GoogleMap>
            ) : (
              <div className="contact-map__map-fallback">
                {projects.length > 0
                  ? "الخريطة تتطلب مفتاح Google Maps"
                  : "لا توجد عقارات بموقع محدد حالياً"}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="contact-cta">
        <div className="contact-cta__inner">
          <div className="contact-cta__text">
            <p className="contact-cta__eyebrow">شريكك العقاري الموثوق</p>

            <h2 className="contact-cta__title">
              {content?.description || "تواصل معنا لتحقيق"}
              <br />
              <span>حلمك العقاري</span>
            </h2>

            <p className="contact-cta__desc">
              لا تتردد في التواصل معنا للحصول على استشارة مجانية أو لمعرفة
              المزيد عن أحدث مشاريعنا العقارية.
            </p>
          </div>

          <div className="contact-cta__media">
            <div className="contact-cta__media-frame">
              <img
                src={`${import.meta.env.BASE_URL || "/"}images/bg_1.jpg`}
                alt="رواسخ العقارية"
                className="contact-cta__media-img"
              />
            </div>

            <div className="contact-cta__badge">
              <span className="contact-cta__badge-value">+10</span>
              <span className="contact-cta__badge-label">سنوات خبرة</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactMapSection;
