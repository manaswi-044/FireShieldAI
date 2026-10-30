import React, { useState, useEffect } from 'react';
import {
  Bell,
  Activity,
  Flame,
  RotateCcw,
  Shield,
  ShieldAlert,
  ChevronDown,
  Clock,
  Radio,
  CheckCircle2,
  X,
  Sun,
  Moon,
  Volume2,
  VolumeX,
  Sparkles
} from 'lucide-react';
import { useFireShield, FACILITIES } from '../context/FireShieldContext';
import { FacilityId } from '../types';

interface HeaderProps {
  pageTitle: string;
  onOpenAlerts?: () => void;
  onOpenSuppressionModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  pageTitle,
  onOpenAlerts,
  onOpenSuppressionModal
}) => {
  const {
    facility,
    setFacility,
    currentFacility,
    lastUpdated,
    activeAlertsCount,
    alerts,
    simulateFireEvent,
    resetSimulation,
    isFireSimulated,
    humanOverrideActive,
    toggleHumanOverride,
    theme,
    toggleTheme,
    isAlarmMuted,
    toggleAlarmMute
  } = useFireShield();

  const [currentTime, setCurrentTime] = useState<string>('');
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [showFacilityMenu, setShowFacilityMenu] = useState<boolean>(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric'
        }) + ' · ' + now.toLocaleTimeString('en-US', { hour12: false })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="h-16 bg-white/95 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/90 dark:border-slate-800 px-6 flex items-center justify-between gap-4 shrink-0 z-20 transition-colors duration-200">
      {/* Left: Page Title & Facility Selector */}
      <div className="flex items-center gap-6">
        <div>
          <h1 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <span>{pageTitle}</span>
            {isFireSimulated && (
              <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400 border border-red-300 dark:border-red-500/40 animate-pulse">
                SIMULATED HAZARD ACTIVE
              </span>
            )}
          </h1>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span>Facility:</span>
            {/* Facility Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowFacilityMenu(!showFacilityMenu)}
                className="flex items-center gap-1.5 text-slate-800 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white font-semibold bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-700/80 transition-colors shadow-2xs"
              >
                <span>{currentFacility.name.split('–')[0].trim()}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </button>

              {showFacilityMenu && (
                <div className="absolute top-full left-0 mt-1 w-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl p-1 z-50">
                  {FACILITIES.map((fac) => (
                    <button
                      key={fac.id}
                      onClick={() => {
                        setFacility(fac.id as FacilityId);
                        setShowFacilityMenu(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors flex flex-col gap-0.5 ${
                        facility === fac.id
                          ? 'bg-red-50 text-red-700 font-bold dark:bg-red-500/10 dark:text-red-300 border border-red-200 dark:border-red-500/30'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{fac.name}</span>
                        {facility === fac.id && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 font-normal">
                        {fac.tagline}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Middle: Live Simulation Toolbar */}
      <div className="hidden lg:flex items-center gap-2 bg-slate-100/80 dark:bg-slate-950/80 p-1.5 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-2xs">
        <span className="text-[11px] font-mono uppercase text-slate-500 dark:text-slate-400 px-2 font-bold">
          Sim Controls:
        </span>

        {/* Simulate Fire Event Button */}
        <button
          onClick={simulateFireEvent}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm ${
            isFireSimulated
              ? 'bg-red-600 text-white shadow-red-500/30 ring-2 ring-red-400 animate-pulse'
              : 'bg-red-600 hover:bg-red-700 text-white shadow-xs'
          }`}
          title="Inject high temperature, smoke, and flame simulation"
        >
          <Flame className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
          <span>Simulate Fire</span>
        </button>

        {/* Reset Simulation Button */}
        <button
          onClick={resetSimulation}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700/60 shadow-2xs"
          title="Restore baseline conditions (24.2°C, 18 ppm, low risk)"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
          <span>Reset</span>
        </button>

        {/* Human Override Toggle */}
        <button
          onClick={toggleHumanOverride}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border shadow-2xs ${
            humanOverrideActive
              ? 'bg-amber-100 dark:bg-amber-950/70 border-amber-300 dark:border-amber-700/80 text-amber-900 dark:text-amber-200'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700/60 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
          }`}
          title="Toggle human safety override on fire suppression actuators"
        >
          {humanOverrideActive ? (
            <ShieldAlert className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
          ) : (
            <Shield className="w-3.5 h-3.5 text-slate-400" />
          )}
          <span>Override: {humanOverrideActive ? 'LOCKED' : 'OFF'}</span>
        </button>

        {/* Suppression Protocol Test dialog */}
        {onOpenSuppressionModal && (
          <button
            onClick={onOpenSuppressionModal}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white bg-white dark:bg-slate-900 hover:bg-slate-50 border border-slate-200 dark:border-slate-700/60 shadow-2xs"
            title="Inspect 3-level suppression safety protocol"
          >
            <Radio className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
            <span>Suppression Drill</span>
          </button>
        )}
      </div>

      {/* Right: Status Indicators & Quick Toggles */}
      <div className="flex items-center gap-3">
        {/* System Status Indicator */}
        <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-slate-950 border border-emerald-200 dark:border-slate-800">
          <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.8)] animate-pulse" />
          <span className="text-[11px] font-mono tracking-wider text-emerald-700 dark:text-emerald-400 font-bold uppercase">
            SYSTEM ONLINE
          </span>
        </div>

        {/* Live Audio chime toggle */}
        <button
          onClick={toggleAlarmMute}
          className={`p-2 rounded-lg border transition-colors shadow-2xs ${
            isAlarmMuted 
              ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700' 
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-50'
          }`}
          title={isAlarmMuted ? 'Unmute Audio Chime' : 'Mute Audio Chime'}
        >
          {isAlarmMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-emerald-600" />}
        </button>

        {/* Light / Dark Mode Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors border border-slate-200 dark:border-slate-700 shadow-2xs"
          title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
        >
          {theme === 'light' ? <Moon className="w-4 h-4 text-slate-600" /> : <Sun className="w-4 h-4 text-amber-400" />}
        </button>

        {/* Clock & Last Updated */}
        <div className="hidden xl:flex flex-col items-end text-right font-mono text-[11px] text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1 text-slate-800 dark:text-slate-300 font-semibold">
            <Clock className="w-3 h-3 text-slate-400" />
            <span>{currentTime || 'Loading...'}</span>
          </div>
          <span className="text-[10px] text-slate-400">Updated: {lastUpdated}</span>
        </div>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors border border-slate-200 dark:border-slate-700 shadow-2xs"
            aria-label="Alert Notifications"
          >
            <Bell className="w-4 h-4" />
            {activeAlertsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 text-white text-[10px] font-mono font-bold rounded-full flex items-center justify-center animate-pulse shadow-sm">
                {activeAlertsCount}
              </span>
            )}
          </button>

          {/* Notification Flyout */}
          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl overflow-hidden z-50">
              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-red-600 dark:text-orange-400" />
                  <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    Active System Notifications ({activeAlertsCount})
                  </span>
                </div>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-slate-400 hover:text-slate-700 dark:hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 p-1">
                {alerts.filter(a => a.status !== 'Resolved').length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-500 dark:text-slate-400">
                    <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-80" />
                    All clear. No active alerts across facilities.
                  </div>
                ) : (
                  alerts
                    .filter(a => a.status !== 'Resolved')
                    .map((alert) => (
                      <div
                        key={alert.id}
                        className="p-3 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors text-xs space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className={`font-mono text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            alert.riskLevel === 'CRITICAL' ? 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400 border border-red-200' :
                            alert.riskLevel === 'HIGH' ? 'bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400 border border-orange-200' :
                            'bg-yellow-100 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-400 border border-yellow-200'
                          }`}>
                            {alert.id} · {alert.riskLevel}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {alert.timestamp}
                          </span>
                        </div>
                        <p className="text-slate-800 dark:text-slate-200 font-semibold">{alert.type}</p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">{alert.location}</p>
                      </div>
                    ))
                )}
              </div>

              {onOpenAlerts && (
                <div className="p-2.5 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 text-center">
                  <button
                    onClick={() => {
                      setShowNotifications(false);
                      onOpenAlerts();
                    }}
                    className="text-xs font-bold text-red-600 dark:text-red-400 hover:underline py-1 transition-colors"
                  >
                    Open Full Alerts & Incidents Table →
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
