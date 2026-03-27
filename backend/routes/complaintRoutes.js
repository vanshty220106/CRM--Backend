const express = require('express');
const { getComplaints, getStats, createComplaint } = require('../controllers/complaintController');
const auth = require('../middlewares/auth');

const router = express.Router();

// Public routes (anyone can see complaints and stats on a public dashboard)
router.get('/', getComplaints);
router.get('/stats', getStats);

// Protected routes (must be logged in to submit)
router.use(auth);
router.post('/', createComplaint);

module.exports = router;
