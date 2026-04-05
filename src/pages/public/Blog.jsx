import PageBanner from "../../components/common/PageBanner";

import BlogList from "../../features/website/blog/BlogList";
import BlogSidebar from "../../features/website/blog/BlogSidebar";
import Footer from "../../features/website/home/sections/Footer";

const Blog = () => {
  return (
    <div className="bg-white font-cairo">
      <PageBanner
        title="المدونة"
        description="أحدث المقالات والتحليلات في السوق العقاري"
        image="images/bannar-3.png"
      />

      <section className="px-4 py-12 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        <div className="mx-auto max-w-7xl grid gap-10 lg:grid-cols-3">
          {/* 🔥 Blog List */}
          <div className="lg:col-span-2 min-w-0">
            <BlogList />
          </div>

          {/* 🔥 Sidebar */}
          <div className="lg:col-span-1 min-w-0">
            <BlogSidebar />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Blog;
