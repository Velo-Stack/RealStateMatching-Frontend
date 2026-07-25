import { useState, useEffect } from "react";
import { CheckCircle } from "phosphor-react";
import FormGroup from "../components/shared/FormGroup";
import FormField from "../components/shared/FormField";
import ImageUploadField from "../components/ImageUploadField";
import StickyActionBar from "../components/shared/StickyActionBar";
import { inputClasses, emptySettings } from "../constants/websiteCmsConstants";
import { useWebsiteSettingsQuery } from "../hooks/useWebsiteSettingsQuery";
import { useWebsiteSettingsMutation, useWebsiteImageUploadMutation } from "../hooks/useWebsiteCmsMutations";

const WebsiteSettingsPage = () => {
  const settingsQuery = useWebsiteSettingsQuery();
  const settingsMutation = useWebsiteSettingsMutation();
  const uploadMutation = useWebsiteImageUploadMutation();

  const [settingsForm, setRawSettings] = useState(emptySettings);
  const [isDirty, setIsDirty] = useState(false);

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

      <div className="bg-slate-900/50 backdrop-blur-md rounded-3xl border border-white/10 p-6 shadow-xl space-y-6">
        <form onSubmit={(e) => { e.preventDefault(); saveSettings(); }} className="space-y-6">
      {/* معلومات الموقع */}
      <FormGroup title="معلومات الموقع">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField label="اسم الموقع">
            <input
              className={inputClasses}
              value={settingsForm.siteName}
              onChange={(e) =>
                setSettingsForm((prev) => ({ ...prev, siteName: e.target.value }))
              }
              placeholder="أدخل اسم الموقع"
            />
          </FormField>

          <FormField label="الشعار النصي">
            <input
              className={inputClasses}
              value={settingsForm.siteTagline}
              onChange={(e) =>
                setSettingsForm((prev) => ({ ...prev, siteTagline: e.target.value }))
              }
              placeholder="أدخل الشعار النصي"
            />
          </FormField>
        </div>
      </FormGroup>

      {/* معلومات التواصل */}
      <FormGroup title="معلومات التواصل">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField label="البريد الإلكتروني">
            <input
              className={inputClasses}
              type="email"
              value={settingsForm.contactEmail}
              onChange={(e) =>
                setSettingsForm((prev) => ({ ...prev, contactEmail: e.target.value }))
              }
              placeholder="example@domain.com"
              dir="ltr"
            />
          </FormField>

          <FormField label="رقم الهاتف">
            {/* طلب أبو سلطان: إخفاء رقم التواصل مؤقتًا، ونتركه هنا كتعليق لسهولة إرجاعه لاحقًا.
            placeholder="+9660500499849"
            */}
            <input
              className={inputClasses}
              value={settingsForm.contactPhone}
              onChange={(e) =>
                setSettingsForm((prev) => ({ ...prev, contactPhone: e.target.value }))
              }
              placeholder="أدخل رقم الهاتف"
              dir="ltr"
            />
          </FormField>

          <FormField label="رقم الواتساب">
            {/* طلب أبو سلطان: إخفاء رقم الواتساب مؤقتًا، ونتركه هنا كتعليق لسهولة إرجاعه لاحقًا.
            placeholder="+9660500499849"
            */}
            <input
              className={inputClasses}
              value={settingsForm.whatsappNumber}
              onChange={(e) =>
                setSettingsForm((prev) => ({ ...prev, whatsappNumber: e.target.value }))
              }
              placeholder="أدخل رقم الواتساب"
              dir="ltr"
            />
          </FormField>

          <FormField label="العنوان">
            <input
              className={inputClasses}
              value={settingsForm.address}
              onChange={(e) =>
                setSettingsForm((prev) => ({ ...prev, address: e.target.value }))
              }
              placeholder="أدخل العنوان"
            />
          </FormField>
        </div>
      </FormGroup>

      {/* روابط السوشيال ميديا */}
      <FormGroup title="روابط السوشيال ميديا">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField label="Facebook">
            <input
              className={inputClasses}
              value={settingsForm.facebookUrl}
              onChange={(e) =>
                setSettingsForm((prev) => ({ ...prev, facebookUrl: e.target.value }))
              }
              placeholder="https://facebook.com/..."
              dir="ltr"
            />
          </FormField>

          <FormField label="Instagram">
            <input
              className={inputClasses}
              value={settingsForm.instagramUrl}
              onChange={(e) =>
                setSettingsForm((prev) => ({ ...prev, instagramUrl: e.target.value }))
              }
              placeholder="https://instagram.com/..."
              dir="ltr"
            />
          </FormField>

          <FormField label="LinkedIn">
            <input
              className={inputClasses}
              value={settingsForm.linkedinUrl}
              onChange={(e) =>
                setSettingsForm((prev) => ({ ...prev, linkedinUrl: e.target.value }))
              }
              placeholder="https://linkedin.com/..."
              dir="ltr"
            />
          </FormField>

          <FormField label="X (Twitter)">
            <input
              className={inputClasses}
              value={settingsForm.xUrl}
              onChange={(e) =>
                setSettingsForm((prev) => ({ ...prev, xUrl: e.target.value }))
              }
              placeholder="https://x.com/..."
              dir="ltr"
            />
          </FormField>
        </div>
      </FormGroup>

      {/* الشعارات */}
      <FormGroup title="الشعارات">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <ImageUploadField
            label="شعار الموقع (Header)"
            value={settingsForm.logoUrl}
            onChange={(value) =>
              setSettingsForm((prev) => ({ ...prev, logoUrl: value }))
            }
            uploadMutation={uploadMutation}
          />

          <ImageUploadField
            label="شعار التذييل (Footer)"
            value={settingsForm.footerLogoUrl}
            onChange={(value) =>
              setSettingsForm((prev) => ({ ...prev, footerLogoUrl: value }))
            }
            uploadMutation={uploadMutation}
          />
        </div>
      </FormGroup>



        </form>
      </div>
    </div>
  );
};

export default WebsiteSettingsPage;
