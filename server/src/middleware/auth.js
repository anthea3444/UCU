const jwt = require('jsonwebtoken');
const db = require('../config/db');

// Checks that the person is logged in and the token was not logged out
exports.verifyToken = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Please log in first' });
  }
  try {
    const token = header.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const [revoked] = await db.query('SELECT id FROM revoked_tokens WHERE jti = ?', [decoded.jti]);
    if (revoked.length > 0) {
      return res.status(401).json({ message: 'You are logged out. Please log in again' });
    }
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// Checks that the person is an admin
exports.isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admins only' });
  }
  next();
};