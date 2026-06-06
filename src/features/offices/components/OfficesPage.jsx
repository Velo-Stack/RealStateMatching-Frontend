import { useState } from "react";
import { Buildings, Plus, Question } from "phosphor-react";
import { useAuth } from "../../../context/AuthContext";
import { useFeatureFlags } from "../../../hooks/useFeatureFlags";
import {
  canCreateOfficeGlobally,
  canDeleteOfficeGlobally,
  canManageOfficeMembersFor,
  canUpdateOfficeFor,
  hasPermission,
  OFFICE_ROLE_LABELS,
  PLATFORM_ROLE_LABELS,
} from "../../../utils/rbac";
import { UI_LABELS_AR } from "../../../constants/uiLabels.ar";
import Modal from "../../../components/Modal";
import OfficeFormModal from "./OfficeFormModal";
import OfficeMembersSection from "./OfficeMembersSection";
import DistributionRulesPanel from "./DistributionRulesPanel";
import { useOfficesPage } from "../hooks/useOfficesPage";

const EMPTY_OFFICE = {
  name: "",
  nameEn: "",
  licenseNumber: "",
  cityId: "",
  address: "",
  phone: "",
  email: "",
  managerUserId: "",
  teamId: "",
  isActive: true,
};

const OfficesPage = () => {
  const { user, profile } = useAuth();
  const { isFeatureEnabled } = useFeatureFlags();
  const enabled = isFeatureEnabled("offices.enabled");
  const canCreate = canCreateOfficeGlobally(user);
  const canManageDistribution = hasPermission(user, "distribution.manage");
  const distributionEnabled = isFeatureEnabled("request_distribution.enabled");
  const isPlatformAdmin = user?.role === "ADMIN";

  const [tab, setTab] = useState("offices");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingOffice, setEditingOffice] = useState(null);
  const [expandedOfficeId, setExpandedOfficeId] = useState(null);
  const [form, setForm] = useState(EMPTY_OFFICE);
  const [showHelp, setShowHelp] = useState(false);

  const { offices, isLoading, createOffice, updateOffice, deactivateOffice, addMember, removeMember } =
    useOfficesPage(enabled);

  if (!enabled) {
    return (
      <div className="p-6 text-center text-slate-400">
        إدارة المكاتب غير مفعّلة. فعّلها من إعدادات النظام.
      </div>
    );
  }

  const openCreate = () => {
    setEditingOffice(null);
    setForm(EMPTY_OFFICE);
    setModalOpen(true);
  };

  const openEdit = (office) => {
    setEditingOffice(office);
    setForm({
      name: office.name || "",
      nameEn: office.nameEn || "",
      licenseNumber: office.licenseNumber || "",
      cityId: office.cityId || "",
      address: office.address || "",
      phone: office.phone || "",
      email: office.email || "",
      managerUserId: office.managerUserId || "",
      teamId: office.teamId || "",
      isActive: office.isActive !== false,
    });
    setModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      cityId: form.cityId ? Number(form.cityId) : null,
      managerUserId: form.managerUserId ? Number(form.managerUserId) : null,
      teamId: form.teamId ? Number(form.teamId) : null,
    };
    if (editingOffice) {
      updateOffice.mutate({ id: editingOffice.id, payload }, { onSuccess: () => setModalOpen(false) });
    } else {
      createOffice.mutate(payload, { onSuccess: () => setModalOpen(false) });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-white">
            <Buildings size={24} className="text-emerald-400" />
            <h1 className="text-2xl font-bold">المكاتب العقارية</h1>
            <button
              type="button"
              onClick={() => setShowHelp((value) => !value)}
              className="rounded-full p-1 text-slate-400 hover:text-emerald-400"
              title="ما الفرق بين المكتب والفريق؟"
            >
              <Question size={18} />
            </button>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            {isPlatformAdmin
              ? "إدارة جميع المكاتب الشريكة والفرق المرتبطة"
              : "عرض وإدارة المكاتب المرتبطة بك"}
          </p>
          {profile?.officeRole ? (
            <p className="text-emerald-400/80 text-xs mt-1">
              دورك في المكتب: {OFFICE_ROLE_LABELS[profile.officeRole] || profile.officeRole}
              {" · "}
              دور المنصة: {PLATFORM_ROLE_LABELS[user?.role] || user?.role}
            </p>
          ) : null}
        </div>
        {canCreate && tab === "offices" ? (
          <button type="button" onClick={openCreate} className="theme-button-primary inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold">
            <Plus size={16} />
            مكتب جديد
          </button>
        ) : null}
      </div>

      {showHelp ? (
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-sm text-slate-300">
          <p className="font-semibold text-emerald-300 mb-2">{UI_LABELS_AR.officeVsTeamTitle}</p>
          <p>{UI_LABELS_AR.officeVsTeamHelp}</p>
        </div>
      ) : null}

      {canManageDistribution && distributionEnabled ? (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setTab("offices")}
            className={`rounded-xl px-4 py-2 text-sm ${tab === "offices" ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30" : "bg-white/5 text-slate-400 border border-white/10"}`}
          >
            المكاتب
          </button>
          <button
            type="button"
            onClick={() => setTab("distribution")}
            className={`rounded-xl px-4 py-2 text-sm ${tab === "distribution" ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30" : "bg-white/5 text-slate-400 border border-white/10"}`}
          >
            قواعد التوزيع
          </button>
        </div>
      ) : null}

      {tab === "distribution" ? (
        <DistributionRulesPanel enabled={distributionEnabled && canManageDistribution} />
      ) : isLoading ? (
        <div className="text-slate-400 text-sm">جاري التحميل...</div>
      ) : offices.length === 0 ? (
        <div className="bg-[#111827]/60 rounded-2xl border border-white/5 p-8 text-center text-slate-500">
          لا توجد مكاتب مسجلة بعد
        </div>
      ) : (
        <div className="space-y-4">
          {offices.map((office) => {
            const canUpdate = canUpdateOfficeFor(user, profile, office.id);
            const canManageMembers = canManageOfficeMembersFor(user, profile, office.id);

            return (
              <div key={office.id} className="bg-[#111827]/60 rounded-2xl border border-white/5 overflow-hidden">
                <div className="p-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-white font-semibold">{office.name}</h3>
                      {!office.isActive ? (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400">موقوف</span>
                      ) : null}
                    </div>
                    <p className="text-slate-400 text-sm mt-1">
                      {office.city?.name || "—"} · {office.licenseNumber || "بدون ترخيص"}
                    </p>
                    {office.manager ? (
                      <p className="text-slate-500 text-xs mt-1">المدير: {office.manager.name}</p>
                    ) : null}
                  </div>
                  <div className="flex gap-2">
                    {canUpdate ? (
                      <button type="button" onClick={() => openEdit(office)} className="rounded-lg px-3 py-1.5 text-xs bg-white/5 text-slate-300 hover:bg-white/10">
                        تعديل
                      </button>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => setExpandedOfficeId(expandedOfficeId === office.id ? null : office.id)}
                      className="rounded-lg px-3 py-1.5 text-xs bg-emerald-500/10 text-emerald-400"
                    >
                      {expandedOfficeId === office.id ? "إخفاء الأعضاء" : "الأعضاء"}
                    </button>
                    {canDeleteOfficeGlobally(user) && office.isActive ? (
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm(`إيقاف المكتب "${office.name}"؟`)) {
                            deactivateOffice.mutate(office.id);
                          }
                        }}
                        className="rounded-lg px-3 py-1.5 text-xs bg-rose-500/10 text-rose-400"
                      >
                        إيقاف
                      </button>
                    ) : null}
                  </div>
                </div>
                {expandedOfficeId === office.id ? (
                  <div className="border-t border-white/5 p-5">
                    <OfficeMembersSection
                      office={office}
                      canManage={canManageMembers}
                      onAdd={(payload) => addMember.mutate(payload)}
                      onRemove={(payload) => removeMember.mutate(payload)}
                    />
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      )}

      <OfficeFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        form={form}
        setForm={setForm}
        onSubmit={handleSubmit}
        isEditing={!!editingOffice}
        isPending={createOffice.isPending || updateOffice.isPending}
      />
    </div>
  );
};

export default OfficesPage;
