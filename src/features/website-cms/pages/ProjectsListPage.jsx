import { useNavigate } from "react-router-dom";
import { Plus, PencilSimple, Trash, Eye, EyeSlash, Star, Buildings, MapPin } from "phosphor-react";
import { motion } from "framer-motion";
import PageHeader from "../../../components/common/PageHeader";
import { useProjectsQuery } from "../hooks/useProjectsQuery";
import { useProjectsMutations } from "../hooks/useProjectsMutations";
import { resolveUploadUrl } from "../../../utils/uploads";

const TYPE_LABELS = {
  RESIDENTIAL: "سكني",
  COMMERCIAL: "تجاري",
  MIXED_USE: "متعدد الاستخدام",
  INDUSTRIAL: "صناعي",
  LAND: "أراضي",
};

const STATUS_LABELS = {
  ACTIVE: "متاح",
  SOLD_OUT: "مباع بالكامل",
  COMING_SOON: "قريباً",
  COMPLETED: "مكتمل",
};

const ProjectCard = ({ project, index, onEdit, onDelete, onToggleStatus, onToggleFeatured }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.05 }}
    whileHover={{ y: -4 }}
    className={`group relative flex flex-col overflow-hidden rounded-3xl border bg-[#111827]/70 backdrop-blur-xl transition-all duration-300 ${
      project.isActive
        ? "border-white/10 hover:border-[color:var(--accent)]/40 hover:shadow-2xl hover:shadow-[color:var(--accent-glow)]"
        : "border-red-500/20 opacity-70"
    }`}
  >
    <div className="relative h-48 overflow-hidden bg-slate-800">
      {project.coverImageUrl ? (
        <img
          src={resolveUploadUrl(project.coverImageUrl)}
          alt={project.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-slate-600">
          <Buildings size={44} weight="duotone" />
        </div>
      )}

      {/* Readability gradient for the badges */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/10" />

      <div className="absolute top-3 right-3 flex gap-2">
        <span
          className={`flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-bold shadow-md backdrop-blur-sm ${
            project.isActive ? "bg-emerald-500/90 text-white" : "bg-slate-700/90 text-slate-300"
          }`}
        >
          {project.isActive ? "نشط" : "مخفي"}
        </span>
        {project.isFeatured && (
          <span
            className="flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-bold text-black shadow-md backdrop-blur-sm"
            style={{ background: "var(--gradient-accent)" }}
          >
            <Star size={11} weight="fill" /> مميز
          </span>
        )}
      </div>

      <div className="absolute top-3 left-3">
        <div className="flex flex-col gap-1 rounded-xl border border-white/10 bg-slate-900/80 p-1 opacity-0 shadow-lg backdrop-blur-md transition-opacity group-hover:opacity-100">
          <button
            onClick={() => onToggleStatus(project)}
            className={`rounded-lg p-2 transition-colors ${
              project.isActive
                ? "text-slate-400 hover:bg-white/10 hover:text-white"
                : "text-emerald-400 hover:bg-emerald-500/20"
            }`}
            title={project.isActive ? "إيقاف العرض" : "تفعيل العرض"}
          >
            {project.isActive ? <EyeSlash size={17} /> : <Eye size={17} />}
          </button>
          <button
            onClick={() => onToggleFeatured(project)}
            className={`rounded-lg p-2 transition-colors ${
              project.isFeatured
                ? "text-[color:var(--accent)] hover:bg-[color:var(--accent)]/10"
                : "text-slate-400 hover:bg-white/10 hover:text-[color:var(--accent)]"
            }`}
            title={project.isFeatured ? "إزالة التمييز" : "تمييز المشروع"}
          >
            <Star size={17} weight={project.isFeatured ? "fill" : "regular"} />
          </button>
        </div>
      </div>

      <div className="absolute bottom-3 right-3 left-3">
        <h3 className="truncate text-lg font-bold text-white drop-shadow-md">{project.title}</h3>
        <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-200/90">
          <MapPin size={14} className="text-[color:var(--accent)]" />
          <span>{project.city || "مدينة غير محددة"}</span>
        </div>
      </div>
    </div>

    <div className="flex flex-1 flex-col p-5">
      <div className="flex flex-1 flex-wrap gap-2">
        {project.type && (
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
            {TYPE_LABELS[project.type] || project.type}
          </span>
        )}
        {project.status && (
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
            {STATUS_LABELS[project.status] || project.status}
          </span>
        )}
      </div>

      <div className="mt-4 flex gap-2 border-t border-white/10 pt-4">
        <button
          onClick={() => onEdit(project)}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[color:var(--accent)]/25 bg-[color:var(--accent)]/10 py-2.5 text-sm font-semibold text-[color:var(--accent-light)] transition-colors hover:bg-[color:var(--accent)]/20"
        >
          <PencilSimple size={17} /> تعديل
        </button>
        <button
          onClick={() => onDelete(project.id)}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 py-2.5 text-sm font-semibold text-red-400 transition-colors hover:bg-red-500/20"
        >
          <Trash size={17} /> حذف
        </button>
      </div>
    </div>
  </motion.div>
);

const AddProjectGhostCard = ({ onClick, delay }) => (
  <motion.button
    type="button"
    onClick={onClick}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    whileHover={{ y: -4 }}
    className="group flex min-h-[280px] flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed border-white/10 bg-white/[0.02] p-8 text-center transition-all duration-300 hover:border-[color:var(--accent)]/40 hover:bg-[color:var(--accent)]/5"
  >
    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/5 text-slate-500 transition-colors group-hover:bg-[color:var(--accent)]/15 group-hover:text-[color:var(--accent)]">
      <Plus size={26} weight="bold" />
    </div>
    <div>
      <p className="text-sm font-bold text-slate-300 transition-colors group-hover:text-white">
        إضافة مشروع جديد
      </p>
      <p className="mt-1 text-xs text-slate-500">أضف مشروعاً آخر ليظهر هنا</p>
    </div>
  </motion.button>
);

const ProjectsListPage = () => {
  const navigate = useNavigate();
  const { data: projects = [], isLoading } = useProjectsQuery();
  const mutations = useProjectsMutations();

  const goToNew = () => navigate("/app/website/projects/new");
  const goToEdit = (project) => navigate(`/app/website/projects/${project.id}`);

  const handleToggleStatus = (project) => {
    mutations.patchProjectStatus.mutate({
      id: project.id,
      payload: { isActive: !project.isActive },
    });
  };

  const handleToggleFeatured = (project) => {
    mutations.patchProjectStatus.mutate({
      id: project.id,
      payload: { isFeatured: !project.isFeatured },
    });
  };

  const handleDelete = (id) => {
    if (confirm("هل أنت متأكد من حذف هذا المشروع؟ سيتم حذف جميع الوحدات والصور المرتبطة به ولا يمكن التراجع عن هذا الإجراء.")) {
      mutations.deleteProject.mutate(id);
    }
  };

  return (
    <div className="space-y-6 pb-12 font-cairo" dir="rtl">
      <PageHeader
        title="إدارة المشاريع"
        subtitle="أضف وعدّل مشاريع الشركة العقارية ووحداتها"
      />

      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-72 animate-pulse rounded-3xl border border-white/5 bg-slate-900/50 backdrop-blur-md" />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="rounded-3xl border border-white/10 bg-slate-900/50 p-12 text-center shadow-xl backdrop-blur-md">
          <div
            className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full"
            style={{ background: "var(--accent-glow)", color: "var(--accent)" }}
          >
            <Buildings size={40} weight="duotone" />
          </div>
          <h3 className="mb-2 text-xl font-bold text-white">لا توجد مشاريع مضافة</h3>
          <p className="mb-6 text-slate-400">ابدأ بإضافة أول مشروع لعرضه في الموقع.</p>
          <button
            onClick={goToNew}
            className="theme-button-primary inline-flex items-center gap-2 rounded-xl px-8 py-3 text-sm font-semibold shadow-lg transition-all"
          >
            <Plus size={18} weight="bold" />
            إضافة مشروع الآن
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project, i) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={i}
              onEdit={goToEdit}
              onDelete={handleDelete}
              onToggleStatus={handleToggleStatus}
              onToggleFeatured={handleToggleFeatured}
            />
          ))}
          <AddProjectGhostCard onClick={goToNew} delay={projects.length * 0.05} />
        </div>
      )}
    </div>
  );
};

export default ProjectsListPage;
