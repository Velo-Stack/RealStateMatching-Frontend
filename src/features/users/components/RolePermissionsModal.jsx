import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import Modal from "../../../components/Modal";
import { ROLE_OPTIONS } from "../../../constants/enums";
import { USERS_QUERY_KEYS } from "../../../shared/query/queryKeys";
import {
  fetchRolePermissionsApi,
  updateRolePermissionsApi,
} from "../services/usersApi";
import { inputClasses, labelClasses } from "../constants/usersConstants";
import PermissionSelector from "./PermissionSelector";

const toPermissionInput = (permissions = []) =>
  permissions.map((permission) => ({
    key: permission.key,
    scope: permission.scope || null,
  }));

const RolePermissionsModal = ({
  isOpen,
  onClose,
  permissionsCatalog,
  queryClient,
}) => {
  const [role, setRole] = useState("BROKER");
  const [selectedPermissions, setSelectedPermissions] = useState([]);

  const { data, isLoading } = useQuery({
    queryKey: USERS_QUERY_KEYS.rolePermissions(role),
    queryFn: () => fetchRolePermissionsApi(role),
    enabled: isOpen && Boolean(role),
  });

  useEffect(() => {
    setSelectedPermissions(toPermissionInput(data?.permissions || []));
  }, [data]);

  const mutation = useMutation({
    mutationFn: updateRolePermissionsApi,
    onSuccess: () => {
      toast.success("تم تحديث صلاحيات الدور");
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEYS.rolePermissions(role) });
      onClose();
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "تعذر تحديث صلاحيات الدور");
    },
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    mutation.mutate({
      role,
      payload: { permissions: selectedPermissions },
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="صلاحيات الأدوار الافتراضية" maxWidthClass="max-w-4xl">
      <form onSubmit={handleSubmit} className="space-y-5 text-right">
        <div>
          <label className={labelClasses}>الدور</label>
          <select
            className={inputClasses}
            value={role}
            onChange={(event) => setRole(event.target.value)}
            disabled={isLoading || mutation.isPending}
          >
            {ROLE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-xs text-slate-300">
          أي مستخدم على وضع صلاحيات الدور الافتراضية سيتبع هذه القائمة تلقائيا.
        </div>

        <PermissionSelector
          permissions={permissionsCatalog}
          value={selectedPermissions}
          onChange={setSelectedPermissions}
          disabled={isLoading || mutation.isPending}
        />

        <button
          type="submit"
          disabled={isLoading || mutation.isPending}
          className="theme-button-primary w-full rounded-xl py-3 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-60"
        >
          {mutation.isPending ? "جاري الحفظ..." : "حفظ صلاحيات الدور"}
        </button>
      </form>
    </Modal>
  );
};

export default RolePermissionsModal;
