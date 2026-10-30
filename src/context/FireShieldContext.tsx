import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import {
  Facility,
  FacilityId,
  CameraFeed,
  AlertItem,
  SensorItem,
  EventLogItem,
  TelemetryPoint,
  ContributingFactor,
  RiskClassification,
  ResponseLevel,
  SystemSettings
} from '../types';

import factoryFloorImg from '../assets/images/factory_floor_cctv_1793337214826.jpg';
import chemicalStorageImg from '../assets/images/chemical_storage_cctv_1793337215781.jpg';
import electricalSubstationImg from '../assets/images/electrical_substation_cctv_1793337214839.jpg';

export const FACILITIES: Facility[] = [
  {
    id: 'factory_a',
    name: 'Factory A – Heavy Machining & Stamping',
    tagline: 'Main CNC & Stamping Bay, Heat-Treating Furnace',
    totalSensors: 12,
    zones: ['Zone 1: CNC Machining', 'Zone 2: Furnace & Quenching', 'Zone 3: Assembly Bay', 'Zone 4: Finished Goods']
  },
  {
    id: 'warehouse_b',
    name: 'Warehouse B – Chemical & Solvent Storage',
    tagline: 'Solvent Vaults, Pressurized Cylinders, Drum Storage',
    totalSensors: 12,
    zones: ['Zone 1: Flammable Liquid Store', 'Zone 2: Gas Cylinder Bay', 'Zone 3: Pallet Staging', 'Zone 4: Loading Dock']
  },
  {
    id: 'plant_c',
    name: 'Plant C – Electronics & Power Substation',
    tagline: 'High Voltage Transformers, Switchgear & Server Row',
    totalSensors: 12,
    zones: ['Zone 1: HV Transformer Room', 'Zone 2: Switchgear Substation', 'Zone 3: Battery UPS Room', 'Zone 4: Control Room']
  }
];

export const CAMERAS: CameraFeed[] = [
  {
    id: 'CAM-01',
    name: 'Camera 01 – Machining & Assembly Floor',
    location: 'Zone 1 (Main Floor North)',
    imageSrc: factoryFloorImg,
    status: 'Connected',
    resolution: '1080p @ 30 FPS',
    fps: 30,
    zone: 'Zone 1'
  },
  {
    id: 'CAM-02',
    name: 'Camera 02 – Chemical & Pressurized Gas Bay',
    location: 'Zone 2 (Gas Storage Perimeter)',
    imageSrc: chemicalStorageImg,
    status: 'Connected',
    resolution: '1080p @ 30 FPS',
    fps: 30,
    zone: 'Zone 2'
  },
  {
    id: 'CAM-03',
    name: 'Camera 03 – High-Voltage Electrical Substation',
    location: 'Zone 1 (Switchgear Room South)',
    imageSrc: electricalSubstationImg,
    status: 'Connected',
    resolution: '1080p @ 30 FPS',
    fps: 30,
    zone: 'Zone 1'
  }
];

const INITIAL_SENSORS: SensorItem[] = [
  {
    id: 'SNS-TEMP-01',
    name: 'Thermal Pyrometer & Ambient Temp',
    type: 'temperature',
    location: 'Zone 1 – Ceiling Grid 04',
    currentReading: '24.2 °C',
    numericReading: 24.2,
    unit: '°C',
    status: 'online',
    lastUpdate: 'Just now',
    healthPercent: 99,
    batteryPoE: 'PoE 48V (Nominal)',
    nominalRange: '18.0 °C – 32.0 °C'
  },
  {
    id: 'SNS-SMK-01',
    name: 'Dual-Wavelength Optical Smoke Detector',
    type: 'smoke',
    location: 'Zone 1 – Air Exhaust Duct',
    currentReading: '0.24 %/m',
    numericReading: 0.24,
    unit: '%/m obscuration',
    status: 'online',
    lastUpdate: 'Just now',
    healthPercent: 98,
    batteryPoE: 'Hardwired 24V DC',
    nominalRange: '0.00 %/m – 1.50 %/m'
  },
  {
    id: 'SNS-GAS-01',
    name: 'Photoionization VOC & Carbon Monoxide Sensor',
    type: 'gas',
    location: 'Zone 2 – Solvent Storage Sump',
    currentReading: '18 ppm',
    numericReading: 18,
    unit: 'ppm',
    status: 'online',
    lastUpdate: 'Just now',
    healthPercent: 96,
    batteryPoE: 'Hardwired 24V DC',
    nominalRange: '0 ppm – 35 ppm'
  },
  {
    id: 'SNS-THM-CAM',
    name: 'Long-Wave Infrared Thermal Imager',
    type: 'thermal_camera',
    location: 'Zone 1 – Crane Catwalk High Angle',
    currentReading: 'Hotspot max: 28.5 °C',
    numericReading: 28.5,
    unit: '°C max hotspot',
    status: 'online',
    lastUpdate: 'Just now',
    healthPercent: 100,
    batteryPoE: 'PoE+ Class 4 (Active)',
    nominalRange: '20.0 °C – 45.0 °C'
  },
  {
    id: 'SNS-VIS-CAM',
    name: 'Dual-Spectrum AI Visual Optical Camera',
    type: 'visual_camera',
    location: 'Zone 1 – Central Gantry Pan-Tilt',
    currentReading: 'Flame Confidence: 0.0%',
    numericReading: 0.0,
    unit: '% confidence',
    status: 'online',
    lastUpdate: 'Just now',
    healthPercent: 97,
    batteryPoE: 'PoE+ Class 4 (Active)',
    nominalRange: 'Zero flame / Zero smoke plume'
  }
];

const INITIAL_ALERTS: AlertItem[] = [
  {
    id: 'ALT-1082',
    timestamp: '14:22:10 Today',
    location: 'Warehouse B – Solvent Vault 02',
    type: 'Abnormal gas readings in Zone C',
    riskLevel: 'MODERATE',
    triggeringFactors: ['VOC Spike (+12 ppm/min)', 'Vapor concentration approaching 42 ppm'],
    status: 'Acknowledged',
    facility: 'warehouse_b',
    acknowledgedBy: 'Safety Officer J. Henderson',
    snapshot: {
      temperature: 28.4,
      gasPpm: 46.2,
      smokeObscuration: 0.35,
      flameDetected: false
    }
  },
  {
    id: 'ALT-1079',
    timestamp: '09:14:02 Today',
    location: 'Factory A – Machine Bay 03',
    type: 'Temperature rising in Zone A',
    riskLevel: 'LOW',
    triggeringFactors: ['Spindle motor localized heat (+4.1°C)'],
    status: 'Resolved',
    facility: 'factory_a',
    acknowledgedBy: 'Operator M. Patel',
    resolvedAt: '09:45:00 Today',
    snapshot: {
      temperature: 31.0,
      gasPpm: 19.5,
      smokeObscuration: 0.12,
      flameDetected: false
    }
  }
];

const INITIAL_LOGS: EventLogItem[] = [
  {
    id: 'EVT-9001',
    timestamp: '14:30:15',
    level: 'info',
    category: 'AI Inference',
    description: 'Autonomous multi-sensor risk model executed nominal cycle. All telemetry within baseline tolerances.',
    facility: 'factory_a'
  },
  {
    id: 'EVT-9000',
    timestamp: '14:22:10',
    level: 'warning',
    category: 'Safety Protocol',
    description: 'Alert ALT-1082 generated in Solvent Vault 02. Operator notified. Protocol WATCH initiated.',
    facility: 'warehouse_b'
  },
  {
    id: 'EVT-8999',
    timestamp: '12:00:00',
    level: 'info',
    category: 'Sensor Telemetry',
    description: 'Scheduled daily calibration heartbeat confirmed for 12/12 multi-spectral sensors.',
    facility: 'factory_a'
  },
  {
    id: 'EVT-8998',
    timestamp: '09:45:00',
    level: 'info',
    category: 'Operator Action',
    description: 'Alert ALT-1079 marked as Resolved by Operator M. Patel following motor coolant replenishment.',
    facility: 'factory_a'
  }
];

interface FireShieldContextType {
  facility: FacilityId;
  setFacility: (facility: FacilityId) => void;
  currentFacility: Facility;
  
  // Theme state
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  
  // Real-time sensor telemetry
  temperature: number;
  gasPpm: number;
  smokeObscuration: number;
  flameDetected: boolean;
  thermalHotspot: number;
  lastUpdated: string;
  
  // Risk assessment
  riskScore: number;
  riskClassification: RiskClassification;
  responseLevel: ResponseLevel;
  contributingFactors: ContributingFactor[];
  aiExplanation: string;
  isAnalyzing: boolean;
  runRiskAnalysis: () => void;
  
  // Telemetry time-series history
  telemetryHistory: TelemetryPoint[];
  
  // Cameras
  selectedCameraId: string;
  setSelectedCameraId: (id: string) => void;
  selectedCamera: CameraFeed;
  
  // Alerts
  alerts: AlertItem[];
  activeAlertsCount: number;
  acknowledgeAlert: (id: string) => void;
  resolveAlert: (id: string) => void;
  
  // Sensors
  sensors: SensorItem[];
  onlineSensorsCount: number;
  totalSensorsCount: number;
  toggleSensorFault: (sensorId: string) => void;
  restoreAllSensors: () => void;
  
  // Simulation states
  isFireSimulated: boolean;
  simulateFireEvent: () => void;
  resetSimulation: () => void;
  
  // Human override & suppression simulation
  humanOverrideActive: boolean;
  toggleHumanOverride: () => void;
  suppressionSimState: 'idle' | 'warning' | 'countdown' | 'discharged' | 'inhibited';
  suppressionCountdown: number;
  startSuppressionDrill: () => void;
  abortSuppressionDrill: () => void;
  
  // Event logs & reports
  eventLogs: EventLogItem[];
  exportLogsCSV: () => void;
  
  // Settings
  settings: SystemSettings;
  updateSettings: (newSettings: Partial<SystemSettings>) => void;
  
  // Audio alarm state
  isAlarmMuted: boolean;
  toggleAlarmMute: () => void;
  playAlertSound: () => void;
}

const FireShieldContext = createContext<FireShieldContextType | null>(null);

export const FireShieldProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [facility, setFacility] = useState<FacilityId>('factory_a');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  
  // Telemetry states
  const [temperature, setTemperature] = useState<number>(24.2);
  const [gasPpm, setGasPpm] = useState<number>(18.5);
  const [smokeObscuration, setSmokeObscuration] = useState<number>(0.24);
  const [flameDetected, setFlameDetected] = useState<boolean>(false);
  const [thermalHotspot, setThermalHotspot] = useState<number>(28.5);
  const [lastUpdated, setLastUpdated] = useState<string>('Just now');
  
  // Simulation state
  const [isFireSimulated, setIsFireSimulated] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [humanOverrideActive, setHumanOverrideActive] = useState<boolean>(false);
  const [suppressionSimState, setSuppressionSimState] = useState<'idle' | 'warning' | 'countdown' | 'discharged' | 'inhibited'>('idle');
  const [suppressionCountdown, setSuppressionCountdown] = useState<number>(30);
  
  // Selected camera
  const [selectedCameraId, setSelectedCameraId] = useState<string>('CAM-01');
  
  // Alerts & sensors
  const [alerts, setAlerts] = useState<AlertItem[]>(INITIAL_ALERTS);
  const [sensors, setSensors] = useState<SensorItem[]>(INITIAL_SENSORS);
  const [eventLogs, setEventLogs] = useState<EventLogItem[]>(INITIAL_LOGS);
  
  // Settings
  const [settings, setSettings] = useState<SystemSettings>({
    tempWarningThreshold: 45.0,
    tempCriticalThreshold: 68.0,
    gasWarningThreshold: 80.0,
    gasCriticalThreshold: 250.0,
    smokeWarningThreshold: 3.5,
    suppressionDelaySeconds: 30,
    safetyOfficerEmail: 'j.henderson@industrial-facility.net',
    safetyOfficerPhone: '+1 (555) 019-3829',
    audibleAlarm: false
  });
  
  const [isAlarmMuted, setIsAlarmMuted] = useState<boolean>(false);

  // Sync theme with HTML class
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  // Professional synthesized Web Audio API sound chime (no external MP3s)
  const playAlertSound = useCallback(() => {
    if (isAlarmMuted) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      
      const now = ctx.currentTime;
      // Tone 1: 880 Hz (A5)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(880, now);
      gain1.gain.setValueAtTime(0.12, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.25);

      // Tone 2: 1320 Hz (E6)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(1320, now + 0.15);
      gain2.gain.setValueAtTime(0.15, now + 0.15);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.15);
      osc2.stop(now + 0.45);
    } catch {
      // AudioContext unavailable or blocked
    }
  }, [isAlarmMuted]);

  // Historical telemetry curve (starts with 8 historical points)
  const [telemetryHistory, setTelemetryHistory] = useState<TelemetryPoint[]>([
    { time: '14:24', temperature: 23.8, gasPpm: 17.2, smokeObscuration: 0.18, riskScore: 14, baselineTemp: 24.0 },
    { time: '14:25', temperature: 23.9, gasPpm: 17.6, smokeObscuration: 0.19, riskScore: 15, baselineTemp: 24.0 },
    { time: '14:26', temperature: 24.1, gasPpm: 18.0, smokeObscuration: 0.20, riskScore: 16, baselineTemp: 24.0 },
    { time: '14:27', temperature: 24.0, gasPpm: 18.4, smokeObscuration: 0.22, riskScore: 17, baselineTemp: 24.0 },
    { time: '14:28', temperature: 24.2, gasPpm: 18.2, smokeObscuration: 0.23, riskScore: 16, baselineTemp: 24.0 },
    { time: '14:29', temperature: 24.3, gasPpm: 18.5, smokeObscuration: 0.24, riskScore: 18, baselineTemp: 24.0 },
    { time: '14:30', temperature: 24.2, gasPpm: 18.5, smokeObscuration: 0.24, riskScore: 18, baselineTemp: 24.0 }
  ]);

  // Derived current facility
  const currentFacility = useMemo(() => {
    return FACILITIES.find(f => f.id === facility) || FACILITIES[0];
  }, [facility]);

  // Derived camera
  const selectedCamera = useMemo(() => {
    return CAMERAS.find(c => c.id === selectedCameraId) || CAMERAS[0];
  }, [selectedCameraId]);

  // Risk Score calculation formula (deterministic demonstration logic)
  const { riskScore, riskClassification, responseLevel, contributingFactors, aiExplanation } = useMemo(() => {
    const tempFactor = Math.min(100, Math.max(0, ((temperature - 20) / (85 - 20)) * 100));
    const gasFactor = Math.min(100, Math.max(0, ((gasPpm - 10) / (400 - 10)) * 100));
    const smokeFactor = Math.min(100, Math.max(0, ((smokeObscuration - 0.2) / (18 - 0.2)) * 100));
    const flameFactor = flameDetected ? 100 : 0;
    
    const hasFaultedSensor = sensors.some(s => s.status === 'fault' || s.status === 'offline');
    const faultPenalty = hasFaultedSensor ? 10 : 0;

    let score = Math.round(
      tempFactor * 0.30 +
      gasFactor * 0.25 +
      smokeFactor * 0.25 +
      flameFactor * 0.20 +
      faultPenalty
    );

    score = Math.min(99, Math.max(12, score));

    let classification: RiskClassification = 'LOW';
    let level: ResponseLevel = 'WATCH';

    if (score < 30) {
      classification = 'LOW';
      level = 'WATCH';
    } else if (score < 60) {
      classification = 'MODERATE';
      level = 'WATCH';
    } else if (score < 80) {
      classification = 'HIGH';
      level = 'ALERT';
    } else {
      classification = 'CRITICAL';
      level = 'ACT';
    }

    const factors: ContributingFactor[] = [
      {
        name: 'Thermal Pyrometry (Temperature)',
        impactScore: Math.round(tempFactor),
        status: temperature >= 65 ? 'Critical' : temperature >= 40 ? 'Elevated' : 'Normal',
        value: `${temperature.toFixed(1)} °C`,
        threshold: '> 45.0 °C threshold',
        description: temperature >= 65 ? 'Severe thermal runaway detected across zone' : 'Within normal operational range'
      },
      {
        name: 'Optical Smoke Obscuration',
        impactScore: Math.round(smokeFactor),
        status: smokeObscuration >= 10 ? 'Critical' : smokeObscuration >= 2.5 ? 'Elevated' : 'Normal',
        value: `${smokeObscuration.toFixed(2)} %/m`,
        threshold: '> 3.5 %/m threshold',
        description: smokeObscuration >= 10 ? 'Heavy airborne particulate obscuration' : 'Clear ambient atmospheric transmission'
      },
      {
        name: 'Combustible / Toxic Gas (VOC & CO)',
        impactScore: Math.round(gasFactor),
        status: gasPpm >= 200 ? 'Critical' : gasPpm >= 60 ? 'Elevated' : 'Normal',
        value: `${gasPpm.toFixed(0)} ppm`,
        threshold: '> 80 ppm threshold',
        description: gasPpm >= 200 ? 'Explosive vapor limit hazard concentration' : 'Normal industrial air background'
      },
      {
        name: 'Multi-Spectrum Optical Flame Detection',
        impactScore: flameFactor,
        status: flameDetected ? 'Critical' : 'Normal',
        value: flameDetected ? 'FLAME CONFIRMED' : 'Negative',
        threshold: 'Dual IR/UV confirmation',
        description: flameDetected ? 'Visual AI camera confirms open flame flicker pattern' : 'No optical flicker anomalies'
      },
      {
        name: 'Sensor Network Redundancy',
        impactScore: hasFaultedSensor ? 45 : 5,
        status: hasFaultedSensor ? 'Elevated' : 'Normal',
        value: hasFaultedSensor ? 'DEGRADED (1+ Sensor Fault)' : '100% Online',
        threshold: 'All telemetry online',
        description: hasFaultedSensor ? 'Sensor offline reduces confidence margin; safety factor increased.' : 'Full voting redundancy active'
      }
    ];

    let explanation = '';
    if (level === 'ACT') {
      explanation = `Risk level increased to CRITICAL (${score}%) because multiple independent sensors (Temperature at ${temperature.toFixed(1)}°C, Smoke at ${smokeObscuration.toFixed(1)}%/m, and Gas at ${gasPpm.toFixed(0)} ppm) correlate with active flame confirmation in ${currentFacility.name}. High probability of uncontrolled industrial combustion.`;
    } else if (level === 'ALERT') {
      explanation = `Risk level elevated to HIGH (${score}%). Thermal pyrometry and atmospheric sensors reflect anomalous upward gradient exceeding 3.8°C/min. Inspection required by on-duty safety officer.`;
    } else if (classification === 'MODERATE') {
      explanation = `Risk classified as MODERATE (${score}%). Minor variance in ambient gas or thermal readings detected. Monitoring frequency automatically increased.`;
    } else {
      explanation = `Nominal baseline operation (${score}%). Multi-spectral telemetry is steady and within certified industrial safety envelopes across all zones.`;
    }

    return {
      riskScore: score,
      riskClassification: classification,
      responseLevel: level,
      contributingFactors: factors,
      aiExplanation: explanation
    };
  }, [temperature, gasPpm, smokeObscuration, flameDetected, sensors, currentFacility]);

  // Keep sensors array updated with live readings
  useEffect(() => {
    setSensors(prev => prev.map(s => {
      if (s.status === 'fault' || s.status === 'offline') {
        return s;
      }
      if (s.type === 'temperature') {
        return { ...s, currentReading: `${temperature.toFixed(1)} °C`, numericReading: temperature };
      }
      if (s.type === 'smoke') {
        return { ...s, currentReading: `${smokeObscuration.toFixed(2)} %/m`, numericReading: smokeObscuration };
      }
      if (s.type === 'gas') {
        return { ...s, currentReading: `${gasPpm.toFixed(0)} ppm`, numericReading: gasPpm };
      }
      if (s.type === 'thermal_camera') {
        return { ...s, currentReading: `Hotspot: ${thermalHotspot.toFixed(1)} °C`, numericReading: thermalHotspot };
      }
      if (s.type === 'visual_camera') {
        return { ...s, currentReading: flameDetected ? 'Flame Confirmed (96.4%)' : 'Flame: 0.0%', numericReading: flameDetected ? 96.4 : 0 };
      }
      return s;
    }));
  }, [temperature, gasPpm, smokeObscuration, thermalHotspot, flameDetected]);

  // Simulation: Fire Event
  const simulateFireEvent = useCallback(() => {
    setIsFireSimulated(true);
    const newTemp = 82.4;
    const newGas = 385;
    const newSmoke = 14.6;
    const newHotspot = 124.0;
    
    setTemperature(newTemp);
    setGasPpm(newGas);
    setSmokeObscuration(newSmoke);
    setFlameDetected(true);
    setThermalHotspot(newHotspot);
    setLastUpdated('Updated just now (Simulated Event)');

    // Play chime sound
    playAlertSound();

    // Create a new critical alert
    const newAlert: AlertItem = {
      id: `ALT-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }) + ' Today',
      location: `${currentFacility.name.split('–')[0].trim()} – Zone 1 (CNC/Staging)`,
      type: 'Potential fire detected near Equipment 04',
      riskLevel: 'CRITICAL',
      triggeringFactors: [
        'Rapid Temperature Spike (+58.2°C)',
        'Heavy Smoke Obscuration (14.6 %/m)',
        'VOC Gas Excursion (385 ppm)',
        'Multi-Spectrum Flame Signature'
      ],
      status: 'Active',
      facility,
      snapshot: {
        temperature: newTemp,
        gasPpm: newGas,
        smokeObscuration: newSmoke,
        flameDetected: true
      }
    };

    setAlerts(prev => [newAlert, ...prev]);

    // Append to event logs
    const log1: EventLogItem = {
      id: `EVT-${Math.floor(10000 + Math.random() * 90000)}`,
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
      level: 'critical',
      category: 'Simulation Control',
      description: `SIMULATION TRIGGERED: High-intensity fire anomaly injected in ${currentFacility.name}. Temp: 82.4°C, Smoke: 14.6%/m, Flame: Confirmed.`,
      facility
    };
    const log2: EventLogItem = {
      id: `EVT-${Math.floor(10000 + Math.random() * 90000)}`,
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
      level: 'critical',
      category: 'Safety Protocol',
      description: `ACT PROTOCOL ENGAGED: FireShield AI verified 4 independent sensors. Suppression pre-activation interlock armed. Ready for human authorization.`,
      facility
    };

    setEventLogs(prev => [log1, log2, ...prev]);

    // Push new point into telemetry chart
    setTelemetryHistory(prev => [
      ...prev.slice(-10),
      {
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }),
        temperature: newTemp,
        gasPpm: newGas,
        smokeObscuration: newSmoke,
        riskScore: 94,
        baselineTemp: 24.0
      }
    ]);

    if (humanOverrideActive) {
      setSuppressionSimState('inhibited');
    } else {
      setSuppressionSimState('warning');
    }
  }, [currentFacility, facility, humanOverrideActive, playAlertSound]);

  // Simulation: Reset
  const resetSimulation = useCallback(() => {
    setIsFireSimulated(false);
    setTemperature(24.2);
    setGasPpm(18.5);
    setSmokeObscuration(0.24);
    setFlameDetected(false);
    setThermalHotspot(28.5);
    setLastUpdated('Updated just now');
    setSuppressionSimState('idle');
    setSuppressionCountdown(30);

    const resetLog: EventLogItem = {
      id: `EVT-${Math.floor(10000 + Math.random() * 90000)}`,
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
      level: 'info',
      category: 'Simulation Control',
      description: `SIMULATION RESET: Environmental parameters restored to certified nominal baseline (24.2°C, 18.5 ppm gas, 0.24%/m smoke). Emergency suppression standing down.`,
      facility
    };

    setEventLogs(prev => [resetLog, ...prev]);

    setTelemetryHistory(prev => [
      ...prev.slice(-10),
      {
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }),
        temperature: 24.2,
        gasPpm: 18.5,
        smokeObscuration: 0.24,
        riskScore: 18,
        baselineTemp: 24.0
      }
    ]);
  }, [facility]);

  // Toggle Sensor Fault
  const toggleSensorFault = useCallback((sensorId: string) => {
    setSensors(prev => prev.map(s => {
      if (s.id === sensorId) {
        const isFaulting = s.status === 'online';
        const newStatus: SensorItem['status'] = isFaulting ? 'fault' : 'online';
        
        const log: EventLogItem = {
          id: `EVT-${Math.floor(10000 + Math.random() * 90000)}`,
          timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
          level: isFaulting ? 'warning' : 'info',
          category: 'Sensor Telemetry',
          description: isFaulting 
            ? `SIMULATED SENSOR FAULT: ${s.name} (${s.id}) marked offline. Voting redundancy degraded. AI uncertainty penalty applied.`
            : `SENSOR RESTORED: ${s.name} (${s.id}) diagnostics returned to nominal online status.`,
          facility
        };
        setEventLogs(l => [log, ...l]);

        if (isFaulting) {
          const faultAlert: AlertItem = {
            id: `ALT-${Math.floor(1000 + Math.random() * 9000)}`,
            timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }) + ' Today',
            location: `${s.location}`,
            type: `Telemetry Loss: ${s.name} unresponsive`,
            riskLevel: 'MODERATE',
            triggeringFactors: ['Sensor heartbeat timeout', 'Reduced redundancy in voting algorithm'],
            status: 'Active',
            facility,
            snapshot: {
              temperature,
              gasPpm,
              smokeObscuration,
              flameDetected
            }
          };
          setAlerts(a => [faultAlert, ...a]);
        }

        return {
          ...s,
          status: newStatus,
          healthPercent: isFaulting ? 0 : 98,
          currentReading: isFaulting ? 'UNAVAILABLE (COMM FAULT)' : s.currentReading,
          failReason: isFaulting ? 'Simulation: Induced Loop Open Circuit' : undefined
        };
      }
      return s;
    }));
  }, [facility, temperature, gasPpm, smokeObscuration, flameDetected]);

  const restoreAllSensors = useCallback(() => {
    setSensors(prev => prev.map(s => ({
      ...s,
      status: 'online',
      healthPercent: 99,
      failReason: undefined
    })));
    const log: EventLogItem = {
      id: `EVT-${Math.floor(10000 + Math.random() * 90000)}`,
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
      level: 'info',
      category: 'Sensor Telemetry',
      description: 'All 12 sensors verified online following system re-probe.',
      facility
    };
    setEventLogs(prev => [log, ...prev]);
  }, [facility]);

  // Run Risk Analysis recalculation
  const runRiskAnalysis = useCallback(() => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      const log: EventLogItem = {
        id: `EVT-${Math.floor(10000 + Math.random() * 90000)}`,
        timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
        level: 'info',
        category: 'AI Inference',
        description: `Manual AI Risk Re-assessment invoked. Re-checked 5 sensor vectors. Calculated score: ${riskScore}% (${riskClassification}).`,
        facility
      };
      setEventLogs(prev => [log, ...prev]);
    }, 1200);
  }, [facility, riskScore, riskClassification]);

  // Acknowledge Alert
  const acknowledgeAlert = useCallback((id: string) => {
    setAlerts(prev => prev.map(a => {
      if (a.id === id) {
        return {
          ...a,
          status: 'Acknowledged',
          acknowledgedBy: 'Safety Officer (Console Override)'
        };
      }
      return a;
    }));
    const log: EventLogItem = {
      id: `EVT-${Math.floor(10000 + Math.random() * 90000)}`,
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
      level: 'action',
      category: 'Operator Action',
      description: `Alert ${id} acknowledged by control-room operator. Notification siren silenced.`,
      facility
    };
    setEventLogs(prev => [log, ...prev]);
  }, [facility]);

  // Resolve Alert
  const resolveAlert = useCallback((id: string) => {
    setAlerts(prev => prev.map(a => {
      if (a.id === id) {
        return {
          ...a,
          status: 'Resolved',
          resolvedAt: new Date().toLocaleTimeString('en-US', { hour12: false }) + ' Today'
        };
      }
      return a;
    }));
    const log: EventLogItem = {
      id: `EVT-${Math.floor(10000 + Math.random() * 90000)}`,
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
      level: 'action',
      category: 'Operator Action',
      description: `Alert ${id} cleared and marked Resolved. Incident post-mortem archived.`,
      facility
    };
    setEventLogs(prev => [log, ...prev]);
  }, [facility]);

  // Human Override toggle
  const toggleHumanOverride = useCallback(() => {
    setHumanOverrideActive(prev => {
      const next = !prev;
      const log: EventLogItem = {
        id: `EVT-${Math.floor(10000 + Math.random() * 90000)}`,
        timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
        level: next ? 'warning' : 'info',
        category: 'Safety Protocol',
        description: next 
          ? 'HUMAN OVERRIDE ENGAGED: Safety officer interlock locked. Automated suppression release unconditionally inhibited.'
          : 'HUMAN OVERRIDE DISENGAGED: System returned to standard multi-factor confirmation mode.',
        facility
      };
      setEventLogs(l => [log, ...l]);
      
      if (next && suppressionSimState === 'countdown') {
        setSuppressionSimState('inhibited');
      }
      return next;
    });
  }, [facility, suppressionSimState]);

  // Suppression Drill controls
  const startSuppressionDrill = useCallback(() => {
    if (humanOverrideActive) {
      setSuppressionSimState('inhibited');
      return;
    }
    setSuppressionSimState('countdown');
    setSuppressionCountdown(30);

    const log: EventLogItem = {
      id: `EVT-${Math.floor(10000 + Math.random() * 90000)}`,
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
      level: 'critical',
      category: 'Safety Protocol',
      description: 'SIMULATED SUPPRESSION SEQUENCE INITIATED: 30-second pre-discharge siren countdown started in Zone 1. Gas dampers closing.',
      facility
    };
    setEventLogs(prev => [log, ...prev]);
  }, [humanOverrideActive, facility]);

  const abortSuppressionDrill = useCallback(() => {
    setSuppressionSimState('idle');
    setSuppressionCountdown(30);

    const log: EventLogItem = {
      id: `EVT-${Math.floor(10000 + Math.random() * 90000)}`,
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
      level: 'action',
      category: 'Operator Action',
      description: 'MANUAL ABORT: Emergency stop button pressed. Suppression sequence instantly aborted. Pneumatic valves locked in safe state.',
      facility
    };
    setEventLogs(prev => [log, ...prev]);
  }, [facility]);

  // Countdown timer for simulated suppression
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (suppressionSimState === 'countdown' && suppressionCountdown > 0) {
      timer = setTimeout(() => {
        setSuppressionCountdown(c => c - 1);
      }, 1000);
    } else if (suppressionSimState === 'countdown' && suppressionCountdown === 0) {
      setSuppressionSimState('discharged');
      const log: EventLogItem = {
        id: `EVT-${Math.floor(10000 + Math.random() * 90000)}`,
        timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
        level: 'critical',
        category: 'Safety Protocol',
        description: 'SIMULATION COMPLETE: Clean agent Novec 1230 gas discharged in Zone 1. Oxygen depletion mitigation active.',
        facility
      };
      setEventLogs(prev => [log, ...prev]);
    }
    return () => clearTimeout(timer);
  }, [suppressionSimState, suppressionCountdown, facility]);

  // Export CSV
  const exportLogsCSV = useCallback(() => {
    const headers = ['Event ID', 'Timestamp', 'Facility', 'Severity Level', 'Category', 'Description'];
    const rows = eventLogs.map(l => [
      `"${l.id}"`,
      `"${l.timestamp}"`,
      `"${l.facility}"`,
      `"${l.level.toUpperCase()}"`,
      `"${l.category}"`,
      `"${l.description.replace(/"/g, '""')}"`
    ]);
    
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `FireShield_Event_Logs_${facility}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [eventLogs, facility]);

  const updateSettings = useCallback((newSettings: Partial<SystemSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  const toggleAlarmMute = useCallback(() => {
    setIsAlarmMuted(prev => !prev);
  }, []);

  const activeAlertsCount = useMemo(() => {
    return alerts.filter(a => a.status === 'Active').length;
  }, [alerts]);

  const onlineSensorsCount = useMemo(() => {
    return sensors.filter(s => s.status === 'online').length;
  }, [sensors]);

  return (
    <FireShieldContext.Provider
      value={{
        facility,
        setFacility,
        currentFacility,
        theme,
        toggleTheme,
        temperature,
        gasPpm,
        smokeObscuration,
        flameDetected,
        thermalHotspot,
        lastUpdated,
        riskScore,
        riskClassification,
        responseLevel,
        contributingFactors,
        aiExplanation,
        isAnalyzing,
        runRiskAnalysis,
        telemetryHistory,
        selectedCameraId,
        setSelectedCameraId,
        selectedCamera,
        alerts,
        activeAlertsCount,
        acknowledgeAlert,
        resolveAlert,
        sensors,
        onlineSensorsCount,
        totalSensorsCount: sensors.length,
        toggleSensorFault,
        restoreAllSensors,
        isFireSimulated,
        simulateFireEvent,
        resetSimulation,
        humanOverrideActive,
        toggleHumanOverride,
        suppressionSimState,
        suppressionCountdown,
        startSuppressionDrill,
        abortSuppressionDrill,
        eventLogs,
        exportLogsCSV,
        settings,
        updateSettings,
        isAlarmMuted,
        toggleAlarmMute,
        playAlertSound
      }}
    >
      {children}
    </FireShieldContext.Provider>
  );
};

export const useFireShield = () => {
  const context = useContext(FireShieldContext);
  if (!context) {
    throw new Error('useFireShield must be used within a FireShieldProvider');
  }
  return context;
};
