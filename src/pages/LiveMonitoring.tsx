import React, { useState } from 'react';
import {
  Video,
  Flame,
  RotateCcw,
  Thermometer,
  Wind,
  Activity,
  AlertTriangle,
  Eye,
  Scan,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { useFireShield, CAMERAS } from '../context/FireShieldContext';

export const LiveMonitoring: React.FC = () => {
  const {
    selectedCameraId,
    setSelectedCameraId,
    selectedCamera,
    currentFacility,
    temperature,
    gasPpm,
    smokeObscuration,
    flameDetected,
    thermalHotspot,
    lastUpdated,
    simulateFireEvent,
    resetSimulation,
    isFireSimulated,
    riskClassification,
    riskScore
  } = useFireShield();

  const [aiOverlayEnabled, setAiOverlayEnabled] = useState<boolean>(true);
  const [thermalFilterMode, setThermalFilterMode] = useState<boolean>(false);

  return (
    <div className="space-y-6">
      {/* Simulation Disclaimer Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-300">
          <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
          <span>
            <strong className="text-slate-900 dark:text-white">PROTOTYPE SIMULATION NOTICE:</strong> All camera feeds, telemetry readings, and optical AI flame detections shown below are simulated for demonstration.
          </span>
        </div>

        {/* Live Simulation Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={simulateFireEvent}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm ${
              isFireSimulated
                ? 'bg-red-600 text-white shadow-red-500/30 ring-2 ring-red-400'
                : 'bg-red-600 hover:bg-red-700 text-white'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
            <span>Simulate Fire Event</span>
          </button>

          <button
            onClick={resetSimulation}
            className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Reset Baseline</span>
          </button>
        </div>
      </div>

      {/* Main Central CCTV Monitoring Panel */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl overflow-hidden shadow-lg">
        {/* Top Control Bar for Central Panel */}
        <div className="p-4 bg-slate-50 dark:bg-slate-950 border-b border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider font-mono">
                  {selectedCamera.id} · {selectedCamera.name}
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400 border border-emerald-200">
                  {selectedCamera.status}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                {currentFacility.name} · {selectedCamera.location}
              </p>
            </div>
          </div>

          {/* Camera Selector Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
            {CAMERAS.map((cam) => (
              <button
                key={cam.id}
                onClick={() => setSelectedCameraId(cam.id)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                  selectedCameraId === cam.id
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs border border-slate-200 dark:border-slate-700'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
                }`}
              >
                <Video className="w-3.5 h-3.5 text-slate-500" />
                <span>{cam.id}</span>
              </button>
            ))}
          </div>

          {/* View Overlays */}
          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={() => setAiOverlayEnabled(!aiOverlayEnabled)}
              className={`px-3 py-1.5 rounded-lg font-mono text-[11px] font-bold border transition-colors flex items-center gap-1.5 ${
                aiOverlayEnabled
                  ? 'bg-red-50 text-red-700 border-red-300 dark:bg-red-950/60 dark:border-red-700 dark:text-red-300'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              <Scan className="w-3.5 h-3.5" />
              <span>AI Box: {aiOverlayEnabled ? 'ON' : 'OFF'}</span>
            </button>

            <button
              onClick={() => setThermalFilterMode(!thermalFilterMode)}
              className={`px-3 py-1.5 rounded-lg font-mono text-[11px] font-bold border transition-colors flex items-center gap-1.5 ${
                thermalFilterMode
                  ? 'bg-orange-50 text-orange-700 border-orange-300 dark:bg-orange-950/60 dark:border-orange-700 dark:text-orange-300'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Thermal IR: {thermalFilterMode ? 'ON' : 'OFF'}</span>
            </button>
          </div>
        </div>

        {/* Large Central Feed Screen */}
        <div className="relative aspect-[16/9] max-h-[580px] bg-black overflow-hidden flex items-center justify-center select-none">
          {/* Base CCTV feed image */}
          <img
            src={selectedCamera.imageSrc}
            alt={selectedCamera.name}
            referrerPolicy="no-referrer"
            className={`w-full h-full object-cover transition-all duration-300 ${
              thermalFilterMode ? 'hue-rotate-180 invert brightness-125 contrast-125' : ''
            }`}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 pointer-events-none" />

          {/* Simulated CCTV Header Bar */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-xs font-mono text-slate-200 pointer-events-none">
            <div className="flex items-center gap-3 bg-black/75 px-3 py-1.5 rounded-lg border border-slate-700/80 backdrop-blur-md">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
              <span className="font-bold text-red-400">REC</span>
              <span className="text-slate-400">·</span>
              <span>{selectedCamera.id}</span>
              <span className="text-slate-400">·</span>
              <span>{selectedCamera.fps} FPS</span>
              <span className="text-slate-400">·</span>
              <span>{selectedCamera.resolution}</span>
            </div>

            <div className="flex items-center gap-2 bg-black/75 px-3 py-1.5 rounded-lg border border-slate-700/80 backdrop-blur-md">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-200 font-bold">
                {new Date().toLocaleTimeString('en-US', { hour12: false })} · LIVE FEED
              </span>
            </div>
          </div>

          {/* Simulated AI Flame Detection Bounding Box */}
          {aiOverlayEnabled && flameDetected && (
            <div className="absolute top-1/4 left-1/3 w-52 h-52 border-2 border-red-500 bg-red-500/20 rounded shadow-[0_0_25px_rgba(239,68,68,0.7)] animate-pulse flex flex-col justify-between p-2.5">
              <div className="flex items-center justify-between">
                <span className="bg-red-600 text-white text-[11px] font-mono font-black px-2 py-0.5 rounded shadow">
                  FIRE DETECTED [96.4%]
                </span>
                <span className="text-[10px] font-mono text-red-200 bg-black/70 px-1.5 py-0.5 rounded">
                  Flicker 14Hz
                </span>
              </div>
              <div className="text-[10px] font-mono text-red-200 bg-black/80 p-1.5 rounded font-bold">
                Thermal Hotspot: {thermalHotspot.toFixed(1)}°C
              </div>
            </div>
          )}

          {/* Reticle / Aiming crosshair for industrial telemetry */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-30">
            <div className="w-16 h-16 border border-white/40 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-red-500 rounded-full" />
            </div>
          </div>

          {/* Bottom Feed Telemetry HUD */}
          <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3 text-xs font-mono pointer-events-none">
            <div className="bg-black/80 px-3.5 py-2 rounded-xl border border-slate-700/80 backdrop-blur-md flex items-center gap-4">
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">Temperature</span>
                <span className={`text-base font-bold ${temperature >= 60 ? 'text-red-400' : 'text-slate-100'}`}>
                  {temperature.toFixed(1)} °C
                </span>
              </div>
              <div className="h-6 w-px bg-slate-700" />
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">Gas (VOC/CO)</span>
                <span className={`text-base font-bold ${gasPpm >= 150 ? 'text-orange-400' : 'text-slate-100'}`}>
                  {gasPpm.toFixed(0)} ppm
                </span>
              </div>
              <div className="h-6 w-px bg-slate-700" />
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">Smoke Obscuration</span>
                <span className={`text-base font-bold ${smokeObscuration >= 5 ? 'text-red-400' : 'text-slate-100'}`}>
                  {smokeObscuration.toFixed(2)} %/m
                </span>
              </div>
            </div>

            <div className="bg-black/80 px-3.5 py-2 rounded-xl border border-slate-700/80 backdrop-blur-md flex items-center gap-3">
              <span className="text-[10px] text-slate-400 uppercase">Risk Evaluation:</span>
              <span className={`font-bold font-mono px-2 py-0.5 rounded text-xs ${
                riskClassification === 'CRITICAL' ? 'bg-red-600 text-white' :
                riskClassification === 'HIGH' ? 'bg-orange-500 text-slate-950' :
                riskClassification === 'MODERATE' ? 'bg-yellow-500 text-slate-950' :
                'bg-emerald-500 text-slate-950'
              }`}>
                {riskScore}% · {riskClassification}
              </span>
            </div>
          </div>
        </div>

        {/* Status Strip below central video */}
        <div className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-3">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-slate-800 dark:text-slate-200 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Camera Link: <strong className="text-slate-900 dark:text-white">Active (Low Latency)</strong>
            </span>
            <span>·</span>
            <span>Last Telemetry Packet: <strong className="text-slate-800 dark:text-slate-200">{lastUpdated}</strong></span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-slate-500">
              CCTV Engine: Industrial RTSP Emulation
            </span>
          </div>
        </div>
      </div>

      {/* Sensor Readings Displayed in Separate Cards (Prompt Requirement 5) */}
      <div>
        <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider mb-3.5 flex items-center gap-2">
          <span>Continuous Sensor Stream Readouts</span>
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200">
            {currentFacility.name.split('–')[0].trim()}
          </span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Temperature Card */}
          <div className={`p-5 rounded-2xl border bg-white dark:bg-slate-900 shadow-xs transition-all ${
            temperature >= 60 ? 'border-red-400 dark:border-red-500 bg-red-50/50 dark:bg-red-950/20' : 'border-slate-200/90 dark:border-slate-800'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase text-slate-500 font-bold">Ambient / Surface Temp</span>
              <Thermometer className={`w-4 h-4 ${temperature >= 60 ? 'text-red-600' : 'text-slate-400'}`} />
            </div>
            <div className="mt-2.5 flex items-baseline gap-2">
              <span className={`text-4xl font-mono font-black ${temperature >= 60 ? 'text-red-600 dark:text-red-400' : 'text-slate-900 dark:text-white'}`}>
                {temperature.toFixed(1)}
              </span>
              <span className="text-sm text-slate-500 font-bold">°C</span>
            </div>
            <div className="mt-4 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-500">Trip Point: 45.0 °C</span>
              <span className={`font-mono font-bold ${temperature >= 60 ? 'text-red-600' : 'text-emerald-700 dark:text-emerald-400'}`}>
                {temperature >= 60 ? 'EXCEEDED' : 'NOMINAL'}
              </span>
            </div>
          </div>

          {/* Gas Sensor Card */}
          <div className={`p-5 rounded-2xl border bg-white dark:bg-slate-900 shadow-xs transition-all ${
            gasPpm >= 150 ? 'border-orange-400 dark:border-orange-500 bg-orange-50/50 dark:bg-orange-950/20' : 'border-slate-200/90 dark:border-slate-800'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase text-slate-500 font-bold">Toxic & Combustible Gas</span>
              <Wind className={`w-4 h-4 ${gasPpm >= 150 ? 'text-orange-600' : 'text-slate-400'}`} />
            </div>
            <div className="mt-2.5 flex items-baseline gap-2">
              <span className={`text-4xl font-mono font-black ${gasPpm >= 150 ? 'text-orange-600 dark:text-orange-400' : 'text-slate-900 dark:text-white'}`}>
                {gasPpm.toFixed(0)}
              </span>
              <span className="text-sm text-slate-500 font-bold">ppm</span>
            </div>
            <div className="mt-4 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-500">Trip Point: 80 ppm</span>
              <span className={`font-mono font-bold ${gasPpm >= 150 ? 'text-orange-600' : 'text-emerald-700 dark:text-emerald-400'}`}>
                {gasPpm >= 150 ? 'HAZARD SPIKE' : 'SAFE'}
              </span>
            </div>
          </div>

          {/* Smoke Detection Status Card */}
          <div className={`p-5 rounded-2xl border bg-white dark:bg-slate-900 shadow-xs transition-all ${
            smokeObscuration >= 5 ? 'border-red-400 dark:border-red-500 bg-red-50/50 dark:bg-red-950/20' : 'border-slate-200/90 dark:border-slate-800'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase text-slate-500 font-bold">Optical Smoke Density</span>
              <Activity className={`w-4 h-4 ${smokeObscuration >= 5 ? 'text-red-600' : 'text-slate-400'}`} />
            </div>
            <div className="mt-2.5 flex items-baseline gap-2">
              <span className={`text-4xl font-mono font-black ${smokeObscuration >= 5 ? 'text-red-600 dark:text-red-400' : 'text-slate-900 dark:text-white'}`}>
                {smokeObscuration.toFixed(2)}
              </span>
              <span className="text-sm text-slate-500 font-bold">%/m</span>
            </div>
            <div className="mt-4 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-500">Trip Point: 3.5 %/m</span>
              <span className={`font-mono font-bold ${smokeObscuration >= 5 ? 'text-red-600' : 'text-emerald-700 dark:text-emerald-400'}`}>
                {smokeObscuration >= 5 ? 'SMOKE DETECTED' : 'CLEAR'}
              </span>
            </div>
          </div>

          {/* Flame Detection Status Card */}
          <div className={`p-5 rounded-2xl border bg-white dark:bg-slate-900 shadow-xs transition-all ${
            flameDetected ? 'border-red-500 bg-red-50/70 dark:bg-red-950/40' : 'border-slate-200/90 dark:border-slate-800'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase text-slate-500 font-bold">AI Flame Optical Analyzer</span>
              <Flame className={`w-4 h-4 ${flameDetected ? 'text-red-600' : 'text-slate-400'}`} />
            </div>
            <div className="mt-2.5 flex items-baseline gap-2">
              <span className={`text-2xl font-mono font-black ${flameDetected ? 'text-red-600 dark:text-red-400 animate-pulse' : 'text-emerald-700 dark:text-emerald-400'}`}>
                {flameDetected ? 'CONFIRMED' : 'NO FLICKER'}
              </span>
            </div>
            <div className="mt-4 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-500">Dual IR/UV Spec</span>
              <span className={`font-mono font-bold ${flameDetected ? 'text-red-600' : 'text-emerald-700 dark:text-emerald-400'}`}>
                {flameDetected ? 'ALERT ACTIVE' : 'SECURE'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
