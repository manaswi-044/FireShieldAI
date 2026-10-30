import React from 'react';
import {
  Cpu,
  AlertTriangle,
  CheckCircle2,
  Thermometer,
  Activity,
  Wind,
  Eye,
  Video,
  RotateCcw,
  ShieldAlert,
  Battery
} from 'lucide-react';
import { useFireShield } from '../context/FireShieldContext';
import { SensorItem } from '../types';

export const SensorHealth: React.FC = () => {
  const {
    sensors,
    onlineSensorsCount,
    totalSensorsCount,
    toggleSensorFault,
    restoreAllSensors,
    currentFacility
  } = useFireShield();

  const getSensorIcon = (type: SensorItem['type']) => {
    switch (type) {
      case 'temperature':
        return <Thermometer className="w-5 h-5 text-red-600" />;
      case 'smoke':
        return <Activity className="w-5 h-5 text-slate-500" />;
      case 'gas':
        return <Wind className="w-5 h-5 text-yellow-600" />;
      case 'thermal_camera':
        return <Eye className="w-5 h-5 text-orange-600" />;
      case 'visual_camera':
        return <Video className="w-5 h-5 text-blue-600" />;
    }
  };

  const hasFault = sensors.some((s) => s.status !== 'online');

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
              Industrial Sensor Grid Diagnostics
            </h2>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold border ${
              hasFault
                ? 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/80 dark:text-amber-300 dark:border-amber-700'
                : 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border-emerald-700'
            }`}>
              {onlineSensorsCount}/{totalSensorsCount} OPERATIONAL
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Facility: {currentFacility.name} · Real-time telemetry bus integrity & diagnostic health.
          </p>
        </div>

        {hasFault && (
          <button
            onClick={restoreAllSensors}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white flex items-center gap-1.5 transition-colors self-start md:self-auto shadow-2xs"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-300" />
            <span>Restore All Faulted Sensors</span>
          </button>
        )}
      </div>

      {/* Sensor Redundancy & Voting Impact Advisory */}
      <div className={`p-4 rounded-xl border flex items-start gap-3 text-xs transition-colors ${
        hasFault
          ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-300 dark:border-amber-500/50 text-amber-900 dark:text-amber-200'
          : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 shadow-2xs'
      }`}>
        <ShieldAlert className={`w-5 h-5 shrink-0 mt-0.5 ${hasFault ? 'text-amber-600 dark:text-amber-400' : 'text-slate-400'}`} />
        <div className="space-y-1">
          <p className="font-bold text-slate-900 dark:text-white">
            Sensor Redundancy & Voting Architecture Principle:
          </p>
          <p className="leading-relaxed text-slate-600 dark:text-slate-300">
            FireShield AI uses multi-sensor voting to eliminate single-point false alarms. When a sensor fails or is marked unavailable, the system automatically expands uncertainty margins (+10% safety penalty) and prompts safety personnel to verify the physical monitoring zone manually.
          </p>
        </div>
      </div>

      {/* 5 Individual Sensor Cards (Prompt Requirement 9) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {sensors.map((sensor) => {
          const isFault = sensor.status !== 'online';

          return (
            <div
              key={sensor.id}
              className={`rounded-2xl border p-5 sm:p-6 flex flex-col justify-between space-y-4 transition-all shadow-xs ${
                isFault
                  ? 'bg-red-50/50 dark:bg-red-950/20 border-red-300 dark:border-red-500/60 shadow-md'
                  : 'bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800 hover:shadow-md'
              }`}
            >
              {/* Card Header */}
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shrink-0">
                      {getSensorIcon(sensor.type)}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-slate-900 dark:text-white text-sm leading-tight">
                        {sensor.name}
                      </h3>
                      <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400 mt-0.5">
                        {sensor.id} · {sensor.location}
                      </p>
                    </div>
                  </div>

                  {/* Status Indicator */}
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border uppercase shrink-0 ${
                    sensor.status === 'online'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-800'
                      : 'bg-red-100 text-red-700 border-red-300 dark:bg-red-950 dark:text-red-400 dark:border-red-800 animate-pulse'
                  }`}>
                    {sensor.status === 'online' ? 'ONLINE' : 'FAULT / OFFLINE'}
                  </span>
                </div>
              </div>

              {/* Current Reading Block */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 space-y-1">
                <span className="text-[10px] font-mono uppercase text-slate-500 font-bold">
                  Current Telemetry Output
                </span>
                <div className="flex items-baseline justify-between">
                  <span className={`text-2xl font-mono font-black ${
                    isFault ? 'text-red-600 text-sm' : 'text-slate-900 dark:text-slate-100'
                  }`}>
                    {sensor.currentReading}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">
                    Range: {sensor.nominalRange}
                  </span>
                </div>
              </div>

              {/* Health, Diagnostics & Power */}
              <div className="space-y-2 text-xs">
                {/* Health Bar */}
                <div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1 font-mono">
                    <span>Diagnostic Health Indicator</span>
                    <span className={isFault ? 'text-red-600 font-bold' : 'text-emerald-700 font-bold'}>
                      {sensor.healthPercent}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-200 dark:border-slate-800">
                    <div
                      className={`h-full transition-all duration-500 ${
                        isFault ? 'bg-red-600' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${sensor.healthPercent}%` }}
                    />
                  </div>
                </div>

                {/* Power & Heartbeat */}
                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100 dark:border-slate-800 font-mono">
                  <span className="flex items-center gap-1">
                    <Battery className="w-3 h-3 text-slate-400" />
                    {sensor.batteryPoE}
                  </span>
                  <span>Heartbeat: {sensor.lastUpdate}</span>
                </div>
              </div>

              {/* Fault warning explanation when failed */}
              {isFault && (
                <div className="p-3 rounded-lg bg-red-100 text-red-900 border border-red-200 text-[11px] space-y-1">
                  <p className="font-bold">
                    ⚠️ Redundancy Degraded
                  </p>
                  <p className="text-red-800/90 leading-tight">
                    {sensor.failReason || 'Sensor communication failed. Risk assessment uncertainty has been elevated.'}
                  </p>
                </div>
              )}

              {/* Interactive Simulate Sensor Failure button */}
              <button
                onClick={() => toggleSensorFault(sensor.id)}
                className={`w-full py-2 px-3.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors border shadow-2xs ${
                  isFault
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white border-transparent'
                    : 'bg-white hover:bg-red-50 text-red-700 border-red-200 hover:border-red-300 dark:bg-slate-950 dark:hover:bg-red-950/50'
                }`}
              >
                {isFault ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                    <span>Restore Normal Operation</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                    <span>Simulate Sensor Failure</span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
