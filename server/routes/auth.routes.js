const express = require('express');
const router = express.Router();
// Importamos las funciones del controlador
const { register, login, getMe } = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');

// Definimos las rutas
router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);

// Exportamos el router
module.exports = router;