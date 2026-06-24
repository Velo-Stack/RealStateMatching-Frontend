import { motion as Motion } from 'framer-motion';
import { CaretLeft, MapPin } from 'phosphor-react';
import { STATUS_LABELS } from '../../constants/joinUsConstants';
import { ADMIN_JOIN_GRADIENT, getInitials, STATUS_STYLES } from './adminJoinUsTheme';

const JoinApplicationQueueItem = ({ row, index, onClick }) => {
  const statusStyle = STATUS_STYLES[row.status] || STATUS_STYLES.PENDING;

  return (
    <Motion.button
      type="button"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.04 }}
      whileHover={{ x: -4 }}
      onClick={onClick}
      className="w-full text-right p-4 md:p-5 hover:bg-white/[0.03] transition-colors group border-b border-white/[0.04] last:border-0"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0">
          <div
            className="shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-sm shadow-lg"
            style={{ background: ADMIN_JOIN_GRADIENT }}
          >
            {getInitials(row.fullName)}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-white font-semibold truncate">{row.fullName}</p>
              <span
                className={`inline-flex items-center gap-1.5 text-[11px] px-2.5 py-0.5 rounded-full border ${statusStyle.pill}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
                {STATUS_LABELS[row.status] || row.status}
              </span>
            </div>
            <p className="text-slate-400 text-sm truncate mt-0.5">{row.email}</p>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-slate-500 text-xs mt-1.5">
              {row.city?.name ? (
                <span className="inline-flex items-center gap-1">
                  <MapPin size={12} className="text-[#C9A84C]" />
                  {row.city.name}
                </span>
              ) : null}
              <span>{new Date(row.createdAt).toLocaleString('ar-SA')}</span>
            </div>
          </div>
        </div>
        <CaretLeft
          size={18}
          className="shrink-0 text-slate-600 group-hover:text-[#C9A84C] transition-colors"
        />
      </div>
    </Motion.button>
  );
};

export default JoinApplicationQueueItem;
