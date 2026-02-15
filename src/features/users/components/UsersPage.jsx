import { useState } from "react";
import { useUsersPage } from "../hooks/useUsersPage";
import { useCreateSubmissionLinkMutation } from "../hooks/useCreateSubmissionLinkMutation";
import UserFormModal from "./UserFormModal";
import SubmissionLinkModal from "./SubmissionLinkModal";
import UsersFilters from "./UsersFilters";
import UsersHeader from "./UsersHeader";
import UsersList from "./UsersList";
import UsersStats from "./UsersStats";

const UsersPage = () => {
  const {
    currentUser,
    isLoading,
    isModalOpen,
    isEditMode,
    formData,
    toggleStatus,
    deleteUser,
    handleChange,
    handleSubmit,
    openCreateModal,
    openEditModal,
    closeModal,
    handleDelete,
    handleToggleStatus,
    usersByRole,
    filteredUsers,
    filters,
    handleFilterChange,
    isPending,
  } = useUsersPage();

  const [submissionLinkUser, setSubmissionLinkUser] = useState(null);
  const submissionLinkMutation = useCreateSubmissionLinkMutation();

  const handleOpenSubmissionLink = (user) => {
    setSubmissionLinkUser(user);
  };

  const handleCloseSubmissionLink = () => {
    setSubmissionLinkUser(null);
  };

  return (
    <div className="space-y-6">
      <UsersHeader openCreateModal={openCreateModal} />
      <UsersStats usersByRole={usersByRole} />
      <UsersFilters filters={filters} onFilterChange={handleFilterChange} />

      <UsersList
        isLoading={isLoading}
        activeUsers={filteredUsers}
        currentUser={currentUser}
        openEditModal={openEditModal}
        handleToggleStatus={handleToggleStatus}
        handleDelete={handleDelete}
        onOpenSubmissionLink={handleOpenSubmissionLink}
        toggleStatus={toggleStatus}
        deleteUser={deleteUser}
      />

      <UserFormModal
        isModalOpen={isModalOpen}
        closeModal={closeModal}
        isEditMode={isEditMode}
        handleSubmit={handleSubmit}
        formData={formData}
        handleChange={handleChange}
        isPending={isPending}
      />

      <SubmissionLinkModal
        isOpen={!!submissionLinkUser}
        onClose={handleCloseSubmissionLink}
        user={submissionLinkUser}
        mutation={submissionLinkMutation}
      />
    </div>
  );
};

export default UsersPage;

