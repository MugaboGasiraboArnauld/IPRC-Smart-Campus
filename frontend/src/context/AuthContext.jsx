import React, { createContext, useContext, useState, useEffect } from 'react';
import { login as apiLogin, register as apiRegister, getMe } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('iprc_user')) || null; } catch { return null; }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('iprc_token');
    if (token) {
      getMe()
        .then(res => { setUser(res.data.user); localStorage.setItem('iprc_user', JSON.stringify(res.data.user)); })
        .catch(() => { localStorage.removeItem('iprc_token'); localStorage.removeItem('iprc_user'); setUser(null); })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const res = await apiLogin({ email, password });
    const { token, user } = res.data;
    localStorage.setItem('iprc_token', token);
    localStorage.setItem('iprc_user', JSON.stringify(user));
    setUser(user);
    return user;
  };

  const register = async (data) => {
    const res = await apiRegister(data);
    const { token, user } = res.data;
    localStorage.setItem('iprc_token', token);
    localStorage.setItem('iprc_user', JSON.stringify(user));
    setUser(user);
    return user;
  };

  const logout = () => {
    localStorage.removeItem('iprc_token');
    localStorage.removeItem('iprc_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
