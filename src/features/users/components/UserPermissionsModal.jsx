import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import Modal from "../../../components/Modal";
import { useAuth } from "../../../context/AuthContext";
import { USERS_QUERY_KEYS } from "../../../shared/query/queryKeys";
import {
  fetchUserPermissionsApi,
  updateUserPermissionsApi,
} from "../services/usersApi";
import {
  inputClasses,
  labelClasses,
  permissionModeOptions,
} from "../constants/usersConstants";
import PermissionSelector from "./PermissionSelector";

const toPermissionInput = (permissions = []) =>
  permissions.map((permission) => ({
    key: permission.key,
    scope: permission.scope || null,
  }));

const UserPermissionsModal = ({
  isOpen,
  onClose,
  user,
  permissionsCatalog,
  queryClient,
}) => {
  const { user: currentUser, refreshSession } = useAuth();
  const [permissionMode, setPermissionMode] = useState("ROLE_DEFAULT");
  const [selectedPermissions, setSelectedPermissions] = useState([]);

  const { data, isLoading } = useQuery({
    queryKey: USERS_QUERY_KEYS.userPermissions(user?.id),
    queryFn: () => fetchUserPermissionsApi(user.id),
    enabled: isOpen && Boolean(user?.id),
  });

  useEffect(() => {
    if (!data?.user) return;
    setPermissionMode(data.user.permissionMode || "ROLE_DEFAULT");
    setSelectedPermissions(toPermissionInput(data.customPermissions || data.effectivePermissions || []));
  }, [data]);

  const effectiveKeys = useMemo(
    () => new Set((data?.effectivePermissions || []).map((permission) => permission.key)),
    [data],
  );

  const mutation = useMutation({
    mutationFn: updateUserPermissionsApi,
    onSuccess: async () => {
      toast.success("تم تحديث صلاحيات المستخدم");
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEYS.list });
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEYS.userPermissions(user?.id) });
      if (currentUser?.id === user?.id) {
        await refreshSession();
      }
      onClose();
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "تعذر تحديث صلاحيات المستخدم");
    },
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    mutation.mutate({
      id: user.id,
      payload: {
        permissionMode,
        permissions: permissionMode === "CUSTOM" ? selectedPermissions : [],
      },
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="إدارة صلاحيات المستخدم" maxWidthClass="max-w-4xl">
      <form onSubmit={handleSubmit} className="space-y-5 text-right">
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <p className="text-sm font-bold text-white">{user?.name}</p>
          <p className="text-xs text-slate-400">{user?.email}</p>
        </div>

        <div>
          <label className={labelClasses}>نمط الصلاحيات</label>
          <select
            className={inputClasses}
            value={permissionMode}
            onChange={(event) => setPermissionMode(event.target.value)}
            disabled={isLoading || mutation.isPending}
          >
            {permissionModeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {permissionMode === "ROLE_DEFAULT" && (
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-xs text-emerald-100">
            سيستخدم هذا المستخدم صلاحيات الدور الافتراضية. عدد الصلاحيات الفعالة: {effectiveKeys.size}
          </div>
        )}

        {permissionMode === "CUSTOM_EMPTY" && (
          <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-4 text-xs text-amber-100">
            سيتمكن المستخدم من تسجيل الدخول فقط بدون أي صفحات داخل النظام.
          </div>
        )}

        {permissionMode === "CUSTOM" && (
          <PermissionSelector
            permissions={permissionsCatalog}
            value={selectedPermissions}
            onChange={setSelectedPermissions}
            disabled={isLoading || mutation.isPending}
          />
        )}

        <button
          type="submit"
          disabled={isLoading || mutation.isPending || (permissionMode === "CUSTOM" && !selectedPermissions.length)}
          className="theme-button-primary w-full rounded-xl py-3 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-60"
        >
          {mutation.isPending ? "جاري الحفظ..." : "حفظ الصلاحيات"}
        </button>
      </form>
    </Modal>
  );
};

export default UserPermissionsModal;
