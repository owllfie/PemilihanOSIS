const express = require('express');
const router = express.Router();
const announcementController = require('../controllers/announcementController');
const authMiddleware = require('../middleware/auth');
const roleMiddleware = require('../middleware/role');

router.get('/', authMiddleware, announcementController.getAllAnnouncements);
router.post('/', authMiddleware, roleMiddleware(['pembina', 'admin', 'superadmin']), announcementController.createAnnouncement);
router.delete('/:id', authMiddleware, roleMiddleware(['pembina', 'admin', 'superadmin']), announcementController.deleteAnnouncement);

module.exports = router;
