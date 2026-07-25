import { investorAnnouncementsSectionData } from "./data/announcementsData";

const AnnouncementsSection = ({ announcements = [] }) => {
  if (!announcements?.length) return null;

  return (
    <section className="py-24 px-6 md:px-16 bg-[#efefef]" dir="rtl">
      {/* العنوان في اليمين خالص */}
      <div className="text-right mb-16">
        <h2 className="text-5xl md:text-6xl font-bold text-[#1f1f1f]">
          الإعلانات والأخبار
        </h2>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
        {announcements.map((item, index) => (
          <div
            key={item.id || index}
            className="relative pr-6 pt-8 group"
          >
            {/* الكورنر فقط بدون الخط الأفقي */}
            <span className="absolute right-0 top-0 w-16 h-16 border-t-2 border-r-2 border-[#9d7857] rounded-tr-[40px]" />

            <p className="text-sm text-[#9d7857] mb-3 font-medium">
              {new Date(item.publishedAt).toLocaleDateString("ar-SA", { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>

            <h3 className="font-semibold text-lg text-[#1f1f1f] mb-2">{item.title}</h3>

            <p className="text-gray-700 leading-7 text-sm group-hover:text-[#9d7857] transition">
              {item.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AnnouncementsSection;
