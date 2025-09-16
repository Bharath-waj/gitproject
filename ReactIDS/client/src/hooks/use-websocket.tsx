import { useEffect, useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";

function useWebSocket() {
  const [isConnected, setIsConnected] = useState(false);
  const { toast } = useToast();
  const ws = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  const connect = () => {
    try {
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const wsUrl = `${protocol}//${window.location.host}/ws`;
      
      ws.current = new WebSocket(wsUrl);

      ws.current.onopen = () => {
        setIsConnected(true);
        reconnectAttempts.current = 0;
        console.log("WebSocket connected");
      };

      ws.current.onclose = () => {
        setIsConnected(false);
        console.log("WebSocket disconnected");
        
        // Attempt to reconnect
        if (reconnectAttempts.current < maxReconnectAttempts) {
          reconnectAttempts.current++;
          const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 30000);
          
          reconnectTimeoutRef.current = setTimeout(() => {
            console.log(`Reconnecting... Attempt ${reconnectAttempts.current}`);
            connect();
          }, delay);
        }
      };

      ws.current.onerror = (error) => {
        console.error("WebSocket error:", error);
        setIsConnected(false);
      };

      ws.current.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          handleWebSocketMessage(message);
        } catch (error) {
          console.error("Failed to parse WebSocket message:", error);
        }
      };
    } catch (error) {
      console.error("Failed to create WebSocket connection:", error);
      setIsConnected(false);
    }
  };

  const handleWebSocketMessage = (message: any) => {
    switch (message.type) {
      case "NEW_THREAT":
        // Invalidate threats queries to trigger refetch
        queryClient.invalidateQueries({ queryKey: ["/api/threats"] });
        queryClient.invalidateQueries({ queryKey: ["/api/dashboard/metrics"] });
        
        // Show toast notification for critical threats
        if (message.data.severity === "CRITICAL") {
          toast({
            title: "Critical Threat Detected",
            description: `${message.data.type} from ${message.data.sourceIp}`,
            variant: "destructive",
          });
        }
        break;

      case "NEW_EVENT":
        // Invalidate event logs queries
        queryClient.invalidateQueries({ queryKey: ["/api/events"] });
        break;

      case "NETWORK_TRAFFIC_UPDATE":
        // Invalidate network traffic queries
        queryClient.invalidateQueries({ queryKey: ["/api/network-traffic"] });
        queryClient.invalidateQueries({ queryKey: ["/api/dashboard/metrics"] });
        break;

      case "ENDPOINT_STATUS_UPDATE":
        // Invalidate endpoints queries
        queryClient.invalidateQueries({ queryKey: ["/api/endpoints"] });
        queryClient.invalidateQueries({ queryKey: ["/api/dashboard/metrics"] });
        break;

      default:
        console.log("Unknown WebSocket message type:", message.type);
    }
  };

  useEffect(() => {
    connect();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  return {
    isConnected,
    reconnect: connect,
  };
}

export { useWebSocket };
