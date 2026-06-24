import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { motion as Motion } from 'framer-motion';
import { ClipboardText, UsersThree } from 'phosphor-react';
import { useAuth } from '../../../../context/AuthContext';
import { useFeatureFlags } from '../../../../hooks/useFeatureFlags';
import { hasPermission } from '../../../../utils/rbac';
import Modal from '../../../../components/Modal';
import { STATUS_LABELS } from '../../constants/joinUsConstants';
import {
  fetchJoinApplications,
  fetchJoinApplicationStats,
  fetchJoinApplication,
  updateJoinApplicationStatus,
} from '../../services/joinUsApi';
import JoinApplicationStats from './JoinApplicationStats';
import JoinApplicationDetailModal from './JoinApplicationDetailModal';
import JoinApplicationQueueItem from './JoinApplicationQueueItem';
import {
  ADMIN_CARD_CLASS,
  ADMIN_JOIN_GRADIENT,
  JOIN_US_COLORS,
} from './adminJoinUsTheme';

const FILTERS = ['PENDING', 'REVIEWED', 'ACCEPTED', 'REJECTED', ''];

const JoinApplicationsPage = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const { isFeatureEnabled } = useFeatureFlags();
  const enabled = isFeatureEnabled('join_us.enabled');
  const canRead = hasPermission(user, 'joinApplications.read');
  const canManage = hasPermission(user, 'joinApplications.manage');
  const [filter, setFilter] = useState('PENDING');
  const [selected, setSelected] = useState(null);

  const { data: stats } = useQuery({
    queryKey: ['join-applications', 'stats'],
    queryFn: fetchJoinApplicationStats,
    enabled: enabled && canRead,
  });

  const { data: rows = [], isLoading } = useQuery({
    queryKey: ['join-applications', filter],
    queryFn: () => fetchJoinApplications(filter),
    enabled: enabled && canRead,
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, payload }) => updateJoinApplicationStatus(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['join-applications'] });
      setSelected(null);
    },
  });

  useEffect(() => {
    const highlightId = searchParams.get('highlight');
    if (!highlightId || !enabled || !canRead) return;

    const id = parseInt(highlightId, 10);
    if (!Number.isFinite(id)) return;

    const inList = rows.find((row) => row.id === id);
    if (inList) {
      setSelected(inList);
      searchParams.delete('highlight');
      setSearchParams(searchParams, { replace: true });
      return;
    }

    fetchJoinApplication(id)
      .then((application) => {
        setSelected(application);
        setFilter('');
        searchParams.delete('highlight');
        setSearchParams(searchParams, { replace: true });
      })
      .catch(() => {});
  }, [searchParams, rows, setSearchParams, enabled, canRead]);

  if (!enabled) {
    return (
      <div className={`${ADMIN_CARD_CLASS} p-10 text-center`}>
        <p className="text-slate-400">صفحة انضم إلينا غير مفعّلة حالياً.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className={`${ADMIN_CARD_CLASS} p-6 md:p-8`}
      >
        <div
          className="absolute top-0 inset-x-0 h-1"
          style={{ background: ADMIN_JOIN_GRADIENT }}
        />
        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-start gap-4">
            <div
              className="shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg"
              style={{ background: ADMIN_JOIN_GRADIENT }}
            >
              <UsersThree size={28} weight="duotone" className="text-white" />
            </div>
            <div>
              <p
                className="text-xs font-semibold tracking-wide mb-1"
                style={{ color: JOIN_US_COLORS.gold }}
              >
                استبيان تمكين الوسطاء العقاريين
              </p>
              <h1 className="text-2xl md:text-3xl font-bold text-white">طلبات الانضمام</h1>
              <p className="text-slate-400 text-sm mt-1.5 max-w-xl">
                مراجعة وإدارة طلبات الانضمام الواردة من صفحة انضم إلينا
              </p>
            </div>
          </div>
          {stats ? (
            <div className="flex gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-center min-w-[88px]">
                <p className="text-2xl font-bold text-white">{stats.pending}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">بانتظار المراجعة</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-center min-w-[88px]">
                <p className="text-2xl font-bold" style={{ color: JOIN_US_COLORS.gold }}>
                  {stats.total}
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">إجمالي الطلبات</p>
              </div>
            </div>
          ) : null}
        </div>
      </Motion.div>

      <JoinApplicationStats stats={stats} />

      <div className="flex gap-2 flex-wrap">
        {FILTERS.map((status) => {
          const active = filter === status;
          return (
            <Motion.button
              key={status || 'ALL'}
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setFilter(status)}
              className={`rounded-xl px-4 py-2.5 text-sm font-medium border transition-all ${
                active
                  ? 'text-white border-transparent shadow-lg'
                  : 'border-white/10 bg-white/[0.03] text-slate-400 hover:bg-white/[0.06] hover:text-slate-200'
              }`}
              style={active ? { background: ADMIN_JOIN_GRADIENT } : undefined}
            >
              {status ? STATUS_LABELS[status] : 'الكل'}
            </Motion.button>
          );
        })}
      </div>

      <div className={`${ADMIN_CARD_CLASS} overflow-hidden`}>
        <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between">
          <div className="flex items-center gap-2 text-white">
            <ClipboardText size={18} className="text-[#C9A84C]" />
            <span className="text-sm font-semibold">قائمة الطلبات</span>
          </div>
          <span className="text-xs text-slate-500">{rows.length} طلب</span>
        </div>

        {isLoading ? (
          <div className="p-6 space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-20 rounded-xl bg-white/[0.03] animate-pulse" />
            ))}
          </div>
        ) : rows.length === 0 ? (
          <div className="p-12 text-center">
            <div
              className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center"
              style={{ background: 'rgba(201, 168, 76, 0.12)' }}
            >
              <UsersThree size={32} className="text-[#C9A84C]" />
            </div>
            <p className="text-slate-300 font-medium mb-1">لا توجد طلبات</p>
            <p className="text-slate-500 text-sm">ستظهر الطلبات الجديدة هنا عند وصولها</p>
          </div>
        ) : (
          <div>
            {rows.map((row, index) => (
              <JoinApplicationQueueItem
                key={row.id}
                row={row}
                index={index}
                onClick={() => setSelected(row)}
              />
            ))}
          </div>
        )}
      </div>

      <Modal
        isOpen={Boolean(selected)}
        onClose={() => setSelected(null)}
        title={selected ? `طلب: ${selected.fullName}` : ''}
        maxWidthClass="max-w-2xl"
      >
        {selected ? (
          <JoinApplicationDetailModal
            application={selected}
            canManage={canManage}
            onClose={() => setSelected(null)}
            statusUpdating={statusMutation.isPending}
            onStatusChange={(payload) => {
              statusMutation.mutate({ id: selected.id, payload });
            }}
          />
        ) : null}
      </Modal>
    </div>
  );
};

export default JoinApplicationsPage;
