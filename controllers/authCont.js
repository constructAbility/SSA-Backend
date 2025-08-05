const User = require('../models/User');
const jwt = require('jsonwebtoken');


const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};
exports.registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

   
    const userExist = await User.findOne({ email });
    if (userExist)
      return res.status(400).json({ message: 'Admin already exists' });

    
    const admin = await User.create({
      name,
      email,
      password,
      role: 'admin'
    });

 
    const token = generateToken(admin);


    res.status(201).json({
      message: 'Admin registered successfully',
      token,
      user: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });

  } catch (err) {
    res.status(500).json({
      message: 'Admin registration failed',
      error: err.message
    });
  }
};


exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Debug log
    console.log('Incoming Registration:', { name, email });

    const userExist = await User.findOne({ email: email.trim().toLowerCase() });

    if (userExist) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email: email.trim().toLowerCase(),
      password,
      role: 'user'
    });

    const token = generateToken(user);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Register Error:', err.message);
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
};


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = generateToken(user);

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};

exports.adminlogin = async (req, res) => {
  try {
    const { email, password } = req.body;

const user = await User.findOne({ email, role: 'admin' });

    if (!user || user.role !== 'admin')
      return res.status(403).json({ message: 'Access denied: Not an admin' });

    const isMatch = await user.matchPassword(password);
    if (!isMatch)
      return res.status(400).json({ message: 'Invalid credentials' });

    const token = generateToken(user);

    res.status(200).json({
      message: 'Admin login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};
