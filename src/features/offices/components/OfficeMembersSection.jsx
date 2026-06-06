import { useState } from "react";
import { OFFICE_ROLE_LABELS, PLATFORM_ROLE_LABELS } from "../../../utils/rbac";

const OfficeMembersSection = ({ office, canManage, onAdd, onRemove }) => {
  const [userId, setUserId] = useState("");
  const [role, setRole] = useState("BROKER");

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-white">أعضاء المكتب ({office.members?.length || 0})</h4>
      <div className="space-y-2">
        {(office.members || []).map((member) => (
          <div key={member.id} className="flex items-center justify-between rounded-xl border border-white/5 px-3 py-2">
            <div>
              <p className="text-sm text-white">{member.user?.name}</p>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300">
                  {OFFICE_ROLE_LABELS[member.role] || member.role}
                </span>
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
                className="text-xs text-rose-400 hover:text-rose-300"
              >
                إزالة
              </button>
            ) : null}
          </div>
        ))}
      </div>
      {canManage ? (
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="number"
            dir="ltr"
            placeholder="معرف المستخدم"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="flex-1 rounded-xl border border-white/10 bg-[#111827]/60 px-3 py-2 text-sm text-white"
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="rounded-xl border border-white/10 bg-[#111827]/60 px-3 py-2 text-sm text-white"
          >
            <option value="BROKER">{OFFICE_ROLE_LABELS.BROKER}</option>
            <option value="MANAGER">{OFFICE_ROLE_LABELS.MANAGER}</option>
            <option value="ADMIN">{OFFICE_ROLE_LABELS.ADMIN}</option>
          </select>
          <button
            type="button"
            disabled={!userId}
            onClick={() => {
              onAdd({ officeId: office.id, userId: Number(userId), role });
              setUserId("");
            }}
            className="rounded-xl bg-emerald-600 px-4 py-2 text-sm text-white disabled:opacity-50"
          >
            إضافة
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default OfficeMembersSection;
