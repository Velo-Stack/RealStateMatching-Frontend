import { Calendar } from "phosphor-react";
import { roleConfig, statusConfig } from "../constants/usersConstants";

const UserDetailsPanel = ({ user }) => {
  const config = roleConfig[user.role] || roleConfig.BROKER;
  const statusConf = statusConfig[user.status] || statusConfig.ACTIVE;
  const Icon = config.icon;

  return (
    <>
      <div className="flex items-start gap-4">
        <div
          className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${
            user.role === "ADMIN"
              ? "from-rose-500/20 to-rose-600/10"
              : user.role === "MANAGER"
                ? "from-amber-500/20 to-amber-600/10"
                : "from-emerald-500/20 to-cyan-500/10"
          } border ${config.border} flex items-center justify-center text-xl font-bold ${config.text}`}
        >
          {user.name?.charAt(0)}
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
