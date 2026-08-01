import { useMemo } from "react";
import {
  getPermissionLabel,
  getPermissionResourceLabel,
  permissionScopeOptions,
} from "../constants/usersConstants";

const groupPermissions = (permissions) =>
  permissions.reduce((groups, permission) => {
    const resource = permission.resource || permission.key.split(".")[0];
    if (!groups[resource]) groups[resource] = [];
    groups[resource].push(permission);
    return groups;
  }, {});

const PermissionSelector = ({
  permissions = [],
  value = [],
  onChange,
  disabled = false,
}) => {
  const selectedMap = useMemo(
    () => new Map(value.map((item) => [item.key, item.scope || ""])),
    [value],
  );
  const grouped = useMemo(() => groupPermissions(permissions), [permissions]);

  const togglePermission = (permissionKey) => {
    if (disabled) return;
    if (selectedMap.has(permissionKey)) {
      onChange(value.filter((item) => item.key !== permissionKey));
      return;
    }
    onChange([...value, { key: permissionKey, scope: "" }]);
  };

  const updateScope = (permissionKey, scope) => {
    if (disabled) return;
    onChange(
      value.map((item) =>
        item.key === permissionKey ? { ...item, scope: scope || null } : item,
      ),
    );
  };

  if (!permissions.length) {
    return (
      <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-slate-400">
        لا توجد صلاحيات متاحة للعرض.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {Object.entries(grouped).map(([resource, items]) => (
        <div key={resource} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h4 className="text-sm font-bold text-white">
              {getPermissionResourceLabel(resource)}
            </h4>
            <span className="text-xs text-slate-500">{items.length} صلاحية</span>
          </div>
          <div className="grid gap-2">
            {items.map((permission) => {
              const isSelected = selectedMap.has(permission.key);
              return (
                <div
                  key={permission.key}
                  className="grid gap-2 rounded-lg border border-white/5 bg-black/10 p-3 sm:grid-cols-[1fr_150px]"
                >
                  <label className="flex cursor-pointer items-center gap-3 text-sm text-slate-200">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      disabled={disabled}
                      onChange={() => togglePermission(permission.key)}
                      className="h-4 w-4 accent-emerald-500"
                    />
                    <span>{getPermissionLabel(permission.key)}</span>
                  </label>
                  <select
                    value={selectedMap.get(permission.key) || ""}
                    disabled={!isSelected || disabled}
                    onChange={(event) => updateScope(permission.key, event.target.value)}
                    className="rounded-lg border border-white/10 bg-[#0f172a] px-3 py-2 text-xs text-white outline-none disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {permissionScopeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PermissionSelector;
