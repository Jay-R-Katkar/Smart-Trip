import React from 'react';
import { 
  MapPin, 
  Hotel, 
  PieChart, 
  Bell, 
  Users, 
  ShieldAlert, 
  Flame 
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, onSOSClick }) {
  const menuItems = [
    { id: 'itinerary', label: 'Itinerary Planner', icon: MapPin },
    { id: 'hotels', label: 'Hotels & Flights', icon: Hotel },
    { id: 'budget', label: 'Budget Tracker', icon: PieChart },
    { id: 'alerts', label: 'Smart Alerts', icon: Bell },
    { id: 'guides', label: 'Local Guides', icon: Users },
    { id: 'safety', label: 'Safety & SOS', icon: ShieldAlert },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between h-screen sticky top-0 p-4 shrink-0">
      <div>
        {/* Brand Logo */}
        <div className="flex items-center gap-2 px-2 py-4 mb-6">
          <div className="bg-emerald-500 text-slate-950 font-black text-xl px-2.5 py-1 rounded-lg">
            ST
          </div>
          <span className="text-xl font-bold text-white tracking-wide">
            Smart<span className="text-emerald-400">Trip</span>
          </span>
        </div>

        {/* Vertical Navigation Links */}
        <nav className="flex flex-col gap-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 text-left ${
                  isActive
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon size={18} className={isActive ? 'text-emerald-400' : 'text-slate-400'} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Emergency SOS Action */}
      <div className="pt-4 border-t border-slate-800">
        <button
          onClick={onSOSClick}
          className="w-full flex items-center justify-center gap-2 bg-red-600/20 border border-red-500/50 hover:bg-red-600 hover:text-white text-red-400 font-bold py-2.5 px-4 rounded-xl transition-all shadow-lg shadow-red-950/40"
        >
          <Flame size={18} className="animate-pulse" />
          <span>EMERGENCY SOS</span>
        </button>
      </div>
    </aside>
  );
}