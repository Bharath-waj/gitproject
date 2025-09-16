import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { type Endpoint } from "@shared/schema";

function SystemStatus() {
  const { data: endpoints, isLoading } = useQuery({
    queryKey: ["/api/endpoints"],
    refetchInterval: 30000,
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ONLINE":
        return "bg-green-500";
      case "WARNING":
        return "bg-yellow-500";
      case "OFFLINE":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getEndpointTypeDisplay = (type: string) => {
    switch (type) {
      case "WEB_SERVER":
        return "Web Server";
      case "DATABASE":
        return "Database";
      case "FIREWALL":
        return "Firewall";
      case "LOAD_BALANCER":
        return "Load Balancer";
      default:
        return type;
    }
  };

  const onlineCount = (endpoints as any[])?.filter((e: Endpoint) => e.status === "ONLINE").length || 0;
  const totalCount = (endpoints as any[])?.length || 0;

  return (
    <Card data-testid="system-status">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-foreground">System Status</CardTitle>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-green-500" data-testid="text-system-status">
              {totalCount > 0 && onlineCount === totalCount ? "All Systems Operational" : "Some Issues Detected"}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="p-4 bg-secondary rounded-lg animate-pulse">
                <div className="h-16" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {(endpoints as any[])?.map((endpoint: Endpoint) => (
              <div 
                key={endpoint.id} 
                className="p-4 bg-secondary rounded-lg"
                data-testid={`endpoint-${endpoint.name.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-foreground">
                    {getEndpointTypeDisplay(endpoint.type)}
                  </h4>
                  <div className={`w-3 h-3 ${getStatusColor(endpoint.status)} rounded-full`}></div>
                </div>
                <p className="text-xs text-muted-foreground mb-2" data-testid={`text-endpoint-ip-${endpoint.id}`}>
                  {endpoint.ipAddress}
                </p>
                <div className="flex items-center space-x-4 text-xs">
                  <div>
                    <span className="text-muted-foreground">CPU:</span>
                    <span className="text-foreground ml-1" data-testid={`text-cpu-${endpoint.id}`}>
                      {endpoint.cpuUsage || 0}%
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">RAM:</span>
                    <span className="text-foreground ml-1" data-testid={`text-ram-${endpoint.id}`}>
                      {endpoint.ramUsage || 0}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export { SystemStatus };
