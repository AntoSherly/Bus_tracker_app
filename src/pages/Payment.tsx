import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const busDetails = location.state || {};  // Fallback if no state is passed

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();

    // Simulate successful payment
    toast({
      title: "Payment Successful",
      description: "Your ticket has been booked successfully!"
    });

    // Pass the bus details to the ticket page
    const ticketDetails = {
      ...busDetails, // include the bus number, start, and destination
      ticketId: "1234567890" // Simulated ticket ID
    };

    navigate("/ticket", { state: ticketDetails });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Payment</h1>

      <form onSubmit={handlePayment} className="space-y-4">
        <div className="bg-card p-4 rounded-lg shadow mb-6">
          <h2 className="font-semibold mb-2">Trip Details</h2>
          <p>Bus: {busDetails?.number || 'N/A'}</p> {/* Fallback if busDetails.number is not provided */}
          <p>From: {busDetails?.startStop || 'Unknown'}</p> {/* Fallback if busDetails.startStop is not provided */}
          <p>To: {busDetails?.destination || 'Unknown'}</p> {/* Fallback if busDetails.destination is not provided */}
          <p className="mt-2 font-semibold">Amount: ₹50</p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">UPI ID</label>
          <Input placeholder="Enter your UPI ID" required />
        </div>

        <Button type="submit" className="w-full">
          Pay ₹50
        </Button>
      </form>
    </div>
  );
};

export default Payment;
