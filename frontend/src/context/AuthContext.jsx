import { createContext, useContext, useState, useCallback } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('flovera_user');
    return raw ? JSON.parse(raw) : null;
  });

  const login = useCallback(async (email, password, loginAs) => {
    const res = await api.post('/auth/login', { email, password, loginAs });
    const { token, ...userData } = res.data;
    localStorage.setItem('flovera_token', token);
    localStorage.setItem('flovera_user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  }, []);

  const register = useCallback(async (name, email, password, phone) => {
    const res = await api.post('/auth/register', { name, email, password, phone });
    const { token, ...userData } = res.data;
    localStorage.setItem('flovera_token', token);
    localStorage.setItem('flovera_user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('flovera_token');
    localStorage.removeItem('flovera_user');
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
