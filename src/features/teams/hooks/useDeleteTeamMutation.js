import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  MY_TEAM_QUERY_KEY,
  TEAMS_QUERY_KEY,
} from "../constants/teamsConstants";
import { deleteTeam } from "../services/teamsApi";

export const useDeleteTeamMutation = (queryClient) =>
  useMutation({
    mutationFn: deleteTeam,
    onSuccess: () => {
      toast.success("تم حذف الفريق بنجاح");
      queryClient.invalidateQueries({ queryKey: TEAMS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: MY_TEAM_QUERY_KEY });
    },
    onError: (err) =>
      toast.error(err.response?.data?.message || "فشل حذف الفريق"),
  });
