import React, { useState } from 'react';
import { FireShieldProvider, useFireShield } from './context/FireShieldContext';
import { Sidebar, NavPage } from './components/Sidebar';
import { Header } from './components/Header';
import { Overview } from './pages/Overview';
import { LiveMonitoring } from './pages/LiveMonitoring';
import { RiskPrediction } from './pages/RiskPrediction';
import { AlertsIncidents } from './pages/AlertsIncidents';
import { SensorHealth } from './pages/SensorHealth';
import { ReportsLogs } from './pages/ReportsLogs';
import { Settings } from './pages/Settings';
import { SuppressionModal } from './components/SuppressionModal';
import { AlertDetailsModal } from './components/AlertDetailsModal';
import { AlertItem } from './types';
import { Menu, X } from 'lucide-react';

const MainLayout: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<NavPage>('overview');
  const [selectedAlert, setSelectedAlert] = useState<AlertItem | null>(null);
  const [isSuppressionModalOpen, setIsSuppressionModalOpen] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  const { acknowledgeAlert, resolveAlert } = useFireShield();

  const getPageTitle = (page: NavPage): string => {
    switch (page) {
      case 'overview':
        return 'Industrial Safety Overview';
      case 'live-monitoring':
        return 'Live CCTV & Sensor Feeds';
      case 'risk-prediction':
        return 'AI Risk Prediction Engine';
      case 'alerts':
        return 'Alerts & Incident Response';
      case 'sensors':
        return 'Sensor Network Diagnostics';
      case 'reports':
        return 'Safety Audits & Incident Logs';
      case 'settings':
        return 'System Configuration';
    }
  };

  return (
    <div className="flex h-screen w-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-hidden font-sans transition-colors duration-200">
      {/* Desktop Fixed Sidebar */}
      <div className="hidden md:flex h-full shadow-sm z-30">
        <Sidebar
          currentPage={currentPage}
          onSelectPage={(page) => setCurrentPage(page)}
        />
      </div>

      {/* Mobile Drawer Backdrop */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-xs z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <div
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-transform duration-300 md:hidden shadow-2xl ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
          <span className="font-extrabold text-slate-900 dark:text-white text-sm">FireShield AI Menu</span>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-1 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <Sidebar
          currentPage={currentPage}
          onSelectPage={(page) => {
            setCurrentPage(page);
            setIsMobileMenuOpen(false);
          }}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Header */}
        <div className="flex items-center w-full">
          {/* Mobile hamburger button */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="md:hidden p-3.5 bg-white dark:bg-slate-900 border-b border-r border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900"
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div className="flex-1 min-w-0">
            <Header
              pageTitle={getPageTitle(currentPage)}
              onOpenAlerts={() => setCurrentPage('alerts')}
              onOpenSuppressionModal={() => setIsSuppressionModalOpen(true)}
            />
          </div>
        </div>

        {/* Scrollable Viewport with technical grid motif */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 bg-slate-50/70 dark:bg-slate-950/70 bg-tech-grid">
          {currentPage === 'overview' && (
            <Overview
              onNavigate={(page) => setCurrentPage(page)}
              onOpenSuppressionModal={() => setIsSuppressionModalOpen(true)}
              onSelectAlert={(alert) => setSelectedAlert(alert)}
            />
          )}

          {currentPage === 'live-monitoring' && <LiveMonitoring />}

          {currentPage === 'risk-prediction' && <RiskPrediction />}

          {currentPage === 'alerts' && (
            <AlertsIncidents
              onSelectAlert={(alert) => setSelectedAlert(alert)}
            />
          )}

          {currentPage === 'sensors' && <SensorHealth />}

          {currentPage === 'reports' && <ReportsLogs />}

          {currentPage === 'settings' && <Settings />}
        </main>
      </div>

      {/* Modals */}
      <SuppressionModal
        isOpen={isSuppressionModalOpen}
        onClose={() => setIsSuppressionModalOpen(false)}
      />

      <AlertDetailsModal
        alert={selectedAlert}
        onClose={() => setSelectedAlert(null)}
        onAcknowledge={(id) => acknowledgeAlert(id)}
        onResolve={(id) => resolveAlert(id)}
      />
    </div>
  );
};

export default function App() {
  return (
    <FireShieldProvider>
      <MainLayout />
    </FireShieldProvider>
  );
}
