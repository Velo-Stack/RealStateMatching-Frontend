import { useState, useEffect } from "react";
import {
  CaretDown,
  CaretUp,
  Envelope,
  FacebookLogo,
  Globe,
  Image,
  InstagramLogo,
  LinkedinLogo,
  MapPin,
  Phone,
  ShareNetwork,
  TwitterLogo,
  WhatsappLogo,
} from "phosphor-react";
import FormField from "../components/shared/FormField";
import ImageUploadField from "../components/ImageUploadField";
import StickyActionBar from "../components/shared/StickyActionBar";
import { inputClasses, emptySettings } from "../constants/websiteCmsConstants";
import { useWebsiteSettingsQuery } from "../hooks/useWebsiteSettingsQuery";
import { useWebsiteSettingsMutation, useWebsiteImageUploadMutation } from "../hooks/useWebsiteCmsMutations";

// Static class strings (never constructed dynamically) so Tailwind's JIT scanner
// can find and keep them in the production build.
const CARD_COLORS = {
  emerald: {
    border: "border-emerald-500/20",
    bg: "bg-emerald-500/5",
    iconBg: "bg-emerald-500/20",
    iconText: "text-emerald-400",
  },
  amber: {
    border: "border-amber-500/20",
    bg: "bg-amber-500/5",
    iconBg: "bg-amber-500/20",
    iconText: "text-amber-400",
  },
  cyan: {
    border: "border-cyan-500/20",
    bg: "bg-cyan-500/5",
    iconBg: "bg-cyan-500/20",
    iconText: "text-cyan-400",
  },
  purple: {
    border: "border-purple-500/20",
    bg: "bg-purple-500/5",
    iconBg: "bg-purple-500/20",
    iconText: "text-purple-400",
  },
};

const SettingsCard = ({ icon: Icon, color, title, desc, children, className = "", isOpen, onToggle }) => {
  const c = CARD_COLORS[color];
  return (
    <div className={`rounded-xl border ${c.border} ${c.bg} shadow-xl overflow-hidden ${className}`}>
      <button
        type="button"
        onClick={onToggle}
        className={`flex w-full items-center justify-between gap-2.5 p-3 text-right transition-colors hover:bg-white/5 ${
          isOpen ? `border-b ${c.border}` : ""
        }`}
      >
        <div className="flex min-w-0 items-center gap-2.5">
          <div className={`${c.iconBg} ${c.iconText} shrink-0 rounded-lg p-1.5`}>
            {Icon ? <Icon size={18} weight="duotone" /> : null}
          </div>
          <div className="min-w-0 text-right">
            <h3 className="text-sm font-bold text-white">{title}</h3>
            {desc && <p className="text-[11px] text-slate-400 truncate">{desc}</p>}
          </div>
        </div>
        {isOpen ? (
          <CaretUp size={18} className="shrink-0 text-slate-400" />
        ) : (
          <CaretDown size={18} className="shrink-0 text-slate-400" />
        )}
      </button>
      {isOpen && <div className="space-y-4 bg-slate-900/50 p-4 backdrop-blur-md">{children}</div>}
    </div>
  );
};

const FieldIconLabel = ({ icon: Icon, iconClassName, children }) => (
  <span className="inline-flex items-center gap-1.5">
    {Icon && <Icon size={14} className={iconClassName} weight="fill" />}
    {children}
  </span>
);

const WebsiteSettingsPage = () => {
  const settingsQuery = useWebsiteSettingsQuery();
  const settingsMutation = useWebsiteSettingsMutation();
  const uploadMutation = useWebsiteImageUploadMutation();

  const [settingsForm, setRawSettings] = useState(emptySettings);
  const [isDirty, setIsDirty] = useState(false);

  const [openCards, setOpenCards] = useState({
    site: true,
    contact: true,
    social: true,
    logos: true,
  });
  const toggleCard = (key) => setOpenCards((prev) => ({ ...prev, [key]: !prev[key] }));

  const setSettingsForm = (updater) => {
    setRawSettings(updater);
    setIsDirty(true);
  };

  useEffect(() => {
    if (settingsQuery.data) {
      setRawSettings({ ...emptySettings, ...settingsQuery.data });
      setIsDirty(false);
    }
  }, [settingsQuery.data]);

  const saveSettings = async () => {
    await settingsMutation.mutateAsync(settingsForm);
    setIsDirty(false);
  };

  if (settingsQuery.isLoading) {
    return <div className="p-8 text-center text-slate-400">جاري تحميل الإعدادات...</div>;
  }

  return (
    <div className="space-y-6 pb-12 font-cairo" dir="rtl">
      <StickyActionBar
        title="الإعدادات العامة للموقع"
        subtitle="تحكم في معلومات التواصل، الهوية البصرية وروابط منصات التواصل"
        isDirty={isDirty}
        isSaving={settingsMutation.isPending}
        onSave={saveSettings}
      />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          saveSettings();
        }}
        className="grid grid-cols-1 gap-4 lg:grid-cols-2"
      >
        {/* معلومات الموقع */}
        <SettingsCard
          icon={Globe}
          color="emerald"
          title="معلومات الموقع"
          desc="الاسم والشعار النصي الظاهر في الموقع"
          isOpen={openCards.site}
          onToggle={() => toggleCard("site")}
        >
          <FormField label="اسم الموقع">
            <input
              className={inputClasses}
              value={settingsForm.siteName}
              onChange={(e) => setSettingsForm((prev) => ({ ...prev, siteName: e.target.value }))}
              placeholder="أدخل اسم الموقع"
            />
          </FormField>

          <FormField label="الشعار النصي">
            <input
              className={inputClasses}
              value={settingsForm.siteTagline}
              onChange={(e) => setSettingsForm((prev) => ({ ...prev, siteTagline: e.target.value }))}
              placeholder="أدخل الشعار النصي"
            />
          </FormField>
        </SettingsCard>

        {/* معلومات التواصل */}
        <SettingsCard
          icon={Phone}
          color="amber"
          title="معلومات التواصل"
          desc="البيانات الظاهرة للزوار في الموقع"
          isOpen={openCards.contact}
          onToggle={() => toggleCard("contact")}
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label={<FieldIconLabel icon={Envelope} iconClassName="text-amber-400">البريد الإلكتروني</FieldIconLabel>}>
              <input
                className={inputClasses}
                type="email"
                value={settingsForm.contactEmail}
                onChange={(e) => setSettingsForm((prev) => ({ ...prev, contactEmail: e.target.value }))}
                placeholder="example@domain.com"
                dir="ltr"
              />
            </FormField>

            <FormField label={<FieldIconLabel icon={Phone} iconClassName="text-amber-400">رقم الهاتف</FieldIconLabel>}>
              {/* طلب أبو سلطان: إخفاء رقم التواصل مؤقتًا، ونتركه هنا كتعليق لسهولة إرجاعه لاحقًا.
              placeholder="+9660500499849"
              */}
              <input
                className={inputClasses}
                value={settingsForm.contactPhone}
                onChange={(e) => setSettingsForm((prev) => ({ ...prev, contactPhone: e.target.value }))}
                placeholder="أدخل رقم الهاتف"
                dir="ltr"
              />
            </FormField>

            <FormField label={<FieldIconLabel icon={WhatsappLogo} iconClassName="text-emerald-400">رقم الواتساب</FieldIconLabel>}>
              {/* طلب أبو سلطان: إخفاء رقم الواتساب مؤقتًا، ونتركه هنا كتعليق لسهولة إرجاعه لاحقًا.
              placeholder="+9660500499849"
              */}
              <input
                className={inputClasses}
                value={settingsForm.whatsappNumber}
                onChange={(e) => setSettingsForm((prev) => ({ ...prev, whatsappNumber: e.target.value }))}
                placeholder="أدخل رقم الواتساب"
                dir="ltr"
              />
            </FormField>

            <FormField label={<FieldIconLabel icon={MapPin} iconClassName="text-amber-400">العنوان</FieldIconLabel>}>
              <input
                className={inputClasses}
                value={settingsForm.address}
                onChange={(e) => setSettingsForm((prev) => ({ ...prev, address: e.target.value }))}
                placeholder="أدخل العنوان"
              />
            </FormField>
          </div>
        </SettingsCard>

        {/* روابط السوشيال ميديا */}
        <SettingsCard
          icon={ShareNetwork}
          color="cyan"
          title="روابط السوشيال ميديا"
          desc="روابط حسابات التواصل الاجتماعي الظاهرة في التذييل"
          className="lg:col-span-2"
          isOpen={openCards.social}
          onToggle={() => toggleCard("social")}
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <FormField label={<FieldIconLabel icon={FacebookLogo} iconClassName="text-blue-400">Facebook</FieldIconLabel>}>
              <input
                className={inputClasses}
                value={settingsForm.facebookUrl}
                onChange={(e) => setSettingsForm((prev) => ({ ...prev, facebookUrl: e.target.value }))}
                placeholder="https://facebook.com/..."
                dir="ltr"
              />
            </FormField>

            <FormField label={<FieldIconLabel icon={InstagramLogo} iconClassName="text-pink-400">Instagram</FieldIconLabel>}>
              <input
                className={inputClasses}
                value={settingsForm.instagramUrl}
                onChange={(e) => setSettingsForm((prev) => ({ ...prev, instagramUrl: e.target.value }))}
                placeholder="https://instagram.com/..."
                dir="ltr"
              />
            </FormField>

            <FormField label={<FieldIconLabel icon={LinkedinLogo} iconClassName="text-sky-400">LinkedIn</FieldIconLabel>}>
              <input
                className={inputClasses}
                value={settingsForm.linkedinUrl}
                onChange={(e) => setSettingsForm((prev) => ({ ...prev, linkedinUrl: e.target.value }))}
                placeholder="https://linkedin.com/..."
                dir="ltr"
              />
            </FormField>

            <FormField label={<FieldIconLabel icon={TwitterLogo} iconClassName="text-slate-300">X (Twitter)</FieldIconLabel>}>
              <input
                className={inputClasses}
                value={settingsForm.xUrl}
                onChange={(e) => setSettingsForm((prev) => ({ ...prev, xUrl: e.target.value }))}
                placeholder="https://x.com/..."
                dir="ltr"
              />
            </FormField>
          </div>
        </SettingsCard>

        {/* الشعارات */}
        <SettingsCard
          icon={Image}
          color="purple"
          title="الشعارات"
          desc="شعار الهيدر وشعار التذييل الظاهرين في الموقع"
          className="lg:col-span-2"
          isOpen={openCards.logos}
          onToggle={() => toggleCard("logos")}
        >
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <ImageUploadField
              label="شعار الموقع (Header)"
              value={settingsForm.logoUrl}
              onChange={(value) => setSettingsForm((prev) => ({ ...prev, logoUrl: value }))}
              uploadMutation={uploadMutation}
            />

            <ImageUploadField
              label="شعار التذييل (Footer)"
              value={settingsForm.footerLogoUrl}
              onChange={(value) => setSettingsForm((prev) => ({ ...prev, footerLogoUrl: value }))}
              uploadMutation={uploadMutation}
            />
          </div>
        </SettingsCard>
      </form>
    </div>
  );
};

export default WebsiteSettingsPage;
