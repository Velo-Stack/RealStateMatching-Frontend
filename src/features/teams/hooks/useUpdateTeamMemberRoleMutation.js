import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  MY_TEAM_QUERY_KEY,
  TEAM_MEMBER_ROLE_UPDATE_ERROR_MESSAGE,
  TEAM_MEMBER_ROLE_UPDATE_SUCCESS_MESSAGE,
  TEAMS_QUERY_KEY,
} from "../constants/teamsConstants";
import { updateTeamMemberRole } from "../services/teamsApi";

export const useUpdateTeamMemberRoleMutation = (queryClient) =>
  useMutation({
    mutationFn: updateTeamMemberRole,
    onSuccess: () => {
      toast.success(TEAM_MEMBER_ROLE_UPDATE_SUCCESS_MESSAGE);
      queryClient.invalidateQueries({ queryKey: TEAMS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: MY_TEAM_QUERY_KEY });
    },
    onError: (err) =>
      toast.error(
        err.response?.data?.message || TEAM_MEMBER_ROLE_UPDATE_ERROR_MESSAGE,
      ),
  });
