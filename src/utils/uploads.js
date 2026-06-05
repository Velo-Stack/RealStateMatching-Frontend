export const resolveUploadUrl = (url) => {
  if (!url) return null;
  if (/^https?:\/\//i.test(url)) return url;
  const apiBase = import.meta.env.VITE_API_URL || "";
  const origin = apiBase.replace(/\/api\/?$/, "");
  const path = url.startsWith("/") ? url : `/${url}`;
  return `${origin}${path}`;
};

export const DEFAULT_AVATAR_URL = "/assets/default-avatar.svg";

export const resolveAvatarUrl = (avatarUrl) =>
  resolveUploadUrl(avatarUrl) || DEFAULT_AVATAR_URL;
