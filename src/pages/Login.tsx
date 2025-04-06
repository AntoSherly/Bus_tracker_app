import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Phone } from "lucide-react";

const Login = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber.length !== 10) {
      toast({
        variant: "destructive",
        title: "Invalid phone number",
        description: "Please enter a valid 10-digit phone number",
      });
      return;
    }
    setShowOtp(true);
    // In a real app, this would send an OTP to the phone number
    toast({
      title: "OTP Sent",
      description: "Please check your phone for the OTP",
    });
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast({
        variant: "destructive",
        title: "Invalid OTP",
        description: "Please enter a valid 6-digit OTP",
      });
      return;
    }
    // In a real app, this would verify the OTP
    navigate("/home");
    toast({
      title: "Login Successful",
      description: "Welcome to Bus Route Magic!",
    });
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
      
      {!showOtp ? (
        <form onSubmit={handleSendOtp} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Phone Number</label>
            <div className="flex gap-2">
              <Input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ""))}
                placeholder="Enter your phone number"
                maxLength={10}
              />
            </div>
          </div>
          <Button type="submit" className="w-full">
            <Phone className="mr-2 h-4 w-4" />
            Send OTP
          </Button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Enter OTP</label>
            <Input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              placeholder="Enter 6-digit OTP"
              maxLength={6}
            />
          </div>
          <Button type="submit" className="w-full">
            Verify OTP
          </Button>
        </form>
      )}
    </div>
  );
};

export default Login;