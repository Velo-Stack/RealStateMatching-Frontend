import { GoogleMap, Marker } from "@react-google-maps/api";
import {
  DEFAULT_MAP_CENTER,
  getGoogleMapsApiKey,
} from "../../constants/maps";
import { useGoogleMapsLoader } from "../../hooks/useGoogleMapsLoader";

const OfferMapPreview = ({ latitude, longitude, height = 180 }) => {
  const apiKey = getGoogleMapsApiKey();
  const { isLoaded } = useGoogleMapsLoader();

  if (latitude == null || longitude == null || !apiKey || !isLoaded) {
    return null;
  }

  const position = { lat: Number(latitude), lng: Number(longitude) };

  return (
    <div className="overflow-hidden rounded-xl border border-white/10">
      <GoogleMap
        mapContainerStyle={{ width: "100%", height: `${height}px` }}
        center={position}
        zoom={15}
        options={{
          disableDefaultUI: true,
          zoomControl: true,
          draggable: false,
          scrollwheel: false,
        }}
      >
        <Marker position={position} />
      </GoogleMap>
    </div>
  );
};

export default OfferMapPreview;
