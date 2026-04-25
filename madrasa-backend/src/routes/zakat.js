const express = require('express');
const { calculate, donate, getZakatRecords, updateZakatStatus } = require('../controllers/zakatController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/calculate', calculate);
router.post('/donate',    donate);
router.get('/',           protect, getZakatRecords);
router.patch('/:id',      protect, updateZakatStatus);

module.exports = router;
