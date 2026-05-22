const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const passwordResetOtps = new Map();
const OTP_EXPIRY_MS = 10 * 60 * 1000;

// Generate JWT Token helper
const generateToken = (userId, email) => {
  return jwt.sign(
    { id: userId, email },
    process.env.JWT_SECRET || 'flipkart_secret_key_12345',
    { expiresIn: process.env.JWT_EXPIRE || '24h' }
  );
};

const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

async function sendPasswordResetOtpEmail(email, otp) {
  const smtpHost = process.env.SMTP_HOST?.trim();
  const smtpPort = process.env.SMTP_PORT?.trim();
  const smtpUser = process.env.SMTP_USER?.trim();
  const smtpPass = process.env.SMTP_PASS?.trim();

  if (!smtpHost || !smtpPort || !smtpUser || !smtpPass) {
    console.log(`Password reset OTP for ${email}: ${otp}`);
    return;
  }

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: parseInt(smtpPort),
    secure: parseInt(smtpPort) === 465,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });

  await transporter.sendMail({
    from: process.env.SMTP_FROM?.trim() || smtpUser,
    to: email,
    subject: 'Flipkart password reset OTP',
    text: `Your Flipkart password reset OTP is ${otp}. It is valid for 10 minutes.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 520px; margin: auto; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
        <div style="background: #2874f0; color: #fff; padding: 18px 22px;">
          <h2 style="margin: 0; font-size: 22px;">Flipkart</h2>
          <p style="margin: 5px 0 0; font-size: 13px;">Password reset verification</p>
        </div>
        <div style="padding: 24px; color: #212121;">
          <p style="margin-top: 0;">Use this OTP to update your account password:</p>
          <div style="font-size: 30px; font-weight: 800; letter-spacing: 8px; color: #2874f0; padding: 14px 18px; background: #f1f5ff; border-radius: 6px; text-align: center;">${otp}</div>
          <p style="font-size: 13px; color: #666; margin-bottom: 0;">This OTP is valid for 10 minutes. If you did not request this, you can ignore this email.</p>
        </div>
      </div>
    `,
  });
}

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  const { name, email, password, phone, address } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Please provide name, email, and password' });
  }

  try {
    // Check if user already exists
    const [existingUsers] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUsers.length > 0) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert user
    const [result] = await db.query(
      'INSERT INTO users (name, email, password, phone, address) VALUES (?, ?, ?, ?, ?)',
      [name, email, hashedPassword, phone || '', address || '']
    );

    const userId = result.insertId;

    // Generate JWT
    const token = generateToken(userId, email);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: userId,
        name,
        email,
        phone: phone || '',
        address: address || ''
      }
    });
  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide email and password' });
  }

  try {
    // Find user by email
    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const user = users[0];

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT
    const token = generateToken(user.id, user.email);

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address
      }
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// @desc    Send password reset OTP to registered email
// @route   POST /api/auth/send-reset-otp
// @access  Public
exports.sendResetOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Please provide your registered email address' });
  }

  try {
    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(404).json({ message: 'No account found with this email address' });
    }

    const otp = generateOtp();
    passwordResetOtps.set(email, {
      otp,
      expiresAt: Date.now() + OTP_EXPIRY_MS,
    });

    await sendPasswordResetOtpEmail(email, otp);

    res.status(200).json({ message: 'OTP sent successfully to your registered email.' });
  } catch (err) {
    console.error("Send Reset OTP Error:", err);
    res.status(500).json({ message: 'Unable to send OTP. Please try again.' });
  }
};

// @desc    Reset password using email OTP
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res) => {
  const { email, otp, password } = req.body;

  if (!email || !otp || !password) {
    return res.status(400).json({ message: 'Please provide email, OTP, and new password' });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters long' });
  }

  try {
    const resetRequest = passwordResetOtps.get(email);
    if (!resetRequest) {
      return res.status(400).json({ message: 'Please request an OTP before updating your password' });
    }

    if (Date.now() > resetRequest.expiresAt) {
      passwordResetOtps.delete(email);
      return res.status(400).json({ message: 'OTP has expired. Please request a new OTP.' });
    }

    if (resetRequest.otp !== otp.trim()) {
      return res.status(400).json({ message: 'Invalid OTP. Please check your email and try again.' });
    }

    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      passwordResetOtps.delete(email);
      return res.status(404).json({ message: 'No account found with this email address' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const [result] = await db.query(
      'UPDATE users SET password = ? WHERE email = ?',
      [hashedPassword, email]
    );

    if (result.affectedRows === 0) {
      return res.status(400).json({ message: 'Unable to update password. Please try again.' });
    }

    passwordResetOtps.delete(email);

    res.status(200).json({ message: 'Password updated successfully. Please login with your new password.' });
  } catch (err) {
    console.error("Forgot Password Error:", err);
    res.status(500).json({ message: 'Server error while updating password' });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const [users] = await db.query('SELECT id, name, email, phone, address, created_at FROM users WHERE id = ?', [req.user.id]);
    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ user: users[0] });
  } catch (err) {
    console.error("GetMe Error:", err);
    res.status(500).json({ message: 'Server error fetching user details' });
  }
};
