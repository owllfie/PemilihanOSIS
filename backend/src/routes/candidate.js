const express = require('express');
const router = express.Router();
const candidateController = require('../controllers/candidateController');
const authMiddleware = require('../middleware/auth');
const roleMiddleware = require('../middleware/role');
const upload = require('../middleware/upload');

// Candidate profile & results (Must come before /:id routes!)
router.get('/profile', authMiddleware, roleMiddleware(['calon_ketua', 'siswa', 'admin', 'superadmin']), candidateController.getCandidateProfile);
router.put('/profile', authMiddleware, roleMiddleware(['calon_ketua', 'siswa', 'admin', 'superadmin']), upload.single('foto'), candidateController.updateCandidateProfile);
router.get('/result', authMiddleware, candidateController.getCandidateResults);

// Public / Authenticated candidate list
router.get('/', authMiddleware, candidateController.getAllCandidates);
router.get('/:id', authMiddleware, candidateController.getCandidateById);

// Admin CRUD
router.post('/', authMiddleware, roleMiddleware(['superadmin', 'admin']), upload.single('foto'), candidateController.createCandidate);
router.put('/:id', authMiddleware, roleMiddleware(['superadmin', 'admin']), upload.single('foto'), candidateController.updateCandidate);
router.delete('/:id', authMiddleware, roleMiddleware(['superadmin', 'admin']), candidateController.deleteCandidate);

module.exports = router;
