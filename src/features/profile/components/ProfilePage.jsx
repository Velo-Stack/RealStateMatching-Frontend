import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Camera,
  CreditCard,
  EnvelopeSimple,
  Medal,
  Trash,
  User,
} from "phosphor-react";
import { useAuth } from "../../../context/AuthContext";
import { useFeatureFlags } from "../../../hooks/useFeatureFlags";
import { ROLES as ROLE_LABELS } from "../../../constants/enums";
import {
  handleAvatarImageError,
  resolveAvatarUrl,
} from "../../../utils/uploads";
import {
  deleteMyAvatarApi,
  updateProfileApi,
  uploadMyAvatarApi,
} from "../services/profileApi";

const inputClasses =
  "w-full rounded-xl border border-white/10 bg-[#111827]/60 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/40";

const ProfilePage = () => {
  const { user, syncSession, profile } = useAuth();
  const { isFeatureEnabled } = useFeatureFlags();
  const [avatarVersion, setAvatarVersion] = useState(null);
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [avatarError, setAvatarError] = useState("");

  const roleLabel =
    ROLE_LABELS[user?.role]?.label || user?.role || "—";

  const applySession = (data) => {
    syncSession(data);
    if (data?.user?.name) setName(data.user.name);
    if (data?.user?.phone !== undefined) setPhone(data.user.phone || "");
  };

  const profileMutation = useMutation({
    mutationFn: updateProfileApi,
    onSuccess: (data) => {
      applySession(data);
      setCurrentPassword("");
      setNewPassword("");
      toast.success("تم تحديث البيانات");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "تعذر تحديث البيانات");
    },
  });

  const avatarUploadMutation = useMutation({
    mutationFn: uploadMyAvatarApi,
    onSuccess: (data) => {
      setAvatarVersion(Date.now());
      applySession(data);
      toast.success("تم تحديث الصورة");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "تعذر رفع الصورة");
    },
  });

  const avatarDeleteMutation = useMutation({
    mutationFn: deleteMyAvatarApi,
    onSuccess: (data) => {
      setAvatarVersion(Date.now());
      applySession(data);
      toast.success("تم حذف الصورة");
    },
    onError: () => toast.error("تعذر حذف الصورة"),
  });

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    const payload = { name: name.trim(), phone: phone.trim() };
    if (newPassword) {
      payload.password = newPassword;
      payload.currentPassword = currentPassword;
    }
    profileMutation.mutate(payload);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    setAvatarError("");
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setAvatarError("الحد الأقصى 2 ميجابايت");
      return;
    }
    avatarUploadMutation.mutate(file);
    e.target.value = "";
  };

  const showPointsLink = isFeatureEnabled("broker_points.enabled");
  const showSubscriptionLink = isFeatureEnabled("subscriptions.enabled");
  const isSaving = profileMutation.isPending;
  const isAvatarPending =
    avatarUploadMutation.isPending || avatarDeleteMutation.isPending;

  return (
    <div className="space-y-6 text-right max-w-3xl">
      <div>
        <div className="flex items-center gap-2 text-white">
          <User size={24} className="text-emerald-400" />
          <h1 className="text-2xl font-bold">الملف الشخصي</h1>
        </div>
        <p className="mt-1 text-sm text-slate-400">
          إدارة بياناتك وصورتك الشخصية
        </p>
      </div>

      <section className="rounded-2xl border border-white/5 bg-[#111827]/60 p-5 space-y-4">
        <h2 className="text-sm font-semibold text-white">الصورة الشخصية</h2>
        <div className="flex flex-wrap items-center gap-4">
          <div className="h-20 w-20 rounded-2xl overflow-hidden border border-white/10 bg-slate-800 shrink-0">
            <img
              src={resolveAvatarUrl(user?.avatarUrl, avatarVersion)}
              alt={user?.name}
              className="h-full w-full object-cover"
              onError={handleAvatarImageError}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs font-medium text-emerald-300 hover:bg-emerald-500/20">
              <Camera size={16} />
              {isAvatarPending ? "جاري الرفع..." : "رفع صورة"}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                disabled={isAvatarPending}
                onChange={handleAvatarChange}
              />
            </label>
            {user?.avatarUrl && (
              <button
                type="button"
                disabled={isAvatarPending}
                onClick={() => avatarDeleteMutation.mutate()}
                className="inline-flex items-center gap-2 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs font-medium text-rose-300 hover:bg-rose-500/20 disabled:opacity-50"
              >
                <Trash size={16} />
                حذف
              </button>
            )}
          </div>
          {avatarError && (
            <p className="w-full text-xs text-rose-400">{avatarError}</p>
          )}
        </div>
      </section>

      <section className="rounded-2xl border border-white/5 bg-[#111827]/60 p-5">
        <h2 className="text-sm font-semibold text-white mb-4">البيانات الأساسية</h2>
        <form onSubmit={handleProfileSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1.5">الاسم</label>
            <input
              className={inputClasses}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1.5">الجوال</label>
            <input
              className={inputClasses}
              value={phone}
              onChange={(e) =>
                setPhone(e.target.value.replace(/[^0-9+]/g, ""))
              }
              placeholder="05xxxxxxxx"
              dir="ltr"
            />
          </div>
          <div className="pt-2 border-t border-white/5 space-y-4">
            <h3 className="text-xs font-medium text-slate-400">تغيير كلمة المرور</h3>
            <div>
              <label className="block text-xs text-slate-400 mb-1.5">
                كلمة المرور الحالية
              </label>
              <input
                type="password"
                className={inputClasses}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                dir="ltr"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1.5">
                كلمة المرور الجديدة
              </label>
              <input
                type="password"
                className={inputClasses}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                dir="ltr"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={isSaving}
            className="theme-button-primary rounded-xl px-5 py-2.5 text-sm font-medium disabled:opacity-50"
          >
            {isSaving ? "جاري الحفظ..." : "حفظ التغييرات"}
          </button>
        </form>
      </section>

      <section className="rounded-2xl border border-white/5 bg-[#111827]/60 p-5 space-y-3">
        <h2 className="text-sm font-semibold text-white">معلومات الحساب</h2>
        <div className="grid gap-3 sm:grid-cols-2 text-sm">
          <div className="rounded-xl bg-white/[0.03] border border-white/5 px-4 py-3">
            <p className="text-xs text-slate-500">الدور</p>
            <p className="text-white mt-1">{roleLabel}</p>
          </div>
          <div className="rounded-xl bg-white/[0.03] border border-white/5 px-4 py-3">
            <p className="text-xs text-slate-500">البريد</p>
            <p className="text-white mt-1 flex items-center gap-1.5" dir="ltr">
              <EnvelopeSimple size={14} className="text-slate-400 shrink-0" />
              {user?.email}
            </p>
          </div>
          {profile?.team?.name && (
            <div className="rounded-xl bg-white/[0.03] border border-white/5 px-4 py-3">
              <p className="text-xs text-slate-500">الفريق</p>
              <p className="text-white mt-1">{profile.team.name}</p>
            </div>
          )}
          {profile?.office?.name && (
            <div className="rounded-xl bg-white/[0.03] border border-white/5 px-4 py-3">
              <p className="text-xs text-slate-500">المكتب</p>
              <p className="text-white mt-1">{profile.office.name}</p>
              {profile.officeRole ? (
                <p className="text-xs text-emerald-400/80 mt-1">
                  {profile.officeRole === "ADMIN" && "مسؤول المكتب"}
                  {profile.officeRole === "MANAGER" && "مدير المكتب"}
                  {profile.officeRole === "BROKER" && "وسيط المكتب"}
                  {!["ADMIN", "MANAGER", "BROKER"].includes(profile.officeRole) && profile.officeRole}
                </p>
              ) : null}
            </div>
          )}
        </div>
      </section>

      {(showPointsLink || showSubscriptionLink) && (
        <section className="grid gap-3 sm:grid-cols-2">
          {showPointsLink && (
            <Link
              to="/app/my-points"
              className="rounded-2xl border border-white/5 bg-[#111827]/60 p-4 hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Medal size={22} className="text-emerald-400" />
                <div>
                  <p className="text-white font-medium text-sm">نقاطي</p>
                  <p className="text-xs text-slate-400 mt-0.5">عرض النقاط والترتيب</p>
                </div>
              </div>
            </Link>
          )}
          {showSubscriptionLink && (
            <Link
              to="/app/subscription"
              className="rounded-2xl border border-white/5 bg-[#111827]/60 p-4 hover:border-cyan-500/30 hover:bg-cyan-500/5 transition-colors"
            >
              <div className="flex items-center gap-3">
                <CreditCard size={22} className="text-cyan-400" />
                <div>
                  <p className="text-white font-medium text-sm">الاشتراك</p>
                  <p className="text-xs text-slate-400 mt-0.5">إدارة خطتك الحالية</p>
                </div>
              </div>
            </Link>
          )}
        </section>
      )}
    </div>
  );
};

export default ProfilePage;
