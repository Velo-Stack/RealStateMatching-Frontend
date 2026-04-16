import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  REQUESTS_CREATE_ERROR_MESSAGE,
  REQUESTS_CREATE_SUCCESS_MESSAGE,
  REQUESTS_DELETE_ERROR_MESSAGE,
  REQUESTS_DELETE_SUCCESS_MESSAGE,
  REQUESTS_QUERY_KEY,
  REQUESTS_UPDATE_ERROR_MESSAGE,
  REQUESTS_UPDATE_SUCCESS_MESSAGE,
} from "../constants/requestsConstants";
import {
  createRequest,
  deleteRequest,
  fetchRequests,
  updateRequest,
} from "../services/requestsApi";

export const useRequestsCrud = (filters = {}) => {
  const queryClient = useQueryClient();

  // Check if userId is in filters (DATA_ENTRY_ONLY user)
  const isDataEntryOnly = !!filters.userId;

  const { data, isLoading, isFetching, status, error } = useQuery({
    queryKey: [REQUESTS_QUERY_KEY, filters],
    queryFn: () => fetchRequests(filters),
    placeholderData: (previousData) => previousData,
    enabled: !isDataEntryOnly, // Disable query for DATA_ENTRY_ONLY users
  });

  const createMutation = useMutation({
    mutationFn: createRequest,
    onSuccess: () => {
      toast.success(REQUESTS_CREATE_SUCCESS_MESSAGE);
      queryClient.invalidateQueries({ queryKey: [REQUESTS_QUERY_KEY] });
    },
    onError: (error) => {
      toast.error(REQUESTS_CREATE_ERROR_MESSAGE);
      console.error("Create error:", error);
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateRequest,
    onSuccess: () => {
      toast.success(REQUESTS_UPDATE_SUCCESS_MESSAGE);
      queryClient.invalidateQueries({ queryKey: [REQUESTS_QUERY_KEY] });
    },
    onError: (error) => {
      toast.error(REQUESTS_UPDATE_ERROR_MESSAGE);
      console.error("Update error:", error);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteRequest,
    onSuccess: () => {
      toast.success(REQUESTS_DELETE_SUCCESS_MESSAGE);
      queryClient.invalidateQueries({ queryKey: [REQUESTS_QUERY_KEY] });
    },
    onError: (error) => {
      toast.error(REQUESTS_DELETE_ERROR_MESSAGE);
      console.error("Delete error:", error);
    },
  });

  return {
    data: data?.items ?? [],
    pagination: data?.pagination ?? {
      page: Number(filters.page) || 1,
      limit: Number(filters.limit) || 15,
      total: data?.items?.length || 0,
      totalPages: Math.max(1, Math.ceil((data?.items?.length || 0) / (Number(filters.limit) || 15))),
    },
    isLoading: isDataEntryOnly ? false : isLoading,
    isFetching: isDataEntryOnly ? false : isFetching,
    status: isDataEntryOnly ? 'success' : status,
    error: isDataEntryOnly ? null : error,
    create: createMutation.mutate,
    update: updateMutation.mutate,
    remove: deleteMutation.mutate,
    isSubmitting: createMutation.isPending || updateMutation.isPending,
  };
};
