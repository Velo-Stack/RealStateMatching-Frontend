import { FacebookLogo, InstagramLogo, TiktokLogo } from "phosphor-react";
import { motion } from "framer-motion";

const Footer = ({ settings = {}, featuredOffers = [] }) => {
  const base = import.meta.env.BASE_URL || "/";
  const footerImage =
    featuredOffers[0]?.imageUrl || `${base}images/feature3.jpg`;
  const logoUrl = settings.footerLogoUrl || settings.logoUrl || `${base}rawash-white.png`;

  const socialLinks = [
    { label: "فيسبوك", href: settings.facebookUrl || "#", icon: FacebookLogo },
    { label: "إنستغرام", href: settings.instagramUrl || "#", icon: InstagramLogo },
    { label: "تيك توك", href: settings.xUrl || "#", icon: TiktokLogo },
  ];

  return (
    <footer className="relative overflow-hidden bg-black font-cairo text-white">
      <motion.div
        className="relative z-10 grid gap-x-8 gap-y-12 px-6 py-20 md:grid-cols-4 md:px-16"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.1 }}
      >
        <div>
          <h3 className="mb-8 inline-block border-b-2 border-[#9d7857] pb-2 text-[15px] font-bold uppercase tracking-wider">
            من نحن
          </h3>

          <div className="relative mb-8 overflow-hidden rounded-sm">
            <img
              src={`${base}images/footer.jpg`}
              alt="Footer"
              className="h-36 w-full object-cover"
            />
          </div>

          <div className="mb-6">
            <img src={logoUrl} alt="Logo" className="h-10 w-auto object-contain" />
          </div>

          <p className="text-[13px] leading-[1.8] text-gray-400">
            {settings.siteTagline ||
              "نقدم أفضل الحلول العقارية بخبرة واسعة في السوق، ونساعدك على اتخاذ القرار الصحيح لتحقيق أهدافك."}
          </p>
        </div>

        <div>
          <h3 className="mb-8 inline-block border-b-2 border-[#9d7857] pb-2 text-[15px] font-bold uppercase tracking-wider">
            بيانات التواصل
          </h3>
          <div className="space-y-5 text-[13px] text-gray-400">
            <div dir="ltr">{settings.contactPhone || "+966 500 000 000"}</div>
            <div>{settings.contactEmail || "info@rawash.com"}</div>
            <div>{settings.address || "الرياض، المملكة العربية السعودية"}</div>
          </div>
        </div>

        <div>
          <h3 className="mb-8 inline-block border-b-2 border-[#9d7857] pb-2 text-[15px] font-bold uppercase tracking-wider">
            تابعنا على
          </h3>
          <div className="flex flex-wrap items-center gap-4 pt-2">
            {socialLinks.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-white/5 text-[#9d7857] transition-all duration-300 hover:-translate-y-1 hover:border-[#9d7857]/40 hover:bg-[#9d7857] hover:text-white"
                >
                  <Icon size={26} weight="fill" />
                </a>
              );
            })}
          </div>
        </div>

        <div>
          <h3 className="mb-8 inline-block border-b-2 border-[#9d7857] pb-2 text-[15px] font-bold uppercase tracking-wider">
            عقارات مميزة
          </h3>

          <div className="relative overflow-hidden rounded-sm">
            <img
              src={footerImage}
              alt="Featured"
              className="aspect-square w-full object-cover"
            />
          </div>
        </div>
      </motion.div>

      <div className="relative z-10 mt-4 w-full border-t border-white/5 bg-[#050505] text-center">
        <div className="relative mx-auto flex flex-col items-center px-6 py-6 text-[13px] text-gray-500 md:px-16">
          <p>
            حقوق النشر &copy; 2026 جميع الحقوق محفوظة |{" "}
            {settings.siteName || "رواسخ العقارية"}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
