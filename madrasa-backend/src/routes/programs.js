const express = require('express');
const { getPrograms, createProgram, updateProgram, deleteProgram } = require('../controllers/programController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/').get(protect, getPrograms).post(protect, createProgram);
router.route('/:id').put(protect, updateProgram).delete(protect, deleteProgram);

module.exports = router;
