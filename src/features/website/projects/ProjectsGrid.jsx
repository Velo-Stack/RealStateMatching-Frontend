import { projects } from "./projectsData";

const ProjectsGrid = () => {
  const base = import.meta.env.BASE_URL || "/";

  return (
    <section className="py-20 px-6 md:px-16 bg-white">
      <div className="grid gap-8 md:grid-cols-3">
        {projects.map((item) => (
          <div key={item.id} className="group">
            {/* Image */}
            <div className="relative overflow-hidden">
              <img
                src={`${base}${item.image}`}
                className="h-[350px] w-full object-cover transition duration-700 group-hover:scale-110"
              />

              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition" />

              <div className="absolute bottom-6 left-6 text-white">
                <span className="text-xs opacity-80">
                  {item.type === "property" && "عقار"}
                  {item.type === "land" && "أرض"}
                  {item.type === "office" && "مكتب"}
                </span>

                <h3 className="text-lg font-semibold mt-1">{item.title}</h3>
              </div>
            </div>

            {/* Price */}
            <div className="mt-3 text-lg font-semibold">{item.price}</div>

            {/* Info */}
            <div className="text-sm text-gray-500">
              {item.location}
              {item.beds && ` — ${item.beds} غرف`}
              {item.baths && ` — ${item.baths} حمام`}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProjectsGrid;
