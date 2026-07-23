import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, PencilSimple, Trash, Eye, EyeSlash, Star, Buildings, MapPin } from "phosphor-react";
import { motion } from "framer-motion";
import PageHeader from "../../../components/common/PageHeader";
import { useProjectsQuery } from "../hooks/useProjectsQuery";
import { useProjectsMutations } from "../hooks/useProjectsMutations";
import { resolveUploadUrl } from "../../../utils/uploads";

const ProjectsListPage = () => {
  const navigate = useNavigate();
  const { data: projects = [], isLoading } = useProjectsQuery();
  const mutations = useProjectsMutations();

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
        actions={[
          {
            key: "add-project",
            label: "إضافة مشروع جديد",
            icon: Plus,
            onClick: () => navigate("/app/website/projects/new"),
            className: "theme-button",
          },
        ]}
      />

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(n => (
            <div key={n} className="h-64 bg-slate-900/50 backdrop-blur-md rounded-3xl border border-white/5 animate-pulse" />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="bg-slate-900/50 backdrop-blur-md rounded-3xl p-12 text-center border border-white/10 shadow-xl">
          <div className="w-20 h-20 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6">
            <Buildings size={40} weight="duotone" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">لا توجد مشاريع مضافة</h3>
          <p className="text-slate-400 mb-6">ابدأ بإضافة أول مشروع لعرضه في الموقع.</p>
          <button 
            onClick={() => navigate("/app/website/projects/new")}
            className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white font-semibold py-3 px-8 rounded-xl shadow-lg transition-all"
          >
            إضافة مشروع الآن
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {projects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`group bg-slate-900/80 backdrop-blur-xl rounded-3xl border transition-all duration-300 overflow-hidden flex flex-col ${
                project.isActive ? "border-white/10 hover:border-emerald-500/30 hover:shadow-2xl hover:shadow-emerald-500/10" : "border-red-500/20 opacity-75"
              }`}
            >
              <div className="relative h-48 bg-slate-800 overflow-hidden">
                {project.coverImageUrl ? (
                  <img src={resolveUploadUrl(project.coverImageUrl)} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-600">
                    <Buildings size={48} weight="duotone" />
                  </div>
                )}
                
                <div className="absolute top-4 right-4 flex gap-2">
                  <span className={`px-3 py-1 text-xs font-bold rounded-full shadow-md ${project.isActive ? "bg-emerald-500 text-white" : "bg-slate-700 text-slate-300"}`}>
                    {project.isActive ? "نشط" : "مخفي"}
                  </span>
                  {project.isFeatured && (
                    <span className="px-3 py-1 text-xs font-bold rounded-full shadow-md bg-amber-500 text-white flex items-center gap-1">
                      <Star size={12} weight="fill" /> مميز
                    </span>
                  )}
                </div>

                <div className="absolute top-4 left-4">
                  <div className="bg-slate-900/80 backdrop-blur-md rounded-xl p-1 shadow-lg border border-white/10 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleToggleStatus(project)}
                      className={`p-2 rounded-lg transition-colors ${project.isActive ? "text-slate-400 hover:text-white hover:bg-white/10" : "text-emerald-400 hover:bg-emerald-500/20"}`}
                      title={project.isActive ? "إيقاف العرض" : "تفعيل العرض"}
                    >
                      {project.isActive ? <EyeSlash size={18} /> : <Eye size={18} />}
                    </button>
                    <button
                      onClick={() => handleToggleFeatured(project)}
                      className={`p-2 rounded-lg transition-colors ${project.isFeatured ? "text-amber-400 hover:bg-amber-500/20" : "text-slate-400 hover:text-amber-400 hover:bg-white/10"}`}
                      title={project.isFeatured ? "إزالة التمييز" : "تمييز المشروع"}
                    >
                      <Star size={18} weight={project.isFeatured ? "fill" : "regular"} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2 line-clamp-1">{project.title}</h3>
                  <div className="flex items-center gap-2 text-slate-400 text-sm mb-4">
                    <MapPin size={16} />
                    <span>{project.city || "مدينة غير محددة"}</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.type && (
                      <span className="text-xs bg-white/5 border border-white/10 text-slate-300 px-3 py-1 rounded-full">
                        {project.type === "RESIDENTIAL" ? "سكني" : project.type === "COMMERCIAL" ? "تجاري" : "أخرى"}
                      </span>
                    )}
                    {project.status && (
                      <span className="text-xs bg-white/5 border border-white/10 text-slate-300 px-3 py-1 rounded-full">
                        {project.status === "UNDER_CONSTRUCTION" ? "تحت الإنشاء" : project.status === "READY" ? "جاهز" : "مباع بالكامل"}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t border-white/10">
                  <button 
                    onClick={() => navigate(`/app/website/projects/${project.id}`)}
                    className="flex-1 flex justify-center items-center gap-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-semibold py-2.5 rounded-xl transition-colors border border-emerald-500/20"
                  >
                    <PencilSimple size={18} /> تعديل
                  </button>
                  <button 
                    onClick={() => handleDelete(project.id)}
                    className="flex-1 flex justify-center items-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-semibold py-2.5 rounded-xl transition-colors border border-red-500/20"
                  >
                    <Trash size={18} /> حذف
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectsListPage;
