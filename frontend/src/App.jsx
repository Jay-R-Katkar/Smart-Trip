import React, { useState } from 'react';
import { 
  MapPin, 
  Hotel, 
  PieChart, 
  Bell, 
  Users, 
  ShieldAlert, 
  Flame, 
  X,
  CloudSun
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('itinerary');
  const [selectedDestination, setSelectedDestination] = useState('Paris');
  const [days, setDays] = useState(3);
  const [budget, setBudget] = useState(1200);
  const [scheduleGenerated, setScheduleGenerated] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [emailInput, setEmailInput] = useState('');

  const menuItems = [
    { id: 'itinerary', label: 'Itinerary Planner', icon: MapPin },
    { id: 'hotels', label: 'Hotels & Flights', icon: Hotel },
    { id: 'budget', label: 'Budget Tracker', icon: PieChart },
    { id: 'alerts', label: 'Smart Alerts', icon: Bell },
    { id: 'guides', label: 'Local Guides', icon: Users },
    { id: 'safety', label: 'Safety & SOS', icon: ShieldAlert },
  ];

  const handleAuth = () => {
    if (user) {
      setUser(null);
    } else {
      if (!emailInput) return;
      setUser({ name: emailInput.split('@')[0] });
      setIsAuthOpen(false);
      setEmailInput('');
    }
  };

  return (
    <div className="flex h-screen bg-[#070d18] text-slate-100 overflow-hidden font-sans">
      
      {/* 1. Left Vertical Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between h-full p-4 shrink-0 shadow-2xl z-30">
        <div>
          {/* Logo */}
          <div className="flex items-center gap-3 px-2 py-3 mb-6">
            <div className="bg-emerald-500 text-slate-950 font-black text-xl px-2.5 py-1 rounded-xl shadow-lg shadow-emerald-500/20">
              ST
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">Smart<span className="text-emerald-400">Trip</span></h1>
              <span className="text-[10px] text-emerald-500 uppercase font-semibold tracking-wider">Automation Platform</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${
                    isActive
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <Icon size={18} className={isActive ? 'text-emerald-400' : 'text-slate-400'} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Account & SOS Hub */}
        <div className="pt-4 border-t border-slate-800 flex flex-col gap-3">
          <div className="flex items-center justify-between bg-slate-800/40 p-2.5 rounded-xl border border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                {user ? user.name[0].toUpperCase() : 'G'}
              </div>
              <span className="text-xs font-semibold text-slate-300 truncate max-w-[90px]">
                {user ? user.name : 'Guest User'}
              </span>
            </div>
            <button
              onClick={() => user ? setUser(null) : setIsAuthOpen(true)}
              className="text-xs bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-slate-950 font-bold px-2.5 py-1 rounded-lg transition-all"
            >
              {user ? 'Logout' : 'Login'}
            </button>
          </div>

          <button
            onClick={() => setActiveTab('safety')}
            className="w-full flex items-center justify-center gap-2 bg-red-600/20 border border-red-500/50 hover:bg-red-600 hover:text-white text-red-400 font-bold py-2.5 px-4 rounded-xl transition-all shadow-lg shadow-red-950/40"
          >
            <Flame size={18} className="animate-pulse" />
            <span>EMERGENCY SOS</span>
          </button>
        </div>
      </aside>

      {/* 2. Main Right Content */}
      <main className="flex-1 h-full overflow-y-auto bg-[#070d18] p-6 lg:p-8">
        <div className="max-w-6xl mx-auto space-y-6">

          {/* Module 1: Itinerary */}
          {activeTab === 'itinerary' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-emerald-950/40 to-slate-900 border border-emerald-500/20 rounded-2xl p-6 shadow-xl">
                <div className="inline-block bg-emerald-500/10 text-emerald-400 text-xs font-semibold px-3 py-1 rounded-full mb-3">
                  ⚡ ZERO COMPLEX ML REQUIRED
                </div>
                <h2 className="text-3xl font-extrabold text-white">Automate Complete Travel Itineraries In Seconds</h2>
                <p className="text-slate-400 text-sm mt-1">Input destination, duration & budget. SmartTrip calculates distance-clustered routes and cost limits.</p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
                <div>
                  <label className="text-sm font-semibold text-slate-300">1. Select Destination</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
                    {['Paris', 'Goa', 'Tokyo', 'Dubai'].map((city) => (
                      <div
                        key={city}
                        onClick={() => setSelectedDestination(city)}
                        className={`cursor-pointer p-3 rounded-xl transition-all ${
                          selectedDestination === city
                            ? 'border-2 border-emerald-500 bg-slate-800/80'
                            : 'border border-slate-700 bg-slate-800/40 hover:border-emerald-500'
                        }`}
                      >
                        <p className="font-bold text-white text-sm">{city}</p>
                        <p className="text-xs text-slate-400">Verified Hub</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-400">Duration (Days)</label>
                    <input
                      type="number"
                      value={days}
                      min="1"
                      max="14"
                      onChange={(e) => setDays(e.target.value)}
                      className="w-full mt-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white font-medium focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-400">Total Budget ($ USD)</label>
                    <input
                      type="number"
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      className="w-full mt-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white font-medium focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <button
                  onClick={() => setScheduleGenerated(true)}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold py-3 rounded-xl transition-all shadow-lg shadow-emerald-500/20"
                >
                  ✈ GENERATE SMART ITINERARY
                </button>
              </div>

              {scheduleGenerated && (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                  <h3 className="text-lg font-bold text-emerald-400">
                    {days}-Day Optimized Schedule for {selectedDestination} (Budget: ${budget})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {Array.from({ length: Number(days) || 1 }).map((_, idx) => (
                      <div key={idx} className="bg-slate-800/60 border border-slate-700 p-4 rounded-xl space-y-2">
                        <span className="text-xs font-bold bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded">Day {idx + 1}</span>
                        <p className="text-sm font-bold text-white mt-1">Morning: Historic Center Tour</p>
                        <p className="text-xs text-slate-400">Afternoon: Local Heritage & Walk</p>
                        <p className="text-xs text-slate-400">Evening: City Center Dining</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Module 2: Hotels */}
          {activeTab === 'hotels' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">Hotels & Flights Comparison</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3">
                  <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2.5 py-1 rounded-full font-bold">Best Deal - 28% Off</span>
                  <h4 className="font-bold text-lg">Grand Palace Hotel</h4>
                  <p className="text-slate-400 text-xs">Agoda: $110/night • Booking.com: $135/night</p>
                  <button className="w-full bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-white font-semibold py-2 rounded-xl text-sm transition-all">Book Now</button>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3">
                  <span className="text-xs bg-blue-500/20 text-blue-400 px-2.5 py-1 rounded-full font-bold">Direct Partner</span>
                  <h4 className="font-bold text-lg">Seaside Resort & Spa</h4>
                  <p className="text-slate-400 text-xs">Expedia: $180/night • Booking.com: $175/night</p>
                  <button className="w-full bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-white font-semibold py-2 rounded-xl text-sm transition-all">Book Now</button>
                </div>
              </div>
            </div>
          )}

          {/* Module 3: Budget */}
          {activeTab === 'budget' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">Real-Time Budget Tracker</h2>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl"><p className="text-xs text-slate-400">Total Budget</p><p className="text-2xl font-bold text-white mt-1">${budget}</p></div>
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl"><p className="text-xs text-slate-400">Spent</p><p className="text-2xl font-bold text-emerald-400 mt-1">${Math.round(budget * 0.7)}</p></div>
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl"><p className="text-xs text-slate-400">Remaining</p><p className="text-2xl font-bold text-amber-400 mt-1">${Math.round(budget * 0.3)}</p></div>
              </div>
              <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-xl">
                <span className="text-xs text-amber-300 font-medium">⚠️ Warning: You have reached 70% of your allocated budget threshold.</span>
              </div>
            </div>
          )}

          {/* Module 4: Alerts */}
          {activeTab === 'alerts' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">Live Smart Alerts</h2>
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CloudSun className="text-emerald-400" size={24} />
                  <div>
                    <p className="text-sm font-semibold text-white">{selectedDestination} Weather: 22°C Pleasant</p>
                    <p className="text-xs text-slate-400">No storm or rain alerts detected for current itinerary slots.</p>
                  </div>
                </div>
                <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2.5 py-1 rounded-full font-bold">Good Condition</span>
              </div>
            </div>
          )}

          {/* Module 5: Guides */}
          {activeTab === 'guides' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">Verified Local Guides</h2>
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center font-bold text-emerald-400">MP</div>
                  <div>
                    <h4 className="font-bold text-white">Marc Pierre</h4>
                    <p className="text-xs text-slate-400">Languages: English, French • Rating: ★ 4.9</p>
                  </div>
                </div>
                <button className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-4 py-2 rounded-xl text-sm transition-all">Book Guide ($25/hr)</button>
              </div>
            </div>
          )}

          {/* Module 6: Safety */}
          {activeTab === 'safety' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-red-500 flex items-center gap-2">Safety & Emergency Command</h2>
              <div className="bg-red-500/10 border border-red-500/30 p-6 rounded-2xl space-y-4">
                <p className="text-sm text-slate-300">Triggering SOS broadcasts simulated emergency telemetry and alerts local responders with coordinates.</p>
                <button
                  onClick={() => alert('🚨 SOS Signal Dispatched: Coordinates sent to Local Responders.')}
                  className="bg-red-600 hover:bg-red-700 text-white font-extrabold px-8 py-3 rounded-xl text-sm shadow-xl shadow-red-950/60 transition-all flex items-center gap-2"
                >
                  <Flame size={18} /> BROADCAST EMERGENCY SIGNAL
                </button>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* 3. Auth Modal */}
      {isAuthOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-5 shadow-2xl relative">
            <button onClick={() => setIsAuthOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
              <X size={18} />
            </button>
            <h3 className="text-xl font-bold text-white">Sign In to SmartTrip</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-300">Email Address</label>
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full mt-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
            <button
              onClick={handleAuth}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold py-2.5 rounded-xl text-sm transition-all shadow-lg shadow-emerald-500/20"
            >
              Continue
            </button>
          </div>
        </div>
      )}

    </div>
  );
}