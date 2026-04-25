const Donation = require('../models/Donation');
const Student  = require('../models/Student');
const Zakat    = require('../models/Zakat');

// GET /api/transparency  — public, no auth required
const getTransparency = async (req, res, next) => {
  try {
    const [donationByProject, monthlyDonations, donationTotals, zakatStats, studentCount] = await Promise.all([
      // Breakdown by project
      Donation.aggregate([
        { $match: { status: 'Completed' } },
        { $group: { _id: '$projectType', total: { $sum: '$amount' }, count: { $sum: 1 } } },
        { $sort: { total: -1 } },
      ]),
      // Last 6 months monthly totals
      Donation.aggregate([
        { $match: { status: 'Completed' } },
        { $group: {
          _id:   { year: { $year: '$date' }, month: { $month: '$date' } },
          total: { $sum: '$amount' },
        }},
        { $sort: { '_id.year': -1, '_id.month': -1 } },
        { $limit: 6 },
      ]),
      // Overall donation totals
      Donation.aggregate([
        { $match: { status: 'Completed' } },
        { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } },
      ]),
      // Zakat totals
      Zakat.aggregate([
        { $group: { _id: '$status', total: { $sum: '$totalAmount' }, count: { $sum: 1 } } },
      ]),
      // Active students
      Student.countDocuments({ status: 'Active' }),
    ]);

    const totalDonations  = donationTotals[0]?.total ?? 0;
    const totalDonors     = donationTotals[0]?.count ?? 0;
    const zakatVerified   = zakatStats.find((z) => z._id === 'Verified')?.total ?? 0;

    res.json({
      totalDonations,
      totalDonors,
      totalStudents: studentCount,
      zakatVerified,
      donationByProject,
      monthlyDonations,
    });
  } catch (err) { next(err); }
};

module.exports = { getTransparency };
