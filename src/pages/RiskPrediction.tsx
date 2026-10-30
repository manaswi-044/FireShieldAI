import React from 'react';
import {
  BrainCircuit,
  RotateCcw,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Flame,
  Thermometer,
  Wind,
  Activity,
  CheckCircle2,
  Cpu,
  Info
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import { useFireShield } from '../context/FireShieldContext';

export const RiskPrediction: React.FC = () => {
  const {
    riskScore,
    riskClassification,
    contributingFactors,
    aiExplanation,
    isAnalyzing,
    runRiskAnalysis,
    telemetryHistory,
    currentFacility,
    simulateFireEvent,
    resetSimulation,
    isFireSimulated,
    theme
  } = useFireShield();

  const getRiskColor = (score: number) => {
    if (score >= 80) return '#dc2626'; // Red
    if (score >= 60) return '#ea580c'; // Orange
    if (score >= 30) return '#ca8a04'; // Yellow
    return '#16a34a'; // Green
  };

  const getRiskBadge = (cls: string) => {
    switch (cls) {
      case 'CRITICAL':
        return 'bg-red-50 text-red-700 border-red-200 dark:bg-red-500/20 dark:text-red-400 dark:border-red-500/50';
      case 'HIGH':
        return 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-500/20 dark:text-orange-400 dark:border-orange-500/50';
      case 'MODERATE':
        return 'bg-yellow-50 text-yellow-800 border-yellow-200 dark:bg-yellow-500/20 dark:text-yellow-400 dark:border-yellow-500/50';
      default:
        return 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/50';
    }
  };

  const gridStroke = theme === 'dark' ? '#1e293b' : '#e2e8f0';
  const textStroke = theme === 'dark' ? '#64748b' : '#94a3b8';
  const tooltipBg = theme === 'dark' ? '#0f172a' : '#ffffff';
  const tooltipBorder = theme === 'dark' ? '#334155' : '#e2e8f0';
  const tooltipText = theme === 'dark' ? '#f8fafc' : '#0f172a';

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
              AI Fire Risk Prediction Engine
            </h2>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              Sensor-Fusion Model
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Facility: {currentFacility.name} · Real-time multivariate hazard probability synthesis.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={runRiskAnalysis}
            disabled={isAnalyzing}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-md ${
              isAnalyzing
                ? 'bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-400 cursor-wait'
                : 'bg-red-600 hover:bg-red-700 text-white shadow-red-500/20'
            }`}
          >
            {isAnalyzing ? (
              <>
                <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                <span>Computing Vectors...</span>
              </>
            ) : (
              <>
                <BrainCircuit className="w-4 h-4" />
                <span>Run Risk Analysis</span>
              </>
            )}
          </button>

          <button
            onClick={isFireSimulated ? resetSimulation : simulateFireEvent}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-colors shadow-2xs ${
              isFireSimulated
                ? 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200'
                : 'bg-red-50 dark:bg-red-950/60 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 hover:bg-red-100'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-orange-500" />
            <span>{isFireSimulated ? 'Reset Baseline' : 'Inject Anomaly'}</span>
          </button>
        </div>
      </div>

      {/* Model Disclaimer Callout */}
      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 flex items-start gap-3">
        <Info className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-slate-900 dark:text-slate-200 font-semibold">Demonstration Model Logic:</strong> The fire risk score is generated from deterministic demonstration logic utilizing weighted sensor fusion (pyrometry, optical obscuration, toxic vapor PPM, and flame flicker confidence). It is designed to illustrate Design Thinking concepts and is not connected to a production deep neural network.
        </p>
      </div>

      {/* Risk Gauge & AI Summary Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Score Gauge (4 Cols) */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-between text-center relative overflow-hidden shadow-xs">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-500 font-bold">
            Synthesized Fire Risk Index
          </span>

          <div className="my-6 relative flex flex-col items-center justify-center">
            {/* Outer decorative ring */}
            <div
              className="w-44 h-44 rounded-full border-8 border-slate-100 dark:border-slate-800 flex items-center justify-center relative shadow-inner"
            >
              <div
                className="w-36 h-36 rounded-full border-4 flex flex-col items-center justify-center transition-all duration-700"
                style={{
                  borderColor: getRiskColor(riskScore),
                  boxShadow: `0 0 20px ${getRiskColor(riskScore)}25`
                }}
              >
                <span className="text-5xl font-mono font-black text-slate-900 dark:text-white tracking-tight">
                  {riskScore}%
                </span>
                <span className="text-[10px] font-mono text-slate-500 uppercase mt-0.5 font-bold">
                  HAZARD SCORE
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2 w-full">
            <div className="flex items-center justify-center gap-2">
              <span className="text-xs text-slate-500 font-medium">Risk Classification:</span>
              <span className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded border ${getRiskBadge(riskClassification)}`}>
                {riskClassification}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-mono">
              Low (&lt;30%) · Mod (30-59%) · High (60-79%) · Crit (80%+)
            </p>
          </div>
        </div>

        {/* Right: AI Explanation & Contributing Factors (8 Cols) */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-6 flex flex-col justify-between space-y-5 shadow-xs">
          {/* Explanation Box */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-mono font-bold uppercase text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-orange-500" />
                AI Inference Rationale
              </span>
              <span className="text-[10px] font-mono font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200">
                Confidence: 94.2%
              </span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              "{aiExplanation}"
            </p>
          </div>

          {/* List of Contributing Factors */}
          <div>
            <h3 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
              Multi-Spectral Contributing Factors Breakdown
            </h3>

            <div className="space-y-2.5">
              {contributingFactors.map((factor, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-slate-200">{factor.name}</span>
                      <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded ${
                        factor.status === 'Critical' ? 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400' :
                        factor.status === 'Elevated' ? 'bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400' :
                        'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
                      }`}>
                        {factor.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">{factor.description}</p>
                  </div>

                  <div className="flex items-center gap-4 shrink-0 font-mono">
                    <div className="text-right">
                      <span className="text-slate-900 dark:text-slate-100 font-extrabold block">{factor.value}</span>
                      <span className="text-[10px] text-slate-400">{factor.threshold}</span>
                    </div>
                    <div className="w-16 bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${
                          factor.impactScore >= 75 ? 'bg-red-600' :
                          factor.impactScore >= 40 ? 'bg-orange-500' :
                          'bg-emerald-500'
                        }`}
                        style={{ width: `${Math.max(8, factor.impactScore)}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recharts Trends Section */}
      <div className="space-y-4">
        <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-orange-500" />
          <span>Real-Time Sensor & Risk Telemetry Curves</span>
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Chart 1: Fire Risk Trend */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 flex flex-col justify-between shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white uppercase font-mono">
                  Fire Risk Score Trend
                </span>
                <p className="text-[11px] text-slate-500">0% – 100% Bayesian aggregate</p>
              </div>
              <span className="text-xs font-mono font-bold text-orange-600">
                {riskScore}% Now
              </span>
            </div>

            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={telemetryHistory} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="riskGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={getRiskColor(riskScore)} stopOpacity={0.4} />
                      <stop offset="95%" stopColor={getRiskColor(riskScore)} stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
                  <XAxis dataKey="time" stroke={textStroke} tick={{ fontSize: 10 }} />
                  <YAxis domain={[0, 100]} stroke={textStroke} tick={{ fontSize: 10 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: tooltipBg, borderColor: tooltipBorder, borderRadius: 8, fontSize: 11, color: tooltipText }}
                    labelStyle={{ color: textStroke }}
                  />
                  <Area
                    type="monotone"
                    dataKey="riskScore"
                    stroke={getRiskColor(riskScore)}
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#riskGrad)"
                    name="Risk Score (%)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Temperature Trend Chart */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 flex flex-col justify-between shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white uppercase font-mono">
                  Temperature Gradient (°C)
                </span>
                <p className="text-[11px] text-slate-500">Thermal Pyrometer Sensor</p>
              </div>
              <span className="text-xs font-mono font-bold text-red-600">
                {telemetryHistory[telemetryHistory.length - 1]?.temperature.toFixed(1)} °C
              </span>
            </div>

            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={telemetryHistory} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
                  <XAxis dataKey="time" stroke={textStroke} tick={{ fontSize: 10 }} />
                  <YAxis domain={[15, 100]} stroke={textStroke} tick={{ fontSize: 10 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: tooltipBg, borderColor: tooltipBorder, borderRadius: 8, fontSize: 11, color: tooltipText }}
                    labelStyle={{ color: textStroke }}
                  />
                  <Line
                    type="monotone"
                    dataKey="temperature"
                    stroke="#dc2626"
                    strokeWidth={2}
                    dot={{ r: 3, fill: '#dc2626' }}
                    name="Temp (°C)"
                  />
                  <Line
                    type="monotone"
                    dataKey="baselineTemp"
                    stroke="#94a3b8"
                    strokeDasharray="4 4"
                    name="Baseline (24°C)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 3: Gas Concentration Trend Chart */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 flex flex-col justify-between shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white uppercase font-mono">
                  Gas Concentration (ppm)
                </span>
                <p className="text-[11px] text-slate-500">VOC & Carbon Monoxide</p>
              </div>
              <span className="text-xs font-mono font-bold text-yellow-600">
                {telemetryHistory[telemetryHistory.length - 1]?.gasPpm.toFixed(0)} ppm
              </span>
            </div>

            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={telemetryHistory} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gasGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ca8a04" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#ca8a04" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
                  <XAxis dataKey="time" stroke={textStroke} tick={{ fontSize: 10 }} />
                  <YAxis domain={[0, 450]} stroke={textStroke} tick={{ fontSize: 10 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: tooltipBg, borderColor: tooltipBorder, borderRadius: 8, fontSize: 11, color: tooltipText }}
                    labelStyle={{ color: textStroke }}
                  />
                  <Area
                    type="monotone"
                    dataKey="gasPpm"
                    stroke="#ca8a04"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#gasGrad)"
                    name="Gas (ppm)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
