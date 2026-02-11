import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  MY_TEAM_QUERY_KEY,
  TEAM_MEMBER_REMOVE_ERROR_MESSAGE,
  TEAM_MEMBER_REMOVE_SUCCESS_MESSAGE,
  TEAMS_QUERY_KEY,
} from "../constants/teamsConstants";
import { removeTeamMember } from "../services/teamsApi";

export const useRemoveTeamMemberMutation = (queryClient) =>
  useMutation({
    mutationFn: removeTeamMember,
    onSuccess: () => {
      toast.success(TEAM_MEMBER_REMOVE_SUCCESS_MESSAGE);
      queryClient.invalidateQueries({ queryKey: TEAMS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: MY_TEAM_QUERY_KEY });
    },
    onError: (err) =>
      toast.error(err.response?.data?.message || TEAM_MEMBER_REMOVE_ERROR_MESSAGE),
  });
