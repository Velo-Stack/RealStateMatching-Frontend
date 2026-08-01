import { MapTrifold } from "phosphor-react";
import { buildMapsLink } from "../../constants/maps";

const VARIANT_STYLES = {
  app: {
    shell:
      "border-white/10 bg-gradient-to-br from-[#111827] via-[#0f172a] to-[#0b1220] text-white",
    iconWrap: "border-emerald-500/25 bg-emerald-500/10 text-emerald-300",
    title: "text-white",
    description: "text-slate-400",
    link: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20",
  },
  light: {
    shell: "border-[#e7e2db] bg-[#f7f4f0] text-[#1f2937]",
    iconWrap: "border-[#d6cfc6] bg-white text-[#059669]",
    title: "text-[#111827]",
    description: "text-[#6b7280]",
    link: "border-[#059669]/25 bg-white text-[#047857] hover:bg-[#ecfdf5]",
  },
};

const MapUnavailablePlaceholder = ({
  title = "الخريطة غير متاحة حالياً",
  description = "يمكنك متابعة استخدام الشاشة بشكل طبيعي، وسيظهر الموقع هنا عند تفعيل الخريطة.",
  height,
  className = "",
  variant = "app",
  latitude,
  longitude,
  fill = false,
  showMapsLink = true,
  compact = false,
}) => {
  const styles = VARIANT_STYLES[variant] || VARIANT_STYLES.app;
  const mapsLink = showMapsLink ? buildMapsLink(latitude, longitude) : null;

  return (
    <div
      className={`relative flex w-full items-center justify-center overflow-hidden rounded-2xl border text-center ${
        compact ? "px-5 py-6" : "px-6 py-10"
      } ${styles.shell} ${className}`}
      style={{
        ...(fill
          ? { height: "100%", minHeight: height || 280 }
          : { minHeight: height || (compact ? 160 : 280) }),
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, rgba(16,185,129,0.18), transparent 40%), radial-gradient(circle at 80% 70%, rgba(59,130,246,0.12), transparent 35%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(148,163,184,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.35) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div
        className={`relative z-10 mx-auto flex max-w-md flex-col items-center ${
          compact ? "gap-3" : "gap-4"
        }`}
      >
        <div
          className={`flex items-center justify-center rounded-2xl border ${styles.iconWrap} ${
            compact ? "h-11 w-11" : "h-14 w-14"
          }`}
        >
          <MapTrifold size={compact ? 22 : 28} weight="duotone" />
        </div>
        <div className="space-y-1.5">
          <h3 className={`font-bold ${styles.title} ${compact ? "text-sm" : "text-base"}`}>
            {title}
          </h3>
          {description && (
            <p className={`leading-6 ${styles.description} ${compact ? "text-xs" : "text-sm"}`}>
              {description}
            </p>
          )}
        </div>
        {mapsLink && (
          <a
            href={mapsLink}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center rounded-xl border px-4 py-2 text-xs font-semibold transition ${styles.link}`}
          >
            فتح الموقع في خرائط Google
          </a>
        )}
      </div>
    </div>
  );
};

export default MapUnavailablePlaceholder;
