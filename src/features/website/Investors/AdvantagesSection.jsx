import { useEffect, useRef, useState } from "react";
import "./AdvantagesSection.css";

const AdvantagesSection = ({ advantages = [] }) => {
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
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  if (!advantages?.length) return null;

  return (
    <section
      ref={sectionRef}
      className={`investor-advantages font-cairo ${
        isVisible ? "is-visible" : ""
      }`}
      dir="rtl"
    >
      <div className="investor-advantages__inner">
        <div className="investor-advantages__header">
          <p className="investor-advantages__eyebrow">لماذا رواسخ</p>
          <h2 className="investor-advantages__title">مزايا الاستثمار معنا</h2>
          <div className="investor-advantages__rule" aria-hidden="true" />
        </div>

        <div className="investor-advantages__list">
          {advantages.map((item, index) => (
            <article
              key={item.id || index}
              className="investor-advantage"
              style={{ "--adv-delay": `${0.12 + index * 0.09}s` }}
            >
              <div className="investor-advantage__num-wrap">
                <span className="investor-advantage__tick" aria-hidden="true" />
                <span className="investor-advantage__num">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>

              <div className="investor-advantage__text">
                <h3 className="investor-advantage__name">{item.title}</h3>
                <p className="investor-advantage__body">{item.body}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AdvantagesSection;
