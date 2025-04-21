import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Phone, AlertTriangle, Shield, MapPin, Clock, User, ChevronLeft } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const EmergencyContacts = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [emergencyContact, setEmergencyContact] = useState("");

  const handleEmergencyContact = () => {
    if (!emergencyContact || !/^\d{10}$/.test(emergencyContact)) {
      toast({
        title: "Invalid Number",
        description: "Please enter a valid 10-digit phone number",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Emergency Contact Updated",
      description: "Your emergency contact has been saved",
    });
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-cyan-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="flex items-center"
            >
              <ChevronLeft className="h-5 w-5 mr-2" />
              Back
            </Button>
            <h1 className="text-3xl font-bold text-gray-800">Emergency Contacts</h1>
            <div className="w-10" /> {/* Spacer for alignment */}
          </div>

          {/* Quick Emergency Services */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <Card className="p-4 bg-red-50 border-red-200">
              <div className="flex items-center space-x-3">
                <div className="bg-red-100 p-2 rounded-lg">
                  <Phone className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-red-800">Police</h3>
                  <p className="text-sm text-red-600">100</p>
                </div>
              </div>
              <Button
                variant="destructive"
                className="w-full mt-3"
                onClick={() => handleEmergencyCall("100", "Police")}
              >
                Call Police
              </Button>
            </Card>

            <Card className="p-4 bg-amber-50 border-amber-200">
              <div className="flex items-center space-x-3">
                <div className="bg-amber-100 p-2 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-amber-800">Ambulance</h3>
                  <p className="text-sm text-amber-600">108</p>
                </div>
              </div>
              <Button
                variant="destructive"
                className="w-full mt-3"
                onClick={() => handleEmergencyCall("108", "Ambulance")}
              >
                Call Ambulance
              </Button>
            </Card>
          </div>

          {/* Emergency Instructions */}
          <Card className="p-6 mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Shield className="h-5 w-5 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Emergency Instructions</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="bg-gray-100 p-2 rounded-lg mt-1">
                  <MapPin className="h-4 w-4 text-gray-600" />
                </div>
                <div>
                  <p className="font-medium">Location Sharing</p>
                  <p className="text-sm text-gray-600">Your location will be automatically shared with emergency services</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-gray-100 p-2 rounded-lg mt-1">
                  <Clock className="h-4 w-4 text-gray-600" />
                </div>
                <div>
                  <p className="font-medium">Response Time</p>
                  <p className="text-sm text-gray-600">Emergency services typically respond within 5-10 minutes</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-gray-100 p-2 rounded-lg mt-1">
                  <User className="h-4 w-4 text-gray-600" />
                </div>
                <div>
                  <p className="font-medium">Stay Calm</p>
                  <p className="text-sm text-gray-600">Provide clear information about the emergency situation</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Emergency Contact */}
          <Card className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-indigo-100 p-2 rounded-lg">
                <Phone className="h-5 w-5 text-indigo-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Trusted Emergency Contact</h2>
            </div>
            <div className="space-y-4">
              <Input
                type="tel"
                placeholder="Enter emergency contact number"
                value={emergencyContact}
                onChange={(e) => setEmergencyContact(e.target.value)}
                maxLength={10}
              />
              <Button
                variant="destructive"
                className="w-full"
                onClick={handleEmergencyContact}
              >
                Save Contact
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EmergencyContacts; 