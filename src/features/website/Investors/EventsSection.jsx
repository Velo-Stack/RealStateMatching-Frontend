import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { investorEventsSectionData } from "./data/eventsData";

const EventsSection = ({ events = [] }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.12 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
  };

  const titleVariants = {
    hidden: { opacity: 0, x: 30 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
  };

  if (!events?.length) return null;

  return (
    <section className="py-28 px-6 md:px-20 bg-[#e6ddd3] overflow-hidden" dir="rtl" ref={ref}>

      {/* Header */}
      <motion.div
        className="mb-16 text-right"
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={titleVariants}
      >
        <div className="inline-block">
          <h2 className="text-5xl md:text-6xl font-bold text-[#1f1f1f] leading-tight">
            الفعاليات والأحداث
          </h2>
          <div className="mt-3 h-[2px] w-16 bg-[#9d7857] rounded-full" />
        </div>
      </motion.div>

      {/* Events Grid */}
      <motion.div
        className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        {events.map((item, index) => (
          <motion.div
            key={item.id || index}
            variants={cardVariants}
            className="group relative bg-white rounded-2xl p-7 border border-[#e0d5c8] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-400 overflow-hidden cursor-default"
          >
            {/* Subtle background shimmer on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#9d7857]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl" />

            {/* Index number */}
            <span className="absolute top-5 left-5 text-4xl font-black text-[#1f1f1f]/20 select-none leading-none">
              {String(index + 1).padStart(2, "0")}
            </span>

            {/* Top accent bar */}
            <div className="h-[3px] w-8 bg-[#9d7857] rounded-full mb-6 group-hover:w-full transition-all duration-500 ease-out" />

            {/* Date badge */}
            <p className="text-xs font-semibold text-[#9d7857] tracking-wide mb-3 uppercase">
              {new Date(item.date).toLocaleDateString("ar-SA", { year: 'numeric', month: 'long' })}
            </p>

            {/* Title */}
            <h3 className="font-bold text-[#1f1f1f] mb-2">{item.title}</h3>

            {/* Text */}
            <p className="text-sm text-[#3a3a3a] leading-7 font-medium group-hover:text-[#1f1f1f] transition-colors duration-300">
              {item.description}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default EventsSection;
