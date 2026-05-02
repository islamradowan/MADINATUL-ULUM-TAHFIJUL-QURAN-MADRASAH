import { PATHS } from './paths';
import {
  HomePage,
  AboutPage,
  AdmissionPage,
  DonationPage,
  MadrasaDonationPage,
  MosqueDonationPage,
  StudentSupportDonationPage,
  IfterFundDonationPage,
  ZakatCalculatorPage,
  PhotoGalleryPage,
  ContactPage,
  PaymentSuccessPage,
  PaymentFailPage,
  PaymentCancelPage,
} from './lazyPages';

/**
 * Public route definitions.
 * Each entry is rendered inside <PublicLayout> (Navbar + Footer + BottomNav).
 */
const publicRoutes = [
  {
    path:    PATHS.HOME,
    element: <HomePage />,
    title:   'Home | An-Nusrah Foundation',
  },
  {
    path:    PATHS.ABOUT,
    element: <AboutPage />,
    title:   'About Us | An-Nusrah Foundation',
  },
  {
    path:    PATHS.ADMISSION,
    element: <AdmissionPage />,
    title:   'Admission | An-Nusrah Foundation',
  },
  {
    path:    PATHS.DONATE,
    element: <DonationPage />,
    title:   'Donate | An-Nusrah Foundation',
  },
  {
    path:    PATHS.DONATE_MADRASA,
    element: <MadrasaDonationPage />,
    title:   'Skill Development Fund | An-Nusrah Foundation',
  },
  {
    path:    PATHS.DONATE_MOSQUE,
    element: <MosqueDonationPage />,
    title:   'Masjid Complex Fund | An-Nusrah Foundation',
  },
  {
    path:    PATHS.DONATE_SUPPORT,
    element: <StudentSupportDonationPage />,
    title:   'Student Support Fund | An-Nusrah Foundation',
  },
  {
    path:    PATHS.DONATE_IFTER,
    element: <IfterFundDonationPage />,
    title:   'Ifter Fund | An-Nusrah Foundation',
  },
  {
    path:    PATHS.ZAKAT,
    element: <ZakatCalculatorPage />,
    title:   'Zakat Calculator | An-Nusrah Foundation',
  },
  {
    path:    PATHS.GALLERY,
    element: <PhotoGalleryPage />,
    title:   'Gallery | An-Nusrah Foundation',
  },
  {
    path:    PATHS.CONTACT,
    element: <ContactPage />,
    title:   'Contact Us | An-Nusrah Foundation',
  },
  {
    path:    PATHS.PAYMENT_SUCCESS,
    element: <PaymentSuccessPage />,
    title:   'Payment Success | An-Nusrah Foundation',
  },
  {
    path:    PATHS.PAYMENT_FAIL,
    element: <PaymentFailPage />,
    title:   'Payment Failed | An-Nusrah Foundation',
  },
  {
    path:    PATHS.PAYMENT_CANCEL,
    element: <PaymentCancelPage />,
    title:   'Payment Cancelled | An-Nusrah Foundation',
  },
];

export default publicRoutes;
