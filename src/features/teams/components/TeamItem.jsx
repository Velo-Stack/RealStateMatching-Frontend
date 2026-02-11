import { motion, AnimatePresence } from "framer-motion";
import { CaretDown, CaretUp, UserPlus } from "phosphor-react";
import TeamDetailsPanel from "./TeamDetailsPanel";
import TeamMembersSection from "./TeamMembersSection";

const TeamItem = ({
  team,
  isAdmin,
  openMemberModal,
  expandedTeam,
  toggleExpand,
  updateRoleMutation,
  removeMemberMutation,
}) => (
  <motion.div
    key={team.id}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-[#111827]/60 backdrop-blur-xl rounded-2xl border border-white/5 overflow-hidden"
  >
    <TeamDetailsPanel team={team} />

    <div className="p-4 space-y-3">
      <div className="flex gap-2">
        {isAdmin && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => openMemberModal(team)}
            className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-sm font-medium hover:bg-emerald-500/20 transition-colors"
          >
            <UserPlus size={16} />
            إضافة عضو
          </motion.button>
        )}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => toggleExpand(team.id)}
          className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-white/5 text-slate-400 border border-white/10 text-sm font-medium hover:bg-white/10 transition-colors"
        >
          {expandedTeam === team.id ? <CaretUp size={16} /> : <CaretDown size={16} />}
          {expandedTeam === team.id ? "إخفاء الأعضاء" : "عرض الأعضاء"}
        </motion.button>
      </div>

      <AnimatePresence>
        {expandedTeam === team.id && (
          <TeamMembersSection
            team={team}
            isAdmin={isAdmin}
            updateRoleMutation={updateRoleMutation}
            removeMemberMutation={removeMemberMutation}
          />
        )}
      </AnimatePresence>
    </div>
  </motion.div>
);

export default TeamItem;
