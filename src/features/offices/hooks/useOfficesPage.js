import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchOffices,
  createOfficeApi,
  updateOfficeApi,
  deactivateOfficeApi,
  addOfficeMemberApi,
  removeOfficeMemberApi,
} from "../services/officesApi";

export const useOfficesPage = (enabled) => {
  const queryClient = useQueryClient();

  const { data: offices = [], isLoading } = useQuery({
    queryKey: ["offices"],
    queryFn: () => fetchOffices({ includeInactive: true }),
    enabled,
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["offices"] });

  const createOffice = useMutation({
    mutationFn: createOfficeApi,
    onSuccess: invalidate,
  });

  const updateOffice = useMutation({
    mutationFn: updateOfficeApi,
    onSuccess: invalidate,
  });

  const deactivateOffice = useMutation({
    mutationFn: deactivateOfficeApi,
    onSuccess: invalidate,
  });

  const addMember = useMutation({
    mutationFn: addOfficeMemberApi,
    onSuccess: invalidate,
  });

  const removeMember = useMutation({
    mutationFn: removeOfficeMemberApi,
    onSuccess: invalidate,
  });

  return {
    offices,
    isLoading,
    createOffice,
    updateOffice,
    deactivateOffice,
    addMember,
    removeMember,
  };
};
