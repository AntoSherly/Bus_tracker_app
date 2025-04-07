import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const busDetails = location.state || {};

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();

    toast({
      title: "✅ Payment Successful",
      description: "Your ticket has been booked successfully!",
    });

    const ticketDetails = {
      ...busDetails,
      ticketId: "TN" + Math.floor(100000 + Math.random() * 900000), // simulated ID
    };

    navigate("/ticket", { state: ticketDetails });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">💳 Payment</h2>

        <div className="bg-blue-50 p-4 rounded-lg shadow-sm mb-6 text-sm space-y-2">
          <p><span className="font-semibold">🚌 Bus:</span> {busDetails?.routeId || 'N/A'}</p>
          <p><span className="font-semibold">🚍 Vehicle No:</span> {busDetails?.vehicleNumber || 'N/A'}</p>
          <p><span className="font-semibold">📍 From:</span> {busDetails?.startStop || 'Unknown'}</p>
          <p><span className="font-semibold">📍 To:</span> {busDetails?.destination || 'Unknown'}</p>
          <p className="pt-2 font-semibold text-green-700">💰 Fare: ₹50</p>
        </div>

        <form onSubmit={handlePayment} className="space-y-4">
          <div className="space-y-1">
            <label htmlFor="upi" className="text-sm font-medium text-gray-700">UPI ID</label>
            <Input id="upi" placeholder="example@upi" required />
          </div>

          <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white">
            Pay ₹50
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Payment;
