const express = require('express');
const router = express.Router();
const { getUsers, createUser, deleteUser } = require('../controllers/user.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

// Como TODAS las rutas de este archivo son para el admin, aplicamos el middleware a todo el router
router.use(protect, authorize('admin'));

router.get('/', getUsers);
router.post('/', createUser);
router.delete('/:id', deleteUser);

module.exports = router;