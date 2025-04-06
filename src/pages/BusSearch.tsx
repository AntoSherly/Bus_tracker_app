import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import routeData from "@/data/route_detail.json";

interface Route {
  route_id: string | number;
  stop_name: string;
}

interface RealTimeBus {
  routeId: string;
  currentStop: string;
  eta: string;
}

const typedRouteData: Route[] = routeData as Route[];

const BusSearch = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [startStop, setStartStop] = useState("");
  const [destination, setDestination] = useState("");
  const [allStops, setAllStops] = useState<string[]>([]);
  const [searchTextStart, setSearchTextStart] = useState("");
  const [searchTextEnd, setSearchTextEnd] = useState("");

  useEffect(() => {
    const stops = new Set(typedRouteData.map((stop) => stop.stop_name));
    setAllStops(Array.from(stops));
  }, []);

  const normalize = (str: string) => str.trim().toLowerCase();

  const getMockRealTimeBusData = (routeId: string, stops: string[]) => {
    const mockStopIndex = Math.floor(Math.random() * (stops.length - 1));
    const currentStop = stops[mockStopIndex];
    const etaMinutes = 2 + Math.floor(Math.random() * 10);
    return {
      routeId,
      currentStop,
      eta: `${etaMinutes} min`,
    };
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (!startStop || !destination) {
      toast({
        title: "Missing information",
        description: "Please select both start and destination stops",
        variant: "destructive",
      });
      return;
    }

    if (startStop === destination) {
      toast({
        title: "Invalid selection",
        description: "Start and destination stops cannot be the same",
        variant: "destructive",
      });
      return;
    }

    const routesMap: Record<string, string[]> = {};
    typedRouteData.forEach(({ route_id, stop_name }) => {
      const key = String(route_id);
      if (!routesMap[key]) {
        routesMap[key] = [];
      }
      routesMap[key].push(stop_name);
    });

    const validRoutes = Object.entries(routesMap)
      .filter(([_, stops]) => {
        const startIndex = stops.findIndex(
          (s) => normalize(s) === normalize(startStop)
        );
        const destinationIndex = stops.findIndex(
          (s) => normalize(s) === normalize(destination)
        );

        return (
          startIndex !== -1 &&
          destinationIndex !== -1 &&
          startIndex < destinationIndex
        );
      })
      .map(([routeId, stops]) => {
        const { eta } = getMockRealTimeBusData(routeId, stops);
        return { routeId, stops, eta };
      });

    navigate("/available-buses", {
      state: {
        buses: validRoutes,
        startStop,
        destination,
      },
    });
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-2xl font-bold mb-6">Find Your Bus</h1>

      <form onSubmit={handleSearch} className="space-y-4">
        <div>
          <p className="mb-1 text-sm font-medium">Start Stop</p>
          <Command>
            <CommandInput
              placeholder="Type to search..."
              value={searchTextStart}
              onValueChange={setSearchTextStart}
            />
            <CommandList>
              {allStops
                .filter((stop) =>
                  stop.toLowerCase().includes(searchTextStart.toLowerCase())
                )
                .map((stop) => (
                  <CommandItem
                    key={stop}
                    onSelect={() => {
                      setStartStop(stop);
                      setSearchTextStart(stop);
                    }}
                  >
                    {stop}
                  </CommandItem>
                ))}
            </CommandList>
          </Command>
        </div>

        <div>
          <p className="mb-1 text-sm font-medium">Destination</p>
          <Command>
            <CommandInput
              placeholder="Type to search..."
              value={searchTextEnd}
              onValueChange={setSearchTextEnd}
            />
            <CommandList>
              {allStops
                .filter((stop) =>
                  stop.toLowerCase().includes(searchTextEnd.toLowerCase())
                )
                .map((stop) => (
                  <CommandItem
                    key={stop}
                    onSelect={() => {
                      setDestination(stop);
                      setSearchTextEnd(stop);
                    }}
                  >
                    {stop}
                  </CommandItem>
                ))}
            </CommandList>
          </Command>
        </div>

        <Button type="submit">Search Buses</Button>
      </form>
    </div>
  );
};

export default BusSearch;
