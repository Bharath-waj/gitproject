import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";
import { MetricsOverview } from "@/components/dashboard/metrics-overview";
import { NetworkTrafficChart } from "@/components/dashboard/network-traffic-chart";
import { LiveAlertsPanel } from "@/components/dashboard/live-alerts-panel";
import { SystemStatus } from "@/components/dashboard/system-status";
import { EventLogs } from "@/components/dashboard/event-logs";
import { ThreatAnalysis } from "@/components/dashboard/threat-analysis";
import { useWebSocket } from "@/hooks/use-websocket";
import { useEffect } from "react";

export default function Dashboard() {
  const { isConnected } = useWebSocket();

  return (
    <div className="flex h-screen bg-background" data-testid="dashboard-main">
      <Sidebar />
      
      <main className="flex-1 overflow-auto">
        <Header isConnected={isConnected} />
        
        <div className="p-6 space-y-6">
          <MetricsOverview />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <NetworkTrafficChart />
            </div>
            <LiveAlertsPanel />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SystemStatus />
            <EventLogs />
          </div>

          <ThreatAnalysis />
        </div>
      </main>
    </div>
  );
}
