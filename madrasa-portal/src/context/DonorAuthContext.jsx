import { createContext, useContext, useState, useCallback } from 'react';

const DonorAuthContext = createContext(null);

export function DonorAuthProvider({ children }) {
  const [donor, setDonor] = useState(() => {
    try {
      const stored = localStorage.getItem('madrasa_donor');
      return stored ? JSON.parse(stored) : null;
    } catch { return null; }
  });

  const login = useCallback((donorData, token) => {
    const payload = { ...donorData, token };
    localStorage.setItem('madrasa_donor', JSON.stringify(payload));
    setDonor(payload);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('madrasa_donor');
    setDonor(null);
  }, []);

  return (
    <DonorAuthContext.Provider value={{ donor, isAuthenticated: Boolean(donor?.token), login, logout }}>
      {children}
    </DonorAuthContext.Provider>
  );
}

export function useDonorAuth() {
  const ctx = useContext(DonorAuthContext);
  if (!ctx) throw new Error('useDonorAuth must be used inside DonorAuthProvider');
  return ctx;
}
