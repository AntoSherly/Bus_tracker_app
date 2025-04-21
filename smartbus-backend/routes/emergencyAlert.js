// routes/emergencyAlert.js

const express = require('express');
const router = express.Router();
const twilio = require('twilio');

// Twilio Configuration
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Send emergency SMS using Twilio
const sendEmergencyAlert = async (phoneNumber, location) => {
  const message = location 
    ? `EMERGENCY ALERT: Passenger needs help! Location: https://www.google.com/maps?q=${location.latitude},${location.longitude}`
    : `EMERGENCY ALERT: Passenger needs help!`;

  try {
    // Log attempt
    console.log('\n==================================');
    console.log('[SENDING EMERGENCY SMS via Twilio]');
    console.log(`From: ${process.env.TWILIO_PHONE_NUMBER}`);
    console.log(`To: +91${phoneNumber}`);
    console.log(`Message: ${message}`);
    if (location) {
      console.log(`Location: (${location.latitude}, ${location.longitude})`);
    }
    console.log('==================================\n');

    // Always attempt to send SMS, regardless of development mode
    const response = await client.messages.create({
      body: message,
      to: `+91${phoneNumber}`,
      from: process.env.TWILIO_PHONE_NUMBER
    });

    console.log('Twilio Message SID:', response.sid);
    console.log('SMS Status:', response.status);
    return true;
  } catch (error) {
    console.error('Error sending SMS:', error.message);
    throw error; // Propagate error for better handling
  }
};

// Validate phone number
const isValidPhoneNumber = (phoneNumber) => {
  return /^\d{10}$/.test(phoneNumber);
};

// POST API to handle emergency alert
router.post('/emergency-alert', async (req, res) => {
  console.log('Received emergency alert request:', req.body);
  const { phoneNumber, location } = req.body;

  try {
    if (!phoneNumber) {
      return res.status(400).json({ 
        success: false, 
        message: 'Phone number is required' 
      });
    }

    if (!isValidPhoneNumber(phoneNumber)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid 10-digit phone number'
      });
    }

    // Send emergency alert
    await sendEmergencyAlert(phoneNumber, location);
    
    res.json({ 
      success: true, 
      message: 'Emergency alert sent successfully'
    });

  } catch (error) {
    console.error('Emergency alert error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send emergency alert: ' + error.message
    });
  }
});

module.exports = router;
