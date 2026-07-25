import "./DiscoverSection.css";

export default function DiscoverSection({
  image,
  smallTitle,
  mainTitle = "رواسخ العقارية",
  description,
  height = "640px",
  mobileHeight = "520px",
}) {
  const base = import.meta.env.BASE_URL || "/";
  const imageUrl =
    typeof image === "string" && /^(https?:)?\/\//.test(image)
      ? image
      : `${base}${String(image || "").replace(/^\/+/, "")}`;

  return (
    <section
      className="discover-parallax font-cairo"
      dir="rtl"
      style={{
        backgroundImage: `url(${imageUrl})`,
        "--discover-height": height,
        "--discover-height-mobile": mobileHeight,
      }}
    >
      <div className="discover-parallax__overlay" aria-hidden="true" />

      <div className="discover-parallax__content animate-fadeUp">
        {smallTitle ? (
          <p className="discover-parallax__eyebrow">{smallTitle}</p>
        ) : null}

        <h2 className="discover-parallax__title">{mainTitle}</h2>

        {description ? (
          <p className="discover-parallax__desc">{description}</p>
        ) : null}
      </div>
    </section>
  );
}
