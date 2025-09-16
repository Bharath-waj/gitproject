import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, Activity, Server, Shield, TrendingUp, TrendingDown, CheckCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

function MetricsOverview() {
  const { data: metrics, isLoading } = useQuery({
    queryKey: ["/api/dashboard/metrics"],
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-20 bg-muted rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const metricCards = [
    {
      title: "Active Threats",
      value: (metrics as any)?.activeThreats || 0,
      icon: AlertTriangle,
      iconBg: "bg-destructive/10",
      iconColor: "text-destructive",
      trend: { value: "+12%", color: "text-destructive", icon: TrendingUp },
      trendLabel: "from last hour"
    },
    {
      title: "Network Traffic",
      value: `${(metrics as any)?.networkTrafficGbps || "0.0"}GB/s`,
      icon: Activity,
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
      trend: { value: "-5%", color: "text-green-500", icon: TrendingDown },
      trendLabel: "from average"
    },
    {
      title: "Monitored Endpoints",
      value: (metrics as any)?.monitoredEndpoints || 0,
      icon: Server,
      iconBg: "bg-accent/10",
      iconColor: "text-accent",
      trend: { value: `${(metrics as any)?.endpointHealthPercentage || 0}%`, color: "text-green-500", icon: CheckCircle },
      trendLabel: "online"
    },
    {
      title: "Blocked Attacks",
      value: (metrics as any)?.blockedAttacks || 0,
      icon: Shield,
      iconBg: "bg-green-500/10",
      iconColor: "text-green-500",
      trend: { value: "+34%", color: "text-green-500", icon: TrendingUp },
      trendLabel: "today"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" data-testid="metrics-overview">
      {metricCards.map((metric, index) => {
        const Icon = metric.icon;
        const TrendIcon = metric.trend.icon;
        
        return (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{metric.title}</p>
                  <p 
                    className={`text-3xl font-bold ${metric.iconColor}`}
                    data-testid={`metric-${metric.title.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    {metric.value}
                  </p>
                </div>
                <div className={`w-12 h-12 ${metric.iconBg} rounded-lg flex items-center justify-center`}>
                  <Icon className={`${metric.iconColor} text-xl`} />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <TrendIcon className={`${metric.trend.color} mr-1 h-4 w-4`} />
                <span className={metric.trend.color}>{metric.trend.value}</span>
                <span className="text-muted-foreground ml-1">{metric.trendLabel}</span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

export { MetricsOverview };
