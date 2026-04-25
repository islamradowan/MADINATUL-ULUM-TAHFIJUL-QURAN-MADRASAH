import { createContext, useContext, useState, useCallback } from 'react';
import { studentService } from '../services';

const StudentContext = createContext(null);

export function StudentProvider({ children }) {
  const [cache, setCache] = useState({});   // keyed by JSON.stringify(params)

  const fetchStudents = useCallback(async (params = {}) => {
    const key = JSON.stringify(params);
    const { data } = await studentService.getAll(params);
    const students = Array.isArray(data) ? data : data.students ?? [];
    const total    = data.total ?? students.length;
    setCache((prev) => ({ ...prev, [key]: { students, total } }));
    return { students, total };
  }, []);

  // Call this after any mutation (payment, edit, delete) to bust the cache
  const invalidate = useCallback(() => setCache({}), []);

  // Optimistically update a single student across all cached pages
  const updateCached = useCallback((updated) => {
    setCache((prev) => {
      const next = {};
      for (const [key, val] of Object.entries(prev)) {
        next[key] = {
          ...val,
          students: val.students.map((s) => s._id === updated._id ? { ...s, ...updated } : s),
        };
      }
      return next;
    });
  }, []);

  return (
    <StudentContext.Provider value={{ cache, fetchStudents, invalidate, updateCached }}>
      {children}
    </StudentContext.Provider>
  );
}

export function useStudents() {
  const ctx = useContext(StudentContext);
  if (!ctx) throw new Error('useStudents must be used inside StudentProvider');
  return ctx;
}
