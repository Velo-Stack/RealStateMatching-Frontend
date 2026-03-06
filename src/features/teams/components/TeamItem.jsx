import { motion, AnimatePresence } from "framer-motion";
import { CaretDown, CaretUp, Trash, UserPlus } from "phosphor-react";
import { useTeamDetailsQuery } from "../hooks/useTeamDetailsQuery";
import { useTeamMembersQuery } from "../hooks/useTeamMembersQuery";
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
  deleteTeamMutation,
}) => {
  const isExpanded = expandedTeam === team.id;
  const { data: teamDetails } = useTeamDetailsQuery(team.id, isExpanded);
  const { data: teamMembers } = useTeamMembersQuery(team.id, isExpanded);

  const resolvedTeam = teamDetails || team;
  const resolvedMembers = Array.isArray(teamMembers)
    ? teamMembers
    : resolvedTeam.members || team.members || [];
  const resolvedTeamWithMembers = {
    ...resolvedTeam,
    members: resolvedMembers,
  };

  const handleDeleteTeam = () => {
    if (!confirm(`هل تريد حذف فريق "${resolvedTeamWithMembers.name}"؟`)) return;
    deleteTeamMutation.mutate(team.id);
  };

  return (
    <motion.div
      key={team.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#111827]/60 backdrop-blur-xl rounded-2xl border border-white/5 overflow-hidden"
    >
      <TeamDetailsPanel team={resolvedTeamWithMembers} />

      <div className="p-4 space-y-3">
        <div className="flex gap-2">
          {isAdmin && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => openMemberModal(resolvedTeamWithMembers)}
              className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-sm font-medium hover:bg-emerald-500/20 transition-colors"
            >
              <UserPlus size={16} />
              إضافة عضو
            </motion.button>
          )}
          {isAdmin && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleDeleteTeam}
              disabled={deleteTeamMutation.isPending}
              className="h-10 w-10 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 flex items-center justify-center hover:bg-red-500/20 transition-colors disabled:opacity-60"
              title="حذف الفريق"
            >
              <Trash size={16} />
            </motion.button>
          )}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => toggleExpand(team.id)}
            className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-white/5 text-slate-400 border border-white/10 text-sm font-medium hover:bg-white/10 transition-colors"
          >
            {isExpanded ? <CaretUp size={16} /> : <CaretDown size={16} />}
            {isExpanded ? "إخفاء الأعضاء" : "عرض الأعضاء"}
          </motion.button>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <TeamMembersSection
              team={resolvedTeamWithMembers}
              isAdmin={isAdmin}
              updateRoleMutation={updateRoleMutation}
              removeMemberMutation={removeMemberMutation}
            />
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default TeamItem;
