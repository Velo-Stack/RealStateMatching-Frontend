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
    <section className="relative overflow-x-hidden bg-[#f3f4f6] pt-16 pb-24 font-cairo">
      <div className="mb-10 text-center">
        <h2 className="mb-3 text-3xl font-bold text-slate-900 md:text-4xl">
          عقارات مميزة
        </h2>
        <p className="mx-auto max-w-xl text-slate-500">
          اكتشف أفضل العقارات المختارة بعناية في أهم مدن المملكة
        </p>
      </div>

      <div className="relative px-6 md:px-16">
        <Swiper
          className="!overflow-hidden md:!overflow-visible"
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
            const location = item.location || item.offer?.city || "";

            return (
              <SwiperSlide key={item.id || index}>
                <div className="group">

                  {/* IMAGE */}
                  <div className="relative h-[380px] overflow-hidden rounded-[28px]">

                    {/* Image */}
                    <img
                      src={imageUrl}
                      alt={title}
                      className="h-full w-full object-cover object-top transition duration-700 group-hover:scale-110 group-hover:-translate-y-2"
                    />

                    {/* Dark overlay */}
                    <div className="absolute inset-0 bg-black/40 transition duration-500 group-hover:bg-black/0" />

                    {/* Ribbon */}
                    <div className="absolute top-6 -left-14 rotate-[-35deg] bg-[#9d7857] px-20 py-2 text-white text-sm font-semibold shadow-md">
                      {item.badge || "للبيع على الخارطة"}
                    </div>
                  </div>

                  {/* Floating Card — negative margin يخليها تتداخل مع الصورة */}
                  <div className="relative z-10 mx-auto w-[88%] -mt-8 rounded-[26px] bg-[#f8f9fa] p-5 text-center shadow-[0_20px_50px_rgba(0,0,0,0.15)] transition-all duration-500 group-hover:-translate-y-1">

                    {/* Title */}
                    <h3 className="text-lg font-semibold text-[#1f1f1f]">
                      {title}
                    </h3>

                    {/* Location */}
                    {location && (
                      <div className="mt-2 flex items-center justify-center gap-2 text-gray-500">
                        <svg className="text-[#9d7857] w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                        </svg>
                        <span>{location}</span>
                      </div>
                    )}

                    {/* Hover: اقرأ المزيد */}
                    <div className="max-h-0 overflow-hidden opacity-0 transition-all duration-500 group-hover:max-h-20 group-hover:opacity-100 mt-1">
                      <a
                        href={`/projects/${item.id}`}
                        className="text-sm font-semibold text-[#9d7857] hover:underline"
                      >
                        اقرأ المزيد
                      </a>
                    </div>
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
