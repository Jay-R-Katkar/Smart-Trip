import React, { useState } from 'react';
import { 
  Bell, 
  CloudSun, 
  Users, 
  Plane, 
  AlertTriangle, 
  ShieldAlert, 
  CheckCheck, 
  RefreshCw, 
  Filter, 
  Sun, 
  CloudRain, 
  Thermometer, 
  Info,
  Clock
} from 'lucide-react';

export function AlertsPanel({ 
  currentCity = 'Paris', 
  alertsData, 
  onRefreshAlerts, 
  onMarkRead 
}) {
  const [selectedSeverity, setSelectedSeverity] = useState('all');

  const liveWeather = alertsData?.live_weather || {
    temp_c: 22,
    condition: "Partly Cloudy",
    icon: "⛅",
    rain_chance: "15%",
    uv_index: 4,
    advisory: "Comfortable weather for city walking and museum visits."
  };

  const alerts = alertsData?.alerts || [];

  const filteredAlerts = alerts.filter((a) => {
    if (selectedSeverity === 'all') return true;
    return a.severity === selectedSeverity;
  });

  const getAlertIcon = (type) => {
    switch (type) {
      case 'weather': return <CloudSun className="w-5 h-5 text-sky-500" />;
      case 'crowd': return <Users className="w-5 h-5 text-amber-500" />;
      case 'flight': return <Plane className="w-5 h-5 text-blue-500" />;
      case 'budget': return <AlertTriangle className="w-5 h-5 text-orange-500" />;
      case 'safety': return <ShieldAlert className="w-5 h-5 text-rose-500" />;
      default: return <Info className="w-5 h-5 text-emerald-500" />;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold text-xs">
            Module 4: Real-Time Intelligence
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            Smart Alerts & Live Broadcasts
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Automated notifications for weather changes, attraction congestion, flight gates, and budget pacing.
          </p>
        </div>

        <button
          onClick={onRefreshAlerts}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold border border-slate-200 dark:border-slate-700 transition-all self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Live Feeds</span>
        </button>
      </div>

      {/* LIVE WEATHER WIDGET */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-sky-600 via-cyan-700 to-slate-900 text-white p-6 sm:p-8 shadow-md">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          
          <div className="flex items-center gap-4">
            <div className="text-5xl">{liveWeather.icon}</div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-sky-200">Live Forecast for</span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-white/20">{currentCity}</span>
              </div>
              <div className="text-3xl sm:text-4xl font-black mt-1">
                {liveWeather.temp_c}°C
                <span className="text-base font-normal text-sky-200 ml-2">({liveWeather.condition})</span>
              </div>
              <p className="text-xs text-sky-100 mt-1 max-w-lg">
                {liveWeather.advisory}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 text-xs">
            <div>
              <span className="text-sky-200 text-[11px] block">🌧️ Rain Probability</span>
              <span className="font-bold text-sm">{liveWeather.rain_chance}</span>
            </div>
            <div>
              <span className="text-sky-200 text-[11px] block">☀️ UV Index</span>
              <span className="font-bold text-sm">{liveWeather.uv_index} / 10 (Moderate)</span>
            </div>
          </div>

        </div>
      </div>

      {/* Filter Tabs & Notification List */}
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
              Notification Center ({filteredAlerts.length})
            </h3>
          </div>

          {/* Severity Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {[
              { id: 'all', label: 'All Alerts' },
              { id: 'danger', label: 'Critical / SOS' },
              { id: 'warning', label: 'Warnings' },
              { id: 'info', label: 'Info' }
            ].map(pill => (
              <button
                key={pill.id}
                onClick={() => setSelectedSeverity(pill.id)}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors ${
                  selectedSeverity === pill.id
                    ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                {pill.label}
              </button>
            ))}
          </div>
        </div>

        {/* Alerts Cards List */}
        <div className="space-y-3">
          {filteredAlerts.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-500">
              No alerts found under the "{selectedSeverity}" filter.
            </div>
          ) : (
            filteredAlerts.map((alert, idx) => {
              const isDanger = alert.severity === 'danger';
              const isWarning = alert.severity === 'warning';

              return (
                <div
                  key={alert.id || idx}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    isDanger
                      ? 'bg-rose-50/80 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/60'
                      : isWarning
                      ? 'bg-amber-50/80 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/60'
                      : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-700/80'
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 shadow-sm flex-shrink-0">
                      {getAlertIcon(alert.type)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                          isDanger ? 'bg-rose-200 text-rose-800 dark:bg-rose-900 dark:text-rose-200' :
                          isWarning ? 'bg-amber-200 text-amber-800 dark:bg-amber-900 dark:text-amber-200' :
                          'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200'
                        }`}>
                          {alert.type}
                        </span>
                        <span className="text-[11px] text-slate-400 font-medium">
                          {alert.time || 'Live'}
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white mt-1">
                        {alert.title}
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">
                        {alert.message}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
                    <button
                      onClick={() => onMarkRead && onMarkRead(alert.id)}
                      className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
                    >
                      <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Dismiss</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>

    </div>
  );
}
