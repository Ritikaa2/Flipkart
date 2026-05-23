const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const db = require('../config/db');
const { sendEmailJsTemplate } = require('../services/emailJsService');

require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const resetOtps = new Map();
const OTP_TTL = 10 * 60 * 1000;
const JWT_SECRET = process.env.JWT_SECRET || 'flipkart_secret_key_12345';

const cleanEmail = (email = '') => email.trim().toLowerCase();
const passwordRule = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
const publicUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  phone: user.phone || '',
  address: user.address || '',
  created_at: user.created_at
});

function passwordError(password) {
  if (!password) return 'Password is required';
  if (!passwordRule.test(password)) {
    return 'Password must be 8+ characters with uppercase, lowercase, number and special character';
  }
  return '';
}

function makeToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '24h' }
  );
}

async function findUserByEmail(email) {
  const [users] = await db.query('SELECT * FROM users WHERE email = ?', [cleanEmail(email)]);
  return users[0] || null;
}

async function sendOtp(email, otp) {
  const templateId = process.env.EMAILJS_OTP_TEMPLATE_ID?.trim();

  if (!process.env.EMAILJS_SERVICE_ID || !process.env.EMAILJS_PUBLIC_KEY || !templateId) {
    console.log(`Password reset OTP for ${email}: ${otp}`);
    return;
  }

  try {
    await sendEmailJsTemplate(templateId, {
      to_email: email,
      email,
      otp,
      passcode: otp,
      subject: 'Flipkart password reset OTP',
      message: `Your password reset OTP is ${otp}. It is valid for 10 minutes.`
    });
  } catch (err) {
    err.message = `EmailJS OTP failed - ${err.message}`;
    throw err;
  }
}

exports.register = async (req, res) => {
  const name = String(req.body.name || '').trim();
  const email = cleanEmail(req.body.email);
  const password = String(req.body.password || '');

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email and password are required' });
  }
  const weakPassword = passwordError(password);
  if (weakPassword) {
    return res.status(400).json({ message: weakPassword });
  }

  try {
    if (await findUserByEmail(email)) {
      return res.status(400).json({ message: 'Email is already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      'INSERT INTO users (name, email, password, phone, address) VALUES (?, ?, ?, ?, ?)',
      [name, email, hashedPassword, req.body.phone || '', req.body.address || '']
    );

    const user = {
      id: result.insertId,
      name,
      email,
      phone: req.body.phone || '',
      address: req.body.address || ''
    };

    res.status(201).json({ message: 'Account created', token: makeToken(user), user });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Could not create account' });
  }
};

exports.login = async (req, res) => {
  const email = cleanEmail(req.body.email);
  const password = String(req.body.password || '');

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const user = await findUserByEmail(email);
    const validPassword = user && await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    res.json({ message: 'Login successful', token: makeToken(user), user: publicUser(user) });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Could not login' });
  }
};

exports.sendResetOtp = async (req, res) => {
  const email = cleanEmail(req.body.email);

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    if (!await findUserByEmail(email)) {
      return res.status(404).json({ message: 'No account found with this email' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    resetOtps.set(email, { otp, expiresAt: Date.now() + OTP_TTL });
    await sendOtp(email, otp);

    res.json({ message: 'OTP sent successfully' });
  } catch (err) {
    console.error('OTP error:', err);
    res.status(500).json({ message: 'Could not send OTP' });
  }
};

exports.forgotPassword = async (req, res) => {
  const email = cleanEmail(req.body.email);
  const otp = String(req.body.otp || '').trim();
  const password = String(req.body.password || '');
  const savedOtp = resetOtps.get(email);

  if (!email || !otp || !password) {
    return res.status(400).json({ message: 'Email, OTP and new password are required' });
  }
  const weakPassword = passwordError(password);
  if (weakPassword) {
    return res.status(400).json({ message: weakPassword });
  }
  if (!savedOtp || savedOtp.otp !== otp || savedOtp.expiresAt < Date.now()) {
    return res.status(400).json({ message: 'Invalid or expired OTP' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      'UPDATE users SET password = ? WHERE email = ?',
      [hashedPassword, email]
    );

    if (!result.affectedRows) {
      return res.status(404).json({ message: 'No account found with this email' });
    }

    resetOtps.delete(email);
    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('Password reset error:', err);
    res.status(500).json({ message: 'Could not update password' });
  }
};

exports.getMe = async (req, res) => {
  try {
    const [users] = await db.query('SELECT * FROM users WHERE id = ?', [req.user.id]);
    if (!users.length) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user: publicUser(users[0]) });
  } catch (err) {
    console.error('Profile error:', err);
    res.status(500).json({ message: 'Could not load profile' });
  }
};
