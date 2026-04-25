import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import publicRoutes from '../routes/publicRoutes';
import adminRoutes from '../routes/adminRoutes';
import { PATHS } from '../routes/paths';

const allRoutes = [
  ...publicRoutes,
  ...adminRoutes,
  { path: PATHS.ADMIN.LOGIN, title: 'Admin Login | Madinatul Ulum Tahfijul Quran Madrasah' },
];

const DEFAULT_TITLE = 'Madinatul Ulum Tahfijul Quran Madrasah | Islamic Education & Charity';

export default function usePageTitle() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Exact match first, then param-pattern match
    const match = allRoutes.find((r) => {
      if (r.path === pathname) return true;
      // Convert :param segments to a regex for dynamic routes
      const pattern = r.path.replace(/:[^/]+/g, '[^/]+');
      return new RegExp(`^${pattern}$`).test(pathname);
    });

    document.title = match?.title ?? DEFAULT_TITLE;
  }, [pathname]);
}
