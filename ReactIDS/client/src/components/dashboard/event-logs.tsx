import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { type EventLog } from "@shared/schema";

function EventLogs() {
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: events, isLoading } = useQuery({
    queryKey: ["/api/events", { search: searchQuery || undefined, hours: 24 }],
    refetchInterval: 15000,
  });

  const recentEvents = (events as any[])?.slice(0, 6) || [];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "CRITICAL":
        return "bg-red-500";
      case "HIGH":
        return "bg-orange-500";
      case "MEDIUM":
        return "bg-yellow-500";
      case "LOW":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  const formatTime = (timestamp: string | Date) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <Card data-testid="event-logs">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-foreground">Recent Security Events</CardTitle>
          <div className="flex space-x-2">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-48 pr-10"
                data-testid="input-search-events"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            </div>
            <Button variant="secondary" size="icon" data-testid="button-filter-events">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-start space-x-3 p-3 bg-secondary rounded-lg animate-pulse">
                <div className="w-2 h-2 bg-muted rounded-full mt-2" />
                <div className="flex-1">
                  <div className="h-4 bg-muted rounded mb-2" />
                  <div className="h-3 bg-muted rounded w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : recentEvents.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground" data-testid="text-no-events">
            {searchQuery ? `No events found for "${searchQuery}"` : "No recent events"}
          </div>
        ) : (
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {recentEvents.map((event: EventLog) => (
              <div 
                key={event.id} 
                className="flex items-start space-x-3 p-3 bg-secondary rounded-lg"
                data-testid={`event-${event.id}`}
              >
                <div className={`w-2 h-2 ${getSeverityColor(event.severity)} rounded-full mt-2 flex-shrink-0`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-foreground truncate" data-testid={`text-event-message-${event.id}`}>
                      {event.message}
                    </p>
                    <span className="text-xs text-muted-foreground" data-testid={`text-event-time-${event.id}`}>
                      {formatTime(event.timestamp)}
                    </span>
                  </div>
                  {(event.sourceIp || event.targetEndpoint) && (
                    <p className="text-xs text-muted-foreground mt-1" data-testid={`text-event-details-${event.id}`}>
                      {event.sourceIp && `Source: ${event.sourceIp}`}
                      {event.sourceIp && event.targetEndpoint && " → "}
                      {event.targetEndpoint && `Target: ${event.targetEndpoint}`}
                    </p>
                  )}
                  {event.rule && (
                    <p className="text-xs font-mono text-muted-foreground mt-1" data-testid={`text-event-rule-${event.id}`}>
                      Rule: {event.rule}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <Button 
          variant="outline" 
          className="w-full mt-4"
          data-testid="button-view-full-log"
        >
          View Full Event Log
        </Button>
      </CardContent>
    </Card>
  );
}

export { EventLogs };
