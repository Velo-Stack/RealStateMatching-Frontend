import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { emptyUser } from "../constants/usersConstants";
import { useCreateUserMutation } from "./useCreateUserMutation";
import { useDeleteUserMutation } from "./useDeleteUserMutation";
import { useToggleUserStatusMutation } from "./useToggleUserStatusMutation";
import { useUpdateUserMutation } from "./useUpdateUserMutation";
import { useUsersQuery } from "./useUsersQuery";
import {
  buildUserUpdatePayload,
  getActiveUsers,
  getEditFormData,
  getEmptyUserForm,
  getUsersByRole,
} from "../utils/usersUtils";

export const useUsersPage = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState(emptyUser);

  const { data: users = [], isLoading } = useUsersQuery();

  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setSelectedUser(null);
    setFormData(getEmptyUserForm());
  };

  const createUser = useCreateUserMutation(queryClient, closeModal);
  const updateUser = useUpdateUserMutation(queryClient, closeModal);
  const toggleStatus = useToggleUserStatusMutation(queryClient);
  const deleteUser = useDeleteUserMutation(queryClient);

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
      createUser.mutate(formData);
    }
  };

  const openCreateModal = () => {
    setIsEditMode(false);
    setSelectedUser(null);
    setFormData(getEmptyUserForm());
    setIsModalOpen(true);
  };

  const openEditModal = (user) => {
    setIsEditMode(true);
    setSelectedUser(user);
    setFormData(getEditFormData(user));
    setIsModalOpen(true);
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

  const usersByRole = getUsersByRole(users);
  const activeUsers = getActiveUsers(users);
  const isPending = createUser.isPending || updateUser.isPending;

  return {
    users,
    isLoading,
    isModalOpen,
    setIsModalOpen,
    isEditMode,
    selectedUser,
    formData,
    createUser,
    updateUser,
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
  };
};
