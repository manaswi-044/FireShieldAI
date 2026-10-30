import React, { useState } from 'react';
import {
  Sliders,
  Thermometer,
  Wind,
  Activity,
  Shield,
  Save,
  CheckCircle2,
  RotateCcw,
  UserCheck
} from 'lucide-react';
import { useFireShield } from '../context/FireShieldContext';

export const Settings: React.FC = () => {
  const { settings, updateSettings } = useFireShield();

  const [tempWarning, setTempWarning] = useState<number>(settings.tempWarningThreshold);
  const [gasWarning, setGasWarning] = useState<number>(settings.gasWarningThreshold);
  const [smokeWarning, setSmokeWarning] = useState<number>(settings.smokeWarningThreshold);
  const [suppressionDelay, setSuppressionDelay] = useState<number>(settings.suppressionDelaySeconds);
  const [officerEmail, setOfficerEmail] = useState<string>(settings.safetyOfficerEmail);
  const [officerPhone, setOfficerPhone] = useState<string>(settings.safetyOfficerPhone);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      tempWarningThreshold: tempWarning,
      gasWarningThreshold: gasWarning,
      smokeWarningThreshold: smokeWarning,
      suppressionDelaySeconds: suppressionDelay,
      safetyOfficerEmail: officerEmail,
      safetyOfficerPhone: officerPhone
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleResetDefaults = () => {
    setTempWarning(45.0);
    setGasWarning(80.0);
    setSmokeWarning(3.5);
    setSuppressionDelay(30);
    setOfficerEmail('j.henderson@industrial-facility.net');
    setOfficerPhone('+1 (555) 019-3829');
    updateSettings({
      tempWarningThreshold: 45.0,
      gasWarningThreshold: 80.0,
      smokeWarningThreshold: 3.5,
      suppressionDelaySeconds: 30,
      safetyOfficerEmail: 'j.henderson@industrial-facility.net',
      safetyOfficerPhone: '+1 (555) 019-3829'
    });
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Top Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
              System Settings & Threshold Tuning
            </h2>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              Console Config
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Configure industrial hazard alarm trip-points, notification rosters, and suppression interlocks.
          </p>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-600/80 text-emerald-800 dark:text-emerald-300 text-xs font-bold animate-in fade-in shadow-2xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Settings Saved Successfully</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Sensor Trip Thresholds */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4 shadow-xs">
          <div className="flex items-center gap-2 pb-3.5 border-b border-slate-200/80 dark:border-slate-800">
            <Sliders className="w-4 h-4 text-red-600" />
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
              Hazard Trip-Point Thresholds
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
            {/* Temp Threshold */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-400 font-mono text-[11px] uppercase font-bold flex items-center gap-1.5">
                  <Thermometer className="w-3.5 h-3.5 text-red-600" />
                  Thermal Trip
                </span>
                <span className="text-slate-900 dark:text-white font-mono font-black">{tempWarning} °C</span>
              </div>
              <input
                type="range"
                min="30"
                max="80"
                step="1"
                value={tempWarning}
                onChange={(e) => setTempWarning(Number(e.target.value))}
                className="w-full accent-red-600 cursor-pointer"
              />
              <p className="text-[10px] text-slate-500">
                Temperature exceeding this point triggers automated WATCH / ALERT status.
              </p>
            </div>

            {/* Gas Threshold */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-400 font-mono text-[11px] uppercase font-bold flex items-center gap-1.5">
                  <Wind className="w-3.5 h-3.5 text-yellow-600" />
                  Toxic/VOC Gas Trip
                </span>
                <span className="text-slate-900 dark:text-white font-mono font-black">{gasWarning} ppm</span>
              </div>
              <input
                type="range"
                min="30"
                max="200"
                step="5"
                value={gasWarning}
                onChange={(e) => setGasWarning(Number(e.target.value))}
                className="w-full accent-yellow-600 cursor-pointer"
              />
              <p className="text-[10px] text-slate-500">
                PPM spike threshold before air scrubbers and isolation valves prep.
              </p>
            </div>

            {/* Smoke Threshold */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-400 font-mono text-[11px] uppercase font-bold flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-slate-500" />
                  Smoke Density
                </span>
                <span className="text-slate-900 dark:text-white font-mono font-black">{smokeWarning} %/m</span>
              </div>
              <input
                type="range"
                min="1.0"
                max="10.0"
                step="0.5"
                value={smokeWarning}
                onChange={(e) => setSmokeWarning(Number(e.target.value))}
                className="w-full accent-slate-600 cursor-pointer"
              />
              <p className="text-[10px] text-slate-500">
                Optical density threshold indicating particulate accumulation.
              </p>
            </div>
          </div>
        </div>

        {/* Safety Suppression Protocol Timing */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4 shadow-xs">
          <div className="flex items-center gap-2 pb-3.5 border-b border-slate-200/80 dark:border-slate-800">
            <Shield className="w-4 h-4 text-orange-600" />
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
              Suppression Interlock & Timing Parameters
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-400 font-mono text-[11px] uppercase font-bold">
                  Pre-Discharge Warning Siren Countdown
                </span>
                <span className="text-slate-900 dark:text-white font-mono font-black">{suppressionDelay} Seconds</span>
              </div>
              <input
                type="range"
                min="10"
                max="60"
                step="5"
                value={suppressionDelay}
                onChange={(e) => setSuppressionDelay(Number(e.target.value))}
                className="w-full accent-orange-600 cursor-pointer"
              />
              <p className="text-[10px] text-slate-500">
                Safety delay permitting room evacuation before clean agent discharge simulation.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between">
              <div>
                <span className="text-slate-600 dark:text-slate-400 font-mono text-[11px] uppercase font-bold">
                  Suppressant Medium Configuration
                </span>
                <p className="text-slate-900 dark:text-white font-bold mt-1 text-sm">Clean Agent: Novec 1230 / FK-5-1-12</p>
                <p className="text-[10px] text-slate-500 mt-1">
                  Non-conductive, electrically safe for sensitive server and switchgear equipment.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Safety Officer On-Duty Contacts */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4 shadow-xs">
          <div className="flex items-center gap-2 pb-3.5 border-b border-slate-200/80 dark:border-slate-800">
            <UserCheck className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
              On-Duty Safety Personnel Notification Roster
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-600 dark:text-slate-400 font-mono text-[11px] uppercase font-bold mb-1">
                Designated Safety Marshal Email
              </label>
              <input
                type="email"
                value={officerEmail}
                onChange={(e) => setOfficerEmail(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white font-medium focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-slate-600 dark:text-slate-400 font-mono text-[11px] uppercase font-bold mb-1">
                Control-Room Emergency Line (SMS & Automated Dial)
              </label>
              <input
                type="text"
                value={officerPhone}
                onChange={(e) => setOfficerPhone(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white font-medium focus:outline-none focus:border-red-500"
              />
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Factory Defaults</span>
          </button>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md shadow-red-500/20 transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Save Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
};
