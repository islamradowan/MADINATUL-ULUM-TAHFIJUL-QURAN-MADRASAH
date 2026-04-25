const express = require('express');
const { getReports, exportReport } = require('../controllers/reportController');
const { protect }    = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/export', protect, exportReport);
router.get('/',       protect, getReports);

module.exports = router;
