const Program = require('../models/Program');

// GET /api/programs
const getPrograms = async (req, res, next) => {
  try {
    const programs = await Program.find().sort({ order: 1, name: 1 });
    res.json(programs);
  } catch (err) { next(err); }
};

// POST /api/programs
const createProgram = async (req, res, next) => {
  try {
    const { name, order } = req.body;
    if (!name?.trim()) return res.status(400).json({ message: 'Program name is required' });
    const exists = await Program.findOne({ name: name.trim() });
    if (exists) return res.status(400).json({ message: 'Program already exists' });
    const program = await Program.create({ name: name.trim(), order: order ?? 0 });
    res.status(201).json(program);
  } catch (err) { next(err); }
};

// PUT /api/programs/:id
const updateProgram = async (req, res, next) => {
  try {
    const { name, order } = req.body;
    const program = await Program.findById(req.params.id);
    if (!program) return res.status(404).json({ message: 'Program not found' });
    if (name !== undefined) program.name  = name.trim();
    if (order !== undefined) program.order = order;
    await program.save();
    res.json(program);
  } catch (err) { next(err); }
};

// DELETE /api/programs/:id
const deleteProgram = async (req, res, next) => {
  try {
    const program = await Program.findByIdAndDelete(req.params.id);
    if (!program) return res.status(404).json({ message: 'Program not found' });
    res.json({ message: 'Program deleted' });
  } catch (err) { next(err); }
};

module.exports = { getPrograms, createProgram, updateProgram, deleteProgram };
