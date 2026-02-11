import { motion } from "framer-motion";
import { Crown } from "phosphor-react";

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
          : "bg-gradient-to-br from-emerald-500 to-cyan-500 text-white"
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
      className={`text-xs px-2 py-1 rounded-lg ${
        member.role === "ADMIN"
          ? "bg-red-500/10 text-red-400"
          : member.role === "MANAGER"
            ? "bg-violet-500/10 text-violet-400"
            : "bg-slate-500/10 text-slate-400"
      }`}
    >
      {member.role === "ADMIN"
        ? "مسؤول"
        : member.role === "MANAGER"
          ? "مدير"
          : "وسيط"}
    </span>
  </motion.div>
);

export default TeamMemberCard;
