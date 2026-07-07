const jwt   = require('jsonwebtoken');
const Donor = require('../models/Donor');

const protectDonor = async (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer '))
    return res.status(401).json({ message: 'Not authorized, no token' });
  try {
    const token   = auth.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.type !== 'donor')
      return res.status(401).json({ message: 'Not a donor token' });
    req.donor = await Donor.findById(decoded.id).select('-password');
    if (!req.donor) return res.status(401).json({ message: 'Donor not found' });
    next();
  } catch {
    res.status(401).json({ message: 'Not authorized, invalid token' });
  }
};

module.exports = { protectDonor };
