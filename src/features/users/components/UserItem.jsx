import { motion } from "framer-motion";
import { Pencil, Power, Trash, Link, ShieldCheck, Medal } from "phosphor-react";
import UserDetailsPanel from "./UserDetailsPanel";
import {
  canDeleteUser,
  canEditUser,
  canChangeUserStatus,
  hasPermission,
} from "../../../utils/rbac";

const UserItem = ({
  user,
  index,
  currentUser,
  openEditModal,
  handleToggleStatus,
  handleDelete,
  onOpenSubmissionLink,
  onOpenPermissions,
  onOpenPointsAdjust,
  toggleStatus,
  deleteUser,
  avatarVersion,
}) => {
  const showStatusToggle = canChangeUserStatus(currentUser);
  const showEdit = canEditUser(currentUser, user);
  const showDelete = canDeleteUser(currentUser);
  const showSubmissionLink = hasPermission(currentUser, "submissionLinks.create");
  const showPermissions = hasPermission(currentUser, "users.managePermissions");

  return (
    <motion.div
      key={user.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -4 }}
      className={`bg-[#111827]/60 backdrop-blur-xl rounded-2xl border border-white/5 p-5 hover:border-white/10 transition-all duration-300 ${user.status === "SUSPENDED" || user.status === "BANNED" ? "opacity-60" : ""
        }`}
    >
      <UserDetailsPanel user={user} avatarVersion={avatarVersion} />

      <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-end">
        <div className="flex items-center gap-1">
          {showStatusToggle && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleToggleStatus(user)}
              disabled={toggleStatus.isPending}
              className={`h-8 w-8 rounded-lg flex items-center justify-center transition-colors ${user.status === "ACTIVE"
                ? "bg-amber-500/10 text-amber-400 hover:bg-slate-500/20"
                : "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                }`}
              title={user.status === "ACTIVE" ? "إيقاف" : "تفعيل"}
            >
              <Power size={16} />
            </motion.button>
          )}

          {showEdit && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => openEditModal(user)}
              className="h-8 w-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center hover:bg-cyan-500/20 transition-colors"
              title="تعديل"
            >
              <Pencil size={16} />
            </motion.button>
          )}

          {showSubmissionLink && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onOpenSubmissionLink(user)}
              className="h-8 w-8 rounded-lg bg-violet-500/10 text-violet-400 flex items-center justify-center hover:bg-violet-500/20 transition-colors"
              title="رابط تقديم"
            >
              <Link size={16} />
            </motion.button>
          )}

          {onOpenPointsAdjust && user.role === "BROKER" ? (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onOpenPointsAdjust(user)}
              className="h-8 w-8 rounded-lg flex items-center justify-center bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 transition-colors"
              title="تعديل النقاط"
            >
              <Medal size={16} />
            </motion.button>
          ) : null}

          {showPermissions && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onOpenPermissions(user)}
              className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center hover:bg-emerald-500/20 transition-colors"
              title="إدارة الصلاحيات"
            >
              <ShieldCheck size={16} />
            </motion.button>
          )}

          {showDelete && (
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
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default UserItem;
