const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const User = require('../models/User');
const { sendTestEmail } = require('../services/email');

// Send test email
router.post('/test-email', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const result = await sendTestEmail(user.email);
    
    res.json({ 
      message: 'Test email sent successfully', 
      previewUrl: result.previewUrl || null 
    });
  } catch (err) {
    console.error('Test email route error:', err);
    res.status(500).json({ message: 'Failed to send test email. Check your SMTP configuration in .env.' });
  }
});

module.exports = router;
