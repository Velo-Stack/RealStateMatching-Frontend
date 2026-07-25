// Input and Card Classes - Using theme-aware styles like other pages
import { getCmsSectionTitle } from "../../../constants/uiLabels.ar";

export const inputClasses =
    "w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-slate-500 outline-none transition-all duration-300 focus:border-amber-500/60 focus:bg-white/10 focus:shadow-[0_0_14px_rgba(212,175,55,0.22)]";

export const textAreaClasses = `${inputClasses} min-h-[70px] resize-y`;

export const cardClasses =
    "rounded-3xl border border-white/10 bg-white/[0.03] p-5 shadow-[0_10px_40px_rgba(15,23,42,0.2)]";

// Section Keys
export const SECTION_KEYS = [
    { key: "home_about", title: getCmsSectionTitle("home_about") },
    { key: "home_discover", title: getCmsSectionTitle("home_discover") },
    { key: "home_stats", title: getCmsSectionTitle("home_stats") },
    { key: "home_vision", title: getCmsSectionTitle("home_vision") },
    { key: "home_contact", title: getCmsSectionTitle("home_contact") },
];

// Which fields each section actually uses on the live site (used to hide fields
// in the CMS that would otherwise be saved but never shown anywhere on the page).
// primaryButton*/secondaryButton*/sortOrder are not rendered by ANY of the 5 home
// sections, so they're always hidden and not listed here per-section.
export const SECTION_FIELD_CONFIG = {
    home_discover: {
        title: { hint: "بيظهر كسطر صغير فوق العنوان الكبير في القسم المائل" },
        subtitle: { hint: "بيظهر كالجملة تحت العنوان في نفس القسم" },
    },
    home_about: {
        title: { hint: "العنوان الرئيسي في قسم \"من نحن\"" },
        subtitle: { hint: "بيظهر كسطر صغير فوق العنوان" },
        description: {},
        imageUrl: { label: "الصورة الرئيسية" },
    },
    home_stats: {
        // Only the stats builder below matters for this section.
    },
    home_vision: {
        title: { hint: "أول جزء من عنوان القسم" },
        subtitle: { hint: "بيظهر كسطر صغير فوق العنوان" },
        description: { hint: "أول سطر بس منه بيظهر كجزء تاني من العنوان (اللي بعد فاصلة سطر جديد بيتم تجاهله)" },
        content: {
            label: "نقاط الرؤية (JSON)",
            hint: 'بالشكل ده بالظبط: {"points":[{"title":"...","text":"..."}]}',
        },
    },
    home_contact: {
        title: { hint: "بيظهر في قسم التواصل والخريطة فوق" },
        subtitle: { hint: "بيظهر كسطر صغير فوق عنوان قسم التواصل" },
        description: { hint: "تنبيه: النص ده بيظهر كعنوان للبانر السفلي (جنب الصورة)، مش داخل قسم التواصل نفسه" },
    },
};

// Empty Forms
export const emptySettings = {
    siteName: "",
    siteTagline: "",
    logoUrl: "",
    footerLogoUrl: "",
    contactEmail: "",
    contactPhone: "",
    whatsappNumber: "",
    address: "",
    facebookUrl: "",
    instagramUrl: "",
    linkedinUrl: "",
    xUrl: "",
};

export const emptyHero = {
    title: "",
    subtitle: "",
    imageUrl: "",
    buttonText: "",
    buttonUrl: "",
    sortOrder: 0,
    isActive: true,
};

export const emptyFeatured = {
    title: "",
    subtitle: "",
    location: "",
    priceLabel: "",
    imageUrl: "",
    images: [],
    status: "AVAILABLE",
    beds: "",
    baths: "",
    sizeLabel: "",
    badge: "",
    offerId: "",
    sortOrder: 0,
    isActive: true,
};

export const createSectionForm = (sectionKey) => ({
    sectionKey,
    title: "",
    subtitle: "",
    description: "",
    imageUrl: "",
    primaryButtonText: "",
    primaryButtonUrl: "",
    secondaryButtonText: "",
    secondaryButtonUrl: "",
    content: "",
    sortOrder: 0,
    isActive: true,
});
