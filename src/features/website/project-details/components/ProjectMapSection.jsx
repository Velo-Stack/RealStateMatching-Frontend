import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";

// Custom 3D gold marker SVG
const CUSTOM_MARKER_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" width="40" height="54" viewBox="0 0 40 54">
  <defs>
    <radialGradient id="pinGrad" cx="38%" cy="30%" r="60%">
      <stop offset="0%" stop-color="#e8c98a"/>
      <stop offset="50%" stop-color="#9d7857"/>
      <stop offset="100%" stop-color="#6b4f35"/>
    </radialGradient>
    <radialGradient id="innerGrad" cx="40%" cy="35%" r="60%">
      <stop offset="0%" stop-color="#fff9f0"/>
      <stop offset="100%" stop-color="#c4a06e"/>
    </radialGradient>
    <filter id="shadow" x="-30%" y="-10%" width="160%" height="140%">
      <feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="#00000055"/>
    </filter>
  </defs>
  <!-- Pin body -->
  <path d="M20 2C11.16 2 4 9.16 4 18C4 28.5 20 50 20 50S36 28.5 36 18C36 9.16 28.84 2 20 2Z"
        fill="url(#pinGrad)" filter="url(#shadow)"/>
  <!-- Highlight shine on upper-left -->
  <ellipse cx="14" cy="12" rx="5" ry="3.5" fill="white" opacity="0.35" transform="rotate(-20 14 12)"/>
  <!-- Inner circle -->
  <circle cx="20" cy="18" r="8" fill="url(#innerGrad)"/>
  <!-- Building icon (house shape) -->
  <path d="M20 12 L14 17 L14 23 L18 23 L18 20 L22 20 L22 23 L26 23 L26 17 Z"
        fill="#9d7857" opacity="0.85"/>
  <!-- Shadow ellipse under pin -->
  <ellipse cx="20" cy="51" rx="6" ry="2" fill="#00000033"/>
</svg>
`;

const ProjectMapSection = ({ lat, lng, title, googleMapsUrl }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    // Only init once
    if (mapInstanceRef.current) return;
    if (!mapRef.current) return;

    // Dynamic import to avoid SSR issues
    import("leaflet").then((L) => {
      const map = L.map(mapRef.current, {
        center: [lat, lng],
        zoom: 15,
        zoomControl: true,
        scrollWheelZoom: false,
        attributionControl: false,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
      }).addTo(map);

      // Custom marker icon
      const customIcon = L.divIcon({
        html: CUSTOM_MARKER_SVG,
        className: "",
        iconSize: [40, 54],
        iconAnchor: [20, 54],
        popupAnchor: [0, -54],
      });

      const marker = L.marker([lat, lng], { icon: customIcon }).addTo(map);

      // Popup
      const popupContent = `
        <div dir="rtl" style="font-family:'Cairo',sans-serif; min-width:160px; text-align:right;">
          <p style="font-weight:700; font-size:15px; color:#1f1f1f; margin:0 0 4px;">${title}</p>
          ${googleMapsUrl ? `<a href="${googleMapsUrl}" target="_blank" rel="noreferrer"
            style="color:#9d7857; font-size:12px; font-weight:600; text-decoration:none;">
            📍 فتح في Google Maps
          </a>` : ""}
        </div>
      `;
      marker.bindPopup(popupContent, {
        offset: [0, -48],
        className: "rwasikh-popup",
      });

      // Small bounce animation on load
      setTimeout(() => marker.openPopup(), 600);

      mapInstanceRef.current = map;
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lat, lng]);

  return (
    <div className="font-cairo space-y-4" dir="rtl">
      <h2 className="text-2xl font-bold text-[#1f1f1f] border-r-4 border-[#9d7857] pr-3">
        موقع المشروع
      </h2>

      <div
        className="w-full rounded-3xl overflow-hidden shadow-md border border-gray-100"
        style={{ height: "clamp(240px, 40vw, 420px)" }}
      >
        <div ref={mapRef} style={{ width: "100%", height: "100%" }} />
      </div>

      {googleMapsUrl && (
        <div className="flex justify-start">
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-[#9d7857] hover:text-[#856345] transition-colors text-sm font-semibold"
          >
            <span>📍</span>
            <span>فتح في خرائط Google Maps</span>
          </a>
        </div>
      )}

      {/* Leaflet popup custom styling */}
      <style>{`
        .rwasikh-popup .leaflet-popup-content-wrapper {
          border-radius: 14px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.12);
          border: 1px solid #f0e8df;
        }
        .rwasikh-popup .leaflet-popup-tip {
          background: white;
        }
      `}</style>
    </div>
  );
};

export default ProjectMapSection;
