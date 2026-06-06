import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Medal, Trophy } from "phosphor-react";
import { useAuth } from "../../../context/AuthContext";
import { useFeatureFlags } from "../../../hooks/useFeatureFlags";
import { hasPermission } from "../../../utils/rbac";
import PointsHistory from "./PointsHistory";
import TierProgressCard from "./TierProgressCard";
import { fetchMyPoints, fetchMyTier } from "../services/gamificationApi";

const MyPointsPage = () => {
  const { user } = useAuth();
  const { isFeatureEnabled } = useFeatureFlags();
  const enabled =
    isFeatureEnabled("broker_points.enabled") || isFeatureEnabled("broker_tiers.enabled");
  const canRead = hasPermission(user, "brokers.points.read");

  const { data: tierData, isLoading: tierLoading } = useQuery({
    queryKey: ["my-tier"],
    queryFn: fetchMyTier,
    enabled: enabled && canRead,
  });

  const { data: pointsData, isLoading: pointsLoading } = useQuery({
    queryKey: ["my-points"],
    queryFn: () => fetchMyPoints({ limit: 50 }),
    enabled: enabled && canRead,
  });

  if (!enabled) {
    return (
      <div className="p-6 text-center text-slate-400">
        نظام النقاط غير مفعّل حالياً. تواصل مع المسؤول لتفعيله من إعدادات النظام.
      </div>
    );
  }

  if (!canRead) {
    return (
      <div className="p-6 text-center text-slate-400">
        ليس لديك صلاحية عرض النقاط.
      </div>
    );
  }

  const loading = tierLoading || pointsLoading;

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 text-white">
          <Medal size={24} className="text-amber-400" />
          <h1 className="text-2xl font-bold">نقاطي وترقيتي</h1>
        </div>
        <p className="text-slate-400 text-sm mt-1">
          تتبّع رصيد نقاطك ومسار ترقيتك كوسيط
        </p>
      </div>

      {loading ? (
        <div className="text-slate-400 text-sm">جاري التحميل...</div>
      ) : (
        <>
          {isFeatureEnabled("broker_tiers.enabled") ? (
            <TierProgressCard tierData={tierData} />
          ) : null}

          <div className="bg-[#111827]/60 backdrop-blur-xl rounded-2xl border border-white/5 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Trophy size={20} className="text-emerald-400" />
              <h2 className="text-lg font-semibold text-white">سجل النقاط</h2>
            </div>
            <PointsHistory entries={pointsData?.entries || []} />
          </div>
        </>
      )}
    </div>
  );
};

export default MyPointsPage;
