import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  AlertTriangle, 
  MapPin, 
  PhoneCall, 
  Hospital, 
  Shield, 
  CheckCircle2, 
  Navigation, 
  Activity, 
  Compass, 
  Copy, 
  Check, 
  ExternalLink,
  Volume2,
  VolumeX,
  Radio
} from 'lucide-react';

export function SafetyDashboard({ 
  currentCity = 'Paris', 
  safetyData, 
  onTriggerSOS 
}) {
  const [copiedCoords, setCopiedCoords] = useState(false);
  const [isSimulatingGps, setIsSimulatingGps] = useState(true);
  const [gpsCoords, setGpsCoords] = useState({ lat: 48.8584, lng: 2.2945, accuracy: 8 });

  // Simulated GPS jitter
  useEffect(() => {
    if (!isSimulatingGps) return;
    const interval = setInterval(() => {
      setGpsCoords(prev => ({
        lat: Number((prev.lat + (Math.random() - 0.5) * 0.0002).toFixed(6)),
        lng: Number((prev.lng + (Math.random() - 0.5) * 0.0002).toFixed(6)),
        accuracy: Math.floor(5 + Math.random() * 5)
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, [isSimulatingGps]);

  const info = safetyData?.safety_info || {
    city: currentCity,
    safety_score: 88,
    police_number: "112 / 17",
    ambulance_number: "112 / 15",
    tourist_helpline: "+33 1 43 17 53 53",
    safe_areas: "Marais, Saint-Germain-des-Prés, 7th Arrondissement, Latin Quarter",
    safe_areas_list: ["Marais", "Saint-Germain-des-Prés", "7th Arrondissement", "Latin Quarter"],
    caution_areas: "Watch for pickpockets around Eiffel Tower, Gare du Nord late night, Sacré-Cœur stairs",
    caution_areas_list: ["Eiffel Tower Base", "Gare du Nord (Late night)", "Sacré-Cœur Funicular stairs"],
    nearest_hospitals: "Hôpital Hôtel-Dieu (+33 1 42 34 82 34), Hôpital Necker",
    nearest_hospitals_list: ["Hôpital Hôtel-Dieu (1 Parvis Notre-Dame)", "Hôpital Necker Enfants Malades"],
    emergency_tips: "Keep wallets in front pockets; validate metro tickets; emergency SMS is available via 114.",
    rating_label: "Very Safe (Normal Travel Precautions)",
    rating_color: "blue"
  };

  const handleCopyCoordinates = () => {
    navigator.clipboard.writeText(`${gpsCoords.lat}, ${gpsCoords.lng}`);
    setCopiedCoords(true);
    setTimeout(() => setCopiedCoords(false), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold text-xs">
            Module 6: Traveler Protection & Emergency Ops
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            Safety & Emergency Command Center
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time GPS telemetry, local law enforcement hotline links, and instant SOS beacon dispatch.
          </p>
        </div>
      </div>

      {/* PROMINENT RED SOS BROADCAST HERO CARD */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-red-600 via-rose-700 to-slate-900 text-white p-6 sm:p-10 shadow-2xl">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 rounded-full bg-red-400/20 blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          
          <div className="space-y-3 text-center md:text-left max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-extrabold uppercase tracking-wider text-rose-100">
              <Radio className="w-4 h-4 animate-pulse" />
              <span>24/7 Crisis Dispatch Ready</span>
            </div>
            <h3 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
              Emergency SOS Beacon
            </h3>
            <p className="text-xs sm:text-sm text-rose-100/90 leading-relaxed">
              If you feel unsafe or encounter an urgent crisis, trigger SOS. We instantly broadcast your precise GPS coordinates, local responder contacts, and alert emergency services.
            </p>
          </div>

          {/* Glowing Big SOS Button */}
          <div className="flex flex-col items-center gap-3">
            <button
              onClick={onTriggerSOS}
              className="w-32 h-32 sm:w-36 sm:h-36 rounded-full bg-red-500 hover:bg-red-400 text-white font-black text-2xl tracking-widest uppercase shadow-2xl flex flex-col items-center justify-center gap-1 transition-all active:scale-90 animate-sos-pulse border-4 border-white/40"
            >
              <AlertTriangle className="w-8 h-8" />
              <span>SOS</span>
            </button>
            <span className="text-[11px] font-semibold text-rose-200 uppercase tracking-wider">
              Tap to Dispatch SOS
            </span>
          </div>

        </div>
      </div>

      {/* 2-COLUMN GRID: GPS TELEMETRY & CITY SAFETY SCORE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Live GPS Tracker Simulator */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Navigation className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
                Live GPS Position Telemetry
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Signal Locked</span>
            </div>
          </div>

          <div className="bg-slate-900 text-white p-5 rounded-2xl space-y-4 font-mono text-xs shadow-inner">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-slate-400 text-[10px] block uppercase">Current Latitude</span>
                <span className="text-base font-bold text-emerald-400">{gpsCoords.lat}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block uppercase">Current Longitude</span>
                <span className="text-base font-bold text-emerald-400">{gpsCoords.lng}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-slate-400 text-[11px]">
              <span>Accuracy: ±{gpsCoords.accuracy} meters</span>
              <span>City Hub: {currentCity}</span>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <button
              onClick={handleCopyCoordinates}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-slate-700 transition-colors"
            >
              {copiedCoords ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCoords ? 'Coordinates Copied!' : 'Copy GPS Coordinates'}</span>
            </button>

            <a
              href={`https://www.google.com/maps/search/?api=1&query=${gpsCoords.lat},${gpsCoords.lng}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold hover:underline"
            >
              <span>View in Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Right: City Safety Score Card */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
                City Safety Index
              </h3>
            </div>
            <span className="text-xs font-bold text-slate-500">{info.city}</span>
          </div>

          <div className="text-center py-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-900/60">
            <div className="text-5xl font-black text-emerald-600 dark:text-emerald-400">
              {info.safety_score}
              <span className="text-lg font-normal text-slate-400">/100</span>
            </div>
            <div className="text-xs font-bold text-emerald-800 dark:text-emerald-300 mt-1">
              {info.rating_label || "Extremely Safe"}
            </div>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {info.emergency_tips}
          </p>
        </div>

      </div>

      {/* QUICK-DIAL EMERGENCY CONTACTS */}
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-lg text-slate-900 dark:text-white flex items-center gap-2">
            <PhoneCall className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span>One-Touch Emergency Dialers for {info.city}</span>
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          {/* Police */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col justify-between space-y-3">
            <div>
              <span className="text-xs font-bold text-slate-400 block uppercase">Local Police Dispatch</span>
              <span className="text-2xl font-black text-slate-900 dark:text-white">{info.police_number}</span>
            </div>
            <a
              href={`tel:${info.police_number}`}
              className="w-full py-2 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs text-center block hover:opacity-90 transition-opacity"
            >
              📞 Call Police
            </a>
          </div>

          {/* Ambulance / Medical */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col justify-between space-y-3">
            <div>
              <span className="text-xs font-bold text-slate-400 block uppercase">Ambulance & Paramedics</span>
              <span className="text-2xl font-black text-slate-900 dark:text-white">{info.ambulance_number}</span>
            </div>
            <a
              href={`tel:${info.ambulance_number}`}
              className="w-full py-2 rounded-xl bg-rose-600 text-white font-bold text-xs text-center block hover:bg-rose-500 transition-colors shadow-md shadow-rose-600/20"
            >
              🚑 Call Ambulance
            </a>
          </div>

          {/* Tourist Helpline */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col justify-between space-y-3">
            <div>
              <span className="text-xs font-bold text-slate-400 block uppercase">Tourist Assistance Helpline</span>
              <span className="text-base font-black text-slate-900 dark:text-white truncate block">{info.tourist_helpline || "112"}</span>
            </div>
            <a
              href={`tel:${info.tourist_helpline || "112"}`}
              className="w-full py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs text-center block hover:bg-emerald-500 transition-colors shadow-md shadow-emerald-600/20"
            >
              ℹ️ Call Tourist Help
            </a>
          </div>

        </div>
      </div>

      {/* SAFE ZONES & CAUTION AREAS LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Recommended Safe Zones */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            <h4 className="font-extrabold text-base text-slate-900 dark:text-white">Recommended Safe Zones</h4>
          </div>
          <p className="text-xs text-slate-500">Well-lit, highly patrolled tourist neighborhoods:</p>
          <div className="flex flex-wrap gap-2 pt-1">
            {(info.safe_areas_list || [info.safe_areas]).map((area, i) => (
              <span key={i} className="px-3 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-semibold text-xs border border-emerald-200 dark:border-emerald-800">
                ✓ {area}
              </span>
            ))}
          </div>
        </div>

        {/* Caution Areas */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <h4 className="font-extrabold text-base text-slate-900 dark:text-white">Areas Requiring Vigilance</h4>
          </div>
          <p className="text-xs text-slate-500">Areas with higher incidence of pickpocketing or night caution:</p>
          <div className="flex flex-wrap gap-2 pt-1">
            {(info.caution_areas_list || [info.caution_areas]).map((area, i) => (
              <span key={i} className="px-3 py-1 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-semibold text-xs border border-amber-200 dark:border-amber-800">
                ⚠️ {area}
              </span>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
