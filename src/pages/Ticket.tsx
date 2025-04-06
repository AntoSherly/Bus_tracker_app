import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { QrCode, Bus, MapPin } from "lucide-react";

const Ticket = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const ticketDetails = location.state || {};  // Fallback if no state is passed

  const { number, startStop, destination, ticketId } = ticketDetails;

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-md mx-auto bg-card p-6 rounded-lg shadow-lg">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">Bus Ticket</h1>
          <p className="text-muted-foreground">Valid for today</p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center">
            <Bus className="mr-2 h-5 w-5" />
            <div>
              <p className="font-medium">Bus Number</p>
              <p className="text-muted-foreground">{number || 'N/A'}</p>  {/* Fallback if number is missing */}
            </div>
          </div>

          <div className="flex items-center">
            <MapPin className="mr-2 h-5 w-5" />
            <div>
              <p className="font-medium">From - To</p>
              <p className="text-muted-foreground">
                {startStop || 'Unknown'} - {destination || 'Unknown'}
              </p>  {/* Fallback if startStop or destination is missing */}
            </div>
          </div>

          <div className="flex justify-center my-6">
            <QrCode className="h-32 w-32" />
          </div>

          <div className="text-center">
            <p className="font-medium">Ticket ID</p>
            <p className="text-muted-foreground">{ticketId || 'Unavailable'}</p>  {/* Fallback if ticketId is missing */}
          </div>
        </div>

        <Button
          className="w-full mt-6"
          onClick={() => navigate("/home")}
        >
          Back to Home
        </Button>
      </div>
    </div>
  );
};

export default Ticket;
