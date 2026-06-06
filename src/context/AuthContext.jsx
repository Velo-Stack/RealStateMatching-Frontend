import { createContext, useState, useEffect, useContext } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

const normalizeSessionUser = (data) => {
  if (!data) return null;
  if (!data.user) return data;
  const sessionUser = {
    ...data.user,
  };

  if (Array.isArray(data.permissions)) sessionUser.permissions = data.permissions;
  if (Array.isArray(data.permissionKeys)) sessionUser.permissionKeys = data.permissionKeys;
  if (Array.isArray(data.pages)) sessionUser.pages = data.pages;
  if (data.entitlements) sessionUser.entitlements = data.entitlements;

  return sessionUser;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const { data } = await api.get('/auth/me');
          setUser(normalizeSessionUser(data));
        } catch (error) {
          console.error("Failed to load user", error);
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', data.token);
    const sessionUser = normalizeSessionUser(data);
    setUser(sessionUser);
    return sessionUser;
  };

  const refreshSession = async () => {
    const { data } = await api.get('/auth/me');
    const sessionUser = normalizeSessionUser(data);
    setUser(sessionUser);
    return sessionUser;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, refreshSession }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
