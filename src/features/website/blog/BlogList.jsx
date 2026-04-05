import { blogs } from "./data/blogData";

const BlogList = () => {
  const base = import.meta.env.BASE_URL || "/";

  return (
    <div className="mx-auto max-w-4xl space-y-10 px-4 sm:space-y-12 lg:space-y-16">
      {blogs.map((blog) => (
        <article
          key={blog.id}
          className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-lg"
        >
          {/* Image */}
          <div className="overflow-hidden">
            <img
              src={`${base}${blog.image}`}
              alt={blog.title}
              className="w-full h-52 object-cover transition duration-500 group-hover:scale-105 sm:h-64 md:h-72"
            />
          </div>

          {/* Content */}
          <div className="p-4 text-right sm:p-6">
            <span className="text-xs text-[#9d7857] font-semibold">
              10 مارس 2024
            </span>

            <h2 className="mt-2 mb-3 text-lg font-bold text-[#171717] group-hover:text-[#9d7857] transition sm:text-xl">
              {blog.title}
            </h2>

            <p className="mb-5 text-sm text-gray-600 leading-relaxed">
              {blog.desc}
            </p>

            <button className="rounded-full bg-[#9d7857] px-6 py-2 text-sm text-white hover:opacity-90 transition">
              اقرأ المزيد
            </button>
          </div>
        </article>
      ))}
    </div>
  );
};

export default BlogList;
