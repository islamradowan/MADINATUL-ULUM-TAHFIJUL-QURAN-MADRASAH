const User = require('../models/User');

// GET /api/users
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) { next(err); }
};

// POST /api/users
const createUser = async (req, res, next) => {
  try {
    if (!req.user.isMaster)
      return res.status(403).json({ message: 'Only the master user can add new users' });
    const { name, email, password, role } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: 'Name, email and password are required' });
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already in use' });
    const user = await User.create({ name, email, password, role });
    res.status(201).json({ _id: user._id, name: user.name, email: user.email, role: user.role, isActive: user.isActive, isMaster: user.isMaster });
  } catch (err) { next(err); }
};

// PUT /api/users/:id
const updateUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.isMaster) return res.status(403).json({ message: 'Master user cannot be modified' });
    const { name, email, role, isActive } = req.body;
    if (name     !== undefined) user.name     = name;
    if (email    !== undefined) user.email    = email;
    if (role     !== undefined) {
      if (!req.user.isMaster && req.user.role !== 'admin')
        return res.status(403).json({ message: 'Only master or admin can change roles' });
      user.role = role;
    }
    if (isActive !== undefined) user.isActive = isActive;
    await user.save();
    res.json({ _id: user._id, name: user.name, email: user.email, role: user.role, isActive: user.isActive, isMaster: user.isMaster });
  } catch (err) { next(err); }
};

// DELETE /api/users/:id
const deleteUser = async (req, res, next) => {
  try {
    if (!req.user.isMaster)
      return res.status(403).json({ message: 'Only the master user can delete users' });
    if (req.params.id === req.user._id.toString())
      return res.status(400).json({ message: 'You cannot delete your own account' });
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.isMaster) return res.status(403).json({ message: 'Master user cannot be deleted' });
    await user.deleteOne();
    res.json({ message: 'User deleted' });
  } catch (err) { next(err); }
};

module.exports = { getUsers, createUser, updateUser, deleteUser };
