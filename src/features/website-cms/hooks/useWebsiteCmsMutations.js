import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { WEBSITE_CMS_QUERY_KEYS } from "../constants/websiteCmsQueryKeys";
import {
  createFeaturedOfferApi,
  createHeroSlideApi,
  createWebsiteSectionApi,
  deleteFeaturedOfferApi,
  deleteHeroSlideApi,
  deleteWebsiteSectionApi,
  toggleHeroSlideStatusApi,
  updateFeaturedOfferApi,
  updateHeroSlideApi,
  updateWebsiteSectionApi,
  updateWebsiteSettingsApi,
  uploadWebsiteImageApi,
} from "../services/websiteCmsApi";

export const useWebsiteSettingsMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateWebsiteSettingsApi,
    onSuccess: () => {
      toast.success("تم حفظ إعدادات الموقع");
      queryClient.invalidateQueries({
        queryKey: WEBSITE_CMS_QUERY_KEYS.settings,
      });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "فشل حفظ إعدادات الموقع");
    },
  });
};

export const useHeroSlideMutations = () => {
  const queryClient = useQueryClient();
  const invalidate = () =>
    queryClient.invalidateQueries({
      queryKey: WEBSITE_CMS_QUERY_KEYS.heroSlides,
    });

  return {
    createHeroSlide: useMutation({
      mutationFn: createHeroSlideApi,
      onSuccess: () => {
        toast.success("تم إنشاء الشريحة");
        invalidate();
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || "فشل إنشاء الشريحة");
      },
    }),
    updateHeroSlide: useMutation({
      mutationFn: updateHeroSlideApi,
      onSuccess: () => {
        toast.success("تم تحديث الشريحة");
        invalidate();
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || "فشل تحديث الشريحة");
      },
    }),
    toggleHeroSlideStatus: useMutation({
      mutationFn: toggleHeroSlideStatusApi,
      onSuccess: () => {
        toast.success("تم تحديث حالة الشريحة");
        invalidate();
      },
      onError: (error) => {
        toast.error(
          error.response?.data?.message || "فشل تحديث حالة الشريحة",
        );
      },
    }),
    deleteHeroSlide: useMutation({
      mutationFn: deleteHeroSlideApi,
      onSuccess: () => {
        toast.success("تم حذف الشريحة");
        invalidate();
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || "فشل حذف الشريحة");
      },
    }),
  };
};

export const useWebsiteSectionMutations = () => {
  const queryClient = useQueryClient();
  const invalidate = () =>
    queryClient.invalidateQueries({
      queryKey: WEBSITE_CMS_QUERY_KEYS.sections,
    });

  return {
    createWebsiteSection: useMutation({
      mutationFn: createWebsiteSectionApi,
      onSuccess: () => {
        toast.success("تم إنشاء القسم");
        invalidate();
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || "فشل إنشاء القسم");
      },
    }),
    updateWebsiteSection: useMutation({
      mutationFn: updateWebsiteSectionApi,
      onSuccess: () => {
        toast.success("تم تحديث القسم");
        invalidate();
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || "فشل تحديث القسم");
      },
    }),
    deleteWebsiteSection: useMutation({
      mutationFn: deleteWebsiteSectionApi,
      onSuccess: () => {
        toast.success("تم حذف القسم");
        invalidate();
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || "فشل حذف القسم");
      },
    }),
  };
};

export const useFeaturedOfferMutations = () => {
  const queryClient = useQueryClient();
  const invalidate = () =>
    queryClient.invalidateQueries({
      queryKey: WEBSITE_CMS_QUERY_KEYS.featuredOffers,
    });

  return {
    createFeaturedOffer: useMutation({
      mutationFn: createFeaturedOfferApi,
      onSuccess: () => {
        toast.success("تم إنشاء العقار المميز");
        invalidate();
      },
      onError: (error) => {
        toast.error(
          error.response?.data?.message || "فشل إنشاء العقار المميز",
        );
      },
    }),
    updateFeaturedOffer: useMutation({
      mutationFn: updateFeaturedOfferApi,
      onSuccess: () => {
        toast.success("تم تحديث العقار المميز");
        invalidate();
      },
      onError: (error) => {
        toast.error(
          error.response?.data?.message || "فشل تحديث العقار المميز",
        );
      },
    }),
    deleteFeaturedOffer: useMutation({
      mutationFn: deleteFeaturedOfferApi,
      onSuccess: () => {
        toast.success("تم حذف العقار المميز");
        invalidate();
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || "فشل حذف العقار المميز");
      },
    }),
  };
};

export const useWebsiteImageUploadMutation = () =>
  useMutation({
    mutationFn: uploadWebsiteImageApi,
    onSuccess: () => {
      toast.success("تم رفع الصورة بنجاح");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "فشل رفع الصورة");
    },
  });
