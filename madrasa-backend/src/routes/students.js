const express = require('express');
const {
  getStudents, getStudentById, createStudent, updateStudent, deleteStudent,
  getClasses, getMonthlyFees, upsertMonthlyFee, generateYearFees,
  toggleMonthlyFee, deleteMonthlyFee,
} = require('../controllers/studentController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/classes', protect, getClasses);

router.route('/')
  .get(protect, getStudents)
  .post(protect, createStudent);

// Monthly fee routes — must be before /:id
router.get('/:id/fees',                 protect, getMonthlyFees);
router.post('/:id/fees',                protect, upsertMonthlyFee);
router.post('/:id/fees/generate',       protect, generateYearFees);
router.patch('/:id/fees/:feeId/toggle', protect, toggleMonthlyFee);
router.delete('/:id/fees/:feeId',       protect, deleteMonthlyFee);

router.route('/:id')
  .get(protect, getStudentById)
  .put(protect, updateStudent)
  .delete(protect, deleteStudent);

module.exports = router;
