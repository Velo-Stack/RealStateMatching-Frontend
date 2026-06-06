import { useState } from "react";
import { useUsersPage } from "../hooks/useUsersPage";
import { useCreateSubmissionLinkMutation } from "../hooks/useCreateSubmissionLinkMutation";
import UserFormModal from "./UserFormModal";
import UserEditModal from "./UserEditModal";
import RolePermissionsModal from "./RolePermissionsModal";
import SubmissionLinkModal from "./SubmissionLinkModal";
import UsersFilters from "./UsersFilters";
import UsersHeader from "./UsersHeader";
import UsersList from "./UsersList";
import UsersStats from "./UsersStats";
import { hasPermission } from "../../../utils/rbac";
import { useFeatureFlags } from "../../../hooks/useFeatureFlags";

const UsersPage = () => {
  const {
    currentUser,
    isLoading,
    isModalOpen,
    isEditMode,
    selectedUser,
    editTab,
    formData,
    permissionsCatalog,
    queryClient,
    isRolePermissionsOpen,
    toggleStatus,
    deleteUser,
    handleChange,
    handleSubmit,
    openCreateModal,
    openEditModal,
    openPermissionsModal,
    openPointsModal,
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
    avatarVersionByUserId,
    avatarCacheKey,
  } = useUsersPage();

  const [submissionLinkUser, setSubmissionLinkUser] = useState(null);
  const { isFeatureEnabled } = useFeatureFlags();
  const showPointsAdjust =
    isFeatureEnabled("broker_points.enabled") &&
    hasPermission(currentUser, "brokers.gamification.manage");
  const submissionLinkMutation = useCreateSubmissionLinkMutation();

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
        onOpenSubmissionLink={setSubmissionLinkUser}
        onOpenPointsAdjust={showPointsAdjust ? openPointsModal : undefined}
        toggleStatus={toggleStatus}
        deleteUser={deleteUser}
        avatarVersionByUserId={avatarVersionByUserId}
      />

      {!isEditMode && (
        <UserFormModal
          isModalOpen={isModalOpen}
          closeModal={closeModal}
          isEditMode={false}
          handleSubmit={handleSubmit}
          formData={formData}
          handleChange={handleChange}
          isPending={isPending}
          isUserDetailsLoading={isUserDetailsLoading}
          permissionsCatalog={permissionsCatalog}
          canManageCustomPermissions={hasPermission(currentUser, "users.managePermissions")}
        />
      )}

      {isEditMode && (
        <UserEditModal
          isOpen={isModalOpen}
          onClose={closeModal}
          user={selectedUser}
          initialTab={editTab}
          formData={formData}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          isPending={isPending}
          isUserDetailsLoading={isUserDetailsLoading}
          permissionsCatalog={permissionsCatalog}
          canManageCustomPermissions={hasPermission(currentUser, "users.managePermissions")}
          onAvatarUpload={handleAvatarUpload}
          onAvatarDelete={handleAvatarDelete}
          isAvatarPending={isAvatarPending}
          avatarCacheKey={avatarCacheKey}
          queryClient={queryClient}
          currentUser={currentUser}
        />
      )}

      <RolePermissionsModal
        isOpen={isRolePermissionsOpen}
        onClose={closeRolePermissions}
        permissionsCatalog={permissionsCatalog}
        queryClient={queryClient}
      />

      <SubmissionLinkModal
        isOpen={!!submissionLinkUser}
        onClose={() => setSubmissionLinkUser(null)}
        user={submissionLinkUser}
        mutation={submissionLinkMutation}
      />
    </div>
  );
};

export default UsersPage;
