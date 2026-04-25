# Madrasa Portal — Backend

Express REST API for the Madinatul Ulum Tahfijul Quran Madrasah portal.

---

## Tech Stack

| | |
|---|---|
| Runtime | Node.js 18+ |
| Framework | Express 4 |
| Database | MongoDB (Mongoose 8) |
| Auth | JWT (jsonwebtoken), bcryptjs |
| Dev | Nodemon |

---

## Project Structure

```
madrasa-backend/
├── src/
│   ├── config/
│   │   └── db.js                  # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js      # Login, me, change password
│   │   ├── contactController.js   # Contact form submission
│   │   ├── dashboardController.js # KPI stats
│   │   ├── donationController.js  # Donations CRUD + project totals
│   │   ├── programController.js   # Program/class management
│   │   ├── reportController.js    # Reports + CSV export
│   │   ├── studentController.js   # Students + monthly fee ledger
│   │   ├── transparencyController.js
│   │   ├── userController.js      # User management
│   │   └── zakatController.js     # Zakat records
│   ├── middleware/
│   │   ├── authMiddleware.js      # JWT protect middleware
│   │   └── errorMiddleware.js     # Global error handler
│   ├── models/
│   │   ├── Contact.js
│   │   ├── Donation.js
│   │   ├── Program.js
│   │   ├── Student.js             # Includes monthlyFees sub-schema
│   │   ├── User.js                # Includes isMaster flag
│   │   └── Zakat.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── contact.js
│   │   ├── dashboard.js
│   │   ├── donations.js
│   │   ├── programs.js
│   │   ├── reports.js
│   │   ├── students.js
│   │   ├── transparency.js
│   │   ├── users.js
│   │   └── zakat.js
│   └── seed.js                    # Database seeder
├── server.js
├── .env                           # Not committed — see .env.example
└── .env.example
```

---

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Create `.env`

Copy `.env.example` and fill in your values:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

### 3. Seed the database

```bash
npm run seed
```

This creates:
- 1 master admin user
- 20 students
- 20 donations
- 20 zakat records

### 4. Start the server

```bash
npm run dev     # development with nodemon
npm start       # production
```

Server runs at `http://localhost:5000`.

---

## API Reference

### Auth
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/login` | ❌ | Login, returns JWT |
| GET | `/api/auth/me` | ✅ | Get current user |
| PUT | `/api/auth/change-password` | ✅ | Change password |

### Students
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/students` | List with pagination, search, filter |
| POST | `/api/students` | Create student |
| GET | `/api/students/:id` | Get student by ID |
| PUT | `/api/students/:id` | Update student |
| DELETE | `/api/students/:id` | Delete student |
| GET | `/api/students/:id/fees` | Get monthly fee ledger |
| POST | `/api/students/:id/fees` | Add / update a monthly fee entry |
| POST | `/api/students/:id/fees/generate` | Auto-generate 12 months for a year |
| PATCH | `/api/students/:id/fees/:feeId/toggle` | Enable / disable a month |
| DELETE | `/api/students/:id/fees/:feeId` | Delete a fee entry |

### Donations
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/donations` | List donations |
| POST | `/api/donations` | Create donation |
| GET | `/api/donations/projects` | Aggregated totals per project |

### Zakat
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/zakat` | List zakat records |
| POST | `/api/zakat` | Create zakat record |

### Users
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/users` | ✅ | List all users |
| POST | `/api/users` | ✅ Master only | Create user |
| PUT | `/api/users/:id` | ✅ | Update user (role: master/admin only) |
| DELETE | `/api/users/:id` | ✅ Master only | Delete user |

### Other
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/dashboard` | Dashboard KPI stats |
| GET | `/api/reports` | Report data |
| GET | `/api/transparency` | Public transparency data |
| GET | `/api/programs` | Program list |
| POST | `/api/contact` | Submit contact form |
| GET | `/api/health` | Health check |

---

## Data Models

### Student
```
name, class, guardian, phone
fees          — monthly fee rate
paid          — cumulative paid (auto-calculated from monthlyFees)
due           — cumulative due  (auto-calculated from monthlyFees)
status        — Active | Inactive | Graduated
monthlyFees[] — { year, month, amount, paid, due, paidDate, note, disabled }
```

### Donation
```
projectType   — Madrasa Development | Mosque Expansion | Student Support
amount, donorName, paymentMethod, status, date
```

### Zakat
```
donorName, totalAmount, allocationType, paymentMethod, status, date
```

### User
```
name, email, password (hashed), role, isActive, isMaster
```

---

## User Roles

| Action | Master | Admin | Staff/Finance |
|---|---|---|---|
| Add / delete users | ✅ | ❌ | ❌ |
| Change user role | ✅ | ✅ | ❌ |
| Delete master account | ❌ | ❌ | ❌ |
| All other actions | ✅ | ✅ | ✅ |

---

## Default Credentials

| Role | Email | Password |
|---|---|---|
| Master Admin | `admin@madrasa.com` | `admin123` |

> Change the default password immediately after first login in production.
