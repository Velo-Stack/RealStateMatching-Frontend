export const ROLES = {
  ADMIN: 'ADMIN',
  MANAGER: 'MANAGER',
  BROKER: 'BROKER',
  EMPLOYEE: 'EMPLOYEE',
  DATA_ENTRY_ONLY: 'DATA_ENTRY_ONLY',
};

export const hasRole = (user, roles = []) => {
  if (!user || !user.role) return false;
  return roles.includes(user.role);
};

const ROLE_PERMISSION_FALLBACKS = {
  ADMIN: [
    'offers.read', 'offers.create', 'offers.update', 'offers.delete',
    'requests.read', 'requests.create', 'requests.update', 'requests.delete',
    'matches.read', 'matches.update',
    'users.read', 'users.create', 'users.update', 'users.delete', 'users.managePermissions',
    'teams.read', 'teams.create', 'teams.update', 'teams.delete', 'teams.manageMembers',
    'conversations.read', 'conversations.create', 'conversations.update', 'conversations.message',
    'notifications.read', 'notifications.update',
    'dashboard.read', 'reports.export', 'auditLogs.read',
    'locations.read', 'meta.read', 'website.manage',
    'submissionLinks.create', 'uploads.create',
    'featureFlags.read', 'featureFlags.manage',
    'tools.commission.read', 'tools.commission.calculate', 'tools.commission.manageRules',
    'brokers.points.read', 'brokers.rewards.redeem', 'brokers.gamification.manage',
    'offices.read', 'offices.create', 'offices.update', 'offices.delete', 'offices.manageMembers',
    'requests.assign', 'distribution.manage',
  ],
  MANAGER: [
    'offers.read', 'offers.create', 'offers.update', 'offers.delete',
    'requests.read', 'requests.create', 'requests.update', 'requests.delete',
    'matches.read', 'matches.update',
    'users.read',
    'teams.read', 'teams.create', 'teams.update', 'teams.manageMembers',
    'conversations.read', 'conversations.create', 'conversations.update', 'conversations.message',
    'notifications.read', 'notifications.update',
    'dashboard.read', 'reports.export', 'auditLogs.read',
    'locations.read', 'meta.read',
    'tools.commission.read', 'tools.commission.calculate',
    'brokers.points.read', 'brokers.rewards.redeem',
    'offices.read', 'offices.create', 'offices.update', 'offices.manageMembers',
    'requests.assign',
  ],
  BROKER: [
    'offers.read', 'offers.create', 'offers.update', 'offers.delete',
    'requests.read', 'requests.create', 'requests.update', 'requests.delete',
    'matches.read',
    'conversations.read', 'conversations.message',
    'notifications.read', 'notifications.update',
    'dashboard.read', 'locations.read', 'meta.read',
    'tools.commission.read', 'tools.commission.calculate',
    'brokers.points.read', 'brokers.rewards.redeem',
  ],
  EMPLOYEE: [
    'offers.read', 'offers.create',
    'requests.read', 'requests.create',
    'teams.read',
    'conversations.read', 'conversations.create', 'conversations.message',
    'notifications.read', 'notifications.update',
    'locations.read', 'meta.read',
  ],
  DATA_ENTRY_ONLY: [
    'offers.create', 'requests.create', 'teams.read',
    'conversations.read', 'conversations.create',
    'notifications.read', 'notifications.update',
    'locations.read', 'meta.read',
  ],
};

const PAGE_PERMISSION_FALLBACKS = {
  dashboard: ['dashboard.read'],
  offers: ['offers.read'],
  requests: ['requests.read'],
  matches: ['matches.read'],
  notifications: ['notifications.read'],
  users: ['users.read', 'users.create', 'users.update', 'users.delete', 'users.managePermissions'],
  auditLogs: ['auditLogs.read'],
  reports: ['reports.export'],
  teams: ['teams.read'],
  conversations: ['conversations.read'],
  websiteAdmin: ['website.manage'],
  settingsAdmin: ['featureFlags.read', 'featureFlags.manage'],
  map: ['offers.read'],
  commissionCalculator: ['tools.commission.read', 'tools.commission.calculate'],
  myPoints: ['brokers.points.read'],
  rewards: ['brokers.points.read', 'brokers.rewards.redeem'],
  leaderboard: ['brokers.points.read'],
  offices: ['offices.read'],
  distributionRules: ['distribution.manage'],
};

const PAGE_ALIASES = {
  offers: ['offers', 'offers.create', 'offers.edit'],
  requests: ['requests', 'requests.create', 'requests.edit'],
};

export const getPermissionKeys = (user) => {
  if (!user) return [];
  if (Array.isArray(user.permissionKeys)) return user.permissionKeys;
  return ROLE_PERMISSION_FALLBACKS[user.role] || [];
};

export const hasPermission = (user, permissionKey) =>
  getPermissionKeys(user).includes(permissionKey);

export const hasAnyPermission = (user, permissionKeys = []) =>
  permissionKeys.some((permissionKey) => hasPermission(user, permissionKey));

export const canAccessPage = (user, page) => {
  if (!user || !page) return false;
  if (Array.isArray(user.pages)) {
    const allowedPages = PAGE_ALIASES[page] || [page];
    return allowedPages.some((allowedPage) => user.pages.includes(allowedPage));
  }
  return hasAnyPermission(user, PAGE_PERMISSION_FALLBACKS[page] || []);
};

export const getPermissionScope = (user, permissionKey) => {
  if (!Array.isArray(user?.permissions)) return null;
  return user.permissions.find((permission) => permission.key === permissionKey)?.scope || null;
};

const isOwner = (resource, user) => {
  if (!resource || !user) return false;
  const ownerKeys = ['ownerId', 'userId', 'brokerId', 'createdById'];
  return ownerKeys.some((key) => resource[key] && resource[key] === user.id);
};

export const canEdit = (resource, user) => {
  if (Array.isArray(user?.permissionKeys)) {
    const resourceName = resource?.__resource || 'offers';
    const permissionKey = `${resourceName}.update`;
    if (!hasPermission(user, permissionKey)) return false;
    const scope = getPermissionScope(user, permissionKey);
    if (scope === 'OWN') return isOwner(resource, user);
    return true;
  }
  if (!user) return false;
  if (user.role === ROLES.ADMIN || user.role === ROLES.MANAGER) return true;
  if (user.role === ROLES.BROKER) return isOwner(resource, user);
  // DATA_ENTRY_ONLY cannot edit
  if (user.role === ROLES.DATA_ENTRY_ONLY) return false;
  return false;
};

export const canDelete = (resource, user) => {
  if (Array.isArray(user?.permissionKeys)) {
    const resourceName = resource?.__resource || 'offers';
    const permissionKey = `${resourceName}.delete`;
    if (!hasPermission(user, permissionKey)) return false;
    const scope = getPermissionScope(user, permissionKey);
    if (scope === 'OWN') return isOwner(resource, user);
    return true;
  }
  if (!user) return false;
  if (user.role === ROLES.ADMIN || user.role === ROLES.MANAGER) return true;
  if (user.role === ROLES.BROKER) return isOwner(resource, user);
  // DATA_ENTRY_ONLY cannot delete
  if (user.role === ROLES.DATA_ENTRY_ONLY) return false;
  return false;
};

// ─── User-specific RBAC ───

export const canDeleteUser = (currentUser) => {
  if (!currentUser) return false;
  if (Array.isArray(currentUser.permissionKeys)) return hasPermission(currentUser, 'users.delete');
  return currentUser.role === ROLES.ADMIN;
};

export const canEditUser = (currentUser, targetUser) => {
  if (!currentUser) return false;
  if (Array.isArray(currentUser.permissionKeys)) {
    return hasPermission(currentUser, 'users.update');
  }
  if (currentUser.role === ROLES.ADMIN) return true;
  return currentUser.id === targetUser?.id;
};

export const canChangeUserRole = (currentUser) => {
  if (!currentUser) return false;
  if (Array.isArray(currentUser.permissionKeys)) return hasPermission(currentUser, 'users.update');
  return currentUser.role === ROLES.ADMIN;
};

export const canChangeUserStatus = (currentUser) => {
  if (!currentUser) return false;
  if (Array.isArray(currentUser.permissionKeys)) return hasPermission(currentUser, 'users.update');
  return currentUser.role === ROLES.ADMIN;
};
