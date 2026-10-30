import React from 'react';
import {
  AlertTriangle,
  Cpu,
  Flame,
  Activity,
  ArrowUpRight,
  Video,
  ExternalLink,
  CheckCircle2,
  Thermometer,
  Wind,
  ShieldAlert,
  Clock,
  Sparkles,
  ShieldCheck,
  Radio
} from 'lucide-react';
import { useFireShield } from '../context/FireShieldContext';
import { ThreeLevelResponseCard } from '../components/ThreeLevelResponseCard';
import { NavPage } from '../components/Sidebar';
import { AlertItem } from '../types';

interface OverviewProps {
  onNavigate: (page: NavPage) => void;
  onOpenSuppressionModal: () => void;
  onSelectAlert: (alert: AlertItem) => void;
}

export const Overview: React.FC<OverviewProps> = ({
  onNavigate,
  onOpenSuppressionModal,
  onSelectAlert
}) => {
  const {
    currentFacility,
    riskScore,
    riskClassification,
    activeAlertsCount,
    onlineSensorsCount,
    totalSensorsCount,
    temperature,
    gasPpm,
    smokeObscuration,
    flameDetected,
    alerts,
    selectedCamera,
    acknowledgeAlert,
    resolveAlert,
    simulateFireEvent,
    resetSimulation,
    isFireSimulated,
    aiExplanation
  } = useFireShield();

  // SVG circular gauge math
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (riskScore / 100) * circumference;

  const getRiskColor = (score: number) => {
    if (score >= 80) return '#dc2626'; // Red
    if (score >= 60) return '#ea580c'; // Orange
    if (score >= 30) return '#ca8a04'; // Yellow
    return '#16a34a'; // Green
  };

  const getRiskBgClass = (score: number) => {
    if (score >= 80) return 'text-red-700 bg-red-50 border-red-200 dark:text-red-400 dark:bg-red-950/40 dark:border-red-500/30';
    if (score >= 60) return 'text-orange-700 bg-orange-50 border-orange-200 dark:text-orange-400 dark:bg-orange-950/40 dark:border-orange-500/30';
    if (score >= 30) return 'text-yellow-800 bg-yellow-50 border-yellow-200 dark:text-yellow-400 dark:bg-yellow-950/40 dark:border-yellow-500/30';
    return 'text-emerald-700 bg-emerald-50 border-emerald-200 dark:text-emerald-400 dark:bg-emerald-950/40 dark:border-emerald-500/30';
  };

  return (
    <div className="space-y-6">
      {/* Top Welcome & Simulation Header Banner */}
      <div className={`rounded-2xl p-5 border transition-all duration-300 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 ${
        isFireSimulated
          ? 'bg-red-50 dark:bg-red-950/30 border-red-300 dark:border-red-800 animate-hazard-strobe'
          : 'bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800'
      }`}>
        <div className="flex items-center gap-3.5">
          <div className={`p-3 rounded-xl border ${
            isFireSimulated
              ? 'bg-red-600 text-white shadow-md shadow-red-500/30 animate-pulse'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700'
          }`}>
            <Flame className="w-5 h-5 text-current" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                Industrial Safety Overview · {currentFacility.name}
              </h2>
              {isFireSimulated && (
                <span className="text-[10px] font-mono font-black uppercase px-2 py-0.5 rounded bg-red-600 text-white animate-bounce">
                  HAZARD ACTIVE
                </span>
              )}
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              Continuous multi-sensor fusion, early smoke/heat prediction, and operator safety interlocks.
            </p>
          </div>
        </div>

        {/* Quick simulation controls on mobile/overview */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={simulateFireEvent}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-sm ${
              isFireSimulated
                ? 'bg-red-600 text-white shadow-red-500/40 ring-2 ring-red-400'
                : 'bg-red-600 hover:bg-red-700 text-white'
            }`}
          >
            <Flame className="w-4 h-4 fill-white" />
            <span>Simulate Fire Event</span>
          </button>
          <button
            onClick={resetSimulation}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors shadow-2xs"
          >
            Reset
          </button>
        </div>
      </div>

      {/* 4 Prominent KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Current Fire Risk */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 flex items-center justify-between relative overflow-hidden shadow-xs hover:shadow-md transition-shadow">
          <div className="space-y-1.5">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-bold">
              Current Fire Risk
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-mono font-black text-slate-900 dark:text-white tracking-tight">
                {riskScore}%
              </span>
              <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded border ${getRiskBgClass(riskScore)}`}>
                {riskClassification}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 max-w-[170px] leading-tight">
              Prototype risk estimate from multi-sensor voting logic
            </p>
          </div>

          {/* Circular Progress Gauge */}
          <div className="relative w-22 h-22 shrink-0 flex items-center justify-center">
            <svg className="w-22 h-22 -rotate-90 transform" viewBox="0 0 90 90">
              <circle
                cx="45"
                cy="45"
                r={radius}
                className="stroke-slate-100 dark:stroke-slate-800"
                strokeWidth="7"
                fill="transparent"
              />
              <circle
                cx="45"
                cy="45"
                r={radius}
                stroke={getRiskColor(riskScore)}
                strokeWidth="7"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-700 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <Flame
                className="w-5 h-5 transition-transform duration-500"
                style={{ color: getRiskColor(riskScore) }}
              />
            </div>
          </div>
        </div>

        {/* Card 2: Active Alerts */}
        <div className={`bg-white dark:bg-slate-900 border rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow ${
          activeAlertsCount > 0 ? 'border-amber-400 dark:border-amber-500/50' : 'border-slate-200/90 dark:border-slate-800'
        }`}>
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-bold">
                Active Alerts
              </span>
              {activeAlertsCount > 0 && (
                <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping" />
              )}
            </div>
            <div className="flex items-baseline gap-2 mt-1.5">
              <span className={`text-4xl font-mono font-black tracking-tight ${
                activeAlertsCount > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-slate-900 dark:text-white'
              }`}>
                {activeAlertsCount}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Pending response</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
            {activeAlertsCount > 0 ? (
              <span className="text-amber-700 dark:text-amber-400 font-bold flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                Attention required
              </span>
            ) : (
              <span className="text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                All zones nominal
              </span>
            )}
            <button
              onClick={() => onNavigate('alerts')}
              className="text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white flex items-center gap-0.5 font-bold"
            >
              <span>View</span>
              <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Card 3: Sensors Online */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-bold">
                Sensors Online
              </span>
              <div className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${onlineSensorsCount === totalSensorsCount ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400 font-extrabold uppercase">
                  {onlineSensorsCount === totalSensorsCount ? '100% HEALTH' : 'DEGRADED'}
                </span>
              </div>
            </div>
            <div className="flex items-baseline gap-2 mt-1.5">
              <span className="text-4xl font-mono font-black text-slate-900 dark:text-white tracking-tight">
                {onlineSensorsCount}/{totalSensorsCount}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Sensors Active</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-600 dark:text-slate-400 truncate">
              {onlineSensorsCount === totalSensorsCount
                ? 'All telemetry loops verified'
                : `${totalSensorsCount - onlineSensorsCount} sensor faulted`}
            </span>
            <button
              onClick={() => onNavigate('sensors')}
              className="text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white flex items-center gap-0.5 font-bold shrink-0"
            >
              <span>Inspect</span>
              <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Card 4: Incidents Today */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-bold">
                Incidents Today
              </span>
              <Activity className="w-4 h-4 text-slate-400" />
            </div>
            <div className="flex items-baseline gap-2 mt-1.5">
              <span className="text-4xl font-mono font-black text-slate-900 dark:text-white tracking-tight">
                {alerts.length}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Recorded events</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1 font-mono">
              <span className="text-emerald-700 dark:text-emerald-400 font-bold">100%</span> audit trail
            </span>
            <button
              onClick={() => onNavigate('reports')}
              className="text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white flex items-center gap-0.5 font-bold"
            >
              <span>Logs</span>
              <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Three-Level Response System */}
      <ThreeLevelResponseCard onOpenSuppressionModal={onOpenSuppressionModal} />

      {/* Central Split: Live Visual & Sensor Telemetry Hub */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: CCTV Monitoring Snapshot (5 Cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs flex flex-col justify-between">
          <div className="p-4 bg-slate-50 dark:bg-slate-950/80 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Video className="w-4 h-4 text-red-600 dark:text-red-400" />
              <span className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider font-mono">
                {selectedCamera.id} · {selectedCamera.name.split('–')[1]?.trim() || selectedCamera.name}
              </span>
            </div>
            <button
              onClick={() => onNavigate('live-monitoring')}
              className="text-xs text-red-600 dark:text-red-400 hover:underline font-bold flex items-center gap-1"
            >
              <span>Live Console</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>

          {/* CCTV Feed Frame */}
          <div className="relative aspect-video bg-black overflow-hidden group">
            <img
              src={selectedCamera.imageSrc}
              alt="Industrial Camera Surveillance Feed"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

            {/* Simulated Fire Flame Box if active */}
            {flameDetected && (
              <div className="absolute top-1/3 left-1/3 w-36 h-36 border-2 border-red-500 bg-red-500/20 rounded shadow-[0_0_20px_rgba(239,68,68,0.6)] animate-pulse flex flex-col items-center justify-center">
                <span className="text-[10px] font-mono font-black bg-red-600 text-white px-2 py-0.5 rounded shadow">
                  FIRE DETECTED [96.4%]
                </span>
                <span className="text-[10px] font-mono text-white mt-1 bg-black/60 px-1 rounded">
                  Flicker 14Hz
                </span>
              </div>
            )}

            {/* CCTV Overlay details */}
            <div className="absolute top-3 left-3 flex items-center gap-2 text-[10px] font-mono text-red-400 bg-black/70 px-2.5 py-1 rounded-md backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              <span>REC</span>
              <span className="text-slate-300">· {selectedCamera.resolution}</span>
            </div>

            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[10px] font-mono text-slate-200 bg-black/75 px-3 py-1.5 rounded-md backdrop-blur-sm">
              <span>{currentFacility.name.split('–')[0].trim()}</span>
              <span className={flameDetected ? 'text-red-400 font-bold' : 'text-emerald-400'}>
                {flameDetected ? 'HAZARD: FLAME ACTIVE' : 'SURVEILLANCE SECURE'}
              </span>
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-200/80 dark:border-slate-800 text-xs flex items-center justify-between text-slate-500">
            <span>Camera Stream Link:</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-mono font-bold">CONNECTED (30 FPS)</span>
          </div>
        </div>

        {/* Right: Live Telemetry Cluster & AI Diagnosis (7 Cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 sm:p-6 flex flex-col justify-between space-y-4 shadow-xs">
          <div>
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-200/80 dark:border-slate-800">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                  Real-Time Multi-Spectral Sensor Matrix
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Continuous voting inputs feeding the FireShield AI threat engine.
                </p>
              </div>
              <button
                onClick={() => onNavigate('risk-prediction')}
                className="text-xs text-red-600 dark:text-red-400 hover:underline font-bold flex items-center gap-1"
              >
                <span>Full Trends</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* 4 Sensor Metric Tiles */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
              {/* Temperature */}
              <div className={`p-3.5 rounded-xl border flex flex-col justify-between transition-all ${
                temperature >= 60 
                  ? 'bg-red-50 border-red-300 dark:bg-red-950/40 dark:border-red-500/60' 
                  : 'bg-slate-50/80 dark:bg-slate-950 border-slate-200/80 dark:border-slate-800'
              }`}>
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-[10px] font-mono uppercase font-bold">Pyrometer</span>
                  <Thermometer className={`w-4 h-4 ${temperature >= 60 ? 'text-red-600' : 'text-slate-400'}`} />
                </div>
                <div className="my-2">
                  <span className={`text-2xl font-black font-mono ${temperature >= 60 ? 'text-red-600 dark:text-red-400' : 'text-slate-900 dark:text-white'}`}>
                    {temperature.toFixed(1)}
                  </span>
                  <span className="text-xs text-slate-500 ml-1 font-bold">°C</span>
                </div>
                <span className="text-[10px] text-slate-500 font-mono">
                  Safe: &lt; 45°C
                </span>
              </div>

              {/* Gas VOC */}
              <div className={`p-3.5 rounded-xl border flex flex-col justify-between transition-all ${
                gasPpm >= 150 
                  ? 'bg-orange-50 border-orange-300 dark:bg-orange-950/40 dark:border-orange-500/60' 
                  : 'bg-slate-50/80 dark:bg-slate-950 border-slate-200/80 dark:border-slate-800'
              }`}>
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-[10px] font-mono uppercase font-bold">VOC / CO</span>
                  <Wind className={`w-4 h-4 ${gasPpm >= 150 ? 'text-orange-600' : 'text-slate-400'}`} />
                </div>
                <div className="my-2">
                  <span className={`text-2xl font-black font-mono ${gasPpm >= 150 ? 'text-orange-600 dark:text-orange-400' : 'text-slate-900 dark:text-white'}`}>
                    {gasPpm.toFixed(0)}
                  </span>
                  <span className="text-xs text-slate-500 ml-1 font-bold">ppm</span>
                </div>
                <span className="text-[10px] text-slate-500 font-mono">
                  Safe: &lt; 80 ppm
                </span>
              </div>

              {/* Smoke Obscuration */}
              <div className={`p-3.5 rounded-xl border flex flex-col justify-between transition-all ${
                smokeObscuration >= 5 
                  ? 'bg-red-50 border-red-300 dark:bg-red-950/40 dark:border-red-500/60' 
                  : 'bg-slate-50/80 dark:bg-slate-950 border-slate-200/80 dark:border-slate-800'
              }`}>
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-[10px] font-mono uppercase font-bold">Smoke Obs.</span>
                  <Activity className={`w-4 h-4 ${smokeObscuration >= 5 ? 'text-red-600' : 'text-slate-400'}`} />
                </div>
                <div className="my-2">
                  <span className={`text-2xl font-black font-mono ${smokeObscuration >= 5 ? 'text-red-600 dark:text-red-400' : 'text-slate-900 dark:text-white'}`}>
                    {smokeObscuration.toFixed(2)}
                  </span>
                  <span className="text-xs text-slate-500 ml-1 font-bold">%/m</span>
                </div>
                <span className="text-[10px] text-slate-500 font-mono">
                  Safe: &lt; 1.5 %/m
                </span>
              </div>

              {/* Optical Flame */}
              <div className={`p-3.5 rounded-xl border flex flex-col justify-between transition-all ${
                flameDetected 
                  ? 'bg-red-50 border-red-400 dark:bg-red-950 dark:border-red-500' 
                  : 'bg-slate-50/80 dark:bg-slate-950 border-slate-200/80 dark:border-slate-800'
              }`}>
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-[10px] font-mono uppercase font-bold">Flame AI</span>
                  <Flame className={`w-4 h-4 ${flameDetected ? 'text-red-600' : 'text-slate-400'}`} />
                </div>
                <div className="my-2">
                  <span className={`text-sm font-black font-mono ${flameDetected ? 'text-red-600 dark:text-red-400 animate-pulse' : 'text-emerald-700 dark:text-emerald-400'}`}>
                    {flameDetected ? 'FLAME CONFIRMED' : 'CLEAR'}
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 font-mono">
                  Dual IR/UV Flicker
                </span>
              </div>
            </div>
          </div>

          {/* AI Decision Explanation Box */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-mono uppercase font-extrabold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-orange-500" />
                AI Inference Assessment
              </span>
              <span className="text-slate-500 font-mono text-[10px]">Model: Sensor-Fusion v2.4</span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              "{aiExplanation}"
            </p>
          </div>
        </div>
      </div>

      {/* Recent Alerts Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
        <div className="p-4 bg-slate-50 dark:bg-slate-950/60 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Recent Alerts & Security Events ({alerts.length})
            </h3>
          </div>
          <button
            onClick={() => onNavigate('alerts')}
            className="text-xs text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white flex items-center gap-1 font-bold"
          >
            <span>View All in Alerts Center</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-950/80 text-slate-500 font-mono text-[11px] uppercase border-b border-slate-200/80 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4 font-bold">Alert ID</th>
                <th className="py-3 px-4 font-bold">Timestamp</th>
                <th className="py-3 px-4 font-bold">Location</th>
                <th className="py-3 px-4 font-bold">Alert Description</th>
                <th className="py-3 px-4 font-bold">Risk Level</th>
                <th className="py-3 px-4 font-bold">Status</th>
                <th className="py-3 px-4 text-right font-bold">Quick Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {alerts.slice(0, 4).map((alert) => (
                <tr key={alert.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-slate-200">
                    {alert.id}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-500">
                    {alert.timestamp}
                  </td>
                  <td className="py-3 px-4 text-slate-700 dark:text-slate-300 max-w-[200px] truncate">
                    {alert.location}
                  </td>
                  <td className="py-3 px-4 text-slate-900 dark:text-slate-200 font-semibold">
                    {alert.type}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
                      alert.riskLevel === 'CRITICAL' ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-500/20 dark:text-red-400 dark:border-red-500/40' :
                      alert.riskLevel === 'HIGH' ? 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-500/20 dark:text-orange-400 dark:border-orange-500/40' :
                      alert.riskLevel === 'MODERATE' ? 'bg-yellow-50 text-yellow-800 border-yellow-200 dark:bg-yellow-500/20 dark:text-yellow-400 dark:border-yellow-500/40' :
                      'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/40'
                    }`}>
                      {alert.riskLevel}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`text-[11px] font-mono font-bold ${
                      alert.status === 'Active' ? 'text-red-600 dark:text-red-400 animate-pulse' :
                      alert.status === 'Acknowledged' ? 'text-yellow-700 dark:text-yellow-400' :
                      'text-emerald-700 dark:text-emerald-400'
                    }`}>
                      {alert.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onSelectAlert(alert)}
                        className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-[11px] font-semibold transition-colors"
                      >
                        Details
                      </button>
                      {alert.status === 'Active' && (
                        <button
                          onClick={() => acknowledgeAlert(alert.id)}
                          className="px-2.5 py-1 rounded-md bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-[11px] transition-colors shadow-2xs"
                        >
                          Ack
                        </button>
                      )}
                      {alert.status !== 'Resolved' && (
                        <button
                          onClick={() => resolveAlert(alert.id)}
                          className="px-2.5 py-1 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] transition-colors shadow-2xs"
                        >
                          Resolve
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
