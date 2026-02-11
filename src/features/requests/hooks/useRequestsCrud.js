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

export const useRequestsCrud = () => {
  const queryClient = useQueryClient();

  const { data = [], isLoading } = useQuery({
    queryKey: REQUESTS_QUERY_KEY,
    queryFn: fetchRequests,
  });

  const createMutation = useMutation({
    mutationFn: createRequest,
    onSuccess: () => {
      toast.success(REQUESTS_CREATE_SUCCESS_MESSAGE);
      queryClient.invalidateQueries({ queryKey: REQUESTS_QUERY_KEY });
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
      queryClient.invalidateQueries({ queryKey: REQUESTS_QUERY_KEY });
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
      queryClient.invalidateQueries({ queryKey: REQUESTS_QUERY_KEY });
    },
    onError: (error) => {
      toast.error(REQUESTS_DELETE_ERROR_MESSAGE);
      console.error("Delete error:", error);
    },
  });

  return {
    data,
    isLoading,
    create: createMutation.mutate,
    update: updateMutation.mutate,
    remove: deleteMutation.mutate,
    isSubmitting: createMutation.isPending || updateMutation.isPending,
  };
};
