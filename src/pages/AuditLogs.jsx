import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../utils/api';
import { Scroll, Funnel, Calendar, UserCircle, ArrowsClockwise, Plus, Trash, PencilSimple, Eye, Buildings, File, UsersThree, Handshake, CaretDown, CaretUp } from 'phosphor-react';

const inputClasses = "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition-all duration-300 focus:border-emerald-500/50 focus:bg-white/10 focus:shadow-[0_0_20px_rgba(16,185,129,0.15)]";
const labelClasses = "block mb-2 text-xs font-medium text-slate-400";

const actionConfig = {
  CREATE: { label: 'إنشاء', bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30', icon: Plus },
  UPDATE: { label: 'تحديث', bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30', icon: PencilSimple },
  DELETE: { label: 'حذف', bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/30', icon: Trash },
  READ: { label: 'عرض', bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'border-cyan-500/30', icon: Eye },
};

const resourceConfig = {
  Offer: { label: 'عرض عقاري', icon: Buildings, color: 'text-emerald-400' },
  Request: { label: 'طلب عميل', icon: File, color: 'text-violet-400' },
  User: { label: 'مستخدم', icon: UserCircle, color: 'text-amber-400' },
  Team: { label: 'فريق', icon: UsersThree, color: 'text-cyan-400' },
  TeamMember: { label: 'عضو فريق', icon: UsersThree, color: 'text-pink-400' },
  Match: { label: 'مطابقة', icon: Handshake, color: 'text-rose-400' },
};

// Helper to format changes nicely
const formatChanges = (changes, action) => {
  if (!changes) return null;

  try {
    const data = typeof changes === 'string' ? JSON.parse(changes) : changes;

    // For CREATE - show new data
    if (action === 'CREATE' && data.newData) {
      const items = [];
      const newData = data.newData;

      if (newData.name) items.push({ label: 'الاسم', value: newData.name });
      if (newData.email) items.push({ label: 'البريد', value: newData.email });
      if (newData.type) items.push({ label: 'النوع', value: newData.type });
      if (newData.city) items.push({ label: 'المدينة', value: newData.city });
      if (newData.neighborhood) items.push({ label: 'الحي', value: newData.neighborhood });
      if (newData.price) items.push({ label: 'السعر', value: `${newData.price?.toLocaleString()} ر.س` });
      if (newData.area) items.push({ label: 'المساحة', value: `${newData.area} م²` });
      if (newData.role) items.push({ label: 'الدور', value: newData.role });
      if (newData.status) items.push({ label: 'الحالة', value: newData.status });

      return items.length > 0 ? items : null;
    }

    // For UPDATE - show before/after
    if (action === 'UPDATE' && (data.oldData || data.newData)) {
      const items = [];
      const oldData = data.oldData || {};
      const newData = data.newData || {};

      const allKeys = new Set([...Object.keys(oldData), ...Object.keys(newData)]);
      const ignoreKeys = ['id', 'createdAt', 'updatedAt', 'password'];

      allKeys.forEach(key => {
        if (ignoreKeys.includes(key)) return;
        if (JSON.stringify(oldData[key]) !== JSON.stringify(newData[key])) {
          items.push({
            label: key,
            oldValue: oldData[key],
            newValue: newData[key],
          });
        }
      });

      return items.length > 0 ? { type: 'diff', items } : null;
    }

    // For DELETE - show deleted data
    if (action === 'DELETE' && data.oldData) {
      const items = [];
      const oldData = data.oldData;

      if (oldData.name) items.push({ label: 'الاسم', value: oldData.name });
      if (oldData.email) items.push({ label: 'البريد', value: oldData.email });
      if (oldData.type) items.push({ label: 'النوع', value: oldData.type });

      return items.length > 0 ? items : null;
    }

    return null;
  } catch {
    return null;
  }
};

const AuditLogs = () => {
  const [filters, setFilters] = useState({
    resource: '',
    action: '',
    userId: '',
    startDate: '',
    endDate: '',
  });
  const [expandedLog, setExpandedLog] = useState(null);

  const { data: logs = [], isLoading } = useQuery({
    queryKey: ['audit-logs', filters],
    queryFn: async () => {
      const params = {};
      if (filters.resource) params.resource = filters.resource;
      if (filters.action) params.action = filters.action;
      if (filters.userId) params.userId = Number(filters.userId);
      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;
      const { data } = await api.get('/audit-logs', { params });
      return data;
    },
  });

  // Fetch users for filter dropdown
  const { data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data } = await api.get('/users');
      return data;
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({
      resource: '',
      action: '',
      userId: '',
      startDate: '',
      endDate: '',
    });
  };

  const hasActiveFilters = Object.values(filters).some(v => v !== '');

  // Group logs by date
  const groupedLogs = logs.reduce((acc, log) => {
    const date = new Date(log.createdAt).toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    if (!acc[date]) acc[date] = [];
    acc[date].push(log);
    return acc;
  }, {});

  // Calculate stats
  const stats = {
    total: logs.length,
    creates: logs.filter(l => l.action === 'CREATE').length,
    updates: logs.filter(l => l.action === 'UPDATE').length,
    deletes: logs.filter(l => l.action === 'DELETE').length,
  };

  const getActionDescription = (log) => {
    const resourceCfg = resourceConfig[log.resource] || { label: log.resource };
    const actionLabels = {
      CREATE: 'قام بإنشاء',
      UPDATE: 'قام بتحديث',
      DELETE: 'قام بحذف',
    };
    return `${actionLabels[log.action] || log.action} ${resourceCfg.label}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 border border-violet-500/30 flex items-center justify-center">
          <Scroll size={24} className="text-violet-400" weight="duotone" />
        </div>
        <div>
          <p className="text-white font-semibold">سجلات التدقيق</p>
          <p className="text-sm text-slate-500">تتبع جميع العمليات والتغييرات في النظام</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-[#111827]/60 backdrop-blur-xl rounded-xl border border-white/5 p-4">
          <p className="text-xs text-slate-500 mb-1">إجمالي العمليات</p>
          <p className="text-2xl font-bold text-white">{stats.total}</p>
        </div>
        <div className="bg-[#111827]/60 backdrop-blur-xl rounded-xl border border-emerald-500/20 p-4">
          <p className="text-xs text-emerald-400/70 mb-1">إنشاء</p>
          <p className="text-2xl font-bold text-emerald-400">{stats.creates}</p>
        </div>
        <div className="bg-[#111827]/60 backdrop-blur-xl rounded-xl border border-amber-500/20 p-4">
          <p className="text-xs text-amber-400/70 mb-1">تحديث</p>
          <p className="text-2xl font-bold text-amber-400">{stats.updates}</p>
        </div>
        <div className="bg-[#111827]/60 backdrop-blur-xl rounded-xl border border-red-500/20 p-4">
          <p className="text-xs text-red-400/70 mb-1">حذف</p>
          <p className="text-2xl font-bold text-red-400">{stats.deletes}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-[#111827]/60 backdrop-blur-xl rounded-2xl border border-white/5 p-5">
        <div className="flex items-center gap-2 mb-4">
          <Funnel size={16} className="text-slate-500" />
          <span className="text-sm text-slate-400">تصفية النتائج</span>
          {hasActiveFilters && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={clearFilters}
              className="mr-auto text-xs text-red-400 hover:text-red-300 flex items-center gap-1"
            >
              <ArrowsClockwise size={14} />
              مسح الفلاتر
            </motion.button>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-right">
          <div>
            <label className={labelClasses}>المورد</label>
            <select
              name="resource"
              className={inputClasses}
              value={filters.resource}
              onChange={handleChange}
            >
              <option value="">الكل</option>
              <option value="Offer">العروض</option>
              <option value="Request">الطلبات</option>
              <option value="User">المستخدمين</option>
              <option value="Team">الفرق</option>
              <option value="TeamMember">أعضاء الفرق</option>
              <option value="Match">المطابقات</option>
            </select>
          </div>
          <div>
            <label className={labelClasses}>الإجراء</label>
            <select
              name="action"
              className={inputClasses}
              value={filters.action}
              onChange={handleChange}
            >
              <option value="">الكل</option>
              <option value="CREATE">إنشاء</option>
              <option value="UPDATE">تحديث</option>
              <option value="DELETE">حذف</option>
            </select>
          </div>
          <div>
            <label className={labelClasses}>المستخدم</label>
            <select
              name="userId"
              className={inputClasses}
              value={filters.userId}
              onChange={handleChange}
            >
              <option value="">الكل</option>
              {users.map(u => (
                <option key={u.id} value={u.id}>{u.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClasses}>من تاريخ</label>
            <input
              name="startDate"
              type="date"
              className={inputClasses}
              value={filters.startDate}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className={labelClasses}>إلى تاريخ</label>
            <input
              name="endDate"
              type="date"
              className={inputClasses}
              value={filters.endDate}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="bg-[#111827]/60 backdrop-blur-xl rounded-2xl border border-white/5 p-8 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
            <span className="text-slate-400 text-sm">جاري تحميل السجلات...</span>
          </div>
        </div>
      ) : logs.length === 0 ? (
        <div className="bg-[#111827]/60 backdrop-blur-xl rounded-2xl border border-white/5 p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-slate-700/50 to-slate-800/50 flex items-center justify-center">
            <Scroll size={32} className="text-slate-500" />
          </div>
          <p className="text-slate-400 text-sm">لا توجد سجلات مطابقة للفلاتر الحالية</p>
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries(groupedLogs).map(([date, dateLogs]) => (
            <div key={date}>
              {/* Date Header */}
              <div className="flex items-center gap-2 mb-3">
                <Calendar size={14} className="text-slate-500" />
                <span className="text-sm text-slate-400">{date}</span>
                <span className="text-xs text-slate-600">({dateLogs.length} عملية)</span>
              </div>

              {/* Logs */}
              <div className="bg-[#111827]/60 backdrop-blur-xl rounded-2xl border border-white/5 overflow-hidden">
                <AnimatePresence>
                  {dateLogs.map((log, index) => {
                    const actionCfg = actionConfig[log.action] || actionConfig.UPDATE;
                    const resourceCfg = resourceConfig[log.resource] || { label: log.resource, icon: File, color: 'text-slate-400' };
                    const ActionIcon = actionCfg.icon;
                    const ResourceIcon = resourceCfg.icon;
                    const formattedChanges = formatChanges(log.changes, log.action);
                    const isExpanded = expandedLog === log.id;

                    return (
                      <motion.div
                        key={log.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.02 }}
                        className="px-5 py-4 border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors"
                      >
                        <div className="flex items-start gap-4">
                          {/* Action Icon */}
                          <div className={`h-10 w-10 rounded-xl shrink-0 flex items-center justify-center ${actionCfg.bg} border ${actionCfg.border}`}>
                            <ActionIcon size={18} className={actionCfg.text} weight="duotone" />
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            {/* Action Description */}
                            <div className="flex items-center gap-2 flex-wrap mb-2">
                              <span className="text-white text-sm font-medium">
                                {log.user?.name || 'مستخدم'}
                              </span>
                              <span className="text-slate-400 text-sm">
                                {getActionDescription(log)}
                              </span>
                              {log.resourceId && (
                                <span className="text-xs text-slate-500 bg-white/5 px-2 py-0.5 rounded">
                                  #{log.resourceId}
                                </span>
                              )}
                            </div>

                            {/* Badges */}
                            <div className="flex items-center gap-2 flex-wrap mb-2">
                              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium ${actionCfg.bg} ${actionCfg.text} border ${actionCfg.border}`}>
                                <ActionIcon size={10} />
                                {actionCfg.label}
                              </span>
                              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-white/5 ${resourceCfg.color} border border-white/10`}>
                                <ResourceIcon size={10} />
                                {resourceCfg.label}
                              </span>
                              <span className="text-[11px] text-slate-500">
                                {new Date(log.createdAt).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>

                            {/* Changes Preview */}
                            {formattedChanges && (
                              <motion.button
                                onClick={() => setExpandedLog(isExpanded ? null : log.id)}
                                className="text-xs text-slate-500 hover:text-slate-300 flex items-center gap-1 mt-1"
                              >
                                {isExpanded ? <CaretUp size={12} /> : <CaretDown size={12} />}
                                {isExpanded ? 'إخفاء التفاصيل' : 'عرض التفاصيل'}
                              </motion.button>
                            )}

                            {/* Expanded Changes */}
                            <AnimatePresence>
                              {isExpanded && formattedChanges && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  exit={{ opacity: 0, height: 0 }}
                                  className="mt-3"
                                >
                                  {formattedChanges.type === 'diff' ? (
                                    <div className="bg-[#0d1117] rounded-lg p-3 border border-white/5 space-y-2">
                                      {formattedChanges.items.map((item, i) => (
                                        <div key={i} className="flex items-start gap-2 text-xs">
                                          <span className="text-slate-500 w-20 shrink-0">{item.label}:</span>
                                          <div className="flex items-center gap-2">
                                            <span className="text-red-400 line-through">{String(item.oldValue || '-')}</span>
                                            <span className="text-slate-500">→</span>
                                            <span className="text-emerald-400">{String(item.newValue || '-')}</span>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    <div className="bg-[#0d1117] rounded-lg p-3 border border-white/5 grid grid-cols-2 gap-2">
                                      {formattedChanges.map((item, i) => (
                                        <div key={i} className="text-xs">
                                          <span className="text-slate-500">{item.label}: </span>
                                          <span className="text-slate-300">{item.value}</span>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>

                          {/* User Avatar */}
                          <div className="hidden sm:flex items-center gap-2">
                            <div className={`h-8 w-8 rounded-lg flex items-center justify-center text-xs font-bold ${log.user?.role === 'ADMIN' ? 'bg-rose-500/20 text-rose-400' :
                                log.user?.role === 'MANAGER' ? 'bg-amber-500/20 text-amber-400' :
                                  'bg-emerald-500/20 text-emerald-400'
                              }`}>
                              {log.user?.name?.charAt(0) || '?'}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AuditLogs;
