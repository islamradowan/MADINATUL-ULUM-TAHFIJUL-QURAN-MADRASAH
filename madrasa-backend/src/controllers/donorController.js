const jwt      = require('jsonwebtoken');
const Donor    = require('../models/Donor');
const Donation = require('../models/Donation');
const Zakat    = require('../models/Zakat');

const generateToken = (id) =>
  jwt.sign({ id, type: 'donor' }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

// POST /api/donor/register
const register = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: 'Name, email and password are required' });
    if (password.length < 6)
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    if (await Donor.findOne({ email }))
      return res.status(409).json({ message: 'Email already registered' });

    const donor = await Donor.create({ name, email, password, phone });
    res.status(201).json({
      token: generateToken(donor._id),
      donor: { id: donor._id, name: donor.name, email: donor.email, phone: donor.phone },
    });
  } catch (err) { next(err); }
};

// POST /api/donor/login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: 'Email and password are required' });

    const donor = await Donor.findOne({ email });
    if (!donor || !(await donor.matchPassword(password)))
      return res.status(401).json({ message: 'Invalid email or password' });

    res.json({
      token: generateToken(donor._id),
      donor: { id: donor._id, name: donor.name, email: donor.email, phone: donor.phone },
    });
  } catch (err) { next(err); }
};

// GET /api/donor/me
const getMe = (req, res) => res.json({ donor: req.donor });

// GET /api/donor/my-donations
const myDonations = async (req, res, next) => {
  try {
    const zakatQuery = req.donor.email
      ? { $or: [{ donorId: req.donor._id }, { donorEmail: req.donor.email }] }
      : { donorId: req.donor._id };

    const [donations, zakatRecords] = await Promise.all([
      Donation.find({ donorEmail: req.donor.email }).sort({ date: -1 }),
      Zakat.find(zakatQuery).sort({ date: -1 }),
    ]);

    const totalDonated = donations
      .filter(d => d.status === 'Completed')
      .reduce((sum, d) => sum + d.amount, 0);

    const totalZakat = zakatRecords
      .filter(z => z.status === 'Verified')
      .reduce((sum, z) => sum + z.totalAmount, 0);

    const byProject = donations.reduce((acc, d) => {
      if (d.status !== 'Completed') return acc;
      acc[d.projectType] = (acc[d.projectType] || 0) + d.amount;
      return acc;
    }, {});

    res.json({
      donations,
      zakatRecords,
      totalGiven: totalDonated + totalZakat,
      totalDonated,
      totalZakat,
      byProject,
    });
  } catch (err) { next(err); }
};

module.exports = { register, login, getMe, myDonations };
