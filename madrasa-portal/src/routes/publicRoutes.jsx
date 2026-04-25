import { PATHS } from './paths';
import {
  HomePage,
  AboutPage,
  AdmissionPage,
  DonationPage,
  MadrasaDonationPage,
  MosqueDonationPage,
  StudentSupportDonationPage,
  ZakatCalculatorPage,
  PhotoGalleryPage,
  TransparencyDashboardPage,
  ContactPage,
} from './lazyPages';

/**
 * Public route definitions.
 * Each entry is rendered inside <PublicLayout> (Navbar + Footer + BottomNav).
 */
const publicRoutes = [
  {
    path:    PATHS.HOME,
    element: <HomePage />,
    title:   'Home | Madinatul Ulum Tahfijul Quran Madrasah',
  },
  {
    path:    PATHS.ABOUT,
    element: <AboutPage />,
    title:   'About Us | Madinatul Ulum Tahfijul Quran Madrasah',
  },
  {
    path:    PATHS.ADMISSION,
    element: <AdmissionPage />,
    title:   'Admission | Madinatul Ulum Tahfijul Quran Madrasah',
  },
  {
    path:    PATHS.DONATE,
    element: <DonationPage />,
    title:   'Donate | Madinatul Ulum Tahfijul Quran Madrasah',
  },
  {
    path:    PATHS.DONATE_MADRASA,
    element: <MadrasaDonationPage />,
    title:   'Madrasa Development Fund | Madinatul Ulum Tahfijul Quran Madrasah',
  },
  {
    path:    PATHS.DONATE_MOSQUE,
    element: <MosqueDonationPage />,
    title:   'Mosque Expansion Fund | Madinatul Ulum Tahfijul Quran Madrasah',
  },
  {
    path:    PATHS.DONATE_SUPPORT,
    element: <StudentSupportDonationPage />,
    title:   'Student Support Fund | Madinatul Ulum Tahfijul Quran Madrasah',
  },
  {
    path:    PATHS.ZAKAT,
    element: <ZakatCalculatorPage />,
    title:   'Zakat Calculator | Madinatul Ulum Tahfijul Quran Madrasah',
  },
  {
    path:    PATHS.GALLERY,
    element: <PhotoGalleryPage />,
    title:   'Gallery | Madinatul Ulum Tahfijul Quran Madrasah',
  },
  {
    path:    PATHS.TRANSPARENCY,
    element: <TransparencyDashboardPage />,
    title:   'Transparency | Madinatul Ulum Tahfijul Quran Madrasah',
  },
  {
    path:    PATHS.CONTACT,
    element: <ContactPage />,
    title:   'Contact Us | Madinatul Ulum Tahfijul Quran Madrasah',
  },
];

export default publicRoutes;
