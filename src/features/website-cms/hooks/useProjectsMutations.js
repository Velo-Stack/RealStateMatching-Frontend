import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  createProjectApi, updateProjectApi, deleteProjectApi,
  patchProjectStatusApi, reorderProjectsApi,
  uploadProjectCoverApi, deleteProjectCoverApi,
  uploadProjectGalleryApi, deleteGalleryImageApi,
} from '../services/projectsCmsApi';

const invalidate = (qc, projectId) => {
  qc.invalidateQueries({ queryKey: ['admin-projects'] });
  if (projectId) {
    qc.invalidateQueries({ queryKey: ['admin-projects', projectId] });
  }
};

export const useProjectsMutations = () => {
  const qc = useQueryClient();
  
  return {
    createMutation: useMutation({
      mutationFn: createProjectApi,
      onSuccess: () => { invalidate(qc); toast.success('تم إنشاء المشروع بنجاح'); },
      onError: (err) => toast.error(err?.response?.data?.error || 'خطأ في إنشاء المشروع'),
    }),
    updateMutation: useMutation({
      mutationFn: ({ id, data }) => updateProjectApi(id, data),
      onSuccess: () => { invalidate(qc); toast.success('تم تحديث المشروع بنجاح'); },
      onError: (err) => toast.error(err?.response?.data?.error || 'خطأ في تحديث المشروع'),
    }),
    deleteMutation: useMutation({
      mutationFn: deleteProjectApi,
      onSuccess: () => { invalidate(qc); toast.success('تم حذف المشروع بنجاح'); },
      onError: (err) => toast.error(err?.response?.data?.error || 'خطأ في حذف المشروع'),
    }),
    statusMutation: useMutation({
      mutationFn: ({ id, data }) => patchProjectStatusApi(id, data),
      onSuccess: () => { invalidate(qc); toast.success('تم تحديث الحالة'); },
      onError: (err) => toast.error(err?.response?.data?.error || 'خطأ في تحديث الحالة'),
    }),
    reorderMutation: useMutation({
      mutationFn: reorderProjectsApi,
      onSuccess: () => invalidate(qc),
    }),
    coverUploadMutation: useMutation({
      mutationFn: ({ id, file }) => uploadProjectCoverApi(id, file),
      onSuccess: (_, { id }) => { invalidate(qc, id); toast.success('تم رفع الصورة'); },
      onError: () => toast.error('خطأ في رفع الصورة'),
    }),
    coverDeleteMutation: useMutation({
      mutationFn: (id) => deleteProjectCoverApi(id),
      onSuccess: (_, id) => { invalidate(qc, id); toast.success('تم حذف الصورة'); },
      onError: () => toast.error('خطأ في حذف الصورة'),
    }),
    galleryUploadMutation: useMutation({
      mutationFn: ({ id, files }) => uploadProjectGalleryApi(id, files),
      onSuccess: (_, { id }) => { invalidate(qc, id); toast.success('تم رفع الصور'); },
      onError: () => toast.error('خطأ في رفع الصور'),
    }),
    galleryDeleteMutation: useMutation({
      mutationFn: ({ id, filename }) => deleteGalleryImageApi(id, filename),
      onSuccess: (_, { id }) => { invalidate(qc, id); toast.success('تم حذف الصورة'); },
      onError: () => toast.error('خطأ في حذف الصورة'),
    }),
  };
};
