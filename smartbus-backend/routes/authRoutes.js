const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// In-memory storage for OTPs (in production, use a proper database)
const otpStore = new Map();

// Generate a random 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP route
router.post('/send-otp', (req, res) => {
  const { phoneNumber } = req.body;

  if (!phoneNumber) {
    return res.status(400).json({
      success: false,
      message: 'Phone number is required'
    });
  }

  // Generate OTP
  const otp = generateOTP();
  
  // Store OTP with phone number (with 5 minutes expiry)
  otpStore.set(phoneNumber, {
    otp,
    createdAt: new Date(),
    attempts: 0
  });

  // In a real application, you would integrate with an SMS service here
  console.log(`OTP for ${phoneNumber}: ${otp}`);

  // For development, we're sending the OTP in the response
  // In production, remove this and only send success status
  res.json({
    success: true,
    message: 'OTP sent successfully',
    otp // Remove this in production
  });
});

// Verify OTP route
router.post('/verify-otp', (req, res) => {
  const { phoneNumber, otp } = req.body;

  if (!phoneNumber || !otp) {
    return res.status(400).json({
      success: false,
      message: 'Phone number and OTP are required'
    });
  }

  const storedData = otpStore.get(phoneNumber);

  if (!storedData) {
    return res.status(400).json({
      success: false,
      message: 'OTP expired or not found'
    });
  }

  // Check if OTP is expired (5 minutes)
  const now = new Date();
  const otpAge = now - storedData.createdAt;
  if (otpAge > 5 * 60 * 1000) { // 5 minutes in milliseconds
    otpStore.delete(phoneNumber);
    return res.status(400).json({
      success: false,
      message: 'OTP expired'
    });
  }

  // Check attempts
  if (storedData.attempts >= 3) {
    otpStore.delete(phoneNumber);
    return res.status(400).json({
      success: false,
      message: 'Too many attempts. Please request a new OTP'
    });
  }

  // Verify OTP
  if (storedData.otp !== otp) {
    storedData.attempts += 1;
    return res.status(400).json({
      success: false,
      message: 'Invalid OTP'
    });
  }

  // OTP verified successfully
  otpStore.delete(phoneNumber); // Clear the OTP

  // Generate JWT token
  const token = jwt.sign(
    { phoneNumber },
    process.env.JWT_SECRET || 'your-secret-key', // Use environment variable in production
    { expiresIn: '24h' }
  );

  res.json({
    success: true,
    message: 'OTP verified successfully',
    token
  });
});

module.exports = router; 