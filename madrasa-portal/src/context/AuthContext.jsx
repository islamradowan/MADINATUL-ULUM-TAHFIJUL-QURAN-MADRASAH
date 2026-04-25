import { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(() => {
    try {
      const stored = localStorage.getItem('madrasa_admin');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const login = useCallback((userData, token) => {
    const payload = { ...userData, token };
    localStorage.setItem('madrasa_admin', JSON.stringify(payload));
    setAdmin(payload);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('madrasa_admin');
    setAdmin(null);
  }, []);

  const isAuthenticated = Boolean(admin?.token);

  return (
    <AuthContext.Provider value={{ admin, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
