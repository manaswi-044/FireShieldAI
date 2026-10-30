import React from 'react';
import { Eye, BellRing, Flame, ShieldAlert, ShieldCheck, Lock, AlertTriangle } from 'lucide-react';
import { useFireShield } from '../context/FireShieldContext';

interface ThreeLevelResponseProps {
  onOpenSuppressionModal?: () => void;
}

export const ThreeLevelResponseCard: React.FC<ThreeLevelResponseProps> = ({ onOpenSuppressionModal }) => {
  const { responseLevel, humanOverrideActive, toggleHumanOverride } = useFireShield();

  return (
    <section className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 sm:p-6 space-y-5 shadow-xs transition-colors duration-200">
      {/* Header and Safety Directive */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
              Three-Level Adaptive Response Protocol
            </h3>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              ISO / NFPA 72 Standard Logic
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Progressive threat escalation ensuring human operator oversight before any automated actuation.
          </p>
        </div>

        {/* Human Override Switch */}
        <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 shrink-0 shadow-2xs">
          <div className="flex flex-col text-right">
            <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500">
              Human Safety Lock
            </span>
            <span className={`text-xs font-mono font-extrabold ${humanOverrideActive ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
              {humanOverrideActive ? 'SUPPRESSION INHIBITED' : 'INTERLOCK ARMED'}
            </span>
          </div>
          <button
            onClick={toggleHumanOverride}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs ${
              humanOverrideActive
                ? 'bg-amber-500 text-slate-950 hover:bg-amber-400'
                : 'bg-slate-900 dark:bg-slate-800 text-white hover:bg-slate-800 dark:hover:bg-slate-700'
            }`}
          >
            {humanOverrideActive ? (
              <>
                <Lock className="w-3.5 h-3.5" />
                <span>Override Active</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Engage Override</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* The 3 Level Cards: WATCH, ALERT, ACT */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* LEVEL 1: WATCH (Yellow) */}
        <div className={`p-4 rounded-xl border transition-all duration-200 ${
          responseLevel === 'WATCH'
            ? 'bg-amber-50/70 dark:bg-yellow-950/30 border-amber-400 dark:border-yellow-500/60 shadow-md ring-1 ring-amber-400/40'
            : 'bg-slate-50/50 dark:bg-slate-950/40 border-slate-200/80 dark:border-slate-800 opacity-80'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-yellow-500/20 text-amber-700 dark:text-yellow-400 flex items-center justify-center font-bold">
                <Eye className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-black text-amber-700 dark:text-yellow-400 font-mono tracking-wide">
                  WATCH · LEVEL 1
                </span>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">Low / Moderate Trend</p>
              </div>
            </div>
            {responseLevel === 'WATCH' && (
              <span className="text-[10px] font-mono font-extrabold px-2 py-0.5 rounded bg-amber-500 text-slate-950">
                ACTIVE
              </span>
            )}
          </div>
          <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-1.5 mt-3 pt-3 border-t border-amber-200/60 dark:border-yellow-500/20">
            <li className="flex items-start gap-1.5">
              <span className="text-amber-500 font-bold mt-0.5">·</span>
              <span>Risk is increasing or sensor readings are uncertain.</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-amber-500 font-bold mt-0.5">·</span>
              <span>Increase telemetry sample frequency (10 Hz).</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-amber-500 font-bold mt-0.5">·</span>
              <span>Record and correlate subtle thermal and gas rate changes.</span>
            </li>
          </ul>
        </div>

        {/* LEVEL 2: ALERT (Orange) */}
        <div className={`p-4 rounded-xl border transition-all duration-200 ${
          responseLevel === 'ALERT'
            ? 'bg-orange-50/80 dark:bg-orange-950/30 border-orange-400 dark:border-orange-500/60 shadow-md ring-1 ring-orange-400/40'
            : 'bg-slate-50/50 dark:bg-slate-950/40 border-slate-200/80 dark:border-slate-800 opacity-80'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-400 flex items-center justify-center font-bold">
                <BellRing className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-black text-orange-700 dark:text-orange-400 font-mono tracking-wide">
                  ALERT · LEVEL 2
                </span>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">High Risk Hazard</p>
              </div>
            </div>
            {responseLevel === 'ALERT' && (
              <span className="text-[10px] font-mono font-extrabold px-2 py-0.5 rounded bg-orange-500 text-white">
                ACTIVE
              </span>
            )}
          </div>
          <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-1.5 mt-3 pt-3 border-t border-orange-200/60 dark:border-orange-500/20">
            <li className="flex items-start gap-1.5">
              <span className="text-orange-500 font-bold mt-0.5">·</span>
              <span>Risk is high enough to require direct operator attention.</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-orange-500 font-bold mt-0.5">·</span>
              <span>Instantly notify safety officer via SMS & console warning.</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-orange-500 font-bold mt-0.5">·</span>
              <span>Display explicit reason for alert & prepare response system.</span>
            </li>
          </ul>
        </div>

        {/* LEVEL 3: ACT (Red) */}
        <div className={`p-4 rounded-xl border transition-all duration-200 ${
          responseLevel === 'ACT'
            ? 'bg-red-50/90 dark:bg-red-950/40 border-red-500 shadow-lg ring-1 ring-red-400/50 animate-pulse'
            : 'bg-slate-50/50 dark:bg-slate-950/40 border-slate-200/80 dark:border-slate-800 opacity-80'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400 flex items-center justify-center font-bold">
                <Flame className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-black text-red-700 dark:text-red-400 font-mono tracking-wide">
                  ACT · LEVEL 3
                </span>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">Critical Threat Confirmed</p>
              </div>
            </div>
            {responseLevel === 'ACT' && (
              <span className="text-[10px] font-mono font-extrabold px-2 py-0.5 rounded bg-red-600 text-white animate-pulse">
                CRITICAL
              </span>
            )}
          </div>
          <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-1.5 mt-3 pt-3 border-t border-red-200/60 dark:border-red-500/20">
            <li className="flex items-start gap-1.5">
              <span className="text-red-600 font-bold mt-0.5">·</span>
              <span>Multiple independent indicators confirm potential fire.</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-red-600 font-bold mt-0.5">·</span>
              <span>Display emergency warning and sound evacuation siren.</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-red-600 font-bold mt-0.5">·</span>
              <span>Require safety check & operator auth before suppression drill.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Safety Mandatory Disclaimer Box */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs">
        <div className="flex items-center gap-2.5 text-slate-700 dark:text-slate-300">
          <ShieldAlert className="w-4 h-4 text-orange-600 dark:text-orange-400 shrink-0" />
          <span>
            <strong>Safety Invariant:</strong> The ACT level must never automatically activate real fire suppression equipment in this prototype. All suppression actions are simulated. Plant safety personnel unconditionally retain control.
          </span>
        </div>
        {onOpenSuppressionModal && (
          <button
            onClick={onOpenSuppressionModal}
            className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-semibold whitespace-nowrap transition-colors shadow-2xs"
          >
            Launch Suppression Protocol Simulation →
          </button>
        )}
      </div>
    </section>
  );
};
