import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { GoogleMap, InfoWindow, Marker } from "@react-google-maps/api";
import { MapPin } from "phosphor-react";
import {
  DEFAULT_MAP_CENTER,
  DEFAULT_MAP_ZOOM,
  getGoogleMapsApiKey,
} from "../../../constants/maps";
import { useGoogleMapsLoader } from "../../../hooks/useGoogleMapsLoader";
import { useFeatureFlags } from "../../../hooks/useFeatureFlags";
import { fetchOffersMap } from "../services/offersMapApi";
import { fetchOffers } from "../services/offersApi";
import OfferDetailsModal from "../components/OfferDetailsModal";

const OffersMapPage = () => {
  const { isFeatureEnabled } = useFeatureFlags();
  const mapsEnabled = isFeatureEnabled("maps.enabled");
  const apiKey = getGoogleMapsApiKey();
  const { isLoaded } = useGoogleMapsLoader();
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [detailsOffer, setDetailsOffer] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const openOfferDetails = async (marker) => {
    setLoadingDetails(true);
    try {
      const offers = await fetchOffers();
      const full = offers.find((item) => item.id === marker.id);
      setDetailsOffer(full || marker);
    } catch {
      setDetailsOffer(marker);
    } finally {
      setLoadingDetails(false);
    }
  };

  const { data: markers = [], isLoading } = useQuery({
    queryKey: ["offers-map"],
    queryFn: () => fetchOffersMap(),
    enabled: mapsEnabled,
  });

  const center = useMemo(() => {
    if (markers.length > 0) {
      return {
        lat: Number(markers[0].latitude),
        lng: Number(markers[0].longitude),
      };
    }
    return DEFAULT_MAP_CENTER;
  }, [markers]);

  if (!mapsEnabled) {
    return (
      <div className="rounded-2xl border border-white/5 bg-[#111827]/60 p-8 text-center text-slate-400">
        خريطة العقارات غير مفعّلة. يمكن للمسؤول تفعيلها من إعدادات النظام.
      </div>
    );
  }

  if (!apiKey) {
    return (
      <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-8 text-center text-amber-200">
        أضف `VITE_GOOGLE_MAPS_API_KEY` في ملف البيئة لتفعيل الخريطة.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <MapPin size={28} className="text-emerald-400" />
          خريطة العقارات
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          {isLoading
            ? "جار تحميل العروض..."
            : `${markers.length} عرض بموقع محدد على الخريطة`}
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/5">
        {isLoaded ? (
          <GoogleMap
            mapContainerStyle={{ width: "100%", height: "min(70vh, 640px)" }}
            center={center}
            zoom={DEFAULT_MAP_ZOOM}
            options={{ streetViewControl: false }}
          >
            {markers.map((marker) => (
              <Marker
                key={marker.id}
                position={{
                  lat: Number(marker.latitude),
                  lng: Number(marker.longitude),
                }}
                onClick={() => setSelectedMarker(marker)}
              />
            ))}

            {selectedMarker && (
              <InfoWindow
                position={{
                  lat: Number(selectedMarker.latitude),
                  lng: Number(selectedMarker.longitude),
                }}
                onCloseClick={() => setSelectedMarker(null)}
              >
                <div className="min-w-[180px] space-y-2 p-1 text-right" dir="rtl">
                  <p className="font-bold text-slate-900">
                    {selectedMarker.offerCode}
                  </p>
                  <p className="text-sm text-slate-600">
                    {selectedMarker.city}
                    {selectedMarker.district ? ` — ${selectedMarker.district}` : ""}
                  </p>
                  <p className="text-sm font-medium text-emerald-700">
                    {Number(selectedMarker.priceFrom || 0).toLocaleString("ar-EG")} ر.س
                  </p>
                  <button
                    type="button"
                    className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white"
                    onClick={() => {
                      openOfferDetails(selectedMarker);
                      setSelectedMarker(null);
                    }}
                    disabled={loadingDetails}
                  >
                    {loadingDetails ? "جاري التحميل..." : "عرض التفاصيل"}
                  </button>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        ) : (
          <div className="flex h-[480px] items-center justify-center text-slate-400">
            جار تحميل الخريطة...
          </div>
        )}
      </div>

      <OfferDetailsModal
        isOpen={!!detailsOffer}
        onClose={() => setDetailsOffer(null)}
        offer={detailsOffer}
      />
    </div>
  );
};

export default OffersMapPage;
