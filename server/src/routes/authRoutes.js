const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const { verifyToken, isAdmin } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);

// Test routes
router.get('/me', verifyToken, (req, res) => {
  res.json({ message: 'You are logged in', user: req.user });
});
router.get('/admin-only', verifyToken, isAdmin, (req, res) => {
  res.json({ message: 'Welcome, admin' });
});

module.exports = router;