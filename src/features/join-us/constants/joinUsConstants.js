import {
  Briefcase,
  Buildings,
  Camera,
  ChartLineUp,
  Clock,
  Cpu,
  CurrencyCircleDollar,
  Globe,
  GraduationCap,
  Handshake,
  House,
  IdentificationCard,
  Laptop,
  MapPin,
  Medal,
  Megaphone,
  Mountains,
  Scales,
  ShareNetwork,
  Sparkle,
  TreeStructure,
  User,
  UsersThree,
  VideoCamera,
} from 'phosphor-react';

export const JOIN_US_COLORS = {
  green: '#2D5016',
  gold: '#C9A84C',
  goldLight: '#e0d8bf',
  greenLight: '#f0f7ed',
  pageBg: '#F0F2F5',
  inputBg: '#f7f8fa',
};

export const JOIN_US_STEP_META = [
  {
    title: 'البيانات الشخصية',
    subtitle: 'معلومات التواصل والهوية المهنية',
    Icon: User,
  },
  {
    title: 'الرخصة والمهنة',
    subtitle: 'خبرتك وتخصصاتك في السوق العقاري',
    Icon: Medal,
  },
  {
    title: 'طبيعة العمل',
    subtitle: 'أسلوب عملك وأدواتك ونظام العوائد',
    Icon: Briefcase,
  },
  {
    title: 'التمكين والتطوير',
    subtitle: 'طموحاتك وبرامج التطوير المهني',
    Icon: GraduationCap,
  },
];

export const GENDER_OPTIONS = [
  { value: 'male', label: 'ذكر' },
  { value: 'female', label: 'أنثى' },
];

export const AGE_GROUP_OPTIONS = [
  { value: '18-24', label: '18 - 24 سنة' },
  { value: '25-30', label: '25 - 30 سنة' },
  { value: '31-35', label: '31 - 35 سنة' },
  { value: '36-40', label: '36 - 40 سنة' },
];

export const EDUCATION_OPTIONS = [
  { value: 'high-school', label: 'ثانوي' },
  { value: 'diploma', label: 'دبلوم' },
  { value: 'bachelor', label: 'بكالوريوس' },
  { value: 'master', label: 'ماجستير' },
  { value: 'phd', label: 'دكتوراه' },
];

export const FAL_LICENSE_OPTIONS = [
  {
    value: 'yes',
    label: 'نعم أمتلكها',
    description: 'لدي رخصة فال سارية المفعول',
    Icon: IdentificationCard,
  },
  {
    value: 'pending',
    label: 'قيد الإصدار',
    description: 'تقدمت بطلب الرخصة ولم تُصدر بعد',
    Icon: Clock,
  },
  {
    value: 'no',
    label: 'لا أمتلكها',
    description: 'لا أملك رخصة فال حالياً',
    Icon: Scales,
  },
];

export const EXPERIENCE_OPTIONS = [
  { value: 'less-1', label: 'أقل من سنة', description: 'بداية المسار المهني', Icon: Sparkle },
  { value: '1-3', label: '1 - 3 سنوات', description: 'خبرة مبتدئة إلى متوسطة', Icon: ChartLineUp },
  { value: '3-5', label: '3 - 5 سنوات', description: 'خبرة متوسطة ومتنامية', Icon: Briefcase },
  { value: 'more-5', label: 'أكثر من 5 سنوات', description: 'خبرة واسعة في السوق', Icon: Medal },
];

export const SPECIALIZATION_OPTIONS = [
  { value: 'residential', label: 'سكني', description: 'وحدات وعقارات سكنية', Icon: House },
  { value: 'commercial', label: 'تجاري', description: 'مكاتب ومحلات تجارية', Icon: Buildings },
  { value: 'lands', label: 'أراضي', description: 'بيع وشراء الأراضي', Icon: Mountains },
  { value: 'villas', label: 'فلل', description: 'فلل وقصور مستقلة', Icon: TreeStructure },
  { value: 'apartments', label: 'شقق', description: 'شقق سكنية واستثمارية', Icon: Buildings },
  { value: 'offplan', label: 'مشاريع على الخارطة', description: 'مبيعات على المخطط', Icon: MapPin },
  { value: 'marketing', label: 'تسويق', description: 'تسويق عقاري رقمي وميداني', Icon: Megaphone },
  { value: 'brokerage', label: 'وساطة', description: 'وساطة وإتمام الصفقات', Icon: Handshake },
];

export const WORK_STYLE_OPTIONS = [
  { value: 'full-time', label: 'دوام كامل', description: 'التفرغ الكامل للعمل', Icon: Briefcase },
  { value: 'part-time', label: 'دوام جزئي', description: 'ساعات محددة أسبوعياً', Icon: Clock },
  { value: 'freelance', label: 'عمل حر', description: 'مرونة واستقلالية', Icon: User },
  { value: 'remote', label: 'عن بُعد', description: 'العمل من أي مكان', Icon: Laptop },
  { value: 'flexible', label: 'مرن', description: 'مزيج من الأنماط', Icon: Globe },
];

export const TECH_TOOL_OPTIONS = [
  { value: 'virtual-tours', label: 'جولات افتراضية', description: 'عرض العقارات رقمياً', Icon: VideoCamera },
  { value: 'social-media', label: 'وسائل التواصل', description: 'تسويق عبر المنصات', Icon: ShareNetwork },
  { value: 'platforms', label: 'منصات عقارية', description: 'حراج، عقار، وغيرها', Icon: Globe },
  { value: 'crm', label: 'أنظمة CRM', description: 'إدارة العملاء والصفقات', Icon: Cpu },
  { value: 'maps', label: 'خرائط ومخططات', description: 'تحليل المواقع والمناطق', Icon: MapPin },
  { value: 'photography', label: 'تصوير احترافي', description: 'تصوير وعرض العقارات', Icon: Camera },
];

export const REWARD_SYSTEM_OPTIONS = [
  {
    value: 'salary-commission',
    label: 'راتب + عمولة',
    description: 'دخل ثابت مع حوافز أداء',
    Icon: CurrencyCircleDollar,
  },
  {
    value: 'commission-only',
    label: 'عمولة فقط',
    description: 'أرباح مباشرة من الصفقات',
    Icon: ChartLineUp,
  },
  {
    value: 'performance-bonus',
    label: 'مكافآت أداء',
    description: 'حوافز مرتبطة بالإنجاز',
    Icon: Sparkle,
  },
];

export const TRAINING_OPTIONS = [
  { value: 'yes-eager', label: 'نعم، بحماس', description: 'أرغب في التطوير المستمر', Icon: GraduationCap },
  { value: 'yes-conditional', label: 'نعم، بشروط', description: 'حسب البرنامج والجدول', Icon: Medal },
  { value: 'maybe', label: 'ربما', description: 'أحتاج مزيداً من المعلومات', Icon: Clock },
  { value: 'no', label: 'لا', description: 'لا أحتاج برامج تدريبية حالياً', Icon: User },
];

export const DEVELOPMENT_AREA_OPTIONS = [
  { value: 'dev-sales', label: 'مهارات البيع', description: 'إقناع وإغلاق الصفقات', Icon: Handshake },
  { value: 'dev-marketing', label: 'التسويق', description: 'تسويق رقمي وميداني', Icon: Megaphone },
  { value: 'dev-negotiation', label: 'التفاوض', description: 'مهارات التفاوض الاحترافي', Icon: UsersThree },
  { value: 'dev-legal', label: 'الجانب القانوني', description: 'أنظمة وعقود عقارية', Icon: Scales },
  { value: 'dev-tech', label: 'التقنية', description: 'أدوات وتقنيات حديثة', Icon: Cpu },
  { value: 'dev-leadership', label: 'القيادة', description: 'إدارة الفرق والمشاريع', Icon: ChartLineUp },
];

const LEGACY_LABELS = {
  experienceYears: {
    '0': 'بدون خبرة',
    '1-2': '1 - 2 سنة',
    '6-10': '6 - 10 سنوات',
    '10+': 'أكثر من 10 سنوات',
  },
  specializations: {
    rental: 'تأجير',
    investment: 'استثماري',
    management: 'إدارة أملاك',
  },
  preferredWorkStyle: {
    office: 'مكتبي',
    field: 'ميداني',
    hybrid: 'هجين',
  },
  techTools: {
    deal: 'ديل',
    haraj: 'حراج',
    aqar: 'عقار',
    social: 'وسائل التواصل',
  },
  rewardSystem: {
    fixed: 'راتب ثابت',
    commission: 'عمولة',
    hybrid: 'هجين',
    'salary-plus': 'راتب + حوافز',
  },
  wantsTraining: {
    yes: 'نعم',
  },
  developmentAreas: {
    sales: 'مهارات البيع',
    marketing: 'التسويق',
    legal: 'الجانب القانوني',
    tech: 'التقنية',
    leadership: 'القيادة',
  },
};

export const STATUS_LABELS = {
  PENDING: 'قيد المراجعة',
  REVIEWED: 'تمت المراجعة',
  ACCEPTED: 'مقبول',
  REJECTED: 'مرفوض',
};

export const FILE_TYPE_LABELS = {
  FAL_LICENSE: 'رخصة فال',
  NATIONAL_ID: 'الهوية',
  CV: 'السيرة الذاتية',
  CERTIFICATE: 'شهادة',
  OTHER: 'أخرى',
};

const buildLabelMap = (options) => Object.fromEntries(options.map((o) => [o.value, o.label]));

export const LABELS = {
  gender: buildLabelMap(GENDER_OPTIONS),
  ageGroup: buildLabelMap(AGE_GROUP_OPTIONS),
  education: buildLabelMap(EDUCATION_OPTIONS),
  hasFalLicense: buildLabelMap(FAL_LICENSE_OPTIONS),
  experienceYears: { ...buildLabelMap(EXPERIENCE_OPTIONS), ...LEGACY_LABELS.experienceYears },
  specializations: { ...buildLabelMap(SPECIALIZATION_OPTIONS), ...LEGACY_LABELS.specializations },
  preferredWorkStyle: { ...buildLabelMap(WORK_STYLE_OPTIONS), ...LEGACY_LABELS.preferredWorkStyle },
  techTools: { ...buildLabelMap(TECH_TOOL_OPTIONS), ...LEGACY_LABELS.techTools },
  rewardSystem: { ...buildLabelMap(REWARD_SYSTEM_OPTIONS), ...LEGACY_LABELS.rewardSystem },
  wantsTraining: { ...buildLabelMap(TRAINING_OPTIONS), ...LEGACY_LABELS.wantsTraining },
  developmentAreas: { ...buildLabelMap(DEVELOPMENT_AREA_OPTIONS), ...LEGACY_LABELS.developmentAreas },
};

export const PRIVACY_NOTE =
  'جميع بياناتك محمية ومشفرة — لن تُشارك مع أي جهة خارجية';

export const INITIAL_FORM = {
  fullName: '',
  gender: '',
  ageGroup: '',
  cityId: '',
  phone: '',
  email: '',
  education: '',
  hasFalLicense: '',
  falLicenseNumber: '',
  licenseExpiry: '',
  experienceYears: '',
  specializations: [],
  preferredWorkStyle: '',
  currentChallenges: '',
  techTools: [],
  rewardSystem: '',
  wantsTraining: '',
  developmentAreas: [],
  dreamWorkEnvironment: '',
  files: {
    fal_license: null,
    certificate: null,
    cv: null,
    national_id: null,
    other: null,
  },
};
