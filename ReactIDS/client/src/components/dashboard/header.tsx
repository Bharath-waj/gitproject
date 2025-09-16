import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

interface HeaderProps {
  isConnected: boolean;
}

function Header({ isConnected }: HeaderProps) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toUTCString().split(' ')[4];
  };

  return (
    <header className="bg-card border-b border-border px-6 py-4" data-testid="dashboard-header">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground" data-testid="text-page-title">Security Dashboard</h2>
          <p className="text-muted-foreground">Real-time network monitoring and threat detection</p>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Real-time Status Indicator */}
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
            <span className="text-sm text-muted-foreground" data-testid="text-connection-status">
              {isConnected ? 'Live Monitoring Active' : 'Connection Lost'}
            </span>
          </div>
          
          {/* Notifications */}
          <Button 
            variant="ghost" 
            size="icon"
            className="relative text-muted-foreground hover:text-foreground"
            data-testid="button-notifications"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center">
              3
            </span>
          </Button>
          
          {/* Current Time */}
          <div className="text-right">
            <div className="text-sm font-medium text-foreground" data-testid="text-current-time">
              {formatTime(currentTime)}
            </div>
            <div className="text-xs text-muted-foreground">UTC</div>
          </div>
        </div>
      </div>
    </header>
  );
}

export { Header };
