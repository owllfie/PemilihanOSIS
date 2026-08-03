const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const authMiddleware = require('../middleware/auth');
const roleMiddleware = require('../middleware/role');

// Admin, Superadmin, Pembina, Kepala Sekolah can read student list
router.get('/', authMiddleware, roleMiddleware(['superadmin', 'admin', 'pembina', 'kepala_sekolah']), studentController.getAllStudents);
router.get('/:id', authMiddleware, studentController.getStudentById);

// Admin & Superadmin CRUD
router.post('/', authMiddleware, roleMiddleware(['superadmin', 'admin']), studentController.createStudent);
router.put('/:id', authMiddleware, roleMiddleware(['superadmin', 'admin']), studentController.updateStudent);
router.delete('/:id', authMiddleware, roleMiddleware(['superadmin', 'admin']), studentController.deleteStudent);

module.exports = router;
