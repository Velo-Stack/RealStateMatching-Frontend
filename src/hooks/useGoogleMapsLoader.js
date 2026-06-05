import { useJsApiLoader } from "@react-google-maps/api";
import {
  GOOGLE_MAPS_LIBRARIES,
  GOOGLE_MAPS_LOADER_ID,
  getGoogleMapsApiKey,
} from "../constants/maps";

/**
 * Single Google Maps loader config for the whole app.
 * @react-google-maps/api requires identical options on every useJsApiLoader call.
 */
export const useGoogleMapsLoader = () => {
  const apiKey = getGoogleMapsApiKey();
  return useJsApiLoader({
    id: GOOGLE_MAPS_LOADER_ID,
    googleMapsApiKey: apiKey,
    libraries: GOOGLE_MAPS_LIBRARIES,
  });
};
