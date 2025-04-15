import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import routeData from "../data/route_detail.json";

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

const VEHICLE_NUMBERS: Record<string, string> = {
  "1": "TN 38 BU 4322",
  "101": "TN 01 AN 3215",
  "109T": "TN 23 AE 3136",
  "1B": "TN 23 AE 1556",
  "1C": "TN 38 BU 8390"
};

const BusDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { startStop, destination } = location.state as LocationState;

  const [buses, setBuses] = useState<Bus[]>([]);
  const [realTimeUpdates, setRealTimeUpdates] = useState<Record<string, string>>({});
  const [vehicleNumbers, setVehicleNumbers] = useState<Record<string, string>>({});
  const [crowdDensity, setCrowdDensity] = useState<Record<string, number>>({});

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

    const fixedVehicleNumbers: Record<string, string> = {};
    validRoutes.forEach((bus) => {
      fixedVehicleNumbers[bus.routeId] = VEHICLE_NUMBERS[bus.routeId] || "TN 00 XX 0000";
    });
    setVehicleNumbers(fixedVehicleNumbers);

    // Get stored crowd density from localStorage (ETM updates)
    const savedDensity = JSON.parse(localStorage.getItem("crowdDensity") || "{}");
    setCrowdDensity(savedDensity);

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

    // Increment local crowdDensity
    setCrowdDensity((prev) => {
      const updated = {
        ...prev,
        [vehicleNumber]: (prev[vehicleNumber] || 0) + 1,
      };
      localStorage.setItem("crowdDensity", JSON.stringify(updated));
      return updated;
    });

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
          {buses.map((bus) => {
            const vehicleNo = vehicleNumbers[bus.routeId];
            const crowd = crowdDensity[vehicleNo] || 0;

            return (
              <li key={bus.routeId} className="border p-4 rounded-lg shadow-md">
                <p className="font-medium">Route ID: {bus.routeId}</p>
                <p className="text-sm text-gray-700 mb-1">Vehicle No: {vehicleNo}</p>
                <p className="mb-1">{realTimeUpdates[bus.routeId] || "Fetching ETA..."}</p>
                <p className="mb-2">Crowd density: {crowd}/70</p>
                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  onClick={() => handleBooking(bus.routeId)}
                >
                  Book Ticket
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default BusDetails;
