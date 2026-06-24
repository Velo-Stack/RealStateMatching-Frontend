/**
 * Public marketing/auth pages — no login required.
 * Used to avoid redirecting guests to /login on expired sessions.
 */

const PUBLIC_EXACT = new Set([
  '/',
  '/login',
  '/register',
  '/register/success',
  '/not-authorized',
]);

const PUBLIC_PREFIXES = [
  '/projects',
  '/about',
  '/blog',
  '/contact',
  '/join-us',
  '/investors',
  '/pricing',
  '/submit',
];

const normalizePath = (pathname = '') => {
  const base = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');
  let path = pathname || '/';

  if (base && base !== '/' && path.startsWith(base)) {
    path = path.slice(base.length) || '/';
  }

  if (!path.startsWith('/')) path = `/${path}`;
  if (path.length > 1 && path.endsWith('/')) path = path.slice(0, -1);
  return path;
};

export const isPublicAppPath = (pathname = '') => {
  const path = normalizePath(pathname);
  if (PUBLIC_EXACT.has(path)) return true;
  return PUBLIC_PREFIXES.some(
    (prefix) => path === prefix || path.startsWith(`${prefix}/`),
  );
};

export const isProtectedAppPath = (pathname = '') => {
  const path = normalizePath(pathname);
  return path === '/app' || path.startsWith('/app/');
};

export const isLoginPath = (pathname = '') => {
  const path = normalizePath(pathname);
  return path === '/login';
};
