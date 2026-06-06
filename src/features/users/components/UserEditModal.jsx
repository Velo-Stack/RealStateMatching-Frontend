import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import Modal from "../../../components/Modal";
import { useFeatureFlags } from "../../../hooks/useFeatureFlags";
import { hasPermission } from "../../../utils/rbac";
import UserFormFields from "./UserFormFields";
import UserPermissionsTab from "./UserPermissionsTab";
import UserPointsTab from "./UserPointsTab";

const TABS = [
  { id: "data", label: "البيانات" },
  { id: "permissions", label: "الصلاحيات" },
  { id: "points", label: "النقاط" },
];

const UserEditModal = ({
  isOpen,
  onClose,
  user,
  initialTab = "data",
  formData,
  handleChange,
  handleSubmit,
  isPending,
  isUserDetailsLoading,
  permissionsCatalog,
  canManageCustomPermissions,
  onAvatarUpload,
  onAvatarDelete,
  isAvatarPending,
  avatarCacheKey,
  queryClient,
  currentUser,
}) => {
  const { isFeatureEnabled } = useFeatureFlags();
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab, user?.id]);

  const showPermissionsTab = canManageCustomPermissions;
  const showPointsTab =
    isFeatureEnabled("broker_points.enabled") &&
    hasPermission(currentUser, "brokers.gamification.manage") &&
    user?.role === "BROKER";

  const visibleTabs = useMemo(
    () =>
      TABS.filter((tab) => {
        if (tab.id === "permissions") return showPermissionsTab;
        if (tab.id === "points") return showPointsTab;
        return true;
      }),
    [showPermissionsTab, showPointsTab],
  );

  if (!user) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`تعديل المستخدم — ${user.name}`}
      maxWidthClass="max-w-4xl"
    >
      <div className="space-y-5 text-right">
        <div className="flex flex-wrap gap-2 border-b border-white/5 pb-3">
          {visibleTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                  : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "data" && (
          <form onSubmit={handleSubmit} className="space-y-5">
            <UserFormFields
              isEditMode
              formData={formData}
              handleChange={handleChange}
              isUserDetailsLoading={isUserDetailsLoading}
              permissionsCatalog={permissionsCatalog}
              canManageCustomPermissions={canManageCustomPermissions}
              onAvatarUpload={onAvatarUpload}
              onAvatarDelete={onAvatarDelete}
              isAvatarPending={isAvatarPending}
              avatarCacheKey={avatarCacheKey}
              showPermissionsSection={false}
            />
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={isPending || isUserDetailsLoading}
              className="theme-button-primary w-full rounded-xl text-sm font-bold py-3.5 disabled:opacity-60"
            >
              {isPending ? "جاري الحفظ..." : "حفظ البيانات"}
            </motion.button>
          </form>
        )}

        {activeTab === "permissions" && showPermissionsTab && (
          <UserPermissionsTab
            user={user}
            permissionsCatalog={permissionsCatalog}
            queryClient={queryClient}
          />
        )}

        {activeTab === "points" && showPointsTab && <UserPointsTab user={user} />}
      </div>
    </Modal>
  );
};

export default UserEditModal;
