import EmptyState from "./EmptyState";
import TeamItem from "./TeamItem";

const TeamsList = ({
  teams,
  isAdmin,
  openMemberModal,
  expandedTeam,
  toggleExpand,
  updateRoleMutation,
  removeMemberMutation,
}) => (
  <>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {teams.map((team) => (
        <TeamItem
          key={team.id}
          team={team}
          isAdmin={isAdmin}
          openMemberModal={openMemberModal}
          expandedTeam={expandedTeam}
          toggleExpand={toggleExpand}
          updateRoleMutation={updateRoleMutation}
          removeMemberMutation={removeMemberMutation}
        />
      ))}
    </div>

    {teams.length === 0 && <EmptyState />}
  </>
);

export default TeamsList;
