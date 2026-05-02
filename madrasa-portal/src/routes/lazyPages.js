import { lazy } from 'react';

// ── Public Pages ─────────────────────────────────────────────────────────────
export const HomePage               = lazy(() => import('../pages/HomePage'));
export const AboutPage              = lazy(() => import('../pages/AboutPage'));
export const AdmissionPage          = lazy(() => import('../pages/AdmissionPage'));
export const DonationPage           = lazy(() => import('../pages/DonationPage'));
export const MadrasaDonationPage    = lazy(() => import('../pages/MadrasaDonationPage'));
export const ZakatCalculatorPage    = lazy(() => import('../pages/ZakatCalculatorPage'));
export const PhotoGalleryPage       = lazy(() => import('../pages/PhotoGalleryPage'));
export const ContactPage            = lazy(() => import('../pages/ContactPage'));
export const NotFoundPage                  = lazy(() => import('../pages/NotFoundPage'));
export const MosqueDonationPage            = lazy(() => import('../pages/MosqueDonationPage'));
export const StudentSupportDonationPage    = lazy(() => import('../pages/StudentSupportDonationPage'));
export const IfterFundDonationPage         = lazy(() => import('../pages/IfterFundDonationPage'));
export const PaymentSuccessPage            = lazy(() => import('../pages/PaymentSuccessPage'));
export const PaymentFailPage               = lazy(() => import('../pages/PaymentFailPage'));
export const PaymentCancelPage             = lazy(() => import('../pages/PaymentCancelPage'));

// ── Admin Pages ───────────────────────────────────────────────────────────────
export const AdminLoginPage         = lazy(() => import('../pages/admin/AdminLoginPage'));
export const AdminDashboardPage     = lazy(() => import('../pages/admin/AdminDashboardPage'));
export const StudentListPage        = lazy(() => import('../pages/admin/StudentListPage'));
export const StudentDetailsPage     = lazy(() => import('../pages/admin/StudentDetailsPage'));
export const StudentFinancePage     = lazy(() => import('../pages/admin/StudentFinancePage'));
export const DonationOverviewPage   = lazy(() => import('../pages/admin/DonationOverviewPage'));
export const ReportsPage            = lazy(() => import('../pages/admin/ReportsPage'));
export const SettingsPage           = lazy(() => import('../pages/admin/SettingsPage'));
export const UserManagementPage     = lazy(() => import('../pages/admin/UserManagementPage'));
export const ExportReportPage       = lazy(() => import('../pages/admin/ExportReportPage'));
export const LanguageManagementPage    = lazy(() => import('../pages/admin/LanguageManagementPage'));
export const ProgramManagementPage     = lazy(() => import('../pages/admin/ProgramManagementPage'));
