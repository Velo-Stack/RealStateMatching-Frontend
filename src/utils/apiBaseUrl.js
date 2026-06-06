const trimTrailingSlash = (url) => String(url || "").replace(/\/$/, "");

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

export const getApiOrigin = () => getApiBaseUrl().replace(/\/api\/?$/, "");
