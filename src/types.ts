export type CoreState = "idle" | "thinking" | "talking" | "warning" | "success" | "overload";

export interface MessageSource {
  title: string;
  uri: string;
}

export interface Message {
  id: string;
  role: "user" | "model" | "system";
  text: string;
  timestamp: string;
  sources?: MessageSource[];
  isCommand?: boolean;
  commandName?: string;
  simulatedProgress?: number;
  simulatedStatus?: "idle" | "running" | "completed" | "failed";
}

export interface Protocol {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: "defense" | "network" | "satellite" | "energy" | "armor";
  duration: number; // in ms
  dangerLevel: "safe" | "guarded" | "danger" | "critical";
  status: "idle" | "running" | "completed";
}

export interface SystemMetrics {
  cpu: number;
  memory: number;
  temperature: number;
  reactorFlux: number;
  coreVibration: number;
}
