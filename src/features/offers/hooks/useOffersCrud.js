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

  const { data = [], isLoading } = useQuery({
    queryKey: [OFFERS_QUERY_KEY, filters],
    queryFn: () => fetchOffers(filters),
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
    data,
    isLoading,
    create: createMutation.mutate,
    update: updateMutation.mutate,
    remove: deleteMutation.mutate,
    isSubmitting: createMutation.isPending || updateMutation.isPending,
  };
};
