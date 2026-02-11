import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  TEAM_CREATE_ERROR_MESSAGE,
  TEAM_CREATE_SUCCESS_MESSAGE,
  TEAMS_QUERY_KEY,
} from "../constants/teamsConstants";
import { createTeam } from "../services/teamsApi";

export const useCreateTeamMutation = (queryClient, onSuccessCallback) =>
  useMutation({
    mutationFn: createTeam,
    onSuccess: () => {
      toast.success(TEAM_CREATE_SUCCESS_MESSAGE);
      queryClient.invalidateQueries({ queryKey: TEAMS_QUERY_KEY });
      onSuccessCallback();
    },
    onError: () => toast.error(TEAM_CREATE_ERROR_MESSAGE),
  });
