import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../../context/AuthContext";
import { hasRole, ROLES } from "../../../utils/rbac";
import {
  TEAM_MEMBER_FORM_INITIAL_STATE,
  TEAM_FORM_INITIAL_STATE,
} from "../constants/teamsConstants";
import { useAddTeamMemberMutation } from "./useAddTeamMemberMutation";
import { useCreateTeamMutation } from "./useCreateTeamMutation";
import { useRemoveTeamMemberMutation } from "./useRemoveTeamMemberMutation";
import { useTeamsQuery } from "./useTeamsQuery";
import { useTeamUsersQuery } from "./useTeamUsersQuery";
import { useUpdateTeamMemberRoleMutation } from "./useUpdateTeamMemberRoleMutation";
import { resetTeamForm, resetTeamMemberForm } from "../utils/teamsUtils";

export const useTeamsPage = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [expandedTeam, setExpandedTeam] = useState(null);
  const [formData, setFormData] = useState(TEAM_FORM_INITIAL_STATE);
  const [memberData, setMemberData] = useState(TEAM_MEMBER_FORM_INITIAL_STATE);

  const { data: teams = [], isLoading } = useTeamsQuery();
  const { data: users = [] } = useTeamUsersQuery();

  const createTeamMutation = useCreateTeamMutation(queryClient, () => {
    setIsModalOpen(false);
    setFormData(resetTeamForm());
  });

  const addMemberMutation = useAddTeamMemberMutation(queryClient, () => {
    setIsMemberModalOpen(false);
    setMemberData(resetTeamMemberForm());
  });

  const removeMemberMutation = useRemoveTeamMemberMutation(queryClient);
  const updateRoleMutation = useUpdateTeamMemberRoleMutation(queryClient);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleMemberChange = (e) =>
    setMemberData({ ...memberData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    createTeamMutation.mutate(formData);
  };

  const handleAddMember = (e) => {
    e.preventDefault();
    if (!selectedTeam) return;

    addMemberMutation.mutate({
      teamId: selectedTeam.id,
      payload: { userId: parseInt(memberData.userId), role: memberData.role },
    });
  };

  const openMemberModal = (team) => {
    setSelectedTeam(team);
    setIsMemberModalOpen(true);
  };

  const toggleExpand = (teamId) => {
    setExpandedTeam(expandedTeam === teamId ? null : teamId);
  };

  const isAdmin = hasRole(user, [ROLES.ADMIN]);

  return {
    user,
    teams,
    users,
    isLoading,
    isAdmin,
    isModalOpen,
    setIsModalOpen,
    isMemberModalOpen,
    setIsMemberModalOpen,
    selectedTeam,
    setSelectedTeam,
    expandedTeam,
    setExpandedTeam,
    formData,
    setFormData,
    memberData,
    setMemberData,
    createTeamMutation,
    addMemberMutation,
    removeMemberMutation,
    updateRoleMutation,
    handleChange,
    handleMemberChange,
    handleSubmit,
    handleAddMember,
    openMemberModal,
    toggleExpand,
  };
};
