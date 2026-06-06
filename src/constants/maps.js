export const DEFAULT_MAP_CENTER = { lat: 24.7136, lng: 46.6753 };
export const DEFAULT_MAP_ZOOM = 11;
export const GOOGLE_MAPS_LOADER_ID = "rwasikh-google-maps";
/** Must be stable across all map components — do not pass different library sets. */
export const GOOGLE_MAPS_LIBRARIES = ["places"];

export const getGoogleMapsApiKey = () =>
  import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "";

export const hasGoogleMapsApiKey = () => Boolean(getGoogleMapsApiKey());

export const buildMapsLink = (latitude, longitude) => {
  if (latitude == null || longitude == null) return null;
  return `https://www.google.com/maps?q=${latitude},${longitude}`;
};
