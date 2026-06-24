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

const applySession = (data, setUser, setProfile) => {
  const sessionUser = normalizeSessionUser(data);
  setUser(sessionUser);
  setProfile(data?.profile ?? sessionUser?.profile ?? null);
  return sessionUser;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const { data } = await api.get('/auth/me', { skipAuthRedirect: true });
          applySession(data, setUser, setProfile);
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
    return applySession(data, setUser, setProfile);
  };

  const refreshSession = async () => {
    const { data } = await api.get('/auth/me');
    return applySession(data, setUser, setProfile);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ user, profile, login, logout, loading, refreshSession, syncSession: (data) => applySession(data, setUser, setProfile) }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
