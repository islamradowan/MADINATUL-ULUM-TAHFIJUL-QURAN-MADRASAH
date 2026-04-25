const Contact = require('../models/Contact');

// POST /api/contact
const sendMessage = async (req, res, next) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message)
      return res.status(400).json({ message: 'All fields are required' });
    await Contact.create({ name, email, message });
    res.status(201).json({ message: 'Message sent successfully' });
  } catch (err) { next(err); }
};

module.exports = { sendMessage };
