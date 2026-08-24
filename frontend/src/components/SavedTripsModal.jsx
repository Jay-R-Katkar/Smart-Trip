import React from 'react';
import { 
  Bookmark, 
  Trash2, 
  ArrowRight, 
  X, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Plus 
} from 'lucide-react';

export function SavedTripsModal({ 
  isOpen, 
  onClose, 
  trips = [], 
  onSelectTrip, 
  onDeleteTrip, 
  onCreateNewTrip 
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-xl w-full p-6 sm:p-8 shadow-2xl relative">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <Bookmark className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h3 className="font-extrabold text-xl text-slate-900 dark:text-white">
              My Saved Trips ({trips.length})
            </h3>
          </div>

          <button
            onClick={() => {
              onClose();
              if (onCreateNewTrip) onCreateNewTrip();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Trip</span>
          </button>
        </div>

        {/* Trips List */}
        <div className="mt-4 space-y-3 max-h-96 overflow-y-auto pr-1">
          {trips.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-500">
              No saved trips found. Create and save your first itinerary!
            </div>
          ) : (
            trips.map((trip) => (
              <div
                key={trip.id}
                className="group p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20 border border-slate-200/80 dark:border-slate-700 transition-all flex items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900 dark:text-white">{trip.title}</span>
                    <span className="px-2 py-0.2 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold">
                      {trip.destination}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-500 text-xs font-medium">
                    <span>📅 {trip.days} Days ({trip.start_date || 'Upcoming'})</span>
                    <span>💰 Budget: ${trip.budget}</span>
                    {trip.total_spent > 0 && <span>• Spent: ${trip.total_spent}</span>}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (onSelectTrip) onSelectTrip(trip);
                      onClose();
                    }}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 shadow-sm transition-all"
                  >
                    <span>Load</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>

                  <button
                    onClick={() => onDeleteTrip && onDeleteTrip(trip.id)}
                    className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                    title="Delete saved trip"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
