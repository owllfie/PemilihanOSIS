const express = require('express');
const router = express.Router();
const periodController = require('../controllers/periodController');
const authMiddleware = require('../middleware/auth');
const roleMiddleware = require('../middleware/role');

router.get('/', authMiddleware, periodController.getAllPeriods);
router.get('/active', authMiddleware, periodController.getActivePeriod);
router.post('/', authMiddleware, roleMiddleware(['superadmin', 'admin']), periodController.createPeriod);
router.put('/:id/status', authMiddleware, roleMiddleware(['superadmin', 'admin']), periodController.updatePeriodStatus);

module.exports = router;
