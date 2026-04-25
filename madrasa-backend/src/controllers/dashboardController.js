const Student  = require('../models/Student');
const Donation = require('../models/Donation');
const Zakat    = require('../models/Zakat');

const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

// GET /api/dashboard/stats
const getStats = async (req, res, next) => {
  try {
    const now          = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear  = new Date(now.getFullYear(), 0, 1);
    const lastMonth    = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    const [
      totalStudents,
      donationAgg,
      feeAgg,
      zakatAgg,
      thisMonthDonations,
      lastMonthDonations,
      thisYearDonations,
      donationByProject,
      monthlyDonations,
      recentDonations,
      topDonors,
      zakatStats,
      zakatByAllocation,
      paymentMethodBreakdown,
      donationStatusBreakdown,
      studentStatusBreakdown,
      recentZakat,
    ] = await Promise.all([
      Student.countDocuments({ status: 'Active' }),

      Donation.aggregate([
        { $match: { status: 'Completed' } },
        { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } },
      ]),

      Student.aggregate([
        { $group: { _id: null, feePaid: { $sum: '$paid' }, feeDue: { $sum: '$due' }, totalFees: { $sum: '$fees' }, count: { $sum: 1 } } },
      ]),

      Zakat.aggregate([
        { $match: { status: 'Verified' } },
        { $group: { _id: null, total: { $sum: '$totalAmount' }, count: { $sum: 1 } } },
      ]),

      Donation.aggregate([
        { $match: { status: 'Completed', date: { $gte: startOfMonth } } },
        { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } },
      ]),

      Donation.aggregate([
        { $match: { status: 'Completed', date: { $gte: lastMonth, $lte: endLastMonth } } },
        { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } },
      ]),

      Donation.aggregate([
        { $match: { status: 'Completed', date: { $gte: startOfYear } } },
        { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } },
      ]),

      Donation.aggregate([
        { $match: { status: 'Completed' } },
        { $group: { _id: '$projectType', total: { $sum: '$amount' }, count: { $sum: 1 } } },
        { $sort: { total: -1 } },
      ]),

      Donation.aggregate([
        { $match: { status: 'Completed' } },
        { $group: {
          _id:   { year: { $year: '$date' }, month: { $month: '$date' } },
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        }},
        { $sort: { '_id.year': -1, '_id.month': -1 } },
        { $limit: 6 },
      ]),

      Donation.find({ status: 'Completed' }).sort({ date: -1 }).limit(6).lean(),

      Donation.aggregate([
        { $match: { status: 'Completed' } },
        { $group: { _id: '$donorName', total: { $sum: '$amount' }, count: { $sum: 1 } } },
        { $sort: { total: -1 } },
        { $limit: 5 },
      ]),

      Zakat.aggregate([
        { $group: { _id: '$status', total: { $sum: '$totalAmount' }, count: { $sum: 1 } } },
      ]),

      Zakat.aggregate([
        { $match: { status: 'Verified' } },
        { $group: { _id: '$allocationType', total: { $sum: '$totalAmount' }, count: { $sum: 1 } } },
        { $sort: { total: -1 } },
      ]),

      Donation.aggregate([
        { $match: { status: 'Completed' } },
        { $group: { _id: '$paymentMethod', total: { $sum: '$amount' }, count: { $sum: 1 } } },
        { $sort: { total: -1 } },
      ]),

      Donation.aggregate([
        { $group: { _id: '$status', total: { $sum: '$amount' }, count: { $sum: 1 } } },
      ]),

      Student.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),

      Zakat.find().sort({ date: -1 }).limit(5).lean(),
    ]);

    const thisM  = thisMonthDonations[0]  ?? { total: 0, count: 0 };
    const lastM  = lastMonthDonations[0]  ?? { total: 0, count: 0 };
    const monthGrowth = lastM.total > 0
      ? Math.round(((thisM.total - lastM.total) / lastM.total) * 100)
      : null;

    // Build bar chart array oldest→newest
    const bars = [...monthlyDonations].reverse().map((m) => ({
      label: MONTH_NAMES[(m._id.month ?? 1) - 1],
      year:  m._id.year,
      total: m.total,
      count: m.count,
    }));

    res.json({
      // KPIs
      totalStudents,
      totalDonations:  donationAgg[0]?.total  ?? 0,
      totalDonorCount: donationAgg[0]?.count  ?? 0,
      feePaid:         feeAgg[0]?.feePaid     ?? 0,
      feeDue:          feeAgg[0]?.feeDue      ?? 0,
      totalFees:       feeAgg[0]?.totalFees   ?? 0,
      studentCount:    feeAgg[0]?.count       ?? 0,
      totalZakat:      zakatAgg[0]?.total     ?? 0,
      zakatCount:      zakatAgg[0]?.count     ?? 0,
      // Period stats
      thisMonth:  thisM,
      lastMonth:  lastM,
      thisYear:   thisYearDonations[0] ?? { total: 0, count: 0 },
      monthGrowth,
      // Charts & breakdowns
      donationByProject,
      monthlyBars: bars,
      recentDonations,
      topDonors,
      zakatStats,
      zakatByAllocation,
      paymentMethodBreakdown,
      donationStatusBreakdown,
      studentStatusBreakdown,
      recentZakat,
    });
  } catch (err) { next(err); }
};

module.exports = { getStats };
