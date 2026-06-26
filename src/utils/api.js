import axios from 'axios';
import { toast } from 'sonner';
import { getApiBaseUrl } from './apiBaseUrl';
import { isLoginPath, isProtectedAppPath, isPublicAppPath } from './publicRoutes';

const api = axios.create({
  baseURL: getApiBaseUrl(),
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

const buildLoginPath = () => {
  const base = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');
  return `${base}/login`.replace(/\/+/g, '/');
};

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const skipRedirect = Boolean(error?.config?.skipAuthRedirect);
    const skipErrorToast = Boolean(error?.config?.skipErrorToast);
    const method = String(error?.config?.method || 'get').toUpperCase();
    const isReadRequest = method === 'GET' || method === 'HEAD';
    const pathname = window.location.pathname;
    const shouldToast = !skipErrorToast && !isReadRequest;

    if (status === 401) {
      localStorage.removeItem('token');

      const shouldRedirect =
        !skipRedirect
        && isProtectedAppPath(pathname)
        && !isLoginPath(pathname);

      if (shouldRedirect) {
        toast.error('انتهت صلاحية الجلسة، يرجى تسجيل الدخول مرة أخرى.');
        const loginPath = buildLoginPath();
        const redirect = `${loginPath}?redirect=${encodeURIComponent(pathname)}`;
        window.location.href = redirect;
      } else if (!isPublicAppPath(pathname) && !isLoginPath(pathname) && !skipRedirect) {
        toast.error('انتهت صلاحية الجلسة.');
      }
    } else if (status === 403 && shouldToast) {
      toast.error('لا تملك صلاحيات كافية لتنفيذ هذا الإجراء.');
    } else if (status === 500 && shouldToast) {
      toast.error('حدث خطأ غير متوقع في الخادم، يرجى المحاولة لاحقاً.');
    }

    return Promise.reject(error);
  },
);

export default api;
