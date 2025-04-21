const express = require('express');
const router = express.Router();

// Store bus capacities (in a real app, this would be in a database)
const busCapacities = {};

// Make busCapacities available to other routes
router.getBusCapacities = () => busCapacities;

// POST endpoint to create a ticket and update capacity
router.post('/tickets', async (req, res) => {
  try {
    const { busNumber, from, to, passengerCount, ticketPrice } = req.body;

    // Initialize bus capacity if not exists
    if (!busCapacities[busNumber]) {
      busCapacities[busNumber] = {
        totalCapacity: 50, // Default bus capacity
        currentOccupancy: 0
      };
    }

    // Check if there's enough space
    const bus = busCapacities[busNumber];
    if (bus.currentOccupancy + passengerCount > bus.totalCapacity) {
      return res.status(400).json({
        error: "Bus is full",
        availableSeats: bus.totalCapacity - bus.currentOccupancy
      });
    }

    // Update occupancy
    bus.currentOccupancy += passengerCount;

    // Create ticket record (in a real app, save to database)
    const ticket = {
      id: Date.now().toString(),
      busNumber,
      from,
      to,
      passengerCount,
      ticketPrice,
      timestamp: new Date(),
      totalAmount: ticketPrice * passengerCount
    };

    // Broadcast the capacity update to all connected clients
    res.status(201).json({
      message: "Ticket created successfully",
      ticket,
      updatedCapacity: {
        busNumber,
        currentOccupancy: bus.currentOccupancy,
        totalCapacity: bus.totalCapacity
      }
    });
  } catch (error) {
    console.error('Error creating ticket:', error);
    res.status(500).json({ error: 'Failed to create ticket' });
  }
});

// GET endpoint to check bus capacity
router.get('/capacity/:busNumber', (req, res) => {
  const { busNumber } = req.params;
  
  if (!busCapacities[busNumber]) {
    return res.status(404).json({ error: 'Bus not found' });
  }

  res.json({
    busNumber,
    ...busCapacities[busNumber]
  });
});

module.exports = router; 