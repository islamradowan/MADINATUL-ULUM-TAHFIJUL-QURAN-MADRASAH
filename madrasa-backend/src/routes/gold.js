const express = require('express');
const { getGoldPrice } = require('../controllers/goldController');
const router = express.Router();

router.get('/', getGoldPrice);

module.exports = router;
