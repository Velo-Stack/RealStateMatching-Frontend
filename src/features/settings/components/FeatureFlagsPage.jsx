import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { fetchFeatureFlags, updateFeatureFlag } from "../services/featureFlagsApi";
import { FEATURE_FLAGS_QUERY_KEY } from "../../../hooks/useFeatureFlags";

const ADMIN_FLAGS_KEY = ["admin-feature-flags"];

const FeatureFlagsPage = () => {
  const queryClient = useQueryClient();

  const { data: flags = [], isLoading } = useQuery({
    queryKey: ADMIN_FLAGS_KEY,
    queryFn: fetchFeatureFlags,
  });

  const toggleMutation = useMutation({
    mutationFn: updateFeatureFlag,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_FLAGS_KEY });
      queryClient.invalidateQueries({ queryKey: FEATURE_FLAGS_QUERY_KEY });
      toast.success("تم تحديث الإعداد");
    },
    onError: () => {
      toast.error("تعذر تحديث الإعداد");
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20 text-slate-400 text-sm">
        جار التحميل...
      </div>
    );
  }

  return (
    <div className="space-y-6 text-right">
      <div>
        <h1 className="text-2xl font-bold text-white">إعدادات النظام</h1>
        <p className="mt-1 text-sm text-slate-400">
          تفعيل أو إيقاف الميزات الجديدة — جميعها معطّلة افتراضياً للحفاظ على استقرار النظام
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/5 bg-[#111827]/60 backdrop-blur-xl">
        <div className="hidden sm:grid sm:grid-cols-[1fr_auto] gap-4 px-5 py-3 border-b border-white/5 text-xs font-medium text-slate-400">
          <span>الميزة</span>
          <span>الحالة</span>
        </div>
        <ul className="divide-y divide-white/5">
          {flags.map((flag) => (
            <li
              key={flag.key}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-5 py-4"
            >
              <div className="min-w-0 flex-1">
                <p className="font-medium text-white">{flag.label}</p>
                <p className="mt-0.5 text-xs text-slate-500 font-mono" dir="ltr">
                  {flag.key}
                </p>
                {flag.description && (
                  <p className="mt-1 text-sm text-slate-400">{flag.description}</p>
                )}
              </div>
              <label className="inline-flex items-center gap-3 cursor-pointer shrink-0">
                <span className="text-xs text-slate-400">
                  {flag.enabled ? "مفعّل" : "معطّل"}
                </span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={flag.enabled}
                  disabled={toggleMutation.isPending}
                  onClick={() =>
                    toggleMutation.mutate({ key: flag.key, enabled: !flag.enabled })
                  }
                  className={`relative h-7 w-12 rounded-full transition-colors ${
                    flag.enabled ? "bg-emerald-500" : "bg-slate-600"
                  } disabled:opacity-50`}
                >
                  <span
                    className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform ${
                      flag.enabled ? "right-0.5" : "right-[calc(100%-1.625rem)]"
                    }`}
                  />
                </button>
              </label>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FeatureFlagsPage;
