import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, User, Bus, MapPin } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isInputFocused, setIsInputFocused] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.match(/^\d+/)) {
      navigate(`/bus-route/${searchQuery}`);
    } else {
      navigate("/bus-search", { state: { destination: searchQuery } });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto p-4">
        <div className="flex justify-end mb-6">
          <Button 
            variant="ghost" 
            size="icon"
            className="hover:scale-110 transition-transform"
          >
            <User className="h-6 w-6 text-purple-600" />
          </Button>
        </div>

        <div className="max-w-2xl mx-auto space-y-8">
          <div className="text-center animate-fade-in">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
              Find Your Bus
            </h1>
            <p className="text-gray-600">Enter bus number or destination</p>
          </div>

          <form onSubmit={handleSearch} className="space-y-4">
            <div className={`relative transform transition-all duration-300 ${isInputFocused ? 'scale-105' : ''}`}>
              <Input
                type="text"
                placeholder="Enter bus number or destination stop"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsInputFocused(true)}
                onBlur={() => setIsInputFocused(false)}
                className="pl-10 h-12 border-2 border-purple-100 focus:border-purple-500 rounded-lg shadow-lg"
              />
              <Search className="absolute left-3 top-4 h-4 w-4 text-purple-400" />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transform hover:scale-105 transition-all duration-300 h-12 rounded-lg shadow-lg"
            >
              <Search className="mr-2 h-4 w-4" />
              Search
            </Button>
          </form>

          <div className="mt-12">
            <h2 className="text-xl font-semibold mb-6 text-gray-800">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                className="p-6 h-auto flex flex-col items-center space-y-2 hover:bg-purple-50 hover:border-purple-200 transition-all duration-300"
                onClick={() => navigate("/bus-search")}
              >
                <Bus className="h-8 w-8 text-purple-600" />
                <span>Find Routes</span>
              </Button>
              <Button
                variant="outline"
                className="p-6 h-auto flex flex-col items-center space-y-2 hover:bg-blue-50 hover:border-blue-200 transition-all duration-300"
                onClick={() => navigate("/ticket")}
              >
                <MapPin className="h-8 w-8 text-blue-600" />
                <span>My Tickets</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;