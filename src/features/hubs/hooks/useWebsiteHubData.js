import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../../context/AuthContext";
import { hasPermission } from "../../../utils/rbac";
import { toTimestamp } from "../../../shared/lib/activityTime";
import { WEBSITE_CMS_QUERY_KEYS } from "../../website-cms/constants/websiteCmsQueryKeys";
import {
  fetchFeaturedOffers,
  fetchHeroSlides,
  fetchWebsiteSections,
  fetchWebsiteSettings,
} from "../../website-cms/services/websiteCmsApi";
import { fetchAdminProjects } from "../../website-cms/services/projectsCmsApi";
import {
  INVESTOR_CMS_KEYS,
} from "../../website-cms/hooks/useInvestorsCmsMutations";
import {
  getInvestorAnnouncementsApi,
  getInvestorEventsApi,
  getInvestorStatsApi,
} from "../../website-cms/services/investorsCmsApi";

const asList = (value) => (Array.isArray(value) ? value : []);

const SETTINGS_FIELDS = [
  "siteName",
  "contactEmail",
  "contactPhone",
  "whatsappNumber",
  "address",
  "logoUrl",
];

export const useWebsiteHubData = () => {
  const { user } = useAuth();
  const canManage = hasPermission(user, "website.manage");

  const { data: projectsRaw = [], isLoading: projectsLoading } = useQuery({
    queryKey: ["admin-projects"],
    queryFn: fetchAdminProjects,
    enabled: canManage,
  });

  const { data: sectionsRaw = [], isLoading: sectionsLoading } = useQuery({
    queryKey: WEBSITE_CMS_QUERY_KEYS.sections,
    queryFn: fetchWebsiteSections,
    enabled: canManage,
  });

  const { data: settings, isLoading: settingsLoading } = useQuery({
    queryKey: WEBSITE_CMS_QUERY_KEYS.settings,
    queryFn: fetchWebsiteSettings,
    enabled: canManage,
  });

  const { data: heroRaw = [], isLoading: heroLoading } = useQuery({
    queryKey: WEBSITE_CMS_QUERY_KEYS.heroSlides,
    queryFn: fetchHeroSlides,
    enabled: canManage,
  });

  const { data: featuredRaw = [], isLoading: featuredLoading } = useQuery({
    queryKey: WEBSITE_CMS_QUERY_KEYS.featuredOffers,
    queryFn: fetchFeaturedOffers,
    enabled: canManage,
  });

  const { data: investorStatsRaw = [], isLoading: investorStatsLoading } =
    useQuery({
      queryKey: INVESTOR_CMS_KEYS.stats(),
      queryFn: getInvestorStatsApi,
      enabled: canManage,
    });

  const { data: eventsRaw = [], isLoading: eventsLoading } = useQuery({
    queryKey: INVESTOR_CMS_KEYS.events(),
    queryFn: getInvestorEventsApi,
    enabled: canManage,
  });

  const { data: announcementsRaw = [], isLoading: announcementsLoading } =
    useQuery({
      queryKey: INVESTOR_CMS_KEYS.announcements(),
      queryFn: getInvestorAnnouncementsApi,
      enabled: canManage,
    });

  const projects = asList(projectsRaw);
  const sections = asList(sectionsRaw);
  const heroSlides = asList(heroRaw);
  const featuredOffers = asList(featuredRaw);
  const investorStats = asList(investorStatsRaw);
  const events = asList(eventsRaw);
  const announcements = asList(announcementsRaw);

  const activeProjects = projects.filter((p) => p.isActive).length;
  const totalInterests = projects.reduce(
    (sum, p) => sum + (p._count?.interests || 0),
    0,
  );
  const activeSections = sections.filter((s) => s.isActive).length;
  const activeHero = heroSlides.filter((s) => s.isActive).length;
  const activeFeatured = featuredOffers.filter((s) => s.isActive).length;

  const settingsFilled = SETTINGS_FIELDS.filter(
    (key) => Boolean(settings?.[key]),
  ).length;
  const settingsPercent = Math.round(
    (settingsFilled / SETTINGS_FIELDS.length) * 100,
  );

  const interestChartData = useMemo(
    () =>
      [...projects]
        .map((p) => ({
          name: (p.title || "مشروع").split(" ").slice(0, 2).join(" "),
          count: Number(p._count?.interests) || 0,
          fullTitle: p.title,
        }))
        .filter((row) => row.count > 0)
        .sort((a, b) => b.count - a.count)
        .slice(0, 8),
    [projects],
  );

  const topInterestProjects = useMemo(
    () =>
      [...projects]
        .filter((p) => (p._count?.interests || 0) > 0)
        .sort(
          (a, b) => (b._count?.interests || 0) - (a._count?.interests || 0),
        )
        .slice(0, 6)
        .map((p) => ({
          id: p.id,
          title: p.title || "مشروع",
          city: p.city || "—",
          interests: p._count?.interests || 0,
          isActive: Boolean(p.isActive),
          updatedAt: p.updatedAt,
        })),
    [projects],
  );

  const recentProjects = useMemo(
    () =>
      [...projects]
        .sort(
          (a, b) =>
            (toTimestamp(b.updatedAt) || toTimestamp(b.createdAt) || 0) -
            (toTimestamp(a.updatedAt) || toTimestamp(a.createdAt) || 0),
        )
        .slice(0, 5)
        .map((p) => ({
          id: p.id,
          title: p.title || "مشروع",
          city: p.city || "—",
          isActive: Boolean(p.isActive),
          updatedAt: p.updatedAt || p.createdAt,
        })),
    [projects],
  );

  const moduleStatuses = [
    {
      key: "home",
      label: "الصفحة الرئيسية",
      detail: `${activeSections} أقسام · ${activeHero} شرائح · ${activeFeatured} مميزة`,
    },
    {
      key: "projects",
      label: "المشاريع",
      detail: `${activeProjects} نشط من ${projects.length}`,
    },
    {
      key: "investors",
      label: "المستثمرون",
      detail: `${investorStats.length} إحصائيات · ${events.length} فعاليات · ${announcements.length} إعلانات`,
    },
    {
      key: "settings",
      label: "الإعدادات",
      detail: `اكتمال ${settingsPercent}%`,
    },
  ];

  const loading =
    canManage &&
    (projectsLoading ||
      sectionsLoading ||
      settingsLoading ||
      heroLoading ||
      featuredLoading ||
      investorStatsLoading ||
      eventsLoading ||
      announcementsLoading);

  return {
    canManage,
    loading,
    projectsCount: canManage ? projects.length : null,
    activeProjects: canManage ? activeProjects : null,
    totalInterests: canManage ? totalInterests : null,
    activeSections: canManage ? activeSections : null,
    settingsPercent: canManage ? settingsPercent : null,
    siteName: settings?.siteName || null,
    interestChartData,
    topInterestProjects,
    recentProjects,
    moduleStatuses,
  };
};
