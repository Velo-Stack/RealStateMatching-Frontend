import { Link } from "react-router-dom";
import { FacebookLogo, InstagramLogo, TiktokLogo } from "phosphor-react";
import "./Footer.css";

const quickLinks = [
  { label: "الرئيسية", to: "/" },
  { label: "المشاريع", to: "/projects" },
  { label: "من نحن", to: "/about" },
  { label: "تواصل معنا", to: "/contact" },
];

const Footer = ({ settings = {} }) => {
  const base = import.meta.env.BASE_URL || "/";
  const logoUrl = settings.footerLogoUrl || settings.logoUrl || `${base}rawash-white.png`;

  const socialLinks = [
    { label: "فيسبوك", href: settings.facebookUrl || "#", icon: FacebookLogo },
    { label: "إنستغرام", href: settings.instagramUrl || "#", icon: InstagramLogo },
    { label: "تيك توك", href: settings.xUrl || "#", icon: TiktokLogo },
  ];

  return (
    <footer className="footer-modern bg-black font-cairo text-white" dir="rtl">
      <span className="footer-modern__glow footer-modern__glow--tr" aria-hidden="true" />
      <span className="footer-modern__glow footer-modern__glow--bl" aria-hidden="true" />
      <span className="footer-modern__top-line" aria-hidden="true" />

      <div className="footer-modern__meta">
        <div className="footer-modern__col footer-modern__col--brand">
          <img src={logoUrl} alt="Logo" className="footer-modern__logo" />
          <p className="footer-modern__tagline">
            {settings.siteTagline ||
              "نقدم أفضل الحلول العقارية بخبرة واسعة في السوق، ونساعدك على اتخاذ القرار الصحيح لتحقيق أهدافك."}
          </p>
          <div className="footer-modern__socials">
            {socialLinks.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="footer-modern__social"
                  aria-label={item.label}
                >
                  <Icon size={20} weight="fill" />
                </a>
              );
            })}
          </div>
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
          <h4 className="footer-modern__col-title">موقعنا</h4>
          <p className="footer-modern__address">
            {settings.address || "الرياض، المملكة العربية السعودية"}
          </p>
        </div>
      </div>

      <div className="footer-modern__bottom">
        <p>
          حقوق النشر &copy; 2026 جميع الحقوق محفوظة |{" "}
          {settings.siteName || "رواسخ العقارية"}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
