const express = require('express');
const router = express.Router();
const twilio = require('twilio');

// Initialize Twilio client
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Development mode flag - set to false to enable actual SMS sending
const DEVELOPMENT_MODE = false;

// In-memory OTP store (in production, use Redis or a database)
const otpStore = new Map();

// Generate a random 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Validate phone number
const isValidPhoneNumber = (phoneNumber) => {
  return /^\d{10}$/.test(phoneNumber);
};

// Send OTP via SMS
const sendSMS = async (phoneNumber, otp) => {
  try {
    const message = await twilioClient.messages.create({
      body: `Your SmartBus verification code is: ${otp}. Valid for 5 minutes.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: `+91${phoneNumber}` // Format for Indian numbers
    });
    console.log('SMS sent successfully:', message.sid);
    return true;
  } catch (error) {
    console.error('Error sending SMS:', error);
    // In development mode, don't fail even if SMS fails
    if (DEVELOPMENT_MODE) {
      console.log('\x1b[33m%s\x1b[0m', `[DEV MODE] OTP for ${phoneNumber}: ${otp}`);
      return true;
    }
    return false;
  }
};

// Send OTP route
router.post('/send-otp', async (req, res) => {
  console.log('Received send OTP request:', req.body);
  try {
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
      console.log('Phone number missing');
      return res.status(400).json({
        success: false,
        message: 'Phone number is required'
      });
    }

    if (!isValidPhoneNumber(phoneNumber)) {
      console.log('Invalid phone number format:', phoneNumber);
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid 10-digit phone number'
      });
    }

    // Generate OTP
    const otp = generateOTP();
    
    // Print OTP prominently in development mode
    if (DEVELOPMENT_MODE) {
      console.log('\n==================================');
      console.log('\x1b[33m%s\x1b[0m', `VIVA DEMO - OTP: ${otp}`);
      console.log('==================================\n');
    }
    
    // Send SMS
    const smsSent = await sendSMS(phoneNumber, otp);
    
    if (!smsSent) {
      return res.status(500).json({
        success: false,
        message: 'Failed to send OTP via SMS. Please try again.'
      });
    }

    // Store OTP with expiry time and attempts count
    otpStore.set(phoneNumber, {
      otp,
      createdAt: Date.now(),
      attempts: 0
    });

    console.log('OTP stored successfully');
    res.json({
      success: true,
      message: DEVELOPMENT_MODE ? 'OTP sent (check server console)' : 'OTP sent successfully to your phone'
    });
  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send OTP'
    });
  }
});

// Verify OTP route
router.post('/verify-otp', (req, res) => {
  console.log('Received verify OTP request:', req.body);
  try {
    const { phoneNumber, otp } = req.body;

    if (!phoneNumber || !otp) {
      console.log('Missing phone number or OTP');
      return res.status(400).json({
        success: false,
        message: 'Phone number and OTP are required'
      });
    }

    const storedData = otpStore.get(phoneNumber);
    console.log('Stored OTP data:', storedData);

    if (!storedData) {
      return res.status(400).json({
        success: false,
        message: 'OTP expired or not found. Please request a new OTP.'
      });
    }

    // Check if OTP is expired (5 minutes)
    if (Date.now() - storedData.createdAt > 5 * 60 * 1000) {
      console.log('OTP expired');
      otpStore.delete(phoneNumber);
      return res.status(400).json({
        success: false,
        message: 'OTP has expired. Please request a new one.'
      });
    }

    // Check attempts
    if (storedData.attempts >= 3) {
      console.log('Too many attempts');
      otpStore.delete(phoneNumber);
      return res.status(400).json({
        success: false,
        message: 'Too many invalid attempts. Please request a new OTP.'
      });
    }

    // Verify OTP
    if (storedData.otp !== otp) {
      console.log('Invalid OTP');
      storedData.attempts++;
      return res.status(400).json({
        success: false,
        message: `Invalid OTP. ${3 - storedData.attempts} attempts remaining.`
      });
    }

    console.log('OTP verified successfully');
    // Clear OTP after successful verification
    otpStore.delete(phoneNumber);

    res.json({
      success: true,
      message: 'OTP verified successfully',
      user: {
        phoneNumber,
        verifiedAt: new Date()
      }
    });

  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during verification'
    });
  }
});

module.exports = router; 