import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import routeData from "../data/route_detail.json";

interface RouteEntry {
  route_id: number | string;
  stop_id: number;
  stop_name: string;
}

const TicketMachine = () => {
  const { toast } = useToast();
  const [display, setDisplay] = useState("Welcome");
  const [currentMode, setCurrentMode] = useState<"route" | "from" | "to" | "passengers" | "confirm">("route");
  const [selectedRoute, setSelectedRoute] = useState("");
  const [selectedFrom, setSelectedFrom] = useState("");
  const [selectedTo, setSelectedTo] = useState("");
  const [passengerCount, setPassengerCount] = useState(1);
  const [numericInput, setNumericInput] = useState("");
  const [routes] = useState(() => {
    const routesMap: Record<string, string[]> = {};
    (routeData as RouteEntry[]).forEach((entry) => {
      const routeKey = entry.route_id.toString();
      if (!routesMap[routeKey]) {
        routesMap[routeKey] = [];
      }
      if (!routesMap[routeKey].includes(entry.stop_name)) {
        routesMap[routeKey].push(entry.stop_name);
      }
    });
    return routesMap;
  });

  const calculateFare = (from: string, to: string, route: string): number => {
    const baseDistance = 5;
    const baseRate = 10;
    const perKmRate = 2;
    const stopDistance = Math.abs(
      routes[route].indexOf(to) - routes[route].indexOf(from)
    );
    const estimatedDistance = Math.max(baseDistance, stopDistance * 2);
    return baseRate + Math.max(0, estimatedDistance - baseDistance) * perKmRate;
  };

  const handleNumericInput = (num: string) => {
    if (currentMode === "route") {
      setNumericInput(prev => {
        const newInput = prev + num;
        if (routes[newInput]) {
          setSelectedRoute(newInput);
          setCurrentMode("from");
          setDisplay(`Route ${newInput}\nSelect start point:\n1-${routes[newInput].length}`);
          return "";
        }
        return newInput;
      });
    } else if (currentMode === "from") {
      setNumericInput(prev => {
        const newInput = prev + num;
        const index = parseInt(newInput) - 1;
        if (index >= 0 && index < routes[selectedRoute].length) {
          setSelectedFrom(routes[selectedRoute][index]);
          setCurrentMode("to");
          setDisplay(`From: ${routes[selectedRoute][index]}\nSelect destination:\n1-${routes[selectedRoute].length}`);
          return "";
        }
        return newInput;
      });
    } else if (currentMode === "to") {
      setNumericInput(prev => {
        const newInput = prev + num;
        const index = parseInt(newInput) - 1;
        if (index >= 0 && index < routes[selectedRoute].length) {
          const toStop = routes[selectedRoute][index];
          if (routes[selectedRoute].indexOf(toStop) <= routes[selectedRoute].indexOf(selectedFrom)) {
            toast({
              title: "Invalid Selection",
              description: "Destination must be after starting point",
              variant: "destructive",
            });
            return "";
          }
          setSelectedTo(toStop);
          setCurrentMode("passengers");
          setDisplay("Enter number of passengers:\n(1-9)");
          return "";
        }
        return newInput;
      });
    } else if (currentMode === "passengers") {
      const count = parseInt(num);
      if (count > 0 && count < 10) {
        setPassengerCount(count);
        const fare = calculateFare(selectedFrom, selectedTo, selectedRoute) * count;
        setCurrentMode("confirm");
        setDisplay(`Route: ${selectedRoute}\nFrom: ${selectedFrom}\nTo: ${selectedTo}\nPassengers: ${count}\nTotal: ₹${fare}\n\nPress ENTER to confirm\nPress CLR to cancel`);
      }
      return "";
    }
    return "";
  };

  const handleClear = () => {
    setNumericInput("");
    setSelectedRoute("");
    setSelectedFrom("");
    setSelectedTo("");
    setPassengerCount(1);
    setCurrentMode("route");
    setDisplay("Enter Route Number");
  };

  const handleEnter = async () => {
    if (currentMode === "confirm") {
      try {
        const fare = calculateFare(selectedFrom, selectedTo, selectedRoute) * passengerCount;
        const response = await fetch("http://localhost:5001/api/tickets", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            busNumber: selectedRoute,
            from: selectedFrom,
            to: selectedTo,
            passengerCount,
            ticketPrice: fare,
            timestamp: new Date().toISOString(),
          }),
        });

        const data = await response.json();
        if (response.ok) {
          setDisplay(`Ticket Issued!\nRoute: ${selectedRoute}\nTotal: ₹${fare}\n\nPress CLR for new ticket`);
          toast({
            title: "Success",
            description: data.message || "Ticket issued successfully",
          });
          
          // Reset the state for next ticket
          setCurrentMode("route");
          setSelectedRoute("");
          setSelectedFrom("");
          setSelectedTo("");
          setPassengerCount(1);
          setNumericInput("");
        } else {
          throw new Error(data.error || "Failed to issue ticket");
        }
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to issue ticket",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-3xl p-8 w-full max-w-md space-y-6">
        {/* ETM Display */}
        <div className="bg-green-100 p-4 h-48 font-mono text-green-900 whitespace-pre-wrap rounded-lg">
          {display}
        </div>

        {/* ETM Keypad */}
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <Button
              key={num}
              variant="outline"
              className="h-16 text-2xl font-mono bg-gray-700 text-white hover:bg-gray-600"
              onClick={() => handleNumericInput(num.toString())}
            >
              {num}
            </Button>
          ))}
          <Button
            variant="outline"
            className="h-16 text-xl font-mono bg-red-700 text-white hover:bg-red-600"
            onClick={handleClear}
          >
            CLR
          </Button>
          <Button
            variant="outline"
            className="h-16 text-2xl font-mono bg-gray-700 text-white hover:bg-gray-600"
            onClick={() => handleNumericInput("0")}
          >
            0
          </Button>
          <Button
            variant="outline"
            className="h-16 text-xl font-mono bg-green-700 text-white hover:bg-green-600"
            onClick={handleEnter}
          >
            ENT
          </Button>
        </div>

        {/* Help Text */}
        <div className="text-gray-400 text-sm">
          <p>Current Mode: {currentMode}</p>
          <p>Input: {numericInput}</p>
        </div>
      </div>
    </div>
  );
};

export default TicketMachine; 