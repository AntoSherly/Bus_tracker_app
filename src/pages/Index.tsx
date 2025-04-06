
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleGetStarted = () => {
    // Navigate directly to login page
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="text-center space-y-6 animate-fade-in">
        <div className="w-32 h-32 mx-auto bg-primary rounded-full flex items-center justify-center">
          <span className="text-4xl text-primary-foreground font-bold">BT</span>
        </div>
        <h1 className="text-3xl font-bold text-foreground">Bus Tracker</h1>
        <Button
          onClick={handleGetStarted}
          className="mt-8"
          size="lg"
        >
          Get Started
        </Button>
      </div>
    </div>
  );
};

export default Index;
