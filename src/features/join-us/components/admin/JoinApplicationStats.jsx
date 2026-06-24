import { motion as Motion } from 'framer-motion';
import {
  CheckCircle,
  Clock,
  Eye,
  UsersThree,
  XCircle,
} from 'phosphor-react';
import { LABELS } from '../../constants/joinUsConstants';
import { ADMIN_CARD_CLASS, ADMIN_JOIN_GRADIENT } from './adminJoinUsTheme';

const BarChart = ({ title, data, labels, delay = 0 }) => {
  const entries = Object.entries(data || {});
  const max = Math.max(...entries.map(([, v]) => v), 1);

  return (
    <Motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      className={`${ADMIN_CARD_CLASS} p-5`}
    >
      <div className="absolute top-0 inset-x-0 h-px opacity-60" style={{ background: ADMIN_JOIN_GRADIENT }} />
      <h3 className="text-white font-semibold mb-4 text-sm">{title}</h3>
      {entries.length === 0 ? (
        <p className="text-slate-500 text-sm">لا توجد بيانات</p>
      ) : (
        <div className="space-y-3.5">
          {entries.map(([key, value]) => (
            <div key={key}>
              <div className="flex justify-between text-xs text-slate-400 mb-1.5">
                <span className="truncate max-w-[70%]">{labels?.[key] || key}</span>
                <span className="text-slate-300 font-medium">{value}</span>
              </div>
              <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                <Motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(value / max) * 100}%` }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  className="h-full rounded-full"
                  style={{ background: ADMIN_JOIN_GRADIENT }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </Motion.div>
  );
};

const StatCard = ({ label, value, icon: Icon, gradient, delay = 0, onClick }) => (
  <Motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.35, delay }}
    whileHover={{ y: -3, scale: 1.01 }}
    onClick={onClick}
    className={`${ADMIN_CARD_CLASS} p-5 group ${onClick ? 'cursor-pointer' : ''}`}
  >
    <div
      className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br ${gradient}`}
    />
    <div className="relative flex items-start justify-between mb-3">
      <div
        className={`h-11 w-11 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white shadow-lg`}
      >
        <Icon size={22} weight="duotone" />
      </div>
    </div>
    <p className="relative text-3xl font-bold text-white mb-0.5">{value ?? 0}</p>
    <p className="relative text-sm text-slate-400">{label}</p>
  </Motion.div>
);

const JoinApplicationStats = ({ stats }) => {
  if (!stats) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className={`${ADMIN_CARD_CLASS} p-5 h-28 animate-pulse`} />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          label="إجمالي الطلبات"
          value={stats.total}
          icon={UsersThree}
          gradient="from-[#C9A84C]/80 to-[#2D5016]"
          delay={0}
        />
        <StatCard
          label="قيد المراجعة"
          value={stats.pending}
          icon={Clock}
          gradient="from-amber-500/80 to-amber-700"
          delay={0.05}
        />
        <StatCard
          label="تمت المراجعة"
          value={stats.reviewed}
          icon={Eye}
          gradient="from-sky-500/80 to-indigo-600"
          delay={0.1}
        />
        <StatCard
          label="مقبول"
          value={stats.accepted}
          icon={CheckCircle}
          gradient="from-emerald-500/80 to-emerald-700"
          delay={0.15}
        />
        <StatCard
          label="مرفوض"
          value={stats.rejected}
          icon={XCircle}
          gradient="from-red-500/70 to-red-700"
          delay={0.2}
        />
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <BarChart
          title="رخصة فال"
          data={stats.falLicense}
          labels={LABELS.hasFalLicense}
          delay={0.25}
        />
        <BarChart
          title="سنوات الخبرة"
          data={stats.experienceYears}
          labels={LABELS.experienceYears}
          delay={0.3}
        />
        <BarChart
          title="التخصصات"
          data={stats.specializations}
          labels={LABELS.specializations}
          delay={0.35}
        />
      </div>
    </div>
  );
};

export default JoinApplicationStats;
