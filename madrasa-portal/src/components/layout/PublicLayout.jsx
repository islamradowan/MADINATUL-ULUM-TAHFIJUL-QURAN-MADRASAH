import { Outlet } from 'react-router-dom';
import Navbar    from './Navbar';
import Footer    from './Footer';
import BottomNav from './BottomNav';

/**
 * PublicLayout
 *
 * Wraps every public-facing page with:
 *   - Sticky Navbar (desktop)
 *   - <Outlet /> — React Router renders the matched child page here
 *   - Footer
 *   - BottomNav (mobile only, fixed)
 *
 * The `pb-20 md:pb-0` on <main> prevents content from hiding
 * behind the fixed mobile BottomNav.
 */
export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-background">

      {/* Skip-to-content for keyboard / screen-reader users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary-container focus:text-white focus:rounded-lg focus:text-sm focus:font-semibold"
      >
        Skip to main content
      </a>

      <Navbar />

      <main id="main-content" className="flex-grow pb-20 md:pb-0">
        <Outlet />
      </main>

      <Footer />

      {/* Fixed bottom nav — mobile only, rendered above Footer in DOM for z-index */}
      <BottomNav />
    </div>
  );
}
