const ProjectGallery = ({ images, baseUrl }) => {
  return (
    <div className="mb-20" dir="rtl">
      <h2 className="text-3xl font-bold text-[#1f1f1f] mb-8">معرض الصور</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {images.map((image, index) => (
          <div
            key={index}
            className="group relative rounded-[20px] overflow-hidden shadow-lg h-[280px] cursor-pointer"
          >
            <img
              src={`${baseUrl}${image}`}
              alt={`صورة ${index + 1}`}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectGallery;
