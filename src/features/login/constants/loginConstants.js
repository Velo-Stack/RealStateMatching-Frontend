export const LOGIN_TEXT = {
  title: "مرحبا بعودتك",
  brandTitle: "رواسخ العقارية",
  subtitle: "نظام المطابقة العقاري الذكي",
  emailLabel: "البريد الإلكتروني",
  emailPlaceholder: "name@example.com",
  passwordLabel: "كلمة المرور",
  passwordPlaceholder: "••••••••",
  submitLabel: "دخول للنظام",
  submittingLabel: "جاري تسجيل الدخول...",
  fallbackError: "حدث خطأ أثناء تسجيل الدخول، يرجى المحاولة مرة أخرى",
  footer: "© 2026 رواسخ العقارية - جميع الحقوق محفوظة",
};

// رسائل الأخطاء المترجمة
export const LOGIN_ERROR_MESSAGES = {
  // أخطاء تسجيل الدخول
  "Invalid credentials": "البريد الإلكتروني أو كلمة المرور غير صحيحة",
  "User not found": "البريد الإلكتروني أو كلمة المرور غير صحيحة",
  "Incorrect password": "البريد الإلكتروني أو كلمة المرور غير صحيحة",

  // أخطاء التحقق من البيانات
  "Email is required": "يرجى إدخال البريد الإلكتروني",
  "Password is required": "يرجى إدخال كلمة المرور",
  "Invalid email format": "صيغة البريد الإلكتروني غير صحيحة",

  // أخطاء الحساب
  "Account is disabled": "حسابك معطل، يرجى التواصل مع الإدارة",
  "Account is locked": "حسابك مقفل مؤقتاً، يرجى المحاولة لاحقاً",
  "Account not activated": "حسابك غير مفعل، يرجى التواصل مع الإدارة",

  // أخطاء الشبكة
  "Network Error": "لا يمكن الاتصال بالخادم، تحقق من اتصال الإنترنت",
  "ERR_NETWORK": "لا يمكن الاتصال بالخادم، تحقق من اتصال الإنترنت",
  "ERR_CONNECTION_REFUSED": "الخادم غير متاح حالياً، يرجى المحاولة لاحقاً",
  "ECONNABORTED": "انتهت مهلة الاتصال، يرجى المحاولة مرة أخرى",
  "timeout": "انتهت مهلة الاتصال، يرجى المحاولة مرة أخرى",

  // أخطاء الخادم
  "Internal Server Error": "حدث خطأ في الخادم، يرجى المحاولة لاحقاً",
  "Service Unavailable": "الخادم مشغول حالياً، يرجى المحاولة بعد قليل",
  "Too Many Requests": "تم تجاوز عدد المحاولات المسموحة، يرجى الانتظار قليلاً",
};
