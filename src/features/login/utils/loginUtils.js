import { LOGIN_TEXT, LOGIN_ERROR_MESSAGES } from "../constants/loginConstants";

const normalizeErrorMessage = (message) => {
  if (!message) return null;
  return String(message).trim();
};

const getErrorMessageFromResponse = (error) => {
  // محاولة الحصول على الرسالة من مواقع مختلفة في الـ response
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.response?.statusText ||
    error?.message ||
    null
  );
};

const getErrorByStatusCode = (statusCode) => {
  const statusMessages = {
    400: "البيانات المدخلة غير صحيحة",
    401: "البريد الإلكتروني أو كلمة المرور غير صحيحة",
    403: "ليس لديك صلاحية للوصول",
    404: "الخدمة غير متوفرة",
    429: "تم تجاوز عدد المحاولات المسموحة، يرجى الانتظار قليلاً",
    500: "حدث خطأ في الخادم، يرجى المحاولة لاحقاً",
    502: "الخادم غير متاح حالياً، يرجى المحاولة لاحقاً",
    503: "الخادم مشغول حالياً، يرجى المحاولة بعد قليل",
    504: "انتهت مهلة الاتصال، يرجى المحاولة مرة أخرى",
  };

  return statusMessages[statusCode] || null;
};

const translateErrorMessage = (message) => {
  if (!message) return null;

  const normalized = normalizeErrorMessage(message);

  // البحث عن تطابق مباشر
  if (LOGIN_ERROR_MESSAGES[normalized]) {
    return LOGIN_ERROR_MESSAGES[normalized];
  }

  // البحث عن تطابق جزئي (case-insensitive)
  const lowerMessage = normalized.toLowerCase();

  for (const [key, value] of Object.entries(LOGIN_ERROR_MESSAGES)) {
    if (lowerMessage.includes(key.toLowerCase())) {
      return value;
    }
  }

  return null;
};

export const getLoginErrorMessage = (error) => {
  // التحقق من أخطاء الشبكة
  if (!error?.response) {
    if (error?.code === "ERR_NETWORK" || error?.message === "Network Error") {
      return "لا يمكن الاتصال بالخادم، تحقق من اتصال الإنترنت";
    }

    if (error?.code === "ECONNABORTED" || error?.code === "ERR_CONNECTION_REFUSED") {
      return "الخادم غير متاح حالياً، يرجى المحاولة لاحقاً";
    }

    if (error?.message?.toLowerCase().includes("timeout")) {
      return "انتهت مهلة الاتصال، يرجى المحاولة مرة أخرى";
    }
  }

  // محاولة الحصول على الرسالة من الـ response
  const errorMessage = getErrorMessageFromResponse(error);

  // محاولة ترجمة الرسالة
  const translatedMessage = translateErrorMessage(errorMessage);
  if (translatedMessage) {
    return translatedMessage;
  }

  // محاولة الحصول على رسالة حسب كود الحالة
  const statusCode = error?.response?.status;
  if (statusCode) {
    const statusMessage = getErrorByStatusCode(statusCode);
    if (statusMessage) {
      return statusMessage;
    }
  }

  // الرسالة الافتراضية
  return LOGIN_TEXT.fallbackError;
};
