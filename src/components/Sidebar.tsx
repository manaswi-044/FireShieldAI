import React from 'react';
import {
  LayoutDashboard,
  Video,
  BrainCircuit,
  AlertTriangle,
  Cpu,
  FileText,
  Sliders,
  ShieldCheck,
  ShieldAlert,
  Flame,
  Info,
  Radio,
  ExternalLink
} from 'lucide-react';
import { useFireShield } from '../context/FireShieldContext';

export type NavPage = 
  | 'overview' 
  | 'live-monitoring' 
  | 'risk-prediction' 
  | 'alerts' 
  | 'sensors' 
  | 'reports' 
  | 'settings';

interface SidebarProps {
  currentPage: NavPage;
  onSelectPage: (page: NavPage) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPage, onSelectPage }) => {
  const { activeAlertsCount, humanOverrideActive, riskClassification, isFireSimulated } = useFireShield();

  const navItems: { id: NavPage; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'live-monitoring', label: 'Live Monitoring', icon: <Video className="w-4 h-4" /> },
    { id: 'risk-prediction', label: 'Risk Prediction', icon: <BrainCircuit className="w-4 h-4" /> },
    { 
      id: 'alerts', 
      label: 'Alerts & Incidents', 
      icon: <AlertTriangle className="w-4 h-4" />,
      badge: activeAlertsCount > 0 ? activeAlertsCount : undefined
    },
    { id: 'sensors', label: 'Sensor Health', icon: <Cpu className="w-4 h-4" /> },
    { id: 'reports', label: 'Reports & Logs', icon: <FileText className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings', icon: <Sliders className="w-4 h-4" /> }
  ];

  return (
    <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200/90 dark:border-slate-800 flex flex-col justify-between shrink-0 select-none transition-colors duration-200">
      {/* Brand Header */}
      <div>
        <div className="min-h-[68px] px-5 py-3 border-b border-slate-200/90 dark:border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 via-orange-500 to-amber-500 p-0.5 shadow-md shadow-red-500/20">
            <div className="w-full h-full bg-white dark:bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Flame className="w-5 h-5 text-red-600 dark:text-orange-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white">
                FireShield<span className="text-red-600">.AI</span>
              </span>
              <span className="text-[10px] font-mono font-bold uppercase px-1.5 py-0.5 rounded bg-red-100 text-red-700 dark:bg-red-950/80 dark:text-red-400 border border-red-200 dark:border-red-800/60">
                PROTOTYPE
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate">
              Industrial Safety Matrix
            </p>
          </div>
        </div>

        {/* Demo Mode Notice */}
        <div className="mx-4 mt-3 px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950/70 border border-slate-200/80 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400 flex items-start gap-2 shadow-xs">
          <Info className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400 shrink-0 mt-0.5" />
          <span>
            <strong className="text-slate-800 dark:text-slate-200 font-semibold">Demo Mode:</strong> All sensors & AI models simulated for Design Thinking review.
          </span>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1 mt-2">
          {navItems.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectPage(item.id)}
                className={`w-full relative flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
                  isActive
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs border border-slate-200 dark:border-slate-700'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
              >
                {/* Active Left Accent Line */}
                {isActive && (
                  <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-red-600 rounded-r" />
                )}

                <div className="flex items-center gap-3">
                  <span className={isActive ? 'text-red-600 dark:text-red-400' : 'text-slate-400 dark:text-slate-500'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>

                {item.badge !== undefined && (
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-red-600 text-white animate-pulse shadow-xs">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer / Safety Override Status */}
      <div className="p-4 border-t border-slate-200/90 dark:border-slate-800 space-y-3 bg-slate-50/50 dark:bg-transparent">
        {/* Human Override Status indicator */}
        <div className={`p-2.5 rounded-xl border text-xs flex items-center gap-2.5 transition-colors ${
          humanOverrideActive 
            ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800/80 text-amber-900 dark:text-amber-300'
            : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 shadow-xs'
        }`}>
          {humanOverrideActive ? (
            <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
          ) : (
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          )}
          <div className="min-w-0">
            <p className="font-bold text-[11px] truncate text-slate-900 dark:text-slate-200">
              {humanOverrideActive ? 'Human Override ACTIVE' : 'Safety Interlock Ready'}
            </p>
            <p className="text-[10px] text-slate-500 truncate">
              {humanOverrideActive ? 'Suppression release blocked' : 'Operator auth required'}
            </p>
          </div>
        </div>

        {/* System Risk State Badge */}
        <div className="flex items-center justify-between px-2 text-[11px] text-slate-500">
          <span className="font-medium">Facility Risk Level:</span>
          <span className={`font-mono font-bold px-2 py-0.5 rounded text-[10px] ${
            riskClassification === 'CRITICAL' ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400' :
            riskClassification === 'HIGH' ? 'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-400' :
            riskClassification === 'MODERATE' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-400' :
            'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400'
          }`}>
            {riskClassification}
          </span>
        </div>

        <div className="text-[10px] text-slate-400 dark:text-slate-500 text-center pt-1 border-t border-slate-200/60 dark:border-slate-800/50">
          Design Thinking Project · Safety Capstone
        </div>
      </div>
    </aside>
  );
};
