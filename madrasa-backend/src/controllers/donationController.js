const Donation = require('../models/Donation');

// GET /api/donations
const getDonations = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search, status, projectType } = req.query;
    const query = {};
    if (status)      query.status      = status;
    if (projectType) query.projectType = projectType;
    if (search) query.$or = [
      { donorName:   { $regex: search, $options: 'i' } },
      { projectType: { $regex: search, $options: 'i' } },
    ];

    const total     = await Donation.countDocuments(query);
    const donations = await Donation.find(query)
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    // Summary stats
    const [agg] = await Donation.aggregate([
      { $match: { status: 'Completed' } },
      { $group: { _id: null, total: { $sum: '$amount' }, donors: { $addToSet: '$donorName' } } },
    ]);
    const pending = await Donation.countDocuments({ status: 'Pending' });

    res.json({
      donations,
      total,
      page: Number(page),
      stats: {
        total:   agg?.total   ?? 0,
        donors:  agg?.donors?.length ?? 0,
        pending,
      },
    });
  } catch (err) { next(err); }
};

// GET /api/donations/projects
const getProjects = async (req, res, next) => {
  try {
    const projects = await Donation.aggregate([
      { $match: { status: 'Completed' } },
      { $group: {
        _id:         '$projectType',
        projectType: { $first: '$projectType' },
        raisedAmount:{ $sum: '$amount' },
        count:       { $sum: 1 },
      }},
      { $sort: { raisedAmount: -1 } },
    ]);
    res.json(projects);
  } catch (err) { next(err); }
};

// POST /api/donations
const createDonation = async (req, res, next) => {
  try {
    const donation = await Donation.create(req.body);
    res.status(201).json(donation);
  } catch (err) { next(err); }
};

module.exports = { getDonations, getProjects, createDonation };
