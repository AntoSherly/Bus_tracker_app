const express = require('express');
const router = express.Router();
const ticketsRouter = require('./tickets');

// Simulated bus data store with coordinates for stops
const busLocations = {
  '118': {
    route: 'Tambaram - Maraimalai Nagar',
    stops: [
      { name: 'Tambaram', lat: 12.9249, lng: 80.1000 },
      { name: 'Perungalathur', lat: 12.9047, lng: 80.0982 },
      { name: 'Vandalur', lat: 12.8917, lng: 80.0851 },
      { name: 'Urapakkam', lat: 12.8749, lng: 80.0712 },
      { name: 'Guduvancheri', lat: 12.8453, lng: 80.0561 },
      { name: 'Maraimalai Nagar', lat: 12.7924, lng: 80.0225 }
    ],
    currentLocation: { lat: 12.9249, lng: 80.1000 }
  },
  'M88': {
    route: 'Vadapalani - Kundrathur',
    stops: [
      { name: 'Vadapalani', lat: 13.0500, lng: 80.2121 },
      { name: 'Alwarthirunagar', lat: 13.0447, lng: 80.1892 },
      { name: 'Valasaravakkam', lat: 13.0441, lng: 80.1762 },
      { name: 'Porur', lat: 13.0374, lng: 80.1567 },
      { name: 'Kundrathur', lat: 13.0333, lng: 80.1000 }
    ],
    currentLocation: { lat: 13.0500, lng: 80.2121 }
  }
};

// Get bus location
router.get('/:busNumber/location', (req, res) => {
  const { busNumber } = req.params;
  const bus = busLocations[busNumber];
  
  if (!bus) {
    return res.status(404).json({ error: 'Bus not found' });
  }

  // Simulate random movement along the route
  const currentStopIndex = Math.floor(Math.random() * (bus.stops.length - 1));
  const nextStop = bus.stops[currentStopIndex + 1];
  
  // Calculate position between current and next stop
  const progress = Math.random();
  const currentLat = bus.stops[currentStopIndex].lat + (nextStop.lat - bus.stops[currentStopIndex].lat) * progress;
  const currentLng = bus.stops[currentStopIndex].lng + (nextStop.lng - bus.stops[currentStopIndex].lng) * progress;

  bus.currentLocation = { lat: currentLat, lng: currentLng };
  
  res.json({
    busNumber,
    route: bus.route,
    currentLocation: bus.currentLocation,
    nextStop: nextStop.name,
    eta: `${Math.floor(Math.random() * 10) + 1} min`,
    speed: Math.floor(Math.random() * 40) + 20,
    lastUpdated: new Date().toISOString(),
    stops: bus.stops
  });
});

// Sample bus data
const buses = [
  { routeId: '1', stops: ['Thiruvotriyur', 'Royapuram', 'Central', 'Egmore', 'Saidapet'] },
  { routeId: '2', stops: ['T Nagar', 'Mylapore', 'Adyar', 'Thiruvanmiyur'] },
  // Add more routes as needed
];

// GET all bus routes
router.get('/routes', (req, res) => {
  const routesWithCapacity = buses.map(bus => {
    const capacities = ticketsRouter.getBusCapacities()[bus.routeId] || {
      totalCapacity: 50,
      currentOccupancy: 0
    };
    return {
      ...bus,
      ...capacities
    };
  });
  res.json(routesWithCapacity);
});

// GET specific bus route
router.get('/routes/:routeId', (req, res) => {
  const { routeId } = req.params;
  const bus = buses.find(b => b.routeId === routeId);
  
  if (!bus) {
    return res.status(404).json({ error: 'Route not found' });
  }

  const capacities = ticketsRouter.getBusCapacities()[routeId] || {
    totalCapacity: 50,
    currentOccupancy: 0
  };

  res.json({
    ...bus,
    ...capacities
  });
});

module.exports = router; 