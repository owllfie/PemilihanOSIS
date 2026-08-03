const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');
const roleMiddleware = require('../middleware/role');

router.get('/', authMiddleware, roleMiddleware(['superadmin', 'admin']), userController.getAllUsers);
router.post('/', authMiddleware, roleMiddleware(['superadmin', 'admin']), userController.createUser);
router.put('/:id', authMiddleware, roleMiddleware(['superadmin', 'admin']), userController.updateUser);
router.delete('/:id', authMiddleware, roleMiddleware(['superadmin', 'admin']), userController.deleteUser);

module.exports = router;
