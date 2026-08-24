import React, { useState } from 'react';
import { InteractiveMap } from './components/InteractiveMap';
import { 
  MapPin, 
  Hotel, 
  PieChart, 
  CheckSquare, 
  Bell, 
  Users, 
  ShieldAlert, 
  Flame, 
  Search, 
  X, 
  Check, 
  Building2, 
  Navigation, 
  CloudSun, 
  Sparkles, 
  ChevronDown, 
  Menu,
  Clock,
  DollarSign,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Shield,
  Zap,
  Calendar,
  Share2
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('itinerary');
  const [selectedCity, setSelectedCity] = useState('Ujjain');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currency, setCurrency] = useState('INR');
  const [days, setDays] = useState(2);
  const [budget, setBudget] = useState(15000);
  const [scheduleGenerated, setScheduleGenerated] = useState(true);
  const [user, setUser] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownNavOpen, setDropdownNavOpen] = useState(false);

  // 23+ Destinations Dataset
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
        { name: 'Mahakaleshwar Temple Bhasma Aarti & Darshan', period: 'Morning (04:00 - 08:30)', time_slot: 'Morning', category: 'Dharmik Darshan', cost: 200, latitude: 23.1827, longitude: 75.7682, image_url: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=600' },
        { name: 'Shree Mahakal Lok Corridor & Sculptures', period: 'Afternoon (14:00 - 16:30)', time_slot: 'Afternoon', category: 'Spiritual Heritage', cost: 0, latitude: 23.1845, longitude: 75.7710, image_url: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=600' },
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
    }
  ];

  // Filter destinations
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

  const navMenuItems = [
    { id: 'itinerary', label: 'Itinerary Planner', icon: MapPin },
    { id: 'hotels', label: 'Ashrams & Stays', icon: Building2 },
    { id: 'budget', label: 'Budget Tracker', icon: PieChart },
    { id: 'packing', label: 'Packing Checklist', icon: CheckSquare },
    { id: 'alerts', label: 'Smart Alerts', icon: Bell },
    { id: 'guides', label: 'Verified Guides', icon: Users },
    { id: 'safety', label: 'Safety & SOS', icon: ShieldAlert },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans flex flex-col selection:bg-emerald-500 selection:text-white">
      
      {/* 1. TOP NAVBAR (EXACTLY AS IN SCREENSHOT - CLEAN LIGHT THEME) */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200/80 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            
            {/* Left: Brand Logo + Nav Links */}
            <div className="flex items-center gap-6 lg:gap-8">
              
              {/* Brand Logo */}
              <div 
                onClick={() => setActiveTab('itinerary')}
                className="flex items-center gap-2.5 cursor-pointer select-none"
              >
                <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-lg shadow-sm">
                  ST
                </div>
                <span className="text-xl font-extrabold text-slate-900 tracking-tight">Smart<span className="text-emerald-600">Trip</span></span>
              </div>

              {/* Desktop Nav Links */}
              <nav className="hidden lg:flex items-center gap-1.5">
                {navMenuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                        isActive
                          ? 'bg-emerald-50 text-emerald-700 font-bold border border-emerald-200/80 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      <Icon size={16} className={isActive ? 'text-emerald-600' : 'text-slate-400'} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>

              {/* Mobile/Tablet Dropdown Button */}
              <div className="lg:hidden relative">
                <button
                  onClick={() => setDropdownNavOpen(!dropdownNavOpen)}
                  className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 border border-slate-200"
                >
                  <span>Menu</span>
                  <ChevronDown size={14} className={`transition-transform ${dropdownNavOpen ? 'rotate-180' : ''}`} />
                </button>

                {dropdownNavOpen && (
                  <div className="absolute left-0 mt-2 w-60 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 z-50">
                    {navMenuItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = activeTab === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            setActiveTab(item.id);
                            setDropdownNavOpen(false);
                          }}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-left ${
                            isActive ? 'bg-emerald-50 text-emerald-700 font-bold' : 'text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <Icon size={16} className={isActive ? 'text-emerald-600' : 'text-slate-400'} />
                          <span>{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

            </div>

            {/* Right: User Pill + Emergency SOS */}
            <div className="flex items-center gap-3">
              
              {/* User Sign In / Profile Pill */}
              <div className="flex items-center gap-2 bg-slate-100/90 border border-slate-200/80 rounded-full px-3 py-1.5 text-xs">
                <div className="w-5 h-5 rounded-full bg-slate-300 text-slate-700 flex items-center justify-center font-bold text-[10px]">
                  {user ? user.name[0].toUpperCase() : 'G'}
                </div>
                <span className="text-slate-600 font-medium hidden sm:inline">
                  {user ? user.name : 'Guest User'}
                </span>
                <button
                  onClick={() => user ? setUser(null) : setIsAuthOpen(true)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-2.5 py-0.5 rounded-full text-[11px] transition-colors"
                >
                  {user ? 'Logout' : 'Sign In'}
                </button>
              </div>

              {/* Red EMERGENCY SOS Button */}
              <button
                onClick={() => alert('🚨 EMERGENCY SOS: Coordinates dispatched to 112 Police and 108 Ambulance.')}
                className="bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-bold px-4 py-2 rounded-xl text-xs sm:text-sm shadow-sm transition-all flex items-center gap-1.5"
              >
                <Flame size={15} />
                <span>EMERGENCY SOS</span>
              </button>

            </div>

          </div>
        </div>
      </header>

      {/* 2. MAIN BODY CONTENT */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* MODULE 1: ITINERARY PLANNER (EXACTLY MATCHING SCREENSHOT) */}
        {activeTab === 'itinerary' && (
          <div className="space-y-6">
            
            {/* GREEN BANNER (FROM SCREENSHOT) */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-800 to-emerald-950 text-white p-6 sm:p-8 shadow-md">
              <div className="max-w-3xl space-y-2 relative z-10">
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/10 text-emerald-300 text-xs font-semibold tracking-wide border border-white/10">
                  <span>AICTE 2026/02 • DHARMIK & HERITAGE TOURISM BOOSTER</span>
                </div>
                <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                  Automate Pilgrimage & Spiritual Circuits in Seconds.
                </h1>
                <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed max-w-2xl font-normal">
                  Intelligent clustering for Jyotirlingas, Char Dham, Ram Mandir Ayodhya, Ghats, Ashrams, multi-currency budgeting, and verified Vedic guides.
                </p>
              </div>
            </div>

            {/* SEARCH INPUT BAR */}
            <div className="relative">
              <Search className="absolute left-4 top-3.5 text-slate-400" size={18} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="SEARCH ANY PILGRIMAGE, HERITAGE OR SCENIC DESTINATION... (e.g. Ujjain, Ayodhya, Varanasi, Puri, Rishikesh, Somnath...)"
                className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-all shadow-xs"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600">
                  <X size={16} />
                </button>
              )}
            </div>

            {/* CATEGORY FILTER PILLS */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
              {[
                { id: 'All', label: 'All Destinations' },
                { id: 'Spiritual', label: 'Spiritual & Pilgrimage (Dharmik)' },
                { id: 'Heritage', label: 'ASI Heritage & Forts' },
                { id: 'Nature', label: 'Nature & Eco-Resorts' },
                { id: 'International', label: 'International Circuits' }
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-full font-bold whitespace-nowrap transition-all text-xs ${
                    selectedCategory === cat.id
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* INTERACTIVE TOURISM GRID */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-slate-800">
                  Interactive Tourism Grid ({filteredDestinations.length} Places)
                </h3>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-4 gap-4">
                {filteredDestinations.slice(0, 8).map((dest) => {
                  const isSelected = selectedCity === dest.name;
                  return (
                    <div
                      key={dest.id}
                      onClick={() => {
                        setSelectedCity(dest.name);
                        setScheduleGenerated(true);
                      }}
                      className={`group relative overflow-hidden rounded-2xl cursor-pointer transition-all bg-white border ${
                        isSelected 
                          ? 'border-emerald-600 ring-2 ring-emerald-600/30 shadow-md scale-[1.01]' 
                          : 'border-slate-200 hover:border-slate-300 shadow-xs'
                      }`}
                    >
                      <div className="h-32 sm:h-36 w-full relative">
                        <img 
                          src={dest.image} 
                          alt={dest.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                        
                        {isSelected && (
                          <div className="absolute top-2 right-2 bg-emerald-600 text-white p-1 rounded-full shadow-sm">
                            <Check size={12} strokeWidth={3} />
                          </div>
                        )}
                        
                        <div className="absolute bottom-2.5 left-3 right-3">
                          <h4 className="font-extrabold text-white text-base leading-tight">{dest.name}</h4>
                          <p className="text-[11px] text-emerald-200 truncate font-medium mt-0.5">{dest.title}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* HORIZONTAL TRIP SETTINGS BAR (FROM SCREENSHOT) */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full md:w-auto flex-1">
                
                {/* 1. Destination */}
                <div className="border-r border-slate-100 pr-4">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Selected Destination</span>
                  <span className="font-black text-slate-800 text-base">{selectedCity}</span>
                </div>

                {/* 2. Currency */}
                <div className="border-r border-slate-100 pr-4">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Trip Currency</span>
                  <div className="flex items-center gap-1 mt-0.5">
                    <button
                      onClick={() => setCurrency('INR')}
                      className={`text-xs font-bold px-2 py-0.5 rounded ${currency === 'INR' ? 'bg-emerald-100 text-emerald-800' : 'text-slate-500'}`}
                    >
                      INR (₹)
                    </button>
                    <button
                      onClick={() => setCurrency('USD')}
                      className={`text-xs font-bold px-2 py-0.5 rounded ${currency === 'USD' ? 'bg-emerald-100 text-emerald-800' : 'text-slate-500'}`}
                    >
                      USD ($)
                    </button>
                  </div>
                </div>

                {/* 3. Duration */}
                <div className="border-r border-slate-100 pr-4">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Duration (Days)</span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <button onClick={() => setDays(Math.max(1, days - 1))} className="w-5 h-5 rounded bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center">-</button>
                    <span className="font-extrabold text-slate-800 text-sm">{days} Days</span>
                    <button onClick={() => setDays(Math.min(14, days + 1))} className="w-5 h-5 rounded bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center">+</button>
                  </div>
                </div>

                {/* 4. Total Budget */}
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Budget (INR)</span>
                  <span className="font-black text-emerald-700 text-base">
                    {currency === 'INR' ? `₹${budget.toLocaleString()}` : `$${Math.round(budget/85).toLocaleString()}`}
                  </span>
                </div>

              </div>

              {/* EXPLORE BUTTON */}
              <button
                onClick={() => setScheduleGenerated(true)}
                className="w-full md:w-auto bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white font-bold px-8 py-3 rounded-xl transition-all shadow-sm text-sm whitespace-nowrap"
              >
                EXPLORE
              </button>

            </div>

            {/* INTERACTIVE MAP + ITINERARY RESULTS */}
            {scheduleGenerated && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Interactive Leaflet Map */}
                <div className="lg:col-span-6 space-y-3">
                  <div className="bg-white border border-slate-200 p-4 rounded-3xl shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MapPin className="text-emerald-600" size={18} />
                        <h3 className="font-extrabold text-slate-800 text-base">Live Route Map: {selectedCity}</h3>
                      </div>
                      <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full">
                        {activeDestination.activities?.length || 3} Waypoints
                      </span>
                    </div>

                    <InteractiveMap 
                      destination={selectedCity}
                      centerCoords={activeDestination.coords}
                      activities={activeDestination.activities || []}
                      className="h-80 sm:h-96 w-full"
                    />

                    <p className="text-[11px] text-slate-500 text-center">
                      Interactive OpenStreetMap • Numbered stops connected in chronological sequence
                    </p>
                  </div>
                </div>

                {/* Day-by-Day Schedule Timeline */}
                <div className="lg:col-span-6 space-y-3">
                  <div className="bg-white border border-slate-200 p-5 rounded-3xl shadow-sm space-y-4">
                    
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div>
                        <h3 className="font-extrabold text-slate-900 text-lg">{selectedCity} Circuit Plan</h3>
                        <p className="text-xs text-slate-500">{days} Days Optimized Itinerary</p>
                      </div>
                      <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-full">
                        {currency === 'INR' ? `₹${(budget/days).toFixed(0)}/day` : `$${(budget/85/days).toFixed(0)}/day`}
                      </span>
                    </div>

                    <div className="space-y-3">
                      {(activeDestination.activities || []).map((act, idx) => (
                        <div key={idx} className="bg-slate-50 border border-slate-200/80 p-3.5 rounded-2xl flex items-start gap-3 hover:border-emerald-300 transition-colors">
                          <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                            {idx + 1}
                          </div>
                          <div className="flex-1">
                            <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">{act.period || act.time_slot}</span>
                            <h4 className="font-bold text-slate-900 text-sm mt-0.5">{act.name}</h4>
                            <p className="text-xs text-slate-500 mt-0.5">{act.category} • Cost: {act.cost ? `₹${act.cost}` : 'Free Entry'}</p>
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

        {/* MODULE 2: ASHRAMS & STAYS */}
        {activeTab === 'hotels' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-extrabold text-slate-900">Ashrams, Dharamshalas & Stays</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white border border-slate-200 p-5 rounded-2xl space-y-3 shadow-xs">
                <span className="text-xs bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full font-bold">Recommended Ashram</span>
                <h4 className="font-extrabold text-lg text-slate-900">Shri Mahakal Bhakt Ashram</h4>
                <p className="text-xs text-slate-500">AC Rooms, Pure Satvik Bhojan, 200m from Mandir</p>
                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <span className="text-base font-black text-emerald-700">₹1,150 / night</span>
                  <button onClick={() => alert('Booked successfully!')} className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-4 py-2 rounded-xl text-xs">Book Ashram</button>
                </div>
              </div>
              <div className="bg-white border border-slate-200 p-5 rounded-2xl space-y-3 shadow-xs">
                <span className="text-xs bg-blue-100 text-blue-800 px-2.5 py-1 rounded-full font-bold">Heritage Stay</span>
                <h4 className="font-extrabold text-lg text-slate-900">The Grand Heritage Palace</h4>
                <p className="text-xs text-slate-500">Free WiFi, Traditional architecture, River view</p>
                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <span className="text-base font-black text-emerald-700">₹2,400 / night</span>
                  <button onClick={() => alert('Booked successfully!')} className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-4 py-2 rounded-xl text-xs">Book Room</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODULE 3: BUDGET TRACKER */}
        {activeTab === 'budget' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-extrabold text-slate-900">Multi-Currency Real-Time Budget Tracker</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs"><p className="text-xs font-bold text-slate-400 uppercase">Total Budget</p><p className="text-2xl font-black text-slate-900 mt-1">₹{budget.toLocaleString()}</p></div>
              <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs"><p className="text-xs font-bold text-slate-400 uppercase">Spent</p><p className="text-2xl font-black text-emerald-700 mt-1">₹{Math.round(budget * 0.45).toLocaleString()}</p></div>
              <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs"><p className="text-xs font-bold text-slate-400 uppercase">Remaining</p><p className="text-2xl font-black text-amber-600 mt-1">₹{Math.round(budget * 0.55).toLocaleString()}</p></div>
            </div>
          </div>
        )}

        {/* MODULE 4: PACKING CHECKLIST */}
        {activeTab === 'packing' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-extrabold text-slate-900">Pilgrimage & Heritage Packing Checklist</h2>
            <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-3 shadow-xs">
              {[
                'Traditional Attire / Dhoti / Kurta (Mandir Garbhagriha)',
                'Govt ID Proof (Aadhaar / Voter ID for VIP Darshan)',
                'Comfortable Walking Sandals (Easy removal at premises)',
                'Water Bottle & Electrolytes',
                'Power Bank & Mobile Charger',
                'Emergency First Aid & Personal Prescription Meds'
              ].map((item, idx) => (
                <label key={idx} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors border border-slate-200/60">
                  <input type="checkbox" defaultChecked={idx < 3} className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500" />
                  <span className="text-xs font-semibold text-slate-800">{item}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* MODULE 5: SMART ALERTS */}
        {activeTab === 'alerts' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-extrabold text-slate-900">Smart Alerts & Darshan Queues</h2>
            <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CloudSun className="text-emerald-600" size={24} />
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{selectedCity} Weather: 24°C Pleasant</h4>
                  <p className="text-xs text-slate-500">Zero rain probability. Ideal for evening parikrama.</p>
                </div>
              </div>
              <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-full">Good Condition</span>
            </div>
          </div>
        )}

        {/* MODULE 6: GUIDES */}
        {activeTab === 'guides' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-extrabold text-slate-900">Verified Vedic & Heritage Guides</h2>
            <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs flex items-center justify-between max-w-xl">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">PS</div>
                <div>
                  <h4 className="font-bold text-slate-900">Pt. Shivam Shastri</h4>
                  <p className="text-xs text-slate-500">Sanskrit, Hindi, English • Rating: ★ 4.9</p>
                </div>
              </div>
              <button onClick={() => alert('Guide booked!')} className="bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs">Book (₹500/hr)</button>
            </div>
          </div>
        )}

        {/* MODULE 7: SAFETY & SOS */}
        {activeTab === 'safety' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-extrabold text-rose-600">Safety & Emergency Command Center</h2>
            <div className="bg-rose-50 border border-rose-200 p-6 rounded-2xl space-y-4">
              <p className="text-xs text-rose-800">Triggering SOS broadcasts simulated emergency telemetry and alerts local police and medical responders.</p>
              <button onClick={() => alert('🚨 SOS Signal Dispatched!')} className="bg-rose-600 text-white font-black px-6 py-3 rounded-xl text-xs shadow-md">
                BROADCAST EMERGENCY SIGNAL
              </button>
            </div>
          </div>
        )}

      </main>

      {/* USER AUTH MODAL */}
      {isAuthOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-md p-6 space-y-4 shadow-2xl relative">
            <button onClick={() => setIsAuthOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
              <X size={18} />
            </button>
            <h3 className="text-xl font-extrabold text-slate-900">Sign In to SmartTrip</h3>
            <div>
              <label className="text-xs font-bold text-slate-600">Email Address</label>
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="name@example.com"
                className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-emerald-600"
              />
            </div>
            <button
              onClick={handleAuth}
              className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2.5 rounded-xl text-sm transition-all shadow-xs"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-emerald-600 text-white flex items-center justify-center font-black text-[10px]">
              ST
            </div>
            <span className="font-bold text-slate-700">SmartTrip</span>
            <span>• AICTE 2026/02 Pilgrimage & Heritage Tourism Booster</span>
          </div>
          <p className="text-[11px] text-slate-400">
            OpenStreetMap Route Optimization Engine
          </p>
        </div>
      </footer>

    </div>
  );
}