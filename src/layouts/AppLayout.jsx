import { useEffect, useState } from 'react';
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
import { hasPermission } from '../utils/rbac';
import { useAuth } from '../context/AuthContext';

const AppLayoutContent = () => {
  const location = useLocation();
  const { user } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState(
    () => document.documentElement.getAttribute('data-theme') || 'dark',
  );

  const canReadNotifications = hasPermission(user, 'notifications.read');
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
      <div className="hidden lg:block">
        <Sidebar collapsed={sidebarCollapsed} />
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed top-0 right-0 h-full z-50 lg:hidden"
            >
              <Sidebar collapsed={false} onClose={() => setMobileMenuOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <main className="flex-1 flex flex-col min-w-0">
        {canReadNotifications && <NotificationPermissionBanner />}

        <header className="sticky top-0 z-40 h-16 lg:h-20 bg-[#0d1117]/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-3 lg:gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={toggleSidebar}
              aria-label="تبديل القائمة الجانبية"
              className="h-9 w-9 lg:h-10 lg:w-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:bg-white/10 hover:text-white hover:border-emerald-500/30 transition-all duration-300"
            >
              <List size={20} weight="bold" />
            </motion.button>

            <div>
              <h2 className="text-base lg:text-xl font-bold text-white m-0">
                {currentPage.title}
              </h2>
              <p className="text-[10px] lg:text-xs text-slate-500 m-0 hidden sm:block">{currentPage.subtitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 lg:gap-3">
            <Link to="/">
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="h-9 px-3 lg:h-10 lg:px-4 inline-flex items-center justify-center gap-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white hover:border-amber-500/30 transition-all duration-300"
              >
                <House size={18} weight="duotone" />
                <span className="hidden lg:inline text-sm font-medium">الواجهة الرئيسية</span>
              </motion.div>
            </Link>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={toggleTheme}
              className="h-9 w-9 lg:h-10 lg:w-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:bg-white/10 hover:text-white transition-all duration-300"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </motion.button>

            {canReadNotifications && (
              <NotificationBellDropdown
                notifications={safeNotifications}
                unreadCount={unreadCount}
              />
            )}
          </div>
        </header>

        <section className="flex-1 overflow-y-auto px-4 lg:px-6 py-4 lg:py-6">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            <Outlet />
          </motion.div>
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
