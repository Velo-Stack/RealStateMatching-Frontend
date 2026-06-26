const trimTrailingSlash = (url) => String(url || "").replace(/\/$/, "");

const isDirectLocalOrigin = (origin) =>
  /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(origin);

/**
 * Resolve API base URL for dev and production.
 * - VITE_API_URL from env (supports absolute URL or relative `/api`)
 * - HTTPS pages: same-origin `/api` (nginx proxy)
 * - Local dev: http://localhost:4000/api
 */
export const getApiBaseUrl = () => {
  const configured = import.meta.env.VITE_API_URL;

  if (configured) {
    if (configured.startsWith("/")) {
      if (typeof window !== "undefined") {
        return trimTrailingSlash(`${window.location.origin}${configured}`);
      }
      return trimTrailingSlash(configured);
    }
    return trimTrailingSlash(configured);
  }

  if (typeof window !== "undefined" && window.location.protocol === "https:") {
    return trimTrailingSlash(`${window.location.origin}/api`);
  }

  return "http://localhost:4000/api";
};

const parseApiBase = () => {
  const base = getApiBaseUrl();

  try {
    const url = new URL(base);
    return {
      origin: `${url.protocol}//${url.host}`,
      apiPrefix: url.pathname.replace(/\/$/, "") || "",
    };
  } catch {
    return {
      origin: trimTrailingSlash(base.replace(/\/api\/?$/, "")),
      apiPrefix: "/api",
    };
  }
};

/** @deprecated Prefer resolveAssetOrigin() for static uploads */
export const getApiOrigin = () => getApiBaseUrl().replace(/\/api\/?$/, "");

/** Origin for /uploads and other static assets (host root, not API path prefix). */
export const resolveAssetOrigin = () => {
  const configured = import.meta.env.VITE_UPLOADS_ORIGIN;
  if (configured) return trimTrailingSlash(configured);
  return parseApiBase().origin;
};

/** Socket.io URL + path for reverse-proxy and local dev. */
export const getSocketConnectOptions = () => {
  const configured = import.meta.env.VITE_SOCKET_URL;
  if (configured) {
    try {
      const url = new URL(configured);
      const path = url.pathname && url.pathname !== "/"
        ? url.pathname
        : "/socket.io";
      return {
        url: `${url.protocol}//${url.host}`,
        options: { path },
      };
    } catch {
      return { url: trimTrailingSlash(configured), options: { path: "/socket.io" } };
    }
  }

  const { origin, apiPrefix } = parseApiBase();

  if (isDirectLocalOrigin(origin)) {
    return { url: origin, options: { path: "/socket.io" } };
  }

  const path = apiPrefix ? `${apiPrefix}/socket.io` : "/socket.io";
  return { url: origin, options: { path } };
};
