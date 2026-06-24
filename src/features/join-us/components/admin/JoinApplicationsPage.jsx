import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { UsersThree } from 'phosphor-react';
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
      <div className="p-6 text-center text-slate-400">
        صفحة انضم إلينا غير مفعّلة حالياً.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 text-white">
          <UsersThree size={24} className="text-emerald-400" />
          <h1 className="text-2xl font-bold">طلبات الانضمام</h1>
        </div>
        <p className="text-slate-400 text-sm mt-1">مراجعة استبيانات تمكين الوسطاء العقاريين</p>
      </div>

      <JoinApplicationStats stats={stats} />

      <div className="flex gap-2 flex-wrap">
        {FILTERS.map((status) => (
          <button
            key={status || 'ALL'}
            type="button"
            onClick={() => setFilter(status)}
            className={`rounded-xl px-4 py-2 text-sm border ${
              filter === status
                ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400'
                : 'border-white/10 bg-white/5 text-slate-400'
            }`}
          >
            {status ? STATUS_LABELS[status] : 'الكل'}
          </button>
        ))}
      </div>

      <div className="bg-[#111827]/60 rounded-2xl border border-white/5 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-slate-400 text-sm text-center">جاري التحميل...</div>
        ) : rows.length === 0 ? (
          <div className="p-8 text-slate-500 text-sm text-center">لا توجد طلبات</div>
        ) : (
          <div className="divide-y divide-white/5">
            {rows.map((row) => (
              <button
                key={row.id}
                type="button"
                onClick={() => setSelected(row)}
                className="w-full text-right p-4 hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-white font-medium">{row.fullName}</p>
                    <p className="text-slate-400 text-sm">{row.email}</p>
                    <p className="text-slate-500 text-xs mt-1">
                      {row.city?.name} · {new Date(row.createdAt).toLocaleString('ar-SA')}
                    </p>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full bg-white/5 text-slate-300">
                    {STATUS_LABELS[row.status] || row.status}
                  </span>
                </div>
              </button>
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
