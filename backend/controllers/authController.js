const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const dns = require('dns');
const path = require('path');
const db = require('../config/db');

require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
dns.setDefaultResultOrder('ipv4first');

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
  const host = process.env.SMTP_HOST?.trim();
  const port = process.env.SMTP_PORT?.trim();
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS?.trim();
  const portNumber = Number(port);

  if (!host || !port || !user || !pass) {
    console.log(`Password reset OTP for ${email}: ${otp}`);
    return;
  }
  const transporter = nodemailer.createTransport({
    host,
    port: portNumber,
    secure: portNumber === 465,
    auth: { user, pass },
    family: 4,
    connectionTimeout: 60000,
    greetingTimeout: 60000,
    socketTimeout: 60000,
    tls: {
      rejectUnauthorized: false
    }
  });

  try {
    await transporter.verify();
    await transporter.sendMail({
      from: process.env.SMTP_FROM?.trim() || user,
      to: email,
      subject: 'Flipkart password reset OTP',
      text: `Your password reset OTP is ${otp}. It is valid for 10 minutes.`,
      html: `
        <div style="font-family:Arial,sans-serif;background:#f1f3f6;padding:24px;color:#111827">
          <div style="max-width:520px;margin:auto;background:#ffffff;border:1px solid #e5e7eb;border-radius:8px;padding:24px">
            <h2 style="margin:0 0 12px;color:#2874f0">Flipkart password reset</h2>
            <p style="margin:0 0 16px;font-size:15px;color:#374151">Use this OTP to reset your password.</p>
            <div style="font-size:32px;letter-spacing:8px;font-weight:700;background:#fff4cc;border:1px dashed #f59e0b;border-radius:8px;padding:16px;text-align:center;color:#111827">
              ${otp}
            </div>
            <p style="margin:16px 0 0;font-size:13px;color:#6b7280">This OTP is valid for 10 minutes. Do not share it with anyone.</p>
          </div>
        </div>
      `
    });
  } catch (err) {
    err.message = `SMTP ${host}:${portNumber} failed - ${err.message}`;
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
