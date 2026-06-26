import {
  getApiBaseUrl,
  isDirectLocalOrigin,
  resolveAssetOrigin,
} from "./apiBaseUrl";

export const resolveUploadUrl = (url) => {
  if (!url) return null;

  if (/^https?:\/\//i.test(url)) {
    try {
      const parsed = new URL(url);
      if (parsed.pathname.startsWith("/uploads/")) {
        url = parsed.pathname;
      } else {
        return url;
      }
    } catch {
      return url;
    }
  }

  const path = url.startsWith("/") ? url : `/${url}`;
  const configuredOrigin = import.meta.env.VITE_UPLOADS_ORIGIN;
  if (configuredOrigin) {
    return `${String(configuredOrigin).replace(/\/$/, "")}${path}`;
  }

  try {
    const apiUrl = new URL(getApiBaseUrl());
    const origin = `${apiUrl.protocol}//${apiUrl.host}`;
    const apiPrefix = apiUrl.pathname.replace(/\/$/, "");

    if (isDirectLocalOrigin(origin)) {
      return `${origin}${path}`;
    }

    return `${origin}${apiPrefix}${path}`;
  } catch {
    return `${resolveAssetOrigin()}${path}`;
  }
};

export const DEFAULT_AVATAR_URL = "/assets/default-avatar.svg";

export const resolveAvatarUrl = (avatarUrl, cacheBust) => {
  const resolved = resolveUploadUrl(avatarUrl);
  if (!resolved) return DEFAULT_AVATAR_URL;
  if (cacheBust) {
    const separator = resolved.includes("?") ? "&" : "?";
    return `${resolved}${separator}v=${cacheBust}`;
  }
  return resolved;
};

export const handleAvatarImageError = (event) => {
  event.currentTarget.src = DEFAULT_AVATAR_URL;
};
