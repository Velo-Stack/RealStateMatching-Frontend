import { JOIN_US_COLORS } from '../../constants/joinUsConstants';

export const ADMIN_JOIN_GRADIENT = 'linear-gradient(135deg, #C9A84C 0%, #2D5016 100%)';

export const ADMIN_CARD_CLASS =
  'relative overflow-hidden bg-[#111]/5 backdrop-blur-xl rounded-2xl border border-white/[0.06] shadow-xl shadow-black/20';

export const STATUS_STYLES = {
  PENDING: {
    label: 'قيد المراجعة',
    pill: 'bg-amber-500/15 text-amber-300 border-amber-500/25',
    dot: 'bg-amber-400',
    gradient: 'from-amber-500/20 to-amber-600/10',
  },
  REVIEWED: {
    label: 'تمت المراجعة',
    pill: 'bg-sky-500/15 text-sky-300 border-sky-500/25',
    dot: 'bg-sky-400',
    gradient: 'from-sky-500/20 to-sky-600/10',
  },
  ACCEPTED: {
    label: 'مقبول',
    pill: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/25',
    dot: 'bg-emerald-400',
    gradient: 'from-emerald-500/20 to-emerald-600/10',
  },
  REJECTED: {
    label: 'مرفوض',
    pill: 'bg-red-500/15 text-red-300 border-red-500/25',
    dot: 'bg-red-400',
    gradient: 'from-red-500/20 to-red-600/10',
  },
};

export const getInitials = (name = '') => {
  const parts = String(name).trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return '؟';
  if (parts.length === 1) return parts[0].slice(0, 2);
  return `${parts[0][0] || ''}${parts[1][0] || ''}`;
};

export { JOIN_US_COLORS };
