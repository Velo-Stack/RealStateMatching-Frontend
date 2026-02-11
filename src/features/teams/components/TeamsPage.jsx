import AddTeamMemberModal from "./AddTeamMemberModal";
import CreateTeamModal from "./CreateTeamModal";
import TeamsFilters from "./TeamsFilters";
import TeamsHeader from "./TeamsHeader";
import TeamsList from "./TeamsList";
import TeamsStats from "./TeamsStats";
import { useTeamsPage } from "../hooks/useTeamsPage";

const TeamsPage = () => {
  const {
    teams,
    users,
    isLoading,
    isAdmin,
    isModalOpen,
    setIsModalOpen,
    isMemberModalOpen,
    setIsMemberModalOpen,
    selectedTeam,
    expandedTeam,
    formData,
    memberData,
    setMemberData,
    createTeamMutation,
    addMemberMutation,
    removeMemberMutation,
    updateRoleMutation,
    handleChange,
    handleSubmit,
    handleAddMember,
    openMemberModal,
    toggleExpand,
  } = useTeamsPage();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <TeamsHeader isAdmin={isAdmin} setIsModalOpen={setIsModalOpen} />
      <TeamsStats />
      <TeamsFilters />

      <TeamsList
        teams={teams}
        isAdmin={isAdmin}
        openMemberModal={openMemberModal}
        expandedTeam={expandedTeam}
        toggleExpand={toggleExpand}
        updateRoleMutation={updateRoleMutation}
        removeMemberMutation={removeMemberMutation}
      />

      <CreateTeamModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        handleSubmit={handleSubmit}
        formData={formData}
        handleChange={handleChange}
        createTeamMutation={createTeamMutation}
      />

      <AddTeamMemberModal
        isMemberModalOpen={isMemberModalOpen}
        setIsMemberModalOpen={setIsMemberModalOpen}
        selectedTeam={selectedTeam}
        handleAddMember={handleAddMember}
        users={users}
        memberData={memberData}
        setMemberData={setMemberData}
        addMemberMutation={addMemberMutation}
      />
    </div>
  );
};

export default TeamsPage;
