import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, AlertTriangle, AlertOctagon, Info } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

function ThreatAnalysis() {
  const { data: threatCounts, isLoading } = useQuery({
    queryKey: ["/api/threats/severity-counts"],
    refetchInterval: 30000,
  });

  const { data: threats } = useQuery({
    queryKey: ["/api/threats/recent", { hours: 24 }],
    refetchInterval: 30000,
  });

  const getThreatsBreakdown = (severity: string) => {
    if (!threats) return {};
    
    const severityThreats = (threats as any[]).filter((t: any) => t.severity === severity);
    const breakdown: Record<string, number> = {};
    
    severityThreats.forEach((threat: any) => {
      const displayType = getDisplayType(threat.type);
      breakdown[displayType] = (breakdown[displayType] || 0) + 1;
    });
    
    return breakdown;
  };

  const getDisplayType = (type: string) => {
    switch (type) {
      case "SQL_INJECTION":
        return "SQL Injection";
      case "BRUTE_FORCE":
        return "Brute Force";
      case "PORT_SCAN":
        return "Port Scan";
      case "TRAFFIC_ANOMALY":
        return "Anomalies";
      case "MALWARE":
        return "Malware";
      case "DDOS":
        return "DDoS";
      default:
        return "Other";
    }
  };

  const threatCategories = [
    {
      severity: "CRITICAL",
      title: "Critical Threats",
      count: (threatCounts as any)?.CRITICAL || 0,
      icon: AlertOctagon,
      iconColor: "text-red-500",
      bgColor: "bg-red-500/10",
      borderColor: "border-red-500/20",
    },
    {
      severity: "HIGH",
      title: "High Threats",
      count: (threatCounts as any)?.HIGH || 0,
      icon: AlertTriangle,
      iconColor: "text-orange-500",
      bgColor: "bg-orange-500/10",
      borderColor: "border-orange-500/20",
    },
    {
      severity: "MEDIUM",
      title: "Medium Threats",
      count: (threatCounts as any)?.MEDIUM || 0,
      icon: AlertCircle,
      iconColor: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
      borderColor: "border-yellow-500/20",
    },
    {
      severity: "LOW",
      title: "Low Threats",
      count: (threatCounts as any)?.LOW || 0,
      icon: Info,
      iconColor: "text-green-500",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/20",
    },
  ];

  const timeRangeButtons = [
    { value: "today", label: "Today", active: true },
    { value: "week", label: "This Week" },
    { value: "month", label: "This Month" },
  ];

  return (
    <Card data-testid="threat-analysis">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-foreground">
            Threat Classification & Analysis
          </CardTitle>
          <div className="flex space-x-2">
            {timeRangeButtons.map((btn) => (
              <Button
                key={btn.value}
                variant={btn.active ? "default" : "ghost"}
                size="sm"
                data-testid={`button-timerange-${btn.value}`}
              >
                {btn.label}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="p-4 bg-secondary rounded-lg animate-pulse">
                <div className="h-24" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {threatCategories.map((category) => {
              const Icon = category.icon;
              const breakdown = getThreatsBreakdown(category.severity);
              const breakdownEntries = Object.entries(breakdown).slice(0, 3);
              
              return (
                <div 
                  key={category.severity}
                  className={`p-4 ${category.bgColor} border ${category.borderColor} rounded-lg`}
                  data-testid={`threat-category-${category.severity.toLowerCase()}`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-medium text-foreground">{category.title}</h4>
                    <Icon className={`${category.iconColor} h-5 w-5`} />
                  </div>
                  <p 
                    className={`text-2xl font-bold ${category.iconColor}`}
                    data-testid={`count-${category.severity.toLowerCase()}`}
                  >
                    {category.count}
                  </p>
                  <div className="mt-2 space-y-1">
                    {breakdownEntries.length > 0 ? (
                      breakdownEntries.map(([type, count]) => (
                        <div key={type} className="text-xs text-muted-foreground">
                          {type}: {count}
                        </div>
                      ))
                    ) : (
                      <div className="text-xs text-muted-foreground">No threats detected</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export { ThreatAnalysis };
