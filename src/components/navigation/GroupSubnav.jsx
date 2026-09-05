import { useEffect, useMemo, useRef } from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { SquaresFour } from "phosphor-react";
import { SIDEBAR_GROUPS } from "../sidebar/sidebarNavConfig";
import { isNavItemPathActive } from "../sidebar/sidebarVisibility";

/**
 * Horizontal group switcher shown above screens that belong to a sidebar group.
 */
const GroupSubnav = ({ group, pathname }) => {
  const scrollerRef = useRef(null);

  const tabs = useMemo(() => {
    const next = [];
    if (group && group.id !== SIDEBAR_GROUPS.DASHBOARD && group.items?.length) {
      if (group.hubPath && group.hubPath !== "/app") {
        next.push({
          key: `${group.id}-hub`,
          to: group.hubPath,
          label: "نظرة عامة",
          icon: SquaresFour,
          end: true,
          isActive: pathname === group.hubPath,
        });
      }

      group.items.forEach((item) => {
        next.push({
          key: item.to,
          to: item.to,
          label: item.label,
          icon: item.icon,
          end: item.to === "/app",
          isActive: isNavItemPathActive(pathname, item.to),
        });
      });
    }
    return next;
  }, [group, pathname]);

  const activeKey = tabs.find((tab) => tab.isActive)?.key;

  useEffect(() => {
    if (!activeKey || !scrollerRef.current) return;
    const active = scrollerRef.current.querySelector("[data-active='true']");
    if (active?.scrollIntoView) {
      active.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [activeKey]);

  if (tabs.length < 2) return null;

  return (
    <nav
      className="group-subnav mb-4 lg:mb-5 sticky top-0 z-20 -mx-1 pt-1 pb-2"
      aria-label={`تنقل مجموعة ${group.label}`}
    >
      <motion.div
        ref={scrollerRef}
        className="group-subnav-scroller flex items-center gap-2 overflow-x-auto px-1 py-1"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        {tabs.map((tab, index) => {
          const TabIcon = tab.icon;
          return (
            <NavLink
              key={tab.key}
              to={tab.to}
              end={tab.end}
              data-active={tab.isActive ? "true" : "false"}
              aria-current={tab.isActive ? "page" : undefined}
              className="group-subnav-tab relative shrink-0 inline-flex items-center no-underline"
            >
              <motion.span
                className="relative inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-medium overflow-hidden"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: Math.min(index * 0.04, 0.2),
                  duration: 0.3,
                  ease: [0.22, 1, 0.36, 1],
                }}
                whileHover={{ y: -1, scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                style={
                  tab.isActive
                    ? {
                        color: "var(--shell-active-text)",
                      }
                    : {
                        color: "var(--text-secondary)",
                        background: "var(--shell-control-bg)",
                        border: "1px solid var(--shell-border)",
                        boxShadow: "var(--shell-control-shadow)",
                      }
                }
              >
                {tab.isActive ? (
                  <motion.span
                    layoutId={`group-subnav-active-pill-${group.id}`}
                    className="absolute inset-0 rounded-full group-subnav-active-pill"
                    transition={{
                      type: "spring",
                      stiffness: 420,
                      damping: 32,
                      mass: 0.7,
                    }}
                    style={{
                      background: "var(--gradient-accent)",
                      boxShadow:
                        "0 8px 22px var(--accent-glow), inset 0 1px 0 rgba(255,255,255,0.25)",
                    }}
                  />
                ) : null}

                <span className="relative z-10 inline-flex items-center gap-2">
                  {TabIcon ? (
                    <motion.span
                      animate={
                        tab.isActive
                          ? { scale: 1.08, rotate: [0, -6, 0] }
                          : { scale: 1, rotate: 0 }
                      }
                      transition={{ duration: 0.4, ease: "easeOut" }}
                      className="inline-flex"
                    >
                      <TabIcon size={16} weight="duotone" />
                    </motion.span>
                  ) : null}
                  <span className="whitespace-nowrap">{tab.label}</span>
                </span>
              </motion.span>
            </NavLink>
          );
        })}
      </motion.div>
    </nav>
  );
};

export default GroupSubnav;
