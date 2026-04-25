# Madrasa Portal — Frontend

React frontend for the Madinatul Ulum Tahfijul Quran Madrasah portal.

---

## Tech Stack

| | |
|---|---|
| Framework | React 19 |
| Routing | React Router 7 |
| Styling | Tailwind CSS 3 |
| HTTP Client | Axios |
| Build Tool | Create React App |

---

## Project Structure

```
madrasa-portal/
└── src/
    ├── components/
    │   ├── layout/
    │   │   ├── AdminHeader.jsx      # Top bar with search & user menu
    │   │   ├── AdminLayout.jsx      # Admin shell (sidebar + header + outlet)
    │   │   ├── AdminSidebar.jsx     # Collapsible nav sidebar
    │   │   ├── BottomNav.jsx        # Mobile bottom navigation
    │   │   ├── Footer.jsx           # Public footer
    │   │   ├── Navbar.jsx           # Public top navigation
    │   │   └── PublicLayout.jsx     # Public shell (navbar + footer)
    │   └── shared/
    │       ├── ClassSelect.jsx      # Program dropdown with inline add
    │       ├── ErrorBoundary.jsx    # React error boundary
    │       ├── PageLoader.jsx       # Full-page loading spinner
    │       ├── ScrollToTop.jsx      # Scroll to top on route change
    │       └── TitleManager.jsx     # Dynamic page title
    ├── context/
    │   ├── AuthContext.jsx          # JWT auth state & login/logout
    │   ├── LanguageContext.jsx      # EN/BN translations & overrides
    │   └── StudentContext.jsx       # Shared student data cache (sync)
    ├── hooks/
    │   ├── usePageTitle.js          # Set document title per page
    │   └── useSidebar.js            # Mobile sidebar open/close state
    ├── pages/
    │   ├── admin/
    │   │   ├── AdminDashboardPage.jsx
    │   │   ├── AdminLoginPage.jsx
    │   │   ├── DonationOverviewPage.jsx
    │   │   ├── ExportReportPage.jsx
    │   │   ├── LanguageManagementPage.jsx
    │   │   ├── ProgramManagementPage.jsx
    │   │   ├── ReportsPage.jsx
    │   │   ├── SettingsPage.jsx
    │   │   ├── StudentDetailsPage.jsx
    │   │   ├── StudentFinancePage.jsx
    │   │   ├── StudentListPage.jsx
    │   │   ├── TransparencyManagementPage.jsx
    │   │   ├── UserManagementPage.jsx
    │   │   └── ZakatManagementPage.jsx
    │   ├── AboutPage.jsx
    │   ├── AdmissionPage.jsx
    │   ├── ContactPage.jsx
    │   ├── DonationPage.jsx
    │   ├── HomePage.jsx
    │   ├── MadrasaDonationPage.jsx
    │   ├── MosqueDonationPage.jsx
    │   ├── NotFoundPage.jsx
    │   ├── PhotoGalleryPage.jsx
    │   ├── StudentSupportDonationPage.jsx
    │   ├── TransparencyDashboardPage.jsx
    │   └── ZakatCalculatorPage.jsx
    ├── routes/
    │   ├── adminRoutes.jsx          # Protected admin route definitions
    │   ├── GuestRoute.jsx           # Redirect logged-in users away from login
    │   ├── lazyPages.js             # Lazy-loaded page imports
    │   ├── paths.js                 # Centralised route path constants
    │   ├── ProtectedRoute.jsx       # Redirect unauthenticated users to login
    │   └── publicRoutes.jsx         # Public route definitions
    └── services/
        ├── authService.js
        ├── axiosInstance.js         # Axios with base URL & JWT interceptor
        ├── contactService.js
        ├── dashboardService.js
        ├── donationService.js
        ├── index.js                 # Re-exports all services
        ├── programService.js
        ├── reportService.js
        ├── studentService.js
        ├── transparencyService.js
        ├── userService.js
        └── zakatService.js
```

---

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Create `.env`

```env
REACT_APP_API_BASE_URL=http://localhost:5000/api
```

### 3. Start the app

```bash
npm start
```

Runs at `http://localhost:3000`.

### 4. Build for production

```bash
npm run build
```

Output goes to the `build/` folder.

---

## Pages

### Public
| Page | Path |
|---|---|
| Home | `/` |
| About | `/about` |
| Admission | `/admission` |
| All Donations | `/donate` |
| Madrasa Fund | `/donate/madrasa` |
| Mosque Fund | `/donate/mosque` |
| Student Support | `/donate/student-support` |
| Zakat Calculator | `/zakat` |
| Gallery | `/gallery` |
| Transparency | `/transparency` |
| Contact | `/contact` |

### Admin (protected)
| Page | Path |
|---|---|
| Login | `/admin/login` |
| Dashboard | `/admin` |
| Students | `/admin/students` |
| Student Details | `/admin/students/:id` |
| Student Finance | `/admin/finance/students` |
| Donations | `/admin/donations` |
| Zakat | `/admin/zakat` |
| Reports | `/admin/reports` |
| Export | `/admin/reports/export` |
| Programs | `/admin/programs` |
| Transparency | `/admin/transparency` |
| Language | `/admin/language` |
| Users | `/admin/users` |
| Settings | `/admin/settings` |

---

## Key Concepts

### Authentication
- JWT token stored in `localStorage` via `AuthContext`
- `ProtectedRoute` redirects unauthenticated users to `/admin/login`
- `GuestRoute` redirects already-logged-in users away from the login page
- Axios interceptor automatically attaches the token to every request

### Bilingual Support (EN / বাংলা)
- All UI strings live in `LanguageContext` under `translations.en` and `translations.bn`
- `t('key')` function resolves the correct string for the active language
- Custom overrides are saved to `localStorage` and applied on top of defaults
- Live editing available from **Admin → Language Management** without redeployment

### Student Data Sync
- `StudentContext` provides a shared cache used by `StudentListPage`, `StudentFinancePage`, and `StudentDetailsPage`
- `updateCached(student)` — optimistically updates a student across all cached pages after any payment or edit
- `invalidate()` — busts the cache on add/delete so the next fetch gets fresh data

### Dynamic Donation Pages
- Expense/allocation breakdowns on each campaign page are calculated from live `raised` total
- Percentages are fixed ratios; amounts update in real time as donations come in

---

## Bilingual Translation Keys

All keys are managed in `src/context/LanguageContext.jsx`. To add a new key:

1. Add it to both `translations.en` and `translations.bn`
2. Use `t('yourKey')` in any component
3. It will automatically appear in the **Language Management** admin page

---

## Environment Variables

| Variable | Description |
|---|---|
| `REACT_APP_API_BASE_URL` | Base URL of the backend API |
