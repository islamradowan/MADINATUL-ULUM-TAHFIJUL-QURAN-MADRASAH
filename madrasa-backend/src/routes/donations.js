const express = require('express');
const { getDonations, getProjects, createDonation } = require('../controllers/donationController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/projects', getProjects);           // public — home page
router.route('/')
  .get(protect, getDonations)
  .post(createDonation);                        // public — donation form

module.exports = router;
