const express = require('express');
const router = express.Router();
const { register, login, logout } = require('../controllers/authController');
const { verifyToken, isAdmin } = require('../middleware/auth');
const { validateRegister, validateLogin } = require('../middleware/validate');

router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.post('/logout', verifyToken, logout);

// Test routes
router.get('/me', verifyToken, (req, res) => {
  res.json({ message: 'You are logged in', user: req.user });
});
router.get('/admin-only', verifyToken, isAdmin, (req, res) => {
  res.json({ message: 'Welcome, admin' });
});

module.exports = router;