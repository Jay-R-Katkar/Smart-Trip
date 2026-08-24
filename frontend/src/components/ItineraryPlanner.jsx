import React, { useState } from 'react';
import { 
  Sparkles, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Compass, 
  TrendingUp, 
  Layers, 
  Check, 
  ArrowRight,
  ShieldCheck,
  Zap
} from 'lucide-react';

export function ItineraryPlanner({ 
  destinations = [], 
  onGenerateItinerary, 
  isLoading 
}) {
  const [selectedCity, setSelectedCity] = useState('Paris');
  const [days, setDays] = useState(3);
  const [budget, setBudget] = useState(1200);
  const [travelStyle, setTravelStyle] = useState('Cultural Heritage');
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toISOString().split('T')[0];
  });

  const travelStyles = [
    { id: 'Cultural Heritage', icon: '🏛️', desc: 'Museums, monuments, history' },
    { id: 'Food & Gastronomy', icon: '🍷', desc: 'Local dining, wine & markets' },
    { id: 'Adventure & Nature', icon: '⛰️', desc: 'Treks, nature, viewpoints' },
    { id: 'Luxury & Relaxation', icon: '✨', desc: 'Spas, cruises & rooftop bars' },
    { id: 'Budget Explorer', icon: '🎒', desc: 'Free sights, parks & local spots' }
  ];

  const presets = [
    { city: 'Paris', days: 3, budget: 1200, style: 'Cultural Heritage' },
    { city: 'Tokyo', days: 5, budget: 1800, style: 'Adventure & Nature' },
    { city: 'Bali', days: 4, budget: 700, style: 'Luxury & Relaxation' },
    { city: 'Goa', days: 3, budget: 400, style: 'Food & Gastronomy' }
  ];

  const handleApplyPreset = (p) => {
    setSelectedCity(p.city);
    setDays(p.days);
    setBudget(p.budget);
    setTravelStyle(p.style);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onGenerateItinerary({
      destination: selectedCity,
      days: parseInt(days),
      budget: parseFloat(budget),
      travel_style: travelStyle,
      start_date: startDate
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-teal-700 to-slate-900 text-white p-6 sm:p-10 shadow-xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-emerald-400/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-16 w-60 h-60 rounded-full bg-cyan-400/10 blur-2xl pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-4 border border-white/10">
            <Zap className="w-3.5 h-3.5" />
            <span>Deterministic Travel Optimization • Zero Complex ML Needed</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Automate Your Dream Trip In Under <span className="text-emerald-300 underline decoration-wavy decoration-emerald-400">10 Seconds</span>.
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-200 leading-relaxed max-w-2xl">
            Input destination, days & budget. SmartTrip automatically schedules day-by-day attractions with distance minimization, hotel comparisons, budget thresholds, and local guide matching.
          </p>

          {/* Quick Presets */}
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-300 font-medium">Quick Presets:</span>
            {presets.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleApplyPreset(p)}
                className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium text-white transition-all backdrop-blur-sm border border-white/10 flex items-center gap-1"
              >
                <span>{p.city}</span>
                <span className="opacity-75">({p.days}d • ${p.budget})</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Generator Form Card */}
      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Destination Cards Gallery */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-slate-200">
                <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>1. Select Your Destination</span>
              </label>
              <span className="text-xs text-slate-500">
                Selected: <strong className="text-emerald-600 dark:text-emerald-400">{selectedCity}</strong>
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {destinations.map((dest) => {
                const isSelected = selectedCity.toLowerCase() === dest.city.toLowerCase();
                return (
                  <div
                    key={dest.city}
                    onClick={() => setSelectedCity(dest.city)}
                    className={`group relative rounded-2xl overflow-hidden cursor-pointer border-2 transition-all ${
                      isSelected 
                        ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-md scale-[1.02]' 
                        : 'border-transparent hover:border-slate-300 dark:hover:border-slate-700 opacity-85 hover:opacity-100'
                    }`}
                  >
                    <div className="aspect-[4/3] w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                      <img 
                        src={dest.hero_image} 
                        alt={dest.city}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    </div>

                    <div className="absolute bottom-2 left-2 right-2 text-white">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm leading-tight">{dest.city}</span>
                        {isSelected && (
                          <div className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </div>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-300 font-medium mt-0.5">
                        {dest.country} • ~${dest.daily_budget_estimate}/day
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Parameters & Controls */}
          <div className="lg:col-span-5 space-y-5 bg-slate-50 dark:bg-slate-800/40 p-5 rounded-2xl border border-slate-100 dark:border-slate-800">
            
            {/* Days & Start Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>Duration (Days)</span>
                  </label>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
                    {days} Days
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={days}
                  onChange={(e) => setDays(e.target.value)}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-medium">
                  <span>1 Day</span>
                  <span>5 Days</span>
                  <span>10 Days</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Total Budget */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Total Trip Budget (USD)</span>
                </label>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full">
                  ${budget}
                </span>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-400 text-sm font-semibold">$</span>
                <input
                  type="number"
                  min="100"
                  max="20000"
                  step="50"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full pl-7 pr-3 py-2 text-sm font-bold rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
              <div className="flex items-center gap-1.5 mt-2">
                {[500, 1000, 1500, 2500].map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setBudget(b)}
                    className={`px-2 py-0.5 rounded-md text-[11px] font-medium border transition-colors ${
                      budget == b
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    ${b}
                  </button>
                ))}
              </div>
            </div>

            {/* Travel Style */}
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-2">
                <Layers className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Travel Style</span>
              </label>
              <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                {travelStyles.map((style) => {
                  const isSelected = travelStyle === style.id;
                  return (
                    <div
                      key={style.id}
                      onClick={() => setTravelStyle(style.id)}
                      className={`flex items-center justify-between p-2 rounded-xl cursor-pointer border transition-all text-xs ${
                        isSelected
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-900 dark:text-emerald-300 font-semibold'
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-base">{style.icon}</span>
                        <div>
                          <div>{style.id}</div>
                          <div className="text-[10px] text-slate-400 font-normal">{style.desc}</div>
                        </div>
                      </div>
                      {isSelected && <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Submit Action */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm tracking-wide shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Computing Geographic Distances & Plan...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Smart Itinerary ({days} Days)</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

          </div>

        </div>

      </form>

    </div>
  );
}
