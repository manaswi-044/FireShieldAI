import React, { useState, useMemo } from 'react';
import {
  AlertTriangle,
  Search,
  CheckCircle2,
  Eye,
  Flame
} from 'lucide-react';
import { useFireShield } from '../context/FireShieldContext';
import { AlertItem } from '../types';

interface AlertsIncidentsProps {
  onSelectAlert: (alert: AlertItem) => void;
}

export const AlertsIncidents: React.FC<AlertsIncidentsProps> = ({ onSelectAlert }) => {
  const {
    alerts,
    acknowledgeAlert,
    resolveAlert,
    simulateFireEvent
  } = useFireShield();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedRiskFilter, setSelectedRiskFilter] = useState<string>('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('ALL');

  const filteredAlerts = useMemo(() => {
    return alerts.filter((alert) => {
      if (selectedRiskFilter !== 'ALL' && alert.riskLevel !== selectedRiskFilter) {
        return false;
      }
      if (selectedStatusFilter !== 'ALL' && alert.status !== selectedStatusFilter) {
        return false;
      }
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchesId = alert.id.toLowerCase().includes(q);
        const matchesLoc = alert.location.toLowerCase().includes(q);
        const matchesType = alert.type.toLowerCase().includes(q);
        const matchesTrig = alert.triggeringFactors.some((f) => f.toLowerCase().includes(q));
        return matchesId || matchesLoc || matchesType || matchesTrig;
      }
      return true;
    });
  }, [alerts, selectedRiskFilter, selectedStatusFilter, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
              Alerts & Incident Management Console
            </h2>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              Total Recorded: {alerts.length}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Auditable log of automated threat detections, operator acknowledgments, and resolution records.
          </p>
        </div>

        {/* Quick Simulation Trigger */}
        <div className="flex items-center gap-2">
          <button
            onClick={simulateFireEvent}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white shadow-sm flex items-center gap-1.5 transition-colors"
          >
            <Flame className="w-4 h-4 fill-white" />
            <span>Simulate New Alert</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 space-y-3 shadow-xs">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by ID, zone, keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-red-500"
            />
          </div>

          {/* Risk Level Filter Chips */}
          <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            <span className="text-[11px] font-mono text-slate-500 uppercase mr-1 font-bold">Risk:</span>
            {['ALL', 'CRITICAL', 'HIGH', 'MODERATE', 'LOW'].map((risk) => (
              <button
                key={risk}
                onClick={() => setSelectedRiskFilter(risk)}
                className={`px-2.5 py-1 text-[11px] font-mono font-bold rounded-lg transition-colors whitespace-nowrap ${
                  selectedRiskFilter === risk
                    ? 'bg-slate-900 dark:bg-slate-800 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800/50'
                }`}
              >
                {risk}
              </button>
            ))}
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            <span className="text-[11px] font-mono text-slate-500 uppercase mr-1 font-bold">Status:</span>
            {['ALL', 'Active', 'Acknowledged', 'Resolved'].map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStatusFilter(st)}
                className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-colors whitespace-nowrap ${
                  selectedStatusFilter === st
                    ? 'bg-slate-900 dark:bg-slate-800 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800/50'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Alerts Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 font-mono text-[11px] uppercase border-b border-slate-200/80 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4 font-bold">Alert ID</th>
                <th className="py-3 px-4 font-bold">Time</th>
                <th className="py-3 px-4 font-bold">Location</th>
                <th className="py-3 px-4 font-bold">Alert Type</th>
                <th className="py-3 px-4 font-bold">Risk Level</th>
                <th className="py-3 px-4 font-bold">Triggering Factors</th>
                <th className="py-3 px-4 font-bold">Status</th>
                <th className="py-3 px-4 text-right font-bold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredAlerts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <CheckCircle2 className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    No alerts matching current filters.
                  </td>
                </tr>
              ) : (
                filteredAlerts.map((alert) => (
                  <tr key={alert.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    {/* ID */}
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-slate-200">
                      {alert.id}
                    </td>

                    {/* Time */}
                    <td className="py-3.5 px-4 font-mono text-slate-500 whitespace-nowrap">
                      {alert.timestamp}
                    </td>

                    {/* Location */}
                    <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300 font-medium">
                      {alert.location}
                    </td>

                    {/* Alert Type */}
                    <td className="py-3.5 px-4 text-slate-900 dark:text-slate-100 font-bold max-w-[220px]">
                      {alert.type}
                    </td>

                    {/* Risk Level */}
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border whitespace-nowrap ${
                        alert.riskLevel === 'CRITICAL' ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-500/20 dark:text-red-400 animate-pulse' :
                        alert.riskLevel === 'HIGH' ? 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-500/20 dark:text-orange-400' :
                        alert.riskLevel === 'MODERATE' ? 'bg-yellow-50 text-yellow-800 border-yellow-200 dark:bg-yellow-500/20 dark:text-yellow-400' :
                        'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-400'
                      }`}>
                        {alert.riskLevel}
                      </span>
                    </td>

                    {/* Triggering Factors */}
                    <td className="py-3.5 px-4 max-w-[280px]">
                      <div className="flex flex-wrap gap-1">
                        {alert.triggeringFactors.map((f, i) => (
                          <span
                            key={i}
                            className="text-[10px] bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-slate-300 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-800 truncate"
                          >
                            {f}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded ${
                        alert.status === 'Active' ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400 animate-pulse' :
                        alert.status === 'Acknowledged' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-400' :
                        'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400'
                      }`}>
                        {alert.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5 whitespace-nowrap">
                        <button
                          onClick={() => onSelectAlert(alert)}
                          className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-slate-700 transition-colors flex items-center gap-1"
                        >
                          <Eye className="w-3 h-3 text-slate-500" />
                          <span>Details</span>
                        </button>

                        {alert.status === 'Active' && (
                          <button
                            onClick={() => acknowledgeAlert(alert.id)}
                            className="px-2.5 py-1 rounded-md bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs transition-colors shadow-2xs"
                          >
                            Ack
                          </button>
                        )}

                        {alert.status !== 'Resolved' && (
                          <button
                            onClick={() => resolveAlert(alert.id)}
                            className="px-2.5 py-1 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors shadow-2xs"
                          >
                            Resolve
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
