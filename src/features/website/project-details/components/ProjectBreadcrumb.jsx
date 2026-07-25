import { Fragment } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, Home } from "lucide-react";
import { motion } from "framer-motion";

const ProjectBreadcrumb = ({ title }) => {
  const items = [
    { label: "الرئيسية", to: "/", icon: true },
    { label: "المشاريع", to: "/projects" },
    { label: title || "تفاصيل المشروع", current: true },
  ];

  return (
    <section
      className="relative overflow-hidden border-b border-[#9d7857]/10 bg-[#f6f1eb] font-cairo"
      dir="rtl"
    >
      {/* Soft artistic backdrop */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(157,120,87,0.14),_transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(157,120,87,0.08),_transparent_50%)]" />
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(#9d7857 1px, transparent 1px), linear-gradient(90deg, #9d7857 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="absolute -left-16 top-1/2 h-40 w-40 -translate-y-1/2 rounded-full bg-[#9d7857]/10 blur-3xl" />
        <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[#9d7857]/10 blur-2xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 pb-5 pt-24 sm:px-8 sm:pb-6 sm:pt-28 md:px-16">
        <motion.nav
          aria-label="مسار التصفح"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-wrap items-center gap-1.5 sm:gap-2"
        >
          {items.map((item, index) => (
            <Fragment key={`${item.label}-${index}`}>
              {index > 0 && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.12 + index * 0.08 }}
                  className="mx-0.5 inline-flex items-center text-[#9d7857]/45"
                  aria-hidden
                >
                  <ChevronLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" strokeWidth={2.2} />
                </motion.span>
              )}

              {item.current ? (
                <motion.span
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.18 + index * 0.08 }}
                  className="relative inline-flex max-w-[220px] items-center truncate rounded-full border border-[#9d7857]/20 bg-white/80 px-3.5 py-1.5 text-sm font-bold text-[#6f5340] shadow-[0_8px_24px_rgba(157,120,87,0.12)] backdrop-blur-sm sm:max-w-md sm:px-4 sm:text-[15px]"
                  aria-current="page"
                  title={item.label}
                >
                  <span className="absolute inset-x-3 -bottom-[1px] h-[2px] rounded-full bg-gradient-to-l from-transparent via-[#9d7857] to-transparent" />
                  {item.label}
                </motion.span>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.08 }}
                >
                  <Link
                    to={item.to}
                    className="group inline-flex items-center gap-2 rounded-full px-2.5 py-1.5 text-sm font-semibold text-[#5c4a3a] transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/70 hover:text-[#9d7857] sm:px-3 sm:text-[15px]"
                  >
                    {item.icon && (
                      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#9d7857] text-white shadow-[0_6px_16px_rgba(157,120,87,0.35)] transition-transform duration-300 group-hover:scale-105">
                        <Home className="h-3.5 w-3.5" strokeWidth={2.4} />
                      </span>
                    )}
                    <span className="relative">
                      {item.label}
                      <span className="absolute inset-x-0 -bottom-0.5 h-px origin-right scale-x-0 bg-[#9d7857] transition-transform duration-300 group-hover:scale-x-100" />
                    </span>
                  </Link>
                </motion.div>
              )}
            </Fragment>
          ))}
        </motion.nav>

        {/* Decorative accent line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.35, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="mt-4 h-px origin-right bg-gradient-to-l from-[#9d7857]/50 via-[#9d7857]/15 to-transparent"
        />
      </div>
    </section>
  );
};

export default ProjectBreadcrumb;
