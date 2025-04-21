require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const emergencyAlertRouter = require('./routes/emergencyAlert');
const ticketsRouter = require('./routes/tickets');
const busRoutes = require('./routes/busRoutes');
const authRoutes = require('./routes/auth');

const app = express();

// Basic CORS setup
app.use(cors());

// Parse JSON bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Test route
app.get('/', (req, res) => {
  res.send('SmartBus Backend is running');
});

// Mount routes
app.use('/api', emergencyAlertRouter);
app.use('/api', ticketsRouter);
app.use('/api/buses', busRoutes);
app.use('/api/auth', authRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ 
    success: false,
    message: 'Something broke!' 
  });
});

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
