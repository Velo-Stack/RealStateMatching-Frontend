import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Buildings,
  Gear,
  Layout,
  Star,
  ImageSquare,
  ChartBar,
  Users,
  CaretLeft,
  ArrowUpRight
} from "phosphor-react";
import PageHeader from "../../../components/common/PageHeader";
import { useProjectsQuery } from "../../website-cms/hooks/useProjectsQuery";
import { useWebsiteSettingsQuery } from "../../website-cms/hooks/useWebsiteSettingsQuery";
import { useWebsiteSectionsQuery } from "../../website-cms/hooks/useWebsiteSectionsQuery";

const WebsiteDashboardPage = () => {
  const { data: projects = [], isLoading: loadingProjects } = useProjectsQuery();
  const { data: settings } = useWebsiteSettingsQuery();
  const { data: sections } = useWebsiteSectionsQuery();

  const stats = useMemo(() => {
    const activeProjects = projects.filter(p => p.isActive).length;
    const totalInterests = projects.reduce((sum, p) => sum + (p._count?.interests || 0), 0);
    const activeSections = sections?.filter(s => s.isActive)?.length || 0;

    return [
      { label: "المشاريع النشطة", value: activeProjects, total: projects.length, icon: Buildings, color: "text-emerald-400", bg: "bg-emerald-500/10" },
      { label: "إجمالي طلبات الاهتمام", value: totalInterests, icon: Users, color: "text-amber-400", bg: "bg-amber-500/10" },
      { label: "أقسام الصفحة المفعلة", value: activeSections, icon: Layout, color: "text-blue-400", bg: "bg-blue-500/10" }
    ];
  }, [projects, sections]);

  const quickLinks = [
    { title: "إدارة المشاريع", desc: "إضافة وتعديل المشاريع والوحدات", icon: Buildings, to: "/app/website/projects", color: "from-emerald-500/20 to-teal-500/20", hover: "hover:border-emerald-500/50" },
    { title: "الإعدادات العامة", desc: "معلومات التواصل وروابط السوشيال", icon: Gear, to: "/app/website/settings", color: "from-slate-500/20 to-gray-500/20", hover: "hover:border-slate-500/50" },
    { title: "أقسام الصفحة الرئيسية", desc: "إدارة الهيرو، المميزة، والأقسام", icon: Layout, to: "/app/website/home", color: "from-blue-500/20 to-cyan-500/20", hover: "hover:border-blue-500/50" },
  ];

  // Get projects with highest interests
  const topInterestProjects = useMemo(() => {
    return [...projects]
      .filter(p => (p._count?.interests || 0) > 0)
      .sort((a, b) => (b._count?.interests || 0) - (a._count?.interests || 0))
      .slice(0, 5);
  }, [projects]);

  return (
    <div className="space-y-8 pb-12 font-cairo" dir="rtl">
      <PageHeader
        title="لوحة تحكم الموقع"
        subtitle="نظرة عامة وإدارة شاملة لمحتوى الموقع الخارجي"
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex items-center gap-4 shadow-lg"
          >
            <div className={`w-14 h-14 rounded-full flex items-center justify-center ${stat.bg} ${stat.color}`}>
              <stat.icon size={28} weight="duotone" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-400 mb-1">{stat.label}</p>
              <h3 className="text-2xl font-bold text-white flex items-baseline gap-2">
                {stat.value}
                {stat.total !== undefined && (
                  <span className="text-sm font-normal text-slate-500">من {stat.total}</span>
                )}
              </h3>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Links */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Layout size={24} className="text-cyan-400" />
            انتقال سريع
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {quickLinks.map((link, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
              >
                <Link
                  to={link.to}
                  className={`group block p-6 rounded-2xl bg-gradient-to-br ${link.color} border border-white/10 ${link.hover} transition-all duration-300 relative overflow-hidden`}
                >
                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-slate-900/50 rounded-xl">
                      <link.icon size={24} className="text-white" weight="duotone" />
                    </div>
                    <ArrowUpRight size={20} className="text-white/50 group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{link.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{link.desc}</p>
                </div>
                <div className="absolute top-0 left-0 w-full h-full bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              </Link>
              </motion.div>
            ))}
        </div>
      </div>

      {/* Recent Interests Summary */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <ChartBar size={24} className="text-amber-400" />
          تقارير الاهتمام بالمشاريع
        </h2>

        <div className="bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-lg">
          {loadingProjects ? (
            <div className="animate-pulse space-y-4">
              {[1, 2, 3].map(n => (
                <div key={n} className="h-12 bg-white/5 rounded-xl" />
              ))}
            </div>
          ) : topInterestProjects.length > 0 ? (
            <div className="space-y-4">
              {topInterestProjects.map((p) => (
                <Link
                  key={p.id}
                  to={`/app/website/projects/${p.id}?tab=interests`}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/10 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                      <Buildings size={20} weight="duotone" />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold text-sm truncate max-w-[140px]">{p.title}</h4>
                      <p className="text-xs text-slate-400">{p.city}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="bg-amber-500/20 text-amber-400 px-3 py-1 rounded-full text-xs font-bold">
                      {p._count.interests} طلب
                    </span>
                    <CaretLeft size={16} className="text-slate-500 group-hover:text-white transition-colors" />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-400 text-sm">
              <Users size={48} className="mx-auto mb-3 opacity-20" />
              لا توجد طلبات اهتمام مسجلة بعد
            </div>
          )}
        </div>
      </div>
      </div>
    </div>
  );
};

export default WebsiteDashboardPage;
