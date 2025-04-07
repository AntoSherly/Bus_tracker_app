import { useLocation, useNavigate } from "react-router-dom";

interface LocationState {
  routeId: string;
  vehicleNumber: string;
  startStop: string;
  destination: string;
}

const BookTicket = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState;

  if (!state) return <p className="text-center mt-10 text-red-500">No ticket information found.</p>;

  const handleBookNow = () => {
    navigate("/payment", {
      state: {
        routeId: state.routeId,
        vehicleNumber: state.vehicleNumber,
        startStop: state.startStop,
        destination: state.destination,
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-md rounded-2xl p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-blue-700">🧾 Book Your Ticket</h2>

        <div className="space-y-4 text-lg">
          <div>
            <span className="font-semibold">Start Stop:</span> {state.startStop}
          </div>
          <div>
            <span className="font-semibold">Destination:</span> {state.destination}
          </div>
          <div>
            <span className="font-semibold">Bus Route No:</span> {state.routeId}
          </div>
          <div>
            <span className="font-semibold">Vehicle Reg No:</span> {state.vehicleNumber}
          </div>
        </div>

        <button
          className="mt-8 w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-xl shadow"
          onClick={handleBookNow}
        >
          Book Now
        </button>
      </div>
    </div>
  );
};

export default BookTicket;
