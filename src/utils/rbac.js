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

const isOwner = (resource, user) => {
  if (!resource || !user) return false;
  const ownerKeys = ['ownerId', 'userId', 'brokerId', 'createdById'];
  return ownerKeys.some((key) => resource[key] && resource[key] === user.id);
};

export const canEdit = (resource, user) => {
  if (!user) return false;
  return user.role === ROLES.ADMIN || user.role === ROLES.MANAGER;
};

export const canDelete = (resource, user) => {
  if (!user) return false;
  return user.role === ROLES.ADMIN || user.role === ROLES.MANAGER;
};

// ─── User-specific RBAC ───

export const canDeleteUser = (currentUser) => {
  if (!currentUser) return false;
  return currentUser.role === ROLES.ADMIN;
};

export const canEditUser = (currentUser, targetUser) => {
  if (!currentUser) return false;
  if (currentUser.role === ROLES.ADMIN) return true;
  return currentUser.id === targetUser?.id;
};

export const canChangeUserRole = (currentUser) => {
  if (!currentUser) return false;
  return currentUser.role === ROLES.ADMIN;
};

export const canChangeUserStatus = (currentUser) => {
  if (!currentUser) return false;
  return currentUser.role === ROLES.ADMIN;
};
