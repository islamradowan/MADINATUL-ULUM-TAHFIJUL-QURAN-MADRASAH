const Donation = require('../models/Donation');
const Student  = require('../models/Student');
const Zakat    = require('../models/Zakat');

// GET /api/reports/export
const exportReport = async (req, res, next) => {
  try {
    const { category = 'donations', startDate, endDate, format = 'csv' } = req.query;

    const dateFilter = {};
    if (startDate) dateFilter.$gte = new Date(startDate);
    if (endDate)   dateFilter.$lte = new Date(endDate);

    let rows = [];
    let headers = [];

    if (category === 'donations') {
      const query = Object.keys(dateFilter).length ? { date: dateFilter } : {};
      const data  = await Donation.find(query).sort({ date: -1 }).lean();
      headers = ['ID', 'Donor', 'Project', 'Amount', 'Payment Method', 'Status', 'Date'];
      rows    = data.map((d) => [
        d._id, d.donorName, d.projectType, d.amount, d.paymentMethod, d.status,
        new Date(d.date).toLocaleDateString(),
      ]);
    } else if (category === 'students') {
      const data = await Student.find().sort({ createdAt: -1 }).lean();
      headers = ['ID', 'Name', 'Class', 'Guardian', 'Phone', 'Fees', 'Paid', 'Due', 'Status'];
      rows    = data.map((s) => [
        s._id, s.name, s.class, s.guardian, s.phone, s.fees, s.paid, s.due, s.status,
      ]);
    } else if (category === 'zakat') {
      const query = Object.keys(dateFilter).length ? { date: dateFilter } : {};
      const data  = await Zakat.find(query).sort({ date: -1 }).lean();
      headers = ['ID', 'Donor', 'Amount', 'Allocation', 'Payment Method', 'Status', 'Date'];
      rows    = data.map((z) => [
        z._id, z.donorName, z.totalAmount, z.allocationType, z.paymentMethod, z.status,
        new Date(z.date).toLocaleDateString(),
      ]);
    }

    const escapeCSV = (val) => `"${String(val ?? '').replace(/"/g, '""')}"`;
    const csv = [headers, ...rows].map((r) => r.map(escapeCSV).join(',')).join('\n');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${category}-report.csv"`);
    res.send(csv);
  } catch (err) { next(err); }
};

// GET /api/reports
const getReports = async (req, res, next) => {
  try {
    const now          = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear  = new Date(now.getFullYear(), 0, 1);

    const [
      donationByProject,
      monthlyDonations,
      feeStats,
      zakatStats,
      donationStatusBreakdown,
      thisMonthDonations,
      thisYearDonations,
      studentStatusBreakdown,
      recentDonations,
      topDonors,
      zakatByAllocation,
      paymentMethodBreakdown,
    ] = await Promise.all([
      // Donations grouped by project
      Donation.aggregate([
        { $match: { status: 'Completed' } },
        { $group: { _id: '$projectType', total: { $sum: '$amount' }, count: { $sum: 1 } } },
        { $sort: { total: -1 } },
      ]),
      // Monthly donations — last 12 months
      Donation.aggregate([
        { $match: { status: 'Completed' } },
        { $group: {
          _id:   { year: { $year: '$date' }, month: { $month: '$date' } },
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        }},
        { $sort: { '_id.year': -1, '_id.month': -1 } },
        { $limit: 12 },
      ]),
      // Fee stats
      Student.aggregate([
        { $group: { _id: null, totalFees: { $sum: '$fees' }, totalPaid: { $sum: '$paid' }, totalDue: { $sum: '$due' }, count: { $sum: 1 } } },
      ]),
      // Zakat by status
      Zakat.aggregate([
        { $group: { _id: '$status', total: { $sum: '$totalAmount' }, count: { $sum: 1 } } },
      ]),
      // Donation status breakdown (Completed/Pending/Failed)
      Donation.aggregate([
        { $group: { _id: '$status', total: { $sum: '$amount' }, count: { $sum: 1 } } },
      ]),
      // This month donations
      Donation.aggregate([
        { $match: { status: 'Completed', date: { $gte: startOfMonth } } },
        { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } },
      ]),
      // This year donations
      Donation.aggregate([
        { $match: { status: 'Completed', date: { $gte: startOfYear } } },
        { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } },
      ]),
      // Student status breakdown
      Student.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      // Recent 5 donations
      Donation.find({ status: 'Completed' }).sort({ date: -1 }).limit(5).lean(),
      // Top 5 donors by total
      Donation.aggregate([
        { $match: { status: 'Completed' } },
        { $group: { _id: '$donorName', total: { $sum: '$amount' }, count: { $sum: 1 } } },
        { $sort: { total: -1 } },
        { $limit: 5 },
      ]),
      // Zakat by allocation type
      Zakat.aggregate([
        { $match: { status: 'Verified' } },
        { $group: { _id: '$allocationType', total: { $sum: '$totalAmount' }, count: { $sum: 1 } } },
        { $sort: { total: -1 } },
      ]),
      // Payment method breakdown
      Donation.aggregate([
        { $match: { status: 'Completed' } },
        { $group: { _id: '$paymentMethod', total: { $sum: '$amount' }, count: { $sum: 1 } } },
        { $sort: { total: -1 } },
      ]),
    ]);

    res.json({
      donationByProject,
      monthlyDonations,
      feeStats:              feeStats[0] ?? {},
      zakatStats,
      donationStatusBreakdown,
      thisMonth:             thisMonthDonations[0]  ?? { total: 0, count: 0 },
      thisYear:              thisYearDonations[0]   ?? { total: 0, count: 0 },
      studentStatusBreakdown,
      recentDonations,
      topDonors,
      zakatByAllocation,
      paymentMethodBreakdown,
    });
  } catch (err) { next(err); }
};

module.exports = { getReports, exportReport };
