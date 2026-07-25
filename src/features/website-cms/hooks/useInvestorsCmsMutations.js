import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import * as api from "../services/investorsCmsApi";

export const INVESTOR_CMS_KEYS = {
  all: ["investor_cms"],
  stats: () => [...INVESTOR_CMS_KEYS.all, "stats"],
  content: (key) => [...INVESTOR_CMS_KEYS.all, "content", key],
  events: () => [...INVESTOR_CMS_KEYS.all, "events"],
  announcements: () => [...INVESTOR_CMS_KEYS.all, "announcements"],
  advantages: () => [...INVESTOR_CMS_KEYS.all, "advantages"],
};

// --- Stats ---
export const useInvestorStatsQuery = () => useQuery({ queryKey: INVESTOR_CMS_KEYS.stats(), queryFn: api.getInvestorStatsApi });

export const useInvestorStatsMutations = () => {
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries({ queryKey: INVESTOR_CMS_KEYS.stats() });

  return {
    create: useMutation({ mutationFn: api.createInvestorStatApi, onSuccess: () => { toast.success("تم الإضافة"); invalidate(); } }),
    update: useMutation({ mutationFn: api.updateInvestorStatApi, onSuccess: () => { toast.success("تم التحديث"); invalidate(); } }),
    remove: useMutation({ mutationFn: api.deleteInvestorStatApi, onSuccess: () => { toast.success("تم الحذف"); invalidate(); } }),
  };
};

// --- Content ---
export const useInvestorContentQuery = (key) => useQuery({ queryKey: INVESTOR_CMS_KEYS.content(key), queryFn: () => api.getInvestorContentApi(key) });

export const useInvestorContentMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.upsertInvestorContentApi,
    onSuccess: (data, variables) => {
      toast.success("تم الحفظ بنجاح");
      qc.invalidateQueries({ queryKey: INVESTOR_CMS_KEYS.content(variables.key) });
    },
  });
};

// --- Events ---
export const useInvestorEventsQuery = () => useQuery({ queryKey: INVESTOR_CMS_KEYS.events(), queryFn: api.getInvestorEventsApi });

export const useInvestorEventsMutations = () => {
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries({ queryKey: INVESTOR_CMS_KEYS.events() });

  return {
    create: useMutation({ mutationFn: api.createInvestorEventApi, onSuccess: () => { toast.success("تم الإضافة"); invalidate(); } }),
    update: useMutation({ mutationFn: api.updateInvestorEventApi, onSuccess: () => { toast.success("تم التحديث"); invalidate(); } }),
    remove: useMutation({ mutationFn: api.deleteInvestorEventApi, onSuccess: () => { toast.success("تم الحذف"); invalidate(); } }),
  };
};

// --- Announcements ---
export const useInvestorAnnouncementsQuery = () => useQuery({ queryKey: INVESTOR_CMS_KEYS.announcements(), queryFn: api.getInvestorAnnouncementsApi });

export const useInvestorAnnouncementsMutations = () => {
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries({ queryKey: INVESTOR_CMS_KEYS.announcements() });

  return {
    create: useMutation({ mutationFn: api.createInvestorAnnouncementApi, onSuccess: () => { toast.success("تم الإضافة"); invalidate(); } }),
    update: useMutation({ mutationFn: api.updateInvestorAnnouncementApi, onSuccess: () => { toast.success("تم التحديث"); invalidate(); } }),
    remove: useMutation({ mutationFn: api.deleteInvestorAnnouncementApi, onSuccess: () => { toast.success("تم الحذف"); invalidate(); } }),
  };
};

// --- Advantages ---
export const useInvestorAdvantagesQuery = () => useQuery({ queryKey: INVESTOR_CMS_KEYS.advantages(), queryFn: api.getInvestorAdvantagesApi });

export const useInvestorAdvantagesMutations = () => {
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries({ queryKey: INVESTOR_CMS_KEYS.advantages() });

  return {
    create: useMutation({ mutationFn: api.createInvestorAdvantageApi, onSuccess: () => { toast.success("تم الإضافة"); invalidate(); } }),
    update: useMutation({ mutationFn: api.updateInvestorAdvantageApi, onSuccess: () => { toast.success("تم التحديث"); invalidate(); } }),
    remove: useMutation({ mutationFn: api.deleteInvestorAdvantageApi, onSuccess: () => { toast.success("تم الحذف"); invalidate(); } }),
  };
};
