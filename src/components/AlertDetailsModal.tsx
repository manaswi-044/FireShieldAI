import React from 'react';
import { X, AlertTriangle, Thermometer, Wind, Activity, Flame, CheckCircle2, Shield } from 'lucide-react';
import { AlertItem } from '../types';

interface AlertDetailsModalProps {
  alert: AlertItem | null;
  onClose: () => void;
  onAcknowledge: (id: string) => void;
  onResolve: (id: string) => void;
}

export const AlertDetailsModal: React.FC<AlertDetailsModalProps> = ({
  alert,
  onClose,
  onAcknowledge,
  onResolve
}) => {
  if (!alert) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-950 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${
              alert.riskLevel === 'CRITICAL' ? 'bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400' :
              alert.riskLevel === 'HIGH' ? 'bg-orange-100 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400' :
              'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400'
            }`}>
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white font-mono">{alert.id}</h3>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                  alert.riskLevel === 'CRITICAL' ? 'bg-red-50 text-red-700 border border-red-200 dark:bg-red-500/20 dark:text-red-400' :
                  alert.riskLevel === 'HIGH' ? 'bg-orange-50 text-orange-700 border border-orange-200 dark:bg-orange-500/20 dark:text-orange-400' :
                  'bg-yellow-50 text-yellow-800 border border-yellow-200 dark:bg-yellow-500/20 dark:text-yellow-400'
                }`}>
                  {alert.riskLevel}
                </span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                  alert.status === 'Active' ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400' :
                  alert.status === 'Acknowledged' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-400' :
                  'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400'
                }`}>
                  {alert.status}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">{alert.type}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 text-xs">
          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-3 bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
            <div>
              <span className="text-slate-400 font-mono text-[10px] uppercase font-bold">Incident Location</span>
              <p className="text-slate-900 dark:text-slate-200 font-bold mt-0.5">{alert.location}</p>
            </div>
            <div>
              <span className="text-slate-400 font-mono text-[10px] uppercase font-bold">Detection Time</span>
              <p className="text-slate-700 dark:text-slate-200 font-mono mt-0.5">{alert.timestamp}</p>
            </div>
            {alert.acknowledgedBy && (
              <div>
                <span className="text-slate-400 font-mono text-[10px] uppercase font-bold">Acknowledged By</span>
                <p className="text-slate-700 dark:text-slate-300 mt-0.5">{alert.acknowledgedBy}</p>
              </div>
            )}
            {alert.resolvedAt && (
              <div>
                <span className="text-slate-400 font-mono text-[10px] uppercase font-bold">Resolved At</span>
                <p className="text-emerald-700 dark:text-emerald-400 font-mono mt-0.5 font-bold">{alert.resolvedAt}</p>
              </div>
            )}
          </div>

          {/* Triggering Factors */}
          <div>
            <h4 className="font-extrabold text-slate-900 dark:text-slate-300 uppercase tracking-wider text-[11px] mb-2">
              Triggering Factors & AI Inference
            </h4>
            <div className="space-y-1.5">
              {alert.triggeringFactors.map((factor, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-300 font-medium"
                >
                  <span className="w-2 h-2 rounded-full bg-orange-500" />
                  <span>{factor}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Telemetry Snapshot at Alert Moment */}
          <div>
            <h4 className="font-extrabold text-slate-900 dark:text-slate-300 uppercase tracking-wider text-[11px] mb-2">
              Sensor Telemetry Snapshot at Trigger Instant
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex flex-col">
                <span className="flex items-center gap-1 text-[10px] text-slate-500 font-mono font-bold">
                  <Thermometer className="w-3 h-3 text-red-600" />
                  TEMP
                </span>
                <span className="text-lg font-black font-mono text-slate-900 dark:text-slate-200 mt-1">
                  {alert.snapshot.temperature.toFixed(1)} °C
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex flex-col">
                <span className="flex items-center gap-1 text-[10px] text-slate-500 font-mono font-bold">
                  <Wind className="w-3 h-3 text-yellow-600" />
                  GAS CONC
                </span>
                <span className="text-lg font-black font-mono text-slate-900 dark:text-slate-200 mt-1">
                  {alert.snapshot.gasPpm.toFixed(0)} ppm
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex flex-col">
                <span className="flex items-center gap-1 text-[10px] text-slate-500 font-mono font-bold">
                  <Activity className="w-3 h-3 text-slate-500" />
                  SMOKE
                </span>
                <span className="text-lg font-black font-mono text-slate-900 dark:text-slate-200 mt-1">
                  {alert.snapshot.smokeObscuration.toFixed(2)} %/m
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex flex-col">
                <span className="flex items-center gap-1 text-[10px] text-slate-500 font-mono font-bold">
                  <Flame className="w-3 h-3 text-orange-600" />
                  FLAME
                </span>
                <span className={`text-sm font-black font-mono mt-1 ${alert.snapshot.flameDetected ? 'text-red-600 dark:text-red-400' : 'text-slate-400'}`}>
                  {alert.snapshot.flameDetected ? 'CONFIRMED' : 'NONE'}
                </span>
              </div>
            </div>
          </div>

          {/* SOP */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
            <span className="text-[10px] font-mono uppercase text-slate-500 font-bold flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-blue-600" />
              Prescribed Plant Action Plan
            </span>
            <p className="text-slate-700 dark:text-slate-300 mt-1 text-[11px] leading-relaxed">
              1. Direct safety marshal to inspect {alert.location}. 2. Check local HVAC exhaust isolation valves. 3. Confirm area evacuation if smoke exceeds 5.0 %/m. 4. Record inspection findings before clearing.
            </p>
          </div>
        </div>

        {/* Actions Footer */}
        <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-950 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors"
          >
            Close Window
          </button>

          <div className="flex items-center gap-2">
            {alert.status === 'Active' && (
              <button
                onClick={() => {
                  onAcknowledge(alert.id);
                  onClose();
                }}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-2xs"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Acknowledge Alert</span>
              </button>
            )}

            {alert.status !== 'Resolved' && (
              <button
                onClick={() => {
                  onResolve(alert.id);
                  onClose();
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-2xs"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Mark as Resolved</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
