import { Link } from "react-router-dom";
import { FacebookLogo, InstagramLogo, LinkedinLogo } from "phosphor-react";
import { usePublicSettingsQuery } from "../hooks/useWebsiteHomeQuery";
import "./Footer.css";

const XLogoIcon = ({ size = 18 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const quickLinks = [
  { label: "الرئيسية", to: "/" },
  { label: "المشاريع", to: "/projects" },
  { label: "من نحن", to: "/about" },
  { label: "المدونة", to: "/blog" },
  { label: "تواصل معنا", to: "/contact" },
];

const Footer = ({ settings: propSettings }) => {
  const { data: fetchedSettings } = usePublicSettingsQuery();
  const settings = { ...(fetchedSettings || {}), ...(propSettings || {}) };

  const base = import.meta.env.BASE_URL || "/";
  const logoUrl = settings.footerLogoUrl || settings.logoUrl || `${base}rawash-white.png`;

  // Build social links list only for configured URLs
  const socialCandidates = [
    {
      id: "facebook",
      label: "فيسبوك",
      href: settings.facebookUrl,
      icon: FacebookLogo,
      isCustomSvg: false,
    },
    {
      id: "instagram",
      label: "إنستغرام",
      href: settings.instagramUrl,
      icon: InstagramLogo,
      isCustomSvg: false,
    },
    {
      id: "linkedin",
      label: "لينكد إن",
      href: settings.linkedinUrl,
      icon: LinkedinLogo,
      isCustomSvg: false,
    },
    {
      id: "x",
      label: "منصة X (تويتر)",
      href: settings.xUrl,
      icon: XLogoIcon,
      isCustomSvg: true,
    },
  ];

  const activeSocialLinks = socialCandidates.filter(
    (item) => item.href && typeof item.href === "string" && item.href.trim() !== "" && item.href !== "#"
  );

  return (
    <footer className="footer-modern bg-black font-cairo text-white" dir="rtl">
      <span className="footer-modern__glow footer-modern__glow--tr" aria-hidden="true" />
      <span className="footer-modern__glow footer-modern__glow--bl" aria-hidden="true" />
      <span className="footer-modern__top-line" aria-hidden="true" />

      <div className="footer-modern__meta">
        <div className="footer-modern__col footer-modern__col--brand">
          <img src={logoUrl} alt={settings.siteName || "Logo"} className="footer-modern__logo" />
          <p className="footer-modern__tagline">
            {settings.siteTagline ||
              "نقدم أفضل الحلول العقارية بخبرة واسعة في السوق، ونساعدك على اتخاذ القرار الصحيح لتحقيق أهدافك."}
          </p>

          {activeSocialLinks.length > 0 && (
            <div className="footer-modern__socials">
              {activeSocialLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.id}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-modern__social"
                    aria-label={item.label}
                    title={item.label}
                  >
                    {item.isCustomSvg ? (
                      <Icon size={18} />
                    ) : (
                      <Icon size={20} weight="fill" />
                    )}
                  </a>
                );
              })}
            </div>
          )}
        </div>

        <div className="footer-modern__col">
          <h4 className="footer-modern__col-title">روابط سريعة</h4>
          <ul className="footer-modern__nav">
            {quickLinks.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="footer-modern__nav-link">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer-modern__col">
          <h4 className="footer-modern__col-title">موقعنا والتواصل</h4>
          <p className="footer-modern__address">
            {settings.address || "الرياض، المملكة العربية السعودية"}
          </p>
          {settings.contactEmail && (
            <p className="footer-modern__address mt-2" dir="ltr">
              <a
                href={`mailto:${settings.contactEmail}`}
                className="hover:text-white transition-colors"
              >
                {settings.contactEmail}
              </a>
            </p>
          )}
          {settings.contactPhone && (
            <p className="footer-modern__address mt-1" dir="ltr">
              <a
                href={`tel:${settings.contactPhone.replace(/\s+/g, "")}`}
                className="hover:text-white transition-colors"
              >
                {settings.contactPhone}
              </a>
            </p>
          )}
        </div>
      </div>

      <div className="footer-modern__bottom">
        <p>
          حقوق النشر &copy; {new Date().getFullYear()} جميع الحقوق محفوظة |{" "}
          {settings.siteName || "رواسخ العقارية"}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
