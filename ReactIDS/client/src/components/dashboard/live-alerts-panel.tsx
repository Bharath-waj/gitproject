import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreVertical } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { type Threat } from "@shared/schema";

function LiveAlertsPanel() {
  const { data: threats, isLoading } = useQuery({
    queryKey: ["/api/threats/recent", { hours: 24 }],
    refetchInterval: 10000, // Refetch every 10 seconds for live updates
  });

  const recentAlerts = (threats as any[])?.slice(0, 5) || [];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "CRITICAL":
        return "bg-red-600 text-white";
      case "HIGH":
        return "bg-orange-500 text-white";
      case "MEDIUM":
        return "bg-yellow-500 text-black";
      case "LOW":
        return "bg-green-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const getAlertBorderColor = (severity: string) => {
    switch (severity) {
      case "CRITICAL":
        return "border-red-500/20 bg-red-500/10";
      case "HIGH":
        return "border-orange-500/20 bg-orange-500/10";
      case "MEDIUM":
        return "border-yellow-500/20 bg-yellow-500/10";
      case "LOW":
        return "border-green-500/20 bg-green-500/10";
      default:
        return "border-gray-500/20 bg-gray-500/10";
    }
  };

  const formatTimeAgo = (timestamp: string | Date) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now.getTime() - time.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} mins ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hours ago`;
    return `${Math.floor(diffHours / 24)} days ago`;
  };

  const getThreatDisplayName = (type: string) => {
    switch (type) {
      case "SQL_INJECTION":
        return "SQL Injection Attempt";
      case "BRUTE_FORCE":
        return "Brute Force Attack";
      case "PORT_SCAN":
        return "Port Scanning";
      case "TRAFFIC_ANOMALY":
        return "Unusual Traffic Pattern";
      case "MALWARE":
        return "Malware Detection";
      case "DDOS":
        return "DDoS Attack";
      default:
        return "Security Threat";
    }
  };

  return (
    <Card data-testid="live-alerts-panel">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-foreground">Live Alerts</CardTitle>
          <Button variant="ghost" size="sm" data-testid="button-view-all-alerts">
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-3 bg-secondary rounded-lg animate-pulse">
                <div className="h-4 bg-muted rounded mb-2" />
                <div className="h-3 bg-muted rounded w-3/4" />
              </div>
            ))}
          </div>
        ) : recentAlerts.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground" data-testid="text-no-alerts">
            No recent alerts
          </div>
        ) : (
          <div className="space-y-4">
            {recentAlerts.map((alert: Threat) => (
              <div 
                key={alert.id} 
                className={`p-3 rounded-lg border ${getAlertBorderColor(alert.severity)}`}
                data-testid={`alert-${alert.id}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <Badge className={`text-xs px-2 py-1 rounded-full font-medium ${getSeverityColor(alert.severity)}`}>
                        {alert.severity}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatTimeAgo(alert.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-foreground" data-testid={`text-threat-${alert.id}`}>
                      {getThreatDisplayName(alert.type)}
                    </p>
                    <p className="text-xs text-muted-foreground" data-testid={`text-source-${alert.id}`}>
                      Source: {alert.sourceIp}
                    </p>
                    {alert.targetEndpoint && (
                      <p className="text-xs text-muted-foreground">
                        Target: {alert.targetEndpoint}
                      </p>
                    )}
                  </div>
                  <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        <Button 
          variant="outline" 
          className="w-full mt-4"
          data-testid="button-view-all-alerts-bottom"
        >
          View All Alerts
        </Button>
      </CardContent>
    </Card>
  );
}

export { LiveAlertsPanel };
