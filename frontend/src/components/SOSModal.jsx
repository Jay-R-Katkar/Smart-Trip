import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  Radio, 
  Phone, 
  CheckCircle2, 
  X, 
  ShieldAlert, 
  Copy, 
  Check, 
  ExternalLink,
  Volume2,
  VolumeX
} from 'lucide-react';

export function SOSModal({ 
  isOpen, 
  onClose, 
  currentCity = 'Paris',
  onConfirmSOS 
}) {
  const [countdown, setCountdown] = useState(3);
  const [isDispatched, setIsDispatched] = useState(false);
  const [copiedCoords, setCopiedCoords] = useState(false);
  const [sirenPlaying, setSirenPlaying] = useState(false);
  const [incidentData, setIncidentData] = useState(null);

  const mockLat = 48.8584;
  const mockLng = 2.2945;

  useEffect(() => {
    if (!isOpen) {
      setCountdown(3);
      setIsDispatched(false);
      setIncidentData(null);
      setSirenPlaying(false);
      return;
    }

    if (countdown > 0 && !isDispatched) {
      const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && !isDispatched) {
      handleDispatch();
    }
  }, [isOpen, countdown, isDispatched]);

  const handleDispatch = async () => {
    setIsDispatched(true);
    const incidentId = `SOS-${Math.random().toString(36).substring(4).toUpperCase()}`;
    const data = {
      incident_id: incidentId,
      timestamp: new Date().toLocaleTimeString(),
      city: currentCity,
      coordinates: `${mockLat}, ${mockLng}`,
      responders: [
        { name: "Local Police Hotline", number: "112 / 17", status: "Alert Broadcasted" },
        { name: "Emergency Medical Services", number: "112 / 15", status: "Alert Broadcasted" },
        { name: "SmartTrip 24/7 Crisis Dispatch", number: "+1 800 999 TRIP", status: "Monitoring Online" }
      ]
    };
    setIncidentData(data);
    if (onConfirmSOS) {
      onConfirmSOS({ latitude: mockLat, longitude: mockLng, city: currentCity });
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`${mockLat}, ${mockLng}`);
    setCopiedCoords(true);
    setTimeout(() => setCopiedCoords(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border-2 border-red-600 rounded-3xl max-w-lg w-full p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden">
        
        {/* Top Warning Stripe */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-red-600 via-rose-500 to-red-600 animate-pulse" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        {!isDispatched ? (
          /* COUNTDOWN SCREEN */
          <div className="text-center space-y-6 py-4">
            <div className="w-20 h-20 rounded-full bg-red-600/20 text-red-500 flex items-center justify-center mx-auto border-2 border-red-500 animate-sos-pulse">
              <AlertTriangle className="w-10 h-10" />
            </div>

            <div>
              <h3 className="text-2xl font-black text-white">
                Broadcasting Emergency SOS
              </h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                Connecting your device with emergency services and contacts in {currentCity}...
              </p>
            </div>

            <div className="text-6xl font-black text-red-500 font-mono">
              {countdown}
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleDispatch}
                className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-lg shadow-red-600/40 uppercase tracking-wider transition-all"
              >
                Send Immediately
              </button>
              <button
                onClick={onClose}
                className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          /* DISPATCHED CONFIRMATION SCREEN */
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-red-600 text-white flex items-center justify-center flex-shrink-0 shadow-lg shadow-red-600/50">
                <Radio className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-red-400">Emergency Dispatch Active</span>
                <h3 className="text-xl font-black text-white">
                  SOS Beacon Transmitted
                </h3>
              </div>
            </div>

            {/* GPS Broadcast Box */}
            <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 space-y-2 text-xs font-mono">
              <div className="flex justify-between text-slate-400">
                <span>Incident ID:</span>
                <strong className="text-red-400">{incidentData?.incident_id}</strong>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Location:</span>
                <span className="text-emerald-400">{incidentData?.coordinates} ({currentCity})</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Timestamp:</span>
                <span>{incidentData?.timestamp}</span>
              </div>
            </div>

            {/* Responder Notification List */}
            <div className="space-y-2 text-xs">
              <span className="font-bold text-slate-300 block">Notified Emergency Responders:</span>
              {incidentData?.responders.map((r, i) => (
                <div key={i} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/40 border border-slate-700/60">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span className="font-semibold text-slate-200">{r.name}</span>
                  </div>
                  <span className="text-[11px] text-emerald-400 font-mono font-bold">{r.status}</span>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={handleCopy}
                className="py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                {copiedCoords ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCoords ? 'Copied' : 'Copy GPS'}</span>
              </button>

              <a
                href="tel:112"
                className="py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-md shadow-red-600/30"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Direct Dial 112</span>
              </a>
            </div>

            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
            >
              Close Emergency Screen
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
