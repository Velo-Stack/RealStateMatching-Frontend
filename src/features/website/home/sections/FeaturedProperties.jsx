import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { properties } from "../data/propertiesData";

const FeaturedProperties = () => {
  const base = import.meta.env.BASE_URL || "/";
  const paginationRef = useRef(null);

  return (
    <section className="relative bg-[#f3f4f6] py-20 font-cairo">
      {/* Header */}
      <div className="mb-16 text-center">
        <h2 className="mb-4 text-3xl font-bold text-slate-900 md:text-4xl">
          عقارات مميزة
        </h2>
        <p className="mx-auto max-w-xl text-slate-500">
          اكتشف أفضل العقارات المختارة بعناية في أهم مدن المملكة
        </p>
      </div>

      {/* Slider */}
      <div className="relative px-6 md:px-16">
        <Swiper
          modules={[Navigation, Autoplay, Pagination]}
          spaceBetween={30}
          slidesPerView={1}
          loop={true}
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
              swiper.params.pagination.el = paginationRef.current;
              swiper.pagination.init();
              swiper.pagination.render();
              swiper.pagination.update();
            });
          }}
          breakpoints={{
            768: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 3,
            },
          }}
        >
          {properties.map((item) => (
            <SwiperSlide key={item.id}>
              <div className="group">
                {/* Image */}
                <div className="relative overflow-hidden">
                  <img
                    src={`${base}${item.image}`}
                    alt={item.title}
                    className="h-[520px] w-full object-cover transition duration-700 group-hover:scale-110"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition duration-500" />

                  {/* Content */}
                  <div className="absolute bottom-10 left-6 text-white">
                    <span className="text-xs tracking-widest opacity-80">
                      للبيع
                    </span>

                    <h3 className="text-2xl font-semibold leading-snug mt-2">
                      {item.title}
                    </h3>
                  </div>
                </div>

                {/* Price */}
                <div className="mt-4 text-xl font-semibold text-slate-900">
                  {item.price}
                </div>

                {/* Info */}
                <div className="text-sm text-slate-500 mt-1">
                  {item.location} — {item.beds} غرف، {item.baths} حمام
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* 🔥 Arrows */}
        <div className="absolute right-6 md:right-16 top-0 z-20 flex flex-row gap-0">
          {/* Prev (Left Arrow) - Brown/Accent background */}
          <button
            className="custom-prev w-20 h-20 flex items-center justify-center text-white text-3xl shadow-lg transition-all duration-300 hover:opacity-80 hover:scale-110"
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

          {/* Next (Right Arrow) - Black background */}
          <button
            className="custom-next w-20 h-20 flex items-center justify-center text-white text-3xl shadow-lg transition-all duration-300 hover:opacity-80 hover:scale-110"
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

        {/* Pagination Dots */}
        <div
          ref={paginationRef}
          className="mt-8 flex items-center justify-center gap-2"
        ></div>
      </div>

      {/* Pagination Dot Styles */}
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
