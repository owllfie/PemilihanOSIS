const express = require('express');
const router = express.Router();
const voteController = require('../controllers/voteController');
const authMiddleware = require('../middleware/auth');
const roleMiddleware = require('../middleware/role');

router.post('/', authMiddleware, roleMiddleware(['siswa', 'calon_ketua', 'calon_anggota']), voteController.vote);
router.get('/status', authMiddleware, voteController.getVoteStatus);

module.exports = router;
