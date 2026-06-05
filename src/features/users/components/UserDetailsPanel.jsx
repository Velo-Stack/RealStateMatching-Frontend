import { Calendar, Camera, Trash } from "phosphor-react";
import { roleConfig, statusConfig } from "../constants/usersConstants";
import { resolveAvatarUrl } from "../../../utils/uploads";

const UserDetailsPanel = ({ user }) => {
  const config = roleConfig[user.role] || roleConfig.BROKER;
  const statusConf = statusConfig[user.status] || statusConfig.ACTIVE;
  const Icon = config.icon;
  const avatarSrc = resolveAvatarUrl(user.avatarUrl);
  const permissionModeLabel = {
    ROLE_DEFAULT: "صلاحيات الدور",
    CUSTOM: "مخصص",
    CUSTOM_EMPTY: "بدون صلاحيات",
  }[user.permissionMode || "ROLE_DEFAULT"];

  return (
    <>
      <div className="flex items-start gap-4">
        <div className="h-14 w-14 rounded-2xl overflow-hidden border border-white/10 shrink-0 bg-slate-800">
          <img
            src={avatarSrc}
            alt={user.name}
            className="h-full w-full object-cover"
            onError={(e) => {
              e.currentTarget.src = "/assets/default-avatar.svg";
            }}
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-semibold truncate">{user.name}</h3>
          <p className="text-slate-500 text-sm truncate">{user.email}</p>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium ${config.bg} ${config.text} border ${config.border}`}
            >
              <Icon size={12} weight="fill" />
              {config.label}
            </span>
            <span
              className={`inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium ${statusConf.bg} ${statusConf.text}`}
            >
              {statusConf.label}
            </span>
            <span className="inline-flex items-center px-2 py-1 rounded-lg bg-white/5 text-xs font-medium text-slate-300">
              {permissionModeLabel}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-white/5 flex items-center gap-2 text-xs text-slate-500">
        <Calendar size={14} />
        <span>انضم في {new Date(user.createdAt).toLocaleDateString("ar-EG")}</span>
      </div>
    </>
  );
};

export default UserDetailsPanel;
