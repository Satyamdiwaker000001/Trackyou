const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');
const { sendWelcomeEmail, sendPasswordResetEmail } = require('../services/email');
const disposableDomains = require('disposable-email-domains');

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.error("FATAL ERROR: JWT_SECRET is not defined.");
  process.exit(1);
}

const isDisposableEmail = (email) => {
  if (!email || !email.includes('@')) return true;
  const domain = email.split('@')[1];
  return disposableDomains.includes(domain.toLowerCase());
};

// Register User
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }
  if (isDisposableEmail(email)) {
    return res.status(400).json({ message: 'Temporary or disposable emails are not allowed' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    const newUser = new User({ name, email, password, provider: 'local' });
    await newUser.save();

    // Create JWT Token
    const token = jwt.sign({ id: newUser._id, email: newUser.email }, JWT_SECRET, { expiresIn: '7d' });
    
    // Send welcome email asynchronously
    sendWelcomeEmail(newUser.email, newUser.name).catch(err => console.error("Failed to send welcome email:", err));

    res.status(201).json({ token, message: 'Registration successful' });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Login User
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }
  if (isDisposableEmail(email)) {
    return res.status(403).json({ message: 'Access denied for disposable emails' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create JWT Token
    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, message: 'Login successful' });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Real OAuth Login via Firebase
router.post('/oauth', async (req, res) => {
  const { email, name, photo, provider } = req.body;
  
  if (!email || !provider) {
    return res.status(400).json({ message: 'Email and provider are required' });
  }
  if (isDisposableEmail(email)) {
    return res.status(403).json({ message: 'Temporary or disposable emails are not allowed' });
  }

  try {
    let isNewUser = false;
    let user = await User.findOne({ email });
    if (!user) {
      // Create a new user from OAuth data
      user = new User({ 
        name: name || '',
        email, 
        password: Math.random().toString(36).substring(2) + Date.now().toString() + '!', // Random password for oauth users
        provider,
        photo: photo || ''
      });
      await user.save();
      isNewUser = true;
    } else {
      // Update existing user with latest photo/name from OAuth if they logged in via OAuth again
      let updated = false;
      if (photo && user.photo !== photo) {
        user.photo = photo;
        updated = true;
      }
      if (name && user.name !== name) {
        user.name = name;
        updated = true;
      }
      if (updated) await user.save();
    }

    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    
    // If new user, send welcome email
    if (isNewUser) {
      sendWelcomeEmail(user.email, user.name).catch(err => console.error("Failed to send welcome email:", err));
    }

    res.json({ token, message: `OAuth login successful` });
  } catch (err) {
    console.error('Real OAuth login error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Mock OAuth for Google/GitHub prototype logins
router.post('/oauth-mock', async (req, res) => {
  const { provider } = req.body;
  if (!provider) {
    return res.status(400).json({ message: 'OAuth provider is required' });
  }

  const email = `${provider}-developer-test@trackyourday.com`;
  const name = provider === 'google' ? 'Google Developer' : provider === 'github' ? 'GitHub Developer' : `${provider} User`;
  
  try {
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({ 
        name,
        email, 
        password: Math.random().toString(36).substring(2) + '!',
        provider
      });
      await user.save();
    }

    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, message: `OAuth mock login via ${provider} successful` });
  } catch (err) {
    console.error('Mock OAuth login error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get Current User Profile
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error('Me endpoint error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Change Password
router.post('/change-password', authMiddleware, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    if (user.provider !== 'local') return res.status(400).json({ message: 'OAuth users cannot change password this way' });

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) return res.status(400).json({ message: 'Incorrect current password' });

    user.password = newPassword;
    await user.save();
    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('Change password error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Forgot Password
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'No user found with that email' });

    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    await sendPasswordResetEmail(user.email, user.name || 'User', resetToken);
    res.json({ message: 'Password reset email sent' });
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ message: 'Error sending reset email' });
  }
});

// Reset Password
router.post('/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;
  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) return res.status(400).json({ message: 'Password reset token is invalid or has expired' });

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: 'Password has been successfully reset' });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ message: 'Error resetting password' });
  }
});

module.exports = router;
