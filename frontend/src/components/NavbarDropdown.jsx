import React, { useState, useRef, useEffect } from 'react';
import { 
  MapPin, 
  Hotel, 
  PieChart, 
  CheckSquare, 
  Bell, 
  Users, 
  ShieldAlert, 
  Flame, 
  ChevronDown, 
  Menu, 
  X,
  Compass,
  Sparkles,
  CloudSun,
  UserCheck,
  Building2
} from 'lucide-react';

export function NavbarDropdown({ 
  activeTab, 
  setActiveTab, 
  onSOSClick, 
  onAuthClick,
  user,
  selectedCity = 'Ujjain'
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const menuItems = [
    { id: 'itinerary', label: 'Itinerary Planner', icon: MapPin, desc: 'Day-by-day smart schedule & routes' },
    { id: 'hotels', label: 'Ashrams & Stays', icon: Building2, desc: 'Dharamshalas, Ashrams & Hotels' },
    { id: 'budget', label: 'Budget Tracker', icon: PieChart, desc: 'Multi-currency expense & 80% alerts' },
    { id: 'packing', label: 'Packing Checklist', icon: CheckSquare, desc: 'Pilgrimage & essentials list' },
    { id: 'alerts', label: 'Smart Alerts', icon: Bell, desc: 'Darshan crowd & weather warnings' },
    { id: 'guides', label: 'Verified Vedic Guides', icon: Users, desc: 'Certified local shastri & historians' },
    { id: 'safety', label: 'Safety & SOS', icon: ShieldAlert, desc: 'Emergency hotlines & GPS radar' },
  ];

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (id) => {
    setActiveTab(id);
    setDropdownOpen(false);
  };

  const currentActiveItem = menuItems.find(m => m.id === activeTab) || menuItems[0];
  const ActiveIcon = currentActiveItem.icon;

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* LEFT SIDE: Brand Logo + Left Dropdown Menu */}
          <div className="flex items-center gap-3 sm:gap-4 relative" ref={dropdownRef}>
            
            {/* Brand Logo */}
            <div 
              onClick={() => handleSelect('itinerary')}
              className="flex items-center gap-2.5 cursor-pointer group shrink-0"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 flex items-center justify-center font-black text-xl shadow-lg shadow-emerald-500/25 group-hover:scale-105 transition-transform">
                ST
              </div>
              <div>
                <span className="text-xl font-black text-white tracking-tight">Smart<span className="text-emerald-400">Trip</span></span>
                <span className="block text-[9px] font-bold text-emerald-400 uppercase tracking-widest">Dharmik & Heritage</span>
              </div>
            </div>

            {/* LEFT DROPDOWN TRIGGER BUTTON */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-slate-200 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-md group"
              >
                <ActiveIcon size={16} className="text-emerald-400 group-hover:scale-110 transition-transform" />
                <span className="hidden sm:inline font-bold">{currentActiveItem.label}</span>
                <span className="sm:hidden font-bold">Menu</span>
                <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180 text-emerald-400' : ''}`} />
              </button>

              {/* LEFT FLOATING DROPDOWN MENU */}
              {dropdownOpen && (
                <div className="absolute left-0 mt-2 w-72 sm:w-80 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-2 border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                    <span>Navigation Modules</span>
                    <span className="text-emerald-400 font-mono">7 Features</span>
                  </div>

                  <div className="py-1.5 space-y-1">
                    {menuItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = activeTab === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => handleSelect(item.id)}
                          className={`w-full flex items-start gap-3 p-2.5 rounded-xl text-left transition-all ${
                            isActive 
                              ? 'bg-emerald-500/15 border border-emerald-500/40 text-white shadow-sm' 
                              : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                          }`}
                        >
                          <div className={`p-2 rounded-lg ${isActive ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'}`}>
                            <Icon size={16} />
                          </div>
                          <div>
                            <div className="font-bold text-xs sm:text-sm flex items-center gap-1.5">
                              <span>{item.label}</span>
                              {isActive && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                            </div>
                            <p className="text-[11px] text-slate-400 line-clamp-1">{item.desc}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* RIGHT SIDE: Weather + User Auth + Red Emergency SOS */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            
            {/* Live Weather Pill */}
            <div className="hidden md:flex items-center gap-1.5 bg-slate-800/80 border border-slate-700/80 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-300">
              <CloudSun size={15} className="text-emerald-400" />
              <span>{selectedCity}: 24°C Pleasant</span>
            </div>

            {/* User Profile / Login Pill */}
            <button
              onClick={onAuthClick}
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-slate-200 px-3 py-1.5 sm:py-2 rounded-xl text-xs font-semibold transition-all"
            >
              <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[10px]">
                {user ? user.name[0].toUpperCase() : 'G'}
              </div>
              <span className="hidden sm:inline font-medium text-slate-300">
                {user ? user.name : 'Guest User'}
              </span>
              <span className="text-[11px] text-emerald-400 font-bold">
                {user ? 'Logout' : 'Sign In'}
              </span>
            </button>

            {/* Red EMERGENCY SOS Action Button */}
            <button
              onClick={onSOSClick}
              className="flex items-center gap-1.5 bg-red-600 hover:bg-red-500 active:scale-95 text-white px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-black transition-all shadow-lg shadow-red-600/30 hover:scale-105 animate-pulse"
            >
              <Flame size={16} />
              <span>EMERGENCY SOS</span>
            </button>

          </div>

        </div>
      </div>
    </header>
  );
}

export default NavbarDropdown;
