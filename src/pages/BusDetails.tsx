import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import routeData from "../data/route_detail.json"; // Ensure correct path

interface RouteEntry {
  route_id: number;
  stop_id: number;
  stop_name: string;
}

interface Bus {
  routeId: string;
  stops: string[];
}

interface LocationState {
  startStop: string;
  destination: string;
}

const normalize = (str: string) => str.trim().toLowerCase();

const generateVehicleNumber = () => {
  const rtoList = [
    "TN 01 AN", // Chennai North
    "TN 38 BU", // Coimbatore South
    "TN 23 AE", // Salem
    "TN 63 AT"  // Others
  ];
  const randomRTO = rtoList[Math.floor(Math.random() * rtoList.length)];
  const randomDigits = Math.floor(1000 + Math.random() * 9000);
  return `${randomRTO} ${randomDigits}`;
};

const BusDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { startStop, destination } = location.state as LocationState;
  const [buses, setBuses] = useState<Bus[]>([]);
  const [realTimeUpdates, setRealTimeUpdates] = useState<Record<string, string>>({});
  const [vehicleNumbers, setVehicleNumbers] = useState<Record<string, string>>({});

  useEffect(() => {
    const routesMap: Record<string, string[]> = {};

    (routeData as RouteEntry[]).forEach((entry) => {
      const routeKey = entry.route_id.toString();
      if (!routesMap[routeKey]) {
        routesMap[routeKey] = [];
      }
      routesMap[routeKey].push(entry.stop_name);
    });

    const validRoutes = Object.entries(routesMap)
      .filter(([_, stops]) => {
        const normalizedStops = stops.map(normalize);
        const startIndex = normalizedStops.indexOf(normalize(startStop));
        const endIndex = normalizedStops.indexOf(normalize(destination));
        return startIndex !== -1 && endIndex !== -1 && startIndex < endIndex;
      })
      .map(([routeId, stops]) => ({
        routeId,
        stops,
      }));

    setBuses(validRoutes);

    const initialVehicleNumbers: Record<string, string> = {};
    validRoutes.forEach((bus) => {
      initialVehicleNumbers[bus.routeId] = generateVehicleNumber();
    });
    setVehicleNumbers(initialVehicleNumbers);

    const interval = setInterval(() => {
      const updates: Record<string, string> = {};

      validRoutes.forEach((bus) => {
        const startIndex = bus.stops.findIndex(
          (stop) => normalize(stop) === normalize(startStop)
        );
        if (startIndex !== -1) {
          const eta = 2 + Math.floor(Math.random() * 10);
          updates[bus.routeId] = `🚌 Arriving at ${bus.stops[startIndex]} in ${eta} min`;
        }
      });

      setRealTimeUpdates(updates);
    }, 15000);

    return () => clearInterval(interval);
  }, [startStop, destination]);

  const handleBooking = (routeId: string) => {
    const vehicleNumber = vehicleNumbers[routeId];
    navigate("/book-ticket", {
      state: {
        routeId,
        vehicleNumber,
        startStop,
        destination,
      },
    });
  };

  return (
    <div className="container mx-auto p-4 max-w-xl">
      <h1 className="text-2xl font-bold mb-4">Available Buses</h1>
      <p className="mb-6">
        From <strong>{startStop}</strong> to <strong>{destination}</strong>
      </p>

      {buses.length === 0 ? (
        <p className="text-red-500">No buses found for this route.</p>
      ) : (
        <ul className="space-y-4">
          {buses.map((bus) => (
            <li key={bus.routeId} className="border p-4 rounded-lg shadow-md">
              <p className="font-medium">Route ID: {bus.routeId}</p>
              <p className="text-sm text-gray-700 mb-1">Vehicle No: {vehicleNumbers[bus.routeId]}</p>
              <p className="mb-2">{realTimeUpdates[bus.routeId] || "Fetching ETA..."}</p>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                onClick={() => handleBooking(bus.routeId)}
              >
                Book Ticket
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BusDetails;
