export const JOIN_US_COLORS = {
  green: '#2D5016',
  gold: '#C9A84C',
};

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
  { value: 'yes', label: 'نعم، لدي رخصة فال' },
  { value: 'pending', label: 'قيد الإصدار' },
  { value: 'no', label: 'لا' },
];

export const EXPERIENCE_OPTIONS = [
  { value: '0', label: 'بدون خبرة' },
  { value: '1-2', label: '1 - 2 سنة' },
  { value: '3-5', label: '3 - 5 سنوات' },
  { value: '6-10', label: '6 - 10 سنوات' },
  { value: '10+', label: 'أكثر من 10 سنوات' },
];

export const SPECIALIZATION_OPTIONS = [
  { value: 'residential', label: 'سكني' },
  { value: 'commercial', label: 'تجاري' },
  { value: 'lands', label: 'أراضي' },
  { value: 'rental', label: 'تأجير' },
  { value: 'investment', label: 'استثماري' },
  { value: 'management', label: 'إدارة أملاك' },
];

export const WORK_STYLE_OPTIONS = [
  { value: 'office', label: 'مكتبي' },
  { value: 'field', label: 'ميداني' },
  { value: 'hybrid', label: 'هجين' },
  { value: 'freelance', label: 'عمل حر' },
];

export const TECH_TOOL_OPTIONS = [
  { value: 'deal', label: 'ديل' },
  { value: 'haraj', label: 'حراج' },
  { value: 'aqar', label: 'عقار' },
  { value: 'maps', label: 'خرائط جوجل' },
  { value: 'crm', label: 'CRM' },
  { value: 'social', label: 'وسائل التواصل' },
];

export const REWARD_SYSTEM_OPTIONS = [
  { value: 'fixed', label: 'راتب ثابت' },
  { value: 'commission', label: 'عمولة' },
  { value: 'hybrid', label: 'هجين' },
  { value: 'salary-plus', label: 'راتب + حوافز' },
];

export const TRAINING_OPTIONS = [
  { value: 'yes', label: 'نعم' },
  { value: 'maybe', label: 'ربما' },
  { value: 'no', label: 'لا' },
];

export const DEVELOPMENT_AREA_OPTIONS = [
  { value: 'sales', label: 'مهارات البيع' },
  { value: 'marketing', label: 'التسويق' },
  { value: 'legal', label: 'الجانب القانوني' },
  { value: 'tech', label: 'التقنية' },
  { value: 'leadership', label: 'القيادة' },
];

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

export const LABELS = {
  gender: Object.fromEntries(GENDER_OPTIONS.map((o) => [o.value, o.label])),
  ageGroup: Object.fromEntries(AGE_GROUP_OPTIONS.map((o) => [o.value, o.label])),
  education: Object.fromEntries(EDUCATION_OPTIONS.map((o) => [o.value, o.label])),
  hasFalLicense: Object.fromEntries(FAL_LICENSE_OPTIONS.map((o) => [o.value, o.label])),
  experienceYears: Object.fromEntries(EXPERIENCE_OPTIONS.map((o) => [o.value, o.label])),
  specializations: Object.fromEntries(SPECIALIZATION_OPTIONS.map((o) => [o.value, o.label])),
  preferredWorkStyle: Object.fromEntries(WORK_STYLE_OPTIONS.map((o) => [o.value, o.label])),
  techTools: Object.fromEntries(TECH_TOOL_OPTIONS.map((o) => [o.value, o.label])),
  rewardSystem: Object.fromEntries(REWARD_SYSTEM_OPTIONS.map((o) => [o.value, o.label])),
  wantsTraining: Object.fromEntries(TRAINING_OPTIONS.map((o) => [o.value, o.label])),
  developmentAreas: Object.fromEntries(DEVELOPMENT_AREA_OPTIONS.map((o) => [o.value, o.label])),
};

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
