import { projects } from "./projectsData";
import { FaMapMarkerAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

const ProjectsGrid = () => {
  const base = import.meta.env.BASE_URL || "/";

  return (
    <section className="py-24 px-6 md:px-16 bg-white">
      <div className="grid gap-16 md:grid-cols-2 lg:grid-cols-3">

        {projects.map((item) => (
          <div
            key={item.id}
            className="group relative"
          >
            {/* IMAGE */}
            <div className="relative h-[320px] overflow-hidden rounded-[28px]">
              
              {/* 🔥 Image */}
              <img
                src={`${base}${item.image}`}
                alt={item.title}
                className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
              />

              {/* 🔥 Dark overlay (default) */}
              <div className="absolute inset-0 bg-black/40 transition duration-500 group-hover:bg-black/0" />

              {/* 🔥 Ribbon */}
              <div className="absolute top-6 -left-14 rotate-[-35deg] bg-[#9d7857] px-20 py-2 text-white text-sm font-semibold shadow-md">
                للبيع على الخارطة
              </div>
            </div>

            {/* 🔥 Floating Card (نازل لتحت أكتر) */}
            <div className="absolute -bottom-12 left-1/2 w-[90%] -translate-x-1/2 rounded-[26px] bg-[#f8f9fa] p-6 text-center shadow-[0_20px_50px_rgba(0,0,0,0.15)] transition-all duration-500 group-hover:-translate-y-2">

              {/* Title */}
              <h3 className="text-lg font-semibold text-[#1f1f1f]">
                {item.title}
              </h3>

              {/* Location */}
              <div className="mt-2 flex items-center justify-center gap-2 text-gray-500">
                <FaMapMarkerAlt className="text-[#9d7857]" />
                <span>{item.location}</span>
              </div>

              {/* 🔥 Hover Content */}
              <div className="max-h-0 overflow-hidden opacity-0 transition-all duration-500 group-hover:max-h-20 group-hover:opacity-100">
                <Link to={`/projects/${item.id}`}>
  اقرأ المزيد
</Link>
              </div>

            </div>
          </div>
        ))}

      </div>
    </section>
  );
};

export default ProjectsGrid;