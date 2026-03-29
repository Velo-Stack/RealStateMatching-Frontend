import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { properties } from "../home/data/propertiesData";

const PropertySlider = () => {
  const base = import.meta.env.BASE_URL || "/";

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
      <h3 className="mb-6 border-b border-gray-200 pb-3 text-right text-lg font-bold text-[#171717]">
        عقارات مميزة
      </h3>

      <Swiper
        modules={[Autoplay]}
        slidesPerView={1} // 🔥 أهم سطر
        spaceBetween={16}
        loop={true}
        autoplay={{ delay: 2500, disableOnInteraction: false }}
        className="w-full min-w-0" // 🔥 يمنع الكسر
      >
        {properties.map((item) => (
          <SwiperSlide key={item.id} className="w-full">
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
              <img
                src={`${base}${item.image}`}
                alt={item.title}
                className="h-44 w-full object-cover sm:h-52"
              />

              <div className="p-4 text-right">
                <h4 className="mb-2 text-sm font-semibold text-[#171717] sm:text-base">
                  {item.title}
                </h4>

                <p className="text-sm text-gray-500">{item.location}</p>

                <p className="mt-2 font-bold text-[#9d7857]">{item.price}</p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default PropertySlider;
