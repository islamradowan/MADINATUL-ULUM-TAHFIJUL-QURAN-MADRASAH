require('dotenv').config();
const express    = require('express');
const cors       = require('cors');
const connectDB  = require('./src/config/db');

const authRoutes       = require('./src/routes/auth');
const studentRoutes    = require('./src/routes/students');
const donationRoutes   = require('./src/routes/donations');
const zakatRoutes      = require('./src/routes/zakat');
const reportRoutes     = require('./src/routes/reports');
const dashboardRoutes  = require('./src/routes/dashboard');
const contactRoutes        = require('./src/routes/contact');
const transparencyRoutes   = require('./src/routes/transparency');
const userRoutes           = require('./src/routes/users');
const programRoutes        = require('./src/routes/programs');
const { errorHandler }     = require('./src/middleware/errorMiddleware');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
const allowedOrigins = [
  'http://localhost:3000',
  process.env.FRONTEND_URL,
].filter(Boolean);
app.use(cors({ origin: "https://madinatul-ulum-tahfijul-quran-madra.vercel.app/" }));
app.use(express.json());

// Routes
app.use('/api/auth',      authRoutes);
app.use('/api/students',  studentRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/zakat',     zakatRoutes);
app.use('/api/reports',   reportRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/contact',       contactRoutes);
app.use('/api/transparency',  transparencyRoutes);
app.use('/api/users',         userRoutes);
app.use('/api/programs',      programRoutes);

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'OK' }));

// Error handler (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
