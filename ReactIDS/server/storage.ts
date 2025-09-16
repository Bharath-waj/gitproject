import { type User, type InsertUser, type Threat, type InsertThreat, type Endpoint, type InsertEndpoint, type EventLog, type InsertEventLog, type NetworkTraffic, type InsertNetworkTraffic, ThreatSeverity, EndpointStatus, ThreatType } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Threat operations
  getAllThreats(): Promise<Threat[]>;
  getThreatsByTimeRange(startTime: Date, endTime?: Date): Promise<Threat[]>;
  createThreat(threat: InsertThreat): Promise<Threat>;
  getThreatCountsBySeverity(): Promise<Record<string, number>>;

  // Endpoint operations
  getAllEndpoints(): Promise<Endpoint[]>;
  getEndpointById(id: string): Promise<Endpoint | undefined>;
  createEndpoint(endpoint: InsertEndpoint): Promise<Endpoint>;
  updateEndpointStatus(id: string, status: string, cpuUsage?: number, ramUsage?: number): Promise<Endpoint | undefined>;

  // Event log operations
  getAllEventLogs(): Promise<EventLog[]>;
  getEventLogsByTimeRange(startTime: Date, endTime?: Date): Promise<EventLog[]>;
  createEventLog(eventLog: InsertEventLog): Promise<EventLog>;
  searchEventLogs(query: string): Promise<EventLog[]>;

  // Network traffic operations
  getNetworkTrafficByTimeRange(startTime: Date, endTime?: Date): Promise<NetworkTraffic[]>;
  createNetworkTraffic(traffic: InsertNetworkTraffic): Promise<NetworkTraffic>;
  getLatestNetworkTraffic(): Promise<NetworkTraffic | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private threats: Map<string, Threat>;
  private endpoints: Map<string, Endpoint>;
  private eventLogs: Map<string, EventLog>;
  private networkTraffic: Map<string, NetworkTraffic>;

  constructor() {
    this.users = new Map();
    this.threats = new Map();
    this.endpoints = new Map();
    this.eventLogs = new Map();
    this.networkTraffic = new Map();

    // Initialize with some sample data for demo
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Sample endpoints
    const sampleEndpoints = [
      {
        name: "Web Server 01",
        ipAddress: "192.168.1.10",
        type: "WEB_SERVER",
        status: EndpointStatus.ONLINE,
        cpuUsage: 45,
        ramUsage: 62
      },
      {
        name: "Database Server",
        ipAddress: "192.168.1.20", 
        type: "DATABASE",
        status: EndpointStatus.WARNING,
        cpuUsage: 78,
        ramUsage: 89
      },
      {
        name: "Firewall",
        ipAddress: "192.168.1.1",
        type: "FIREWALL", 
        status: EndpointStatus.ONLINE,
        cpuUsage: 23,
        ramUsage: 34
      },
      {
        name: "Load Balancer",
        ipAddress: "192.168.1.30",
        type: "LOAD_BALANCER",
        status: EndpointStatus.ONLINE,
        cpuUsage: 56,
        ramUsage: 41
      }
    ];

    sampleEndpoints.forEach(endpoint => {
      const id = randomUUID();
      this.endpoints.set(id, {
        ...endpoint,
        id,
        lastHeartbeat: new Date()
      });
    });
  }

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Threat operations
  async getAllThreats(): Promise<Threat[]> {
    return Array.from(this.threats.values()).sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  async getThreatsByTimeRange(startTime: Date, endTime?: Date): Promise<Threat[]> {
    const end = endTime || new Date();
    return Array.from(this.threats.values())
      .filter(threat => {
        const threatTime = new Date(threat.timestamp);
        return threatTime >= startTime && threatTime <= end;
      })
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  async createThreat(insertThreat: InsertThreat): Promise<Threat> {
    const id = randomUUID();
    const threat: Threat = {
      ...insertThreat,
      id,
      timestamp: new Date(),
      metadata: insertThreat.metadata || null,
      targetEndpoint: insertThreat.targetEndpoint || null,
      isBlocked: insertThreat.isBlocked || false
    };
    this.threats.set(id, threat);
    return threat;
  }

  async getThreatCountsBySeverity(): Promise<Record<string, number>> {
    const threats = Array.from(this.threats.values());
    return {
      CRITICAL: threats.filter(t => t.severity === ThreatSeverity.CRITICAL).length,
      HIGH: threats.filter(t => t.severity === ThreatSeverity.HIGH).length,
      MEDIUM: threats.filter(t => t.severity === ThreatSeverity.MEDIUM).length,
      LOW: threats.filter(t => t.severity === ThreatSeverity.LOW).length
    };
  }

  // Endpoint operations
  async getAllEndpoints(): Promise<Endpoint[]> {
    return Array.from(this.endpoints.values());
  }

  async getEndpointById(id: string): Promise<Endpoint | undefined> {
    return this.endpoints.get(id);
  }

  async createEndpoint(insertEndpoint: InsertEndpoint): Promise<Endpoint> {
    const id = randomUUID();
    const endpoint: Endpoint = {
      ...insertEndpoint,
      id,
      lastHeartbeat: new Date(),
      cpuUsage: insertEndpoint.cpuUsage || null,
      ramUsage: insertEndpoint.ramUsage || null
    };
    this.endpoints.set(id, endpoint);
    return endpoint;
  }

  async updateEndpointStatus(id: string, status: string, cpuUsage?: number, ramUsage?: number): Promise<Endpoint | undefined> {
    const endpoint = this.endpoints.get(id);
    if (!endpoint) return undefined;

    const updated: Endpoint = {
      ...endpoint,
      status,
      cpuUsage: cpuUsage ?? endpoint.cpuUsage,
      ramUsage: ramUsage ?? endpoint.ramUsage,
      lastHeartbeat: new Date()
    };
    this.endpoints.set(id, updated);
    return updated;
  }

  // Event log operations
  async getAllEventLogs(): Promise<EventLog[]> {
    return Array.from(this.eventLogs.values()).sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  async getEventLogsByTimeRange(startTime: Date, endTime?: Date): Promise<EventLog[]> {
    const end = endTime || new Date();
    return Array.from(this.eventLogs.values())
      .filter(log => {
        const logTime = new Date(log.timestamp);
        return logTime >= startTime && logTime <= end;
      })
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  async createEventLog(insertEventLog: InsertEventLog): Promise<EventLog> {
    const id = randomUUID();
    const eventLog: EventLog = {
      ...insertEventLog,
      id,
      timestamp: new Date(),
      metadata: insertEventLog.metadata || null,
      sourceIp: insertEventLog.sourceIp || null,
      targetEndpoint: insertEventLog.targetEndpoint || null,
      rule: insertEventLog.rule || null
    };
    this.eventLogs.set(id, eventLog);
    return eventLog;
  }

  async searchEventLogs(query: string): Promise<EventLog[]> {
    const lowercaseQuery = query.toLowerCase();
    return Array.from(this.eventLogs.values())
      .filter(log => 
        log.message.toLowerCase().includes(lowercaseQuery) ||
        log.eventType.toLowerCase().includes(lowercaseQuery) ||
        log.sourceIp?.toLowerCase().includes(lowercaseQuery) ||
        log.targetEndpoint?.toLowerCase().includes(lowercaseQuery) ||
        log.rule?.toLowerCase().includes(lowercaseQuery)
      )
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  // Network traffic operations
  async getNetworkTrafficByTimeRange(startTime: Date, endTime?: Date): Promise<NetworkTraffic[]> {
    const end = endTime || new Date();
    return Array.from(this.networkTraffic.values())
      .filter(traffic => {
        const trafficTime = new Date(traffic.timestamp);
        return trafficTime >= startTime && trafficTime <= end;
      })
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }

  async createNetworkTraffic(insertTraffic: InsertNetworkTraffic): Promise<NetworkTraffic> {
    const id = randomUUID();
    const traffic: NetworkTraffic = {
      ...insertTraffic,
      id,
      timestamp: new Date(),
      totalConnections: insertTraffic.totalConnections || null
    };
    this.networkTraffic.set(id, traffic);
    return traffic;
  }

  async getLatestNetworkTraffic(): Promise<NetworkTraffic | undefined> {
    const traffic = Array.from(this.networkTraffic.values());
    if (traffic.length === 0) return undefined;
    
    return traffic.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )[0];
  }
}

export const storage = new MemStorage();
