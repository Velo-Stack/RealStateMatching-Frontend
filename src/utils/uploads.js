import { resolveAssetOrigin } from "./apiBaseUrl";

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

  const origin = resolveAssetOrigin();
  const path = url.startsWith("/") ? url : `/${url}`;
  return `${origin}${path}`;
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
