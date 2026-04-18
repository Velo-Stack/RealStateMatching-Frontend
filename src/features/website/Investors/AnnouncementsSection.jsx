import { investorAnnouncementsSectionData } from "./data/announcementsData";

const AnnouncementsSection = ({
  content = investorAnnouncementsSectionData,
}) => {
  const { title, buttonLabel, items = [] } =
    content ?? investorAnnouncementsSectionData;

  return (
    <section className="py-24 px-6 md:px-16 bg-[#efefef]" dir="rtl">
      {/* العنوان في اليمين خالص */}
      <div className="text-right mb-16">
        <h2 className="text-5xl md:text-6xl font-bold text-[#1f1f1f]">
          {title}
        </h2>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
        {items.map((item, index) => (
          <div
            key={`${item.date}-${index}`}
            className="relative pr-6 pt-8 group"
          >
            {/* الكورنر فقط بدون الخط الأفقي */}
            <span className="absolute right-0 top-0 w-16 h-16 border-t-2 border-r-2 border-[#9d7857] rounded-tr-[40px]" />

            <p className="text-sm text-[#9d7857] mb-3 font-medium">
              {item.date}
            </p>

            <p className="text-gray-700 leading-7 text-sm group-hover:text-[#9d7857] transition">
              {item.text}
            </p>
          </div>
        ))}
      </div>


    </section>
  );
};

export default AnnouncementsSection;
