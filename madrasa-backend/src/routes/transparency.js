const express = require('express');
const { getTransparency } = require('../controllers/transparencyController');
const router = express.Router();

router.get('/', getTransparency); // public

module.exports = router;
