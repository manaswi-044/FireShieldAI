import React from 'react';
import {
  AlertTriangle,
  X,
  Flame,
  CheckCircle2,
  StopCircle,
  Play,
  RotateCcw,
  Wind,
  ShieldCheck,
  ShieldAlert,
  Lock
} from 'lucide-react';
import { useFireShield } from '../context/FireShieldContext';

interface SuppressionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SuppressionModal: React.FC<SuppressionModalProps> = ({ isOpen, onClose }) => {
  const {
    currentFacility,
    temperature,
    smokeObscuration,
    gasPpm,
    flameDetected,
    humanOverrideActive,
    toggleHumanOverride,
    suppressionSimState,
    suppressionCountdown,
    startSuppressionDrill,
    abortSuppressionDrill
  } = useFireShield();

  if (!isOpen) return null;

  const isMultiSensorConfirmed = (temperature > 50 || smokeObscuration > 5 || gasPpm > 150) && flameDetected;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden">
        {/* Modal Top Bar */}
        <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-950 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                Simulated Suppression Interlock & Activation Drill
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Facility: {currentFacility.name} · Clean Agent (Novec 1230)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Simulation Disclaimer Banner */}
          <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 text-amber-900 dark:text-amber-300 text-xs flex items-center gap-2.5 shadow-2xs">
            <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />
            <span>
              <strong className="font-bold">PROTOTYPE DEMONSTRATION ONLY:</strong> This interface simulates the multi-stage interlock sequence. No physical actuators, valves, or gas cylinders exist or can be activated.
            </span>
          </div>

          {/* Dual-Confirmation Checklist */}
          <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
            <span className="text-xs font-extrabold text-slate-900 dark:text-slate-300 uppercase tracking-wide">
              Step 1: Multi-Sensor Voting Interlock (ACT Level Requirement)
            </span>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-300 font-medium">Thermal Excursion (&gt; 50°C):</span>
                <span className={`font-mono font-bold ${temperature > 50 ? 'text-red-600 dark:text-red-400' : 'text-slate-400'}`}>
                  {temperature.toFixed(1)} °C {temperature > 50 ? '✓' : '✗'}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-300 font-medium">Optical Smoke (&gt; 5 %/m):</span>
                <span className={`font-mono font-bold ${smokeObscuration > 5 ? 'text-red-600 dark:text-red-400' : 'text-slate-400'}`}>
                  {smokeObscuration.toFixed(2)} %/m {smokeObscuration > 5 ? '✓' : '✗'}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-300 font-medium">Combustible Gas (&gt; 150 ppm):</span>
                <span className={`font-mono font-bold ${gasPpm > 150 ? 'text-red-600 dark:text-red-400' : 'text-slate-400'}`}>
                  {gasPpm.toFixed(0)} ppm {gasPpm > 150 ? '✓' : '✗'}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-300 font-medium">AI Optical Flame Confirmed:</span>
                <span className={`font-mono font-bold ${flameDetected ? 'text-red-600 dark:text-red-400' : 'text-slate-400'}`}>
                  {flameDetected ? 'CONFIRMED ✓' : 'NEGATIVE ✗'}
                </span>
              </div>
            </div>
            <div className="text-[11px] text-slate-500">
              Cross-Zone Voting Status:{' '}
              {isMultiSensorConfirmed ? (
                <span className="text-red-600 dark:text-red-400 font-bold font-mono">CRITERIA MET (MULTIPLE INDEPENDENT INDICATORS)</span>
              ) : (
                <span className="text-yellow-700 dark:text-yellow-400 font-bold font-mono">PENDING (Need simulated fire event or manual operator override)</span>
              )}
            </div>
          </div>

          {/* Current Suppression Status & Countdown */}
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center space-y-3.5 shadow-2xs">
            <span className="text-xs uppercase font-mono text-slate-500 font-bold">
              Sequence Stage & Discharge Timer
            </span>

            {humanOverrideActive ? (
              <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-600/50 text-amber-900 dark:text-amber-300 space-y-1">
                <Lock className="w-8 h-8 mx-auto text-amber-600 dark:text-amber-400" />
                <h4 className="text-base font-extrabold">HUMAN OVERRIDE ACTIVATED</h4>
                <p className="text-xs text-amber-800/80 dark:text-amber-200/80">
                  Control-room safety officer has engaged mechanical interlock lock. All automatic and simulated discharge routines are prohibited.
                </p>
              </div>
            ) : suppressionSimState === 'countdown' ? (
              <div className="p-5 rounded-2xl bg-red-50 dark:bg-red-950/40 border-2 border-red-500 text-red-900 dark:text-red-200 space-y-2 animate-pulse">
                <span className="text-xs font-mono font-black tracking-widest text-red-600 dark:text-red-400">
                  WARNING: PRE-DISCHARGE EVACUATION COUNTDOWN
                </span>
                <div className="text-6xl font-mono font-black text-red-600 dark:text-red-500">
                  00:{suppressionCountdown < 10 ? `0${suppressionCountdown}` : suppressionCountdown}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  HVAC dampers closing. Warning siren pulsing. Clean agent release in {suppressionCountdown} seconds unless aborted.
                </p>
              </div>
            ) : suppressionSimState === 'discharged' ? (
              <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-400 dark:border-emerald-500/80 text-emerald-900 dark:text-emerald-300 space-y-1">
                <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-600 dark:text-emerald-400" />
                <h4 className="text-base font-extrabold">SIMULATED CLEAN AGENT DISCHARGED</h4>
                <p className="text-xs text-emerald-800 dark:text-emerald-200/80">
                  Simulated Novec 1230 gas flooding complete. Room sealed. Oxygen level monitoring active.
                </p>
              </div>
            ) : (
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 space-y-1">
                <Wind className="w-8 h-8 mx-auto text-slate-400" />
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-200">Suppression System: STANDBY</h4>
                <p className="text-xs text-slate-500">
                  Pneumatic release solenoids closed. 30-second delay countdown armed on authorized confirmation.
                </p>
              </div>
            )}

            {/* Controls */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              {suppressionSimState === 'countdown' ? (
                <button
                  onClick={abortSuppressionDrill}
                  className="px-6 py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-sm flex items-center gap-2 shadow-lg shadow-red-500/30 animate-bounce"
                >
                  <StopCircle className="w-5 h-5" />
                  <span>EMERGENCY ABORT / STOP</span>
                </button>
              ) : suppressionSimState === 'discharged' ? (
                <button
                  onClick={abortSuppressionDrill}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-2 shadow-xs"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reset Suppression System</span>
                </button>
              ) : (
                <button
                  onClick={startSuppressionDrill}
                  disabled={humanOverrideActive}
                  className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all ${
                    humanOverrideActive
                      ? 'bg-slate-200 text-slate-400 dark:bg-slate-800 dark:text-slate-600 cursor-not-allowed'
                      : 'bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-500/20'
                  }`}
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>Start 30s Simulated Countdown</span>
                </button>
              )}

              {/* Human Override Toggle in Modal */}
              <button
                onClick={toggleHumanOverride}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-colors shadow-2xs ${
                  humanOverrideActive
                    ? 'bg-white border-slate-200 dark:bg-slate-800 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-50'
                    : 'bg-amber-100 border-amber-300 dark:bg-amber-950/60 dark:border-amber-800 text-amber-900 dark:text-amber-300 hover:bg-amber-200'
                }`}
              >
                {humanOverrideActive ? (
                  <>
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Disengage Override</span>
                  </>
                ) : (
                  <>
                    <ShieldAlert className="w-4 h-4 text-amber-600" />
                    <span>Engage Safety Override</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-950 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <span className="font-medium">Design Thinking College Capstone Safety Architecture</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold transition-colors shadow-xs"
          >
            Close Drill
          </button>
        </div>
      </div>
    </div>
  );
};
