const express = require('express');
const router = express.Router();
const statisticsController = require('../controllers/statisticsController');
const candidateController = require('../controllers/candidateController');
const authMiddleware = require('../middleware/auth');
const roleMiddleware = require('../middleware/role');

router.get('/statistics', authMiddleware, statisticsController.getStatistics);
router.get('/report', authMiddleware, roleMiddleware(['kepala_sekolah', 'admin', 'superadmin', 'pembina']), statisticsController.getReportData);
router.get('/result', authMiddleware, candidateController.getCandidateResults);

module.exports = router;
