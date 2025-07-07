const express = require('express');
const router = express.Router();
const { createDiaryEntry, getDailyDashboard,logWater,logWeight } = require('../controllers/diaryController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/diary', authMiddleware, createDiaryEntry);
router.get('/dashboard', authMiddleware, getDailyDashboard);
router.post('/water', authMiddleware, logWater);
router.post('/weight', authMiddleware, logWeight);

module.exports = router;