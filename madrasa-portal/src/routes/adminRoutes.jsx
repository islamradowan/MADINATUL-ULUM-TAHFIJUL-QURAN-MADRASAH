import { PATHS } from './paths';
import { Navigate } from 'react-router-dom';
import {
  AdminDashboardPage,
  StudentListPage,
  StudentDetailsPage,
  StudentFinancePage,
  DonationOverviewPage,
  SettingsPage,
  UserManagementPage,
  ExportReportPage,
  LanguageManagementPage,
  ProgramManagementPage,
} from './lazyPages';

/**
 * Protected admin route definitions.
 * All rendered inside <AdminLayout> (Sidebar + AdminHeader).
 * Route order matters: more-specific paths must come before param routes.
 */
const adminRoutes = [
  {
    path:    PATHS.ADMIN.DASHBOARD,
    element: <AdminDashboardPage />,
    title:   'Dashboard | An-Nusrah Foundation',
  },
  {
    // Must be before :id so /finance doesn't match as an id
    path:    PATHS.ADMIN.STUDENT_FINANCE,
    element: <StudentFinancePage />,
    title:   'Student Finance | An-Nusrah Foundation',
  },
  {
    path:    PATHS.ADMIN.STUDENTS,
    element: <StudentListPage />,
    title:   'Students | An-Nusrah Foundation',
  },
  {
    path:    PATHS.ADMIN.STUDENT_DETAIL,
    element: <StudentDetailsPage />,
    title:   'Student Details | An-Nusrah Foundation',
  },
  {
    path:    PATHS.ADMIN.DONATIONS,
    element: <DonationOverviewPage />,
    title:   'Donations | An-Nusrah Foundation',
  },
  {
    path:    PATHS.ADMIN.REPORTS,
    element: <Navigate to={PATHS.ADMIN.DASHBOARD} replace />,
  },
  {
    path:    PATHS.ADMIN.SETTINGS,
    element: <SettingsPage />,
    title:   'Settings | An-Nusrah Foundation',
  },
  {
    path:    PATHS.ADMIN.USERS,
    element: <UserManagementPage />,
    title:   'User Management | An-Nusrah Foundation',
  },
  {
    path:    PATHS.ADMIN.EXPORT,
    element: <ExportReportPage />,
    title:   'Export Report | An-Nusrah Foundation',
  },
  {
    path:    PATHS.ADMIN.PROGRAMS,
    element: <ProgramManagementPage />,
    title:   'Program Management | An-Nusrah Foundation',
  },
  {
    path:    PATHS.ADMIN.LANGUAGE,
    element: <LanguageManagementPage />,
    title:   'Language Management | An-Nusrah Foundation',
  },
];

export default adminRoutes;
