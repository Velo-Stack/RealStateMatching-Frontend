// Input and Card Classes - Using theme-aware styles like other pages
export const inputClasses =
    "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition-all duration-300 focus:border-amber-500/60 focus:bg-white/10 focus:shadow-[0_0_20px_rgba(212,175,55,0.22)]";

export const textAreaClasses = `${inputClasses} min-h-[110px] resize-y`;

export const cardClasses =
    "rounded-3xl border border-white/10 bg-white/[0.03] p-5 shadow-[0_10px_40px_rgba(15,23,42,0.2)]";

// Section Keys
export const SECTION_KEYS = [
    { key: "home_about", title: "About" },
    { key: "home_discover", title: "Discover" },
    { key: "home_stats", title: "Stats" },
    { key: "home_vision", title: "Vision" },
    { key: "home_contact", title: "Contact" },
];

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
