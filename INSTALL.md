# 🕌 An-Nusrah Foundation Portal — Complete Installation Guide

> Hand this file to anyone. Everything needed to run the project from scratch is here.

---

## 📋 Table of Contents

1. [What You Need First (Prerequisites)](#1-prerequisites)
2. [Project Structure](#2-project-structure)
3. [Step 1 — Extract the Project](#step-1--extract-the-project)
4. [Step 2 — Backend Setup](#step-2--backend-setup)
5. [Step 3 — Frontend Setup](#step-3--frontend-setup)
6. [Step 4 — Seed the Database](#step-4--seed-the-database)
7. [Step 5 — Run the Project](#step-5--run-the-project)
8. [All Credentials & API Keys](#all-credentials--api-keys)
9. [Default Login Accounts](#default-login-accounts)
10. [Troubleshooting](#troubleshooting)
11. [Deployment (Optional)](#deployment-optional)

---

## 1. Prerequisites

Install these on your PC **before** anything else.

| Tool | Version | Download |
|---|---|---|
| Node.js | 18 or higher | https://nodejs.org (choose LTS) |
| npm | comes with Node.js | — |
| Git (optional) | any | https://git-scm.com |

### How to check if Node.js is installed

Open **Command Prompt** or **Terminal** and run:

```bash
node -v
npm -v
```

You should see version numbers like `v18.x.x` and `10.x.x`. If you get an error, install Node.js first.

---

## 2. Project Structure

After extracting the zip, you will see:

```
MADINATUL ULUM TAHFIJUL QURAN MADRASAH/
├── madrasa-backend/        ← Express REST API (runs on port 5000)
├── madrasa-portal/         ← React frontend (runs on port 3000)
├── diagram/                ← System diagrams (not needed to run)
└── INSTALL.md              ← This file
```

---

## Step 1 — Extract the Project

1. Right-click the `.zip` or `.rar` file
2. Click **Extract Here** (or Extract All)
3. Open the extracted folder — you should see `madrasa-backend` and `madrasa-portal` folders

---

## Step 2 — Backend Setup

### 2a. Open a terminal in the backend folder

- On **Windows**: Hold `Shift` + Right-click inside the `madrasa-backend` folder → **Open PowerShell window here** (or Command Prompt)
- On **Mac/Linux**: Open Terminal, then `cd` into the folder

### 2b. Install dependencies

```bash
cd madrasa-backend
npm install
```

Wait for it to finish (may take 1–2 minutes).

### 2c. Create the `.env` file

Create a file named exactly `.env` inside the `madrasa-backend` folder.

> ⚠️ The file name starts with a dot. On Windows, you may need to create it via Notepad: File → Save As → type `.env` → Save as type: All Files

Paste this **exact content** into the file:

```env
PORT=5000
MONGO_URI=mongodb+srv://MADINATUL_ULUM_TAHFIJUL_QURAN_MADRASAH_Trust_db_user:x4JOPKMeggHCLNbW@cluster0.mdpkeny.mongodb.net/madrasa_portal?retryWrites=true&w=majority
JWT_SECRET=madrasa_super_secret_jwt_key_2024
JWT_EXPIRES_IN=7d
NODE_ENV=development

# SSLCommerz Payment Gateway (Sandbox)
SSLCOMMERZ_STORE_ID=emoni69f6727ef01bb
SSLCOMMERZ_STORE_PASSWORD=emoni69f6727ef01bb@ssl
SSLCOMMERZ_IS_LIVE=false

# URLs
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:5000

# Gold Price API
GOLD_API_KEY=goldapi-765d4d671cbe4a00c16937ef48483f3d-io
```

> ✅ The MongoDB database is already hosted on MongoDB Atlas (cloud). No local MongoDB installation needed.

---

## Step 3 — Frontend Setup

### 3a. Open a NEW terminal in the frontend folder

Keep the backend terminal open. Open a **second** terminal window.

```bash
cd madrasa-portal
npm install
```

Wait for it to finish (may take 2–3 minutes).

### 3b. Create the `.env` file

Create a file named `.env` inside the `madrasa-portal` folder with this content:

```env
REACT_APP_API_BASE_URL=http://localhost:5000/api
```

---

## Step 4 — Seed the Database

This creates all the sample data (students, donations, admin user, demo donor).

In the **backend terminal**:

```bash
cd madrasa-backend
npm run seed
```

You should see:

```
Connected to MongoDB
Cleared existing data
Master admin created — email: admin@madrasa.com | password: admin123
Demo donor created — email: donor@madrasa.com | password: donor123
Students seeded
Donations seeded
Zakat seeded

✅ Seed complete!
```

> ⚠️ Only run seed once, or when you want to reset all data. Running it again will **delete everything** and start fresh.

---

## Step 5 — Run the Project

You need **two terminals running at the same time**.

### Terminal 1 — Start the Backend

```bash
cd madrasa-backend
npm run dev
```

You should see:
```
Server running on port 5000
MongoDB Connected
```

### Terminal 2 — Start the Frontend

```bash
cd madrasa-portal
npm start
```

The browser will open automatically at:

```
http://localhost:3000
```

> If the browser doesn't open, manually go to http://localhost:3000

---

## All Credentials & API Keys

### 🗄️ MongoDB Atlas (Database)

| Field | Value |
|---|---|
| Connection String | `mongodb+srv://MADINATUL_ULUM_TAHFIJUL_QURAN_MADRASAH_Trust_db_user:x4JOPKMeggHCLNbW@cluster0.mdpkeny.mongodb.net/madrasa_portal` |
| Database Name | `madrasa_portal` |
| Atlas Dashboard | https://cloud.mongodb.com |
| Username | `MADINATUL_ULUM_TAHFIJUL_QURAN_MADRASAH_Trust_db_user` |
| Password | `x4JOPKMeggHCLNbW` |

> The database is cloud-hosted. You only need internet access — no local MongoDB needed.

---

### 💳 SSLCommerz Payment Gateway (Sandbox)

Used for donation and zakat payments.

| Field | Value |
|---|---|
| Store ID | `emoni69f6727ef01bb` |
| Store Password | `emoni69f6727ef01bb@ssl` |
| Mode | Sandbox (test mode — no real money) |
| Dashboard | https://sandbox.sslcommerz.com |

> To go live with real payments, set `SSLCOMMERZ_IS_LIVE=true` and replace with live credentials from https://sslcommerz.com

---

### 🥇 Gold Price API

Used for live gold price in the Zakat Calculator.

| Field | Value |
|---|---|
| API Key | `goldapi-765d4d671cbe4a00c16937ef48483f3d-io` |
| Provider | https://www.goldapi.io |
| Dashboard | https://www.goldapi.io/dashboard |

> If the API key expires, get a free key at https://www.goldapi.io and update `GOLD_API_KEY` in `madrasa-backend/.env`

---

### 🔐 JWT Secret

Used to sign authentication tokens.

| Field | Value |
|---|---|
| JWT_SECRET | `madrasa_super_secret_jwt_key_2024` |
| Expiry | `7d` (7 days) |

---

## Default Login Accounts

### Admin Portal — `/admin/login`

| Role | Email | Password | Access |
|---|---|---|---|
| Master Admin | `admin@madrasa.com` | `admin123` | Full access, cannot be deleted |

> ⚠️ Change this password immediately in production via Settings → Change Password

### Donor Portal — `/donor/login`

| Role | Email | Password | Access |
|---|---|---|---|
| Demo Donor | `donor@madrasa.com` | `donor123` | View own donation history |

---

## Portal URLs

| Page | URL |
|---|---|
| Home | http://localhost:3000 |
| Donate | http://localhost:3000/donate |
| Zakat Calculator | http://localhost:3000/zakat |
| Donor Login | http://localhost:3000/donor/login |
| Donor Dashboard | http://localhost:3000/donor/dashboard |
| Admin Login | http://localhost:3000/admin/login |
| Admin Dashboard | http://localhost:3000/admin |
| API Health Check | http://localhost:5000/api/health |

---

## Troubleshooting

### ❌ `ERR_CONNECTION_REFUSED` on port 5000

The backend is not running. Open a terminal and run:
```bash
cd madrasa-backend
npm run dev
```

### ❌ `npm install` fails

Make sure Node.js 18+ is installed:
```bash
node -v
```
If version is below 18, download the latest LTS from https://nodejs.org

### ❌ MongoDB connection error

- Check your internet connection (the database is cloud-hosted)
- Make sure the `.env` file exists in `madrasa-backend/` with the correct `MONGO_URI`
- The MongoDB Atlas cluster may need your IP whitelisted — log in at https://cloud.mongodb.com → Network Access → Add IP Address → Allow Access from Anywhere (`0.0.0.0/0`)

### ❌ `.env` file not working

- Make sure the file is named `.env` (not `.env.txt` or `env`)
- On Windows, open File Explorer → View → check **File name extensions** to see the real extension
- The `.env` file must be directly inside `madrasa-backend/` (not in a subfolder)

### ❌ Port 3000 or 5000 already in use

Kill the process using the port:

**Windows:**
```bash
netstat -ano | findstr :5000
taskkill /PID <PID_NUMBER> /F
```

**Mac/Linux:**
```bash
lsof -ti:5000 | xargs kill
```

### ❌ Seed fails with validation error

Make sure you are running seed from inside the `madrasa-backend` folder:
```bash
cd madrasa-backend
npm run seed
```

---

## Deployment (Optional)

### Deploy Backend to Render (free)

1. Go to https://render.com and create a free account
2. New → Web Service → connect your GitHub repo
3. Root Directory: `madrasa-backend`
4. Build Command: `npm install`
5. Start Command: `npm start`
6. Add all environment variables from the `.env` file above
7. After deploy, copy the URL (e.g. `https://your-app.onrender.com`)

### Deploy Frontend to Vercel (free)

1. Go to https://vercel.com and create a free account
2. Import your GitHub repo
3. Root Directory: `madrasa-portal`
4. Framework: Create React App
5. Add environment variable:
   - `REACT_APP_API_BASE_URL` = `https://your-render-backend-url.onrender.com/api`
6. Deploy

### After deploying both

Update `madrasa-backend/.env`:
```env
FRONTEND_URL=https://your-vercel-app.vercel.app
BACKEND_URL=https://your-render-app.onrender.com
NODE_ENV=production
```

Also update the CORS allowed origins in `madrasa-backend/server.js` to include your Vercel URL.

---

## Tech Stack Summary

| Layer | Technology | Version |
|---|---|---|
| Frontend | React | 19 |
| Routing | React Router | 7 |
| Styling | Tailwind CSS | 3 |
| Backend | Node.js + Express | 18+ / 4 |
| Database | MongoDB (Atlas) | Cloud |
| ODM | Mongoose | 8 |
| Auth | JWT + bcryptjs | — |
| Payments | SSLCommerz | Sandbox |
| HTTP Client | Axios | — |
| Dev Server | Nodemon | — |

---

## Quick Start Summary (Copy-Paste)

```bash
# Terminal 1 — Backend
cd madrasa-backend
npm install
# create .env file with contents shown above
npm run seed
npm run dev

# Terminal 2 — Frontend
cd madrasa-portal
npm install
# create .env file with contents shown above
npm start
```

Then open: **http://localhost:3000**

---

*An-Nusrah Foundation Portal — Madinatul Ulum Tahfijul Quran Madrasah Trust*
