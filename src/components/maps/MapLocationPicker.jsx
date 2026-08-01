import { useCallback, useRef, useState } from "react";
import {
  Autocomplete,
  GoogleMap,
  Marker,
} from "@react-google-maps/api";
import {
  DEFAULT_MAP_CENTER,
  DEFAULT_MAP_ZOOM,
  hasGoogleMapsApiKey,
} from "../../constants/maps";
import { useGoogleMapsLoader } from "../../hooks/useGoogleMapsLoader";
import MapUnavailablePlaceholder from "./MapUnavailablePlaceholder";

const containerStyle = (height) => ({
  width: "100%",
  height: `${height}px`,
  borderRadius: "12px",
});

const MapLocationPicker = ({
  latitude,
  longitude,
  mapAddress = "",
  onChange,
  height = 320,
  draggable = true,
  showSearch = true,
}) => {
  const autocompleteRef = useRef(null);
  const [map, setMap] = useState(null);
  const canShowMap = hasGoogleMapsApiKey();
  const { isLoaded, loadError } = useGoogleMapsLoader();

  const hasCoords =
    latitude !== "" &&
    latitude != null &&
    longitude !== "" &&
    longitude != null;

  const position = hasCoords
    ? { lat: Number(latitude), lng: Number(longitude) }
    : null;

  const center = position || DEFAULT_MAP_CENTER;

  const emitChange = useCallback(
    (lat, lng, address = mapAddress) => {
      onChange?.({
        latitude: lat,
        longitude: lng,
        mapAddress: address,
      });
    },
    [mapAddress, onChange]
  );

  const reverseGeocode = useCallback(
    (lat, lng) => {
      // Save coordinates immediately — geocoding is optional (needs billing on GCP)
      emitChange(lat, lng);

      if (!window.google?.maps?.Geocoder) return;

      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status !== "OK" || !results?.[0]?.formatted_address) return;
        emitChange(lat, lng, results[0].formatted_address);
      });
    },
    [emitChange]
  );

  const handleMapClick = (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    reverseGeocode(lat, lng);
  };

  const handleMarkerDragEnd = (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    reverseGeocode(lat, lng);
  };

  const handlePlaceChanged = () => {
    const place = autocompleteRef.current?.getPlace?.();
    const location = place?.geometry?.location;
    if (!location) return;
    const lat = location.lat();
    const lng = location.lng();
    map?.panTo({ lat, lng });
    map?.setZoom(15);
    emitChange(lat, lng, place.formatted_address || place.name || mapAddress);
  };

  if (!canShowMap || loadError) {
    return (
      <MapUnavailablePlaceholder
        height={height}
        latitude={hasCoords ? Number(latitude) : undefined}
        longitude={hasCoords ? Number(longitude) : undefined}
        title="اختيار الموقع على الخريطة غير متاح حالياً"
        description="يمكنك إدخال بيانات العرض كالمعتاد، وسيظهر تحديد الموقع هنا عند تفعيل الخريطة."
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

  return (
    <div className="space-y-3">
      {showSearch && (
        <Autocomplete
          onLoad={(instance) => {
            autocompleteRef.current = instance;
          }}
          onPlaceChanged={handlePlaceChanged}
        >
          <input
            type="text"
            placeholder="ابحث عن موقع..."
            defaultValue={mapAddress || ""}
            className="w-full rounded-xl border border-white/10 bg-[#111827]/60 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-emerald-500/40 focus:outline-none"
            dir="rtl"
          />
        </Autocomplete>
      )}

      <GoogleMap
        mapContainerStyle={containerStyle(height)}
        center={center}
        zoom={position ? 15 : DEFAULT_MAP_ZOOM}
        onClick={handleMapClick}
        onLoad={setMap}
        options={{
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
        }}
      >
        {position && (
          <Marker
            position={position}
            draggable={draggable}
            onDragEnd={handleMarkerDragEnd}
          />
        )}
      </GoogleMap>

      {position && (
        <p className="text-xs text-slate-400" dir="ltr">
          {Number(position.lat).toFixed(6)}, {Number(position.lng).toFixed(6)}
          {mapAddress ? ` — ${mapAddress}` : ""}
        </p>
      )}

      <p className="text-xs text-slate-500">
        انقر على الخريطة أو اسحب العلامة لتحديد موقع العقار. العنوان التفصيلي اختياري ويتطلب تفعيل Geocoding API.
      </p>
    </div>
  );
};

export default MapLocationPicker;
