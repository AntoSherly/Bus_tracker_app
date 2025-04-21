const express = require('express');
const router = express.Router();
const { sendSMS } = require('../utils/smsService');

router.post('/emergency-alert', async (req, res) => {
    try {
        const { contactNumber, location, busNumber } = req.body;

        // Validate phone number
        if (!contactNumber || !/^\d{10}$/.test(contactNumber)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid contact number. Please provide a 10-digit phone number.'
            });
        }

        // Construct emergency message
        const message = `EMERGENCY ALERT: A passenger in bus ${busNumber} has triggered an emergency alert. Current location: ${location.latitude}, ${location.longitude}. Please take immediate action.`;

        // Send SMS
        const smsResult = await sendSMS(contactNumber, message);

        return res.status(200).json({
            success: true,
            message: 'Emergency alert sent successfully',
            details: smsResult
        });
    } catch (error) {
        console.error('Error handling emergency alert:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to send emergency alert',
            error: error.message
        });
    }
});

module.exports = router; 