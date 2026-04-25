const Zakat = require('../models/Zakat');

// Islamic Nisab thresholds (fixed weights per Shariah)
// Nisab of Silver: 612.36 grams
// Nisab of Gold:   87.48 grams
// Rate: 2.5% of net zakatable wealth
const NISAB_SILVER_GRAMS = 612.36;
const NISAB_GOLD_GRAMS   = 87.48;
const ZAKAT_RATE         = 0.025;

// Approximate market rates in BDT (updated periodically)
// Silver: ~1 gram ≈ ৳110 BDT | Gold: ~1 gram ≈ ৳9,500 BDT
const SILVER_RATE_BDT = 110;
const GOLD_RATE_BDT   = 9500;

const NISAB_SILVER_BDT = NISAB_SILVER_GRAMS * SILVER_RATE_BDT; // ~৳67,360
const NISAB_GOLD_BDT   = NISAB_GOLD_GRAMS   * GOLD_RATE_BDT;   // ~৳831,060

// POST /api/zakat/calculate
// Body: { cash, goldGrams, silverGrams, investments, businessGoods, receivables, debts }
const calculate = (req, res) => {
  const {
    cash         = 0,
    goldGrams    = 0,
    silverGrams  = 0,
    investments  = 0,
    businessGoods= 0,
    receivables  = 0,
    debts        = 0,
  } = req.body;

  // Convert gold & silver grams to BDT value
  const goldValue   = Number(goldGrams)   * GOLD_RATE_BDT;
  const silverValue = Number(silverGrams) * SILVER_RATE_BDT;

  // Total zakatable assets
  const totalAssets = Number(cash) + goldValue + silverValue +
                      Number(investments) + Number(businessGoods) + Number(receivables);

  // Net wealth after deducting immediate debts
  const netWealth = Math.max(0, totalAssets - Number(debts));

  // Nisab: use the lower of gold/silver nisab (silver nisab is the standard used by most scholars)
  const nisabThreshold = NISAB_SILVER_BDT;
  const nisabMet       = netWealth >= nisabThreshold;
  const zakatDue       = nisabMet ? +(netWealth * ZAKAT_RATE).toFixed(2) : 0;

  res.json({
    netWealth:       +netWealth.toFixed(2),
    totalAssets:     +totalAssets.toFixed(2),
    goldValue:       +goldValue.toFixed(2),
    silverValue:     +silverValue.toFixed(2),
    nisabThreshold:  +nisabThreshold.toFixed(2),
    nisabMet,
    zakatDue,
    zakatRate:       ZAKAT_RATE,
    rates: {
      goldPerGram:   GOLD_RATE_BDT,
      silverPerGram: SILVER_RATE_BDT,
    },
  });
};

// POST /api/zakat/donate
const donate = async (req, res, next) => {
  try {
    const { donorName, totalAmount, allocationType, paymentMethod } = req.body;
    if (!totalAmount || Number(totalAmount) <= 0)
      return res.status(400).json({ message: 'Invalid zakat amount' });
    if (!allocationType)
      return res.status(400).json({ message: 'Allocation type is required' });

    const zakat = await Zakat.create({
      donorName:     donorName || 'Anonymous',
      totalAmount:   Number(totalAmount),
      allocationType,
      paymentMethod: paymentMethod || 'Cash',
    });
    res.status(201).json(zakat);
  } catch (err) { next(err); }
};

// GET /api/zakat
const getZakatRecords = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search, status, allocationType, paymentMethod, dateFrom, dateTo } = req.query;
    const query = {};
    if (search)        query.donorName      = { $regex: search, $options: 'i' };
    if (status)        query.status         = status;
    if (allocationType) query.allocationType = allocationType;
    if (paymentMethod) query.paymentMethod  = paymentMethod;
    if (dateFrom || dateTo) {
      query.date = {};
      if (dateFrom) query.date.$gte = new Date(dateFrom);
      if (dateTo)   query.date.$lte = new Date(new Date(dateTo).setHours(23, 59, 59, 999));
    }
    const total   = await Zakat.countDocuments(query);
    const records = await Zakat.find(query)
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    res.json({ records, total });
  } catch (err) { next(err); }
};

// PATCH /api/zakat/:id  — update status (Verified/Pending)
const updateZakatStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['Verified', 'Pending'].includes(status))
      return res.status(400).json({ message: 'Invalid status' });
    const record = await Zakat.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!record) return res.status(404).json({ message: 'Record not found' });
    res.json(record);
  } catch (err) { next(err); }
};

module.exports = { calculate, donate, getZakatRecords, updateZakatStatus };
