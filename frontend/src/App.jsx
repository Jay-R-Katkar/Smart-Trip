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
  CornerDownLeft
} from 'lucide-react';

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
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
  const [sidebarOpenMobile, setSidebarOpenMobile] = useState(false);

  // Chatbot State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {
      sender: 'bot',
      text: 'Namaste! 🙏 I am your SmartTrip AI Guide. Ask me anything about pilgrimage timings, VIP Darshan, satvik ashrams, heritage forts, international circuits, or custom budget plans!'
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const chatEndRef = useRef(null);

  const quickQuestions = [
    'Bhasma Aarti timings in Ujjain?',
    '2-Day Varanasi budget plan',
    'Dress code for Ram Mandir Ayodhya',
    'Best spots in Bali & Dubai'
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
        botReply = '🔱 **Mahakaleshwar Ujjain Darshan Info:**\n• Bhasma Aarti: 04:00 AM - 06:00 AM (Requires prior online/counter booking).\n• Regular Darshan: 06:00 AM - 11:00 PM.\n• Dress Code for Garbhagriha: Traditional Saree for women, Dhoti-Kurta (unstitched dhoti) for men.\n• Recommendation: Stay at *Shri Mahakal Bhakt Ashram* (200m from temple).';
      } else if (q.includes('ayodhya') || q.includes('ram mandir')) {
        botReply = '🛕 **Shri Ram Janmabhoomi Ayodhya:**\n• Darshan Timings: 07:00 AM to 11:30 AM & 02:00 PM to 07:00 PM.\n• Aarti: Shringar Aarti (06:30 AM), Sandhya Aarti (07:30 PM).\n• Mobiles, leather belts & electronic items are stored at free lockers outside.\n• Must-visit: Hanuman Garhi & Saryu River Maha Aarti.';
      } else if (q.includes('varanasi') || q.includes('kashi') || q.includes('ganga')) {
        botReply = '🌊 **Kashi Vishwanath & Ganga Ghats:**\n• Dashashwamedh Ghat Ganga Aarti starts daily at 06:45 PM.\n• Kashi Vishwanath Corridor is open 24/7 with special Sugam Darshan tickets.\n• Recommended Budget: ₹3,500 - ₹5,000/day for boat rides, satvik food, and heritage guide.';
      } else if (q.includes('puri') || q.includes('jagannath')) {
        botReply = '🚩 **Puri Jagannath Dham:**\n• Morning Dwarka Darshan begins at 06:00 AM.\n• Mahaprasad (Anand Bazaar) is available daily from 12:30 PM onwards.\n• Also visit Konark Sun Temple (35 km scenic marine drive).';
      } else if (q.includes('bali') || q.includes('dubai') || q.includes('paris') || q.includes('international')) {
        botReply = '✈️ **International Circuit Travel Tips:**\n• Bali: Visit Tanah Lot & Uluwatu Temple, visa on arrival available for Indian passport holders.\n• Dubai: Burj Khalifa observation deck & Desert Safari.\n• Paris: Eiffel Tower & Louvre Museum (book tickets 2 weeks in advance).';
      } else if (q.includes('budget') || q.includes('cost') || q.includes('price')) {
        botReply = `💰 **Estimated Circuit Budget for ${selectedCity}:**\n• Average 2-Day trip: ₹${budget.toLocaleString()} (Includes stay, meals, local transport & entry tokens).\n• Daily estimate: ₹${(budget/days).toFixed(0)} per day for ${days} days.`;
      } else {
        botReply = `✨ **SmartTrip AI Assistant:** For ${selectedCity}, I have mapped an optimized itinerary with ${activeDestination.activities.length} waypoints, verified stays, and guides! Click on the *Itinerary Planner* or *Ashrams* tab on the left menu to view full details.`;
      }

      setChatMessages(prev => [...prev, { sender: 'bot', text: botReply }]);
    }, 600);
  };

  // Comprehensive Dataset across Spiritual, Heritage, Nature, and International Circuits
  const destinationsData = [
    // --- 1. SPIRITUAL & DHARMIK ---
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
      id: 'tirupati',
      name: 'Tirupati',
      title: 'Sri Venkateswara Swamy Temple',
      category: 'Spiritual',
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
      id: 'paris',
      name: 'Paris',
      title: 'City of Light & Art',
      category: 'International',
      image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600',
      tag: 'Eiffel Tower & Louvre',
      coords: [48.8566, 2.3522],
      activities: [
        { name: 'Eiffel Tower Summit View', period: 'Morning (09:00 - 12:00)', time_slot: 'Morning', category: 'Global Landmark', cost: 2500, latitude: 48.8584, longitude: 2.2945, image_url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600' },
        { name: 'Louvre Museum Mona Lisa Tour', period: 'Afternoon (13:30 - 17:00)', time_slot: 'Afternoon', category: 'World Art Museum', cost: 1800, latitude: 48.8606, longitude: 2.3376, image_url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600' },
        { name: 'Seine River Sunset Cruise', period: 'Evening (18:30 - 20:30)', time_slot: 'Evening', category: 'River Romance', cost: 1500, latitude: 48.8570, longitude: 2.3510, image_url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600' }
      ]
    },
    {
      id: 'dubai',
      name: 'Dubai',
      title: 'Futuristic Oasis & Desert',
      category: 'International',
      image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600',
      tag: 'Burj Khalifa & Desert Safari',
      coords: [25.2048, 55.2708],
      activities: [
        { name: 'Burj Khalifa 124th Floor Observation', period: 'Morning (09:30 - 12:30)', time_slot: 'Morning', category: 'Tallest Skyscraper', cost: 3500, latitude: 25.1972, longitude: 55.2744, image_url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600' },
        { name: 'Dubai Mall & Fountain Show', period: 'Afternoon (14:00 - 17:00)', time_slot: 'Afternoon', category: 'Mega Mall', cost: 0, latitude: 25.1985, longitude: 55.2796, image_url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600' },
        { name: 'Red Dune Desert Safari & BBQ Dinner', period: 'Evening (17:30 - 21:30)', time_slot: 'Evening', category: 'Desert Adventure', cost: 2800, latitude: 24.9500, longitude: 55.5000, image_url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600' }
      ]
    },
    {
      id: 'bali',
      name: 'Bali',
      title: 'Island of the Gods',
      category: 'International',
      image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600',
      tag: 'Uluwatu Temple & Beaches',
      coords: [-8.4095, 115.1889],
      activities: [
        { name: 'Ubud Sacred Monkey Forest & Rice Terraces', period: 'Morning (08:30 - 12:00)', time_slot: 'Morning', category: 'Tropical Nature', cost: 500, latitude: -8.5190, longitude: 115.2600, image_url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600' },
        { name: 'Tanah Lot Sea Temple', period: 'Afternoon (14:00 - 16:30)', time_slot: 'Afternoon', category: 'Ocean Sanctuary', cost: 350, latitude: -8.6212, longitude: 115.0868, image_url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600' },
        { name: 'Uluwatu Cliff Kecak Fire Dance', period: 'Evening (17:30 - 19:30)', time_slot: 'Evening', category: 'Cultural Dance', cost: 800, latitude: -8.8290, longitude: 115.0849, image_url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600' }
      ]
    },
    {
      id: 'tokyo',
      name: 'Tokyo',
      title: 'Tradition Meets Tomorrow',
      category: 'International',
      image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=600',
      tag: 'Sensō-ji Temple & Shibuya',
      coords: [35.6762, 139.6503],
      activities: [
        { name: 'Sensō-ji Ancient Asakusa Temple', period: 'Morning (08:30 - 11:30)', time_slot: 'Morning', category: 'Historic Buddhist', cost: 0, latitude: 35.7148, longitude: 139.7967, image_url: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=600' },
        { name: 'Meiji Jingu Shrine & Forest Walk', period: 'Afternoon (13:30 - 16:00)', time_slot: 'Afternoon', category: 'Shinto Shrine', cost: 0, latitude: 35.6764, longitude: 139.6993, image_url: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=600' },
        { name: 'Shibuya Scramble Crossing & Sky Deck', period: 'Evening (17:30 - 20:30)', time_slot: 'Evening', category: 'Neon Metropolis', cost: 1200, latitude: 35.6595, longitude: 139.7005, image_url: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=600' }
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
          <div className={`flex items-center justify-between p-2 rounded-xl border text-xs ${
            isDarkMode ? 'bg-slate-800/80 border-slate-700 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
          }`}>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-slate-300 text-slate-800 flex items-center justify-center font-bold text-[10px]">
                {user ? user.name[0].toUpperCase() : 'G'}
              </div>
              <span className="font-medium text-[11px] truncate max-w-[85px]">
                {user ? user.name : 'Guest User'}
              </span>
            </div>
            <button
              onClick={() => user ? setUser(null) : setIsAuthOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-2 py-1 rounded-lg text-[10px] transition-colors"
            >
              {user ? 'Logout' : 'Sign In'}
            </button>
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
          
          {/* MODULE 1: ITINERARY PLANNER (EXACT MATCHING SCREENSHOT) */}
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
                  placeholder="SEARCH ANY PILGRIMAGE, HERITAGE OR SCENIC DESTINATION... (e.g. Ujjain, Ayodhya, Varanasi, Puri, Jaipur, Bali, Paris, Munnar...)"
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

              {/* INTERACTIVE TOURISM GRID (SHOWS ALL EXPANDED PLACES) */}
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
                        onClick={() => {
                          setSelectedCity(dest.name);
                          setScheduleGenerated(true);
                        }}
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

                          <div className="absolute top-2 left-2">
                            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-black/50 backdrop-blur-xs text-white border border-white/20">
                              {dest.category}
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

              {/* HORIZONTAL TRIP SETTINGS BAR (FROM SCREENSHOT) */}
              <div className={`border rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 transition-colors ${
                isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
              }`}>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full md:w-auto flex-1">
                  
                  {/* 1. Destination */}
                  <div className={`border-r pr-4 ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Selected Destination</span>
                    <span className={`font-black text-base ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{selectedCity}</span>
                  </div>

                  {/* 2. Currency */}
                  <div className={`border-r pr-4 ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Trip Currency</span>
                    <div className="flex items-center gap-1 mt-0.5">
                      <button
                        onClick={() => setCurrency('INR')}
                        className={`text-xs font-bold px-2 py-0.5 rounded ${currency === 'INR' ? (isDarkMode ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-800') : 'text-slate-500'}`}
                      >
                        INR (₹)
                      </button>
                      <button
                        onClick={() => setCurrency('USD')}
                        className={`text-xs font-bold px-2 py-0.5 rounded ${currency === 'USD' ? (isDarkMode ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-800') : 'text-slate-500'}`}
                      >
                        USD ($)
                      </button>
                    </div>
                  </div>

                  {/* 3. Duration */}
                  <div className={`border-r pr-4 ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Duration (Days)</span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <button onClick={() => setDays(Math.max(1, days - 1))} className={`w-5 h-5 rounded font-bold text-xs flex items-center justify-center ${isDarkMode ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-700'}`}>-</button>
                      <span className={`font-extrabold text-sm ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{days} Days</span>
                      <button onClick={() => setDays(Math.min(14, days + 1))} className={`w-5 h-5 rounded font-bold text-xs flex items-center justify-center ${isDarkMode ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-700'}`}>+</button>
                    </div>
                  </div>

                  {/* 4. Total Budget */}
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Budget ({currency})</span>
                    <span className={`font-black text-base ${isDarkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>
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
                    <div className={`border p-4 rounded-3xl shadow-sm space-y-3 ${
                      isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                    }`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <MapPin className={isDarkMode ? 'text-emerald-400' : 'text-emerald-600'} size={18} />
                          <h3 className={`font-extrabold text-base ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Live Route Map: {selectedCity}</h3>
                        </div>
                        <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                          isDarkMode ? 'bg-emerald-500/20 text-emerald-300' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {activeDestination.activities?.length || 3} Waypoints
                        </span>
                      </div>

                      <InteractiveMap 
                        destination={selectedCity}
                        centerCoords={activeDestination.coords}
                        activities={activeDestination.activities || []}
                        className="h-80 sm:h-96 w-full"
                      />

                      <p className="text-[11px] text-slate-400 text-center">
                        Interactive OpenStreetMap • Numbered stops connected in chronological sequence
                      </p>
                    </div>
                  </div>

                  {/* Day-by-Day Schedule Timeline */}
                  <div className="lg:col-span-6 space-y-3">
                    <div className={`border p-5 rounded-3xl shadow-sm space-y-4 ${
                      isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                    }`}>
                      
                      <div className={`flex items-center justify-between border-b pb-3 ${
                        isDarkMode ? 'border-slate-800' : 'border-slate-100'
                      }`}>
                        <div>
                          <h3 className={`font-extrabold text-lg ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{selectedCity} Circuit Plan</h3>
                          <p className="text-xs text-slate-400">{days} Days Optimized Itinerary</p>
                        </div>
                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                          isDarkMode ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {currency === 'INR' ? `₹${(budget/days).toFixed(0)}/day` : `$${(budget/85/days).toFixed(0)}/day`}
                        </span>
                      </div>

                      <div className="space-y-3">
                        {(activeDestination.activities || []).map((act, idx) => (
                          <div key={idx} className={`border p-3.5 rounded-2xl flex items-start gap-3 transition-colors ${
                            isDarkMode ? 'bg-slate-800/60 border-slate-700/60' : 'bg-slate-50 border-slate-200/80 hover:border-emerald-300'
                          }`}>
                            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                              {idx + 1}
                            </div>
                            <div className="flex-1">
                              <span className={`text-[10px] font-bold uppercase tracking-wider ${isDarkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>{act.period || act.time_slot}</span>
                              <h4 className={`font-bold text-sm mt-0.5 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{act.name}</h4>
                              <p className="text-xs text-slate-400 mt-0.5">{act.category} • Cost: {act.cost ? `₹${act.cost}` : 'Free Entry'}</p>
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

          {/* MODULE 2: ASHRAMS & STAYS (WITH REAL PHOTOS) */}
          {activeTab === 'hotels' && (
            <div className="space-y-6">
              <h2 className={`text-2xl font-extrabold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Ashrams, Dharamshalas & Stays</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div className={`border rounded-3xl overflow-hidden shadow-xs flex flex-col justify-between ${
                  isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                }`}>
                  <div className="h-44 w-full relative">
                    <img src="https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600" alt="Ashram" className="w-full h-full object-cover" />
                    <span className="absolute top-3 left-3 text-xs bg-emerald-600 text-white px-3 py-1 rounded-full font-bold">Recommended Ashram</span>
                  </div>
                  <div className="p-5 space-y-2">
                    <h4 className={`font-extrabold text-lg ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Shri Mahakal Bhakt Ashram</h4>
                    <p className="text-xs text-slate-400">AC Rooms, Pure Satvik Bhojan, 200m from Mandir</p>
                    <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                      <span className="text-base font-black text-emerald-700">₹1,150 / night</span>
                      <button onClick={() => alert('Booked successfully!')} className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-4 py-2 rounded-xl text-xs">Book Ashram</button>
                    </div>
                  </div>
                </div>

                <div className={`border rounded-3xl overflow-hidden shadow-xs flex flex-col justify-between ${
                  isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                }`}>
                  <div className="h-44 w-full relative">
                    <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600" alt="Heritage Hotel" className="w-full h-full object-cover" />
                    <span className="absolute top-3 left-3 text-xs bg-blue-600 text-white px-3 py-1 rounded-full font-bold">Heritage Stay</span>
                  </div>
                  <div className="p-5 space-y-2">
                    <h4 className={`font-extrabold text-lg ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>The Grand Heritage Palace</h4>
                    <p className="text-xs text-slate-400">Free WiFi, Traditional architecture, River view</p>
                    <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                      <span className="text-base font-black text-emerald-700">₹2,400 / night</span>
                      <button onClick={() => alert('Booked successfully!')} className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-4 py-2 rounded-xl text-xs">Book Room</button>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* MODULE 3: BUDGET TRACKER */}
          {activeTab === 'budget' && (
            <div className="space-y-6">
              <h2 className={`text-2xl font-extrabold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Multi-Currency Real-Time Budget Tracker</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className={`border p-5 rounded-2xl shadow-xs ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                  <p className="text-xs font-bold text-slate-400 uppercase">Total Budget</p>
                  <p className={`text-2xl font-black mt-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>₹{budget.toLocaleString()}</p>
                </div>
                <div className={`border p-5 rounded-2xl shadow-xs ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                  <p className="text-xs font-bold text-slate-400 uppercase">Spent</p>
                  <p className={`text-2xl font-black mt-1 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>₹{Math.round(budget * 0.45).toLocaleString()}</p>
                </div>
                <div className={`border p-5 rounded-2xl shadow-xs ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                  <p className="text-xs font-bold text-slate-400 uppercase">Remaining</p>
                  <p className="text-2xl font-black text-amber-500 mt-1">₹{Math.round(budget * 0.55).toLocaleString()}</p>
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
                'Govt ID Proof (Aadhaar / Voter ID for VIP Darshan)',
                'Comfortable Walking Sandals (Easy removal at premises)',
                'Water Bottle & Electrolytes',
                'Power Bank & Mobile Charger',
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

        {/* MODULE 5: SMART ALERTS */}
        {activeTab === 'alerts' && (
          <div className="space-y-6">
            <h2 className={`text-2xl font-extrabold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Smart Alerts & Darshan Queues</h2>
            <div className={`border p-5 rounded-2xl shadow-xs flex items-center justify-between ${
              isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <div className="flex items-center gap-3">
                <CloudSun className={isDarkMode ? 'text-emerald-400' : 'text-emerald-600'} size={24} />
                <div>
                  <h4 className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{selectedCity} Weather: 24°C Pleasant</h4>
                  <p className="text-xs text-slate-400">Zero rain probability. Ideal for evening parikrama.</p>
                </div>
              </div>
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                isDarkMode ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-800'
              }`}>Good Condition</span>
            </div>
          </div>
        )}

        {/* MODULE 6: GUIDES (WITH REAL PHOTOS) */}
        {activeTab === 'guides' && (
          <div className="space-y-6">
            <h2 className={`text-2xl font-extrabold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Verified Vedic & Heritage Guides</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <div className={`border p-5 rounded-3xl shadow-xs flex items-center justify-between ${
                isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
              }`}>
                <div className="flex items-center gap-3.5">
                  <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400" alt="Guide" className="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-600 shadow-xs" />
                  <div>
                    <h4 className={`font-bold text-base ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Pt. Shivam Shastri</h4>
                    <p className="text-xs text-slate-400">Sanskrit, Hindi, English • Rating: ★ 4.9</p>
                    <span className="text-[10px] text-emerald-600 font-bold">12+ Years Experience</span>
                  </div>
                </div>
                <button onClick={() => alert('Guide booked!')} className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-4 py-2 rounded-xl text-xs">Book (₹500/hr)</button>
              </div>

              <div className={`border p-5 rounded-3xl shadow-xs flex items-center justify-between ${
                isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
              }`}>
                <div className="flex items-center gap-3.5">
                  <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400" alt="Guide" className="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-600 shadow-xs" />
                  <div>
                    <h4 className={`font-bold text-base ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Acharya Radheshyam</h4>
                    <p className="text-xs text-slate-400">Hindi, English, Tamil • Rating: ★ 5.0</p>
                    <span className="text-[10px] text-emerald-600 font-bold">ASI Certified Historian</span>
                  </div>
                </div>
                <button onClick={() => alert('Guide booked!')} className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-4 py-2 rounded-xl text-xs">Book (₹600/hr)</button>
              </div>

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
              <span>• AICTE 2026/02 Pilgrimage & Heritage Tourism Booster</span>
            </div>
            <p className="text-[11px] text-slate-400">
              OpenStreetMap Route Optimization Engine
            </p>
          </div>
        </footer>

        </div>
      </main>

      {/* 3. FLOATING AI CHATBOT COMPONENT */}
      <div className="fixed bottom-6 right-6 z-50">
        
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
                    Online • Vedic & Darshan Bot
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

      {/* USER AUTH MODAL */}
      {isAuthOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className={`border rounded-3xl w-full max-w-md p-6 space-y-4 shadow-2xl relative ${
            isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <button onClick={() => setIsAuthOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
              <X size={18} />
            </button>
            <h3 className="text-xl font-extrabold">Sign In to SmartTrip</h3>
            <div>
              <label className="text-xs font-bold text-slate-400">Email Address</label>
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="name@example.com"
                className={`w-full mt-1 border rounded-xl px-4 py-2.5 text-sm focus:outline-none ${
                  isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
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

    </div>
  );
}