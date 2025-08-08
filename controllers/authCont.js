const User = require('../models/User');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};



exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const userExist = await User.findOne({ email: email.trim().toLowerCase() });
    if (userExist) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // ✅ Password hash karo abhi se
    const bcrypt = require('bcrypt');
    const hashedPassword = await bcrypt.hash(password, 10);

    const verifyToken = jwt.sign(
      { name, email: email.trim().toLowerCase(), password: hashedPassword },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    const link = `${process.env.BASE_URL}/api/auth/verify/${verifyToken}`;
const emailHTML = (userName, link) => `
  <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background: #fff;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="height: 100vh;">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" border="0" style="border: 1px solid #e0e0e0;">

            <!-- Header -->
            <tr>
              <td align="center" style="background: #fff; padding: 15px 0; border-bottom: 3px solid #1744a1;">
                <a href="${link}" target="_blank">
                  <img src="https://res.cloudinary.com/dpk2qxvkb/image/upload/v1754552334/logo-ssa-2_jojbs5.png" alt="logo" style="height: 60px;" />
                </a>
              </td>
            </tr>

            <!-- Greeting -->
            <tr>
              <td align="center" style="padding: 40px 20px 10px;">
                <h2 style="font-size: 24px; color: #1744a1; margin: 0;">Hello ${userName}</h2>
              </td>
            </tr>

            <!-- Text -->
            <tr>
              <td align="center" style="padding: 10px 20px;">
                <p style="font-size: 16px; color: #1744a1; margin: 0;">Click the link below to verify your email:</p>
              </td>
            </tr>

            <!-- Approved Image -->
            <tr>
              <td align="center" style="padding: 20px 0;">
                <a href="${link}" target="_blank">
                  <img src="https://res.cloudinary.com/dpk2qxvkb/image/upload/v1754552442/Approved_i2z7gk.gif" alt="Approved" style="max-width: 100%; height: auto;" />
                </a>
              </td>
            </tr>

            <!-- Verify Button -->
            <tr>
              <td align="center" style="padding: 20px 0;">
                <a href="${link}" style="display: inline-block; background: #1744a1; color: #fff; padding: 10px 20px; text-decoration: none; font-size: 14px; border-radius: 5px;">Verify Email</a>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td align="center" style="background: #f5f5f5; padding: 15px; color: #1744a1; font-size: 13px; font-weight: bold;">
                Copyright © 2024, SSA Enterprises, All Rights Reserved.
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
`;

  await sendEmail(
  email,
  'Verify your Email - SSA',
  emailHTML(name, link) // ✅ use name and link here
);


    return res.status(201).json({
      message: 'Registration successful. Please verify your email.',
    });

  } catch (err) {
    console.error('Register Error:', err.message);
    return res.status(500).json({ message: 'Registration failed', error: err.message });
  }
};


exports.verifyEmail = async (req, res) => {
  try {
    const decoded = jwt.verify(req.params.token, process.env.JWT_SECRET);
    const { name, email, password } = decoded;

    if (!name || !email || !password) {
      return res.status(400).send('<h2>Invalid or incomplete token data</h2>');
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.send('<h2>Email already verified.</h2>');
    }

    const user = await User.create({
      name,
      email,
      password,
      role: 'user',
      isVerified: true
    });

    console.log('User created:', user._id);

    return res.redirect(`${process.env.FRONTEND_URL}/login?verified=true`);
  } catch (err) {
    console.error('Verification Error:', err.message);
    return res.status(400).send('<h2>Token invalid or expired.</h2>');
  }
};



exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }


    if (!user.isVerified) {
      return res.status(403).json({ message: 'Please verify your email before logging in.' });
    }

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
;

