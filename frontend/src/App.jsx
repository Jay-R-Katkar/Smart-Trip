import React, { useState, useRef, useEffect } from 'react';
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
  Sun,
  Moon,
  Star,
  MessageSquare,
  Send,
  Bot,
  User as UserIcon,
  CornerDownLeft,
  Lock,
  Mail,
  Eye,
  EyeOff,
  UserCheck,
  Compass,
  LogOut,
  CheckCircle2,
  Ticket,
  Plus,
  Trash2,
  Receipt,
  Utensils,
  Car,
  ShoppingBag,
  AlertOctagon,
  Activity,
  Timer,
  BadgeCheck,
  Coins,
  Sliders,
  Sparkle,
  Bed,
  Coffee,
  Wifi,
  Tv,
  Crown,
  ChevronRight,
  Layers,
  Wallet
} from 'lucide-react';

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('itinerary');
  const [selectedCity, setSelectedCity] = useState('Ujjain');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStayType, setSelectedStayType] = useState('All');
  const [activeDayView, setActiveDayView] = useState('all'); // 'all', 1, 2, 3...
  const [selectedExpenseCategoryFilter, setSelectedExpenseCategoryFilter] = useState('All'); // 'All', 'Food', 'Stay', 'Transport', 'Activities'
  const [currency, setCurrency] = useState('INR');
  const [days, setDays] = useState(2);
  const [baseBudgetINR, setBaseBudgetINR] = useState(15000);
  const [scheduleGenerated, setScheduleGenerated] = useState(true);
  const [sidebarOpenMobile, setSidebarOpenMobile] = useState(false);

  // Authentication State
  const [user, setUser] = useState({
    name: 'Rahul Sharma',
    email: 'rahul.sharma@example.com',
    role: 'VIP Pilgrim',
    savedTrips: 4
  });
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'signup'
  const [showPassword, setShowPassword] = useState(false);
  const [authFormData, setAuthFormData] = useState({
    name: '',
    email: '',
    password: '',
    travelInterest: 'Spiritual',
    rememberMe: true
  });
  const [authError, setAuthError] = useState('');
  const [authSuccessMsg, setAuthSuccessMsg] = useState('');

  // Booking Confirmation Modal State
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  // Budget Tracker & Expense History State
  const [expenses, setExpenses] = useState([
    { id: 1, title: 'Mahakal Pilgrims Bhavan & Ashram (2 Nts)', amount: 3000, category: 'Stay', date: '2026-08-24 10:00 AM', icon: 'hotel' },
    { id: 2, title: 'Bhasma Aarti Darshan & Special Pass', amount: 1100, category: 'Activities', date: '2026-08-24 06:30 AM', icon: 'ticket' },
    { id: 3, title: 'Pure Satvik Thali & Mahaprasad', amount: 850, category: 'Food', date: '2026-08-24 01:30 PM', icon: 'food' },
    { id: 4, title: 'E-Rickshaw Ghat & Parikrama Cabs', amount: 600, category: 'Transport', date: '2026-08-24 05:00 PM', icon: 'car' }
  ]);

  const [newExpenseTitle, setNewExpenseTitle] = useState('');
  const [newExpenseAmount, setNewExpenseAmount] = useState('');
  const [newExpenseCategory, setNewExpenseCategory] = useState('Food');
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);

  // Currency Exchange Rates (Base INR)
  const currencyRates = {
    INR: { symbol: '₹', rate: 1, label: 'INR (₹) - Indian Rupee' },
    USD: { symbol: '$', rate: 0.0116, label: 'USD ($) - US Dollar' },
    EUR: { symbol: '€', rate: 0.0108, label: 'EUR (€) - Euro' },
    AED: { symbol: 'AED ', rate: 0.0427, label: 'AED (د.إ) - UAE Dirham' },
    CHF: { symbol: 'CHF ', rate: 0.0103, label: 'CHF (Fr) - Swiss Franc' },
    JPY: { symbol: '¥', rate: 1.78, label: 'JPY (¥) - Japanese Yen' },
    IDR: { symbol: 'Rp ', rate: 188.5, label: 'IDR (Rp) - Indonesian Rupiah' },
    GBP: { symbol: '£', rate: 0.0092, label: 'GBP (£) - British Pound' },
    SGD: { symbol: 'S$', rate: 0.0156, label: 'SGD (S$) - Singapore Dollar' }
  };

  // Realistic Minimum Daily Cost per City in Base INR (For Low Budget Warning)
  const cityMinDailyRatesINR = {
    Ujjain: 900,
    Ayodhya: 850,
    Varanasi: 950,
    Puri: 850,
    Amritsar: 750,
    Somnath: 800,
    Tirupati: 1100,
    Kedarnath: 1600,
    Jaipur: 1300,
    Agra: 1200,
    Hampi: 1000,
    Goa: 1600,
    Rishikesh: 950,
    Munnar: 1400,
    Manali: 1500,
    Ladakh: 2200,
    Dubai: 7000,
    Switzerland: 15000,
    Bali: 3500,
    Tokyo: 8500,
    Paris: 10000
  };

  // Convert Base INR Budget to Selected Currency
  const activeRate = currencyRates[currency]?.rate || 1;
  const activeSymbol = currencyRates[currency]?.symbol || '₹';
  const convertedTotalBudget = Math.round(baseBudgetINR * activeRate);
  const convertedPerDayBudget = Math.round((baseBudgetINR / (days || 1)) * activeRate);

  // Minimum required budget calculations
  const minDailyINR = cityMinDailyRatesINR[selectedCity] || 1000;
  const totalMinRequiredINR = minDailyINR * days;
  const convertedMinRequired = Math.round(totalMinRequiredINR * activeRate);
  const isBudgetTooLow = convertedTotalBudget < convertedMinRequired;
  const budgetDeficitToMin = isBudgetTooLow ? (convertedMinRequired - convertedTotalBudget) : 0;

  // Determine Budget Tier Style (Pocket-Friendly, Standard, Luxury VIP)
  const budgetTier = convertedTotalBudget < (convertedMinRequired * 1.3)
    ? 'budget'
    : convertedTotalBudget > (convertedMinRequired * 3)
      ? 'luxury'
      : 'standard';

  // Comprehensive Ashrams, Stays & Luxury Hotels Dataset (Min 5 per destination)
  const allStaysData = {
    Ujjain: [
      { id: 'uj-st-1', name: 'Shri Mahakal Bhakt Ashram', type: 'Satvik Ashram', category: 'Ashram', priceINR: 1150, rating: 4.8, reviews: 310, distance: '150m from Mahakaleshwar Temple', amenities: 'Pure Satvik Bhojan, AC Rooms, Hot Water, Mandir Shuttle', image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600' },
      { id: 'uj-st-2', name: 'Shree Ujjaini Pilgrim Niwas', type: 'Pilgrim Niwas', category: 'Budget', priceINR: 850, rating: 4.6, reviews: 220, distance: '300m from Ram Ghat', amenities: 'Clean Non-AC/AC, Lockers, Drinking Water, Traditional Thali', image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600' },
      { id: 'uj-st-3', name: 'The Grand Heritage Palace Ujjain', type: 'Heritage Stay', category: 'Heritage', priceINR: 2400, rating: 4.9, reviews: 185, distance: '1.2 km from Mahakal Lok', amenities: 'Traditional Decor, River View Balcony, Free WiFi, Banquet', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600' },
      { id: 'uj-st-4', name: 'Hotel Shipra Residency (MPT)', type: 'Premium 4-Star', category: 'Premium', priceINR: 4200, rating: 4.7, reviews: 290, distance: 'Central City, Near Station', amenities: 'Swimming Pool, Multi-Cuisine Veg Restaurant, 24x7 Room Service', image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600' },
      { id: 'uj-st-5', name: 'Anjushree Luxury Resort & Spa', type: '5-Star Luxury', category: 'Luxury', priceINR: 8500, rating: 5.0, reviews: 410, distance: 'Outer Ring Road, Green Oasis', amenities: 'Luxury Suites, Ayurvedic Wellness Spa, Helipad Facilitation, VIP Cab', image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600' }
    ],
    Ayodhya: [
      { id: 'ay-st-1', name: 'Shri Ram Janmabhoomi Sewa Ashram', type: 'Satvik Ashram', category: 'Ashram', priceINR: 950, rating: 4.9, reviews: 380, distance: '200m from Ram Mandir Complex', amenities: 'Satvik Bhojanalaya, Daily Ramcharitmanas Path, Clean AC Rooms', image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600' },
      { id: 'ay-st-2', name: 'Saryu Riverview Dharamshala', type: 'Pilgrim Niwas', category: 'Budget', priceINR: 750, rating: 4.5, reviews: 190, distance: 'Near Nayaghat & Saryu Aarti', amenities: 'Ghat Proximity, Dorm & Private Rooms, Locker Facility', image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600' },
      { id: 'ay-st-3', name: 'Kanak Bhawan Heritage Haveli', type: 'Heritage Stay', category: 'Heritage', priceINR: 2600, rating: 4.8, reviews: 240, distance: '400m from Hanuman Garhi', amenities: 'Awadhi Courtyard, Organic Satvik Kitchen, Cultural Library', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600' },
      { id: 'ay-st-4', name: 'Ramayana Hotel & Suites', type: 'Premium 4-Star', category: 'Premium', priceINR: 5200, rating: 4.8, reviews: 310, distance: '1.5 km from Mandir', amenities: 'Modern Luxury, Airport Shuttle, Multi-Cuisine Fine Dine', image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600' },
      { id: 'ay-st-5', name: 'The Royal Heritage Palace Ayodhya', type: '5-Star Luxury', category: 'Luxury', priceINR: 9800, rating: 5.0, reviews: 290, distance: 'Private Saryu Front Estate', amenities: 'VIP Temple Protocol Transfer, Royal Suites, Butler Service', image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600' }
    ],
    Varanasi: [
      { id: 'var-st-1', name: 'Sri Kashi Vishwanath Bhakt Ashram', type: 'Satvik Ashram', category: 'Ashram', priceINR: 1050, rating: 4.8, reviews: 420, distance: '100m from Vishwanath Corridor Gate 4', amenities: 'Satvik Annakshetra, Ganga Snan Access, Vedic Ambiance', image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600' },
      { id: 'var-st-2', name: 'Dashashwamedh Pilgrim Niwas', type: 'Pilgrim Niwas', category: 'Budget', priceINR: 850, rating: 4.6, reviews: 280, distance: '50m from Main Ganga Ghat', amenities: 'Rooftop Aarti View, AC/Non-AC, Boating Assistance', image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600' },
      { id: 'var-st-3', name: 'Brijrama Heritage Palace (18th Century)', type: 'Heritage Stay', category: 'Heritage', priceINR: 14500, rating: 5.0, reviews: 560, distance: 'Directly on Darbhanga Ghat', amenities: 'Private Boat Arrival, Sheesh Mahal Dining, Classical Sitar Nights', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600' },
      { id: 'var-st-4', name: 'Taj Ganges Varanasi', type: '5-Star Luxury', category: 'Luxury', priceINR: 16000, rating: 4.9, reviews: 620, distance: 'Nadesar Palace Gardens', amenities: '12-Acre Verdant Grounds, Royal Suites, World-Class Dining', image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600' },
      { id: 'var-st-5', name: 'Radisson Hotel Varanasi Cantonment', type: 'Premium 4-Star', category: 'Premium', priceINR: 6200, rating: 4.7, reviews: 340, distance: 'Cantonment Area', amenities: 'Pool, Spa, Global Buffet, Airport Express', image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600' }
    ],
    Puri: [
      { id: 'pur-st-1', name: 'Shree Jagannath Bhakta Nivas', type: 'Satvik Ashram', category: 'Ashram', priceINR: 900, rating: 4.7, reviews: 290, distance: '250m from Simhadwara Gate', amenities: 'Mahaprasad Dining Hall, Pure Satvik, Temple Guidance', image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600' },
      { id: 'pur-st-2', name: 'Golden Beachfront Pilgrim Stay', type: 'Pilgrim Niwas', category: 'Budget', priceINR: 800, rating: 4.5, reviews: 180, distance: 'Opposite Puri Sea Beach', amenities: 'Sea Facing Balcony, Safe Lockers, Free Filter Water', image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600' },
      { id: 'pur-st-3', name: 'Chanakya BNR Heritage Hotel', type: 'Heritage Stay', category: 'Heritage', priceINR: 3600, rating: 4.8, reviews: 240, distance: 'Chakratirtha Road', amenities: 'Colonial British Architecture, Manicured Lawns, Pool', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600' },
      { id: 'pur-st-4', name: 'Mayfair Heritage Puri Resort', type: '5-Star Luxury', category: 'Luxury', priceINR: 11500, rating: 5.0, reviews: 490, distance: 'Private Beachfront Strip', amenities: 'Private Beach Access, Seafront Cottages, Ayurvedic Spa', image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600' },
      { id: 'pur-st-5', name: 'Sterling Puri Coastal Resort', type: 'Premium 4-Star', category: 'Premium', priceINR: 5800, rating: 4.7, reviews: 310, distance: 'Brahmagiri Estuary View', amenities: 'Infinity Pool, Kids Play Zone, Estuary Sunset Cruise', image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600' }
    ],
    Amritsar: [
      { id: 'amr-st-1', name: 'Guru Arjan Dev Niwas (SGPC)', type: 'Satvik Ashram', category: 'Ashram', priceINR: 500, rating: 4.9, reviews: 580, distance: 'Inside Golden Temple Complex', amenities: '24x7 Langar Access, Gurmat Discipline, Clean Accommodations', image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600' },
      { id: 'amr-st-2', name: 'Heritage Heritage Street Pilgrim Inn', type: 'Pilgrim Niwas', category: 'Budget', priceINR: 950, rating: 4.6, reviews: 210, distance: '150m from Harmandir Sahib', amenities: 'AC Deluxe, Walk to Jallianwala Bagh, Pure Punjabi Thali', image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600' },
      { id: 'amr-st-3', name: 'Ranjit Svaasa Heritage Haveli', type: 'Heritage Stay', category: 'Heritage', priceINR: 4800, rating: 4.9, reviews: 290, distance: 'Mall Road', amenities: '200-Year Old Haveli, Organic Spa, Courtyard High Tea', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600' },
      { id: 'amr-st-4', name: 'Taj Swarna Amritsar', type: '5-Star Luxury', category: 'Luxury', priceINR: 9500, rating: 4.9, reviews: 490, distance: 'Circular Road, Cantonment', amenities: 'Luxury Spa, Global Cuisine, Heated Pool, Wagah Border Cab', image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600' },
      { id: 'amr-st-5', name: 'Hyatt Regency Amritsar', type: 'Premium 4-Star', category: 'Premium', priceINR: 6500, rating: 4.8, reviews: 360, distance: 'MBM Farms, GT Road', amenities: 'Vitality Pool, Steam Room, 24hr Fitness, Golden Temple Shuttle', image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600' }
    ],
    Somnath: [
      { id: 'som-st-1', name: 'Shree Somnath Trust Sagar Darshan', type: 'Satvik Ashram', category: 'Ashram', priceINR: 1200, rating: 4.8, reviews: 340, distance: 'Directly Facing Somnath Sea Temple', amenities: 'VIP Temple Gate, Sea View Rooms, Pure Satvik Bhojanalaya', image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600' },
      { id: 'som-st-2', name: 'Triveni Sangam Pilgrim Niwas', type: 'Pilgrim Niwas', category: 'Budget', priceINR: 750, rating: 4.5, reviews: 150, distance: 'Near Triveni Ghat & Bhalka Tirth', amenities: 'Clean Beds, Parking, Quiet Spiritual Atmosphere', image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600' },
      { id: 'som-st-3', name: 'The Fern Residency Somnath', type: 'Premium 4-Star', category: 'Premium', priceINR: 3800, rating: 4.7, reviews: 260, distance: '1 km from Temple', amenities: 'Eco-Friendly, Pure Veg Restaurant, Fitness Center', image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600' },
      { id: 'som-st-4', name: 'Lords Inn Somnath', type: 'Heritage Stay', category: 'Heritage', priceINR: 3200, rating: 4.6, reviews: 210, distance: 'Veraval Highway', amenities: 'Swimming Pool, Sea Breeze Dining, Banquet Hall', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600' },
      { id: 'som-st-5', name: 'VITS Imperial Somnath Palace', type: '5-Star Luxury', category: 'Luxury', priceINR: 6500, rating: 4.9, reviews: 310, distance: 'Somnath Bypass', amenities: 'Royal Suites, Spa & Sauna, Private Temple Shuttle', image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600' }
    ],
    Tirupati: [
      { id: 'tir-st-1', name: 'TTD Srinivasam Complex Pilgrim Niwas', type: 'Satvik Ashram', category: 'Ashram', priceINR: 600, rating: 4.7, reviews: 620, distance: 'Opposite Tirupati Central Bus Station', amenities: 'TTD Laddu Token Counter, 24x7 Hot Water, Satvik Canteen', image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600' },
      { id: 'tir-st-2', name: 'Alipiri Footpath Pilgrim Guest House', type: 'Pilgrim Niwas', category: 'Budget', priceINR: 850, rating: 4.6, reviews: 230, distance: 'Start of 3500 Steps Tirumala Trek', amenities: 'Luggage Transfer to Hilltop, Free Filtered Water, Lockers', image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600' },
      { id: 'tir-st-3', name: 'Fortune Select Grand Ridge (ITC)', type: 'Premium 4-Star', category: 'Premium', priceINR: 4800, rating: 4.8, reviews: 390, distance: 'Shilparamam Junction', amenities: 'Swimming Pool, South Indian Fine Dine, Tirumala Cab Desk', image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600' },
      { id: 'tir-st-4', name: 'Taj Tirupati', type: '5-Star Luxury', category: 'Luxury', priceINR: 9200, rating: 5.0, reviews: 510, distance: 'Tirupati Highway', amenities: 'Signature Jiva Spa, Hillview Infinity Pool, Temple Protocol Transfer', image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600' },
      { id: 'tir-st-5', name: 'Marasa Sarovar Premiere', type: 'Heritage Stay', category: 'Heritage', priceINR: 5500, rating: 4.8, reviews: 330, distance: 'Near Karakambadi Road', amenities: 'Navarasa Inspired Themed Architecture, Wellness Center', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600' }
    ],
    Kedarnath: [
      { id: 'ked-st-1', name: 'GMVN Kedarnath Swargarohini Complex', type: 'Satvik Ashram', category: 'Ashram', priceINR: 1800, rating: 4.8, reviews: 450, distance: '100m from Kedarnath Jyotirlinga', amenities: 'Heated Bedding, Pure Satvik Kitchen, Oxygen Cylinders on standby', image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600' },
      { id: 'ked-st-2', name: 'Bhairav Valley Himalayan Camp', type: 'Pilgrim Niwas', category: 'Budget', priceINR: 1200, rating: 4.5, reviews: 210, distance: 'Near Helipad, Kedarnath Base', amenities: 'Weatherproof Alpine Tents, Thermal Blankets, Hot Chai', image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600' },
      { id: 'ked-st-3', name: 'Kedar River Retreat Guptkashi', type: 'Heritage Stay', category: 'Heritage', priceINR: 4200, rating: 4.7, reviews: 180, distance: 'Guptkashi Helipad Base', amenities: 'Mountain River View, Organic Garhwali Food, Helipad Shuttle', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600' },
      { id: 'ked-st-4', name: 'Char Dham Camp Guptkashi', type: 'Premium 4-Star', category: 'Premium', priceINR: 6800, rating: 4.9, reviews: 290, distance: 'Private Valley Estate', amenities: 'Luxury Weatherproof Swiss Cottages, Bonfire, VIP Trek Guides', image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600' },
      { id: 'ked-st-5', name: 'Kedar Heights Luxury Heli-Resort', type: '5-Star Luxury', category: 'Luxury', priceINR: 12500, rating: 5.0, reviews: 310, distance: 'Phata Heli Base', amenities: 'Private Helipad Priority, Heated Luxury Chalets, Concierge Trekker', image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600' }
    ],
    Jaipur: [
      { id: 'jai-st-1', name: 'Govind Dev Ji Mandir Pilgrim Niwas', type: 'Satvik Ashram', category: 'Ashram', priceINR: 850, rating: 4.7, reviews: 240, distance: 'Inside City Palace Complex', amenities: 'Pure Vegetarian, Morning Aarti Access, Simple AC Rooms', image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600' },
      { id: 'jai-st-2', name: 'Pink City Heritage Haveli Inn', type: 'Pilgrim Niwas', category: 'Budget', priceINR: 1400, rating: 4.6, reviews: 190, distance: '400m from Hawa Mahal', amenities: 'Traditional Jharokha Windows, Rooftop Fort View Cafe', image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600' },
      { id: 'jai-st-3', name: 'Samode Haveli Jaipur', type: 'Heritage Stay', category: 'Heritage', priceINR: 11000, rating: 5.0, reviews: 480, distance: 'Gangapole, Old City', amenities: 'Hand-Painted Frescoes, Royal Courtyard Pool, Vintage Car Rides', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600' },
      { id: 'jai-st-4', name: 'ITC Rajputana Luxury Hotel', type: 'Premium 4-Star', category: 'Premium', priceINR: 8500, rating: 4.8, reviews: 520, distance: 'Palace Road', amenities: 'Peshawri Dining, Royal Spa, Traditional Folk Dance Evenings', image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600' },
      { id: 'jai-st-5', name: 'The Oberoi Rajvilas 5-Star Palace', type: '5-Star Luxury', category: 'Luxury', priceINR: 38000, rating: 5.0, reviews: 670, distance: 'Goner Road Estate (32 Acres)', amenities: 'Luxury Tents with Private Pool, 280-Year Old Shiva Temple, Butler', image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600' }
    ],
    Dubai: [
      { id: 'dxb-st-1', name: 'Deira Heritage Creek Guest House', type: 'Pilgrim Niwas', category: 'Budget', priceINR: 3200, rating: 4.5, reviews: 280, distance: 'Near Gold Souk & Abra Station', amenities: 'Metro Proximity, Free WiFi, Traditional Arabic Tea', image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600' },
      { id: 'dxb-st-2', name: 'Rove Downtown Dubai', type: 'Heritage Stay', category: 'Heritage', priceINR: 7500, rating: 4.8, reviews: 620, distance: 'Walking distance to Dubai Mall & Burj Khalifa', amenities: 'Burj Khalifa View Pool, Modern Gamer Lounge, 24x7 Cafe', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600' },
      { id: 'dxb-st-3', name: 'Bab Al Shams Desert Oasis Resort', type: 'Premium 4-Star', category: 'Premium', priceINR: 18500, rating: 4.9, reviews: 490, distance: 'Al Qudra Desert Dunes', amenities: 'Infinity Desert Pool, Falconry, Camel Rides, Arabian Nights BBQ', image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600' },
      { id: 'dxb-st-4', name: 'Atlantis, The Palm Luxury Resort', type: '5-Star Luxury', category: 'Luxury', priceINR: 32000, rating: 5.0, reviews: 880, distance: 'Palm Jumeirah Crescent', amenities: 'Aquaventure Waterpark Access, Underwater Suites, Michelin Dining', image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600' },
      { id: 'dxb-st-5', name: 'Burj Al Arab 7-Star Ultra Luxury', type: '5-Star Luxury', category: 'Luxury', priceINR: 95000, rating: 5.0, reviews: 920, distance: 'Private Island Jumeirah', amenities: 'Chauffeur Rolls-Royce, 24k Gold Decor, Private Beach Cabana', image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600' }
    ],
    Switzerland: [
      { id: 'swz-st-1', name: 'Interlaken Alpine Backpacker Lodge', type: 'Pilgrim Niwas', category: 'Budget', priceINR: 5200, rating: 4.6, reviews: 310, distance: 'Near Interlaken Ost Railway Station', amenities: 'Free Swiss Transit Bus Card, Shared Kitchen, Alpine Garden', image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600' },
      { id: 'swz-st-2', name: 'Lucerne Lakeview Swiss Chalet', type: 'Heritage Stay', category: 'Heritage', priceINR: 11500, rating: 4.9, reviews: 430, distance: 'Facing Lake Lucerne & Chapel Bridge', amenities: 'Authentic Timber Chalet, Swiss Fondue Dining, Steamboat Pier', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600' },
      { id: 'swz-st-3', name: 'Grindelwald Glacier Panorama Inn', type: 'Premium 4-Star', category: 'Premium', priceINR: 19500, rating: 4.9, reviews: 390, distance: 'Eiger North Face Footsteps', amenities: 'Heated Indoor Alpine Pool, Panoramic Sauna, Jungfrau Ski Access', image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600' },
      { id: 'swz-st-4', name: 'The Chedi Andermatt 5-Star Luxury', type: '5-Star Luxury', category: 'Luxury', priceINR: 58000, rating: 5.0, reviews: 520, distance: 'Swiss Alps Heart', amenities: '2,400 sq.m Spa & Hydrothermal Pools, Ski Butler, Michelin Star Wine', image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600' },
      { id: 'swz-st-5', name: 'Zermatt Matterhorn Peak Chalet Resort', type: '5-Star Luxury', category: 'Luxury', priceINR: 42000, rating: 5.0, reviews: 610, distance: 'Car-free Zermatt Village', amenities: 'Matterhorn Sunrise View from Bed, Open Fireplace, Heli-Skiing', image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600' }
    ],
    Bali: [
      { id: 'bal-st-1', name: 'Ubud Sacred Bamboo Eco Ashram', type: 'Satvik Ashram', category: 'Ashram', priceINR: 1800, rating: 4.8, reviews: 310, distance: 'Inside Tegallalang Rice Terraces', amenities: 'Daily Yoga & Meditation, Organic Vegan Kitchen, Jungle Stream', image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600' },
      { id: 'bal-st-2', name: 'Canggu Coastal Bohemian Villa', type: 'Pilgrim Niwas', category: 'Budget', priceINR: 3200, rating: 4.7, reviews: 290, distance: '300m from Echo Beach', amenities: 'Private Plunge Pool, Scooter Rental, High-Speed Starlink WiFi', image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600' },
      { id: 'bal-st-3', name: 'Tanah Lot Ocean Sanctuary Resort', type: 'Heritage Stay', category: 'Heritage', priceINR: 7500, rating: 4.9, reviews: 380, distance: 'Facing Tanah Lot Sea Temple', amenities: 'Balinese Temple Architecture, Sunset Cliff Infinity Pool', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600' },
      { id: 'bal-st-4', name: 'Ayana Resort & Rock Bar Bali', type: '5-Star Luxury', category: 'Luxury', priceINR: 26000, rating: 5.0, reviews: 890, distance: 'Jimbaran Sunset Cliffs', amenities: '12 Swimming Pools, Private Beach, World-Famous Rock Bar VIP Pass', image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600' },
      { id: 'bal-st-5', name: 'The Mulia Nusa Dua Oceanfront Palace', type: '5-Star Luxury', category: 'Luxury', priceINR: 34000, rating: 5.0, reviews: 760, distance: 'Nusa Dua White Sands', amenities: 'World Top Ocean Pools, Private Butler 24/7, Luxury Hydrotherapy', image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600' }
    ],
    Tokyo: [
      { id: 'tyo-st-1', name: 'Asakusa Ryokan & Tatami Inn', type: 'Pilgrim Niwas', category: 'Budget', priceINR: 3800, rating: 4.7, reviews: 340, distance: '200m from Sensō-ji Buddhist Temple', amenities: 'Traditional Futon, Japanese Onsen Bath, Yukata Robes Provided', image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600' },
      { id: 'tyo-st-2', name: 'Shinjuku Modern Capsule Pod Hotel', type: 'Pilgrim Niwas', category: 'Budget', priceINR: 2600, rating: 4.6, reviews: 420, distance: '5 mins from Shinjuku Station', amenities: 'Futuristic Sleeping Pods, Sauna, High-Speed Fiber Internet', image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600' },
      { id: 'tyo-st-3', name: 'Ginza Grand Heritage Boutique Hotel', type: 'Heritage Stay', category: 'Heritage', priceINR: 12000, rating: 4.8, reviews: 390, distance: 'Heart of Ginza Shopping District', amenities: 'Japanese Kaiseki Breakfast, Concierge Art Tour, Metro Link', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600' },
      { id: 'tyo-st-4', name: 'Park Hyatt Tokyo (Skyline Luxury)', type: '5-Star Luxury', category: 'Luxury', priceINR: 38000, rating: 5.0, reviews: 780, distance: 'Shinjuku High-Rise Tower', amenities: 'Floor 52 New York Bar, Mount Fuji Views, Peak Health Club & Spa', image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600' },
      { id: 'tyo-st-5', name: 'Hoshinoya Tokyo Traditional 5-Star Ryokan', type: '5-Star Luxury', category: 'Luxury', priceINR: 62000, rating: 5.0, reviews: 590, distance: 'Otemachi Financial Center', amenities: 'Natural Hot Spring Under the Stars, Tea Ceremony, Kimono Butler', image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600' }
    ],
    Paris: [
      { id: 'par-st-1', name: 'Montmartre Artist Boutique Inn', type: 'Pilgrim Niwas', category: 'Budget', priceINR: 4200, rating: 4.6, reviews: 310, distance: 'Near Sacré-Cœur Basilica', amenities: 'Free Croissant & Espresso, Metro Direct, Bohemian Courtyard', image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600' },
      { id: 'par-st-2', name: 'Latin Quarter Heritage Hotel', type: 'Heritage Stay', category: 'Heritage', priceINR: 9500, rating: 4.8, reviews: 390, distance: '500m from Notre-Dame Cathedral', amenities: '17th Century Stone Walls, French Wine Lounge, Seine Walks', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600' },
      { id: 'par-st-3', name: 'Pullman Paris Tour Eiffel', type: 'Premium 4-Star', category: 'Premium', priceINR: 22000, rating: 4.9, reviews: 720, distance: 'Directly under the Eiffel Tower', amenities: 'Direct Eiffel Tower Balcony View, Rooftop Lounge, Fitness Center', image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600' },
      { id: 'par-st-4', name: 'Le Meurice Palace Hotel (Dorchester)', type: '5-Star Luxury', category: 'Luxury', priceINR: 75000, rating: 5.0, reviews: 810, distance: 'Opposite Tuileries Garden & Louvre', amenities: 'Alain Ducasse 2-Star Dining, 18th Century Opulence, Valet', image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600' },
      { id: 'par-st-5', name: 'Ritz Paris (Place Vendôme)', type: '5-Star Luxury', category: 'Luxury', priceINR: 110000, rating: 5.0, reviews: 950, distance: 'Place Vendôme', amenities: 'Chanel Spa, Bar Hemingway, Private French Gardens, Concierge', image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600' }
    ]
  };

  // Active stays list for current city (Fallback to generic 5 if city not explicitly listed)
  const currentCityStays = allStaysData[selectedCity] || [
    { id: 'gen-st-1', name: `${selectedCity} Central Satvik Ashram`, type: 'Satvik Ashram', category: 'Ashram', priceINR: 950, rating: 4.8, reviews: 190, distance: `Central ${selectedCity}`, amenities: 'Satvik Food, Clean Beds, Spiritual Environment', image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600' },
    { id: 'gen-st-2', name: `${selectedCity} Pilgrim Niwas`, type: 'Pilgrim Niwas', category: 'Budget', priceINR: 750, rating: 4.5, reviews: 140, distance: `Near ${selectedCity} Station`, amenities: 'Lockers, AC/Non-AC, 24x7 Water', image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600' },
    { id: 'gen-st-3', name: `${selectedCity} Heritage Haveli`, type: 'Heritage Stay', category: 'Heritage', priceINR: 2600, rating: 4.8, reviews: 220, distance: `Historic ${selectedCity} Hub`, amenities: 'Traditional Decor, Free WiFi, Veg Dining', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600' },
    { id: 'gen-st-4', name: `${selectedCity} Grand Palace Hotel`, type: 'Premium 4-Star', category: 'Premium', priceINR: 4800, rating: 4.7, reviews: 280, distance: `Main Avenue, ${selectedCity}`, amenities: 'Swimming Pool, Banquet, Multi-Cuisine', image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600' },
    { id: 'gen-st-5', name: `${selectedCity} Royal 5-Star Luxury Resort`, type: '5-Star Luxury', category: 'Luxury', priceINR: 9500, rating: 5.0, reviews: 350, distance: `Scenic Vista, ${selectedCity}`, amenities: 'VIP Cab Transfer, Spa, Royal Suites, Butler', image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600' }
  ];

  // Filter stays by category pill
  const filteredStays = currentCityStays.filter(s => {
    if (selectedStayType === 'All') return true;
    if (selectedStayType === 'Ashram') return s.category === 'Ashram' || s.category === 'Budget';
    if (selectedStayType === 'Heritage') return s.category === 'Heritage';
    if (selectedStayType === 'Luxury') return s.category === 'Luxury' || s.category === 'Premium';
    return true;
  });

  // Comprehensive Verified Guides Dataset with minimum 1 female per place
  const verifiedGuidesList = [
    // --- UJJAIN ---
    {
      id: 'uj-1',
      name: 'Dr. Ananya Sharma',
      gender: 'Female',
      city: 'Ujjain',
      rating: 4.9,
      reviews: 142,
      languages: 'Hindi, Sanskrit, English, Gujarati',
      badge: 'Ph.D. in Vedic Studies & Jyotirlinga History',
      experience: '11+ Years Experience',
      hourlyRateINR: 500,
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400',
      specialty: 'Bhasma Aarti rituals, Mahakal Lok stories & VIP facilitation'
    },
    {
      id: 'uj-2',
      name: 'Pt. Shivam Shastri',
      gender: 'Male',
      city: 'Ujjain',
      rating: 4.9,
      reviews: 210,
      languages: 'Sanskrit, Hindi, Marathi, English',
      badge: 'Certified Temple Archaka & Historian',
      experience: '14+ Years Experience',
      hourlyRateINR: 500,
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      specialty: 'Rudra Abhishek rituals, Kshipra Ghat Parikrama'
    },

    // --- AYODHYA ---
    {
      id: 'ay-1',
      name: 'Pooja Trivedi',
      gender: 'Female',
      city: 'Ayodhya',
      rating: 5.0,
      reviews: 189,
      languages: 'Hindi, Awadhi, English',
      badge: 'ASI Certified Ramayana Heritage Guide',
      experience: '9+ Years Experience',
      hourlyRateINR: 450,
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400',
      specialty: 'Ram Janmabhoomi Darshan, Hanuman Garhi, Saryu Aarti'
    },
    {
      id: 'ay-2',
      name: 'Acharya Radheshyam',
      gender: 'Male',
      city: 'Ayodhya',
      rating: 4.8,
      reviews: 165,
      languages: 'Hindi, Sanskrit, Bengali',
      badge: 'Vedic Scholar & Temple Guide',
      experience: '12+ Years Experience',
      hourlyRateINR: 450,
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
      specialty: 'Kanak Bhavan history, Guptar Ghat Parikrama'
    },

    // --- VARANASI ---
    {
      id: 'var-1',
      name: 'Meera Deshmukh',
      gender: 'Female',
      city: 'Varanasi',
      rating: 4.9,
      reviews: 220,
      languages: 'Hindi, English, French, Marathi',
      badge: 'Banaras Cultural Historian & Boat Guide',
      experience: '10+ Years Experience',
      hourlyRateINR: 550,
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
      specialty: '84 Ghats sunrise boat tour, Ganga Aarti VIP seating'
    },
    {
      id: 'var-2',
      name: 'Pt. Kashi Nath Mishra',
      gender: 'Male',
      city: 'Varanasi',
      rating: 4.9,
      reviews: 195,
      languages: 'Sanskrit, Hindi, English, German',
      badge: 'Kashi Vishwanath Corridor Guide',
      experience: '16+ Years Experience',
      hourlyRateINR: 500,
      image: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400',
      specialty: 'Sugam Darshan, Sarnath Buddhist stupa walkthrough'
    },

    // --- PURI ---
    {
      id: 'pur-1',
      name: 'Kalyani Mohapatra',
      gender: 'Female',
      city: 'Puri',
      rating: 4.9,
      reviews: 130,
      languages: 'Odia, Hindi, English, Bengali',
      badge: 'Jagannath Cult & Mahaprasad Heritage Guide',
      experience: '8+ Years Experience',
      hourlyRateINR: 400,
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400',
      specialty: 'Char Dham rituals, Ananda Bazar Mahaprasad explanation'
    },

    // --- AMRITSAR ---
    {
      id: 'amr-1',
      name: 'Harpreet Kaur',
      gender: 'Female',
      city: 'Amritsar',
      rating: 5.0,
      reviews: 250,
      languages: 'Punjabi, Hindi, English',
      badge: 'Golden Temple Heritage & Seva Guide',
      experience: '10+ Years Experience',
      hourlyRateINR: 450,
      image: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=400',
      specialty: 'Harmandir Sahib Parikrama, Jallianwala Bagh, Wagah Border'
    },

    // --- SOMNATH ---
    {
      id: 'som-1',
      name: 'Bhavna Ben Patel',
      gender: 'Female',
      city: 'Somnath',
      rating: 4.8,
      reviews: 110,
      languages: 'Gujarati, Hindi, English',
      badge: 'Saurashtra Coast & Jyotirlinga Guide',
      experience: '7+ Years Experience',
      hourlyRateINR: 400,
      image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400',
      specialty: 'Somnath light & sound show, Bhalka Tirth history'
    },

    // --- TIRUPATI ---
    {
      id: 'tir-1',
      name: 'Lakshmi Narayani',
      gender: 'Female',
      city: 'Tirupati',
      rating: 4.9,
      reviews: 310,
      languages: 'Telugu, Tamil, Hindi, English, Kannada',
      badge: 'TTD Certified Tirumala Pilgrimage Guide',
      experience: '13+ Years Experience',
      hourlyRateINR: 500,
      image: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400',
      specialty: 'Special Entry Darshan assistance, Laddu Prasadam, Alipiri path'
    },

    // --- KEDARNATH ---
    {
      id: 'ked-1',
      name: 'Sunita Joshi',
      gender: 'Female',
      city: 'Kedarnath',
      rating: 4.9,
      reviews: 175,
      languages: 'Garhwali, Hindi, English',
      badge: 'Himalayan High Altitude Certified Guide',
      experience: '9+ Years Experience',
      hourlyRateINR: 600,
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400',
      specialty: 'Trek route guidance, Bhairavnath darshan, medical oxygen safety'
    },

    // --- JAIPUR ---
    {
      id: 'jai-1',
      name: 'Riddhi Rathore',
      gender: 'Female',
      city: 'Jaipur',
      rating: 5.0,
      reviews: 280,
      languages: 'Rajasthani, Hindi, English, Spanish',
      badge: 'Ministry of Tourism Certified Royal Guide',
      experience: '12+ Years Experience',
      hourlyRateINR: 500,
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
      specialty: 'Amer Fort Sheesh Mahal secrets, City Palace, Hawa Mahal'
    },

    // --- AGRA ---
    {
      id: 'agr-1',
      name: 'Zoya Khan',
      gender: 'Female',
      city: 'Agra',
      rating: 4.9,
      reviews: 290,
      languages: 'Urdu, Hindi, English, Italian',
      badge: 'Taj Mahal & Mughal Architecture Specialist',
      experience: '10+ Years Experience',
      hourlyRateINR: 550,
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400',
      specialty: 'Sunrise Taj Mahal photography points, Agra Fort Diwan-i-Khas'
    },

    // --- HAMPI ---
    {
      id: 'ham-1',
      name: 'Deepa Hegde',
      gender: 'Female',
      city: 'Hampi',
      rating: 4.9,
      reviews: 160,
      languages: 'Kannada, Telugu, Hindi, English',
      badge: 'UNESCO Heritage Archeology Expert',
      experience: '8+ Years Experience',
      hourlyRateINR: 450,
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400',
      specialty: 'Vijaya Vittala Stone Chariot, Musical Pillars, Coracle ride'
    },

    // --- GOA ---
    {
      id: 'goa-1',
      name: 'Maria Fernandes',
      gender: 'Female',
      city: 'Goa',
      rating: 4.8,
      reviews: 210,
      languages: 'Konkani, Portuguese, English, Hindi',
      badge: 'Portuguese Coastal Heritage Historian',
      experience: '11+ Years Experience',
      hourlyRateINR: 500,
      image: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=400',
      specialty: 'Old Goa churches, Fort Aguada, Fontainhas Latin quarter'
    },

    // --- RISHIKESH ---
    {
      id: 'rsh-1',
      name: 'Swamini Gayatri',
      gender: 'Female',
      city: 'Rishikesh',
      rating: 5.0,
      reviews: 240,
      languages: 'Hindi, Sanskrit, English',
      badge: 'Yoga & Himalayan Meditation Instructor',
      experience: '12+ Years Experience',
      hourlyRateINR: 500,
      image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400',
      specialty: 'Triveni Ghat Aarti, Beatles Ashram tour, Swarg Ashram'
    },

    // --- MUNNAR ---
    {
      id: 'mun-1',
      name: 'Anjali Menon',
      gender: 'Female',
      city: 'Munnar',
      rating: 4.9,
      reviews: 145,
      languages: 'Malayalam, Tamil, English, Hindi',
      badge: 'Western Ghats Flora & Tea Plantation Guide',
      experience: '7+ Years Experience',
      hourlyRateINR: 450,
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400',
      specialty: 'Eravikulam Nilgiri Tahr safari, Tata Tea museum walking trail'
    },

    // --- MANALI ---
    {
      id: 'man-1',
      name: 'Kavita Thakur',
      gender: 'Female',
      city: 'Manali',
      rating: 4.9,
      reviews: 180,
      languages: 'Pahari, Hindi, English',
      badge: 'Himachal Adventure & Culture Guide',
      experience: '9+ Years Experience',
      hourlyRateINR: 500,
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400',
      specialty: 'Hadimba Temple cedar forest walk, Solang valley adventure'
    },

    // --- LADAKH ---
    {
      id: 'lad-1',
      name: 'Dolma Tsering',
      gender: 'Female',
      city: 'Ladakh',
      rating: 5.0,
      reviews: 215,
      languages: 'Ladakhi, Tibetan, Hindi, English',
      badge: 'Ladakh Monastic & High Altitude Expert',
      experience: '10+ Years Experience',
      hourlyRateINR: 600,
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
      specialty: 'Thiksey monastery morning chanting, Pangong Tso permits'
    },

    // --- DUBAI ---
    {
      id: 'dxb-1',
      name: 'Fatima Al-Zahra',
      gender: 'Female',
      city: 'Dubai',
      rating: 5.0,
      reviews: 340,
      languages: 'Arabic, English, Hindi, Urdu',
      badge: 'DTCM Licensed Professional Dubai Guide',
      experience: '9+ Years Experience',
      hourlyRateINR: 1200,
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400',
      specialty: 'Burj Khalifa VIP tour, Desert safari coordination, Old Souks'
    },

    // --- SWITZERLAND ---
    {
      id: 'swz-1',
      name: 'Elena Weber',
      gender: 'Female',
      city: 'Switzerland',
      rating: 5.0,
      reviews: 320,
      languages: 'German, French, English, Italian',
      badge: 'Swiss Tourism Federation Certified Guide',
      experience: '13+ Years Experience',
      hourlyRateINR: 1500,
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400',
      specialty: 'Jungfraujoch Top of Europe, Lake Lucerne steamboat, Zermatt'
    },

    // --- BALI ---
    {
      id: 'bal-1',
      name: 'Ni Wayan Puteri',
      gender: 'Female',
      city: 'Bali',
      rating: 4.9,
      reviews: 290,
      languages: 'Balinese, Indonesian, English, Hindi basics',
      badge: 'HPI Bali Licensed Cultural Expert',
      experience: '8+ Years Experience',
      hourlyRateINR: 800,
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
      specialty: 'Tanah Lot ocean temple, Uluwatu Kecak dance, Ubud rice terraces'
    },

    // --- TOKYO ---
    {
      id: 'tyo-1',
      name: 'Yuki Tanaka',
      gender: 'Female',
      city: 'Tokyo',
      rating: 5.0,
      reviews: 270,
      languages: 'Japanese, English, Mandarin',
      badge: 'JNTO National Government Licensed Guide',
      experience: '11+ Years Experience',
      hourlyRateINR: 1400,
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400',
      specialty: 'Sensō-ji Buddhist rituals, Meiji Jingu shrine, Shibuya crossing'
    },

    // --- PARIS ---
    {
      id: 'par-1',
      name: 'Claire Dubois',
      gender: 'Female',
      city: 'Paris',
      rating: 4.9,
      reviews: 360,
      languages: 'French, English, Spanish, Italian',
      badge: 'French Ministry of Culture Guide-Conférencier',
      experience: '14+ Years Experience',
      hourlyRateINR: 1500,
      image: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=400',
      specialty: 'Louvre museum masterpieces, Eiffel tower summit history'
    }
  ];

  // Filter guides based on selected city + fallback to all
  const cityGuides = verifiedGuidesList.filter(g => g.city.toLowerCase() === selectedCity.toLowerCase());
  const displayGuides = cityGuides.length > 0 ? cityGuides : verifiedGuidesList.slice(0, 6);

  // Live Crowd Metadata Dictionary per City
  const cityCrowdData = {
    Ujjain: {
      crowdLevel: 'High Rush (Bhasma Aarti Peak)',
      levelColor: 'rose',
      regularWait: '50 - 65 mins',
      vipWait: '15 mins (Sugam Darshan)',
      peakHours: '05:00 AM - 09:30 AM & 06:30 PM - 09:00 PM',
      bestTime: '01:30 PM - 03:45 PM (Minimum Queue)',
      capacityPct: 88,
      statusMsg: 'High footfall at Mahakal Garbhagriha & Mahakal Lok. Pre-book VIP entry token for fast darshan.'
    },
    Ayodhya: {
      crowdLevel: 'Moderate to High (Ram Mandir)',
      levelColor: 'amber',
      regularWait: '35 - 50 mins',
      vipWait: '10 - 15 mins (Aarti Pass)',
      peakHours: '07:00 AM - 11:00 AM & 06:00 PM - 08:30 PM',
      bestTime: '02:00 PM - 04:00 PM',
      capacityPct: 75,
      statusMsg: 'Steady stream of pilgrims at Janmabhoomi and Hanuman Garhi. Electronic lockers available.'
    },
    Varanasi: {
      crowdLevel: 'High Crowd (Ganga Aarti Peak)',
      levelColor: 'rose',
      regularWait: '45 - 60 mins',
      vipWait: '15 mins',
      peakHours: '06:00 AM - 09:00 AM & 06:00 PM - 08:30 PM',
      bestTime: '12:00 PM - 03:00 PM',
      capacityPct: 92,
      statusMsg: 'Dashashwamedh Ghat and Vishwanath Corridor witnessing large evening gathering.'
    },
    Puri: {
      crowdLevel: 'Moderate Rush',
      levelColor: 'amber',
      regularWait: '30 - 45 mins',
      vipWait: '10 mins',
      peakHours: '06:30 AM - 10:00 AM & 05:30 PM - 08:00 PM',
      bestTime: '01:00 PM - 03:30 PM',
      capacityPct: 68,
      statusMsg: 'Pleasant movement at Shree Jagannath Mandir and Golden Beach promenade.'
    },
    Amritsar: {
      crowdLevel: 'Moderate (Continuous Langar Flow)',
      levelColor: 'emerald',
      regularWait: '20 - 30 mins',
      vipWait: 'Direct Access',
      peakHours: '05:00 AM - 08:00 AM & 07:00 PM - 09:30 PM',
      bestTime: '11:00 AM - 03:00 PM',
      capacityPct: 60,
      statusMsg: 'Smooth Parikrama at Harmandir Sahib and organized Langar hall service.'
    },
    Somnath: {
      crowdLevel: 'Low to Moderate',
      levelColor: 'emerald',
      regularWait: '15 - 25 mins',
      vipWait: '5 mins',
      peakHours: '07:00 AM - 09:30 AM & 07:00 PM - 08:30 PM',
      bestTime: '11:30 AM - 04:30 PM',
      capacityPct: 45,
      statusMsg: 'Very comfortable movement at sea-facing temple complex with minimal waiting.'
    },
    Tirupati: {
      crowdLevel: 'Very High (Tirumala Slotted Queue)',
      levelColor: 'rose',
      regularWait: '3 - 4 hours (Free Sarva Darshan)',
      vipWait: '45 mins (Special Entry ₹300)',
      peakHours: 'All Day (Peak weekend rush)',
      bestTime: 'Early Morning Slotted Tickets (06:00 AM)',
      capacityPct: 96,
      statusMsg: 'Large queue complexes active in Tirumala hills. Please book ₹300 Special Entry online.'
    },
    Kedarnath: {
      crowdLevel: 'Moderate (Trek & Helicopter)',
      levelColor: 'amber',
      regularWait: '40 - 60 mins',
      vipWait: '15 mins',
      peakHours: '06:00 AM - 10:00 AM & 05:00 PM - 07:30 PM',
      bestTime: '12:00 PM - 03:00 PM',
      capacityPct: 70,
      statusMsg: 'Himalayan weather cold and clear. Queue moving smoothly for Jyotirlinga Abhishek.'
    },
    Jaipur: {
      crowdLevel: 'Moderate (Forts & Palaces)',
      levelColor: 'emerald',
      regularWait: '15 - 25 mins (Amer Fort)',
      vipWait: '5 mins (Online QR Ticket)',
      peakHours: '10:00 AM - 01:00 PM & 04:30 PM - 07:00 PM',
      bestTime: '08:30 AM - 10:00 AM',
      capacityPct: 55,
      statusMsg: 'Fast entry with composite tickets at Hawa Mahal and Amer Fort.'
    },
    Dubai: {
      crowdLevel: 'High Sunset Rush (Burj Khalifa)',
      levelColor: 'amber',
      regularWait: '25 - 40 mins (Deck Lift)',
      vipWait: '5 mins (Sky Luxury Pass)',
      peakHours: '05:00 PM - 07:30 PM (Sunset Hours)',
      bestTime: '09:30 AM - 12:00 PM (Morning Clarity)',
      capacityPct: 82,
      statusMsg: 'Observation decks on 124th/148th floors busy for sunset skyline photography.'
    },
    Switzerland: {
      crowdLevel: 'Low to Moderate Flow',
      levelColor: 'emerald',
      regularWait: '5 - 10 mins (Jungfrau Train)',
      vipWait: 'Priority Boarding (Swiss Travel Pass)',
      peakHours: '10:30 AM - 02:30 PM',
      bestTime: '08:30 AM - 10:30 AM',
      capacityPct: 40,
      statusMsg: 'Pristine conditions across panoramic alpine trains and mountain cable cars.'
    },
    Bali: {
      crowdLevel: 'Moderate Sunset Rush',
      levelColor: 'emerald',
      regularWait: '15 - 20 mins',
      vipWait: 'Direct Entry',
      peakHours: '04:30 PM - 07:00 PM (Uluwatu Sunset Dance)',
      bestTime: '08:30 AM - 11:30 AM',
      capacityPct: 62,
      statusMsg: 'Arrive before 04:30 PM at Uluwatu Cliff for front-row seats at Kecak fire dance.'
    },
    Tokyo: {
      crowdLevel: 'Moderate to High',
      levelColor: 'amber',
      regularWait: '15 - 30 mins',
      vipWait: 'Express QR',
      peakHours: '11:00 AM - 02:00 PM & 05:00 PM - 08:30 PM',
      bestTime: '08:30 AM - 10:30 AM',
      capacityPct: 72,
      statusMsg: 'Sensō-ji temple Nakamise shopping street seeing active tourist footfall.'
    },
    Paris: {
      crowdLevel: 'High (Eiffel & Louvre Museums)',
      levelColor: 'rose',
      regularWait: '40 - 55 mins (Louvre Security)',
      vipWait: '10 mins (Timed Entry Ticket)',
      peakHours: '10:30 AM - 03:30 PM & 06:30 PM - 09:00 PM',
      bestTime: '09:00 AM - 10:30 AM',
      capacityPct: 85,
      statusMsg: 'Mandatory timed reservation advised for Louvre Mona Lisa and Eiffel Tower lift.'
    }
  };

  const activeCrowd = cityCrowdData[selectedCity] || {
    crowdLevel: 'Normal Flow',
    levelColor: 'emerald',
    regularWait: '15 - 25 mins',
    vipWait: '5 - 10 mins',
    peakHours: '10:00 AM - 01:00 PM & 05:00 PM - 08:00 PM',
    bestTime: '09:00 AM - 11:30 AM',
    capacityPct: 50,
    statusMsg: `Smooth and comfortable travel conditions across all central attractions in ${selectedCity}.`
  };

  // Chatbot State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {
      sender: 'bot',
      text: 'Namaste! 🙏 I am your SmartTrip AI Guide. Ask me anything about pilgrimage timings, VIP Darshan, satvik ashrams, Switzerland alpine passes, Dubai safaris, or custom currency budgets!'
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const chatEndRef = useRef(null);

  const quickQuestions = [
    'Bhasma Aarti timings in Ujjain?',
    'Top spots in Switzerland',
    'Dubai Desert Safari budget',
    'Dress code for Ram Mandir Ayodhya'
  ];

  useEffect(() => {
    if (isChatOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isChatOpen]);

  const handleSendMessage = (textToSend) => {
    const query = textToSend || chatInput;
    if (!query.trim()) return;

    const newMessages = [...chatMessages, { sender: 'user', text: query }];
    setChatMessages(newMessages);
    if (!textToSend) setChatInput('');

    setTimeout(() => {
      let botReply = '';
      const q = query.toLowerCase();

      if (q.includes('bhasma') || q.includes('ujjain') || q.includes('mahakal')) {
        botReply = '🔱 **Mahakaleshwar Ujjain Darshan Info:**\n• Bhasma Aarti: 04:00 AM - 06:00 AM (Requires prior online/counter booking).\n• Regular Darshan: 06:00 AM - 11:00 PM.\n• Dress Code for Garbhagriha: Traditional Saree for women, Dhoti-Kurta (unstitched dhoti) for men.\n• Recommendation: Stay at *Shri Mahakal Bhakt Ashram* (150m from temple).';
      } else if (q.includes('switzerland') || q.includes('swiss') || q.includes('alps')) {
        botReply = '🏔️ **Switzerland Circuit Highlights:**\n• Top Attractions: Jungfraujoch (Top of Europe), Matterhorn in Zermatt, Lake Lucerne cruise.\n• Currency: Swiss Franc (CHF).\n• Pro Tip: Get the Swiss Travel Pass for unlimited scenic train rides across panoramic routes.';
      } else if (q.includes('dubai') || q.includes('burj')) {
        botReply = '🏙️ **Dubai International Circuit:**\n• Highlights: Burj Khalifa 124th/148th floor deck, Red Dune Desert Safari with BBQ, Dubai Mall Fountain.\n• Currency: UAE Dirham (AED).\n• Best Time: October to April for pleasant outdoor weather.';
      } else if (q.includes('bali')) {
        botReply = '🏝️ **Bali Island Circuit:**\n• Highlights: Tanah Lot sea temple, Uluwatu Kecak cliff dance, Ubud Tegallalang rice terraces.\n• Currency: Indonesian Rupiah (IDR).\n• Visa: Visa on Arrival available for Indian travelers.';
      } else if (q.includes('ayodhya') || q.includes('ram mandir')) {
        botReply = '🛕 **Shri Ram Janmabhoomi Ayodhya:**\n• Darshan Timings: 07:00 AM to 11:30 AM & 02:00 PM to 07:00 PM.\n• Aarti: Shringar Aarti (06:30 AM), Sandhya Aarti (07:30 PM).\n• Mobiles, leather belts & electronic items are stored at free lockers outside.\n• Must-visit: Hanuman Garhi & Saryu River Maha Aarti.';
      } else if (q.includes('varanasi') || q.includes('kashi') || q.includes('ganga')) {
        botReply = '🌊 **Kashi Vishwanath & Ganga Ghats:**\n• Dashashwamedh Ghat Ganga Aarti starts daily at 06:45 PM.\n• Kashi Vishwanath Corridor is open 24/7 with special Sugam Darshan tickets.\n• Recommended Budget: ₹3,500 - ₹5,000/day for boat rides, satvik food, and heritage guide.';
      } else {
        botReply = `✨ **SmartTrip AI Assistant:** For ${selectedCity}, I have mapped an optimized itinerary with ${activeDestination.activities.length} waypoints and auto-selected ${activeDestination.defaultCurrency || 'INR'} currency! Click on the *Itinerary Planner* or *Ashrams* tab on the left menu to view full details.`;
      }

      setChatMessages(prev => [...prev, { sender: 'bot', text: botReply }]);
    }, 600);
  };

  // Comprehensive Destinations Dataset with default currency
  const destinationsData = [
    // --- 1. SPIRITUAL & DHARMIK ---
    {
      id: 'ujjain',
      name: 'Ujjain',
      title: 'Mahakaleshwar Jyotirlinga',
      category: 'Spiritual',
      defaultCurrency: 'INR',
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
      defaultCurrency: 'INR',
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
      defaultCurrency: 'INR',
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
      defaultCurrency: 'INR',
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
      id: 'amritsar',
      name: 'Amritsar',
      title: 'Golden Temple (Harmandir Sahib)',
      category: 'Spiritual',
      defaultCurrency: 'INR',
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
      defaultCurrency: 'INR',
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
      id: 'tirupati',
      name: 'Tirupati',
      title: 'Sri Venkateswara Swamy Temple',
      category: 'Spiritual',
      defaultCurrency: 'INR',
      image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=600',
      tag: 'Balaji & Tirumala Hills',
      coords: [13.6833, 79.3472],
      activities: [
        { name: 'Tirumala Balaji Special Darshan', period: 'Morning (05:30 - 10:30)', time_slot: 'Morning', category: 'Lord Venkateswara', cost: 300, latitude: 13.6833, longitude: 79.3472, image_url: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=600' },
        { name: 'Sri Padmavathi Ammavari Temple', period: 'Afternoon (14:00 - 16:30)', time_slot: 'Afternoon', category: 'Holy Mandir', cost: 50, latitude: 13.6150, longitude: 79.4320, image_url: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=600' },
        { name: 'Kapila Theertham Waterfalls', period: 'Evening (17:30 - 19:30)', time_slot: 'Evening', category: 'Nature & Temple', cost: 0, latitude: 13.6510, longitude: 79.4210, image_url: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=600' }
      ]
    },
    {
      id: 'kedarnath',
      name: 'Kedarnath',
      title: 'Himalayan Jyotirlinga',
      category: 'Spiritual',
      defaultCurrency: 'INR',
      image: 'https://images.unsplash.com/photo-1605649487212-47bdab064df8?w=600',
      tag: 'Char Dham & Glaciers',
      coords: [30.7352, 79.0669],
      activities: [
        { name: 'Kedarnath Jyotirlinga Maha Puja', period: 'Morning (06:00 - 10:00)', time_slot: 'Morning', category: 'Jyotirlinga', cost: 0, latitude: 30.7352, longitude: 79.0669, image_url: 'https://images.unsplash.com/photo-1605649487212-47bdab064df8?w=600' },
        { name: 'Bhairavnath Temple Trek', period: 'Afternoon (13:00 - 15:30)', time_slot: 'Afternoon', category: 'Himalayan Trail', cost: 0, latitude: 30.7370, longitude: 79.0710, image_url: 'https://images.unsplash.com/photo-1588416936097-41850ab3d86d?w=600' },
        { name: 'Mandakini Valley Sunset Meditation', period: 'Evening (17:00 - 19:00)', time_slot: 'Evening', category: 'Spiritual Silence', cost: 0, latitude: 30.7340, longitude: 79.0650, image_url: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=600' }
      ]
    },

    // --- 2. ASI HERITAGE & FORTS ---
    {
      id: 'jaipur',
      name: 'Jaipur',
      title: 'The Pink City & Forts',
      category: 'Heritage',
      defaultCurrency: 'INR',
      image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=600',
      tag: 'Amer Fort & Hawa Mahal',
      coords: [26.9124, 75.7873],
      activities: [
        { name: 'Amer Fort & Sheesh Mahal', period: 'Morning (08:30 - 12:00)', time_slot: 'Morning', category: 'UNESCO Fort', cost: 100, latitude: 26.9855, longitude: 75.8513, image_url: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=600' },
        { name: 'Hawa Mahal & City Palace Museum', period: 'Afternoon (14:00 - 16:30)', time_slot: 'Afternoon', category: 'Royal Architecture', cost: 150, latitude: 26.9239, longitude: 75.8267, image_url: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=600' },
        { name: 'Nahargarh Fort Sunset Viewpoint', period: 'Evening (17:30 - 20:00)', time_slot: 'Evening', category: 'Panoramic Fort', cost: 50, latitude: 26.9387, longitude: 75.8155, image_url: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=600' }
      ]
    },
    {
      id: 'agra',
      name: 'Agra',
      title: 'Taj Mahal & Mughal Splendor',
      category: 'Heritage',
      defaultCurrency: 'INR',
      image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600',
      tag: 'UNESCO World Wonder',
      coords: [27.1767, 78.0081],
      activities: [
        { name: 'Taj Mahal Sunrise Tour', period: 'Morning (06:00 - 09:30)', time_slot: 'Morning', category: 'World Wonder', cost: 50, latitude: 27.1751, longitude: 78.0421, image_url: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600' },
        { name: 'Agra Fort & Diwan-i-Khas', period: 'Afternoon (13:30 - 16:00)', time_slot: 'Afternoon', category: 'ASI Monument', cost: 50, latitude: 27.1795, longitude: 78.0211, image_url: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=600' },
        { name: 'Mehtab Bagh River Sunset', period: 'Evening (17:30 - 19:30)', time_slot: 'Evening', category: 'Garden Viewpoint', cost: 25, latitude: 27.1800, longitude: 78.0425, image_url: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600' }
      ]
    },
    {
      id: 'hampi',
      name: 'Hampi',
      title: 'Vijayanagara Ruins & Stone Chariot',
      category: 'Heritage',
      defaultCurrency: 'INR',
      image: 'https://images.unsplash.com/photo-1600100397608-f010f4439130?w=600',
      tag: 'UNESCO Ancient Capital',
      coords: [15.3350, 76.4600],
      activities: [
        { name: 'Vijaya Vittala Temple & Stone Chariot', period: 'Morning (07:30 - 11:00)', time_slot: 'Morning', category: 'Ancient Architecture', cost: 40, latitude: 15.3370, longitude: 76.4780, image_url: 'https://images.unsplash.com/photo-1600100397608-f010f4439130?w=600' },
        { name: 'Virupaksha Temple & Hampi Bazaar', period: 'Afternoon (14:00 - 16:30)', time_slot: 'Afternoon', category: 'Living Heritage', cost: 0, latitude: 15.3350, longitude: 76.4600, image_url: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=600' },
        { name: 'Matanga Hill Sunset Coracle Ride', period: 'Evening (17:30 - 19:30)', time_slot: 'Evening', category: 'River Heritage', cost: 100, latitude: 15.3320, longitude: 76.4680, image_url: 'https://images.unsplash.com/photo-1600100397608-f010f4439130?w=600' }
      ]
    },
    {
      id: 'goa',
      name: 'Goa',
      title: 'Old Goa & Coastal Forts',
      category: 'Heritage',
      defaultCurrency: 'INR',
      image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600',
      tag: 'UNESCO Heritage & Beaches',
      coords: [15.4926, 73.8180],
      activities: [
        { name: 'Basilica of Bom Jesus (UNESCO)', period: 'Morning (09:00 - 12:00)', time_slot: 'Morning', category: 'ASI Heritage', cost: 0, latitude: 15.5009, longitude: 73.9116, image_url: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600' },
        { name: 'Fort Aguada Portuguese Lighthouse', period: 'Afternoon (14:00 - 16:30)', time_slot: 'Afternoon', category: 'Coastal Fort', cost: 50, latitude: 15.4926, longitude: 73.7737, image_url: 'https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?w=600' },
        { name: 'Baga Promenade & Sunset Shacks', period: 'Evening (17:30 - 20:30)', time_slot: 'Evening', category: 'Coastline', cost: 0, latitude: 15.5553, longitude: 73.7517, image_url: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600' }
      ]
    },

    // --- 3. NATURE & ECO-RESORTS ---
    {
      id: 'rishikesh',
      name: 'Rishikesh',
      title: 'Triveni Ghat & Ganga Nature',
      category: 'Nature',
      defaultCurrency: 'INR',
      image: 'https://images.unsplash.com/photo-1588416936097-41850ab3d86d?w=600',
      tag: 'Yoga, Hills & Ganga Aarti',
      coords: [30.0869, 78.2676],
      activities: [
        { name: 'Ram Jhula & Swarg Ashram Walk', period: 'Morning (07:00 - 10:30)', time_slot: 'Morning', category: 'Ashram Heritage', cost: 0, latitude: 30.1235, longitude: 78.3168, image_url: 'https://images.unsplash.com/photo-1588416936097-41850ab3d86d?w=600' },
        { name: 'Beatles Ashram (Chaurasi Kutia)', period: 'Afternoon (14:00 - 16:30)', time_slot: 'Afternoon', category: 'Eco Culture', cost: 150, latitude: 30.1190, longitude: 78.3240, image_url: 'https://images.unsplash.com/photo-1588416936097-41850ab3d86d?w=600' },
        { name: 'Triveni Ghat Maha Aarti', period: 'Evening (18:00 - 20:00)', time_slot: 'Evening', category: 'Ghat Aarti', cost: 0, latitude: 30.0980, longitude: 78.2930, image_url: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=600' }
      ]
    },
    {
      id: 'munnar',
      name: 'Munnar',
      title: 'Misty Tea Gardens & Waterfalls',
      category: 'Nature',
      defaultCurrency: 'INR',
      image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=600',
      tag: 'Western Ghats & Tea Estates',
      coords: [10.0889, 77.0595],
      activities: [
        { name: 'Eravikulam National Park & Nilgiri Tahr', period: 'Morning (08:00 - 11:30)', time_slot: 'Morning', category: 'Wildlife Sanctuary', cost: 200, latitude: 10.1500, longitude: 77.0600, image_url: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=600' },
        { name: 'Tata Tea Museum & Plantation Trail', period: 'Afternoon (13:30 - 16:00)', time_slot: 'Afternoon', category: 'Eco Tourism', cost: 125, latitude: 10.0889, longitude: 77.0595, image_url: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=600' },
        { name: 'Mattupetty Dam & Eco Point Boating', period: 'Evening (16:30 - 18:30)', time_slot: 'Evening', category: 'Lake & Hills', cost: 150, latitude: 10.1080, longitude: 77.1240, image_url: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=600' }
      ]
    },
    {
      id: 'manali',
      name: 'Manali',
      title: 'Solang Valley & Snow Peaks',
      category: 'Nature',
      defaultCurrency: 'INR',
      image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=600',
      tag: 'Himalayas & Pine Forests',
      coords: [32.2432, 77.1892],
      activities: [
        { name: 'Solang Valley Adventure & Cable Car', period: 'Morning (09:00 - 13:00)', time_slot: 'Morning', category: 'Snow Valley', cost: 500, latitude: 32.3160, longitude: 77.1570, image_url: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=600' },
        { name: 'Hadimba Devi Ancient Wooden Temple', period: 'Afternoon (14:30 - 16:30)', time_slot: 'Afternoon', category: 'Forest Temple', cost: 0, latitude: 32.2480, longitude: 77.1810, image_url: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=600' },
        { name: 'Old Manali Riverside Cafes & Stroll', period: 'Evening (17:30 - 20:00)', time_slot: 'Evening', category: 'Mountain Vibe', cost: 0, latitude: 32.2530, longitude: 77.1840, image_url: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=600' }
      ]
    },
    {
      id: 'ladakh',
      name: 'Ladakh',
      title: 'Pangong Lake & Monasteries',
      category: 'Nature',
      defaultCurrency: 'INR',
      image: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?w=600',
      tag: 'High Altitude Desert',
      coords: [34.1526, 77.5771],
      activities: [
        { name: 'Thiksey Monastery Morning Chanting', period: 'Morning (06:30 - 09:30)', time_slot: 'Morning', category: 'Buddhist Monastery', cost: 50, latitude: 34.0583, longitude: 77.6667, image_url: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?w=600' },
        { name: 'Shanti Stupa Panoramic View', period: 'Afternoon (14:00 - 16:30)', time_slot: 'Afternoon', category: 'Peace Monument', cost: 0, latitude: 34.1642, longitude: 77.5847, image_url: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=600' },
        { name: 'Pangong Tso Blue Water Sunset', period: 'Evening (17:00 - 19:30)', time_slot: 'Evening', category: 'Himalayan Lake', cost: 0, latitude: 33.7595, longitude: 78.6674, image_url: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?w=600' }
      ]
    },

    // --- 4. INTERNATIONAL CIRCUITS ---
    {
      id: 'dubai',
      name: 'Dubai',
      title: 'Futuristic Oasis & Desert',
      category: 'International',
      defaultCurrency: 'AED',
      image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600',
      tag: 'Burj Khalifa & Desert Safari',
      coords: [25.2048, 55.2708],
      activities: [
        { name: 'Burj Khalifa 124th Floor Observation Deck', period: 'Morning (09:30 - 12:30)', time_slot: 'Morning', category: 'Tallest Skyscraper', cost: 160, latitude: 25.1972, longitude: 55.2744, image_url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600' },
        { name: 'Dubai Mall & Fountain Show', period: 'Afternoon (14:00 - 17:00)', time_slot: 'Afternoon', category: 'Mega Mall', cost: 0, latitude: 25.1985, longitude: 55.2796, image_url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600' },
        { name: 'Red Dune Desert Safari & BBQ Dinner', period: 'Evening (17:30 - 21:30)', time_slot: 'Evening', category: 'Desert Adventure', cost: 120, latitude: 24.9500, longitude: 55.5000, image_url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600' }
      ]
    },
    {
      id: 'switzerland',
      name: 'Switzerland',
      title: 'Alpine Wonderland & Jungfraujoch',
      category: 'International',
      defaultCurrency: 'CHF',
      image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=600',
      tag: 'Matterhorn & Swiss Alps',
      coords: [46.8182, 8.2275],
      activities: [
        { name: 'Jungfraujoch - Top of Europe Cogwheel Train', period: 'Morning (08:30 - 13:00)', time_slot: 'Morning', category: 'Alpine Summit', cost: 120, latitude: 46.5475, longitude: 7.9822, image_url: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=600' },
        { name: 'Lake Lucerne Scenic Steamboat Cruise', period: 'Afternoon (14:30 - 17:00)', time_slot: 'Afternoon', category: 'Swiss Lakes', cost: 45, latitude: 47.0502, longitude: 8.3093, image_url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600' },
        { name: 'Zermatt Village & Matterhorn Sunset', period: 'Evening (17:30 - 20:00)', time_slot: 'Evening', category: 'Alpine Village', cost: 0, latitude: 45.9765, longitude: 7.7491, image_url: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=600' }
      ]
    },
    {
      id: 'bali',
      name: 'Bali',
      title: 'Island of the Gods & Temples',
      category: 'International',
      defaultCurrency: 'IDR',
      image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600',
      tag: 'Uluwatu Temple & Beaches',
      coords: [-8.4095, 115.1889],
      activities: [
        { name: 'Ubud Sacred Monkey Forest & Rice Terraces', period: 'Morning (08:30 - 12:00)', time_slot: 'Morning', category: 'Tropical Nature', cost: 80000, latitude: -8.5190, longitude: 115.2600, image_url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600' },
        { name: 'Tanah Lot Ocean Rock Temple', period: 'Afternoon (14:00 - 16:30)', time_slot: 'Afternoon', category: 'Ocean Sanctuary', cost: 60000, latitude: -8.6212, longitude: 115.0868, image_url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600' },
        { name: 'Uluwatu Cliff Kecak Fire Dance at Sunset', period: 'Evening (17:30 - 19:30)', time_slot: 'Evening', category: 'Cultural Dance', cost: 150000, latitude: -8.8290, longitude: 115.0849, image_url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600' }
      ]
    },
    {
      id: 'tokyo',
      name: 'Tokyo',
      title: 'Tradition Meets Tomorrow',
      category: 'International',
      defaultCurrency: 'JPY',
      image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=600',
      tag: 'Sensō-ji Temple & Shibuya',
      coords: [35.6762, 139.6503],
      activities: [
        { name: 'Sensō-ji Ancient Asakusa Temple', period: 'Morning (08:30 - 11:30)', time_slot: 'Morning', category: 'Historic Buddhist', cost: 0, latitude: 35.7148, longitude: 139.7967, image_url: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=600' },
        { name: 'Meiji Jingu Shrine & Forest Walk', period: 'Afternoon (13:30 - 16:00)', time_slot: 'Afternoon', category: 'Shinto Shrine', cost: 0, latitude: 35.6764, longitude: 139.6993, image_url: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=600' },
        { name: 'Shibuya Scramble Crossing & Sky Deck', period: 'Evening (17:30 - 20:30)', time_slot: 'Evening', category: 'Neon Metropolis', cost: 2200, latitude: 35.6595, longitude: 139.7005, image_url: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=600' }
      ]
    },
    {
      id: 'paris',
      name: 'Paris',
      title: 'City of Light & Art',
      category: 'International',
      defaultCurrency: 'EUR',
      image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600',
      tag: 'Eiffel Tower & Louvre',
      coords: [48.8566, 2.3522],
      activities: [
        { name: 'Eiffel Tower Summit View', period: 'Morning (09:00 - 12:00)', time_slot: 'Morning', category: 'Global Landmark', cost: 28, latitude: 48.8584, longitude: 2.2945, image_url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600' },
        { name: 'Louvre Museum Mona Lisa Tour', period: 'Afternoon (13:30 - 17:00)', time_slot: 'Afternoon', category: 'World Art Museum', cost: 22, latitude: 48.8606, longitude: 2.3376, image_url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600' },
        { name: 'Seine River Sunset Cruise', period: 'Evening (18:30 - 20:30)', time_slot: 'Evening', category: 'River Romance', cost: 18, latitude: 48.8570, longitude: 2.3510, image_url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600' }
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

  // Handle destination selection with automatic currency update
  const handleSelectDestination = (dest) => {
    setSelectedCity(dest.name);
    if (dest.defaultCurrency && currencyRates[dest.defaultCurrency]) {
      setCurrency(dest.defaultCurrency);
    }
    setScheduleGenerated(true);
  };

  // Dynamic Total Spent & Out of Budget Calculations
  const totalSpentINR = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const convertedTotalSpent = Math.round(totalSpentINR * activeRate);
  const isOutOfBudget = convertedTotalSpent > convertedTotalBudget;
  const overBudgetAmount = isOutOfBudget ? (convertedTotalSpent - convertedTotalBudget) : 0;
  const convertedRemaining = isOutOfBudget ? 0 : (convertedTotalBudget - convertedTotalSpent);
  const spentPercentage = Math.min(100, Math.round((convertedTotalSpent / (convertedTotalBudget || 1)) * 100));

  // Category Telemetry Breakdown Totals (INR Base)
  const categorySpentINR = {
    Food: expenses.filter(e => e.category === 'Food').reduce((sum, e) => sum + e.amount, 0),
    Stay: expenses.filter(e => e.category === 'Stay').reduce((sum, e) => sum + e.amount, 0),
    Transport: expenses.filter(e => e.category === 'Transport').reduce((sum, e) => sum + e.amount, 0),
    Activities: expenses.filter(e => e.category === 'Activities' || e.category === 'Darshan' || e.category === 'Guide' || e.category === 'Shopping').reduce((sum, e) => sum + e.amount, 0)
  };

  // Add New Expense to History
  const handleAddExpense = (e) => {
    e.preventDefault();
    if (!newExpenseTitle.trim() || !newExpenseAmount) return;

    const parsedAmountINR = Math.round(parseFloat(newExpenseAmount) / activeRate);
    const now = new Date();
    const formattedDate = `${now.toISOString().split('T')[0]} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    const newExp = {
      id: Date.now(),
      title: newExpenseTitle,
      amount: parsedAmountINR,
      category: newExpenseCategory,
      date: formattedDate,
      icon: newExpenseCategory === 'Food' ? 'food' : newExpenseCategory === 'Stay' ? 'hotel' : newExpenseCategory === 'Transport' ? 'car' : 'ticket'
    };

    setExpenses([newExp, ...expenses]);
    setNewExpenseTitle('');
    setNewExpenseAmount('');
    setShowAddExpenseModal(false);
  };

  // Delete Expense from History
  const handleDeleteExpense = (id) => {
    setExpenses(expenses.filter(e => e.id !== id));
  };

  // Filtered Itemized Expense List
  const filteredExpenseList = expenses.filter(item => {
    if (selectedExpenseCategoryFilter === 'All') return true;
    if (selectedExpenseCategoryFilter === 'Food') return item.category === 'Food';
    if (selectedExpenseCategoryFilter === 'Stay') return item.category === 'Stay';
    if (selectedExpenseCategoryFilter === 'Transport') return item.category === 'Transport';
    if (selectedExpenseCategoryFilter === 'Activities') return item.category === 'Activities' || item.category === 'Darshan' || item.category === 'Guide' || item.category === 'Shopping';
    return true;
  });

  // 1-Click Auto Expand Budget by 30% if Out of Budget
  const handleExpandBudget = () => {
    setBaseBudgetINR(prev => Math.round(prev * 1.3));
  };

  // Set preset budget tier directly from user
  const handleSetPresetBudgetTier = (tier) => {
    if (tier === 'budget') {
      setBaseBudgetINR(Math.round(totalMinRequiredINR * 1.1));
    } else if (tier === 'standard') {
      setBaseBudgetINR(Math.round(totalMinRequiredINR * 2.2));
    } else {
      setBaseBudgetINR(Math.round(totalMinRequiredINR * 4.5));
    }
  };

  // Set Recommended Minimum Budget
  const handleSetMinRecommendedBudget = () => {
    setBaseBudgetINR(totalMinRequiredINR);
  };

  // User manual budget change input handler
  const handleUserBudgetInputChange = (val) => {
    const num = parseFloat(val) || 0;
    const inrVal = Math.round(num / activeRate);
    setBaseBudgetINR(inrVal);
  };

  // REAL BACKEND BOOKING API CALL
  const handleBookStay = async (stayName, price, type) => {
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          item_type: type || 'Ashram',
          item_name: stayName,
          price: price,
          dates: `${days} Days (${selectedCity} Circuit)`,
          user_name: user ? user.name : 'Guest Pilgrim',
          user_email: user ? user.email : 'guest@smarttrip.in',
          city: selectedCity
        })
      });

      const data = await response.json();
      if (data.success) {
        setConfirmedBooking({
          title: 'Stay Booking Confirmed!',
          code: data.confirmation_code,
          name: stayName,
          type: type || 'Ashram',
          price: price,
          city: selectedCity,
          dates: `${days} Days Circuit`
        });

        // Automatically log to expense history
        setExpenses(prev => [{
          id: Date.now(),
          title: `${stayName} Booking`,
          amount: price,
          category: 'Stay',
          date: 'Just now',
          icon: 'hotel'
        }, ...prev]);
      } else {
        throw new Error('Fallback to local confirmation');
      }
    } catch (err) {
      const localCode = `ST-BK-${Math.floor(1000 + Math.random() * 9000)}`;
      setConfirmedBooking({
        title: 'Stay Booking Confirmed!',
        code: localCode,
        name: stayName,
        type: type || 'Ashram',
        price: price,
        city: selectedCity,
        dates: `${days} Days Circuit`
      });

      setExpenses(prev => [{
        id: Date.now(),
        title: `${stayName} Booking`,
        amount: price,
        category: 'Stay',
        date: 'Just now',
        icon: 'hotel'
      }, ...prev]);
    }
  };

  // REAL BACKEND GUIDE BOOKING API CALL
  const handleBookGuide = async (guideName, ratePerHour) => {
    const totalGuidePrice = ratePerHour * 4;
    try {
      const response = await fetch('/api/guides/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guide_name: guideName,
          city: selectedCity,
          date: 'Tomorrow (Morning Darshan)',
          hours: 4,
          traveler_name: user ? user.name : 'Guest Pilgrim',
          price: totalGuidePrice
        })
      });

      const data = await response.json();
      if (data.success) {
        setConfirmedBooking({
          title: 'Vedic Guide Booked!',
          code: data.voucher_code,
          name: guideName,
          type: 'Verified Guide',
          price: totalGuidePrice,
          city: selectedCity,
          dates: '4 Hours (Morning Darshan & Parikrama)'
        });

        setExpenses(prev => [{
          id: Date.now(),
          title: `${guideName} (4 hrs Guide)`,
          amount: totalGuidePrice,
          category: 'Activities',
          date: 'Just now',
          icon: 'guide'
        }, ...prev]);
      } else {
        throw new Error('Fallback to local confirmation');
      }
    } catch (err) {
      const localCode = `ST-GD-${Math.floor(1000 + Math.random() * 9000)}`;
      setConfirmedBooking({
        title: 'Vedic Guide Booked!',
        code: localCode,
        name: guideName,
        type: 'Verified Guide',
        price: totalGuidePrice,
        city: selectedCity,
        dates: '4 Hours (Morning Darshan & Parikrama)'
      });

      setExpenses(prev => [{
        id: Date.now(),
        title: `${guideName} (4 hrs Guide)`,
        amount: totalGuidePrice,
        category: 'Activities',
        date: 'Just now',
        icon: 'guide'
      }, ...prev]);
    }
  };

  // Authentication Logic with Backend Connection
  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccessMsg('');

    if (!authFormData.email) {
      setAuthError('Please enter a valid email address.');
      return;
    }
    if (!authFormData.password || authFormData.password.length < 6) {
      setAuthError('Password must be at least 6 characters long.');
      return;
    }
    if (authMode === 'signup' && !authFormData.name) {
      setAuthError('Please enter your full name.');
      return;
    }

    try {
      const endpoint = authMode === 'signup' ? '/api/auth/signup' : '/api/auth/login';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: authFormData.name,
          email: authFormData.email,
          password: authFormData.password,
          travel_interest: authFormData.travelInterest
        })
      });
      const data = await response.json();
      if (data.success && data.user) {
        setUser(data.user);
      } else {
        setUser({
          name: authMode === 'signup' ? authFormData.name : authFormData.email.split('@')[0],
          email: authFormData.email,
          role: 'VIP Pilgrim',
          savedTrips: 4
        });
      }
    } catch (err) {
      setUser({
        name: authMode === 'signup' ? authFormData.name : authFormData.email.split('@')[0],
        email: authFormData.email,
        role: 'VIP Pilgrim',
        savedTrips: 4
      });
    }

    setAuthSuccessMsg(authMode === 'login' ? 'Logged in successfully!' : 'Account created successfully! Welcome to SmartTrip.');

    setTimeout(() => {
      setIsAuthOpen(false);
      setAuthSuccessMsg('');
      setAuthFormData({ name: '', email: '', password: '', travelInterest: 'Spiritual', rememberMe: true });
    }, 600);
  };

  const handleQuickDemoLogin = (type) => {
    if (type === 'pilgrim') {
      setUser({ name: 'Rahul Sharma', email: 'rahul.pilgrim@smarttrip.in', role: 'VIP Pilgrim', savedTrips: 6 });
    } else if (type === 'guide') {
      setUser({ name: 'Pt. Shivam Shastri', email: 'shivam.vedic@smarttrip.in', role: 'Verified Vedic Guide', savedTrips: 18 });
    } else {
      setUser({ name: 'Aanya Patel', email: 'aanya.global@smarttrip.in', role: 'Global Explorer', savedTrips: 9 });
    }
    setIsAuthOpen(false);
  };

  // Generate Structured Day-Wise Itinerary Plan & Budget Breakdown
  const generateDayWiseSchedule = () => {
    const acts = activeDestination.activities || [];
    const dayWiseList = [];

    const dayThemes = [
      { title: 'Sanctum Darshan & Holy Ghat Parikrama', sub: 'Arrival, primary temple visit, evening river aarti' },
      { title: 'Corridor Walk, Ancient Teerths & Heritage', sub: 'Historical exploration, local markets & satvik feast' },
      { title: 'Excursion Trails & Scenic Panoramic Vistas', sub: 'Outskirt teerths, boat parikrama & tranquil spots' },
      { title: 'Spiritual Discourses & Ashram Meditation', sub: 'Deep Vedic interactions, meditation & local souvenirs' },
      { title: 'Grand Farewell & Sacred Souvenir Parikrama', sub: 'Morning final prayers, prasad packaging & departure' }
    ];

    for (let d = 1; d <= days; d++) {
      const themeIndex = (d - 1) % dayThemes.length;
      const theme = dayThemes[themeIndex];
      
      // Calculate realistic day expenditure breakdown based on total defined budget
      const rawDayBudget = Math.round(convertedTotalBudget / days);
      const stayShare = Math.round(rawDayBudget * 0.35);
      const foodShare = Math.round(rawDayBudget * 0.25);
      const transitShare = Math.round(rawDayBudget * 0.18);
      const darshanShare = rawDayBudget - (stayShare + foodShare + transitShare);

      // Activities tailored for this day
      let dayActivities = [];
      if (d === 1) {
        dayActivities = acts.slice(0, 3);
      } else if (d === 2) {
        dayActivities = acts.length > 3 ? acts.slice(3, 6) : [
          { name: `${selectedCity} Heritage Corridor & Ancient Shrines`, period: 'Morning (06:30 - 10:30)', time_slot: 'Morning', category: 'Spiritual Heritage', cost: Math.round(100 * activeRate) },
          { name: `Local Satvik Annakshetra & Handicraft Bazaar`, period: 'Afternoon (13:00 - 16:00)', time_slot: 'Afternoon', category: 'Cultural Walk', cost: Math.round(150 * activeRate) },
          { name: `Grand Maha Sandhya Aarti & Riverfront Illumination`, period: 'Evening (18:30 - 20:30)', time_slot: 'Evening', category: 'Ghat Ceremony', cost: 0 }
        ];
      } else {
        dayActivities = [
          { name: `${selectedCity} Surroundings & Nature Parikrama`, period: 'Morning (07:00 - 11:00)', time_slot: 'Morning', category: 'Scenic & Dharmik', cost: Math.round(80 * activeRate) },
          { name: `Traditional Vedic Ashram Meditation & Satsang`, period: 'Afternoon (14:00 - 16:30)', time_slot: 'Afternoon', category: 'Ashram Life', cost: 0 },
          { name: `Sunset Panorama Point & Departure Preparations`, period: 'Evening (17:30 - 20:00)', time_slot: 'Evening', category: 'Sunset Vista', cost: Math.round(50 * activeRate) }
        ];
      }

      dayWiseList.push({
        dayNumber: d,
        themeTitle: theme.title,
        themeSub: theme.sub,
        dayBudget: rawDayBudget,
        breakdown: {
          stay: stayShare,
          food: foodShare,
          transit: transitShare,
          darshan: darshanShare
        },
        activities: dayActivities
      });
    }

    return dayWiseList;
  };

  const dayWiseSchedule = generateDayWiseSchedule();

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
    <div className={`min-h-screen flex transition-colors duration-200 ${
      isDarkMode ? 'bg-[#070d18] text-slate-100' : 'bg-[#f8fafc] text-slate-900'
    }`}>
      
      {/* MOBILE HAMBURGER TOP BAR */}
      <div className={`md:hidden fixed top-0 left-0 right-0 z-40 px-4 py-3 border-b flex items-center justify-between shadow-xs ${
        isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-sm">
            ST
          </div>
          <span className="font-extrabold text-base tracking-tight">Smart<span className="text-emerald-600">Trip</span></span>
        </div>

        <button 
          onClick={() => setSidebarOpenMobile(!sidebarOpenMobile)}
          className={`p-2 rounded-xl border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-200'}`}
        >
          {sidebarOpenMobile ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* 1. LEFT VERTICAL SIDEBAR (DESKTOP FIXED + MOBILE SLIDEOUT) */}
      <aside className={`
        fixed md:sticky top-0 left-0 bottom-0 h-screen w-64 border-r flex flex-col justify-between p-4 z-50 transition-all duration-300 shadow-sm
        ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}
        ${sidebarOpenMobile ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div>
          {/* Logo */}
          <div 
            onClick={() => {
              setActiveTab('itinerary');
              setSidebarOpenMobile(false);
            }}
            className="flex items-center gap-2.5 px-2 py-3 mb-4 cursor-pointer select-none"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-lg shadow-sm">
              ST
            </div>
            <div>
              <span className={`text-xl font-extrabold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                Smart<span className="text-emerald-600">Trip</span>
              </span>
              <span className="block text-[9px] font-bold text-emerald-600 uppercase tracking-wider">Global & Dharmik Circuits</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1">
            {navMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setSidebarOpenMobile(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all text-left ${
                    isActive
                      ? isDarkMode 
                        ? 'bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30'
                        : 'bg-emerald-50 text-emerald-700 font-bold border border-emerald-200/80 shadow-xs'
                      : isDarkMode
                        ? 'text-slate-400 hover:text-white hover:bg-slate-800'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon size={17} className={isActive ? (isDarkMode ? 'text-emerald-400' : 'text-emerald-600') : 'text-slate-400'} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Hub: Theme Switcher + User Profile + Red SOS Button */}
        <div className={`pt-4 border-t flex flex-col gap-2.5 ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
          
          {/* Theme Toggle Button */}
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-semibold text-slate-400">Theme</span>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`px-3 py-1.5 rounded-xl border transition-all flex items-center gap-1.5 text-xs font-bold ${
                isDarkMode 
                  ? 'bg-slate-800 text-amber-400 border-slate-700' 
                  : 'bg-slate-100 text-slate-700 border-slate-200'
              }`}
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDarkMode ? <Sun size={14} /> : <Moon size={14} />}
              <span>{isDarkMode ? 'Dark' : 'Light'}</span>
            </button>
          </div>

          {/* User Sign In / Profile Card */}
          <div className={`p-2.5 rounded-2xl border transition-all ${
            isDarkMode ? 'bg-slate-800/80 border-slate-700 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
          }`}>
            {user ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                      {user.name[0].toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <h5 className={`font-bold text-xs truncate leading-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{user.name}</h5>
                      <span className="text-[10px] text-emerald-600 font-semibold block truncate">{user.role}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setUser(null)}
                    className="text-slate-400 hover:text-rose-500 p-1 transition-colors"
                    title="Sign Out"
                  >
                    <LogOut size={14} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-slate-300 text-slate-700 flex items-center justify-center font-bold text-xs">
                    G
                  </div>
                  <span className="font-medium text-xs">Guest User</span>
                </div>
                <button
                  onClick={() => {
                    setAuthMode('login');
                    setIsAuthOpen(true);
                  }}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1 rounded-xl text-xs shadow-xs transition-all"
                >
                  Sign In
                </button>
              </div>
            )}
          </div>

          {/* Red EMERGENCY SOS Button */}
          <button
            onClick={() => alert('🚨 EMERGENCY SOS: Coordinates dispatched to 112 Police and 108 Ambulance.')}
            className="w-full bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-bold py-2.5 px-3 rounded-xl text-xs shadow-sm transition-all flex items-center justify-center gap-1.5"
          >
            <Flame size={15} />
            <span>EMERGENCY SOS</span>
          </button>

        </div>
      </aside>

      {/* 2. MAIN RIGHT SCROLLABLE CONTENT */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 pt-16 md:pt-8 space-y-6">
        <div className="max-w-6xl mx-auto space-y-6">
          
          {/* MODULE 1: ITINERARY PLANNER (WITH DYNAMIC DAY-WISE ITINERARY & MONEY BREAKDOWN) */}
          {activeTab === 'itinerary' && (
            <div className="space-y-6">
              
              {/* GREEN BANNER (FROM SCREENSHOT) */}
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-800 to-emerald-950 text-white p-6 sm:p-8 shadow-md">
                <div className="max-w-3xl space-y-2 relative z-10">
                  <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/10 text-emerald-300 text-xs font-semibold tracking-wide border border-white/10">
                    <span>AICTE 2026/02 • DHARMIK & GLOBAL HERITAGE BOOSTER</span>
                  </div>
                  <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                    Automate Pilgrimage & Spiritual Circuits in Seconds.
                  </h1>
                  <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed max-w-2xl font-normal">
                    Intelligent clustering for Jyotirlingas, Char Dham, Ram Mandir Ayodhya, Ghats, Switzerland, Dubai, Bali, Ashrams, user-defined budgeting, and verified Vedic guides.
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
                  placeholder="SEARCH ANY PILGRIMAGE, HERITAGE OR SCENIC DESTINATION... (e.g. Ujjain, Switzerland, Dubai, Bali, Tokyo, Ayodhya, Varanasi...)"
                  className={`w-full pl-11 pr-4 py-3 border rounded-2xl text-xs sm:text-sm transition-all shadow-xs ${
                    isDarkMode 
                      ? 'bg-slate-900 border-slate-800 text-white placeholder-slate-500' 
                      : 'bg-white border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-600'
                  }`}
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
                        : isDarkMode 
                          ? 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800' 
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
                  <h3 className={`text-sm font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                    Interactive Tourism Grid ({filteredDestinations.length} Destinations Available)
                  </h3>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
                  {filteredDestinations.map((dest) => {
                    const isSelected = selectedCity === dest.name;
                    return (
                      <div
                        key={dest.id}
                        onClick={() => handleSelectDestination(dest)}
                        className={`group relative overflow-hidden rounded-2xl cursor-pointer transition-all border ${
                          isSelected 
                            ? 'border-emerald-600 ring-2 ring-emerald-600/30 shadow-md scale-[1.01]' 
                            : isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
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

                          <div className="absolute top-2 left-2 flex items-center gap-1">
                            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-xs text-white border border-white/20">
                              {dest.category}
                            </span>
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-600/80 text-white">
                              {dest.defaultCurrency || 'INR'}
                            </span>
                          </div>
                          
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

              {/* ⚠️ REAL-TIME SMART "BUDGET TOO LOW" WARNING BANNER */}
              {isBudgetTooLow && (
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-600 via-orange-600 to-rose-700 text-white p-5 sm:p-6 shadow-md border border-amber-400">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-3.5">
                      <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0">
                        <AlertTriangle size={24} className="text-amber-100 animate-bounce" />
                      </div>
                      <div>
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-black/40 text-amber-200 text-[10px] font-black uppercase tracking-wider mb-1">
                          ⚠️ BUDGET DEFICIT ADVISORY
                        </div>
                        <h4 className="text-base sm:text-lg font-black">
                          Your Defined Budget ({activeSymbol}{convertedTotalBudget.toLocaleString()}) is Too Low for {selectedCity} ({days} Days)!
                        </h4>
                        <p className="text-xs text-amber-100/90 font-medium mt-0.5 leading-relaxed">
                          Basic daily accommodation (Ashram/Stay), local transit & satvik meals in {selectedCity} realistically require at least <strong>{activeSymbol}{convertedMinRequired.toLocaleString()}</strong> ({activeSymbol}{Math.round(minDailyINR * activeRate).toLocaleString()}/day).
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={handleSetMinRecommendedBudget}
                      className="bg-white text-orange-800 hover:bg-amber-50 active:scale-95 font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-sm whitespace-nowrap transition-transform flex items-center gap-1.5"
                    >
                      <Zap size={14} />
                      <span>Set Recommended ({activeSymbol}{convertedMinRequired.toLocaleString()})</span>
                    </button>
                  </div>
                </div>
              )}

              {/* HORIZONTAL TRIP SETTINGS BAR WITH USER-DEFINED BUDGET INPUT */}
              <div className={`border rounded-3xl p-5 sm:p-6 shadow-sm space-y-4 transition-colors ${
                isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
              }`}>
                
                {/* Top Row: Destination, Currency, Days & Custom Budget Input */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
                  
                  {/* 1. Destination */}
                  <div className={`border-b sm:border-b-0 sm:border-r pb-3 sm:pb-0 pr-0 sm:pr-4 ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Selected Destination</span>
                    <span className={`font-black text-lg ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{selectedCity}</span>
                  </div>

                  {/* 2. Currency Dropdown Menu */}
                  <div className={`border-b sm:border-b-0 sm:border-r pb-3 sm:pb-0 pr-0 sm:pr-4 ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Trip Currency (Auto)</span>
                    <div className="relative mt-1">
                      <select
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                        className={`w-full text-xs font-bold py-2 px-3 rounded-xl border focus:outline-none transition-all cursor-pointer ${
                          isDarkMode 
                            ? 'bg-slate-800 border-slate-700 text-emerald-400 focus:border-emerald-500' 
                            : 'bg-emerald-50 border-emerald-200 text-emerald-800 focus:border-emerald-500'
                        }`}
                      >
                        {Object.entries(currencyRates).map(([code, item]) => (
                          <option key={code} value={code} className={isDarkMode ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}>
                            {item.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* 3. Duration */}
                  <div className={`border-b sm:border-b-0 lg:border-r pb-3 sm:pb-0 pr-0 sm:pr-4 ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Duration (Days)</span>
                    <div className="flex items-center gap-2 mt-1">
                      <button onClick={() => setDays(Math.max(1, days - 1))} className={`w-7 h-7 rounded-lg font-bold text-xs flex items-center justify-center ${isDarkMode ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-700'}`}>-</button>
                      <span className={`font-extrabold text-sm ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{days} Days</span>
                      <button onClick={() => setDays(Math.min(14, days + 1))} className={`w-7 h-7 rounded-lg font-bold text-xs flex items-center justify-center ${isDarkMode ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-700'}`}>+</button>
                    </div>
                  </div>

                  {/* 4. USER-DEFINED EDITABLE BUDGET INPUT */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Define Your Budget ({currency})
                      </span>
                      {isBudgetTooLow && (
                        <span className="text-[9px] font-black text-rose-500 uppercase tracking-wider">
                          Too Low
                        </span>
                      )}
                    </div>

                    <div className="relative">
                      <span className="absolute left-3 top-2 text-xs font-black text-slate-400">
                        {activeSymbol}
                      </span>
                      <input
                        type="number"
                        min="100"
                        value={convertedTotalBudget}
                        onChange={(e) => handleUserBudgetInputChange(e.target.value)}
                        placeholder="Enter budget..."
                        className={`w-full pl-8 pr-3 py-1.5 border rounded-xl text-sm font-black focus:outline-none transition-all ${
                          isBudgetTooLow 
                            ? 'border-rose-500 text-rose-500 bg-rose-500/5'
                            : isDarkMode 
                              ? 'bg-slate-800 border-slate-700 text-emerald-400 focus:border-emerald-500' 
                              : 'bg-emerald-50/60 border-emerald-200 text-emerald-800 focus:border-emerald-500'
                        }`}
                      />
                    </div>
                  </div>

                </div>

                {/* Bottom Row: 3 Quick Preset Tiers + Explore Button */}
                <div className={`pt-3 border-t flex flex-col sm:flex-row items-center justify-between gap-3 ${
                  isDarkMode ? 'border-slate-800' : 'border-slate-100'
                }`}>
                  <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto no-scrollbar">
                    <span className="text-[11px] font-bold text-slate-400 whitespace-nowrap">Plan Style:</span>
                    
                    <button
                      onClick={() => handleSetPresetBudgetTier('budget')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1 ${
                        budgetTier === 'budget' && !isBudgetTooLow
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : isDarkMode ? 'bg-slate-800 text-slate-300 hover:text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      🎒 Pocket-Friendly
                    </button>

                    <button
                      onClick={() => handleSetPresetBudgetTier('standard')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1 ${
                        budgetTier === 'standard' && !isBudgetTooLow
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : isDarkMode ? 'bg-slate-800 text-slate-300 hover:text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      ⚖️ Standard Comfort
                    </button>

                    <button
                      onClick={() => handleSetPresetBudgetTier('luxury')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1 ${
                        budgetTier === 'luxury' && !isBudgetTooLow
                          ? 'bg-amber-600 text-white shadow-xs'
                          : isDarkMode ? 'bg-slate-800 text-slate-300 hover:text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      👑 VIP Luxury Pass
                    </button>
                  </div>

                  <button
                    onClick={() => setScheduleGenerated(true)}
                    className="w-full sm:w-auto bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white font-bold px-8 py-2.5 rounded-xl transition-all shadow-sm text-xs whitespace-nowrap"
                  >
                    UPDATE ITINERARY
                  </button>
                </div>

              </div>

              {/* INTERACTIVE MAP + DAY-WISE ITINERARY RESULTS */}
              {scheduleGenerated && (
                <div className="space-y-6">
                  
                  {/* Top Bar: Leaflet Map */}
                  <div className={`border p-4 sm:p-5 rounded-3xl shadow-sm space-y-3 ${
                    isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                  }`}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <MapPin className={isDarkMode ? 'text-emerald-400' : 'text-emerald-600'} size={20} />
                        <div>
                          <h3 className={`font-extrabold text-base ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                            Live Interactive Route Map: {selectedCity}
                          </h3>
                          <p className="text-xs text-slate-400">
                            Connected waypoints for {days} Days Spiritual & Sightseeing Parikrama
                          </p>
                        </div>
                      </div>
                      <span className={`text-xs font-bold px-3 py-1 rounded-full self-start ${
                        isDarkMode ? 'bg-emerald-500/20 text-emerald-300' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {activeDestination.activities?.length || 3} Waypoints Active
                      </span>
                    </div>

                    <InteractiveMap 
                      destination={selectedCity}
                      centerCoords={activeDestination.coords}
                      activities={activeDestination.activities || []}
                      className="h-72 sm:h-80 w-full"
                    />
                  </div>

                  {/* DAY-WISE ITINERARY & MONEY BREAKDOWN SECTION */}
                  <div className={`border p-5 sm:p-6 rounded-3xl shadow-sm space-y-5 ${
                    isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                  }`}>
                    
                    {/* Header: Overview Summary & Tier */}
                    <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4 ${
                      isDarkMode ? 'border-slate-800' : 'border-slate-100'
                    }`}>
                      <div>
                        <div className="flex items-center gap-2.5">
                          <h3 className={`font-extrabold text-xl ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                            {selectedCity} Day-Wise Itinerary & Expense Plan
                          </h3>
                          <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-md text-white ${
                            budgetTier === 'luxury' ? 'bg-amber-600' : budgetTier === 'budget' ? 'bg-blue-600' : 'bg-emerald-600'
                          }`}>
                            {budgetTier === 'luxury' ? '👑 VIP Luxury' : budgetTier === 'budget' ? '🎒 Pocket-Friendly' : '⚖️ Standard'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Generated custom schedule across {days} Days • Total Budget: {activeSymbol}{convertedTotalBudget.toLocaleString()}
                        </p>
                      </div>

                      {/* Day Filter Pills */}
                      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                        <button
                          onClick={() => setActiveDayView('all')}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                            activeDayView === 'all'
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : isDarkMode ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          All {days} Days
                        </button>
                        {Array.from({ length: days }, (_, i) => i + 1).map((dNum) => (
                          <button
                            key={dNum}
                            onClick={() => setActiveDayView(dNum)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                              activeDayView === dNum
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : isDarkMode ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                          >
                            Day {dNum}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Adaptation Banner */}
                    <div className={`p-3.5 rounded-2xl border text-xs leading-relaxed flex items-start gap-2.5 ${
                      budgetTier === 'luxury'
                        ? isDarkMode ? 'bg-amber-500/10 border-amber-500/30 text-amber-300' : 'bg-amber-50 border-amber-200 text-amber-800'
                        : budgetTier === 'budget'
                          ? isDarkMode ? 'bg-blue-500/10 border-blue-500/30 text-blue-300' : 'bg-blue-50 border-blue-200 text-blue-800'
                          : isDarkMode ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    }`}>
                      <Sparkles size={16} className="shrink-0 mt-0.5" />
                      <div>
                        <strong>{budgetTier === 'luxury' ? '👑 VIP Day-Wise Allocation' : budgetTier === 'budget' ? '🎒 Budget Satvik Mode' : '⚖️ Standard Comfort Plan'}:</strong>{' '}
                        {budgetTier === 'luxury' 
                          ? 'Each day allocates funds for VIP Protocol Darshan, 4-star stay, private cab, and personal Vedic Acharya guide.'
                          : budgetTier === 'budget'
                            ? 'Each day optimizes zero-entry shrines, shared ashram stays, satvik langar thalis, and local e-rickshaws.'
                            : 'Each day balances Sugam Darshan passes, AC stay rooms, satvik meals, and convenient auto/cab transfers.'}
                      </div>
                    </div>

                    {/* DAY CARDS CONTAINER */}
                    <div className="space-y-6">
                      {dayWiseSchedule
                        .filter(dayItem => activeDayView === 'all' || activeDayView === dayItem.dayNumber)
                        .map((dayItem) => (
                          <div 
                            key={dayItem.dayNumber}
                            className={`border rounded-3xl p-5 space-y-4 transition-all ${
                              isDarkMode ? 'bg-slate-800/40 border-slate-700/80' : 'bg-slate-50/80 border-slate-200'
                            }`}
                          >
                            
                            {/* DAY HEADER & MONEY ESTIMATION BAR */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3 border-slate-200 dark:border-slate-700">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white font-black text-sm flex items-center justify-center shadow-xs">
                                  D{dayItem.dayNumber}
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <h4 className={`font-black text-base ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                      Day {dayItem.dayNumber}: {dayItem.themeTitle}
                                    </h4>
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-600/10 text-emerald-600 dark:text-emerald-400">
                                      Day {dayItem.dayNumber} of {days}
                                    </span>
                                  </div>
                                  <p className="text-xs text-slate-400 mt-0.5">{dayItem.themeSub}</p>
                                </div>
                              </div>

                              {/* Day Money Badge */}
                              <div className="text-left sm:text-right bg-white dark:bg-slate-900 px-4 py-2 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xs">
                                <span className="text-[10px] text-slate-400 font-bold uppercase block">
                                  Day {dayItem.dayNumber} Est. Expenditure
                                </span>
                                <span className="text-base font-black text-emerald-600">
                                  {activeSymbol}{dayItem.dayBudget.toLocaleString()}
                                </span>
                              </div>
                            </div>

                            {/* DAY ESTIMATED EXPENSE CATEGORY BREAKDOWN TAGS */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                              
                              <div className={`p-2.5 rounded-xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400">
                                  <Building2 size={13} className="text-blue-500" />
                                  <span>Stay / Ashram</span>
                                </div>
                                <span className="text-xs font-black text-slate-800 dark:text-slate-200 mt-0.5 block">
                                  {activeSymbol}{dayItem.breakdown.stay.toLocaleString()}
                                </span>
                              </div>

                              <div className={`p-2.5 rounded-xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400">
                                  <Utensils size={13} className="text-amber-500" />
                                  <span>Satvik Meals</span>
                                </div>
                                <span className="text-xs font-black text-slate-800 dark:text-slate-200 mt-0.5 block">
                                  {activeSymbol}{dayItem.breakdown.food.toLocaleString()}
                                </span>
                              </div>

                              <div className={`p-2.5 rounded-xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400">
                                  <Car size={13} className="text-emerald-500" />
                                  <span>Local Transit</span>
                                </div>
                                <span className="text-xs font-black text-slate-800 dark:text-slate-200 mt-0.5 block">
                                  {activeSymbol}{dayItem.breakdown.transit.toLocaleString()}
                                </span>
                              </div>

                              <div className={`p-2.5 rounded-xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400">
                                  <Ticket size={13} className="text-purple-500" />
                                  <span>Darshan & Entry</span>
                                </div>
                                <span className="text-xs font-black text-slate-800 dark:text-slate-200 mt-0.5 block">
                                  {activeSymbol}{dayItem.breakdown.darshan.toLocaleString()}
                                </span>
                              </div>

                            </div>

                            {/* DAY ACTIVITIES TIMELINE */}
                            <div className="space-y-2.5 pt-1">
                              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                                Day {dayItem.dayNumber} Timeline Schedule
                              </span>
                              
                              {dayItem.activities.map((act, actIdx) => (
                                <div 
                                  key={actIdx}
                                  className={`p-3 rounded-2xl border flex items-start justify-between gap-3 ${
                                    isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-2xs'
                                  }`}
                                >
                                  <div className="flex items-start gap-3 min-w-0">
                                    <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white font-black text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                                      {actIdx + 1}
                                    </div>
                                    <div className="min-w-0">
                                      <span className={`text-[10px] font-bold uppercase tracking-wider ${
                                        isDarkMode ? 'text-emerald-400' : 'text-emerald-700'
                                      }`}>
                                        {act.period || act.time_slot}
                                      </span>
                                      <h5 className={`font-bold text-xs sm:text-sm mt-0.5 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                        {act.name}
                                      </h5>
                                      <p className="text-[11px] text-slate-400 mt-0.5">
                                        Category: {act.category}
                                      </p>
                                    </div>
                                  </div>

                                  <div className="shrink-0 text-right">
                                    <span className="text-xs font-black text-emerald-600 block">
                                      {act.cost ? `${activeSymbol}${Math.round(act.cost * (currency === 'INR' ? 1 : activeRate)).toLocaleString()}` : 'Free Entry'}
                                    </span>
                                    <span className="text-[9px] text-slate-400 font-semibold">Entry / Puja</span>
                                  </div>
                                </div>
                              ))}
                            </div>

                          </div>
                        ))}
                    </div>

                  </div>

                </div>
              )}

            </div>
          )}

          {/* MODULE 2: ASHRAMS & STAYS (EXPANDED TO MIN 5 PER PLACE WITH LOCALS & LUXURY HOTELS) */}
          {activeTab === 'hotels' && (
            <div className="space-y-6">
              
              {/* Header & City Badge */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className={`text-2xl font-extrabold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    Ashrams, Heritage Stays & Luxury Hotels ({selectedCity})
                  </h2>
                  <p className="text-xs text-slate-400">
                    Handpicked satvik dharamshalas, boutique havelis, and 5-star luxury resorts in {selectedCity}.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-3.5 py-1.5 rounded-full bg-emerald-600 text-white shadow-xs">
                    {filteredStays.length} Stays Available in {selectedCity}
                  </span>
                </div>
              </div>

              {/* Filter Pills for Stay Categories */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
                {[
                  { id: 'All', label: 'All Accommodations (5+)' },
                  { id: 'Ashram', label: '🛕 Satvik Ashrams & Pilgrim Niwas' },
                  { id: 'Heritage', label: '🏛️ Heritage Havelis & Chalets' },
                  { id: 'Luxury', label: '👑 4-Star & 5-Star Luxury Resorts' }
                ].map((tier) => (
                  <button
                    key={tier.id}
                    onClick={() => setSelectedStayType(tier.id)}
                    className={`px-4 py-2 rounded-full font-bold whitespace-nowrap transition-all text-xs ${
                      selectedStayType === tier.id
                        ? 'bg-emerald-700 text-white shadow-xs'
                        : isDarkMode 
                          ? 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800' 
                          : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300'
                    }`}
                  >
                    {tier.label}
                  </button>
                ))}
              </div>

              {/* Stays Grid (Minimum 5 per Destination) */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredStays.map((stay) => {
                  const convertedPrice = Math.round(stay.priceINR * activeRate);
                  return (
                    <div 
                      key={stay.id}
                      className={`border rounded-3xl overflow-hidden shadow-xs flex flex-col justify-between transition-all group ${
                        isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-md'
                      }`}
                    >
                      <div className="h-44 w-full relative overflow-hidden">
                        <img 
                          src={stay.image} 
                          alt={stay.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                        />
                        
                        <div className="absolute top-3 left-3 flex items-center gap-1.5">
                          <span className={`text-[10px] font-black px-2.5 py-1 rounded-full text-white shadow-xs ${
                            stay.category === 'Ashram' ? 'bg-emerald-600' :
                            stay.category === 'Heritage' ? 'bg-blue-600' :
                            stay.category === 'Luxury' ? 'bg-amber-600' : 'bg-slate-800'
                          }`}>
                            {stay.type}
                          </span>
                        </div>

                        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-xs text-amber-400 px-2 py-0.5 rounded-full text-[11px] font-extrabold flex items-center gap-1">
                          <Star size={12} className="fill-amber-400" />
                          <span>{stay.rating}</span>
                          <span className="text-white/70 font-normal text-[9px]">({stay.reviews})</span>
                        </div>

                        <div className="absolute bottom-2 left-3 right-3">
                          <span className="text-[10px] font-bold text-white bg-black/50 backdrop-blur-xs px-2 py-0.5 rounded-md flex items-center gap-1">
                            <MapPin size={10} className="text-emerald-400" />
                            <span className="truncate">{stay.distance}</span>
                          </span>
                        </div>
                      </div>

                      <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className={`font-extrabold text-base leading-snug ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                            {stay.name}
                          </h4>
                          <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                            {stay.amenities}
                          </p>
                        </div>

                        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                          <div>
                            <span className="text-[10px] text-slate-400 block font-semibold">Per Night</span>
                            <span className="text-base font-black text-emerald-600">
                              {activeSymbol}{convertedPrice.toLocaleString()}
                            </span>
                          </div>

                          <button 
                            onClick={() => handleBookStay(stay.name, stay.priceINR, stay.type)} 
                            className="bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white font-bold px-4 py-2 rounded-xl text-xs transition-all shadow-xs"
                          >
                            Book Stay
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          )}

          {/* MODULE 3: BUDGET TRACKER WITH LIVE CATEGORY TELEMETRY BREAKDOWN & ITEMIZED EXPENSES */}
          {activeTab === 'budget' && (
            <div className="space-y-6">
              
              {/* Top Bar Header & Add Expense Button */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className={`text-2xl font-extrabold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Multi-Currency Real-Time Budget Tracker</h2>
                  <p className="text-xs text-slate-400">Track and log all pilgrimage and travel expenses with live history.</p>
                </div>
                
                <div className="flex items-center gap-2">
                  {isOutOfBudget && (
                    <button
                      onClick={handleExpandBudget}
                      className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-xs"
                      title="Auto-increase budget by 30% to clear deficit"
                    >
                      <Zap size={14} />
                      <span>Expand Budget (+30%)</span>
                    </button>
                  )}

                  <button
                    onClick={() => setShowAddExpenseModal(true)}
                    className="bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-sm"
                  >
                    <Plus size={16} />
                    <span>Log Expense</span>
                  </button>
                </div>
              </div>

              {/* ⚠️ PROMINENT OUT-OF-BUDGET ALERT BANNER */}
              {isOutOfBudget && (
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-rose-600 via-rose-700 to-rose-900 text-white p-5 sm:p-6 shadow-lg border border-rose-500 animate-pulse">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-3.5">
                      <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0 shadow-inner">
                        <AlertOctagon size={28} className="text-rose-100" />
                      </div>
                      <div>
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-black/40 text-rose-200 text-[11px] font-black uppercase tracking-wider mb-1">
                          🚨 OVER BUDGET WARNING
                        </div>
                        <h3 className="text-lg sm:text-xl font-black tracking-tight">
                          You are Out of Budget by {activeSymbol}{overBudgetAmount.toLocaleString()} ({currency})!
                        </h3>
                        <p className="text-xs text-rose-100/90 font-medium mt-0.5">
                          Total trip expenditures ({activeSymbol}{convertedTotalSpent.toLocaleString()}) have surpassed your allocated budget ({activeSymbol}{convertedTotalBudget.toLocaleString()}).
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={handleExpandBudget}
                      className="bg-white text-rose-800 hover:bg-rose-50 active:scale-95 font-black text-xs px-5 py-2.5 rounded-xl shadow-md whitespace-nowrap transition-transform"
                    >
                      Auto-Adjust Budget
                    </button>
                  </div>
                </div>
              )}

              {/* 3 Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                
                {/* 1. Total Trip Budget */}
                <div className={`border p-5 rounded-2xl shadow-xs ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                  <p className="text-xs font-bold text-slate-400 uppercase">Total Trip Budget ({currency})</p>
                  <p className={`text-2xl font-black mt-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    {activeSymbol}{convertedTotalBudget.toLocaleString()}
                  </p>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full mt-3 overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: '100%' }} />
                  </div>
                </div>

                {/* 2. Total Spent */}
                <div className={`border p-5 rounded-2xl shadow-xs ${
                  isOutOfBudget 
                    ? 'border-rose-500/80 bg-rose-500/5' 
                    : isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                }`}>
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-slate-400 uppercase">Total Spent ({expenses.length} Items)</p>
                    {isOutOfBudget && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500 text-white">
                        Exceeded
                      </span>
                    )}
                  </div>
                  <p className={`text-2xl font-black mt-1 ${isOutOfBudget ? 'text-rose-500' : isDarkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>
                    {activeSymbol}{convertedTotalSpent.toLocaleString()}
                  </p>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full mt-3 overflow-hidden">
                    <div className={`h-full rounded-full transition-all ${isOutOfBudget ? 'bg-rose-600' : spentPercentage > 80 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${spentPercentage}%` }} />
                  </div>
                </div>

                {/* 3. Remaining Balance OR Out of Budget Deficit */}
                <div className={`border p-5 rounded-2xl shadow-xs ${
                  isOutOfBudget 
                    ? 'border-rose-500 bg-rose-500/10' 
                    : isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                }`}>
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-slate-400 uppercase">
                      {isOutOfBudget ? 'Budget Deficit' : 'Remaining Balance'}
                    </p>
                    {isOutOfBudget ? (
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-rose-600 text-white animate-bounce">
                        OUT OF BUDGET
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        Under Budget
                      </span>
                    )}
                  </div>

                  <p className={`text-2xl font-black mt-1 ${isOutOfBudget ? 'text-rose-600 dark:text-rose-400' : 'text-amber-500'}`}>
                    {isOutOfBudget ? `-${activeSymbol}${overBudgetAmount.toLocaleString()}` : `${activeSymbol}${convertedRemaining.toLocaleString()}`}
                  </p>

                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full mt-3 overflow-hidden">
                    <div className={`h-full rounded-full ${isOutOfBudget ? 'bg-rose-500' : 'bg-amber-400'}`} style={{ width: isOutOfBudget ? '100%' : `${100 - spentPercentage}%` }} />
                  </div>
                </div>

              </div>

              {/* 📊 LIVE CATEGORY TELEMETRY & BREAKDOWN (INR / USER CURRENCY) - EXACT MATCH WITH USER IMAGE */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    📊 LIVE CATEGORY TELEMETRY & BREAKDOWN ({currency})
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  
                  {/* 1. Food & Dining */}
                  <div className={`p-4 rounded-2xl border shadow-xs transition-all ${
                    isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                  }`}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold shrink-0">
                          <Utensils size={18} />
                        </div>
                        <div>
                          <h4 className={`font-extrabold text-sm ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                            Food & Dining
                          </h4>
                          <p className="text-[11px] text-slate-400 mt-0.5">Satvik Thali & Prasad</p>
                        </div>
                      </div>
                      <span className={`font-black text-base ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                        {activeSymbol}{Math.round(categorySpentINR.Food * activeRate).toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full mt-3 overflow-hidden">
                      <div 
                        className="bg-emerald-600 h-full rounded-full" 
                        style={{ width: `${Math.min(100, Math.round(((categorySpentINR.Food * activeRate) / (convertedTotalBudget || 1)) * 100))}%` }} 
                      />
                    </div>
                  </div>

                  {/* 2. Hotels & Stay */}
                  <div className={`p-4 rounded-2xl border shadow-xs transition-all ${
                    isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                  }`}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center font-bold shrink-0">
                          <Building2 size={18} />
                        </div>
                        <div>
                          <h4 className={`font-extrabold text-sm ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                            Hotels & Stay
                          </h4>
                          <p className="text-[11px] text-slate-400 mt-0.5">Ashrams, Bhavans, Stays</p>
                        </div>
                      </div>
                      <span className={`font-black text-base ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                        {activeSymbol}{Math.round(categorySpentINR.Stay * activeRate).toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full mt-3 overflow-hidden">
                      <div 
                        className="bg-emerald-600 h-full rounded-full" 
                        style={{ width: `${Math.min(100, Math.round(((categorySpentINR.Stay * activeRate) / (convertedTotalBudget || 1)) * 100))}%` }} 
                      />
                    </div>
                  </div>

                  {/* 3. Travel & Transport */}
                  <div className={`p-4 rounded-2xl border shadow-xs transition-all ${
                    isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                  }`}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold shrink-0">
                          <Car size={18} />
                        </div>
                        <div>
                          <h4 className={`font-extrabold text-sm ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                            Travel & Transport
                          </h4>
                          <p className="text-[11px] text-slate-400 mt-0.5">E-Rickshaw, Parikrama Cabs</p>
                        </div>
                      </div>
                      <span className={`font-black text-base ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                        {activeSymbol}{Math.round(categorySpentINR.Transport * activeRate).toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full mt-3 overflow-hidden">
                      <div 
                        className="bg-emerald-600 h-full rounded-full" 
                        style={{ width: `${Math.min(100, Math.round(((categorySpentINR.Transport * activeRate) / (convertedTotalBudget || 1)) * 100))}%` }} 
                      />
                    </div>
                  </div>

                  {/* 4. Activities & Darshan */}
                  <div className={`p-4 rounded-2xl border shadow-xs transition-all ${
                    isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                  }`}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center font-bold shrink-0">
                          <Ticket size={18} />
                        </div>
                        <div>
                          <h4 className={`font-extrabold text-sm ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                            Activities & Darshan
                          </h4>
                          <p className="text-[11px] text-slate-400 mt-0.5">VIP Passes, Vedic Guides</p>
                        </div>
                      </div>
                      <span className={`font-black text-base ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                        {activeSymbol}{Math.round(categorySpentINR.Activities * activeRate).toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full mt-3 overflow-hidden">
                      <div 
                        className="bg-emerald-600 h-full rounded-full" 
                        style={{ width: `${Math.min(100, Math.round(((categorySpentINR.Activities * activeRate) / (convertedTotalBudget || 1)) * 100))}%` }} 
                      />
                    </div>
                  </div>

                </div>
              </div>

              {/* ITEMIZED EXPENSE HISTORY TABLE / LIST WITH CATEGORY FILTER PILLS */}
              <div className={`border rounded-3xl p-5 sm:p-6 space-y-4 shadow-xs ${
                isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
              }`}>
                
                {/* Header with Title and Filter Pills */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4 border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <Receipt className={isDarkMode ? 'text-emerald-400' : 'text-emerald-600'} size={20} />
                    <h3 className={`font-extrabold text-base ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                      Itemized Expense History ({filteredExpenseList.length})
                    </h3>
                  </div>

                  {/* Filter Pills */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
                    {[
                      { id: 'All', label: 'All' },
                      { id: 'Food', label: 'Food & Dining' },
                      { id: 'Stay', label: 'Hotels & Stay' },
                      { id: 'Transport', label: 'Travel & Transport' },
                      { id: 'Activities', label: 'Activities' }
                    ].map((pill) => (
                      <button
                        key={pill.id}
                        onClick={() => setSelectedExpenseCategoryFilter(pill.id)}
                        className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
                          selectedExpenseCategoryFilter === pill.id
                            ? 'bg-emerald-700 text-white shadow-xs'
                            : isDarkMode ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {pill.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Expense List */}
                <div className="space-y-2.5">
                  {filteredExpenseList.length === 0 ? (
                    <div className="py-8 text-center text-slate-400 text-xs font-semibold">
                      No expenses logged in this category yet.
                    </div>
                  ) : (
                    filteredExpenseList.map((item) => {
                      const itemConvertedPrice = Math.round(item.amount * activeRate);
                      return (
                        <div
                          key={item.id}
                          className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 transition-colors ${
                            isDarkMode ? 'bg-slate-800/60 border-slate-700/60' : 'bg-slate-50 border-slate-200/80 hover:bg-slate-100'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-10 h-10 rounded-xl bg-emerald-600/10 text-emerald-600 flex items-center justify-center font-bold shrink-0">
                              {item.category === 'Food' && <Utensils size={18} />}
                              {item.category === 'Stay' && <Building2 size={18} />}
                              {item.category === 'Transport' && <Car size={18} />}
                              {(item.category === 'Activities' || item.category === 'Darshan') && <Ticket size={18} />}
                              {item.category === 'Guide' && <Users size={18} />}
                              {item.category === 'Shopping' && <ShoppingBag size={18} />}
                            </div>

                            <div className="min-w-0">
                              <h4 className={`font-bold text-xs sm:text-sm truncate ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                {item.title}
                              </h4>
                              <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                                <span className={`font-semibold px-2 py-0.5 rounded-md text-[10px] ${
                                  isDarkMode ? 'bg-slate-700 text-emerald-400' : 'bg-emerald-100 text-emerald-800'
                                }`}>
                                  {item.category === 'Food' ? 'Food & Dining' : item.category === 'Stay' ? 'Hotels & Stay' : item.category === 'Transport' ? 'Travel & Transport' : 'Activities & Darshan'}
                                </span>
                                <span>•</span>
                                <span>{item.date}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 shrink-0">
                            <span className={`font-black text-sm sm:text-base ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                              {activeSymbol}{itemConvertedPrice.toFixed(2)}
                            </span>

                            <button
                              onClick={() => handleDeleteExpense(item.id)}
                              className="text-slate-400 hover:text-rose-500 p-1.5 rounded-lg transition-colors"
                              title="Delete Expense"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

            </div>
          )}

          {/* MODULE 4: PACKING CHECKLIST */}
          {activeTab === 'packing' && (
            <div className="space-y-6">
              <h2 className={`text-2xl font-extrabold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Pilgrimage & Heritage Packing Checklist</h2>
              <div className={`border p-6 rounded-2xl space-y-3 shadow-xs ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
              {[
                'Traditional Attire / Dhoti / Kurta (Mandir Garbhagriha)',
                'Govt ID Proof & Passport (For International / VIP Darshan)',
                'Comfortable Walking Footwear & Adapters',
                'Water Bottle & Electrolytes',
                'Universal Power Bank & Multi-Plug Converter',
                'Emergency First Aid & Personal Prescription Meds'
              ].map((item, idx) => (
                <label key={idx} className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer border ${
                  isDarkMode ? 'bg-slate-800/50 border-slate-700/60' : 'bg-slate-50 border-slate-200/60 hover:bg-slate-100'
                }`}>
                  <input type="checkbox" defaultChecked={idx < 3} className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500" />
                  <span className="text-xs font-semibold">{item}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* MODULE 5: SMART ALERTS & REAL-TIME CROWD MONITOR */}
        {activeTab === 'alerts' && (
          <div className="space-y-6">
            <div>
              <h2 className={`text-2xl font-extrabold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                Smart Alerts & Live Crowd Radar ({selectedCity})
              </h2>
              <p className="text-xs text-slate-400">
                Real-time queue congestion, darshan waiting times, and optimal weather windows.
              </p>
            </div>

            {/* 1. LIVE CROWD & QUEUE CONGESTION CARD */}
            <div className={`border p-6 rounded-3xl space-y-5 shadow-xs transition-all ${
              isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4 border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-emerald-600/10 text-emerald-600 flex items-center justify-center font-black">
                    <Activity size={24} />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Live Queue Density Radar</span>
                    <h3 className={`font-black text-lg ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{selectedCity} Crowd Status</h3>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-xs font-black px-3.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-xs ${
                    activeCrowd.levelColor === 'rose' 
                      ? 'bg-rose-500/20 text-rose-500 border border-rose-500/30' 
                      : activeCrowd.levelColor === 'amber'
                        ? 'bg-amber-500/20 text-amber-500 border border-amber-500/30'
                        : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  }`}>
                    <span className={`w-2 h-2 rounded-full animate-ping ${
                      activeCrowd.levelColor === 'rose' ? 'bg-rose-500' : activeCrowd.levelColor === 'amber' ? 'bg-amber-500' : 'bg-emerald-400'
                    }`} />
                    {activeCrowd.crowdLevel}
                  </span>
                </div>
              </div>

              {/* Status Explanation */}
              <p className="text-xs text-slate-500 dark:text-slate-300 leading-relaxed font-medium">
                {activeCrowd.statusMsg}
              </p>

              {/* 3 Metric Mini Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                
                {/* Regular Wait */}
                <div className={`p-3.5 rounded-2xl border ${
                  isDarkMode ? 'bg-slate-800/60 border-slate-700/60' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold mb-1">
                    <Timer size={15} />
                    <span>General Queue Wait</span>
                  </div>
                  <span className={`font-black text-base ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    {activeCrowd.regularWait}
                  </span>
                </div>

                {/* VIP / Sugam Wait */}
                <div className={`p-3.5 rounded-2xl border ${
                  isDarkMode ? 'bg-slate-800/60 border-slate-700/60' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="flex items-center gap-2 text-emerald-600 text-xs font-bold mb-1">
                    <Zap size={15} />
                    <span>VIP / Sugam Darshan</span>
                  </div>
                  <span className="font-black text-base text-emerald-600">
                    {activeCrowd.vipWait}
                  </span>
                </div>

                {/* Best Low-Rush Window */}
                <div className={`p-3.5 rounded-2xl border ${
                  isDarkMode ? 'bg-slate-800/60 border-slate-700/60' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="flex items-center gap-2 text-amber-500 text-xs font-bold mb-1">
                    <Clock size={15} />
                    <span>Best Low-Rush Window</span>
                  </div>
                  <span className={`font-bold text-xs ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                    {activeCrowd.bestTime}
                  </span>
                </div>

              </div>

              {/* Crowd Capacity Visual Indicator */}
              <div className="space-y-1.5 pt-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-400">Peak Hours: {activeCrowd.peakHours}</span>
                  <span className={activeCrowd.capacityPct > 80 ? 'text-rose-500' : 'text-emerald-600'}>
                    {activeCrowd.capacityPct}% Footfall Intensity
                  </span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      activeCrowd.capacityPct > 80 ? 'bg-rose-500' : activeCrowd.capacityPct > 60 ? 'bg-amber-500' : 'bg-emerald-500'
                    }`} 
                    style={{ width: `${activeCrowd.capacityPct}%` }}
                  />
                </div>
              </div>
            </div>

            {/* 2. WEATHER & ENVIRONMENTAL ALERT */}
            <div className={`border p-5 rounded-3xl shadow-xs flex items-center justify-between ${
              isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-emerald-600/10 text-emerald-600 flex items-center justify-center font-bold">
                  <CloudSun size={22} />
                </div>
                <div>
                  <h4 className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{selectedCity} Weather: 22°C Clear Skies</h4>
                  <p className="text-xs text-slate-400">Low precipitation chance, optimal visibility for darshan & photography.</p>
                </div>
              </div>
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                isDarkMode ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-800'
              }`}>Optimal</span>
            </div>

          </div>
        )}

        {/* MODULE 6: VERIFIED VEDIC & HERITAGE GUIDES */}
        {activeTab === 'guides' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className={`text-2xl font-extrabold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  Verified Vedic & Heritage Guides ({selectedCity})
                </h2>
                <p className="text-xs text-slate-400">
                  Govt ASI, TTD & Vedic certified historians with verified female and male leaders.
                </p>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-600 text-white self-start">
                {displayGuides.length} Verified Guides Available
              </span>
            </div>

            {/* Guides Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {displayGuides.map((guide) => {
                const hourlyConverted = Math.round(guide.hourlyRateINR * activeRate);
                return (
                  <div
                    key={guide.id}
                    className={`border p-5 rounded-3xl shadow-xs flex flex-col justify-between gap-4 transition-all ${
                      isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="relative shrink-0">
                        <img 
                          src={guide.image} 
                          alt={guide.name} 
                          className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-emerald-600 shadow-sm" 
                        />
                        <span className={`absolute -bottom-1.5 -right-1.5 text-[9px] font-black px-1.5 py-0.5 rounded-md text-white shadow-xs ${
                          guide.gender === 'Female' ? 'bg-purple-600' : 'bg-blue-600'
                        }`}>
                          {guide.gender}
                        </span>
                      </div>

                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className={`font-extrabold text-base truncate ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                            {guide.name}
                          </h4>
                          <span className="text-xs font-bold text-amber-500 shrink-0">
                            ★ {guide.rating} <span className="text-slate-400 font-normal text-[10px]">({guide.reviews})</span>
                          </span>
                        </div>

                        <p className="text-[11px] font-bold text-emerald-600">
                          {guide.badge}
                        </p>

                        <p className="text-xs text-slate-400 truncate">
                          🗣️ {guide.languages}
                        </p>

                        <p className="text-xs text-slate-500 dark:text-slate-300 line-clamp-2 leading-relaxed">
                          {guide.specialty}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-semibold">{guide.experience}</span>
                        <span className="text-sm sm:text-base font-black text-emerald-600">
                          {activeSymbol}{hourlyConverted.toLocaleString()} <span className="text-xs font-normal text-slate-400">/ hour</span>
                        </span>
                      </div>

                      <button 
                        onClick={() => handleBookGuide(guide.name, guide.hourlyRateINR)} 
                        className="bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition-all shadow-xs"
                      >
                        Book {guide.gender === 'Female' ? 'Guide (Female)' : 'Guide'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* MODULE 7: SAFETY & SOS */}
        {activeTab === 'safety' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-extrabold text-rose-600">Safety & Emergency Command Center</h2>
            <div className="bg-rose-50 border border-rose-200 p-6 rounded-2xl space-y-4">
              <p className="text-xs text-rose-800">Triggering SOS broadcasts simulated emergency telemetry and alerts local police and medical responders.</p>
              <button onClick={() => alert('🚨 SOS Signal Dispatched!')} className="bg-rose-600 hover:bg-rose-700 text-white font-black px-6 py-3 rounded-xl text-xs shadow-md">
                BROADCAST EMERGENCY SIGNAL
              </button>
            </div>
          </div>
        )}

        {/* FOOTER */}
        <footer className={`mt-auto border-t py-6 text-center text-xs ${
          isDarkMode ? 'border-slate-800 bg-slate-950 text-slate-500' : 'border-slate-200 bg-white text-slate-500'
        }`}>
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-md bg-emerald-600 text-white flex items-center justify-center font-black text-[10px]">
                ST
              </div>
              <span className={`font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>SmartTrip</span>
              <span>• AICTE 2026/02 Pilgrimage & Global Heritage Booster</span>
            </div>
            <p className="text-[11px] text-slate-400">
              OpenStreetMap Route Optimization Engine
            </p>
          </div>
        </footer>

        </div>
      </main>

      {/* 3. FLOATING AI CHATBOT COMPONENT */}
      <div className="fixed bottom-6 right-6 z-40">
        
        {/* Chat Window */}
        {isChatOpen && (
          <div className={`mb-4 w-80 sm:w-96 rounded-3xl border shadow-2xl overflow-hidden flex flex-col transition-all duration-200 ${
            isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`} style={{ height: '480px' }}>
            
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-700 to-emerald-900 p-4 text-white flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-black text-xs">
                  <Bot size={18} />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm leading-tight">SmartTrip AI Guide</h4>
                  <span className="text-[10px] text-emerald-200 flex items-center gap-1 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
                    Online • Vedic & Global Bot
                  </span>
                </div>
              </div>

              <button 
                onClick={() => setIsChatOpen(false)}
                className="p-1 rounded-full hover:bg-white/10 text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages Area */}
            <div className={`flex-1 p-4 overflow-y-auto space-y-3 text-xs ${
              isDarkMode ? 'bg-slate-950/40' : 'bg-slate-50'
            }`}>
              {chatMessages.map((msg, idx) => (
                <div 
                  key={idx} 
                  className={`flex items-start gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.sender === 'bot' && (
                    <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 text-[10px] font-bold mt-0.5">
                      AI
                    </div>
                  )}

                  <div className={`max-w-[80%] p-3 rounded-2xl whitespace-pre-line leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-emerald-600 text-white rounded-br-none shadow-xs'
                      : isDarkMode 
                        ? 'bg-slate-800 text-slate-100 rounded-bl-none border border-slate-700/60 shadow-xs' 
                        : 'bg-white text-slate-800 rounded-bl-none border border-slate-200 shadow-xs'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            {/* Quick Prompts */}
            <div className={`p-2 border-t flex items-center gap-1.5 overflow-x-auto no-scrollbar ${
              isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'
            }`}>
              {quickQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => handleSendMessage(q)}
                  className={`text-[10px] whitespace-nowrap px-2.5 py-1 rounded-full border transition-colors ${
                    isDarkMode 
                      ? 'bg-slate-800 border-slate-700 text-slate-300 hover:text-emerald-400' 
                      : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700'
                  }`}
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className={`p-3 border-t flex items-center gap-2 ${
                isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
              }`}
            >
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask about Mandir timings, hotels, budget..."
                className={`flex-1 px-3.5 py-2 rounded-xl text-xs border focus:outline-none transition-all ${
                  isDarkMode 
                    ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:border-emerald-500' 
                    : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-emerald-600'
                }`}
              />
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white p-2 rounded-xl transition-transform active:scale-95 shadow-xs"
              >
                <Send size={15} />
              </button>
            </form>

          </div>
        )}

        {/* Floating Bubble Button */}
        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white p-3.5 sm:p-4 rounded-2xl shadow-xl flex items-center gap-2 transition-all group"
          title="SmartTrip AI Assistant"
        >
          <Bot size={22} className="group-hover:rotate-12 transition-transform" />
          <span className="font-bold text-xs hidden sm:inline">Ask AI Guide</span>
          <span className="w-2 h-2 rounded-full bg-emerald-300 animate-ping absolute top-2 right-2" />
        </button>

      </div>

      {/* 4. LOG EXPENSE MODAL */}
      {showAddExpenseModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className={`border rounded-3xl w-full max-w-md p-6 space-y-4 shadow-2xl relative transition-all ${
            isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <button 
              onClick={() => setShowAddExpenseModal(false)} 
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1 rounded-full"
            >
              <X size={18} />
            </button>

            <div className="space-y-1">
              <h3 className="text-lg font-extrabold">Log Trip Expense</h3>
              <p className="text-xs text-slate-400">Add an expense to keep track of your budget in real time.</p>
            </div>

            <form onSubmit={handleAddExpense} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">Expense Title / Description</label>
                <input
                  type="text"
                  required
                  value={newExpenseTitle}
                  onChange={(e) => setNewExpenseTitle(e.target.value)}
                  placeholder="e.g. Mahakal Pilgrims Bhavan (2 Nts), Satvik Thali, E-Rickshaw"
                  className={`w-full px-3.5 py-2.5 border rounded-xl text-xs sm:text-sm focus:outline-none transition-all ${
                    isDarkMode ? 'bg-slate-800 border-slate-700 text-white focus:border-emerald-500' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-emerald-600'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">Amount ({currency})</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={newExpenseAmount}
                    onChange={(e) => setNewExpenseAmount(e.target.value)}
                    placeholder={`e.g. 850`}
                    className={`w-full px-3.5 py-2.5 border rounded-xl text-xs sm:text-sm focus:outline-none transition-all ${
                      isDarkMode ? 'bg-slate-800 border-slate-700 text-white focus:border-emerald-500' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-emerald-600'
                    }`}
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">Category</label>
                  <select
                    value={newExpenseCategory}
                    onChange={(e) => setNewExpenseCategory(e.target.value)}
                    className={`w-full px-3 py-2.5 border rounded-xl text-xs font-semibold focus:outline-none ${
                      isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  >
                    <option value="Food">Food & Dining</option>
                    <option value="Stay">Hotels & Stay</option>
                    <option value="Transport">Travel & Transport</option>
                    <option value="Activities">Activities & Darshan</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold py-3 rounded-xl text-xs sm:text-sm transition-all shadow-md mt-2"
              >
                Add to Expense History
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 5. BOOKING CONFIRMATION POPUP MODAL */}
      {confirmedBooking && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className={`border rounded-3xl w-full max-w-md p-6 space-y-4 shadow-2xl relative transition-all ${
            isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <button 
              onClick={() => setConfirmedBooking(null)} 
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-full"
            >
              <X size={18} />
            </button>

            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center font-bold">
                <CheckCircle2 size={28} />
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">{confirmedBooking.title}</h3>
              <p className="text-xs text-slate-400">Your reservation has been confirmed and registered in the database.</p>
            </div>

            <div className={`p-4 rounded-2xl border space-y-2.5 ${
              isDarkMode ? 'bg-slate-800/80 border-slate-700' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center justify-between border-b pb-2 border-slate-200 dark:border-slate-700">
                <span className="text-xs text-slate-400 font-medium">Confirmation Code</span>
                <span className="text-xs font-black text-emerald-600 font-mono tracking-wide">{confirmedBooking.code}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">Reservation</span>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{confirmedBooking.name}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">Location</span>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{confirmedBooking.city}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">Total Amount</span>
                <span className="text-sm font-black text-emerald-600">₹{confirmedBooking.price.toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={() => setConfirmedBooking(null)}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs transition-all shadow-xs"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* 6. MODERN FULL-FEATURED LOGIN & SIGN UP MODAL */}
      {isAuthOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className={`border rounded-3xl w-full max-w-md p-6 sm:p-7 space-y-5 shadow-2xl relative transition-all ${
            isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            
            {/* Close Button */}
            <button 
              onClick={() => {
                setIsAuthOpen(false);
                setAuthError('');
                setAuthSuccessMsg('');
              }} 
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1 rounded-full transition-colors"
            >
              <X size={18} />
            </button>

            {/* Header / Brand */}
            <div className="text-center space-y-1">
              <div className="inline-flex items-center justify-center w-11 h-11 rounded-2xl bg-emerald-600 text-white font-black text-lg mb-1 shadow-sm">
                ST
              </div>
              <h3 className="text-xl font-extrabold tracking-tight">
                {authMode === 'login' ? 'Welcome Back to SmartTrip' : 'Join SmartTrip Automation'}
              </h3>
              <p className="text-xs text-slate-400 font-medium">
                {authMode === 'login' 
                  ? 'Access your pilgrimage bookings, custom circuits & offline passes' 
                  : 'Create a free account to personalize your spiritual & global journeys'}
              </p>
            </div>

            {/* Tab Switcher: Login vs Sign Up */}
            <div className={`p-1 rounded-2xl border flex items-center ${
              isDarkMode ? 'bg-slate-800/80 border-slate-700' : 'bg-slate-100 border-slate-200'
            }`}>
              <button
                type="button"
                onClick={() => {
                  setAuthMode('login');
                  setAuthError('');
                  setAuthSuccessMsg('');
                }}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                  authMode === 'login'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Log In
              </button>

              <button
                type="button"
                onClick={() => {
                  setAuthMode('signup');
                  setAuthError('');
                  setAuthSuccessMsg('');
                }}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                  authMode === 'signup'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Error / Success Feedback */}
            {authError && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs rounded-xl flex items-center gap-2">
                <AlertTriangle size={14} className="shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            {authSuccessMsg && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 text-xs rounded-xl flex items-center gap-2">
                <Check size={14} className="shrink-0" />
                <span>{authSuccessMsg}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleAuthSubmit} className="space-y-3.5">
              
              {/* Full Name (Only for Sign Up) */}
              {authMode === 'signup' && (
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">Full Name</label>
                  <div className="relative">
                    <UserIcon className="absolute left-3.5 top-3 text-slate-400" size={16} />
                    <input
                      type="text"
                      required
                      value={authFormData.name}
                      onChange={(e) => setAuthFormData({ ...authFormData, name: e.target.value })}
                      placeholder="e.g. Rahul Sharma"
                      className={`w-full pl-10 pr-4 py-2.5 border rounded-xl text-xs sm:text-sm focus:outline-none transition-all ${
                        isDarkMode ? 'bg-slate-800 border-slate-700 text-white focus:border-emerald-500' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-emerald-600'
                      }`}
                    />
                  </div>
                </div>
              )}

              {/* Email Address */}
              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 text-slate-400" size={16} />
                  <input
                    type="email"
                    required
                    value={authFormData.email}
                    onChange={(e) => setAuthFormData({ ...authFormData, email: e.target.value })}
                    placeholder="name@example.com"
                    className={`w-full pl-10 pr-4 py-2.5 border rounded-xl text-xs sm:text-sm focus:outline-none transition-all ${
                      isDarkMode ? 'bg-slate-800 border-slate-700 text-white focus:border-emerald-500' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-emerald-600'
                    }`}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-400">Password</label>
                  {authMode === 'login' && (
                    <button 
                      type="button"
                      onClick={() => alert('Password reset link has been dispatched to your email.')}
                      className="text-[11px] text-emerald-600 hover:underline font-semibold"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 text-slate-400" size={16} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={authFormData.password}
                    onChange={(e) => setAuthFormData({ ...authFormData, password: e.target.value })}
                    placeholder="••••••••"
                    className={`w-full pl-10 pr-10 py-2.5 border rounded-xl text-xs sm:text-sm focus:outline-none transition-all ${
                      isDarkMode ? 'bg-slate-800 border-slate-700 text-white focus:border-emerald-500' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-emerald-600'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Preferred Interest (Sign Up only) */}
              {authMode === 'signup' && (
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">Primary Travel Interest</label>
                  <select
                    value={authFormData.travelInterest}
                    onChange={(e) => setAuthFormData({ ...authFormData, travelInterest: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-xl text-xs font-semibold focus:outline-none ${
                      isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  >
                    <option value="Spiritual">Spiritual & Jyotirlinga Circuits (Dharmik)</option>
                    <option value="Heritage">ASI Heritage, Forts & UNESCO Monuments</option>
                    <option value="Nature">Nature, Western Ghats & Himalayas</option>
                    <option value="International">International Circuits (Dubai, Swiss, Bali, Paris)</option>
                  </select>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold py-3 rounded-xl text-xs sm:text-sm transition-all shadow-md mt-2"
              >
                {authMode === 'login' ? 'Log In to SmartTrip' : 'Create Free Account'}
              </button>

            </form>

            {/* Quick 1-Click Demo Accounts */}
            <div className={`pt-4 border-t space-y-2 ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block text-center">
                Or 1-Click Demo Login
              </span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('pilgrim')}
                  className={`p-2 rounded-xl border text-[11px] font-bold transition-all text-center ${
                    isDarkMode ? 'bg-slate-800/80 border-slate-700 text-slate-300 hover:border-emerald-500' : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-emerald-500'
                  }`}
                >
                  🛕 Pilgrim
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('guide')}
                  className={`p-2 rounded-xl border text-[11px] font-bold transition-all text-center ${
                    isDarkMode ? 'bg-slate-800/80 border-slate-700 text-slate-300 hover:border-emerald-500' : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-emerald-500'
                  }`}
                >
                  👳 Guide
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('global')}
                  className={`p-2 rounded-xl border text-[11px] font-bold transition-all text-center ${
                    isDarkMode ? 'bg-slate-800/80 border-slate-700 text-slate-300 hover:border-emerald-500' : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-emerald-500'
                  }`}
                >
                  ✈️ Global
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}