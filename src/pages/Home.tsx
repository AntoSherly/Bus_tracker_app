import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Search, User, Bus, MapPin, AlertTriangle, Ticket, ChevronRight, AlertOctagon, Loader2, Phone, Bell, X, Clock } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import axios from 'axios';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Link } from "react-router-dom";
import EmergencyContacts from "@/components/EmergencyContacts";

interface GeolocationPosition {
  coords: {
    latitude: number;
    longitude: number;
  };
}

const Home = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [emergencyContact, setEmergencyContact] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [isInputFocused, setIsInputFocused] = useState(false);

  useEffect(() => {
    // Load saved emergency contact
    const savedContact = localStorage.getItem("emergencyContact");
    if (savedContact) {
      setEmergencyContact(savedContact);
    }
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.match(/^\d+/)) {
      navigate("/bus-map", { state: { busNumber: searchQuery } });
    } else {
      navigate("/bus-search", { state: { destination: searchQuery } });
    }
  };

  const handleEmergencyAlert = async () => {
    if (!emergencyContact) {
      toast({
        title: "No Emergency Contact",
        description: "Please set your emergency contact in the Profile page",
        variant: "destructive",
      });
      navigate("/profile");
      return;
    }

    setIsLoading(true);
    try {
      // Get current location
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      const response = await fetch('http://localhost:5001/api/emergency-alert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber: emergencyContact,
          location: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          }
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "Success",
          description: data.message || 'Emergency alert sent successfully',
        });
        setShowDialog(false);
      } else {
        toast({
          title: "Error",
          description: data.message || 'Failed to send emergency alert',
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error sending emergency alert:', error);
      toast({
        title: "Error",
        description: error instanceof GeolocationPositionError 
          ? 'Unable to get your location. Please enable location access.'
          : 'Failed to send emergency alert. Please try again.',
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmergencyCall = (number: string, service: string) => {
    toast({
      title: "Emergency Alert",
      description: `Connecting to ${service}...`,
    });
    // In a real app, this would trigger the actual emergency call
    console.log(`Calling ${service}: ${number}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-cyan-50 relative">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto p-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent">
              SmartBus
            </h1>
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                className="bg-red-100 text-red-600 hover:bg-red-200 hover:text-red-700 rounded-full p-3"
                onClick={() => setShowDialog(true)}
              >
                <Phone className="h-6 w-6" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/profile")}
              >
                <Bell className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto p-4">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Search Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">Find Your Bus</h2>
            <form onSubmit={handleSearch} className="space-y-4">
              <div className={`relative transform transition-all duration-300 ${isInputFocused ? 'scale-105' : ''}`}>
                <Input
                  type="text"
                  placeholder="Enter bus number or destination stop"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsInputFocused(true)}
                  onBlur={() => setIsInputFocused(false)}
                  className="pl-10 h-12 border-2 border-indigo-100 focus:border-indigo-500 rounded-xl shadow-sm"
                />
                <Search className="absolute left-3 top-4 h-4 w-4 text-indigo-400" />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700 transform hover:scale-105 transition-all duration-300 h-12 rounded-xl shadow-lg"
              >
                <Search className="mr-2 h-4 w-4" />
                Search
              </Button>
            </form>
          </div>

          {/* Quick Actions */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-6 text-gray-800">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                className="p-6 h-auto flex flex-col items-center space-y-2 hover:bg-indigo-50 hover:border-indigo-200 transition-all duration-300 rounded-xl"
                onClick={() => navigate("/bus-search")}
              >
                <Bus className="h-8 w-8 text-indigo-600" />
                <span>Find Routes</span>
              </Button>
              <Button
                variant="outline"
                className="p-6 h-auto flex flex-col items-center space-y-2 hover:bg-cyan-50 hover:border-cyan-200 transition-all duration-300 rounded-xl"
                onClick={() => navigate("/ticket")}
              >
                <MapPin className="h-8 w-8 text-cyan-600" />
                <span>My Tickets</span>
              </Button>
            </div>
          </div>

          {/* Recent Trips */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Recent Trips</h2>
              <Button variant="ghost" className="text-indigo-600">
                View All <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <p className="font-medium">Route 118</p>
                  <p className="text-sm text-gray-600">Tambaram to Maraimalai Nagar</p>
                </div>
                <Button variant="ghost" size="icon">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <p className="font-medium">Route M88</p>
                  <p className="text-sm text-gray-600">Vadapalani to Kundrathur</p>
                </div>
                <Button variant="ghost" size="icon">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="bg-white border-2 border-red-500 shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-red-600">Emergency Alert</DialogTitle>
            <DialogDescription className="text-lg">
              {emergencyContact 
                ? `Emergency alert will be sent to ${emergencyContact}`
                : "Please set your emergency contact in the Profile page"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {!emergencyContact && (
              <Button
                variant="outline"
                className="w-full bg-red-50 text-red-600 hover:bg-red-100 border-red-200"
                onClick={() => navigate("/profile")}
              >
                Set Emergency Contact
              </Button>
            )}
            <Button
              variant="destructive"
              onClick={handleEmergencyAlert}
              disabled={isLoading || !emergencyContact}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 text-lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Sending Alert...
                </>
              ) : (
                'Send Emergency Alert'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Home;
