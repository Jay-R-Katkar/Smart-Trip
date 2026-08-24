// SmartTrip Fallback Dataset & Client Simulation Helper

export const FALLBACK_DESTINATIONS = [
  {
    city: "Paris",
    country: "France",
    tagline: "The City of Light & Romantic Gastronomy",
    hero_image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800",
    currency: "EUR (€)",
    daily_budget_estimate: 150,
    attraction_count: 8,
    avg_cost: 16.5,
    avg_rating: 4.7
  },
  {
    city: "Tokyo",
    country: "Japan",
    tagline: "Neon Metropolises Meet Ancient Shrines",
    hero_image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800",
    currency: "JPY (¥)",
    daily_budget_estimate: 130,
    attraction_count: 6,
    avg_cost: 10.3,
    avg_rating: 4.7
  },
  {
    city: "New York",
    country: "United States",
    tagline: "The City That Never Sleeps",
    hero_image: "https://images.unsplash.com/photo-1534430480872-3498386e7856?w=800",
    currency: "USD ($)",
    daily_budget_estimate: 200,
    attraction_count: 6,
    avg_cost: 16.5,
    avg_rating: 4.7
  },
  {
    city: "Bali",
    country: "Indonesia",
    tagline: "Island of the Gods & Emerald Terraces",
    hero_image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800",
    currency: "IDR (Rp)",
    daily_budget_estimate: 60,
    attraction_count: 5,
    avg_cost: 5.2,
    avg_rating: 4.6
  },
  {
    city: "London",
    country: "United Kingdom",
    tagline: "Historic Royalty, World Museums & Modern Energy",
    hero_image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800",
    currency: "GBP (£)",
    daily_budget_estimate: 180,
    attraction_count: 4,
    avg_cost: 18.2,
    avg_rating: 4.7
  },
  {
    city: "Goa",
    country: "India",
    tagline: "Sun-Kissed Beaches, Portuguese Forts & Seafood Shacks",
    hero_image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800",
    currency: "INR (₹)",
    daily_budget_estimate: 50,
    attraction_count: 4,
    avg_cost: 4.2,
    avg_rating: 4.6
  },
  {
    city: "Rome",
    country: "Italy",
    tagline: "The Eternal City of Colosseum & Dolce Vita",
    hero_image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800",
    currency: "EUR (€)",
    daily_budget_estimate: 140,
    attraction_count: 4,
    avg_cost: 14.2,
    avg_rating: 4.8
  },
  {
    city: "Dubai",
    country: "United Arab Emirates",
    tagline: "Futuristic Skylines, Luxury Shopping & Desert Dunes",
    hero_image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800",
    currency: "AED (AED)",
    daily_budget_estimate: 220,
    attraction_count: 4,
    avg_cost: 35.0,
    avg_rating: 4.7
  }
];

export const FALLBACK_HOTELS = [
  {
    id: 1,
    name: "Le Grand Quartier Paris",
    city: "Paris",
    price: 145.0,
    rating: 4.6,
    stars: 4,
    amenities: "Free WiFi, Rooftop Bar, Breakfast, Gym, AC",
    amenities_list: ["Free WiFi", "Rooftop Bar", "Breakfast", "Gym", "AC"],
    image_url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600",
    comparison_prices: { "Booking.com": 145, "Agoda": 139, "Expedia": 152, "Direct": 142 },
    best_deal: { platform: "Agoda", price: 139, savings: 13 }
  },
  {
    id: 2,
    name: "Hôtel Eiffel Rive Gauche",
    city: "Paris",
    price: 98.0,
    rating: 4.2,
    stars: 3,
    amenities: "Free WiFi, Eiffel Views, Breakfast, AC",
    amenities_list: ["Free WiFi", "Eiffel Views", "Breakfast", "AC"],
    image_url: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600",
    comparison_prices: { "Booking.com": 98, "Agoda": 95, "Expedia": 104, "Direct": 96 },
    best_deal: { platform: "Agoda", price: 95, savings: 9 }
  },
  {
    id: 3,
    name: "Four Seasons Hotel George V",
    city: "Paris",
    price: 520.0,
    rating: 4.9,
    stars: 5,
    amenities: "Michelin Dining, Luxury Spa, Pool, Butler Service",
    amenities_list: ["Michelin Dining", "Luxury Spa", "Pool", "Butler Service"],
    image_url: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600",
    comparison_prices: { "Booking.com": 520, "Agoda": 510, "Expedia": 540, "Direct": 495 },
    best_deal: { platform: "Direct", price: 495, savings: 45 }
  }
];

export const FALLBACK_FLIGHTS = [
  {
    id: 1,
    origin: "New York (JFK)",
    destination: "Paris (CDG)",
    airline: "Air France",
    flight_number: "AF-007",
    departure_time: "18:30",
    arrival_time: "07:45 (+1)",
    duration: "7h 15m",
    price: 540.0,
    stops: 0
  },
  {
    id: 2,
    origin: "New York (JFK)",
    destination: "Paris (CDG)",
    airline: "Delta Air Lines",
    flight_number: "DL-264",
    departure_time: "21:00",
    arrival_time: "10:30 (+1)",
    duration: "7h 30m",
    price: 510.0,
    stops: 0
  },
  {
    id: 3,
    origin: "London (LHR)",
    destination: "Paris (CDG)",
    airline: "British Airways",
    flight_number: "BA-308",
    departure_time: "08:15",
    arrival_time: "10:35",
    duration: "1h 20m",
    price: 89.0,
    stops: 0
  }
];

export const FALLBACK_GUIDES = [
  {
    id: 1,
    name: "Claire Dupont",
    city: "Paris",
    rating: 4.9,
    languages: "English, French, Spanish",
    languages_list: ["English", "French", "Spanish"],
    expertise: "Art & Architecture History, Hidden Parisian Cafes",
    expertise_list: ["Art & Architecture History", "Hidden Parisian Cafes"],
    price_per_hour: 35.0,
    price_per_day: 220.0,
    availability: "Available Today",
    verified: 1,
    phone: "+33 6 12 34 56 78",
    avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300",
    bio: "Certified national tour guide and art historian with 8 years leading Louvre and secret alleyway walks."
  },
  {
    id: 2,
    name: "Jean-Luc Laurent",
    city: "Paris",
    rating: 4.8,
    languages: "English, French, German",
    languages_list: ["English", "French", "German"],
    expertise: "Gastronomy, Wine Tasting, Photography",
    expertise_list: ["Gastronomy", "Wine Tasting", "Photography"],
    price_per_hour: 40.0,
    price_per_day: 250.0,
    availability: "Available Tomorrow",
    verified: 1,
    phone: "+33 6 98 76 54 32",
    avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300",
    bio: "Former sommelier and street photographer showing you the soul of Montmartre and the best local bakeries."
  }
];

export const FALLBACK_SAFETY = {
  city: "Paris",
  safety_score: 88,
  police_number: "112 / 17",
  ambulance_number: "112 / 15",
  tourist_helpline: "+33 1 43 17 53 53",
  safe_areas: "Marais, Saint-Germain-des-Prés, 7th Arrondissement, Latin Quarter",
  safe_areas_list: ["Marais", "Saint-Germain-des-Prés", "7th Arrondissement", "Latin Quarter"],
  caution_areas: "Watch for pickpockets around Eiffel Tower, Gare du Nord late night, Sacré-Cœur stairs",
  caution_areas_list: ["Eiffel Tower Base", "Gare du Nord (Late night)", "Sacré-Cœur Funicular stairs"],
  nearest_hospitals: "Hôpital Hôtel-Dieu (+33 1 42 34 82 34), Hôpital Necker",
  nearest_hospitals_list: ["Hôpital Hôtel-Dieu (1 Parvis Notre-Dame)", "Hôpital Necker Enfants Malades"],
  emergency_tips: "Keep wallets in front pockets; validate metro tickets; emergency SMS is available via 114.",
  rating_label: "Very Safe (Normal Travel Precautions)",
  rating_color: "blue"
};
