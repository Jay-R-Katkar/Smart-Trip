import React, { useState } from 'react';
import { NavbarDropdown } from './components/NavbarDropdown';
import { InteractiveMap } from './components/InteractiveMap';
import { 
  Sparkles, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Search, 
  Flame, 
  Hotel, 
  PieChart, 
  CheckSquare, 
  Bell, 
  Users, 
  ShieldAlert, 
  Check, 
  X, 
  Building2, 
  Navigation, 
  Clock, 
  CloudSun, 
  Zap, 
  Shield, 
  ExternalLink,
  ChevronRight,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('itinerary');
  const [selectedCity, setSelectedCity] = useState('Ujjain');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currency, setCurrency] = useState('INR'); // INR or USD
  const [days, setDays] = useState(2);
  const [budget, setBudget] = useState(15000);
  const [scheduleGenerated, setScheduleGenerated] = useState(true);
  const [user, setUser] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [emailInput, setEmailInput] = useState('');

  // 23+ Destinations Dataset across categories
  const destinationsData = [
    {
      id: 'ujjain',
      name: 'Ujjain',
      title: 'Mahakaleshwar Jyotirlinga',
      category: 'Spiritual',
      image: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=600',
      tag: 'Jyotirlinga & Bhasma Aarti',
      coords: [23.1765, 75.7885],
      activities: [
        { name: 'Mahakaleshwar Temple Bhasma Aarti', period: 'Morning (04:00 - 08:30)', time_slot: 'Morning', category: 'Dharmik Darshan', cost: 200, latitude: 23.1827, longitude: 75.7682, image_url: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=600' },
        { name: 'Shree Mahakal Lok Corridor', period: 'Afternoon (14:00 - 16:30)', time_slot: 'Afternoon', category: 'Spiritual Heritage', cost: 0, latitude: 23.1845, longitude: 75.7710, image_url: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=600' },
        { name: 'Ram Ghat Kshipra Aarti & Evening Walk', period: 'Evening (18:00 - 20:30)', time_slot: 'Evening', category: 'Ghat Aarti', cost: 50, latitude: 23.1800, longitude: 75.7650, image_url: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=600' }
      ]
    },
    {
      id: 'ayodhya',
      name: 'Ayodhya',
      title: 'Shri Ram Janmabhoomi',
      category: 'Spiritual',
      image: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=600',
      tag: 'Ram Mandir & Saryu',
      coords: [26.7922, 82.1998],
      activities: [
        { name: 'Shri Ram Janmabhoomi Mandir Darshan', period: 'Morning (07:00 - 11:30)', time_slot: 'Morning', category: 'Mandir Darshan', cost: 0, latitude: 26.7956, longitude: 82.1943, image_url: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=600' },
        { name: 'Hanuman Garhi Fort Temple', period: 'Afternoon (14:00 - 16:30)', time_slot: 'Afternoon', category: 'Historic Mandir', cost: 0, latitude: 26.7930, longitude: 82.2020, image_url: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=600' },
        { name: 'Saryu River Ghat Sandhya Aarti', period: 'Evening (18:00 - 20:00)', time_slot: 'Evening', category: 'Ghat Aarti & Laser Show', cost: 0, latitude: 26.8020, longitude: 82.2080, image_url: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=600' }
      ]
    },
    {
      id: 'varanasi',
      name: 'Varanasi',
      title: 'Kashi Vishwanath Dham',
      category: 'Spiritual',
      image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=600',
      tag: 'Ganga Aarti & Ghats',
      coords: [25.3176, 82.9739],
      activities: [
        { name: 'Kashi Vishwanath Corridor & Ganga Snan', period: 'Morning (06:00 - 10:30)', time_slot: 'Morning', category: 'Jyotirlinga', cost: 0, latitude: 25.3109, longitude: 83.0107, image_url: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=600' },
        { name: 'Sarnath Buddhist Heritage Stupa', period: 'Afternoon (13:30 - 16:30)', time_slot: 'Afternoon', category: 'ASI Heritage', cost: 25, latitude: 25.3811, longitude: 83.0214, image_url: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=600' },
        { name: 'Dashashwamedh Ghat Grand Maha Aarti', period: 'Evening (18:30 - 20:30)', time_slot: 'Evening', category: 'Ghat Ceremony', cost: 100, latitude: 25.3075, longitude: 83.0104, image_url: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=600' }
      ]
    },
    {
      id: 'puri',
      name: 'Puri',
      title: 'Jagannath Dham',
      category: 'Spiritual',
      image: 'https://images.unsplash.com/photo-1621252179027-94459d278660?w=600',
      tag: 'Char Dham & Beach',
      coords: [19.8135, 85.8312],
      activities: [
        { name: 'Shree Jagannath Mandir Darshan', period: 'Morning (06:30 - 11:00)', time_slot: 'Morning', category: 'Char Dham', cost: 0, latitude: 19.8049, longitude: 85.8179, image_url: 'https://images.unsplash.com/photo-1621252179027-94459d278660?w=600' },
        { name: 'Konark Sun Temple (ASI Monument)', period: 'Afternoon (13:00 - 16:30)', time_slot: 'Afternoon', category: 'UNESCO Heritage', cost: 40, latitude: 19.8876, longitude: 86.0945, image_url: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=600' },
        { name: 'Golden Beach & Mahaprasad Feast', period: 'Evening (17:30 - 20:00)', time_slot: 'Evening', category: 'Prasad & Sunset', cost: 150, latitude: 19.7980, longitude: 85.8250, image_url: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600' }
      ]
    },
    {
      id: 'rishikesh',
      name: 'Rishikesh',
      title: 'Triveni Ghat & Ganga',
      category: 'Nature',
      image: 'https://images.unsplash.com/photo-1588416936097-41850ab3d86d?w=600',
      tag: 'Yoga & Ganga Aarti',
      coords: [30.0869, 78.2676],
      activities: [
        { name: 'Ram Jhula & Swarg Ashram Walk', period: 'Morning (07:00 - 10:30)', time_slot: 'Morning', category: 'Ashram Heritage', cost: 0, latitude: 30.1235, longitude: 78.3168, image_url: 'https://images.unsplash.com/photo-1588416936097-41850ab3d86d?w=600' },
        { name: 'Beatles Ashram (Chaurasi Kutia)', period: 'Afternoon (14:00 - 16:30)', time_slot: 'Afternoon', category: 'Eco Culture', cost: 150, latitude: 30.1190, longitude: 78.3240, image_url: 'https://images.unsplash.com/photo-1588416936097-41850ab3d86d?w=600' },
        { name: 'Triveni Ghat Maha Aarti', period: 'Evening (18:00 - 20:00)', time_slot: 'Evening', category: 'Ghat Aarti', cost: 0, latitude: 30.0980, longitude: 78.2930, image_url: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=600' }
      ]
    },
    {
      id: 'amritsar',
      name: 'Amritsar',
      title: 'Golden Temple (Harmandir Sahib)',
      category: 'Spiritual',
      image: 'https://images.unsplash.com/photo-1514222134-b57cbb8ce073?w=600',
      tag: 'Spiritual & Langar',
      coords: [31.6200, 74.8765],
      activities: [
        { name: 'Sri Harmandir Sahib & Amrit Sarovar', period: 'Morning (06:00 - 10:30)', time_slot: 'Morning', category: 'Holy Gurdwara', cost: 0, latitude: 31.6200, longitude: 74.8765, image_url: 'https://images.unsplash.com/photo-1514222134-b57cbb8ce073?w=600' },
        { name: 'Jallianwala Bagh Memorial', period: 'Afternoon (13:30 - 15:30)', time_slot: 'Afternoon', category: 'National Monument', cost: 0, latitude: 31.6206, longitude: 74.8801, image_url: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=600' },
        { name: 'Attari-Wagah Border Retreat Ceremony', period: 'Evening (16:30 - 19:30)', time_slot: 'Evening', category: 'Patriotic Heritage', cost: 0, latitude: 31.6042, longitude: 74.5732, image_url: 'https://images.unsplash.com/photo-1514222134-b57cbb8ce073?w=600' }
      ]
    },
    {
      id: 'somnath',
      name: 'Somnath',
      title: 'First Jyotirlinga',
      category: 'Spiritual',
      image: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=600',
      tag: 'Sea Jyotirlinga',
      coords: [20.8880, 70.4012],
      activities: [
        { name: 'Somnath Mahadev Mandir Darshan', period: 'Morning (07:00 - 11:00)', time_slot: 'Morning', category: 'Jyotirlinga', cost: 0, latitude: 20.8880, longitude: 70.4012, image_url: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=600' },
        { name: 'Bhalka Tirth & Triveni Sangam', period: 'Afternoon (14:00 - 16:30)', time_slot: 'Afternoon', category: 'Krishna Heritage', cost: 0, latitude: 20.9020, longitude: 70.4080, image_url: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=600' },
        { name: 'Somnath Sea Promenade Light & Sound Show', period: 'Evening (19:30 - 21:00)', time_slot: 'Evening', category: 'Sound & Light', cost: 50, latitude: 20.8870, longitude: 70.4000, image_url: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=600' }
      ]
    },
    {
      id: 'goa',
      name: 'Goa',
      title: 'Old Goa & Coastal Forts',
      category: 'Heritage',
      image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600',
      tag: 'UNESCO Heritage & Beaches',
      coords: [15.4926, 73.8180],
      activities: [
        { name: 'Basilica of Bom Jesus (UNESCO)', period: 'Morning (09:00 - 12:00)', time_slot: 'Morning', category: 'ASI Heritage', cost: 0, latitude: 15.5009, longitude: 73.9116, image_url: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600' },
        { name: 'Fort Aguada Portuguese Lighthouse', period: 'Afternoon (14:00 - 16:30)', time_slot: 'Afternoon', category: 'Coastal Fort', cost: 50, latitude: 15.4926, longitude: 73.7737, image_url: 'https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?w=600' },
        { name: 'Baga Promenade & Sunset Shacks', period: 'Evening (17:30 - 20:30)', time_slot: 'Evening', category: 'Coastline', cost: 0, latitude: 15.5553, longitude: 73.7517, image_url: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600' }
      ]
    },
    {
      id: 'paris',
      name: 'Paris',
      title: 'Louvre & Eiffel Heritage',
      category: 'International',
      image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600',
      tag: 'Art & Monuments',
      coords: [48.8566, 2.3522],
      activities: [
        { name: 'Eiffel Tower & Champ de Mars', period: 'Morning (09:00 - 12:00)', time_slot: 'Morning', category: 'Monument', cost: 2500, latitude: 48.8584, longitude: 2.2945, image_url: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=600' },
        { name: 'Louvre Museum & Historic Courtyard', period: 'Afternoon (13:30 - 17:00)', time_slot: 'Afternoon', category: 'Museum', cost: 1800, latitude: 48.8606, longitude: 2.3376, image_url: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=600' },
        { name: 'Seine River Sunset Cruise', period: 'Evening (18:00 - 20:30)', time_slot: 'Evening', category: 'Cruise', cost: 1400, latitude: 48.8529, longitude: 2.3500, image_url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600' }
      ]
    },
    {
      id: 'tokyo',
      name: 'Tokyo',
      title: 'Sensō-ji Temple & Asakusa',
      category: 'International',
      image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=600',
      tag: 'Shinto & Heritage',
      coords: [35.6762, 139.6503],
      activities: [
        { name: 'Sensō-ji Temple & Nakamise Street', period: 'Morning (08:30 - 12:00)', time_slot: 'Morning', category: 'Temple', cost: 0, latitude: 35.7148, longitude: 139.7967, image_url: 'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?w=600' },
        { name: 'Meiji Jingu Shinto Shrine & Forest', period: 'Afternoon (13:30 - 16:30)', time_slot: 'Afternoon', category: 'Shinto Shrine', cost: 0, latitude: 35.6764, longitude: 139.6993, image_url: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=600' },
        { name: 'Shibuya Sky & Historic Crossing', period: 'Evening (18:00 - 20:30)', time_slot: 'Evening', category: 'City View', cost: 1200, latitude: 35.6595, longitude: 139.7004, image_url: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=600' }
      ]
    }
  ];

  // Filter destinations by category & search
  const filteredDestinations = destinationsData.filter(d => {
    const matchesCategory = selectedCategory === 'All' 
      || (selectedCategory === 'Spiritual' && d.category === 'Spiritual')
      || (selectedCategory === 'Heritage' && d.category === 'Heritage')
      || (selectedCategory === 'Nature' && d.category === 'Nature')
      || (selectedCategory === 'International' && d.category === 'International');
    
    const matchesSearch = d.name.toLowerCase().includes(searchQuery.toLowerCase())
      || d.title.toLowerCase().includes(searchQuery.toLowerCase())
      || d.tag.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  const activeDestination = destinationsData.find(d => d.name === selectedCity) || destinationsData[0];

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
    <div className="min-h-screen bg-[#070d18] text-slate-100 font-sans flex flex-col selection:bg-emerald-500 selection:text-slate-950">
      
      {/* 1. TOP NAVBAR WITH LEFT-SIDE DROPDOWN */}
      <NavbarDropdown 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onSOSClick={() => alert('🚨 SOS Signal Dispatched! Emergency Coordinates broadcasted to Local Police & Medical Responders.')}
        onAuthClick={() => user ? setUser(null) : setIsAuthOpen(true)}
        user={user}
        selectedCity={selectedCity}
      />

      {/* 2. MAIN DASHBOARD CONTENT */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* ================= MODULE 1: ITINERARY PLANNER ================= */}
        {activeTab === 'itinerary' && (
          <div className="space-y-6">
            
            {/* HERO BANNER (from user's screenshot) */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-900 via-teal-950 to-slate-950 border border-emerald-500/30 p-6 sm:p-8 shadow-2xl">
              <div className="absolute -right-12 -top-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="relative z-10 max-w-3xl space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold uppercase tracking-wider">
                  <Sparkles size={13} className="text-emerald-400" />
                  <span>AICTE 2026/02 • DHARMIK & HERITAGE TOURISM BOOSTER</span>
                </div>
                <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                  Automate Pilgrimage & Spiritual Circuits in Seconds.
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                  Intelligent clustering for Jyotirlingas, Char Dham, Ram Mandir Ayodhya, Ghats, Ashrams, multi-currency budgeting, and verified Vedic guides.
                </p>
              </div>
            </div>

            {/* SEARCH & CATEGORY FILTER BAR */}
            <div className="space-y-3">
              
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-4 top-3.5 text-emerald-400" size={18} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="🔍 Search any pilgrimage, heritage or scenic destination (e.g. Ujjain, Ayodhya, Varanasi, Puri, Rishikesh, Somnath...)"
                  className="w-full pl-11 pr-4 py-3 bg-slate-900/90 border border-slate-800 rounded-2xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-all shadow-inner"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="absolute right-3.5 top-3.5 text-slate-400 hover:text-white">
                    <X size={16} />
                  </button>
                )}
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
                {[
                  { id: 'All', label: 'All Destinations (23 Places)' },
                  { id: 'Spiritual', label: 'Spiritual & Pilgrimage (Dharmik)' },
                  { id: 'Heritage', label: 'ASI Heritage & Forts' },
                  { id: 'Nature', label: 'Nature & Eco-Resorts' },
                  { id: 'International', label: 'International Circuits' }
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3.5 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
                      selectedCategory === cat.id
                        ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                        : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* INTERACTIVE TOURISM GRID (23+ PLACES CAROUSEL) */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Interactive Tourism Grid ({filteredDestinations.length} Places)
                </span>
                <span className="text-xs text-emerald-400 font-semibold">
                  Selected: <span className="underline font-bold">{selectedCity}</span>
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
                {filteredDestinations.map((dest) => {
                  const isSelected = selectedCity === dest.name;
                  return (
                    <div
                      key={dest.id}
                      onClick={() => {
                        setSelectedCity(dest.name);
                        setScheduleGenerated(true);
                      }}
                      className={`group relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-200 ${
                        isSelected 
                          ? 'ring-2 ring-emerald-500 scale-[1.02] shadow-xl shadow-emerald-950/50' 
                          : 'border border-slate-800 hover:border-slate-700 hover:scale-[1.01]'
                      }`}
                    >
                      <div className="h-28 sm:h-32 w-full relative">
                        <img 
                          src={dest.image} 
                          alt={dest.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                        
                        {isSelected && (
                          <div className="absolute top-2 right-2 bg-emerald-500 text-slate-950 p-1 rounded-full shadow-lg">
                            <Check size={12} strokeWidth={3} />
                          </div>
                        )}
                        
                        <div className="absolute bottom-2 left-2 right-2">
                          <h4 className="font-extrabold text-white text-sm leading-tight">{dest.name}</h4>
                          <p className="text-[10px] text-emerald-300 truncate font-medium">{dest.tag}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* TRIP CONFIGURATION BAR (HORIZONTAL CONTROLS) */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                
                {/* 1. Destination */}
                <div className="bg-slate-800/60 border border-slate-700/60 p-3 rounded-xl">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Selected Hub</label>
                  <div className="flex items-center justify-between mt-1">
                    <span className="font-extrabold text-white text-base">{selectedCity}</span>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded">Verified</span>
                  </div>
                </div>

                {/* 2. Currency Selector */}
                <div className="bg-slate-800/60 border border-slate-700/60 p-3 rounded-xl">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Trip Currency</label>
                  <div className="flex items-center gap-2 mt-1">
                    <button
                      onClick={() => setCurrency('INR')}
                      className={`flex-1 py-1 rounded-lg text-xs font-bold transition-all ${currency === 'INR' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-700 text-slate-300'}`}
                    >
                      INR (₹)
                    </button>
                    <button
                      onClick={() => setCurrency('USD')}
                      className={`flex-1 py-1 rounded-lg text-xs font-bold transition-all ${currency === 'USD' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-700 text-slate-300'}`}
                    >
                      USD ($)
                    </button>
                  </div>
                </div>

                {/* 3. Duration */}
                <div className="bg-slate-800/60 border border-slate-700/60 p-3 rounded-xl">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Duration (Days)</label>
                  <div className="flex items-center justify-between mt-1">
                    <button onClick={() => setDays(Math.max(1, days - 1))} className="w-7 h-7 rounded-lg bg-slate-700 font-bold text-white">-</button>
                    <span className="font-extrabold text-white text-base">{days} {days === 1 ? 'Day' : 'Days'}</span>
                    <button onClick={() => setDays(Math.min(14, days + 1))} className="w-7 h-7 rounded-lg bg-slate-700 font-bold text-white">+</button>
                  </div>
                </div>

                {/* 4. Total Budget */}
                <div className="bg-slate-800/60 border border-slate-700/60 p-3 rounded-xl">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Budget Allocation</label>
                  <div className="flex items-center justify-between mt-1">
                    <span className="font-extrabold text-emerald-400 text-base">
                      {currency === 'INR' ? `₹${budget.toLocaleString()}` : `$${Math.round(budget / 85).toLocaleString()}`}
                    </span>
                    <span className="text-[10px] text-slate-400">Total Cap</span>
                  </div>
                </div>

              </div>

              {/* Generate Button */}
              <button
                onClick={() => setScheduleGenerated(true)}
                className="w-full bg-emerald-500 hover:bg-emerald-400 active:scale-[0.99] text-slate-950 font-black py-3 rounded-xl transition-all shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 text-sm tracking-wide"
              >
                <Zap size={16} />
                <span>EXPLORE & GENERATE OPTIMIZED CIRCUIT</span>
              </button>

            </div>

            {/* LIVE INTERACTIVE MAP & ITINERARY TIMELINE (2 COLUMNS) */}
            {scheduleGenerated && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* COLUMN 1: INTERACTIVE MAP (5 Cols) */}
                <div className="lg:col-span-5 space-y-3">
                  <InteractiveMap 
                    destination={selectedCity}
                    centerCoords={activeDestination.coords}
                    activities={activeDestination.activities || []}
                    className="h-80 sm:h-96 w-full"
                  />
                  
                  {/* Waypoint summary pill */}
                  <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-2 text-xs">
                    <div className="flex items-center justify-between font-bold text-slate-300">
                      <span className="flex items-center gap-1.5 text-emerald-400">
                        <Navigation size={14} /> Total Circuit Distance
                      </span>
                      <span>~14.8 km Minimization</span>
                    </div>
                    <p className="text-slate-400 text-[11px]">
                      Stops sequence ordered using Haversine distance matrix for zero travel backtrack.
                    </p>
                  </div>
                </div>

                {/* COLUMN 2: DAY TIMELINE SCHEDULE (7 Cols) */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                    
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <div>
                        <h3 className="font-extrabold text-lg text-white">
                          {selectedCity} Optimized Itinerary ({days} Days)
                        </h3>
                        <p className="text-xs text-slate-400">Chronological slots optimized for Darshan & Heritage timings</p>
                      </div>
                      <span className="text-xs bg-emerald-500/20 text-emerald-400 font-bold px-2.5 py-1 rounded-full">
                        {currency === 'INR' ? `₹${(budget/days).toFixed(0)}/day` : `$${(budget/85/days).toFixed(0)}/day`}
                      </span>
                    </div>

                    {/* Timeline Activity Cards */}
                    <div className="space-y-3">
                      {(activeDestination.activities || []).map((act, idx) => (
                        <div 
                          key={idx} 
                          className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-emerald-500/40 transition-all"
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                              #{idx + 1}
                            </div>
                            <div>
                              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                                {act.period || act.time_slot}
                              </span>
                              <h4 className="font-bold text-white text-sm mt-0.5">{act.name}</h4>
                              <p className="text-xs text-slate-400 mt-0.5">{act.category} • Certified Route</p>
                            </div>
                          </div>

                          <div className="sm:text-right shrink-0 flex sm:flex-col justify-between items-center sm:items-end">
                            <span className="text-xs font-bold text-emerald-400">
                              {currency === 'INR' ? (act.cost ? `₹${act.cost}` : 'Free Entry') : (act.cost ? `$${Math.round(act.cost/85)}` : 'Free')}
                            </span>
                            <span className="text-[10px] text-slate-400">Estimated Ticket</span>
                          </div>
                        </div>
                      ))}
                    </div>

                  </div>
                </div>

              </div>
            )}

          </div>
        )}

        {/* ================= MODULE 2: ASHRAMS & STAYS ================= */}
        {activeTab === 'hotels' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-white">Ashrams, Dharamshalas & Heritage Stays</h2>
                <p className="text-xs text-slate-400">Multi-platform verified comparison for {selectedCity}</p>
              </div>
              <span className="text-xs bg-emerald-500/20 text-emerald-400 font-bold px-3 py-1 rounded-full">
                Best Rate Guaranteed
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3 shadow-xl">
                <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2.5 py-1 rounded-full font-bold">Recommended Ashram</span>
                <h4 className="font-extrabold text-lg text-white">Shri Mahakal Bhakt Ashram & Bhojanalaya</h4>
                <p className="text-xs text-slate-400">Amenities: AC Rooms, Pure Satvik Bhojan, Walking distance to Temple</p>
                <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                  <div>
                    <span className="text-xs text-slate-500 line-through">₹1,800</span>
                    <span className="text-lg font-black text-emerald-400 ml-2">₹1,150 / night</span>
                  </div>
                  <button onClick={() => alert('Booking confirmed for Shri Mahakal Bhakt Ashram!')} className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition-all">Book Ashram</button>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3 shadow-xl">
                <span className="text-xs bg-blue-500/20 text-blue-400 px-2.5 py-1 rounded-full font-bold">Heritage Hotel</span>
                <h4 className="font-extrabold text-lg text-white">The Grand Heritage Palace</h4>
                <p className="text-xs text-slate-400">Amenities: Free WiFi, River View, 24h Hot Water, Traditional Architecture</p>
                <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                  <div>
                    <span className="text-xs text-slate-500 line-through">₹3,500</span>
                    <span className="text-lg font-black text-emerald-400 ml-2">₹2,400 / night</span>
                  </div>
                  <button onClick={() => alert('Booking confirmed for The Grand Heritage Palace!')} className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition-all">Book Room</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= MODULE 3: BUDGET TRACKER ================= */}
        {activeTab === 'budget' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-black text-white">Multi-Currency Real-Time Budget Tracker</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl"><p className="text-xs font-bold text-slate-400 uppercase">Total Allocation</p><p className="text-2xl font-black text-white mt-1">₹{budget.toLocaleString()}</p></div>
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl"><p className="text-xs font-bold text-slate-400 uppercase">Spent So Far</p><p className="text-2xl font-black text-emerald-400 mt-1">₹{Math.round(budget * 0.45).toLocaleString()}</p></div>
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl"><p className="text-xs font-bold text-slate-400 uppercase">Remaining Safe Buffer</p><p className="text-2xl font-black text-amber-400 mt-1">₹{Math.round(budget * 0.55).toLocaleString()}</p></div>
            </div>

            <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-2xl flex items-center gap-3">
              <Sparkles className="text-emerald-400 shrink-0" size={20} />
              <span className="text-xs text-emerald-300 font-medium">
                ✅ Budget Healthy: 45% spent. Safe buffer available for prasad and local transport.
              </span>
            </div>
          </div>
        )}

        {/* ================= MODULE 4: PACKING CHECKLIST ================= */}
        {activeTab === 'packing' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-black text-white">Pilgrimage & Heritage Packing Checklist</h2>
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
              <p className="text-xs text-slate-400">Essential items customized for temple dress codes & long parikrama walks:</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {[
                  'Traditional Attire / Dhoti / Kurta (Required for Garbhagriha)',
                  'Govt ID Proofs (Aadhaar / Voter ID / Passport for VIP Darshan)',
                  'Comfortable Slip-on Footwear (Easy removal at Mandir premises)',
                  'Personal Water Bottle & ORS / Hydration Pack',
                  'Portable Power Bank (10,000 mAh+)',
                  'Puja Samagri Pouch (Chandan, Roli, Dhoop)',
                  'Small Coin / Cash Pouch (For Prasad & Dakshina)',
                  'Emergency First Aid & Personal Prescription Meds'
                ].map((item, idx) => (
                  <label key={idx} className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-xl cursor-pointer hover:bg-slate-800 transition-all border border-slate-700/50">
                    <input type="checkbox" defaultChecked={idx < 3} className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-400 bg-slate-900" />
                    <span className="text-xs font-semibold text-slate-200">{item}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= MODULE 5: SMART ALERTS ================= */}
        {activeTab === 'alerts' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-black text-white">Live Smart Darshan & Weather Alerts</h2>
            <div className="space-y-3">
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <CloudSun className="text-emerald-400" size={26} />
                  <div>
                    <h4 className="font-bold text-white text-sm">{selectedCity} Weather: 24°C Pleasant</h4>
                    <p className="text-xs text-slate-400">Ideal weather for evening Aarti & Parikrama walk. Zero rain probability.</p>
                  </div>
                </div>
                <span className="text-xs bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full font-bold">Good Condition</span>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <AlertTriangle className="text-amber-400" size={26} />
                  <div>
                    <h4 className="font-bold text-white text-sm">Darshan Queue Wait-Time Alert</h4>
                    <p className="text-xs text-slate-400">Current average wait time: ~25 mins. Early morning (05:00 - 07:00) has shortest queue.</p>
                  </div>
                </div>
                <span className="text-xs bg-amber-500/20 text-amber-400 px-3 py-1 rounded-full font-bold">Moderate Crowd</span>
              </div>
            </div>
          </div>
        )}

        {/* ================= MODULE 6: VERIFIED GUIDES ================= */}
        {activeTab === 'guides' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-black text-white">Verified Vedic & Heritage Guides</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center justify-between shadow-xl">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-base">
                    PS
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-base">Pt. Shivam Shastri</h4>
                    <p className="text-xs text-slate-400">Sanskrit, Hindi, English • Rating: ★ 4.9</p>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded">Garbhagriha & Vedic History</span>
                  </div>
                </div>
                <button onClick={() => alert('Guide booked!')} className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition-all">Book (₹500/hr)</button>
              </div>
            </div>
          </div>
        )}

        {/* ================= MODULE 7: SAFETY & SOS ================= */}
        {activeTab === 'safety' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-black text-red-500 flex items-center gap-2">Emergency Safety & SOS Command Center</h2>
            <div className="bg-red-500/10 border border-red-500/30 p-6 rounded-2xl space-y-4">
              <p className="text-xs sm:text-sm text-slate-300">
                Triggering SOS broadcasts simulated emergency telemetry and alerts local police and medical responders with GPS coordinates.
              </p>
              <button
                onClick={() => alert('🚨 SOS Signal Dispatched: Coordinates sent to Local Responders.')}
                className="bg-red-600 hover:bg-red-500 active:scale-95 text-white font-black px-6 sm:px-8 py-3.5 rounded-xl text-xs sm:text-sm shadow-xl shadow-red-950/60 transition-all flex items-center gap-2"
              >
                <Flame size={18} /> BROADCAST EMERGENCY SIGNAL
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                <span className="text-[11px] font-bold text-slate-400 uppercase">National Emergency</span>
                <p className="text-xl font-black text-white mt-1">112</p>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Tourist Helpline</span>
                <p className="text-xl font-black text-emerald-400 mt-1">1363</p>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Ambulance</span>
                <p className="text-xl font-black text-rose-400 mt-1">108</p>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* USER AUTH MODAL */}
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
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-2.5 rounded-xl text-sm transition-all shadow-lg shadow-emerald-500/20"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="mt-auto border-t border-slate-800/80 bg-slate-950/80 backdrop-blur-md py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-emerald-500 text-slate-950 flex items-center justify-center font-black text-[10px]">
              ST
            </div>
            <span className="font-bold text-slate-300">SmartTrip</span>
            <span>• AICTE 2026/02 Pilgrimage & Heritage Tourism Platform</span>
          </div>
          <p className="text-[11px] text-slate-500">
            Intelligent Geo-Clustering & OpenStreetMap Integration
          </p>
        </div>
      </footer>

    </div>
  );
}