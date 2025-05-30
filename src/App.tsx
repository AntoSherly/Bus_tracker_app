import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Home from "./pages/Home";
import BusRoute from "./pages/BusRoute";
import BusSearch from "./pages/BusSearch";
import Booking from "./pages/Booking";
import Ticket from "./pages/Ticket";
import BusDetails from "./pages/BusDetails";
import BookTicket from "./pages/BookTicket";
import Payment from './pages/Payment';


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/bus-route/:busNumber" element={<BusRoute />} />
          <Route path="/bus-search" element={<BusSearch />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/ticket" element={<Ticket />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/available-buses" element={<BusDetails />} />
          <Route path="/book-ticket" element={<BookTicket />} />
          <Route path="/payment" element={<Payment />} />
          
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;