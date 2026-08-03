const express = require('express');
const router = express.Router();
const registrationController = require('../controllers/registrationController');
const authMiddleware = require('../middleware/auth');
const roleMiddleware = require('../middleware/role');

router.post('/', authMiddleware, roleMiddleware(['siswa', 'calon_anggota']), registrationController.registerCandidateMember);
router.get('/status', authMiddleware, registrationController.getRegistrationStatus);

// Pembina & Admin routes
router.get('/', authMiddleware, roleMiddleware(['pembina', 'admin', 'superadmin', 'kepala_sekolah']), registrationController.getAllRegistrations);
router.put('/:id', authMiddleware, roleMiddleware(['pembina', 'admin', 'superadmin']), registrationController.updateRegistrationStatus);

module.exports = router;
