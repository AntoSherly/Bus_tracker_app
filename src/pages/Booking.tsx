
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Clock, Users, Loader2, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface BusData {
  route_id: string;
  time: string;
  occupancy: number;
}

const Booking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { startStop, destination } = location.state || {};
  
  const [availableBuses, setAvailableBuses] = useState<BusData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!startStop || !destination) {
      setError("Missing start stop or destination");
      return;
    }

    async function fetchAvailableBuses() {
      setIsLoading(true);
      setError(null);
      
      try {
        // Find route_ids that contain both the start and destination stops
        const { data: startStopData, error: startError } = await supabase
          .from("stops")
          .select("route_id")
          .eq("stop_name", startStop);
          
        if (startError) throw startError;
        
        const { data: destStopData, error: destError } = await supabase
          .from("stops")
          .select("route_id")
          .eq("stop_name", destination);
          
        if (destError) throw destError;
        
        if (!startStopData || !destStopData) {
          setError("Could not find routes");
          setIsLoading(false);
          return;
        }
        
        // Find route_ids that are in both arrays
        const startRouteIds = startStopData.map(item => item.route_id);
        const destRouteIds = destStopData.map(item => item.route_id);
        const commonRouteIds = startRouteIds.filter(id => destRouteIds.includes(id));
        
        if (commonRouteIds.length === 0) {
          setError("No buses available for this route");
          setIsLoading(false);
          return;
        }
        
        // For each route, generate a random arrival time and occupancy (in a real app, this would come from the server)
        const busesData: BusData[] = commonRouteIds.map(route_id => {
          const randomMinutes = Math.floor(Math.random() * 30) + 5; // Random arrival time between 5-35 minutes
          const randomOccupancy = Math.floor(Math.random() * 35) + 5; // Random occupancy between 5-40 passengers
          
          return {
            route_id,
            time: `${randomMinutes} min`,
            occupancy: randomOccupancy
          };
        });
        
        setAvailableBuses(busesData);
      } catch (error) {
        console.error("Error fetching buses:", error);
        setError("Failed to fetch available buses");
      } finally {
        setIsLoading(false);
      }
    }

    fetchAvailableBuses();
  }, [startStop, destination]);

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-2xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Available Buses</h1>
      
      <div className="mb-6 flex items-center justify-between">
        <div className="text-sm">
          <p className="font-medium">From: <span className="text-purple-600">{startStop}</span></p>
          <p className="font-medium">To: <span className="text-blue-600">{destination}</span></p>
        </div>
        <Button
          variant="outline"
          onClick={() => navigate(-1)}
          className="text-xs px-2 py-1 h-auto"
        >
          Change
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="h-8 w-8 text-purple-500 animate-spin" />
        </div>
      ) : error ? (
        <div className="bg-red-50 p-4 rounded-lg flex items-start space-x-3 my-4">
          <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
          <div>
            <h3 className="font-medium text-red-800">No buses found</h3>
            <p className="text-sm text-red-700">{error}</p>
            <Button 
              onClick={() => navigate(-1)} 
              className="mt-3 text-sm px-3 py-1.5 h-auto bg-red-100 hover:bg-red-200 text-red-800"
            >
              Go back
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {availableBuses.map((bus) => (
            <div 
              key={bus.route_id} 
              className="bg-card p-4 rounded-lg shadow border-2 border-purple-50 hover:border-purple-100 transition-all"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold">Bus {bus.route_id}</h3>
                <Button
                  onClick={() => navigate("/payment", { 
                    state: { 
                      ...bus, 
                      startStop, 
                      destination 
                    } 
                  })}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  Book Ticket
                </Button>
              </div>
              <div className="flex space-x-4 text-sm text-muted-foreground">
                <span className="flex items-center">
                  <Clock className="mr-1 h-4 w-4 text-purple-500" />
                  {bus.time}
                </span>
                <span className="flex items-center">
                  <Users className="mr-1 h-4 w-4 text-blue-500" />
                  {bus.occupancy} passengers
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Booking;
