import { hasRole, ROLES } from "../../utils/rbac";
import { SIDEBAR_NAV_ITEMS, SIDEBAR_VISIBILITY } from "./sidebarNavConfig";

export const getSidebarAccess = (user) => {
  const isAdmin = hasRole(user, [ROLES.ADMIN]);
  const isManager = hasRole(user, [ROLES.MANAGER]);
  const isEmployee = hasRole(user, [ROLES.EMPLOYEE]);
  const isBroker = hasRole(user, [ROLES.BROKER]);
  const isDataEntry = hasRole(user, [ROLES.DATA_ENTRY_ONLY]);

  return {
    isAdmin,
    isManager,
    isEmployee,
    isBroker,
    isDataEntry,
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
    case SIDEBAR_VISIBILITY.ADMIN_MANAGER_DATA_ENTRY:
      return access.isAdmin || access.isManager || access.isDataEntry;
    case SIDEBAR_VISIBILITY.ADMIN_BROKER:
      return access.isAdmin || access.isBroker;
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
    default:
      return false;
  }
};

export const getSidebarNavigationItems = (user) => {
  const access = getSidebarAccess(user);
  return SIDEBAR_NAV_ITEMS.filter((item) =>
    isItemVisible(item.visibility, access),
  );
};
