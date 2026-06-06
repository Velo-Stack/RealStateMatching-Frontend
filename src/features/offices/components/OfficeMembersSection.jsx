import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { OFFICE_ROLE_LABELS, PLATFORM_ROLE_LABELS } from "../../../utils/rbac";
import { updateOfficeMemberRoleApi, fetchOfficeMemberCandidates } from "../services/officesApi";

const OfficeMembersSection = ({ office, canManage, onAdd, onRemove }) => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");
  const [role, setRole] = useState("BROKER");

  const { data: users = [] } = useQuery({
    queryKey: ["office-member-candidates", office.id, search],
    queryFn: () => fetchOfficeMemberCandidates(office.id, search.trim()),
    enabled: canManage && search.trim().length >= 2,
  });

  const memberIds = useMemo(
    () => new Set((office.members || []).map((member) => member.userId)),
    [office.members],
  );

  const candidates = useMemo(() => {
    return users
      .filter((user) => !memberIds.has(user.id))
      .slice(0, 8);
  }, [users, memberIds]);

  const handleAdd = () => {
    const userId = Number.parseInt(selectedUserId, 10);
    if (!Number.isInteger(userId) || userId <= 0) return;
    onAdd({ officeId: office.id, userId, role });
    setSearch("");
    setSelectedUserId("");
    setRole("BROKER");
  };

  const updateRole = useMutation({
    mutationFn: updateOfficeMemberRoleApi,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["offices"] }),
  });

  const handleRoleChange = (member, nextRole) => {
    if (member.role === nextRole || updateRole.isPending) return;
    updateRole.mutate({
      officeId: office.id,
      userId: member.userId,
      role: nextRole,
    });
  };

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-white">أعضاء المكتب ({office.members?.length || 0})</h4>
      <div className="space-y-2">
        {(office.members || []).map((member) => (
          <div key={member.id} className="flex items-center justify-between rounded-xl border border-white/5 px-3 py-2 gap-3">
            <div className="min-w-0">
              <p className="text-sm text-white truncate">{member.user?.name}</p>
              <p className="text-xs text-slate-500 truncate">{member.user?.email}</p>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                {canManage ? (
                  <select
                    value={member.role}
                    onChange={(e) => handleRoleChange(member, e.target.value)}
                    className="text-xs rounded-lg border border-white/10 bg-slate-900 px-2 py-1 text-emerald-300"
                  >
                    {Object.entries(OFFICE_ROLE_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                ) : (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300">
                    {OFFICE_ROLE_LABELS[member.role] || member.role}
                  </span>
                )}
                {member.user?.role ? (
                  <span className="text-xs text-slate-500">
                    دور المنصة: {PLATFORM_ROLE_LABELS[member.user.role] || member.user.role}
                  </span>
                ) : null}
              </div>
            </div>
            {canManage ? (
              <button
                type="button"
                onClick={() => onRemove({ officeId: office.id, userId: member.userId })}
                className="text-xs text-rose-400 hover:text-rose-300 shrink-0"
              >
                إزالة
              </button>
            ) : null}
          </div>
        ))}
      </div>
      {canManage ? (
        <div className="space-y-2 rounded-xl border border-white/10 bg-white/[0.02] p-3">
          <input
            type="search"
            placeholder="ابحث بالاسم أو البريد أو الجوال"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setSelectedUserId("");
            }}
            className="w-full rounded-xl border border-white/10 bg-[#111827]/60 px-3 py-2 text-sm text-white"
          />
          {search.trim().length >= 2 ? (
            <div className="max-h-40 overflow-y-auto space-y-1">
              {candidates.length === 0 ? (
                <p className="text-xs text-slate-500 px-1">لا توجد نتائج</p>
              ) : (
                candidates.map((user) => (
                  <button
                    key={user.id}
                    type="button"
                    onClick={() => {
                      setSelectedUserId(String(user.id));
                      setSearch(`${user.name} (${user.email})`);
                    }}
                    className={`w-full text-right rounded-lg px-3 py-2 text-xs transition-colors ${
                      selectedUserId === String(user.id)
                        ? "bg-emerald-500/15 text-emerald-300"
                        : "hover:bg-white/5 text-slate-300"
                    }`}
                  >
                    {user.name} · {user.email}
                  </button>
                ))
              )}
            </div>
          ) : null}
          <div className="flex flex-col sm:flex-row gap-2">
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="rounded-xl border border-white/10 bg-[#111827]/60 px-3 py-2 text-sm text-white"
            >
              {Object.entries(OFFICE_ROLE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
            <button
              type="button"
              onClick={handleAdd}
              disabled={!selectedUserId}
              className="theme-button-primary rounded-xl px-4 py-2 text-sm disabled:opacity-50"
            >
              إضافة عضو
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default OfficeMembersSection;
