import { useQuery } from '@tanstack/react-query';
import { fetchAdminProjects, fetchAdminProject } from '../services/projectsCmsApi';

export const useProjectsQuery = () =>
  useQuery({ queryKey: ['admin-projects'], queryFn: fetchAdminProjects });

export const useProjectDetailQuery = (id) =>
  useQuery({
    queryKey: ['admin-projects', id],
    queryFn: () => fetchAdminProject(id),
    enabled: !!id,
  });
