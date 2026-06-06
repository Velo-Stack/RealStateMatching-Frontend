/**
 * Static metadata for admin feature-flag help UI.
 * Keys must match backend FeatureFlag.key values.
 */
export const FEATURE_FLAG_CATALOG = [
  {
    key: "maps.enabled",
    sidebarLabels: ["خريطة العقارات"],
    sidebarPages: ["map"],
    backendRoutes: ["/api/offers/map", "/api/public/offers/map"],
    onEnable: "تفعيل خرائط Google واختيار موقع العقار على الخريطة",
    onDisable: "إخفاء صفحة الخريطة — العروض تبقى بدون lat/lng على الخريطة",
    dependsOn: [],
  },
  {
    key: "commission_calculator.enabled",
    sidebarLabels: ["حاسبة السعي"],
    sidebarPages: ["commissionCalculator"],
    backendRoutes: ["/api/commission/*", "/api/offers/:id/commission"],
    onEnable: "حاسبة السعي والعمولة + زر في تفاصيل العرض",
    onDisable: "إخفاء الحاسبة وإيقاف API العمولة",
    dependsOn: [],
  },
  {
    key: "broker_points.enabled",
    sidebarLabels: ["نقاطي", "المكافآت", "المتصدرين"],
    sidebarPages: ["myPoints", "rewards", "leaderboard"],
    backendRoutes: ["/api/brokers/points", "/api/brokers/rewards", "/api/brokers/leaderboard"],
    onEnable: "منح نقاط عند إنشاء عرض/طلب وإغلاق match — عرض النقاط والمكافآت",
    onDisable: "إيقاف منح النقاط — إخفاء صفحات النقاط والمكافآت",
    dependsOn: [],
  },
  {
    key: "broker_tiers.enabled",
    sidebarLabels: ["(شارة المستوى في الواجهة)"],
    sidebarPages: [],
    backendRoutes: ["/api/brokers/tier", "/api/brokers/admin/tier-rules"],
    onEnable: "ترقيات الوسطاء (عادي/متمكن/نخبة) + أولوية توزيع للنخبة",
    onDisable: "إيقاف الترقيات — الجميع بدون مستوى مميز في التوزيع",
    dependsOn: ["broker_points.enabled"],
  },
  {
    key: "offices.enabled",
    sidebarLabels: ["المكاتب العقارية"],
    sidebarPages: ["offices"],
    backendRoutes: ["/api/offices/*"],
    onEnable: "إدارة المكاتب العقارية وأعضائها",
    onDisable: "إخفاء صفحة المكاتب — البيانات تبقى في قاعدة البيانات",
    dependsOn: [],
  },
  {
    key: "request_distribution.enabled",
    sidebarLabels: ["(تبويب التوزيع داخل المكاتب)"],
    sidebarPages: ["offices"],
    backendRoutes: ["/api/requests/:id/assign", "/api/distribution/*"],
    onEnable: "توزيع الطلبات تلقائياً على مسؤولي الأقسام + إشعار التعيين",
    onDisable: "إيقاف التوزيع التلقائي — التعيين اليدوي فقط",
    dependsOn: ["offices.enabled"],
  },
  {
    key: "self_registration.enabled",
    sidebarLabels: ["طلبات التسجيل"],
    sidebarPages: ["registrations"],
    backendRoutes: ["/api/registrations/*", "/api/public/register"],
    onEnable: "التسجيل الذاتي للوسطاء/المكاتب + صف مراجعة Admin",
    onDisable: "إخفاء طلبات التسجيل — إنشاء المستخدمين من Admin فقط",
    dependsOn: [],
  },
  {
    key: "land_evaluation.enabled",
    sidebarLabels: ["صفقات المقارنة"],
    sidebarPages: ["landComparables"],
    backendRoutes: ["/api/lands/comparables", "/api/offers/:id/evaluation"],
    onEnable: "إدارة صفقات المقارنة + تقدير سعر الأرض في تفاصيل العرض",
    onDisable: "إخفاء صفقات المقارنة وإيقاف التقدير",
    dependsOn: [],
  },
  {
    key: "feasibility.enabled",
    sidebarLabels: ["دراسة الجدوى"],
    sidebarPages: ["feasibilityTool"],
    backendRoutes: ["/api/feasibility/*", "/api/offers/:id/feasibility"],
    onEnable: "أداة دراسة الجدوى الفورية + PDF",
    onDisable: "إخفاء أداة الجدوى",
    dependsOn: [],
  },
  {
    key: "subscriptions.enabled",
    sidebarLabels: ["الاشتراك"],
    sidebarPages: ["subscriptions"],
    backendRoutes: ["/api/subscriptions/*"],
    onEnable: "خطط اشتراك للأفراد والمكاتب + حدود العروض",
    onDisable: "إخفاء صفحة الاشتراك — بدون حدود مدفوعة",
    dependsOn: [],
  },
  {
    key: "advanced_search.enabled",
    sidebarLabels: ["البحث المتقدم"],
    sidebarPages: ["search"],
    backendRoutes: ["/api/search/*", "/api/saved-searches/*"],
    onEnable: "بحث عقارات متعدد الوسائل + حفظ عمليات البحث",
    onDisable: "إخفاء البحث المتقدم",
    dependsOn: [],
  },
];

const catalogByKey = new Map(FEATURE_FLAG_CATALOG.map((entry) => [entry.key, entry]));

export const getFeatureFlagCatalogEntry = (key) => catalogByKey.get(key) ?? null;

/** Map sidebar page id → required feature flag key */
export const SIDEBAR_PAGE_FLAG_MAP = FEATURE_FLAG_CATALOG.reduce((acc, entry) => {
  for (const page of entry.sidebarPages) {
    if (!acc[page]) {
      acc[page] = entry.key;
    }
  }
  return acc;
}, {});
