import { hasRole, ROLES } from "../../utils/rbac";
import { SIDEBAR_NAV_ITEMS, SIDEBAR_VISIBILITY } from "./sidebarNavConfig";

const SIDEBAR_PAGE_ALIASES = {
  offers: ["offers", "offers.create", "offers.edit"],
  requests: ["requests", "requests.create"],
};

const passesFeatureFlag = (item, isFeatureEnabled) => {
  if (!item.requiredFlag) return true;
  if (typeof isFeatureEnabled !== "function") return true;
  return isFeatureEnabled(item.requiredFlag);
};

export const getSidebarAccess = (user, profile) => {
  const isAdmin = hasRole(user, [ROLES.ADMIN]);
  const isManager = hasRole(user, [ROLES.MANAGER]);
  const isEmployee = hasRole(user, [ROLES.EMPLOYEE]);
  const isBroker = hasRole(user, [ROLES.BROKER]);
  const isDataEntry = hasRole(user, [ROLES.DATA_ENTRY_ONLY]);
  const hasOfficeMembership = Array.isArray(profile?.offices) && profile.offices.length > 0;

  return {
    isAdmin,
    isManager,
    isEmployee,
    isBroker,
    isDataEntry,
    hasOfficeMembership,
    canSeeAudit: isAdmin,
    canSeeReports: isAdmin,
  };
};

const isItemVisible = (visibility, access) => {
  switch (visibility) {
    case SIDEBAR_VISIBILITY.ALWAYS:
      return true;
    case SIDEBAR_VISIBILITY.ADMIN:
      return access.isAdmin;
    case SIDEBAR_VISIBILITY.ADMIN_MANAGER_EMPLOYEE:
      return access.isAdmin || access.isManager || access.isEmployee;
    case SIDEBAR_VISIBILITY.ADMIN_MANAGER_EMPLOYEE_BROKER:
      return access.isAdmin || access.isManager || access.isEmployee || access.isBroker;
    case SIDEBAR_VISIBILITY.ADMIN_MANAGER_EMPLOYEE_BROKER_DATA_ENTRY:
      return (
        access.isAdmin ||
        access.isManager ||
        access.isEmployee ||
        access.isBroker ||
        access.isDataEntry
      );
    case SIDEBAR_VISIBILITY.ADMIN_MANAGER_DATA_ENTRY:
      return access.isAdmin || access.isManager || access.isDataEntry;
    case SIDEBAR_VISIBILITY.ADMIN_BROKER:
      return access.isAdmin || access.isBroker;
    case SIDEBAR_VISIBILITY.ADMIN_MANAGER_BROKER:
      return access.isAdmin || access.isManager || access.isBroker;
    case SIDEBAR_VISIBILITY.ADMIN_MANAGER:
      return access.isAdmin || access.isManager;
    case SIDEBAR_VISIBILITY.ADMIN_MANAGER_OFFICE_MEMBER:
      return access.isAdmin || access.isManager || access.hasOfficeMembership;
    case SIDEBAR_VISIBILITY.ADMIN_MANAGER_EMPLOYEE_DATA_ENTRY:
      return (
        access.isAdmin ||
        access.isManager ||
        access.isEmployee ||
        access.isDataEntry
      );
    case SIDEBAR_VISIBILITY.AUDIT:
      return access.canSeeAudit;
    case SIDEBAR_VISIBILITY.REPORTS:
      return access.canSeeReports;
    case SIDEBAR_VISIBILITY.WEBSITE_CMS:
      return access.isAdmin;
    case SIDEBAR_VISIBILITY.SETTINGS_ADMIN:
      return access.isAdmin;
    default:
      return false;
  }
};

export const getSidebarNavigationItems = (user, isFeatureEnabled, profile = null) => {
  const filterByFlag = (items) =>
    items.filter((item) => passesFeatureFlag(item, isFeatureEnabled));

  if (Array.isArray(user?.pages)) {
    const allowedPages = new Set(user.pages);
    return filterByFlag(
      SIDEBAR_NAV_ITEMS.filter((item) => {
        const aliases = SIDEBAR_PAGE_ALIASES[item.page] || [item.page];
        return item.page && aliases.some((page) => allowedPages.has(page));
      }),
    );
  }

  const access = getSidebarAccess(user, profile);
  return filterByFlag(
    SIDEBAR_NAV_ITEMS.filter((item) => isItemVisible(item.visibility, access)),
  );
};
