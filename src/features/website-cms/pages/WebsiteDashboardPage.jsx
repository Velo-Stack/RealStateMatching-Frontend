import { useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Buildings,
  Gear,
  Layout,
  ChartBar,
  Users,
  CaretLeft,
  ChartLineUp,
} from "phosphor-react";
import PageHeader from "../../../components/common/PageHeader";
import { useProjectsQuery } from "../../website-cms/hooks/useProjectsQuery";
import { useWebsiteSettingsQuery } from "../../website-cms/hooks/useWebsiteSettingsQuery";
import { useWebsiteSectionsQuery } from "../../website-cms/hooks/useWebsiteSectionsQuery";

const WebsiteDashboardPage = () => {
  const { data: projects = [], isLoading: loadingProjects } = useProjectsQuery();
  useWebsiteSettingsQuery();
  const { data: sections } = useWebsiteSectionsQuery();

  const stats = useMemo(() => {
    const activeProjects = projects.filter((p) => p.isActive).length;
    const totalInterests = projects.reduce(
      (sum, p) => sum + (p._count?.interests || 0),
      0
    );
    const activeSections = sections?.filter((s) => s.isActive)?.length || 0;

    return [
      {
        label: "المشاريع النشطة",
        value: activeProjects,
        total: projects.length,
        icon: Buildings,
        color: "text-emerald-400",
        bg: "bg-emerald-500/10",
      },
      {
        label: "إجمالي طلبات الاهتمام",
        value: totalInterests,
        icon: Users,
        color: "text-amber-400",
        bg: "bg-amber-500/10",
      },
      {
        label: "أقسام الصفحة المفعلة",
        value: activeSections,
        icon: Layout,
        color: "text-blue-400",
        bg: "bg-blue-500/10",
      },
    ];
  }, [projects, sections]);

  const quickLinks = [
    {
      title: "أقسام الصفحة الرئيسية",
      desc: "إدارة الهيرو، المميزة، والأقسام",
      icon: Layout,
      to: "/app/website/home",
      color: "from-blue-500/20 to-cyan-500/20",
      hover: "hover:border-blue-500/50",
      iconColor: "text-blue-400",
    },
    {
      title: "إدارة المشاريع",
      desc: "إضافة وتعديل المشاريع والوحدات",
      icon: Buildings,
      to: "/app/website/projects",
      color: "from-emerald-500/20 to-teal-500/20",
      hover: "hover:border-emerald-500/50",
      iconColor: "text-emerald-400",
    },
    {
      title: "علاقات المستثمرين",
      desc: "إدارة المحتوى والإحصائيات",
      icon: ChartLineUp,
      to: "/app/website/investors",
      color: "from-purple-500/20 to-fuchsia-500/20",
      hover: "hover:border-purple-500/50",
      iconColor: "text-purple-400",
    },
    {
      title: "الإعدادات العامة",
      desc: "معلومات التواصل وروابط السوشيال",
      icon: Gear,
      to: "/app/website/settings",
      color: "from-slate-500/20 to-gray-500/20",
      hover: "hover:border-slate-500/50",
      iconColor: "text-slate-300",
    },
  ];

  const topInterestProjects = useMemo(() => {
    return [...projects]
      .filter((p) => (p._count?.interests || 0) > 0)
      .sort((a, b) => (b._count?.interests || 0) - (a._count?.interests || 0))
      .slice(0, 5);
  }, [projects]);

  return (
    <div className="space-y-10 pb-12 font-cairo" dir="rtl">
      <PageHeader
        title="لوحة تحكم الموقع"
        subtitle="نظرة عامة وإدارة شاملة لمحتوى الموقع الخارجي"
      />

      {/* Stats — same visual language, one accent color */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="flex items-center gap-4 rounded-2xl border border-white/10 bg-slate-900/50 p-6"
          >
            <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl ${stat.bg} ${stat.color}`}>
              <stat.icon size={24} weight="duotone" />
            </div>
            <div>
              <p className="mb-1 text-sm text-slate-400">{stat.label}</p>
              <p className="flex items-baseline gap-1.5 text-2xl font-bold text-white">
                {stat.value}
                {stat.total !== undefined && (
                  <span className="text-sm font-normal text-slate-500">
                    من {stat.total}
                  </span>
                )}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick links — one consistent card style for all */}
      <div className="space-y-4">
        <h2 className="flex items-center gap-2 text-lg font-bold text-white">
          <Layout size={20} className="text-cyan-400" />
          انتقال سريع
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {quickLinks.map((link, i) => (
            <motion.div
              key={link.to}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
            >
              <Link
                to={link.to}
                className={`group relative flex h-full flex-col gap-4 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br ${link.color} p-5 transition-all duration-300 ${link.hover}`}
              >
                <div className="relative z-10 flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900/50">
                  <link.icon size={22} className={link.iconColor} weight="duotone" />
                </div>

                <div className="relative z-10">
                  <h3 className="mb-1 text-[15px] font-bold text-white">
                    {link.title}
                  </h3>
                  <p className="text-xs leading-relaxed text-slate-400">
                    {link.desc}
                  </p>
                </div>

                <span className="relative z-10 mt-auto flex items-center gap-1.5 text-xs font-medium text-white/80 opacity-0 transition-opacity group-hover:opacity-100">
                  فتح
                  <CaretLeft size={12} />
                </span>

                <div className="pointer-events-none absolute inset-0 bg-white/5 opacity-0 transition-opacity group-hover:opacity-100" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Interest reports — full width, simple list */}
      <div className="space-y-4">
        <h2 className="flex items-center gap-2 text-lg font-bold text-white">
          <ChartBar size={20} className="text-amber-400" />
          تقارير الاهتمام بالمشاريع
        </h2>

        <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-5">
          {loadingProjects ? (
            <div className="animate-pulse space-y-3">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-14 rounded-xl bg-white/5" />
              ))}
            </div>
          ) : topInterestProjects.length > 0 ? (
            <div className="space-y-2">
              {topInterestProjects.map((p) => (
                <Link
                  key={p.id}
                  to={`/app/website/projects/${p.id}?tab=interests`}
                  className="group flex items-center justify-between rounded-xl border border-transparent p-3 transition-colors hover:border-white/10 hover:bg-white/5"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                      <Buildings size={20} weight="duotone" />
                    </div>
                    <div>
                      <h4 className="max-w-[180px] truncate text-sm font-semibold text-white">
                        {p.title}
                      </h4>
                      <p className="text-xs text-slate-400">{p.city}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="rounded-full bg-amber-500/15 px-3 py-1 text-xs font-bold text-amber-400">
                      {p._count.interests} طلب
                    </span>
                    <CaretLeft
                      size={16}
                      className="text-slate-500 transition-colors group-hover:text-white"
                    />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="py-10 text-center text-sm text-slate-400">
              <Users size={40} className="mx-auto mb-3 opacity-20" />
              لا توجد طلبات اهتمام مسجلة بعد
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WebsiteDashboardPage;
