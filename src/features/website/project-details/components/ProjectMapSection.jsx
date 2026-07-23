import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";

const ProjectMapSection = ({ lat, lng, title, googleMapsUrl }) => {
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

      // Use Google Maps tiles for a Google-like appearance
      L.tileLayer("https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}", {
        maxZoom: 20,
        subdomains: ["mt0", "mt1", "mt2", "mt3"],
      }).addTo(map);

      // Custom HTML Marker matching the requested design
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
        className: "", // Disable default Leaflet background
        iconSize: [120, 100], // Space for circle and label
        iconAnchor: [60, 50], // Center the circle at the exact lat/lng
      });

      const marker = L.marker([lat, lng], { icon: customIcon }).addTo(map);

      // Make the marker clickable if there's a Google Maps URL
      if (googleMapsUrl) {
        marker.on("click", () => {
          window.open(googleMapsUrl, "_blank", "noopener,noreferrer");
        });
      }

      mapInstanceRef.current = map;
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
    <div className="font-cairo space-y-4" dir="rtl">
      <h2 className="text-2xl font-bold text-[#1f1f1f] border-r-4 border-[#9d7857] pr-3">
        موقع المشروع
      </h2>

      <div
        className="w-full rounded-3xl overflow-hidden shadow-md border border-gray-100"
        style={{ height: "clamp(240px, 40vw, 420px)" }}
      >
        <div ref={mapRef} style={{ width: "100%", height: "100%", zIndex: 0 }} />
      </div>

      <style>{`
        /* Marker Styling */
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
          background-color: rgba(34, 197, 94, 0.35); /* Translucent Green */
          border: 2.5px solid rgba(21, 128, 61, 0.9); /* Solid Green Border */
          border-radius: 50%;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
          position: relative;
          z-index: 1;
        }

        .marker-label {
          background-color: #0b8043; /* Google Maps-like Green */
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
          pointer-events: auto; /* make it clickable */
          cursor: pointer;
          transition: all 0.2s ease;
          z-index: 2;
        }

        .marker-label:hover {
          transform: translateY(-2px);
          background-color: #096836;
          box-shadow: 0 4px 10px rgba(0,0,0,0.3);
        }

        /* Hide Leaflet outline on focus */
        .leaflet-container:focus {
          outline: none;
        }
      `}</style>
    </div>
  );
};

export default ProjectMapSection;
