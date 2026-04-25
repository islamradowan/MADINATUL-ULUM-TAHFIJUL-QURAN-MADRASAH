import { PATHS } from './paths';
import {
  AdminDashboardPage,
  StudentListPage,
  StudentDetailsPage,
  StudentFinancePage,
  DonationOverviewPage,
  ZakatManagementPage,
  ReportsPage,
  SettingsPage,
  UserManagementPage,
  ExportReportPage,
  LanguageManagementPage,
  ProgramManagementPage,
  TransparencyManagementPage,
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
    title:   'Dashboard | Madinatul Ulum Madrasah',
  },
  {
    // Must be before :id so /finance doesn't match as an id
    path:    PATHS.ADMIN.STUDENT_FINANCE,
    element: <StudentFinancePage />,
    title:   'Student Finance | Madinatul Ulum Madrasah',
  },
  {
    path:    PATHS.ADMIN.STUDENTS,
    element: <StudentListPage />,
    title:   'Students | Madinatul Ulum Madrasah',
  },
  {
    path:    PATHS.ADMIN.STUDENT_DETAIL,
    element: <StudentDetailsPage />,
    title:   'Student Details | Madinatul Ulum Madrasah',
  },
  {
    path:    PATHS.ADMIN.DONATIONS,
    element: <DonationOverviewPage />,
    title:   'Donations | Madinatul Ulum Madrasah',
  },
  {
    path:    PATHS.ADMIN.ZAKAT,
    element: <ZakatManagementPage />,
    title:   'Zakat Management | Madinatul Ulum Madrasah',
  },
  {
    path:    PATHS.ADMIN.REPORTS,
    element: <ReportsPage />,
    title:   'Reports | Madinatul Ulum Madrasah',
  },
  {
    path:    PATHS.ADMIN.SETTINGS,
    element: <SettingsPage />,
    title:   'Settings | Madinatul Ulum Madrasah',
  },
  {
    path:    PATHS.ADMIN.USERS,
    element: <UserManagementPage />,
    title:   'User Management | Madinatul Ulum Madrasah',
  },
  {
    path:    PATHS.ADMIN.EXPORT,
    element: <ExportReportPage />,
    title:   'Export Report | Madinatul Ulum Madrasah',
  },
  {
    path:    PATHS.ADMIN.PROGRAMS,
    element: <ProgramManagementPage />,
    title:   'Program Management | Madinatul Ulum Madrasah',
  },
  {
    path:    PATHS.ADMIN.LANGUAGE,
    element: <LanguageManagementPage />,
    title:   'Language Management | Madinatul Ulum Madrasah',
  },
  {
    path:    PATHS.ADMIN.TRANSPARENCY,
    element: <TransparencyManagementPage />,
    title:   'Transparency Management | Madinatul Ulum Madrasah',
  },
];

export default adminRoutes;
