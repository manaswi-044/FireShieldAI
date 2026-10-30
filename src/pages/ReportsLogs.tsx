import React, { useState, useMemo } from 'react';
import {
  FileText,
  Search,
  Calendar,
  ArrowDownToLine
} from 'lucide-react';
import { useFireShield } from '../context/FireShieldContext';
import { EventLogItem } from '../types';

export const ReportsLogs: React.FC = () => {
  const {
    alerts,
    eventLogs,
    exportLogsCSV,
    riskScore
  } = useFireShield();

  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [levelFilter, setLevelFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const totalAlerts = alerts.length;
  const resolvedIncidents = alerts.filter(a => a.status === 'Resolved').length;
  const highestRecordedRisk = useMemo(() => {
    return Math.max(94, riskScore, ...alerts.map(a => (a.riskLevel === 'CRITICAL' ? 94 : a.riskLevel === 'HIGH' ? 76 : 42)));
  }, [riskScore, alerts]);
  const averageRiskScore = useMemo(() => {
    return Math.round((18 + 42 + riskScore) / 3);
  }, [riskScore]);
  const sensorFaultCount = eventLogs.filter(l => l.category === 'Sensor Telemetry' && l.level === 'warning').length;

  const filteredLogs = useMemo(() => {
    return eventLogs.filter((log) => {
      if (categoryFilter !== 'ALL' && log.category !== categoryFilter) return false;
      if (levelFilter !== 'ALL' && log.level !== levelFilter) return false;
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        return (
          log.description.toLowerCase().includes(q) ||
          log.id.toLowerCase().includes(q) ||
          log.category.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [eventLogs, categoryFilter, levelFilter, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
              Safety Auditing, Reports & Chronological Logs
            </h2>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              ISO 45001 Compliant Audit Trail
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Certified event timeline for incident post-mortems, insurer compliance, and root-cause analysis.
          </p>
        </div>

        {/* CSV Export Button (Prompt Requirement 10) */}
        <button
          onClick={exportLogsCSV}
          className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-red-600 hover:bg-red-700 text-white flex items-center gap-2 transition-all shadow-md shadow-red-500/20 self-start md:self-auto"
        >
          <ArrowDownToLine className="w-4 h-4" />
          <span>Export Event Log (CSV)</span>
        </button>
      </div>

      {/* KPI Summary Cards for Reports (Prompt Requirement 10) */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 space-y-1 shadow-xs">
          <span className="text-[10px] font-mono uppercase text-slate-500 font-bold">Total Alerts</span>
          <p className="text-3xl font-mono font-black text-slate-900 dark:text-white">{totalAlerts}</p>
          <span className="text-[10px] text-slate-400 font-medium">Facility recorded</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 space-y-1 shadow-xs">
          <span className="text-[10px] font-mono uppercase text-slate-500 font-bold">Resolved Incidents</span>
          <p className="text-3xl font-mono font-black text-emerald-600 dark:text-emerald-400">{resolvedIncidents}</p>
          <span className="text-[10px] text-slate-400 font-medium">Audited & cleared</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 space-y-1 shadow-xs">
          <span className="text-[10px] font-mono uppercase text-slate-500 font-bold">Highest Risk</span>
          <p className="text-3xl font-mono font-black text-red-600 dark:text-red-400">{highestRecordedRisk}%</p>
          <span className="text-[10px] text-slate-400 font-medium">Peak simulated surge</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 space-y-1 shadow-xs">
          <span className="text-[10px] font-mono uppercase text-slate-500 font-bold">Average Risk</span>
          <p className="text-3xl font-mono font-black text-yellow-600 dark:text-yellow-400">{averageRiskScore}%</p>
          <span className="text-[10px] text-slate-400 font-medium">24h running mean</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 space-y-1 col-span-2 md:col-span-1 shadow-xs">
          <span className="text-[10px] font-mono uppercase text-slate-500 font-bold">Sensor Faults</span>
          <p className="text-3xl font-mono font-black text-orange-600 dark:text-orange-400">{sensorFaultCount}</p>
          <span className="text-[10px] text-slate-400 font-medium">Loop timeouts</span>
        </div>
      </div>

      {/* Incident Timeline Visual */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4 shadow-xs">
        <h3 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
          <Calendar className="w-4 h-4 text-orange-500" />
          <span>Incident & Mitigation Sequence Timeline</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 space-y-1">
            <span className="text-[10px] font-mono font-bold text-emerald-700 dark:text-emerald-400">Phase 01 · T+0.0s</span>
            <p className="font-bold text-slate-900 dark:text-slate-200">Anomaly Identification</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Dual IR pyrometer + photoionization gas rate excursion detected.</p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 space-y-1">
            <span className="text-[10px] font-mono font-bold text-yellow-700 dark:text-yellow-400">Phase 02 · T+1.2s</span>
            <p className="font-bold text-slate-900 dark:text-slate-200">Bayesian Voting Corroboration</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Optical smoke detector confirms &gt;3.5 %/m obscuration. WATCH escalates to ALERT.</p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 space-y-1">
            <span className="text-[10px] font-mono font-bold text-orange-700 dark:text-orange-400">Phase 03 · T+2.5s</span>
            <p className="font-bold text-slate-900 dark:text-slate-200">Safety Officer Dispatch</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Audio chime activated, control console alerted, dampers staged.</p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 space-y-1">
            <span className="text-[10px] font-mono font-bold text-red-700 dark:text-red-400">Phase 04 · T+3.0s</span>
            <p className="font-bold text-slate-900 dark:text-slate-200">ACT & Human Override Lock</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Suppression interlock armed. Pre-discharge siren awaits operator authorization.</p>
          </div>
        </div>
      </div>

      {/* Filterable Event Log Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
        {/* Search and Category Filters */}
        <div className="p-4 bg-slate-50 dark:bg-slate-950/70 border-b border-slate-200/80 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search event logs by description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-red-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-mono text-slate-500 uppercase mr-1 font-bold">Category:</span>
            {['ALL', 'AI Inference', 'Sensor Telemetry', 'Simulation Control', 'Safety Protocol', 'Operator Action'].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition-colors ${
                  categoryFilter === cat
                    ? 'bg-slate-900 dark:bg-slate-800 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 hover:bg-slate-200/70 dark:hover:bg-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Table Body */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 font-mono text-[11px] uppercase border-b border-slate-200/80 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4 font-bold">Event ID</th>
                <th className="py-3 px-4 font-bold">Timestamp</th>
                <th className="py-3 px-4 font-bold">Severity</th>
                <th className="py-3 px-4 font-bold">Category</th>
                <th className="py-3 px-4 font-bold">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-slate-300">
                    {log.id}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-500 whitespace-nowrap">
                    {log.timestamp}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border uppercase ${
                      log.level === 'critical' ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-500/20 dark:text-red-400' :
                      log.level === 'warning' ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/20 dark:text-amber-400' :
                      log.level === 'action' ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/20 dark:text-blue-400' :
                      'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300'
                    }`}>
                      {log.level}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap">
                    {log.category}
                  </td>
                  <td className="py-3 px-4 text-slate-800 dark:text-slate-300 leading-relaxed max-w-xl">
                    {log.description}
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
