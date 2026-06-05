import { useState } from "react";
import { useUsersPage } from "../hooks/useUsersPage";
import { useCreateSubmissionLinkMutation } from "../hooks/useCreateSubmissionLinkMutation";
import UserFormModal from "./UserFormModal";
import UserPermissionsModal from "./UserPermissionsModal";
import RolePermissionsModal from "./RolePermissionsModal";
import SubmissionLinkModal from "./SubmissionLinkModal";
import UsersFilters from "./UsersFilters";
import UsersHeader from "./UsersHeader";
import UsersList from "./UsersList";
import UsersStats from "./UsersStats";
import { hasPermission } from "../../../utils/rbac";

const UsersPage = () => {
  const {
    currentUser,
    isLoading,
    isModalOpen,
    isEditMode,
    formData,
    permissionsCatalog,
    queryClient,
    permissionsUser,
    isRolePermissionsOpen,
    toggleStatus,
    deleteUser,
    handleChange,
    handleSubmit,
    openCreateModal,
    openEditModal,
    openPermissionsModal,
    closePermissionsModal,
    openRolePermissions,
    closeRolePermissions,
    closeModal,
    handleDelete,
    handleToggleStatus,
    usersByRole,
    filteredUsers,
    filters,
    handleFilterChange,
    isPending,
    isUserDetailsLoading,
    handleAvatarUpload,
    handleAvatarDelete,
    isAvatarPending,
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
      <UsersHeader
        openCreateModal={openCreateModal}
        openRolePermissions={openRolePermissions}
        canCreateUser={hasPermission(currentUser, "users.create")}
        canManagePermissions={hasPermission(currentUser, "users.managePermissions")}
        canManageRolePermissions={
          currentUser?.role === "ADMIN" && hasPermission(currentUser, "users.managePermissions")
        }
      />
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
        onOpenPermissions={openPermissionsModal}
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
        isUserDetailsLoading={isUserDetailsLoading}
        permissionsCatalog={permissionsCatalog}
        canManageCustomPermissions={hasPermission(currentUser, "users.managePermissions")}
        onAvatarUpload={handleAvatarUpload}
        onAvatarDelete={handleAvatarDelete}
        isAvatarPending={isAvatarPending}
      />

      <UserPermissionsModal
        isOpen={!!permissionsUser}
        onClose={closePermissionsModal}
        user={permissionsUser}
        permissionsCatalog={permissionsCatalog}
        queryClient={queryClient}
      />

      <RolePermissionsModal
        isOpen={isRolePermissionsOpen}
        onClose={closeRolePermissions}
        permissionsCatalog={permissionsCatalog}
        queryClient={queryClient}
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
