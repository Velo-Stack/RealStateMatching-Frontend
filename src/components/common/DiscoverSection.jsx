export default function DiscoverSection({
  image,
  smallTitle,
  mainTitle,
  height = "250px",
  overlay = "bg-gradient-to-b from-black/70 via-black/50 to-black/80",
}) {
  const base = import.meta.env.BASE_URL || "/";
  const imageUrl =
    typeof image === "string" && /^(https?:)?\/\//.test(image)
      ? image
      : `${base}${String(image || "").replace(/^\/+/, "")}`;

  return (
    <section
      className="relative bg-center bg-cover md:bg-fixed flex items-center justify-center"
      style={{
        backgroundImage: `url(${imageUrl})`,
        height: height,
      }}
    >
      {/* Overlay */}
      <div className={`absolute inset-0 ${overlay}`} />

      {/* Content */}
      <div className="relative z-10 text-center text-white px-6 animate-fadeUp">

        <h4 className="text-gray-300 italic tracking-widest mb-4 text-lg">
          {smallTitle}
        </h4>

        <h2 className="text-4xl md:text-6xl font-bold tracking-widest">
          {mainTitle}
        </h2>

      </div>
    </section>
  );
}
