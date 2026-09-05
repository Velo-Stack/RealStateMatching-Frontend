import { useEffect, useMemo, useRef, useState } from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { House, List, Moon, Sun } from 'phosphor-react';
import NotificationBellDropdown from '../features/notifications/components/NotificationBellDropdown';
import NotificationPermissionBanner from '../features/notifications/components/NotificationPermissionBanner';
import { NotificationRealtimeProvider } from '../features/notifications/context/NotificationRealtimeContext';
import { useNotificationAlerts } from '../features/notifications/hooks/useNotificationAlerts';
import { useNotificationSocket } from '../features/notifications/hooks/useNotificationSocket';
import { useNotificationsQuery } from '../features/notifications/hooks/useNotificationsQuery';
import { getUnreadCount } from '../features/notifications/utils/notificationsUtils';
import Sidebar from '../components/Sidebar';
import GroupSubnav from '../components/navigation/GroupSubnav';
import { hasPermission } from '../utils/rbac';
import { useAuth } from '../context/AuthContext';
import { useFeatureFlags } from '../hooks/useFeatureFlags';
import { getActiveSidebarGroup, isNavItemPathActive } from '../components/sidebar/sidebarVisibility';

const GROUP_PAGE_VARIANTS = {
  enter: (direction) => ({
    opacity: 0,
    x: direction > 0 ? -36 : 36,
    y: 10,
    filter: 'blur(6px)',
    scale: 0.985,
  }),
  center: {
    opacity: 1,
    x: 0,
    y: 0,
    filter: 'blur(0px)',
    scale: 1,
  },
  exit: (direction) => ({
    opacity: 0,
    x: direction > 0 ? 36 : -36,
    y: -6,
    filter: 'blur(4px)',
    scale: 0.99,
  }),
};

const DEFAULT_PAGE_VARIANTS = {
  enter: { opacity: 0, y: 12, filter: 'blur(4px)' },
  center: { opacity: 1, y: 0, filter: 'blur(0px)' },
  exit: { opacity: 0, y: -8, filter: 'blur(3px)' },
};

const AppLayoutContent = () => {
  const location = useLocation();
  const { user, profile } = useAuth();
  const { isFeatureEnabled } = useFeatureFlags();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState(
    () => document.documentElement.getAttribute('data-theme') || 'dark',
  );
  const prevTabIndexRef = useRef(-1);
  const transitionDirectionRef = useRef(0);

  const canReadNotifications = hasPermission(user, 'notifications.read');
  const activeGroup = getActiveSidebarGroup(
    user,
    isFeatureEnabled,
    profile,
    location.pathname,
  );

  const groupTabPaths = useMemo(() => {
    if (!activeGroup?.items?.length) return [];

    const paths = [];
    if (activeGroup.hubPath && activeGroup.hubPath !== '/app') {
      paths.push(activeGroup.hubPath);
    }
    activeGroup.items.forEach((item) => paths.push(item.to));
    return paths;
  }, [activeGroup]);

  const currentTabIndex = useMemo(() => {
    if (!groupTabPaths.length) return -1;
    const exact = groupTabPaths.findIndex((path) => location.pathname === path);
    if (exact >= 0) return exact;
    return groupTabPaths.findIndex((path) =>
      isNavItemPathActive(location.pathname, path),
    );
  }, [groupTabPaths, location.pathname]);

  const hasGroupSubnav = groupTabPaths.length >= 2 && currentTabIndex >= 0;

  if (hasGroupSubnav && currentTabIndex !== prevTabIndexRef.current) {
    transitionDirectionRef.current =
      prevTabIndexRef.current < 0
        ? 0
        : currentTabIndex > prevTabIndexRef.current
          ? 1
          : -1;
    prevTabIndexRef.current = currentTabIndex;
  } else if (!hasGroupSubnav) {
    transitionDirectionRef.current = 0;
    prevTabIndexRef.current = -1;
  }

  const { data: notifications = [], isSuccess: notificationsReady } =
    useNotificationsQuery(canReadNotifications);
  useNotificationAlerts(notifications, notificationsReady);

  useEffect(() => {
    const stored = localStorage.getItem('sidebarCollapsed');
    if (stored === null) {
      setSidebarCollapsed(true);
      localStorage.setItem('sidebarCollapsed', 'true');
    } else if (stored === 'true') {
      setSidebarCollapsed(true);
    }
  }, []);

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    const currentTheme = storedTheme === 'light' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', currentTheme);
    setTheme(currentTheme);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const toggleSidebar = () => {
    if (window.innerWidth < 1024) {
      setMobileMenuOpen(prev => !prev);
    } else {
      setSidebarCollapsed(prev => {
        const next = !prev;
        localStorage.setItem('sidebarCollapsed', String(next));
        return next;
      });
    }
  };

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      localStorage.setItem('theme', next);
      document.documentElement.setAttribute('data-theme', next);
      return next;
    });
  };

  const safeNotifications = Array.isArray(notifications) ? notifications : [];
  const unreadCount = getUnreadCount(safeNotifications);

  const pageInfo = {
    '/app': { title: 'لوحة التحكم', subtitle: 'نظرة عامة على النظام' },
    '/app/hubs/operations': { title: 'العمليات', subtitle: 'عروض وطلبات وخريطة وتطابقات' },
    '/app/hubs/tools': { title: 'الأدوات', subtitle: 'حاسبات ودراسات ومقارنات' },
    '/app/hubs/engagement': { title: 'التحفيز', subtitle: 'نقاط ومكافآت ومتصدرين' },
    '/app/hubs/admin': { title: 'الإدارة', subtitle: 'مستخدمين وفرق ومكاتب' },
    '/app/hubs/communication': { title: 'التواصل', subtitle: 'محادثات وتنبيهات' },
    '/app/hubs/website': { title: 'الموقع', subtitle: 'لوحة تحكم الموقع' },
    '/app/hubs/system': { title: 'النظام', subtitle: 'تقارير وإعدادات واشتراك' },
    '/app/offers': { title: 'إدارة العروض', subtitle: 'عرض وإدارة العقارات' },
    '/app/requests': { title: 'طلبات العملاء', subtitle: 'إدارة طلبات البحث' },
    '/app/matches': { title: 'التطابقات', subtitle: 'المطابقات الذكية' },
    '/app/notifications': { title: 'التنبيهات', subtitle: 'إشعارات النظام' },
    '/app/users': { title: 'إدارة المستخدمين', subtitle: 'إدارة الصلاحيات' },
    '/app/audit-logs': { title: 'سجلات التدقيق', subtitle: 'تتبع العمليات' },
    '/app/reports': { title: 'التقارير والتصدير', subtitle: 'تصدير البيانات' },
    '/app/teams': { title: 'إدارة الفرق', subtitle: 'فرق العمل' },
    '/app/chat': { title: 'المحادثات', subtitle: 'التواصل الداخلي' },
  };

  const currentPage = pageInfo[location.pathname] || { title: '', subtitle: '' };

  return (
    <div className="min-h-screen flex theme-main-layout">
      <div className="hidden lg:block shrink-0 app-shell-sidebar-rail">
        <Sidebar collapsed={sidebarCollapsed} />
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
              animate={{ opacity: 1, backdropFilter: 'blur(10px)' }}
              exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 z-50 lg:hidden"
            />
            <motion.div
              initial={{ x: '110%', opacity: 0.5, scale: 0.94 }}
              animate={{ x: 0, opacity: 1, scale: 1 }}
              exit={{ x: '110%', opacity: 0, scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 260, damping: 22, mass: 0.8 }}
              className="fixed top-0 right-0 h-full z-50 lg:hidden origin-right"
            >
              <Sidebar collapsed={false} onClose={() => setMobileMenuOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <main className="flex-1 flex flex-col min-w-0">
        {canReadNotifications && <NotificationPermissionBanner />}

        <div className="sticky top-0 z-40 app-shell-header-rail">
          <header className="app-shell-header flex items-center gap-3 lg:gap-4 h-14 lg:h-[3.75rem]">
            {/* Menu — rounded square like reference */}
            <motion.button
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.92 }}
              type="button"
              onClick={toggleSidebar}
              aria-label="تبديل القائمة الجانبية"
              className="h-11 w-11 shrink-0 flex items-center justify-center rounded-[14px] app-shell-control"
            >
              <motion.span
                animate={{ rotate: sidebarCollapsed ? 0 : 180 }}
                transition={{ type: 'spring', stiffness: 320, damping: 18 }}
                className="flex"
              >
                <List size={20} weight="bold" />
              </motion.span>
            </motion.button>

            {/* Actions — floating circular soft controls */}
            <div className="flex items-center gap-2.5 lg:gap-3 shrink-0 ms-auto">
              <Link to="/">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="h-11 px-3.5 lg:px-4 inline-flex items-center justify-center gap-2 rounded-full app-shell-control"
                  title="الواجهة الرئيسية"
                >
                  <House size={18} weight="duotone" />
                  <span className="hidden lg:inline text-sm font-medium">الواجهة الرئيسية</span>
                </motion.div>
              </Link>

              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                type="button"
                onClick={toggleTheme}
                aria-label="تبديل المظهر"
                className="h-11 w-11 flex items-center justify-center rounded-full app-shell-control"
              >
                {theme === 'dark' ? (
                  <Sun size={18} weight="fill" className="app-shell-theme-icon" />
                ) : (
                  <Moon size={18} weight="fill" />
                )}
              </motion.button>

              {canReadNotifications && (
                <NotificationBellDropdown
                  notifications={safeNotifications}
                  unreadCount={unreadCount}
                />
              )}
            </div>
          </header>
        </div>

        <section className="flex-1 overflow-y-auto px-4 lg:px-6 py-4 lg:py-6">
          <GroupSubnav group={activeGroup} pathname={location.pathname} />

          {location.pathname !== '/app' &&
            !location.pathname.startsWith('/app/hubs/') &&
            location.pathname !== '/app/offers' &&
            location.pathname !== '/app/requests' &&
            (currentPage.title || currentPage.subtitle) && (
            <div className="mb-4 lg:mb-5 flex flex-wrap items-baseline gap-x-2 gap-y-1">
              {currentPage.title ? (
                <h2
                  className="text-xl lg:text-2xl font-bold m-0 leading-tight"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {currentPage.title}
                </h2>
              ) : null}
              {currentPage.title && currentPage.subtitle ? (
                <span
                  className="text-base lg:text-lg m-0 leading-none"
                  style={{ color: 'var(--text-dim)' }}
                  aria-hidden
                >
                  ·
                </span>
              ) : null}
              {currentPage.subtitle ? (
                <p
                  className="text-sm lg:text-base m-0 leading-tight"
                  style={{ color: 'var(--text-dim)' }}
                >
                  {currentPage.subtitle}
                </p>
              ) : null}
            </div>
          )}

          <AnimatePresence mode="wait" initial={false} custom={transitionDirectionRef.current}>
            <motion.div
              key={location.pathname}
              className="group-page-transition"
              custom={transitionDirectionRef.current}
              variants={hasGroupSubnav ? GROUP_PAGE_VARIANTS : DEFAULT_PAGE_VARIANTS}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                duration: hasGroupSubnav ? 0.38 : 0.28,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </section>
      </main>
    </div>
  );
};

const AppLayout = () => {
  const { user } = useAuth();
  const canReadNotifications = hasPermission(user, 'notifications.read');
  const { isConnected } = useNotificationSocket({
    enabled: canReadNotifications,
    userId: user?.id,
  });

  return (
    <NotificationRealtimeProvider socketConnected={isConnected}>
      <AppLayoutContent />
    </NotificationRealtimeProvider>
  );
};

export default AppLayout;
