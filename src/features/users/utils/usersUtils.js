import { emptyUser } from "../constants/usersConstants";

export const getUsersByRole = (users) => ({
  ADMIN: users.filter((user) => user.role === "ADMIN"),
  MANAGER: users.filter((user) => user.role === "MANAGER"),
  BROKER: users.filter((user) => user.role === "BROKER"),
});

export const getActiveUsers = (users) =>
  users.filter((user) => user.status !== "DELETED");

export const buildUserUpdatePayload = (formData) => {
  const payload = {
    name: formData.name,
    email: formData.email,
    role: formData.role,
  };

  if (formData.password) payload.password = formData.password;
  return payload;
};

export const getEditFormData = (user) => ({
  name: user.name,
  email: user.email,
  password: "",
  role: user.role,
});

export const getEmptyUserForm = () => ({ ...emptyUser });
