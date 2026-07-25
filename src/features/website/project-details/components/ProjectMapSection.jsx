import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";

const ProjectMapSection = ({
  lat,
  lng,
  title,
  googleMapsUrl,
  compact = false,
}) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (mapInstanceRef.current) return;
    if (!mapRef.current) return;

    import("leaflet").then((L) => {
      const map = L.map(mapRef.current, {
        center: [lat, lng],
        zoom: 15,
        zoomControl: true,
        scrollWheelZoom: false,
        attributionControl: false,
      });

      L.tileLayer("https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}", {
        maxZoom: 20,
        subdomains: ["mt0", "mt1", "mt2", "mt3"],
      }).addTo(map);

      const markerHtml = `
        <div class="custom-map-marker">
          <div class="marker-circle"></div>
          <div class="marker-label">
            <span>توجه إلى الموقع</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 256 256">
              <path d="M128,16a88.1,88.1,0,0,0-88,88c0,75.3,80,132.17,83.41,134.55a8,8,0,0,0,9.18,0C136,236.17,216,179.3,216,104A88.1,88.1,0,0,0,128,16Zm0,56a32,32,0,1,1-32,32A32,32,0,0,1,128,72Z"></path>
            </svg>
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        html: markerHtml,
        className: "",
        iconSize: [120, 100],
        iconAnchor: [60, 50],
      });

      const marker = L.marker([lat, lng], { icon: customIcon }).addTo(map);

      if (googleMapsUrl) {
        marker.on("click", () => {
          window.open(googleMapsUrl, "_blank", "noopener,noreferrer");
        });
      }

      mapInstanceRef.current = map;

      // Fix tiles when rendered inside a sidebar/flex layout
      setTimeout(() => {
        map.invalidateSize();
      }, 120);
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lat, lng, googleMapsUrl]);

  return (
    <div
      className={`font-cairo ${
        compact
          ? "overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-[0_10px_30px_rgba(0,0,0,0.05)]"
          : "space-y-4"
      }`}
      dir="rtl"
    >
      {!compact && (
        <h2 className="border-r-4 border-[#9d7857] pr-3 text-2xl font-bold text-[#1f1f1f]">
          موقع المشروع
        </h2>
      )}

      {compact && (
        <div className="border-b border-gray-100 px-5 py-4">
          <h2 className="flex items-center gap-2.5 text-lg font-bold text-gray-900">
            <span className="inline-block h-5 w-1.5 rounded-full bg-[#9d7857]" />
            موقع المشروع
          </h2>
          {title && (
            <p className="mt-1 line-clamp-1 text-sm text-gray-500">{title}</p>
          )}
        </div>
      )}

      <div
        className={
          compact
            ? "h-[280px] w-full sm:h-[340px] lg:h-[min(70vh,520px)]"
            : "w-full overflow-hidden rounded-3xl border border-gray-100 shadow-md"
        }
        style={compact ? undefined : { height: "clamp(240px, 40vw, 420px)" }}
      >
        <div ref={mapRef} style={{ width: "100%", height: "100%", zIndex: 0 }} />
      </div>

      <style>{`
        .custom-map-marker {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 120px;
          height: 100px;
        }

        .marker-circle {
          width: 48px;
          height: 48px;
          background-color: rgba(34, 197, 94, 0.35);
          border: 2.5px solid rgba(21, 128, 61, 0.9);
          border-radius: 50%;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
          position: relative;
          z-index: 1;
        }

        .marker-label {
          background-color: #0b8043;
          color: white;
          padding: 6px 14px;
          border-radius: 6px;
          font-family: 'Cairo', sans-serif;
          font-size: 13px;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 6px;
          margin-top: 4px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
          pointer-events: auto;
          cursor: pointer;
          transition: all 0.2s ease;
          z-index: 2;
        }

        .marker-label:hover {
          transform: translateY(-2px);
          background-color: #096836;
          box-shadow: 0 4px 10px rgba(0,0,0,0.3);
        }

        .leaflet-container:focus {
          outline: none;
        }
      `}</style>
    </div>
  );
};

export default ProjectMapSection;
