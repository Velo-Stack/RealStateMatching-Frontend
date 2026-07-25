import { useEffect, useRef, useState } from "react";
import "./EventsSection.css";

const formatEventDate = (dateValue) => {
  if (!dateValue) return "";
  const parsed = new Date(dateValue);
  if (Number.isNaN(parsed.getTime())) return String(dateValue);
  return parsed.toLocaleDateString("ar-SA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const EventsSection = ({ events = [] }) => {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

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

  if (!events?.length) return null;

  return (
    <section
      ref={sectionRef}
      className={`investor-events font-cairo ${isVisible ? "is-visible" : ""}`}
      dir="rtl"
    >
      <div className="investor-events__inner">
        <div className="investor-events__header">
          <p className="investor-events__eyebrow">أجندة رواسخ</p>
          <h2 className="investor-events__title">الفعاليات والأحداث</h2>
          <div className="investor-events__rule" aria-hidden="true" />
        </div>

        <div className="investor-events__list">
          {events.map((item, index) => (
            <article
              key={item.id || index}
              className="investor-event"
              style={{ "--event-delay": `${0.12 + index * 0.09}s` }}
            >
              <span className="investor-event__index" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>

              <div className="investor-event__main">
                <p className="investor-event__date">
                  {formatEventDate(item.date)}
                </p>
                <h3 className="investor-event__name">{item.title}</h3>
                {item.description ? (
                  <p className="investor-event__desc">{item.description}</p>
                ) : null}
              </div>

              <span className="investor-event__line" aria-hidden="true" />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EventsSection;
