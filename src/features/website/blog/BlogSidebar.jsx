import PropertySlider from "./PropertySlider";

const BlogSidebar = () => {
  return (
    <aside className="w-full space-y-6 lg:sticky lg:top-28">
      {/* الأكثر قراءة */}
      <div className="rounded-2xl border border-gray-200 bg-[#fcfbf8] p-5 shadow-sm sm:p-6">
        <h3 className="mb-5 border-b border-gray-200 pb-3 text-right text-lg font-bold text-[#171717]">
          الأكثر قراءة
        </h3>

        <ul className="space-y-3 text-right text-sm text-gray-600">
          <li className="cursor-pointer leading-6 hover:text-[#9d7857] transition">
            كيف تختار العقار المناسب للاستثمار؟
          </li>
          <li className="cursor-pointer leading-6 hover:text-[#9d7857] transition">
            أفضل مناطق الاستثمار العقاري
          </li>
          <li className="cursor-pointer leading-6 hover:text-[#9d7857] transition">
            خطوات شراء عقار بدون مخاطر
          </li>
        </ul>
      </div>

      {/* 🔥 Slider */}
      <div className="w-full overflow-hidden rounded-2xl">
        <PropertySlider />
      </div>

      {/* Quote */}
      <div className="rounded-2xl border border-gray-200 bg-[#f8f9fa] p-5 text-right shadow-sm sm:p-6">
        <p className="mb-4 text-sm leading-relaxed text-gray-700">
          الاستثمار العقاري هو أحد أكثر الطرق أمانًا لبناء الثروة على المدى
          الطويل.
        </p>
        <span className="text-[#9d7857] font-semibold">— رواش العقارية</span>
      </div>
    </aside>
  );
};

export default BlogSidebar;
