import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Bus, MapPin, Clock, Navigation } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axios from 'axios';

// Fix Leaflet default icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;

// Custom icons
const busIcon = L.divIcon({
  className: 'custom-div-icon',
  html: `<div style="background-color: #4F46E5; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
      <path d="M17 20h-2v-2H9v2H7v2h10v-2zm2-9h-2V5c0-1.1-.9-2-2-2H9c-1.1 0-2 .9-2 2v6H5c-.5 0-1 .5-1 1v3c0 .5.5 1 1 1h14c.5 0 1-.5 1-1v-3c0-.5-.5-1-1-1zm-4-6H9v6h6V5zm-1 11H8v-2h6v2z"/>
    </svg>
  </div>`,
  iconSize: [30, 30],
  iconAnchor: [15, 15]
});

const stopIcon = L.divIcon({
  className: 'custom-div-icon',
  html: `<div style="background-color: white; width: 12px; height: 12px; border-radius: 50%; border: 3px solid #4F46E5;"></div>`,
  iconSize: [12, 12],
  iconAnchor: [6, 6]
});

const startStopIcon = L.divIcon({
  className: 'custom-div-icon',
  html: `<div style="background-color: #22C55E; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 0 2px #22C55E;"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8]
});

const endStopIcon = L.divIcon({
  className: 'custom-div-icon',
  html: `<div style="background-color: #EF4444; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 0 2px #EF4444;"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8]
});

// Map update component
function MapUpdater({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

interface BusLocation {
  lat: number;
  lng: number;
  speed: number;
  lastUpdated: string;
  nextStop: string;
  eta: string;
  route?: string;
  stops?: { name: string; lat: number; lng: number }[];
}

const BusMap = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const busNumber = location.state?.busNumber;
  const [routePoints, setRoutePoints] = useState<[number, number][]>([]);
  
  const [busLocation, setBusLocation] = useState<BusLocation>({
    lat: 13.0827,
    lng: 80.2707,
    speed: 0,
    lastUpdated: new Date().toLocaleTimeString(),
    nextStop: "Loading...",
    eta: "Calculating...",
    stops: []
  });

  const fetchBusLocation = async () => {
    try {
      const response = await axios.get(`http://localhost:5001/api/buses/${busNumber}/location`);
      const { currentLocation, speed, nextStop, eta, lastUpdated, route, stops } = response.data;
      setBusLocation({
        lat: currentLocation.lat,
        lng: currentLocation.lng,
        speed,
        nextStop,
        eta,
        lastUpdated: new Date(lastUpdated).toLocaleTimeString(),
        route,
        stops
      });

      // Update route points if available
      if (stops && stops.length > 0) {
        setRoutePoints(stops.map((stop: any) => [stop.lat, stop.lng]));
      }
    } catch (error) {
      console.error('Error fetching bus location:', error);
    }
  };

  useEffect(() => {
    fetchBusLocation();
    const interval = setInterval(fetchBusLocation, 5000);
    return () => clearInterval(interval);
  }, [busNumber]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-cyan-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Bus {busNumber}</h1>
                <p className="text-sm text-gray-600">{busLocation.route || 'Loading route...'}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 bg-indigo-50 px-3 py-1 rounded-full">
              <Clock className="h-4 w-4 text-indigo-600" />
              <span className="text-sm font-medium text-indigo-600">ETA: {busLocation.eta}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="h-[calc(100vh-64px)]">
        <MapContainer
          center={[busLocation.lat, busLocation.lng]}
          zoom={15}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {/* Route line */}
          {routePoints.length > 0 && (
            <Polyline
              positions={routePoints}
              color="#4F46E5"
              weight={4}
              opacity={0.6}
            />
          )}

          {/* Bus stops */}
          {busLocation.stops?.map((stop, index) => (
            <Marker
              key={stop.name}
              position={[stop.lat, stop.lng]}
              icon={
                index === 0 ? startStopIcon :
                index === busLocation.stops!.length - 1 ? endStopIcon :
                stopIcon
              }
            >
              <Popup>
                <div className="p-2">
                  <span className="font-medium">{stop.name}</span>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Bus marker */}
          <Marker position={[busLocation.lat, busLocation.lng]} icon={busIcon}>
            <Popup>
              <div className="p-2">
                <div className="flex items-center space-x-2">
                  <Bus className="h-4 w-4 text-indigo-600" />
                  <span className="font-medium">Bus {busNumber}</span>
                </div>
                <div className="mt-1 text-sm">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-3 w-3 text-gray-500" />
                    <span>Next Stop: {busLocation.nextStop}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Navigation className="h-3 w-3 text-gray-500" />
                    <span>Speed: {busLocation.speed} km/h</span>
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    Updated: {busLocation.lastUpdated}
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>

          <MapUpdater center={[busLocation.lat, busLocation.lng]} zoom={15} />
        </MapContainer>
      </div>
    </div>
  );
};

export default BusMap; 