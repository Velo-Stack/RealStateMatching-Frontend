import { useQuery } from "@tanstack/react-query";
import { fetchUserById } from "../services/usersApi";

export const useUserQuery = (userId) =>
    useQuery({
        queryKey: ["user", userId],
        queryFn: () => fetchUserById(userId),
        enabled: !!userId,
    });
