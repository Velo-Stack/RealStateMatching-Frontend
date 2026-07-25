import { useEffect, useRef, useState } from "react";
import "./AnnouncementsSection.css";

const formatAnnouncementDate = (dateValue) => {
  if (!dateValue) return "";
  const parsed = new Date(dateValue);
  if (Number.isNaN(parsed.getTime())) return String(dateValue);
  return parsed.toLocaleDateString("ar-SA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const AnnouncementsSection = ({ announcements = [] }) => {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const updateScrollState = () => {
    const track = trackRef.current;
    if (!track) return;

    const maxScroll = track.scrollWidth - track.clientWidth;
    // RTL: scrollLeft is often 0 at start and goes negative in some browsers,
    // or positive depending on engine — normalize with abs.
    const left = Math.abs(track.scrollLeft);
    setCanScrollPrev(left > 8);
    setCanScrollNext(left < maxScroll - 8);
  };

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.18 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return undefined;

    updateScrollState();
    track.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);

    return () => {
      track.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [announcements]);

  const scrollByCard = (direction) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector(".investor-news__card");
    const amount = (card?.offsetWidth || 320) + 24;
    // In RTL, "next" (older/more content) typically scrolls toward the left visually.
    // Using scrollBy with positive/negative and letting the browser handle RTL.
    track.scrollBy({ left: direction * amount, behavior: "smooth" });
  };

  if (!announcements?.length) return null;

  const many = announcements.length > 3;
  const countClass =
    announcements.length === 1
      ? "is-count-1"
      : announcements.length === 2
        ? "is-count-2"
        : announcements.length === 3
          ? "is-count-3"
          : "has-scroll";

  return (
    <section
      ref={sectionRef}
      className={`investor-news font-cairo ${isVisible ? "is-visible" : ""} ${countClass}`}
      dir="rtl"
    >
      <div className="investor-news__inner">
        <div className="investor-news__header-row">
          <div className="investor-news__header">
            <p className="investor-news__eyebrow">آخر المستجدات</p>
            <h2 className="investor-news__title">الإعلانات والأخبار</h2>
            <div className="investor-news__rule" aria-hidden="true" />
          </div>

          {many ? (
            <div className="investor-news__nav">
              <button
                type="button"
                className="investor-news__nav-btn"
                aria-label="السابق"
                disabled={!canScrollPrev}
                onClick={() => scrollByCard(1)}
              >
                →
              </button>
              <button
                type="button"
                className="investor-news__nav-btn"
                aria-label="التالي"
                disabled={!canScrollNext}
                onClick={() => scrollByCard(-1)}
              >
                ←
              </button>
            </div>
          ) : null}
        </div>

        <div className="investor-news__scroller">
          <div ref={trackRef} className="investor-news__track">
            {announcements.map((item, index) => (
              <article
                key={item.id || index}
                className="investor-news__card"
                style={{ "--news-delay": `${0.1 + Math.min(index, 6) * 0.07}s` }}
              >
                <span className="investor-news__corner" aria-hidden="true" />
                <p className="investor-news__date">
                  {formatAnnouncementDate(item.publishedAt)}
                </p>
                <h3 className="investor-news__name">{item.title}</h3>
                <p className="investor-news__body">{item.body}</p>
                <span className="investor-news__bar" aria-hidden="true" />
              </article>
            ))}
          </div>

          {many ? (
            <>
              <span className="investor-news__fade investor-news__fade--start" aria-hidden="true" />
              <span className="investor-news__fade investor-news__fade--end" aria-hidden="true" />
            </>
          ) : null}
        </div>

        {many ? (
          <p className="investor-news__hint">اسحب أو استخدم الأسهم لتصفح المزيد</p>
        ) : null}
      </div>
    </section>
  );
};

export default AnnouncementsSection;
