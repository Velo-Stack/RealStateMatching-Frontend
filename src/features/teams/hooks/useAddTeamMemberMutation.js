import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  MY_TEAM_QUERY_KEY,
  TEAM_MEMBER_ADD_ERROR_MESSAGE,
  TEAM_MEMBER_ADD_SUCCESS_MESSAGE,
  TEAMS_QUERY_KEY,
} from "../constants/teamsConstants";
import { addTeamMember } from "../services/teamsApi";

export const useAddTeamMemberMutation = (queryClient, onSuccessCallback) =>
  useMutation({
    mutationFn: addTeamMember,
    onSuccess: () => {
      toast.success(TEAM_MEMBER_ADD_SUCCESS_MESSAGE);
      queryClient.invalidateQueries({ queryKey: TEAMS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: MY_TEAM_QUERY_KEY });
      onSuccessCallback();
    },
    onError: (err) =>
      toast.error(err.response?.data?.message || TEAM_MEMBER_ADD_ERROR_MESSAGE),
  });
