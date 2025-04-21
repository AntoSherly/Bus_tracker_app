import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { User, Bus, MapPin, Clock, Star, Bell, Shield, Phone, CreditCard, Settings, Ticket, Plus, AlertTriangle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import EmergencyContacts from "@/components/EmergencyContacts";

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [monthlyPass, setMonthlyPass] = useState({
    validUntil: "30/04/2024",
    isActive: true
  });
  const [balance, setBalance] = useState(250);
  const [notifications, setNotifications] = useState({
    arrivalAlerts: false,
    routeUpdates: false
  });
  const [showAddMoneyDialog, setShowAddMoneyDialog] = useState(false);
  const [amountToAdd, setAmountToAdd] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");

  // Load emergency contact from localStorage on component mount
  useEffect(() => {
    const savedContact = localStorage.getItem("emergencyContact");
    if (savedContact) {
      setEmergencyContact(savedContact);
    }
  }, []);

  const handleSaveEmergencyContact = (contact: string) => {
    setEmergencyContact(contact);
    localStorage.setItem("emergencyContact", contact);
  };

  const handleRenewPass = () => {
    setMonthlyPass({
      validUntil: "30/05/2024",
      isActive: true
    });
    toast({
      title: "Pass Renewed",
      description: "Your monthly pass has been renewed successfully",
    });
  };

  const handleAddMoney = () => {
    const amount = parseInt(amountToAdd);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }
    setBalance(prev => prev + amount);
    setShowAddMoneyDialog(false);
    setAmountToAdd("");
    toast({
      title: "Balance Updated",
      description: `₹${amount} has been added to your smart card`,
    });
  };

  const toggleNotification = (type: 'arrivalAlerts' | 'routeUpdates') => {
    setNotifications(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
    toast({
      title: notifications[type] ? "Notifications Disabled" : "Notifications Enabled",
      description: `${type === 'arrivalAlerts' ? 'Bus arrival' : 'Route update'} notifications have been ${notifications[type] ? 'disabled' : 'enabled'}`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-cyan-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="h-12 w-12 text-indigo-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">Bus Pass & Settings</h1>
            <p className="text-gray-600 mt-2">Manage your bus travel preferences</p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <Button
              variant="outline"
              className="h-auto py-4"
              onClick={() => navigate("/ticket")}
            >
              <Ticket className="h-5 w-5 mr-2" />
              My Tickets
            </Button>
            <Button
              variant="outline"
              className="h-auto py-4"
              onClick={() => navigate("/bus-search")}
            >
              <Bus className="h-5 w-5 mr-2" />
              Find Bus
            </Button>
          </div>

          {/* Bus Pass & Balance */}
          <Card className="p-6 mb-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-green-100 p-2 rounded-lg">
                <CreditCard className="h-5 w-5 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Bus Pass & Balance</h2>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600">Monthly Pass</p>
                  <p className="font-medium">Valid until: {monthlyPass.validUntil}</p>
                </div>
                <Button 
                  variant="outline"
                  onClick={handleRenewPass}
                >
                  Renew
                </Button>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600">Smart Card Balance</p>
                  <p className="font-medium">₹{balance}</p>
                </div>
                <Button 
                  variant="outline"
                  onClick={() => setShowAddMoneyDialog(true)}
                >
                  Add Money
                </Button>
              </div>
            </div>
          </Card>

          {/* Emergency Contacts */}
          <EmergencyContacts 
            emergencyContact={emergencyContact}
            onSaveContact={handleSaveEmergencyContact}
          />

          {/* Notifications */}
          <Card className="p-6 mb-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Bell className="h-5 w-5 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Notifications</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Bus Arrival Alerts</p>
                  <p className="text-sm text-gray-600">Get notified when your bus is nearby</p>
                </div>
                <Button 
                  variant={notifications.arrivalAlerts ? "default" : "outline"}
                  onClick={() => toggleNotification('arrivalAlerts')}
                >
                  {notifications.arrivalAlerts ? "Enabled" : "Enable"}
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Route Updates</p>
                  <p className="text-sm text-gray-600">Receive updates about route changes</p>
                </div>
                <Button 
                  variant={notifications.routeUpdates ? "default" : "outline"}
                  onClick={() => toggleNotification('routeUpdates')}
                >
                  {notifications.routeUpdates ? "Enabled" : "Enable"}
                </Button>
              </div>
            </div>
          </Card>

          {/* Settings */}
          <Card className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-gray-100 p-2 rounded-lg">
                <Settings className="h-5 w-5 text-gray-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Settings</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Language</p>
                  <p className="text-sm text-gray-600">Select your preferred language</p>
                </div>
                <Button variant="outline">English</Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Theme</p>
                  <p className="text-sm text-gray-600">Choose your app theme</p>
                </div>
                <Button variant="outline">Light</Button>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Add Money Dialog */}
      <Dialog open={showAddMoneyDialog} onOpenChange={setShowAddMoneyDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Money to Smart Card</DialogTitle>
            <DialogDescription>
              Enter the amount you want to add to your smart card balance.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              type="number"
              placeholder="Enter amount"
              value={amountToAdd}
              onChange={(e) => setAmountToAdd(e.target.value)}
              min="1"
            />
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddMoneyDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddMoney}>
                Add Money
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Profile; 