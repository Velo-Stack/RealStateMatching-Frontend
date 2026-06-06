/**
 * Arabic UI labels — central reference (phase-5).
 * Import specific keys instead of spreading the whole object.
 */
export const UI_LABELS_AR = {
  websiteCms: "لوحة تحكم الموقع",
  comparable: "صفقة مقارنة",
  comparableAdd: "إضافة صفقة مقارنة",
  comparableEdit: "تعديل صفقة مقارنة",
  comparablesFeatureDisabled: "ميزة صفقات المقارنة غير مفعّلة أو ليس لديك صلاحية",
  officeVsTeamTitle: "ما الفرق بين المكتب والفريق؟",
  officeVsTeamHelp:
    "المكتب العقاري هو كيان تجاري (ترخيص، أعضاء، عروض وطلبات مرتبطة). الفريق مجموعة عمل داخل المنصة للتنسيق والصلاحيات. قد يُربط المكتب بفريق، لكنهما ليسا نفس الشيء. «مدير المكتب» ≠ «مدير النظام».",

  // CMS section titles
  cmsSectionAbout: "من نحن",
  cmsSectionDiscover: "اكتشف",
  cmsSectionStats: "إحصائيات",
  cmsSectionVision: "الرؤية",
  cmsSectionContact: "تواصل",

  // Preview devices
  previewDesktop: "سطح مكتب",
  previewTablet: "جهاز لوحي",
  previewMobile: "جوال",

  // Feasibility
  roi: "العائد على الاستثمار",

  // Land evaluation
  landEvaluationHelpTitle: "كيف يعمل تقدير السعر؟",
  landEvaluationHelpSteps: [
    "يجلب النظام صفقات مقارنة معتمدة في نفس المدينة/الحي (أو ضمن نطاق km).",
    "يُزيل القيم الشاذة (IQR) ويحسب الوسيط لسعر الم².",
    "يُقدّر الحد الأدنى/الأعلى للعرض بناءً على المساحة ±15%.",
    "مستوى الثقة: منخفض (<5) · متوسط (5–9) · مرتفع (10+ صفقات).",
  ],

  // Feature flags
  flagsLiveVsExperimentalTitle: "ما هو Live وما هو تحت التجربة؟",
  flagsLiveCore:
    "Core CRM (عروض، طلبات، تطابقات، مستخدمين، فرق، محادثات، تقارير، RBAC) يعمل دائماً.",
  flagsExperimental:
    "الميزات خلف Flag (خرائط، نقاط، مكاتب، توزيع، تسجيل ذاتي، تقييم أراضي، جدوى، اشتراكات، بحث متقدم) تظهر بعد التفعيل من هذه الصفحة.",
};

export const CMS_SECTION_LABELS = {
  home_about: "cmsSectionAbout",
  home_discover: "cmsSectionDiscover",
  home_stats: "cmsSectionStats",
  home_vision: "cmsSectionVision",
  home_contact: "cmsSectionContact",
};

export const getCmsSectionTitle = (sectionKey) => {
  const labelKey = CMS_SECTION_LABELS[sectionKey];
  return labelKey ? UI_LABELS_AR[labelKey] : sectionKey;
};
