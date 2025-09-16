import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { insertThreatSchema, insertEndpointSchema, insertEventLogSchema, insertNetworkTrafficSchema, ThreatSeverity, ThreatType, EndpointStatus } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // WebSocket server for real-time updates
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  // Store connected clients
  const clients = new Set<WebSocket>();

  wss.on('connection', (ws) => {
    clients.add(ws);
    console.log('Client connected to WebSocket');

    ws.on('close', () => {
      clients.delete(ws);
      console.log('Client disconnected from WebSocket');
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
      clients.delete(ws);
    });
  });

  // Broadcast to all connected clients
  function broadcast(data: any) {
    const message = JSON.stringify(data);
    clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }

  // Threat endpoints
  app.get("/api/threats", async (req, res) => {
    try {
      const threats = await storage.getAllThreats();
      res.json(threats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch threats" });
    }
  });

  app.get("/api/threats/recent", async (req, res) => {
    try {
      const hoursBack = parseInt(req.query.hours as string) || 24;
      const startTime = new Date(Date.now() - hoursBack * 60 * 60 * 1000);
      const threats = await storage.getThreatsByTimeRange(startTime);
      res.json(threats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch recent threats" });
    }
  });

  app.get("/api/threats/severity-counts", async (req, res) => {
    try {
      const counts = await storage.getThreatCountsBySeverity();
      res.json(counts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch threat counts" });
    }
  });

  app.post("/api/threats", async (req, res) => {
    try {
      const threatData = insertThreatSchema.parse(req.body);
      const threat = await storage.createThreat(threatData);
      
      // Broadcast new threat to all connected clients
      broadcast({
        type: 'NEW_THREAT',
        data: threat
      });

      res.status(201).json(threat);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid threat data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create threat" });
      }
    }
  });

  // Endpoint endpoints
  app.get("/api/endpoints", async (req, res) => {
    try {
      const endpoints = await storage.getAllEndpoints();
      res.json(endpoints);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch endpoints" });
    }
  });

  app.post("/api/endpoints", async (req, res) => {
    try {
      const endpointData = insertEndpointSchema.parse(req.body);
      const endpoint = await storage.createEndpoint(endpointData);
      
      broadcast({
        type: 'NEW_ENDPOINT',
        data: endpoint
      });

      res.status(201).json(endpoint);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid endpoint data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create endpoint" });
      }
    }
  });

  app.patch("/api/endpoints/:id/status", async (req, res) => {
    try {
      const { id } = req.params;
      const { status, cpuUsage, ramUsage } = req.body;
      
      const endpoint = await storage.updateEndpointStatus(id, status, cpuUsage, ramUsage);
      if (!endpoint) {
        return res.status(404).json({ message: "Endpoint not found" });
      }

      broadcast({
        type: 'ENDPOINT_STATUS_UPDATE',
        data: endpoint
      });

      res.json(endpoint);
    } catch (error) {
      res.status(500).json({ message: "Failed to update endpoint status" });
    }
  });

  // Event log endpoints
  app.get("/api/events", async (req, res) => {
    try {
      const { search, hours } = req.query;
      
      let events;
      if (search) {
        events = await storage.searchEventLogs(search as string);
      } else if (hours) {
        const hoursBack = parseInt(hours as string);
        const startTime = new Date(Date.now() - hoursBack * 60 * 60 * 1000);
        events = await storage.getEventLogsByTimeRange(startTime);
      } else {
        events = await storage.getAllEventLogs();
      }
      
      res.json(events);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch event logs" });
    }
  });

  app.post("/api/events", async (req, res) => {
    try {
      const eventData = insertEventLogSchema.parse(req.body);
      const event = await storage.createEventLog(eventData);
      
      broadcast({
        type: 'NEW_EVENT',
        data: event
      });

      res.status(201).json(event);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid event data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create event" });
      }
    }
  });

  // Network traffic endpoints
  app.get("/api/network-traffic", async (req, res) => {
    try {
      const hoursBack = parseInt(req.query.hours as string) || 1;
      const startTime = new Date(Date.now() - hoursBack * 60 * 60 * 1000);
      const traffic = await storage.getNetworkTrafficByTimeRange(startTime);
      res.json(traffic);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch network traffic" });
    }
  });

  app.get("/api/network-traffic/latest", async (req, res) => {
    try {
      const traffic = await storage.getLatestNetworkTraffic();
      if (!traffic) {
        return res.status(404).json({ message: "No traffic data found" });
      }
      res.json(traffic);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch latest traffic" });
    }
  });

  app.post("/api/network-traffic", async (req, res) => {
    try {
      const trafficData = insertNetworkTrafficSchema.parse(req.body);
      const traffic = await storage.createNetworkTraffic(trafficData);
      
      broadcast({
        type: 'NETWORK_TRAFFIC_UPDATE',
        data: traffic
      });

      res.status(201).json(traffic);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid traffic data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create traffic data" });
      }
    }
  });

  // Dashboard metrics endpoint
  app.get("/api/dashboard/metrics", async (req, res) => {
    try {
      // Get recent threats (last 24 hours)
      const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const recentThreats = await storage.getThreatsByTimeRange(last24Hours);
      
      // Get all endpoints
      const endpoints = await storage.getAllEndpoints();
      
      // Get latest network traffic
      const latestTraffic = await storage.getLatestNetworkTraffic();
      
      // Calculate metrics
      const activeThreats = recentThreats.filter(t => !t.isBlocked).length;
      const blockedAttacks = recentThreats.filter(t => t.isBlocked).length;
      const onlineEndpoints = endpoints.filter(e => e.status === EndpointStatus.ONLINE).length;
      const endpointHealthPercentage = endpoints.length > 0 ? 
        Math.round((onlineEndpoints / endpoints.length) * 100 * 10) / 10 : 0;

      const metrics = {
        activeThreats,
        networkTrafficGbps: latestTraffic ? 
          ((latestTraffic.incomingMbps + latestTraffic.outgoingMbps) / 1000).toFixed(1) : "0.0",
        monitoredEndpoints: endpoints.length,
        endpointHealthPercentage,
        blockedAttacks
      };

      res.json(metrics);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dashboard metrics" });
    }
  });

  // Simulate real-time data generation for demo purposes
  function generateSimulatedData() {
    // Generate network traffic data every 30 seconds
    setInterval(async () => {
      const traffic = {
        incomingMbps: Math.floor(Math.random() * 500) + 1000, // 1000-1500 Mbps
        outgoingMbps: Math.floor(Math.random() * 300) + 700,  // 700-1000 Mbps
        totalConnections: Math.floor(Math.random() * 500) + 1000
      };
      
      const createdTraffic = await storage.createNetworkTraffic(traffic);
      broadcast({
        type: 'NETWORK_TRAFFIC_UPDATE',
        data: createdTraffic
      });
    }, 30000);

    // Generate random threats every 1-5 minutes
    setInterval(async () => {
      const threatTypes = [ThreatType.SQL_INJECTION, ThreatType.BRUTE_FORCE, ThreatType.PORT_SCAN, ThreatType.TRAFFIC_ANOMALY];
      const severities = [ThreatSeverity.CRITICAL, ThreatSeverity.HIGH, ThreatSeverity.MEDIUM, ThreatSeverity.LOW];
      
      const threat = {
        type: threatTypes[Math.floor(Math.random() * threatTypes.length)],
        severity: severities[Math.floor(Math.random() * severities.length)],
        sourceIp: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        targetEndpoint: `endpoint-${Math.floor(Math.random() * 10) + 1}`,
        description: "Automated threat detection alert",
        isBlocked: Math.random() > 0.3, // 70% chance of being blocked
        metadata: {}
      };

      const createdThreat = await storage.createThreat(threat);
      broadcast({
        type: 'NEW_THREAT',
        data: createdThreat
      });

      // Also create an event log
      const eventLog = {
        eventType: threat.isBlocked ? "THREAT_BLOCKED" : "THREAT_DETECTED",
        severity: threat.severity,
        message: `${threat.type} ${threat.isBlocked ? 'blocked' : 'detected'} from ${threat.sourceIp}`,
        sourceIp: threat.sourceIp,
        targetEndpoint: threat.targetEndpoint,
        rule: `${threat.type}_RULE`,
        metadata: {}
      };

      const createdEvent = await storage.createEventLog(eventLog);
      broadcast({
        type: 'NEW_EVENT',
        data: createdEvent
      });
    }, Math.random() * 240000 + 60000); // 1-5 minutes
  }

  // Start simulated data generation
  generateSimulatedData();

  return httpServer;
}
