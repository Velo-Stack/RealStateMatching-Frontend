import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  OFFERS_CREATE_ERROR_MESSAGE,
  OFFERS_CREATE_SUCCESS_MESSAGE,
  OFFERS_DELETE_ERROR_MESSAGE,
  OFFERS_DELETE_SUCCESS_MESSAGE,
  OFFERS_QUERY_KEY,
  OFFERS_UPDATE_ERROR_MESSAGE,
  OFFERS_UPDATE_SUCCESS_MESSAGE,
} from "../constants/offersConstants";
import { createOffer, deleteOffer, fetchOffers, updateOffer } from "../services/offersApi";

export const useOffersCrud = (filters = {}) => {
  const queryClient = useQueryClient();

  // Check if userId is in filters (DATA_ENTRY_ONLY user)
  const skipRead = Boolean(filters.skipRead || filters.userId);

  const { data, isLoading, status, isFetching, error } = useQuery({
    queryKey: [OFFERS_QUERY_KEY, filters],
    queryFn: () => fetchOffers(filters),
    placeholderData: (previousData) => previousData,
    enabled: !skipRead,
  });

  const createMutation = useMutation({
    mutationFn: createOffer,
    onSuccess: () => {
      toast.success(OFFERS_CREATE_SUCCESS_MESSAGE);
      queryClient.invalidateQueries({ queryKey: [OFFERS_QUERY_KEY] });
    },
    onError: (error) => {
      toast.error(OFFERS_CREATE_ERROR_MESSAGE);
      console.error("Create error:", error);
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateOffer,
    onSuccess: () => {
      toast.success(OFFERS_UPDATE_SUCCESS_MESSAGE);
      queryClient.invalidateQueries({ queryKey: [OFFERS_QUERY_KEY] });
    },
    onError: (error) => {
      toast.error(OFFERS_UPDATE_ERROR_MESSAGE);
      console.error("Update error:", error);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteOffer,
    onSuccess: () => {
      toast.success(OFFERS_DELETE_SUCCESS_MESSAGE);
      queryClient.invalidateQueries({ queryKey: [OFFERS_QUERY_KEY] });
    },
    onError: (error) => {
      toast.error(OFFERS_DELETE_ERROR_MESSAGE);
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
    isLoading: skipRead ? false : isLoading,
    status: skipRead ? 'success' : status,
    isFetching: skipRead ? false : isFetching,
    error: skipRead ? null : error,
    create: createMutation.mutate,
    update: updateMutation.mutate,
    remove: deleteMutation.mutate,
    isSubmitting: createMutation.isPending || updateMutation.isPending,
  };
};
