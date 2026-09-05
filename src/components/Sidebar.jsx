import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { SignOut, X } from "phosphor-react";
import { useMyTeam } from "../hooks";
import { useFeatureFlags } from "../hooks/useFeatureFlags";
import {
  getSidebarNavigationGroups,
  isSidebarGroupActive,
} from "./sidebar/sidebarVisibility";
import { hasPermission, PLATFORM_ROLE_LABELS } from "../utils/rbac";
import { handleAvatarImageError, resolveAvatarUrl } from "../utils/uploads";

const SIDEBAR_SPRING = {
  type: "spring",
  stiffness: 170,
  damping: 19,
  mass: 0.85,
};

const labelMotion = {
  initial: { opacity: 0, x: 14 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 8 },
};

const Sidebar = ({ collapsed, onClose }) => {
  const location = useLocation();
  const { user, profile, logout } = useAuth();
  const { isFeatureEnabled } = useFeatureFlags();
  const { data: teamData } = useMyTeam(hasPermission(user, "teams.read"));
  const currentTheme =
    document.documentElement.getAttribute("data-theme") || "dark";
  const base = import.meta.env.BASE_URL || "/";
  const logoSrc =
    currentTheme === "light"
      ? `${base}logo-black.png`
      : `${base}logo-white.png`;
  const isMobileDrawer = Boolean(onClose);
  const isCollapsedDesktop = collapsed && !isMobileDrawer;
  const isExpanded = !collapsed;

  const navLinkClasses = ({ isActive }) => {
    const base = isCollapsedDesktop
      ? "group relative flex items-center justify-center w-11 h-11 mx-auto rounded-2xl text-sm font-medium transition-colors duration-300 app-shell-nav-link"
      : "group relative flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-colors duration-300 app-shell-nav-link";

    if (isActive) {
      return `${base} app-shell-nav-active`;
    }
    return base;
  };

  const NavIcon = ({ children, index }) => (
    <motion.span
      className="text-xl shrink-0 leading-none app-shell-nav-icon flex items-center justify-center"
      initial={false}
      animate={
        isCollapsedDesktop
          ? { scale: 1, rotate: 0 }
          : { scale: 1, rotate: 0 }
      }
      transition={{
        ...SIDEBAR_SPRING,
        delay: isExpanded ? 0.04 + index * 0.02 : 0,
      }}
      whileHover={{ scale: 1.12, rotate: isCollapsedDesktop ? 8 : 0 }}
    >
      {children}
    </motion.span>
  );

  const navGroups = getSidebarNavigationGroups(user, isFeatureEnabled, profile);

  return (
    <motion.aside
      initial={false}
      animate={{
        width: isMobileDrawer ? "100vw" : collapsed ? 80 : 280,
        scale: 1,
      }}
      transition={SIDEBAR_SPRING}
      className={`relative sticky flex flex-col overflow-hidden theme-sidebar app-shell-sidebar ${
        isMobileDrawer
          ? "top-0 h-screen app-shell-sidebar-mobile"
          : "top-3 h-[calc(100vh-1.5rem)]"
      }`}
    >
      {/* Logo Section */}
      <div
        className={`relative z-[1] h-16 lg:h-20 border-b border-[color:var(--shell-border)] flex items-center ${
          isCollapsedDesktop ? "px-2 justify-center" : "px-4"
        }`}
      >
        <div
          className={`flex items-center w-full ${
            isCollapsedDesktop ? "justify-center" : "justify-between"
          }`}
        >
          <div className="flex items-center gap-3 min-w-0">
            <motion.div
              whileHover={{ rotate: 12, scale: 1.08 }}
              animate={
                isCollapsedDesktop
                  ? { scale: 1, rotate: 0 }
                  : { scale: 1, rotate: 0 }
              }
              transition={SIDEBAR_SPRING}
              className="relative shrink-0"
            >
              <motion.div
                className="h-10 w-10 rounded-2xl flex items-center justify-center bg-[color:var(--shell-control-bg)] shadow-[var(--shell-control-shadow)] border border-[color:var(--shell-border)]"
              >
                <img
                  src={logoSrc}
                  alt="عقارات ماتش"
                  className="h-6 w-6 object-contain"
                />
              </motion.div>
            </motion.div>
            <AnimatePresence mode="wait">
              {!collapsed && (
                <motion.div
                  key="brand-title"
                  initial={{ opacity: 0, x: 20, scale: 0.96 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 10, scale: 0.98 }}
                  transition={{
                    duration: 0.38,
                    ease: [0.22, 1, 0.36, 1],
                    delay: 0.06,
                  }}
                  className="min-w-0"
                >
                  <h1
                    className="text-base lg:text-lg font-bold m-0 truncate"
                    style={{ color: "var(--sidebar-title-color)" }}
                  >
                    رواسخ العقارية
                  </h1>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {onClose && (
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="h-8 w-8 rounded-full app-shell-control flex items-center justify-center lg:hidden"
            >
              <X size={18} weight="bold" />
            </motion.button>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav
        className={`relative z-[1] flex-1 py-5 space-y-2 overflow-y-auto app-shell-sidebar-nav ${
          isCollapsedDesktop ? "px-2" : "px-3"
        }`}
      >
        {navGroups.length === 0 ? (
          <p
            className="text-xs px-3 py-4 m-0 text-center"
            style={{ color: "var(--text-dim)" }}
          >
            لا توجد مجموعات متاحة لصلاحياتك الحالية
          </p>
        ) : (
          navGroups.map((group, index) => {
          const groupActive = isSidebarGroupActive(group, location.pathname);
          const GroupIcon = group.icon;

          return (
            <motion.div
              key={group.id}
              initial={false}
              animate={{
                x: 0,
                opacity: 1,
              }}
              transition={{
                ...SIDEBAR_SPRING,
                delay: isExpanded ? Math.min(index * 0.028, 0.28) : 0,
              }}
            >
              <NavLink
                to={group.to}
                end={group.end}
                className={() => navLinkClasses({ isActive: groupActive })}
                onClick={onClose}
                aria-current={groupActive ? "page" : undefined}
                title={
                  isCollapsedDesktop
                    ? `${group.label} (${group.items.length})`
                    : undefined
                }
              >
                <NavIcon index={index}>
                  <GroupIcon weight="duotone" />
                </NavIcon>
                <AnimatePresence initial={false}>
                  {!collapsed && (
                    <motion.span
                      key={`${group.id}-label`}
                      {...labelMotion}
                      transition={{
                        duration: 0.32,
                        ease: [0.22, 1, 0.36, 1],
                        delay: 0.05 + Math.min(index * 0.03, 0.3),
                      }}
                      className="whitespace-nowrap"
                    >
                      {group.label}
                      <span
                        className="ms-2 text-[11px] font-medium opacity-70"
                        style={{ color: "inherit" }}
                      >
                        {group.items.length}
                      </span>
                    </motion.span>
                  )}
                </AnimatePresence>
                {groupActive && !isCollapsedDesktop && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[color:var(--shell-active-text)]/50"
                    transition={SIDEBAR_SPRING}
                  />
                )}
              </NavLink>
            </motion.div>
          );
        })
        )}
      </nav>

      {/* User Section */}
      <div
        className={`relative z-[1] py-4 border-t border-[color:var(--shell-border)] ${
          isCollapsedDesktop ? "px-2" : "px-3"
        }`}
      >
        <NavLink
          to="/app/profile"
          onClick={onClose}
          title={isCollapsedDesktop ? "الملف الشخصي" : undefined}
          className={`flex items-center rounded-2xl hover:bg-[color:var(--shell-nav-hover-bg)] transition-colors ${
            isCollapsedDesktop
              ? "justify-center p-1.5"
              : "gap-3 px-3 py-2"
          }`}
        >
          <motion.div
            className="relative shrink-0"
            animate={{ scale: isCollapsedDesktop ? 1 : 1 }}
            whileHover={{ scale: 1.06 }}
            transition={SIDEBAR_SPRING}
          >
            {user?.avatarUrl ? (
              <div className="h-10 w-10 rounded-2xl overflow-hidden border border-[color:var(--shell-border)] bg-slate-800">
                <img
                  src={resolveAvatarUrl(user.avatarUrl)}
                  alt={user?.name}
                  className="h-full w-full object-cover"
                  onError={handleAvatarImageError}
                />
              </div>
            ) : (
              <div
                className="h-10 w-10 rounded-2xl flex items-center justify-center font-bold text-sm text-[color:var(--shell-active-text)] shadow-[0_6px_16px_var(--accent-glow)]"
                style={{ background: "var(--gradient-accent)" }}
              >
                {user?.name?.charAt(0)}
              </div>
            )}
            <span
              className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2"
              style={{
                backgroundColor: "var(--success)",
                borderColor: "var(--shell-surface)",
              }}
            />
          </motion.div>
          <AnimatePresence initial={false}>
            {!collapsed && (
              <motion.div
                key="user-meta"
                initial={{ opacity: 0, x: 14 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                transition={{
                  duration: 0.34,
                  ease: [0.22, 1, 0.36, 1],
                  delay: 0.12,
                }}
                className="flex-1 min-w-0"
              >
                <h4
                  className="text-sm font-semibold m-0 truncate"
                  style={{ color: "var(--text-primary)" }}
                >
                  {user?.name}
                </h4>
                <p
                  className="text-[11px] m-0"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {PLATFORM_ROLE_LABELS[user?.role] || user?.role}
                </p>
                {teamData?.team && (
                  <p
                    className="text-[10px] m-0 truncate"
                    style={{ color: "var(--text-dim)" }}
                  >
                    {teamData.team.name}
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </NavLink>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.96 }}
          onClick={logout}
          title={isCollapsedDesktop ? "تسجيل خروج" : undefined}
          className={`mt-3 flex items-center justify-center gap-2 rounded-2xl text-sm font-medium text-red-400/80 bg-red-500/5 border border-red-500/10 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30 transition-colors duration-300 ${
            isCollapsedDesktop ? "w-11 h-11 mx-auto p-0" : "w-full px-4 py-2.5"
          }`}
          type="button"
          layout
          transition={SIDEBAR_SPRING}
        >
          <SignOut weight="duotone" className="text-lg" />
          <AnimatePresence initial={false}>
            {!collapsed && (
              <motion.span
                key="logout-label"
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden whitespace-nowrap"
              >
                تسجيل خروج
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
