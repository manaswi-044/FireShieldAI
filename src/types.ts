export type FacilityId = 'factory_a' | 'warehouse_b' | 'plant_c';

export interface Facility {
  id: FacilityId;
  name: string;
  tagline: string;
  totalSensors: number;
  zones: string[];
}

export type RiskClassification = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
export type ResponseLevel = 'WATCH' | 'ALERT' | 'ACT';

export interface TelemetryPoint {
  time: string;
  temperature: number; // °C
  gasPpm: number; // ppm (CO/VOC)
  smokeObscuration: number; // %/m
  riskScore: number; // 0 - 100%
  baselineTemp: number;
}

export interface CameraFeed {
  id: string;
  name: string;
  location: string;
  imageSrc: string;
  status: 'Connected' | 'Degraded' | 'Offline';
  resolution: string;
  fps: number;
  zone: string;
}

export interface ContributingFactor {
  name: string;
  impactScore: number; // percentage
  status: 'Normal' | 'Elevated' | 'Critical';
  value: string;
  threshold: string;
  description: string;
}

export type AlertStatus = 'Active' | 'Acknowledged' | 'Resolved';

export interface AlertItem {
  id: string;
  timestamp: string;
  location: string;
  type: string;
  riskLevel: RiskClassification;
  triggeringFactors: string[];
  status: AlertStatus;
  facility: FacilityId;
  acknowledgedBy?: string;
  resolvedAt?: string;
  snapshot: {
    temperature: number;
    gasPpm: number;
    smokeObscuration: number;
    flameDetected: boolean;
  };
}

export type SensorStatus = 'online' | 'fault' | 'offline';

export interface SensorItem {
  id: string;
  name: string;
  type: 'temperature' | 'smoke' | 'gas' | 'thermal_camera' | 'visual_camera';
  location: string;
  currentReading: string;
  numericReading: number;
  unit: string;
  status: SensorStatus;
  lastUpdate: string;
  healthPercent: number;
  batteryPoE: string;
  nominalRange: string;
  failReason?: string;
}

export interface EventLogItem {
  id: string;
  timestamp: string;
  level: 'info' | 'warning' | 'critical' | 'action';
  category: 'AI Inference' | 'Sensor Telemetry' | 'Simulation Control' | 'Safety Protocol' | 'Operator Action';
  description: string;
  facility: FacilityId;
}

export interface SystemSettings {
  tempWarningThreshold: number; // °C
  tempCriticalThreshold: number; // °C
  gasWarningThreshold: number; // ppm
  gasCriticalThreshold: number; // ppm
  smokeWarningThreshold: number; // %/m
  suppressionDelaySeconds: number; // 30s
  safetyOfficerEmail: string;
  safetyOfficerPhone: string;
  audibleAlarm: boolean;
}
