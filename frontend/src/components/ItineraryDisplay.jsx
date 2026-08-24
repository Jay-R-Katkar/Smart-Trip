import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  DollarSign, 
  MapPin, 
  Navigation, 
  Printer, 
  Bookmark, 
  Share2, 
  Sparkles, 
  Users, 
  ShieldCheck, 
  ChevronRight,
  TrendingDown,
  Info,
  Car,
  AlertCircle
} from 'lucide-react';

export function ItineraryDisplay({ 
  itineraryData, 
  onSaveTrip, 
  onNavigateToTab, 
  onAddExpenseFromItinerary 
}) {
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [isSaved, setIsSaved] = useState(false);

  if (!itineraryData || !itineraryData.days_plan || itineraryData.days_plan.length === 0) {
    return null;
  }

  const { destination, days, total_budget, summary, days_plan, travel_style } = itineraryData;
  const currentDay = days_plan[selectedDayIndex] || days_plan[0];

  const handlePrint = () => {
    window.print();
  };

  const handleSave = () => {
    setIsSaved(true);
    if (onSaveTrip) {
      onSaveTrip(itineraryData);
    }
  };

  const getCrowdBadge = (level) => {
    const l = (level || '').toLowerCase();
    if (l.includes('high') || l.includes('peak')) {
      return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800">High Crowd</span>;
    }
    if (l.includes('mod')) {
      return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800">Moderate Crowd</span>;
    }
    return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">Low Crowd</span>;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 itinerary-print-container">
      
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold text-xs">
              {days} Days in {destination}
            </span>
            <span className="text-xs text-slate-400 font-medium">• Style: {travel_style}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            Optimized Travel Itinerary
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Geographically clustered attractions sequenced for minimal transit time and balanced budget pacing.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 self-start md:self-auto no-print">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-slate-700 transition-all"
            title="Print or Export to PDF"
          >
            <Printer className="w-4 h-4 text-slate-600 dark:text-slate-400" />
            <span>Export / Print</span>
          </button>

          <button
            onClick={handleSave}
            disabled={isSaved}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold shadow-md transition-all ${
              isSaved
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20 active:scale-95'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            <span>{isSaved ? 'Trip Saved ✓' : 'Save Itinerary'}</span>
          </button>
        </div>
      </div>

      {/* Suggested Budget Breakdown Strip */}
      {summary && summary.suggested_budget_split && (
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-5 rounded-2xl shadow-md border border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-700/60">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span className="font-bold text-sm">Smart Automated Budget Allocation (Total: ${total_budget})</span>
            </div>
            <button
              onClick={() => onNavigateToTab && onNavigateToTab('budget')}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 no-print"
            >
              <span>Open Live Budget Tracker</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-4 text-center">
            <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700">
              <span className="text-[11px] text-slate-400 block">🏨 Hotels (40%)</span>
              <span className="text-sm font-bold text-emerald-300">${summary.suggested_budget_split.accommodation}</span>
            </div>
            <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700">
              <span className="text-[11px] text-slate-400 block">🍽️ Food & Dining (25%)</span>
              <span className="text-sm font-bold text-teal-300">${summary.suggested_budget_split.food_dining}</span>
            </div>
            <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700">
              <span className="text-[11px] text-slate-400 block">🎟️ Sightseeing (20%)</span>
              <span className="text-sm font-bold text-cyan-300">${summary.suggested_budget_split.activities_tickets}</span>
            </div>
            <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700">
              <span className="text-[11px] text-slate-400 block">🚕 Transit (10%)</span>
              <span className="text-sm font-bold text-amber-300">${summary.suggested_budget_split.local_transport}</span>
            </div>
            <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700 col-span-2 sm:col-span-1">
              <span className="text-[11px] text-slate-400 block">🛡️ Safety Buffer (5%)</span>
              <span className="text-sm font-bold text-purple-300">${summary.suggested_budget_split.emergency_buffer}</span>
            </div>
          </div>
        </div>
      )}

      {/* Day Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar no-print">
        {days_plan.map((d, idx) => {
          const isSelected = selectedDayIndex === idx;
          return (
            <button
              key={idx}
              onClick={() => setSelectedDayIndex(idx)}
              className={`flex-shrink-0 px-4 py-3 rounded-2xl text-left transition-all border ${
                isSelected
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20 ring-2 ring-emerald-500/20 scale-[1.02]'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
              }`}
            >
              <div className="text-xs font-semibold opacity-90">{d.date}</div>
              <div className="font-extrabold text-sm mt-0.5">Day {d.day}</div>
              <div className={`text-[10px] mt-1 ${isSelected ? 'text-emerald-100' : 'text-slate-400'}`}>
                {d.activity_count} stops • ~${d.day_total_cost}
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Day Detail Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
        
        {/* Day Header Info */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              {currentDay.date}
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-0.5">
              {currentDay.title}
            </h3>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
              🎟️ Day Sightseeing Cost: <strong>${currentDay.day_total_cost}</strong>
            </span>
          </div>
        </div>

        {/* Activity Timeline List */}
        <div className="space-y-6 relative before:absolute before:inset-0 before:left-5 sm:before:left-6 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800 before:pointer-events-none">
          
          {currentDay.activities.map((activity, aIdx) => (
            <div key={aIdx} className="relative flex items-start gap-4 sm:gap-6 group">
              
              {/* Timeline Sequence Badge */}
              <div className="relative z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-emerald-500 text-white font-extrabold text-sm sm:text-base flex items-center justify-center shadow-md shadow-emerald-500/30 flex-shrink-0">
                {aIdx + 1}
              </div>

              {/* Activity Card Content */}
              <div className="flex-1 bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl p-4 sm:p-5 hover:shadow-md transition-all">
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100/80 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md">
                        {activity.time_slot}
                      </span>
                      <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                        {activity.category}
                      </span>
                      {getCrowdBadge(activity.crowd_level)}
                    </div>
                    <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                      {activity.name}
                    </h4>
                  </div>

                  {/* Pricing & Duration */}
                  <div className="flex items-center gap-3 text-right">
                    <div className="bg-white dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200">
                      Cost: {activity.cost === 0 ? <span className="text-emerald-600">FREE</span> : `$${activity.cost}`}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      ⏱️ {activity.duration}
                    </div>
                  </div>
                </div>

                <p className="mt-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {activity.description}
                </p>

                {/* Additional Info & Transit Stats */}
                <div className="mt-3 pt-3 border-t border-slate-200/60 dark:border-slate-700/60 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400">
                    <span>🕒 Hours: {activity.opening_hours || '09:00 - 18:00'}</span>
                    <span>⭐ Rating: {activity.rating || 4.7} / 5.0</span>
                  </div>

                  {activity.distance_from_prev_km > 0 && (
                    <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1 rounded-lg">
                      <Car className="w-3.5 h-3.5" />
                      <span>{activity.distance_from_prev_km} km from previous stop (~{activity.transit_time_min} mins)</span>
                    </div>
                  )}
                </div>

              </div>

            </div>
          ))}

        </div>

        {/* Visual Map Simulation Widget */}
        <div className="bg-slate-100 dark:bg-slate-800/80 rounded-2xl p-5 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-slate-200">
              <Navigation className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Day {currentDay.day} Route Sequencing (Geographic Distance Clustered)</span>
            </div>
            <span className="text-xs text-slate-500">Haversine Optimization Active</span>
          </div>

          <div className="flex flex-wrap items-center gap-2 p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
            {currentDay.activities.map((act, i) => (
              <React.Fragment key={i}>
                <div className="flex items-center gap-1.5 font-semibold text-slate-800 dark:text-slate-200">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 flex items-center justify-center text-[10px] font-bold">
                    {i + 1}
                  </div>
                  <span>{act.name}</span>
                </div>
                {i < currentDay.activities.length - 1 && (
                  <span className="text-slate-300 dark:text-slate-600 font-bold">➔</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
