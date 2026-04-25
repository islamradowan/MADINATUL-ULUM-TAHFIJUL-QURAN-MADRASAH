const Student = require('../models/Student');

// GET /api/students
const getStudents = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search, paymentStatus, class: classFilter, status } = req.query;
    const query = {};
    if (search) query.$or = [
      { name:  { $regex: search, $options: 'i' } },
      { class: { $regex: search, $options: 'i' } },
    ];
    if (classFilter) query.class = classFilter;
    if (status)      query.status = status;
    if (paymentStatus === 'Paid')    { query.due  = { $lte: 0 }; query.paid = { $gt: 0 }; }
    if (paymentStatus === 'Unpaid')  { query.paid = { $lte: 0 }; }
    if (paymentStatus === 'Partial') { query.due  = { $gt: 0 };  query.paid = { $gt: 0 }; }

    const total    = await Student.countDocuments(query);
    const students = await Student.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ students, total, page: Number(page) });
  } catch (err) { next(err); }
};

// GET /api/students/:id
const getStudentById = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student);
  } catch (err) { next(err); }
};

// POST /api/students
const createStudent = async (req, res, next) => {
  try {
    const student = await Student.create(req.body);
    res.status(201).json(student);
  } catch (err) { next(err); }
};

// PUT /api/students/:id
const updateStudent = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    Object.assign(student, req.body);
    await student.save(); // triggers pre-save hook for due calculation
    res.json(student);
  } catch (err) { next(err); }
};

// DELETE /api/students/:id
const deleteStudent = async (req, res, next) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json({ message: 'Student deleted' });
  } catch (err) { next(err); }
};

// GET /api/students/classes — distinct class/program values
const getClasses = async (req, res, next) => {
  try {
    const classes = await Student.distinct('class');
    res.json(classes.filter(Boolean).sort());
  } catch (err) { next(err); }
};

// GET /api/students/:id/fees — all monthly fee records
const getMonthlyFees = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id).select('monthlyFees fees name');
    if (!student) return res.status(404).json({ message: 'Student not found' });
    // Sort by year desc, month desc
    const sorted = [...student.monthlyFees].sort((a, b) =>
      b.year !== a.year ? b.year - a.year : b.month - a.month
    );
    res.json({ fees: sorted, monthlyRate: student.fees, name: student.name });
  } catch (err) { next(err); }
};

// POST /api/students/:id/fees — add or update a month entry
const upsertMonthlyFee = async (req, res, next) => {
  try {
    const { year, month, amount, paid, paidDate, note } = req.body;
    if (!year || !month) return res.status(400).json({ message: 'year and month are required' });

    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    const existing = student.monthlyFees.find(
      (f) => f.year === Number(year) && f.month === Number(month)
    );

    if (existing) {
      if (amount   !== undefined) existing.amount   = Number(amount);
      if (paid     !== undefined) existing.paid     = Number(paid);
      if (paidDate !== undefined) existing.paidDate = paidDate || null;
      if (note     !== undefined) existing.note     = note;
      existing.due = Math.max(0, existing.amount - existing.paid);
    } else {
      const feeAmount = amount !== undefined ? Number(amount) : student.fees;
      const feePaid   = paid   !== undefined ? Number(paid)   : 0;
      student.monthlyFees.push({
        year:     Number(year),
        month:    Number(month),
        amount:   feeAmount,
        paid:     feePaid,
        due:      Math.max(0, feeAmount - feePaid),
        paidDate: paidDate || null,
        note:     note || '',
        disabled: true,
      });
    }

    // cumulative paid/due recalculated by pre-save hook
    await student.save();
    const updated = student.monthlyFees.find(
      (f) => f.year === Number(year) && f.month === Number(month)
    );
    res.json(updated);
  } catch (err) { next(err); }
};

// POST /api/students/:id/fees/generate — auto-generate entries for a full year
const generateYearFees = async (req, res, next) => {
  try {
    const { year } = req.body;
    if (!year) return res.status(400).json({ message: 'year is required' });

    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    for (let m = 1; m <= 12; m++) {
      const exists = student.monthlyFees.find(
        (f) => f.year === Number(year) && f.month === m
      );
      if (!exists) {
        student.monthlyFees.push({
          year: Number(year), month: m,
          amount: student.fees, paid: 0,
          due: student.fees, paidDate: null, note: '',
          disabled: true,
        });
      }
    }
    await student.save();
    const yearFees = student.monthlyFees
      .filter((f) => f.year === Number(year))
      .sort((a, b) => a.month - b.month);
    res.json(yearFees);
  } catch (err) { next(err); }
};

// PATCH /api/students/:id/fees/:feeId/toggle — enable or disable a month
const toggleMonthlyFee = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    const entry = student.monthlyFees.id(req.params.feeId);
    if (!entry) return res.status(404).json({ message: 'Fee entry not found' });

    entry.disabled = !entry.disabled;

    // cumulative paid/due recalculated by pre-save hook
    await student.save();
    res.json(entry);
  } catch (err) { next(err); }
};

// DELETE /api/students/:id/fees/:feeId — permanently remove a month entry
const deleteMonthlyFee = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    const entry = student.monthlyFees.id(req.params.feeId);
    if (!entry) return res.status(404).json({ message: 'Fee entry not found' });

    entry.deleteOne();

    // cumulative paid/due recalculated by pre-save hook
    await student.save();
    res.json({ message: 'Fee entry deleted' });
  } catch (err) { next(err); }
};

module.exports = { getStudents, getStudentById, createStudent, updateStudent, deleteStudent, getClasses, getMonthlyFees, upsertMonthlyFee, generateYearFees, toggleMonthlyFee, deleteMonthlyFee };
