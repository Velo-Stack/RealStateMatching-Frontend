import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { properties as fallbackProperties } from "../data/propertiesData";

const FeaturedProperties = ({ items = [] }) => {
  const base = import.meta.env.BASE_URL || "/";
  const paginationRef = useRef(null);
  const properties = items.length ? items : fallbackProperties;

  return (
    <section className="relative bg-[#f3f4f6] py-20 font-cairo">
      <div className="mb-16 text-center">
        <h2 className="mb-4 text-3xl font-bold text-slate-900 md:text-4xl">
          عقارات مميزة
        </h2>
        <p className="mx-auto max-w-xl text-slate-500">
          اكتشف أفضل العقارات المختارة بعناية في أهم مدن المملكة
        </p>
      </div>

      <div className="relative px-6 md:px-16">
        <Swiper
          modules={[Navigation, Autoplay, Pagination]}
          spaceBetween={30}
          slidesPerView={1}
          loop={properties.length > 1}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          navigation={{
            nextEl: ".custom-next",
            prevEl: ".custom-prev",
          }}
          pagination={{
            el: paginationRef.current,
            clickable: true,
            bulletClass: "featured-bullet",
            bulletActiveClass: "featured-bullet-active",
          }}
          onSwiper={(swiper) => {
            setTimeout(() => {
              if (
                !paginationRef.current ||
                !swiper?.params?.pagination ||
                !swiper?.pagination
              ) {
                return;
              }
              swiper.params.pagination.el = paginationRef.current;
              swiper.pagination.init();
              swiper.pagination.render();
              swiper.pagination.update();
            });
          }}
          breakpoints={{
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
        >
          {properties.map((item, index) => {
            const imageUrl =
              item.imageUrl ||
              `${base}${String(item.image || "").replace(/^\/+/, "")}`;
            const title = item.title;
            const price = item.priceLabel || item.price;
            const location = item.location || item.offer?.city || "";

            return (
              <SwiperSlide key={item.id || index}>
                <div className="group">
                  <div className="relative overflow-hidden">
                    <img
                      src={imageUrl}
                      alt={title}
                      className="h-[520px] w-full object-cover transition duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/30 transition duration-500 group-hover:bg-black/50" />
                    <div className="absolute bottom-10 left-6 text-white">
                      <span className="text-xs tracking-widest opacity-80">
                        {item.badge || "للبيع"}
                      </span>
                      <h3 className="mt-2 text-2xl font-semibold leading-snug">
                        {title}
                      </h3>
                    </div>
                  </div>
                  <div className="mt-4 text-xl font-semibold text-slate-900">
                    {price}
                  </div>
                  <div className="mt-1 text-sm text-slate-500">
                    {location}
                    {item.beds || item.baths
                      ? ` — ${item.beds || 0} غرف، ${item.baths || 0} حمام`
                      : ""}
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>

        <div className="absolute right-6 top-0 z-20 flex flex-row gap-0 md:right-16">
          <button
            className="custom-prev flex h-20 w-20 items-center justify-center text-3xl text-white shadow-lg transition-all duration-300 hover:scale-110 hover:opacity-80"
            style={{ backgroundColor: "#9d7857" }}
          >
            <svg
              className="rotate-180"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          <button
            className="custom-next flex h-20 w-20 items-center justify-center text-3xl text-white shadow-lg transition-all duration-300 hover:scale-110 hover:opacity-80"
            style={{ backgroundColor: "#111111" }}
          >
            <svg
              className="rotate-180"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="9 6 15 12 9 18" />
            </svg>
          </button>
        </div>

        <div
          ref={paginationRef}
          className="mt-8 flex items-center justify-center gap-2"
        />
      </div>

      <style>{`
        .featured-bullet {
          display: inline-block;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background-color: #cbd5e1;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .featured-bullet:hover {
          background-color: #94a3b8;
          transform: scale(1.2);
        }
        .featured-bullet-active {
          background-color: #9d7857;
          transform: scale(1.3);
          box-shadow: 0 0 8px #9d7857;
        }
      `}</style>
    </section>
  );
};

export default FeaturedProperties;
