import { Shield, Gauge, AlertTriangle, Activity, FileText, Server, Settings } from "lucide-react";
import { Link, useLocation } from "wouter";

export function Sidebar() {
  const [location] = useLocation();

  const navItems = [
    { href: "/", icon: Gauge, label: "Dashboard", active: true },
    { href: "/alerts", icon: AlertTriangle, label: "Alerts", badge: "24" },
    { href: "/traffic", icon: Activity, label: "Network Traffic" },
    { href: "/events", icon: FileText, label: "Event Logs" },
    { href: "/endpoints", icon: Server, label: "Endpoints" },
    { href: "/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <aside className="w-64 bg-card border-r border-border flex-shrink-0" data-testid="sidebar">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Shield className="text-primary-foreground text-sm" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground" data-testid="text-app-title">SecureGuard</h1>
            <p className="text-sm text-muted-foreground">IDS Dashboard</p>
          </div>
        </div>

        <nav className="space-y-2" data-testid="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.active || location === item.href;
            
            return (
              <Link key={item.href} href={item.href}>
                <a 
                  className={`flex items-center space-x-3 px-3 py-2 rounded-md transition-colors ${
                    isActive 
                      ? "bg-primary text-primary-foreground" 
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                  data-testid={`nav-${item.label.toLowerCase().replace(' ', '-')}`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="ml-auto bg-destructive text-destructive-foreground text-xs px-2 py-1 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </a>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-border">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
            <Shield className="text-muted-foreground text-sm" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium" data-testid="text-user-name">Admin User</p>
            <p className="text-xs text-muted-foreground">Security Analyst</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
