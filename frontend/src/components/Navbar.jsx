import React, { useState } from 'react';
import { 
  MapPin, 
  Hotel, 
  PieChart, 
  Bell, 
  Users, 
  ShieldAlert, 
  Flame, 
  Bookmark, 
  Menu, 
  X,
  Compass,
  Zap,
  CloudSun
} from 'lucide-react';

export function Navbar({ 
  activeTab, 
  setActiveTab, 
  onSOSClick, 
  onSavedTripsClick,
  unreadAlertsCount = 2,
  selectedCity = 'Paris'
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const menuItems = [
    { id: 'itinerary', label: 'Itinerary Planner', icon: MapPin },
    { id: 'hotels', label: 'Hotels & Flights', icon: Hotel },
    { id: 'budget', label: 'Budget Tracker', icon: PieChart },
    { id: 'alerts', label: 'Smart Alerts', icon: Bell, badge: unreadAlertsCount },
    { id: 'guides', label: 'Local Guides', icon: Users },
    { id: 'safety', label: 'Safety & SOS', icon: ShieldAlert },
  ];

  const handleTabSelect = (id) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 shadow-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Brand Logo */}
          <div 
            onClick={() => handleTabSelect('itinerary')}
            className="flex items-center gap-3 cursor-pointer group shrink-0"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 flex items-center justify-center font-black text-xl shadow-lg shadow-emerald-500/25 group-hover:scale-105 transition-transform">
              ST
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-extrabold text-white tracking-tight">Smart<span className="text-emerald-400">Trip</span></span>
                <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-1.5 py-0.5 rounded border border-emerald-500/30">HACKATHON</span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block">Zero-ML Travel Automation</p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabSelect(item.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs xl:text-sm font-semibold transition-all relative ${
                    isActive
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                  }`}
                >
                  <Icon size={16} className={isActive ? 'text-slate-950' : 'text-slate-400'} />
                  <span>{item.label}</span>
                  {item.badge && item.badge > 0 && !isActive && (
                    <span className="w-4 h-4 rounded-full bg-amber-500 text-slate-950 font-bold text-[10px] flex items-center justify-center animate-pulse">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Action Hub (Right side) */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            
            {/* Live Weather Indicator */}
            <div className="hidden md:flex items-center gap-1.5 bg-slate-800/80 border border-slate-700/80 px-2.5 py-1.5 rounded-xl text-xs font-medium text-slate-300">
              <CloudSun size={15} className="text-emerald-400" />
              <span>{selectedCity}: 22°C</span>
            </div>

            {/* Saved Trips Button */}
            {onSavedTripsClick && (
              <button
                onClick={onSavedTripsClick}
                className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-2 rounded-xl text-xs font-semibold transition-all"
                title="View Saved Itineraries"
              >
                <Bookmark size={15} className="text-emerald-400" />
                <span className="hidden sm:inline">Saved Trips</span>
              </button>
            )}

            {/* Red Emergency SOS Action */}
            <button
              onClick={onSOSClick}
              className="flex items-center gap-1.5 bg-red-600 hover:bg-red-500 text-white px-3.5 py-2 rounded-xl text-xs sm:text-sm font-black transition-all shadow-lg shadow-red-600/30 hover:scale-105 active:scale-95 animate-pulse"
            >
              <Flame size={16} />
              <span>SOS</span>
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white border border-slate-700"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-900 border-b border-slate-800 px-4 pt-2 pb-6 space-y-1.5 shadow-2xl animate-in slide-in-from-top-4 duration-200">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabSelect(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-emerald-500 text-slate-950 font-bold'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={18} className={isActive ? 'text-slate-950' : 'text-emerald-400'} />
                  <span>{item.label}</span>
                </div>
                {item.badge && item.badge > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 text-xs font-bold">
                    {item.badge} New
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
}

export default Navbar;