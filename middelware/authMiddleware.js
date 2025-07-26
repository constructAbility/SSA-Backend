require('dotenv').config();
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Adjust the path if needed

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer '))
    return res.status(401).json({ message: 'Unauthorized: No token' });

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Fetch full user from DB using decoded.id
    const user = await User.findById(decoded.id).select('name email phone');
    if (!user) return res.status(404).json({ message: 'User not found' });

    req.user = user; // ✅ Store full user object in req.user
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};
