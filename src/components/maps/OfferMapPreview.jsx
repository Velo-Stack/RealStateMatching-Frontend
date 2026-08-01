import { GoogleMap, Marker } from "@react-google-maps/api";
import { hasGoogleMapsApiKey } from "../../constants/maps";
import { useGoogleMapsLoader } from "../../hooks/useGoogleMapsLoader";
import MapUnavailablePlaceholder from "./MapUnavailablePlaceholder";

const OfferMapPreview = ({ latitude, longitude, height = 180 }) => {
  const canShowMap = hasGoogleMapsApiKey();
  const { isLoaded, loadError } = useGoogleMapsLoader();

  if (latitude == null || longitude == null) {
    return null;
  }

  if (!canShowMap || loadError) {
    return (
      <MapUnavailablePlaceholder
        compact
        showMapsLink={false}
        title="معاينة الموقع غير متاحة حالياً"
        description="موقع العرض محفوظ. يمكنك فتحه من الزر بالأسفل."
      />
    );
  }

  if (!isLoaded) {
    return (
      <div
        className="flex items-center justify-center rounded-xl border border-white/10 bg-[#111827]/40 text-sm text-slate-400"
        style={{ height }}
      >
        جار تحميل الخريطة...
      </div>
    );
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
