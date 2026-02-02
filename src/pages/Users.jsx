import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../utils/api';
import Modal from '../components/Modal';
import { Plus, Users as UsersIcon, Shield, UserCircle, Calendar, Pencil, Trash, Power, X, Check } from 'phosphor-react';

// Role config with new theme
const roleConfig = {
  ADMIN: { label: 'مدير نظام', bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/30', icon: Shield },
  MANAGER: { label: 'مدير', bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30', icon: UsersIcon },
  BROKER: { label: 'سمسار', bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30', icon: UserCircle },
};

// Status config
const statusConfig = {
  ACTIVE: { label: 'نشط', bg: 'bg-emerald-500/10', text: 'text-emerald-400' },
  SUSPENDED: { label: 'موقوف', bg: 'bg-amber-500/10', text: 'text-amber-400' },
  DELETED: { label: 'محذوف', bg: 'bg-red-500/10', text: 'text-red-400' },
};

const emptyUser = {
  name: '',
  email: '',
  password: '',
  role: 'BROKER',
};

const inputClasses = "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition-all duration-300 focus:border-emerald-500/50 focus:bg-white/10 focus:shadow-[0_0_20px_rgba(16,185,129,0.15)]";
const labelClasses = "block mb-2 text-sm font-medium text-slate-300";

const Users = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState(emptyUser);

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data } = await api.get('/users');
      return data;
    },
  });

  // Create user
  const createUser = useMutation({
    mutationFn: async (payload) => {
      const { data } = await api.post('/users', payload);
      return data;
    },
    onSuccess: () => {
      toast.success('تم إنشاء المستخدم بنجاح');
      queryClient.invalidateQueries({ queryKey: ['users'] });
      closeModal();
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'حدث خطأ أثناء إنشاء المستخدم');
    },
  });

  // Update user
  const updateUser = useMutation({
    mutationFn: async ({ id, payload }) => {
      const { data } = await api.put(`/users/${id}`, payload);
      return data;
    },
    onSuccess: () => {
      toast.success('تم تحديث المستخدم بنجاح');
      queryClient.invalidateQueries({ queryKey: ['users'] });
      closeModal();
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'حدث خطأ أثناء تحديث المستخدم');
    },
  });

  // Toggle status
  const toggleStatus = useMutation({
    mutationFn: async ({ id, status }) => {
      const { data } = await api.patch(`/users/${id}/status`, { status });
      return data;
    },
    onSuccess: () => {
      toast.success('تم تحديث الحالة بنجاح');
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'حدث خطأ');
    },
  });

  // Delete user
  const deleteUser = useMutation({
    mutationFn: async (id) => {
      const { data } = await api.delete(`/users/${id}`);
      return data;
    },
    onSuccess: () => {
      toast.success('تم حذف المستخدم');
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'حدث خطأ');
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditMode && selectedUser) {
      // For update, only send changed fields (don't send empty password)
      const payload = { name: formData.name, email: formData.email, role: formData.role };
      if (formData.password) payload.password = formData.password;
      updateUser.mutate({ id: selectedUser.id, payload });
    } else {
      createUser.mutate(formData);
    }
  };

  const openCreateModal = () => {
    setIsEditMode(false);
    setSelectedUser(null);
    setFormData(emptyUser);
    setIsModalOpen(true);
  };

  const openEditModal = (user) => {
    setIsEditMode(true);
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: '', // Don't show password
      role: user.role,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setSelectedUser(null);
    setFormData(emptyUser);
  };

  const handleDelete = (user) => {
    if (confirm(`هل تريد حذف المستخدم "${user.name}"؟`)) {
      deleteUser.mutate(user.id);
    }
  };

  const handleToggleStatus = (user) => {
    const newStatus = user.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    toggleStatus.mutate({ id: user.id, status: newStatus });
  };

  // Group users by role
  const usersByRole = {
    ADMIN: users.filter(u => u.role === 'ADMIN'),
    MANAGER: users.filter(u => u.role === 'MANAGER'),
    BROKER: users.filter(u => u.role === 'BROKER'),
  };

  // Filter out deleted users from display
  const activeUsers = users.filter(u => u.status !== 'DELETED');

  const isPending = createUser.isPending || updateUser.isPending;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-slate-400 text-sm">إدارة المستخدمين والصلاحيات في النظام</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-l from-emerald-500 to-cyan-500 text-white text-sm font-semibold px-5 py-2.5 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-300"
        >
          <Plus size={20} weight="bold" />
          إنشاء مستخدم جديد
        </motion.button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {Object.entries(roleConfig).map(([role, config], index) => {
          const Icon = config.icon;
          const count = usersByRole[role]?.length || 0;
          return (
            <motion.div
              key={role}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-[#111827]/60 backdrop-blur-xl rounded-xl border border-white/5 p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`h-10 w-10 rounded-xl ${config.bg} border ${config.border} flex items-center justify-center`}>
                  <Icon size={20} className={config.text} weight="duotone" />
                </div>
                <span className={`text-2xl font-bold ${config.text}`}>{count}</span>
              </div>
              <p className="text-sm text-slate-400">{config.label}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Users Grid */}
      {isLoading ? (
        <div className="bg-[#111827]/60 backdrop-blur-xl rounded-2xl border border-white/5 p-8 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
            <span className="text-slate-400 text-sm">جاري تحميل المستخدمين...</span>
          </div>
        </div>
      ) : activeUsers.length === 0 ? (
        <div className="bg-[#111827]/60 backdrop-blur-xl rounded-2xl border border-white/5 p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-slate-700/50 to-slate-800/50 flex items-center justify-center">
            <UsersIcon size={32} className="text-slate-500" />
          </div>
          <p className="text-slate-400 text-sm">لا يوجد مستخدمين حتى الآن</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeUsers.map((user, index) => {
            const config = roleConfig[user.role] || roleConfig.BROKER;
            const statusConf = statusConfig[user.status] || statusConfig.ACTIVE;
            const Icon = config.icon;
            return (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -4 }}
                className={`bg-[#111827]/60 backdrop-blur-xl rounded-2xl border border-white/5 p-5 hover:border-white/10 transition-all duration-300 ${user.status === 'SUSPENDED' ? 'opacity-60' : ''}`}
              >
                <div className="flex items-start gap-4">
                  <div className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${user.role === 'ADMIN' ? 'from-rose-500/20 to-rose-600/10' : user.role === 'MANAGER' ? 'from-amber-500/20 to-amber-600/10' : 'from-emerald-500/20 to-cyan-500/10'} border ${config.border} flex items-center justify-center text-xl font-bold ${config.text}`}>
                    {user.name?.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-semibold truncate">{user.name}</h3>
                    <p className="text-slate-500 text-sm truncate">{user.email}</p>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium ${config.bg} ${config.text} border ${config.border}`}>
                        <Icon size={12} weight="fill" />
                        {config.label}
                      </span>
                      <span className={`inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium ${statusConf.bg} ${statusConf.text}`}>
                        {statusConf.label}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Calendar size={14} />
                    <span>انضم في {new Date(user.createdAt).toLocaleDateString('ar-EG')}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {/* Toggle Status */}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleToggleStatus(user)}
                      disabled={toggleStatus.isPending}
                      className={`h-8 w-8 rounded-lg flex items-center justify-center transition-colors ${user.status === 'ACTIVE' ? 'bg-amber-500/10 text-amber-400 hover:bg-amber-500/20' : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'}`}
                      title={user.status === 'ACTIVE' ? 'إيقاف' : 'تفعيل'}
                    >
                      <Power size={16} />
                    </motion.button>
                    {/* Edit */}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => openEditModal(user)}
                      className="h-8 w-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center hover:bg-cyan-500/20 transition-colors"
                      title="تعديل"
                    >
                      <Pencil size={16} />
                    </motion.button>
                    {/* Delete */}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDelete(user)}
                      disabled={deleteUser.isPending}
                      className="h-8 w-8 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center hover:bg-red-500/20 transition-colors"
                      title="حذف"
                    >
                      <Trash size={16} />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={closeModal} title={isEditMode ? 'تعديل المستخدم' : 'إنشاء مستخدم جديد'}>
        <form onSubmit={handleSubmit} className="space-y-5 text-right">
          <div>
            <label className={labelClasses}>الاسم الكامل</label>
            <input
              name="name"
              className={inputClasses}
              value={formData.name}
              onChange={handleChange}
              placeholder="أدخل اسم المستخدم"
              required
            />
          </div>
          <div>
            <label className={labelClasses}>البريد الإلكتروني</label>
            <input
              type="email"
              name="email"
              className={inputClasses}
              value={formData.email}
              onChange={handleChange}
              placeholder="user@example.com"
              required
              dir="ltr"
            />
          </div>
          <div>
            <label className={labelClasses}>
              كلمة المرور
              {isEditMode && <span className="text-slate-500 text-xs mr-2">(اتركها فارغة للإبقاء على الحالية)</span>}
            </label>
            <input
              type="password"
              name="password"
              className={inputClasses}
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required={!isEditMode}
              dir="ltr"
            />
          </div>
          <div>
            <label className={labelClasses}>الدور</label>
            <select
              name="role"
              className={inputClasses}
              value={formData.role}
              onChange={handleChange}
            >
              <option value="ADMIN">مدير نظام</option>
              <option value="MANAGER">مدير</option>
              <option value="BROKER">سمسار</option>
            </select>
          </div>
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            type="submit"
            disabled={isPending}
            className="w-full rounded-xl bg-gradient-to-l from-emerald-500 to-cyan-500 text-white text-sm font-bold py-3.5 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isPending ? 'جاري الحفظ...' : (isEditMode ? 'تحديث المستخدم' : 'حفظ المستخدم')}
          </motion.button>
        </form>
      </Modal>
    </div>
  );
};

export default Users;
