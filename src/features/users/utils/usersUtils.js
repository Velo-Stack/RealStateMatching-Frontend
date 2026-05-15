import { emptyUser } from "../constants/usersConstants";

export const getUsersByRole = (users) => ({
  ADMIN: users.filter((user) => user.role === "ADMIN"),
  MANAGER: users.filter((user) => user.role === "MANAGER"),
  BROKER: users.filter((user) => user.role === "BROKER"),
  EMPLOYEE: users.filter((user) => user.role === "EMPLOYEE"),
  DATA_ENTRY_ONLY: users.filter((user) => user.role === "DATA_ENTRY_ONLY"),
});

export const getActiveUsers = (users) =>
  users.filter((user) => user.status !== "DELETED");

export const buildUserUpdatePayload = (formData) => {
  const payload = {
    name: formData.name,
    email: formData.email,
    role: formData.role,
    phone: formData.phone?.trim() || null,
  };

  if (formData.password) payload.password = formData.password;
  return payload;
};

export const buildUserCreatePayload = (formData) => {
  const payload = {
    name: formData.name,
    email: formData.email,
    password: formData.password,
    role: formData.role,
    phone: formData.phone?.trim() || null,
    permissionMode: formData.permissionMode || "ROLE_DEFAULT",
  };

  if (payload.permissionMode === "CUSTOM") {
    payload.permissions = formData.permissions || [];
  }
  if (payload.permissionMode === "CUSTOM_EMPTY") {
    payload.permissions = [];
  }

  return payload;
};

export const getEditFormData = (user) => ({
  name: user.name,
  email: user.email,
  password: "",
  role: user.role,
  phone: user.phone || "",
  permissionMode: user.permissionMode || "ROLE_DEFAULT",
  permissions: [],
});

export const getEmptyUserForm = () => ({ ...emptyUser });
