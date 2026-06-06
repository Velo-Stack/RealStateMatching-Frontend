import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MagnifyingGlass, FloppyDisk, Trash } from "phosphor-react";
import { useFeatureFlags } from "../../../hooks/useFeatureFlags";
import useEntitlements from "../../../hooks/useEntitlements";
import useMeta from "../../../hooks/useMeta";
import UpgradePrompt from "../../../components/common/UpgradePrompt";
import {
  searchOffersApi,
  searchRequestsApi,
  fetchSavedSearches,
  createSavedSearchApi,
  deleteSavedSearchApi,
} from "../services/searchApi";

const EMPTY_FILTERS = {
  q: "",
  cityId: "",
  type: "",
  minPrice: "",
  maxPrice: "",
  minArea: "",
  maxArea: "",
  lat: "",
  lng: "",
  radiusKm: "",
  sort: "date_desc",
};

const SearchPage = () => {
  const { isFeatureEnabled } = useFeatureFlags();
  const { hasFeature } = useEntitlements();
  const { cities = [] } = useMeta();
  const queryClient = useQueryClient();
  const enabled = isFeatureEnabled("advanced_search.enabled");

  const [tab, setTab] = useState("OFFER");
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [saveName, setSaveName] = useState("");

  const searchFn = tab === "OFFER" ? searchOffersApi : searchRequestsApi;

  const { data: results, isFetching, refetch, error } = useQuery({
    queryKey: ["advanced-search", tab, filters],
    queryFn: () => {
      const params = Object.fromEntries(
        Object.entries(filters).filter(([, v]) => v !== "" && v != null)
      );
      return searchFn(params);
    },
    enabled: enabled && hasFeature("advancedSearch"),
  });

  const { data: saved = [] } = useQuery({
    queryKey: ["saved-searches"],
    queryFn: fetchSavedSearches,
    enabled: enabled && hasFeature("savedSearches"),
  });

  const saveSearch = useMutation({
    mutationFn: createSavedSearchApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saved-searches"] });
      setSaveName("");
    },
  });

  const removeSaved = useMutation({
    mutationFn: deleteSavedSearchApi,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["saved-searches"] }),
  });

  if (!enabled) {
    return <div className="p-6 text-center text-slate-400">البحث المتقدم غير مفعّل</div>;
  }

  if (!hasFeature("advancedSearch")) {
    return (
      <div className="p-6">
        <UpgradePrompt message="البحث المتقدم متاح في الخطة الاحترافية PRO" />
      </div>
    );
  }

  const inputClass = "w-full rounded-lg bg-slate-800 border border-white/10 p-2 text-sm";

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <MagnifyingGlass size={24} className="text-emerald-400" />
          البحث المتقدم
        </h1>
        <p className="text-sm text-slate-400 mt-1">ابحث في العروض والطلبات بفلاتر متعددة</p>
      </div>

      <div className="flex gap-2">
        {["OFFER", "REQUEST"].map((entity) => (
          <button
            key={entity}
            type="button"
            onClick={() => setTab(entity)}
            className={`px-4 py-2 rounded-lg text-sm border ${
              tab === entity
                ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                : "bg-slate-800/50 text-slate-400 border-white/10"
            }`}
          >
            {entity === "OFFER" ? "العروض" : "الطلبات"}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-1 space-y-3 rounded-xl border border-white/10 bg-[#111827]/60 p-4">
          <input
            className={inputClass}
            placeholder="بحث نصي أو كود OFF-000001"
            value={filters.q}
            onChange={(e) => setFilters({ ...filters, q: e.target.value })}
          />
          <select className={inputClass} value={filters.cityId} onChange={(e) => setFilters({ ...filters, cityId: e.target.value })}>
            <option value="">كل المدن</option>
            {cities.map((c) => (
              <option key={c.id} value={c.id}>{c.nameAr || c.name}</option>
            ))}
          </select>
          <select className={inputClass} value={filters.type} onChange={(e) => setFilters({ ...filters, type: e.target.value })}>
            <option value="">كل الأنواع</option>
            <option value="LAND">أرض</option>
            <option value="PROJECT">مشروع</option>
            <option value="PLAN">مخطط</option>
          </select>
          <input type="number" dir="ltr" className={inputClass} placeholder="السعر من" value={filters.minPrice} onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })} />
          <input type="number" dir="ltr" className={inputClass} placeholder="السعر إلى" value={filters.maxPrice} onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })} />
          <input type="number" dir="ltr" className={inputClass} placeholder="المساحة من" value={filters.minArea} onChange={(e) => setFilters({ ...filters, minArea: e.target.value })} />
          <input type="number" dir="ltr" className={inputClass} placeholder="المساحة إلى" value={filters.maxArea} onChange={(e) => setFilters({ ...filters, maxArea: e.target.value })} />

          {hasFeature("geoSearch") ? (
            <>
              <input type="number" dir="ltr" className={inputClass} placeholder="Latitude" value={filters.lat} onChange={(e) => setFilters({ ...filters, lat: e.target.value })} />
              <input type="number" dir="ltr" className={inputClass} placeholder="Longitude" value={filters.lng} onChange={(e) => setFilters({ ...filters, lng: e.target.value })} />
              <input type="number" dir="ltr" className={inputClass} placeholder="نطاق (كم)" value={filters.radiusKm} onChange={(e) => setFilters({ ...filters, radiusKm: e.target.value })} />
            </>
          ) : null}

          <select className={inputClass} value={filters.sort} onChange={(e) => setFilters({ ...filters, sort: e.target.value })}>
            <option value="date_desc">الأحدث</option>
            <option value="price_asc">السعر ↑</option>
            <option value="price_desc">السعر ↓</option>
            <option value="distance">الأقرب</option>
          </select>

          <button type="button" onClick={() => refetch()} className="theme-button-primary w-full py-2 rounded-lg text-sm">
            {isFetching ? "جاري البحث..." : "بحث"}
          </button>

          {hasFeature("savedSearches") && (
            <div className="pt-3 border-t border-white/10 space-y-2">
              <input className={inputClass} placeholder="اسم البحث المحفوظ" value={saveName} onChange={(e) => setSaveName(e.target.value)} />
              <button
                type="button"
                disabled={!saveName || saveSearch.isPending}
                onClick={() =>
                  saveSearch.mutate({
                    name: saveName,
                    entity: tab,
                    filters,
                  })
                }
                className="w-full py-2 rounded-lg text-sm border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <FloppyDisk size={16} />
                حفظ البحث
              </button>
            </div>
          )}
        </div>

        <div className="lg:col-span-3 space-y-4">
          {error && (
            <p className="text-sm text-rose-400">{error.response?.data?.message || "فشل البحث"}</p>
          )}

          {hasFeature("savedSearches") && saved.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {saved.filter((s) => s.entity === tab).map((s) => (
                <div key={s.id} className="flex items-center gap-1 px-3 py-1 rounded-full bg-slate-800 border border-white/10 text-xs">
                  <button type="button" onClick={() => setFilters({ ...EMPTY_FILTERS, ...s.filters })} className="text-emerald-400">
                    {s.name}
                  </button>
                  <button type="button" onClick={() => removeSaved.mutate(s.id)} className="text-slate-500 hover:text-rose-400">
                    <Trash size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="text-sm text-slate-400">
            {results ? `${results.total} نتيجة` : ""}
          </div>

          <div className="space-y-3">
            {(results?.items || []).map((item) => (
              <div key={item.id} className="p-4 rounded-xl border border-white/10 bg-[#111827]/60">
                <div className="flex justify-between gap-3 flex-wrap">
                  <div>
                    <span className="font-mono text-xs text-emerald-400">{item.offerCode || item.requestCode}</span>
                    <p className="text-sm text-slate-200 mt-1">
                      {item.cityRel?.name || item.city} — {item.neighborhoodRel?.name || item.district || "-"}
                    </p>
                  </div>
                  <div className="text-left">
                    <p className="text-emerald-400 font-bold">
                      {Number(item.priceFrom || item.budgetFrom || 0).toLocaleString()} ر.س
                    </p>
                    <p className="text-xs text-slate-400">{item.areaFrom}–{item.areaTo} م²</p>
                  </div>
                </div>
              </div>
            ))}
            {results?.items?.length === 0 && (
              <p className="text-center text-slate-500 py-8">لا توجد نتائج</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
