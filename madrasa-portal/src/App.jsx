import { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { AuthProvider }      from './context/AuthContext';
import { LanguageProvider }  from './context/LanguageContext';
import { DonorAuthProvider } from './context/DonorAuthContext';
import PublicLayout         from './components/layout/PublicLayout';
import AdminLayout          from './components/layout/AdminLayout';
import ProtectedRoute       from './routes/ProtectedRoute';
import GuestRoute           from './routes/GuestRoute';
import DonorProtectedRoute  from './routes/DonorProtectedRoute';
import publicRoutes         from './routes/publicRoutes';
import adminRoutes          from './routes/adminRoutes';
import { PATHS }            from './routes/paths';
import { AdminLoginPage, NotFoundPage, DonorLoginPage, DonorDashboardPage } from './routes/lazyPages';
import ScrollToTop          from './components/shared/ScrollToTop';
import TitleManager         from './components/shared/TitleManager';
import PageLoader           from './components/shared/PageLoader';
import ErrorBoundary        from './components/shared/ErrorBoundary';

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <DonorAuthProvider>
          <LanguageProvider>
          <BrowserRouter>

            <ScrollToTop />
            <TitleManager />

            <Suspense fallback={<PageLoader />}>
              <Routes>

                <Route element={<PublicLayout />}>
                  {publicRoutes.map(({ path, element }) => (
                    <Route key={path} path={path} element={element} />
                  ))}
                </Route>

                <Route
                  path={PATHS.ADMIN.LOGIN}
                  element={
                    <GuestRoute>
                      <AdminLoginPage />
                    </GuestRoute>
                  }
                />

                <Route
                  element={
                    <ProtectedRoute>
                      <AdminLayout />
                    </ProtectedRoute>
                  }
                >
                  {adminRoutes.map(({ path, element }) => (
                    <Route key={path} path={path} element={element} />
                  ))}
                </Route>

                {/* Donor routes */}
                <Route path={PATHS.DONOR.LOGIN}     element={<DonorLoginPage />} />
                <Route
                  path={PATHS.DONOR.DASHBOARD}
                  element={
                    <DonorProtectedRoute>
                      <DonorDashboardPage />
                    </DonorProtectedRoute>
                  }
                />

                <Route path={PATHS.NOT_FOUND} element={<NotFoundPage />} />

              </Routes>
            </Suspense>

          </BrowserRouter>
          </LanguageProvider>
        </DonorAuthProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
