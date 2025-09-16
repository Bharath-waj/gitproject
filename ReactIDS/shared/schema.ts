import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, json, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const threats = pgTable("threats", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  type: text("type").notNull(), // SQL_INJECTION, MALWARE, DDOS, BRUTE_FORCE, etc.
  severity: text("severity").notNull(), // CRITICAL, HIGH, MEDIUM, LOW
  sourceIp: text("source_ip").notNull(),
  targetEndpoint: text("target_endpoint"),
  description: text("description").notNull(),
  isBlocked: boolean("is_blocked").default(false),
  timestamp: timestamp("timestamp").notNull().default(sql`now()`),
  metadata: json("metadata"), // Additional threat-specific data
});

export const endpoints = pgTable("endpoints", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  ipAddress: text("ip_address").notNull().unique(),
  type: text("type").notNull(), // WEB_SERVER, DATABASE, FIREWALL, LOAD_BALANCER
  status: text("status").notNull(), // ONLINE, WARNING, OFFLINE
  cpuUsage: integer("cpu_usage").default(0),
  ramUsage: integer("ram_usage").default(0),
  lastHeartbeat: timestamp("last_heartbeat").default(sql`now()`),
});

export const eventLogs = pgTable("event_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  eventType: text("event_type").notNull(),
  severity: text("severity").notNull(),
  message: text("message").notNull(),
  sourceIp: text("source_ip"),
  targetEndpoint: text("target_endpoint"),
  rule: text("rule"),
  timestamp: timestamp("timestamp").notNull().default(sql`now()`),
  metadata: json("metadata"),
});

export const networkTraffic = pgTable("network_traffic", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  timestamp: timestamp("timestamp").notNull().default(sql`now()`),
  incomingMbps: integer("incoming_mbps").notNull(),
  outgoingMbps: integer("outgoing_mbps").notNull(),
  totalConnections: integer("total_connections").default(0),
});

// Insert schemas
export const insertThreatSchema = createInsertSchema(threats).omit({
  id: true,
  timestamp: true,
});

export const insertEndpointSchema = createInsertSchema(endpoints).omit({
  id: true,
  lastHeartbeat: true,
});

export const insertEventLogSchema = createInsertSchema(eventLogs).omit({
  id: true,
  timestamp: true,
});

export const insertNetworkTrafficSchema = createInsertSchema(networkTraffic).omit({
  id: true,
  timestamp: true,
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

// Types
export type InsertThreat = z.infer<typeof insertThreatSchema>;
export type Threat = typeof threats.$inferSelect;

export type InsertEndpoint = z.infer<typeof insertEndpointSchema>;
export type Endpoint = typeof endpoints.$inferSelect;

export type InsertEventLog = z.infer<typeof insertEventLogSchema>;
export type EventLog = typeof eventLogs.$inferSelect;

export type InsertNetworkTraffic = z.infer<typeof insertNetworkTrafficSchema>;
export type NetworkTraffic = typeof networkTraffic.$inferSelect;

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Enums for type safety
export const ThreatSeverity = {
  CRITICAL: "CRITICAL",
  HIGH: "HIGH", 
  MEDIUM: "MEDIUM",
  LOW: "LOW"
} as const;

export const EndpointStatus = {
  ONLINE: "ONLINE",
  WARNING: "WARNING", 
  OFFLINE: "OFFLINE"
} as const;

export const ThreatType = {
  SQL_INJECTION: "SQL_INJECTION",
  MALWARE: "MALWARE",
  DDOS: "DDOS",
  BRUTE_FORCE: "BRUTE_FORCE",
  PORT_SCAN: "PORT_SCAN",
  TRAFFIC_ANOMALY: "TRAFFIC_ANOMALY"
} as const;
