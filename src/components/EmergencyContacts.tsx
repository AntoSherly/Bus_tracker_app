import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Phone, AlertTriangle, Shield, MapPin, Clock, User, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface EmergencyContactsProps {
  onClose?: () => void;
  isModal?: boolean;
  emergencyContact?: string;
  onSaveContact?: (contact: string) => void;
}

const EmergencyContacts = ({ 
  onClose, 
  isModal = false,
  emergencyContact: initialContact = "",
  onSaveContact 
}: EmergencyContactsProps) => {
  const { toast } = useToast();
  const [emergencyContact, setEmergencyContact] = useState(initialContact);

  const handleSaveContact = () => {
    if (!emergencyContact || !/^\d{10}$/.test(emergencyContact)) {
      toast({
        title: "Invalid Number",
        description: "Please enter a valid 10-digit phone number",
        variant: "destructive",
      });
      return;
    }

    if (onSaveContact) {
      onSaveContact(emergencyContact);
    }

    toast({
      title: "Emergency Contact Updated",
      description: "Your emergency contact has been saved",
    });

    if (onClose) {
      onClose();
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

  const content = (
    <div className="space-y-6">
      {/* Quick Emergency Services */}
      <div className="grid grid-cols-2 gap-4">
        <Button
          variant="destructive"
          className="flex items-center space-x-2"
          onClick={() => handleEmergencyCall("100", "Police")}
        >
          <Phone className="h-5 w-5" />
          <span>Police (100)</span>
        </Button>
        <Button
          variant="destructive"
          className="flex items-center space-x-2"
          onClick={() => handleEmergencyCall("108", "Ambulance")}
        >
          <AlertTriangle className="h-5 w-5" />
          <span>Ambulance (108)</span>
        </Button>
      </div>

      {/* Emergency Instructions */}
      <div className="space-y-4">
        <div className="flex items-start space-x-3">
          <div className="bg-blue-100 p-2 rounded-lg mt-1">
            <MapPin className="h-4 w-4 text-blue-600" />
          </div>
          <div>
            <p className="font-medium">Location Sharing</p>
            <p className="text-sm text-gray-600">Your location will be automatically shared with emergency services</p>
          </div>
        </div>
        <div className="flex items-start space-x-3">
          <div className="bg-blue-100 p-2 rounded-lg mt-1">
            <Clock className="h-4 w-4 text-blue-600" />
          </div>
          <div>
            <p className="font-medium">Response Time</p>
            <p className="text-sm text-gray-600">Emergency services typically respond within 5-10 minutes</p>
          </div>
        </div>
      </div>

      {/* Emergency Contact */}
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <div className="bg-red-100 p-2 rounded-lg">
            <User className="h-5 w-5 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">Trusted Emergency Contact</h3>
        </div>
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
          onClick={handleSaveContact}
        >
          Save Contact
        </Button>
      </div>
    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <Card className="w-full max-w-md mx-4 bg-white">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Emergency Contacts</h2>
              {onClose && (
                <Button variant="ghost" size="icon" onClick={onClose}>
                  <X className="h-5 w-5" />
                </Button>
              )}
            </div>
            {content}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Emergency Contacts</h2>
      {content}
    </Card>
  );
};

export default EmergencyContacts; 