import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

function NetworkTrafficChart() {
  const [timeRange, setTimeRange] = useState(1); // hours

  const { data: trafficData, isLoading } = useQuery({
    queryKey: ["/api/network-traffic", { hours: timeRange }],
    refetchInterval: 30000,
  });

  const formattedData = (trafficData as any[])?.map((traffic: any) => ({
    time: new Date(traffic.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    incoming: traffic.incomingMbps,
    outgoing: traffic.outgoingMbps,
  })) || [];

  const timeRangeButtons = [
    { value: 1, label: "1H" },
    { value: 6, label: "6H" },
    { value: 24, label: "24H" },
  ];

  return (
    <Card data-testid="network-traffic-chart">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-foreground">Network Traffic Patterns</CardTitle>
          <div className="flex space-x-2">
            {timeRangeButtons.map((btn) => (
              <Button
                key={btn.value}
                variant={timeRange === btn.value ? "default" : "ghost"}
                size="sm"
                onClick={() => setTimeRange(btn.value)}
                data-testid={`button-timerange-${btn.label.toLowerCase()}`}
              >
                {btn.label}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-[300px] flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={formattedData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="time" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "6px",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="incoming"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  name="Incoming Traffic (Mbps)"
                  dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="outgoing"
                  stroke="hsl(142, 76%, 36%)"
                  strokeWidth={2}
                  name="Outgoing Traffic (Mbps)"
                  dot={{ fill: "hsl(142, 76%, 36%)", strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export { NetworkTrafficChart };
