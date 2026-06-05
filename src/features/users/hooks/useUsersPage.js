import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../../context/AuthContext";
import { emptyUser } from "../constants/usersConstants";
import { USERS_QUERY_KEYS } from "../../../shared/query/queryKeys";
import { hasPermission } from "../../../utils/rbac";
import { fetchPermissionsApi, fetchUserById } from "../services/usersApi";
import { useCreateUserMutation } from "./useCreateUserMutation";
import { useDeleteUserMutation } from "./useDeleteUserMutation";
import { useToggleUserStatusMutation } from "./useToggleUserStatusMutation";
import { useUpdateUserMutation } from "./useUpdateUserMutation";
import { useUploadUserAvatarMutation } from "./useUploadUserAvatarMutation";
import { useUsersQuery } from "./useUsersQuery";
import {
  buildUserUpdatePayload,
  buildUserCreatePayload,
  getActiveUsers,
  getEditFormData,
  getEmptyUserForm,
  getUsersByRole,
} from "../utils/usersUtils";

export const useUsersPage = () => {
  const queryClient = useQueryClient();
  const { user: currentUser } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [permissionsUser, setPermissionsUser] = useState(null);
  const [isRolePermissionsOpen, setIsRolePermissionsOpen] = useState(false);
  const [formData, setFormData] = useState(emptyUser);
  const [filters, setFilters] = useState({ role: "", status: "" });
  const [isUserDetailsLoading, setIsUserDetailsLoading] = useState(false);

  const { data: users = [], isLoading } = useUsersQuery();
  const { data: permissionsCatalog = [] } = useQuery({
    queryKey: USERS_QUERY_KEYS.permissions,
    queryFn: fetchPermissionsApi,
    enabled:
      hasPermission(currentUser, "users.managePermissions") ||
      hasPermission(currentUser, "users.create"),
    retry: false,
  });

  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setSelectedUser(null);
    setFormData(getEmptyUserForm());
    setIsUserDetailsLoading(false);
  };

  const createUser = useCreateUserMutation(queryClient, closeModal);
  const updateUser = useUpdateUserMutation(queryClient, closeModal);
  const toggleStatus = useToggleUserStatusMutation(queryClient);
  const deleteUser = useDeleteUserMutation(queryClient);
  const { upload: uploadAvatar, remove: removeAvatar } = useUploadUserAvatarMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditMode && selectedUser) {
      const payload = buildUserUpdatePayload(formData);
      updateUser.mutate({ id: selectedUser.id, payload });
    } else {
      createUser.mutate(buildUserCreatePayload(formData));
    }
  };

  const openCreateModal = () => {
    setIsEditMode(false);
    setSelectedUser(null);
    setFormData(getEmptyUserForm());
    setIsModalOpen(true);
  };

  const openEditModal = async (user) => {
    setIsEditMode(true);
    setSelectedUser(user);
    setFormData(getEditFormData(user));
    setIsModalOpen(true);
    setIsUserDetailsLoading(true);

    try {
      const latestUser = await fetchUserById(user.id);
      setFormData(getEditFormData(latestUser));
    } catch (error) {
      console.error("Failed to load user details", error);
    } finally {
      setIsUserDetailsLoading(false);
    }
  };

  const handleAvatarUpload = (file) => {
    if (!selectedUser?.id || !file) return;
    if (file.size > 2 * 1024 * 1024) {
      return;
    }
    uploadAvatar.mutate(
      { id: selectedUser.id, file },
      {
        onSuccess: (updated) => {
          setFormData((prev) => ({ ...prev, avatarUrl: updated.avatarUrl }));
          setSelectedUser((prev) => (prev ? { ...prev, avatarUrl: updated.avatarUrl } : prev));
        },
      }
    );
  };

  const handleAvatarDelete = () => {
    if (!selectedUser?.id) return;
    removeAvatar.mutate(selectedUser.id, {
      onSuccess: () => {
        setFormData((prev) => ({ ...prev, avatarUrl: null }));
        setSelectedUser((prev) => (prev ? { ...prev, avatarUrl: null } : prev));
      },
    });
  };

  const handleDelete = (user) => {
    if (confirm(`هل تريد حذف المستخدم "${user.name}"؟`)) {
      deleteUser.mutate(user.id);
    }
  };

  const handleToggleStatus = (user) => {
    const newStatus = user.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
    toggleStatus.mutate({ id: user.id, status: newStatus });
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const openPermissionsModal = (user) => {
    setPermissionsUser(user);
  };

  const closePermissionsModal = () => {
    setPermissionsUser(null);
  };

  const openRolePermissions = () => {
    setIsRolePermissionsOpen(true);
  };

  const closeRolePermissions = () => {
    setIsRolePermissionsOpen(false);
  };

  const activeUsers = getActiveUsers(users);
  const usersByRole = getUsersByRole(activeUsers);

  const filteredUsers = activeUsers.filter((user) => {
    if (filters.role && user.role !== filters.role) return false;
    if (filters.status && user.status !== filters.status) return false;
    return true;
  });

  const isPending = createUser.isPending || updateUser.isPending;

  return {
    currentUser,
    users,
    isLoading,
    isModalOpen,
    setIsModalOpen,
    isEditMode,
    selectedUser,
    permissionsUser,
    isRolePermissionsOpen,
    formData,
    permissionsCatalog,
    queryClient,
    createUser,
    updateUser,
    toggleStatus,
    deleteUser,
    handleChange,
    handleSubmit,
    openCreateModal,
    openEditModal,
    closeModal,
    openPermissionsModal,
    closePermissionsModal,
    openRolePermissions,
    closeRolePermissions,
    handleDelete,
    handleToggleStatus,
    usersByRole,
    activeUsers,
    filteredUsers,
    filters,
    handleFilterChange,
    isPending,
    isUserDetailsLoading,
    handleAvatarUpload,
    handleAvatarDelete,
    isAvatarPending: uploadAvatar.isPending || removeAvatar.isPending,
  };
};
