import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MapPin, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

// Mock data for bus routes
const mockBusRoutes = {
  "23C": [
    { stop_id: 1, stop_name: "Adyar", sno: "1" },
    { stop_id: 2, stop_name: "T Nagar", sno: "2" },
    { stop_id: 3, stop_name: "Saidapet", sno: "3" },
    { stop_id: 4, stop_name: "Guindy", sno: "4" },
  ],
  "47A": [
    { stop_id: 1, stop_name: "Besant Nagar", sno: "1" },
    { stop_id: 2, stop_name: "Indira Nagar", sno: "2" },
    { stop_id: 3, stop_name: "Adyar", sno: "3" },
    { stop_id: 4, stop_name: "Parrys", sno: "4" },
  ],
  // Add more bus routes as needed
};

const BusRoute = () => {
  const { busNumber } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [stops, setStops] = useState<{ stop_id: number; stop_name: string; sno: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBusStops() {
      setIsLoading(true);
      setError(null);

      try {
        // Simulate fetching data from mock data instead of Supabase
        const data = mockBusRoutes[busNumber as keyof typeof mockBusRoutes];

        if (data) {
          setStops(data);
        } else {
          setError(`No stops found for bus route ${busNumber}`);
        }
      } catch (error) {
        console.error("Error fetching bus stops:", error);
        setError("Could not load bus stops. Please try again later.");
        toast({
          title: "Error",
          description: "Could not load bus stops. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchBusStops();
  }, [busNumber, toast]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
        Bus {busNumber} Route
      </h1>

      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="h-8 w-8 text-purple-500 animate-spin" />
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 p-4 rounded-lg text-center">
          <p className="text-red-600">{error}</p>
        </div>
      ) : (
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-600 to-blue-600"></div>

          <div className="space-y-8 ml-8">
            {stops.map((stop, index) => (
              <div key={stop.stop_id} className="relative">
                <MapPin
                  className={`absolute -left-10 p-1 ${
                    index === 0
                      ? "text-purple-600 bg-purple-100"
                      : index === stops.length - 1
                      ? "text-blue-600 bg-blue-100"
                      : "text-primary bg-background"
                  } rounded-full`}
                />
                <div className="bg-card p-4 rounded-lg shadow hover:shadow-md transition-shadow">
                  <h3 className="font-medium">{stop.stop_name || `Stop ${stop.stop_id}`}</h3>
                  <p className="text-sm text-muted-foreground">Stop #{index + 1}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <Button
        className="mt-8 w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
        onClick={() => navigate(-1)}
      >
        Back to Search
      </Button>
    </div>
  );
};

export default BusRoute;
