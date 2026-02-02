import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef } from 'react';
import api from '../utils/api';
import { Bell, BellRinging, Check, Clock, CheckCircle, Handshake, ChatCircle, Gear } from 'phosphor-react';

// Notification sound URL (using a simple notification sound)
const NOTIFICATION_SOUND_URL = 'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3';

// Helper to get notification title and content
const getNotificationContent = (notification) => {
  const { type, match, meta } = notification;

  switch (type) {
    case 'MATCH':
      if (match) {
        const offerType = match.offer?.type === 'LAND' ? 'أرض' :
          match.offer?.type === 'PROJECT' ? 'مشروع' : 'مخطط';
        const city = match.offer?.city || match.request?.city || '';
        return {
          title: 'مطابقة جديدة! 🎉',
          content: `تم العثور على مطابقة بين عرض ${offerType} ${city ? `في ${city}` : ''} وطلب عميل`,
          icon: Handshake,
          iconColor: 'text-violet-400',
          bgColor: 'from-violet-500/20 to-purple-500/20',
        };
      }
      return {
        title: 'مطابقة جديدة',
        content: 'تم العثور على مطابقة جديدة',
        icon: Handshake,
        iconColor: 'text-violet-400',
        bgColor: 'from-violet-500/20 to-purple-500/20',
      };

    case 'MESSAGE':
      return {
        title: 'رسالة جديدة 💬',
        content: meta?.snippet || 'لديك رسالة جديدة في المحادثات',
        icon: ChatCircle,
        iconColor: 'text-cyan-400',
        bgColor: 'from-cyan-500/20 to-blue-500/20',
      };

    case 'SYSTEM':
      return {
        title: 'إشعار النظام ⚙️',
        content: meta?.message || 'إشعار من النظام',
        icon: Gear,
        iconColor: 'text-amber-400',
        bgColor: 'from-amber-500/20 to-orange-500/20',
      };

    default:
      return {
        title: 'تنبيه',
        content: 'لديك إشعار جديد',
        icon: Bell,
        iconColor: 'text-emerald-400',
        bgColor: 'from-emerald-500/20 to-cyan-500/20',
      };
  }
};

const Notifications = () => {
  const queryClient = useQueryClient();
  const prevUnreadCountRef = useRef(0);
  const audioRef = useRef(null);

  // Initialize audio
  useEffect(() => {
    audioRef.current = new Audio(NOTIFICATION_SOUND_URL);
    audioRef.current.volume = 0.5;
  }, []);

  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const { data } = await api.get('/notifications');
      return data;
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Play sound when new notifications arrive
  useEffect(() => {
    const unreadCount = notifications.filter(n => n.status === 'UNREAD').length;

    // Check if new notifications arrived (more unread than before)
    if (unreadCount > prevUnreadCountRef.current && prevUnreadCountRef.current !== 0) {
      // Play notification sound
      if (audioRef.current) {
        audioRef.current.play().catch(() => {
          // Ignore autoplay errors (browser may block)
        });
      }
      // Show toast
      toast.success('لديك إشعارات جديدة! 🔔');
    }

    prevUnreadCountRef.current = unreadCount;
  }, [notifications]);

  const markRead = useMutation({
    mutationFn: async (id) => {
      const { data } = await api.patch(`/notifications/${id}`, { status: 'READ' });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
    onError: () => {
      toast.error('حدث خطأ أثناء تحديث حالة التنبيه');
    },
  });

  const markAllRead = useMutation({
    mutationFn: async () => {
      const unread = notifications.filter(n => n.status === 'UNREAD');
      await Promise.all(unread.map(n => api.patch(`/notifications/${n.id}`, { status: 'READ' })));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast.success('تم تعليم جميع التنبيهات كمقروءة');
    },
    onError: () => {
      toast.error('حدث خطأ');
    },
  });

  const unreadCount = notifications.filter((n) => n.status === 'UNREAD').length;

  if (isLoading) {
    return (
      <div className="bg-[#111827]/60 backdrop-blur-xl rounded-2xl border border-white/5 p-8 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
          <span className="text-slate-400 text-sm">جاري تحميل التنبيهات...</span>
        </div>
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="bg-[#111827]/60 backdrop-blur-xl rounded-2xl border border-white/5 p-12 text-center">
        <div className="w-20 h-20 mx-auto mb-4 rounded-3xl bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20 flex items-center justify-center">
          <Bell size={36} className="text-emerald-400" weight="duotone" />
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">لا توجد تنبيهات</h3>
        <p className="text-slate-500 text-sm">ستظهر هنا جميع الإشعارات والتحديثات الجديدة</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 flex items-center justify-center">
            <BellRinging size={24} className="text-emerald-400" weight="duotone" />
          </div>
          <div>
            <p className="text-white font-semibold">
              {notifications.length} تنبيه
            </p>
            <p className="text-sm text-slate-500">
              {unreadCount > 0 ? `${unreadCount} غير مقروء` : 'جميعها مقروءة'}
            </p>
          </div>
        </div>

        {unreadCount > 0 && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => markAllRead.mutate()}
            disabled={markAllRead.isPending}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-medium px-4 py-2 hover:bg-emerald-500/20 transition-all duration-300 disabled:opacity-60"
          >
            <CheckCircle size={18} />
            تعليم الكل كمقروء
          </motion.button>
        )}
      </div>

      {/* Notifications List */}
      <div className="bg-[#111827]/60 backdrop-blur-xl rounded-2xl border border-white/5 overflow-hidden">
        <AnimatePresence>
          {notifications.map((n, index) => {
            const { title, content, icon: Icon, iconColor, bgColor } = getNotificationContent(n);

            return (
              <motion.div
                key={n.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`relative px-5 py-4 flex items-start justify-between gap-4 border-b border-white/5 last:border-0 transition-all duration-300 ${n.status === 'UNREAD'
                  ? 'bg-gradient-to-l from-emerald-500/5 to-transparent'
                  : 'hover:bg-white/[0.02]'
                  }`}
              >
                {/* Unread Indicator */}
                {n.status === 'UNREAD' && (
                  <div className="absolute right-0 top-0 bottom-0 w-1 bg-gradient-to-b from-emerald-500 to-cyan-500 rounded-full" />
                )}

                {/* Icon */}
                <div className={`h-10 w-10 rounded-xl shrink-0 flex items-center justify-center bg-gradient-to-br ${bgColor}`}>
                  <Icon size={18} className={iconColor} weight="duotone" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h4 className={`text-sm font-semibold mb-0.5 ${n.status === 'UNREAD' ? 'text-white' : 'text-slate-300'}`}>
                    {title}
                  </h4>
                  <p className={`text-sm mb-1 ${n.status === 'UNREAD' ? 'text-slate-300' : 'text-slate-500'}`}>
                    {content}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Clock size={12} />
                    <span>{new Date(n.createdAt).toLocaleString('ar-EG')}</span>
                  </div>
                </div>

                {/* Action */}
                {n.status === 'UNREAD' && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    disabled={markRead.isPending}
                    onClick={() => markRead.mutate(n.id)}
                    className="shrink-0 h-9 px-3 rounded-lg bg-white/5 border border-white/10 text-slate-400 text-xs font-medium hover:bg-emerald-500/10 hover:border-emerald-500/30 hover:text-emerald-400 transition-all duration-300 flex items-center gap-1.5 disabled:opacity-60"
                  >
                    <Check size={14} />
                    مقروء
                  </motion.button>
                )}

                {n.status === 'READ' && (
                  <span className="shrink-0 flex items-center gap-1 text-xs text-slate-600">
                    <CheckCircle size={14} weight="fill" />
                    تمت القراءة
                  </span>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Notifications;
