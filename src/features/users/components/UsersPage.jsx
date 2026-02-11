import { useUsersPage } from "../hooks/useUsersPage";
import UserFormModal from "./UserFormModal";
import UsersFilters from "./UsersFilters";
import UsersHeader from "./UsersHeader";
import UsersList from "./UsersList";
import UsersStats from "./UsersStats";

const UsersPage = () => {
  const {
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
    activeUsers,
    isPending,
  } = useUsersPage();

  return (
    <div className="space-y-6">
      <UsersHeader openCreateModal={openCreateModal} />
      <UsersStats usersByRole={usersByRole} />
      <UsersFilters />

      <UsersList
        isLoading={isLoading}
        activeUsers={activeUsers}
        openEditModal={openEditModal}
        handleToggleStatus={handleToggleStatus}
        handleDelete={handleDelete}
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
    </div>
  );
};

export default UsersPage;
