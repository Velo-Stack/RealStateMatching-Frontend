import { Fragment } from "react";
import { Link } from "react-router-dom";

const getDefaultBreadcrumbs = (title) => [
  { label: "الرئيسية", to: "/" },
  { label: title, current: true },
];

const PageBanner = ({
  title,
  description,
  breadcrumbs,
  image, // 👈 الجديد
}) => {
  const base = import.meta.env.BASE_URL || "/";

  const breadcrumbItems =
    breadcrumbs?.length > 0 ? breadcrumbs : getDefaultBreadcrumbs(title);

  return (
    <section className="relative mt-20 pt-20 pb-16 md:mt-24 md:pt-24 md:pb-20 overflow-hidden">
      {/* 🔥 Banner Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${base}${image})`,
        }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-white/70" />

      {/* Bottom line */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-gray-300" />

      {/* Content */}
      <div className="relative px-6 md:px-16" dir="rtl">
        <h1 className="text-3xl md:text-4xl font-bold text-black mb-6">
          {title}
        </h1>

        {description && (
          <p className="text-gray-700 mb-6 max-w-xl">{description}</p>
        )}

        <div className="flex items-center gap-6 text-sm">
          {breadcrumbItems.map((item, index) => {
            const isCurrent = item.current;

            return (
              <Fragment key={index}>
                {item.to ? (
                  <Link
                    to={item.to}
                    className={`relative pb-2 transition ${
                      isCurrent
                        ? "text-black font-semibold"
                        : "text-gray-600 hover:text-[#9d7857]"
                    }`}
                  >
                    {item.label}

                    {isCurrent && (
                      <span className="absolute left-0 bottom-0 w-full h-[2px] bg-[#9d7857]" />
                    )}
                  </Link>
                ) : (
                  <span className="relative pb-2 text-black font-semibold">
                    {item.label}
                    <span className="absolute left-0 bottom-0 w-full h-[2px] bg-[#9d7857]" />
                  </span>
                )}
              </Fragment>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PageBanner;
