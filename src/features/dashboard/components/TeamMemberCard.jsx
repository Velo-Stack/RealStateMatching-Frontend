import { motion } from "framer-motion";
import { Crown } from "phosphor-react";

const ROLE_STYLE_MAP = {
  ADMIN: "bg-red-500/10 text-red-400",
  MANAGER: "bg-violet-500/10 text-violet-400",
  BROKER: "bg-emerald-500/10 text-emerald-400",
  EMPLOYEE: "bg-blue-500/10 text-blue-400",
  DATA_ENTRY_ONLY: "bg-cyan-500/10 text-cyan-400",
};

const ROLE_LABEL_MAP = {
  ADMIN: "مسؤول",
  MANAGER: "مدير",
  BROKER: "وسيط",
  EMPLOYEE: "موظف",
  DATA_ENTRY_ONLY: "مدخل بيانات",
};

const TeamMemberCard = ({ member, isManager }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5"
  >
    <div
      className={`h-10 w-10 rounded-xl flex items-center justify-center font-bold text-sm ${
        isManager
          ? "bg-gradient-to-br from-amber-500 to-orange-500 text-white"
          : "bg-gradient-to-br from-amber-400 to-amber-600 text-white"
      }`}
    >
      {member.name?.charAt(0)}
    </div>
    <div className="flex-1">
      <div className="flex items-center gap-2">
        <p className="text-white text-sm font-medium">{member.name}</p>
        {isManager && <Crown size={14} className="text-amber-400" weight="fill" />}
      </div>
      <p className="text-slate-500 text-xs">{member.email}</p>
    </div>
    <span
      className={`text-xs px-2 py-1 rounded-lg ${ROLE_STYLE_MAP[member.role] || "bg-slate-500/10 text-slate-400"}`}
    >
      {ROLE_LABEL_MAP[member.role] || member.role}
    </span>
  </motion.div>
);

export default TeamMemberCard;
