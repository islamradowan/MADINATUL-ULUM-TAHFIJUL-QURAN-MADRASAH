# Madinatul Ulum Tahfijul Quran Madrasah — Portal

A full-stack web portal for **Madinatul Ulum Tahfijul Quran Madrasah**, Barishal, Bangladesh. It serves both the public (donations, zakat, transparency) and the institution's admin team (student management, finance, reports).

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, React Router 7, Tailwind CSS 3 |
| Backend | Node.js, Express 4 |
| Database | MongoDB (Mongoose 8) |
| Auth | JWT (jsonwebtoken), bcryptjs |
| HTTP Client | Axios |
| Dev Tools | Nodemon, Create React App |

---

## Project Structure

```
Emon/
├── madrasa-backend/        # Express REST API
│   ├── src/
│   │   ├── config/         # MongoDB connection
│   │   ├── controllers/    # Route handlers
│   │   ├── middleware/     # Auth & error middleware
│   │   ├── models/         # Mongoose schemas
│   │   ├── routes/         # Express routers
│   │   └── seed.js         # Database seeder
│   ├── server.js
│   └── .env
│
└── madrasa-portal/         # React frontend
    └── src/
        ├── components/
        │   ├── layout/     # AdminLayout, AdminSidebar, Navbar, Footer
        │   └── shared/     # ClassSelect, ErrorBoundary, PageLoader
        ├── context/        # AuthContext, LanguageContext, StudentContext
        ├── hooks/          # usePageTitle, useSidebar
        ├── pages/
        │   ├── admin/      # All admin pages
        │   └── (public)/   # All public pages
        ├── routes/         # Route definitions & lazy loading
        └── services/       # Axios service modules per resource
```

---

## Features

### Public Portal
| Page | Path | Description |
|---|---|---|
| Home | `/` | Hero, active campaigns, stats |
| About | `/about` | Mission, vision, heritage |
| Admission | `/admission` | Programs, requirements, inquiry form |
| Donations | `/donate` | All active campaigns |
| Madrasa Fund | `/donate/madrasa` | Dynamic expense breakdown |
| Mosque Fund | `/donate/mosque` | Dynamic expense breakdown |
| Student Support | `/donate/student-support` | Dynamic fund allocation |
| Zakat Calculator | `/zakat` | Shariah-compliant zakat calculator with payment |
| Gallery | `/gallery` | Photo gallery with category filters |
| Transparency | `/transparency` | Live financial charts & documents |
| Contact | `/contact` | Contact form |

### Admin Portal (`/admin`)
| Page | Path | Description |
|---|---|---|
| Dashboard | `/admin` | KPI cards, charts, recent activity |
| Students | `/admin/students` | Full CRUD, search, filter, pagination |
| Student Details | `/admin/students/:id` | Profile, monthly fee ledger, payment recording |
| Student Finance | `/admin/finance/students` | Finance overview, paid/due tracking |
| Donations | `/admin/donations` | Donation records & overview |
| Zakat | `/admin/zakat` | Zakat records management |
| Reports | `/admin/reports` | Summary reports |
| Export | `/admin/reports/export` | CSV export |
| Programs | `/admin/programs` | Manage class/program list |
| Transparency | `/admin/transparency` | Manage public transparency data |
| Language | `/admin/language` | Edit all EN/BN UI translations |
| Users | `/admin/users` | User management with role control |
| Settings | `/admin/settings` | Portal settings |

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/login` | Admin login |
| GET | `/api/auth/me` | Get current user |
| PUT | `/api/auth/change-password` | Change password |
| GET/POST | `/api/students` | List / create students |
| GET/PUT/DELETE | `/api/students/:id` | Get / update / delete student |
| GET/POST | `/api/students/:id/fees` | Get / upsert monthly fee |
| POST | `/api/students/:id/fees/generate` | Auto-generate 12-month entries |
| PATCH | `/api/students/:id/fees/:feeId/toggle` | Enable / disable a month |
| DELETE | `/api/students/:id/fees/:feeId` | Delete a fee entry |
| GET/POST | `/api/donations` | List / create donations |
| GET | `/api/donations/projects` | Aggregated project totals |
| GET/POST | `/api/zakat` | List / create zakat records |
| GET/POST | `/api/users` | List / create users (master only) |
| PUT/DELETE | `/api/users/:id` | Update / delete user |
| GET | `/api/dashboard` | Dashboard stats |
| GET | `/api/reports` | Report data |
| GET | `/api/transparency` | Public transparency data |
| GET | `/api/programs` | Program list |
| POST | `/api/contact` | Submit contact form |
| GET | `/api/health` | Health check |

---

## User Roles & Permissions

| Action | Master | Admin | Staff / Finance |
|---|---|---|---|
| Add user | ✅ | ❌ | ❌ |
| Delete user | ✅ | ❌ | ❌ |
| Change user role | ✅ | ✅ | ❌ |
| Edit user profile | ✅ | ✅ | ✅ (own) |
| Delete master account | ❌ | ❌ | ❌ |
| All other admin actions | ✅ | ✅ | ✅ |

---

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)

### 1. Clone the repository

```bash
git clone <repo-url>
```

### 2. Backend setup

```bash
cd madrasa-backend
npm install
```

Create `.env`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

Seed the database:

```bash
npm run seed
```

Start the server:

```bash
npm run dev       # development (nodemon)
npm start         # production
```

### 3. Frontend setup

```bash
cd madrasa-portal
npm install
```

Create `.env`:

```env
REACT_APP_API_BASE_URL=http://localhost:5000/api
```

Start the app:

```bash
npm start
```

The portal runs at `http://localhost:3000`.

---

## Default Credentials

| Role | Email | Password |
|---|---|---|
| Master Admin | `admin@madrasa.com` | `admin123` |

> **Note:** Change the default password immediately after first login in production.

---

## Bilingual Support

The portal supports **English** and **বাংলা (Bengali)**. All UI strings are managed through `LanguageContext` and can be customised live from the **Language Management** page in the admin panel without redeployment.

---

## Student Finance Flow

1. Add a student with a monthly fee rate
2. Auto-generate 12 monthly fee entries for the year
3. Enable individual months as they become due
4. Record payments month by month from the Student Details ledger
5. Cumulative `paid` and `due` on the student record are automatically recalculated from the monthly entries
6. Both **Student List** and **Student Finance** pages stay in sync via shared `StudentContext`

---

## Donation Campaigns

Three active campaigns with dynamic fund allocation:

| Campaign | Goal |
|---|---|
| Madrasa Development Fund | ৳1,50,000 |
| Mosque Expansion Fund | ৳12,00,000 |
| Student Support Fund | ৳1,20,000 |

Expense/allocation breakdowns on each campaign page update in real time based on total donations raised.

---

## License

Private — Madinatul Ulum Tahfijul Quran Madrasah Trust. All rights reserved.
