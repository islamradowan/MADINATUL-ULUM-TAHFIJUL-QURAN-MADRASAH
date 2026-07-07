const express = require('express');
const { register, login, getMe, myDonations } = require('../controllers/donorController');
const { protectDonor } = require('../middleware/donorAuthMiddleware');
const router = express.Router();

router.post('/register',     register);
router.post('/login',        login);
router.get('/me',            protectDonor, getMe);
router.get('/my-donations',  protectDonor, myDonations);

module.exports = router;
