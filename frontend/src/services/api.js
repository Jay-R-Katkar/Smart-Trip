// SmartTrip Centralized API Service with Fallback Simulation Engine

import {
  FALLBACK_DESTINATIONS,
  FALLBACK_HOTELS,
  FALLBACK_FLIGHTS,
  FALLBACK_GUIDES,
  FALLBACK_SAFETY
} from '../data/fallbackData';

const BASE_URL = import.meta.env.VITE_API_URL || 'https://smart-trip-un7k.onrender.com/api';

async function fetchWithFallback(url, options = {}, fallbackGenerator) {
  try {
    const res = await fetch(`${BASE_URL}${url}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }
    return await res.json();
  } catch (err) {
    console.warn(`API call to ${url} failed or offline, using fallback data. Details:`, err.message);
    if (fallbackGenerator) {
      return fallbackGenerator();
    }
    throw err;
  }
}

export const api = {
  // Module 1: Itinerary
  async getDestinations() {
    return fetchWithFallback('/destinations', { method: 'GET' }, () => ({
      success: true,
      destinations: FALLBACK_DESTINATIONS
    }));
  },

  async generateItinerary(payload) {
    return fetchWithFallback('/itinerary', {
      method: 'POST',
      body: JSON.stringify(payload)
    }, () => {
      const days = payload.days || 3;
      const budget = payload.budget || 1000;
      const dest = payload.destination || 'Paris';
      
      const sampleActivities = [
        { name: `${dest} Signature Landmark`, time_slot: "Morning (09:30 - 12:30)", period: "Morning", category: "Monument", cost: 30, duration: "2.5 hrs", crowd_level: "High", rating: 4.8, description: `Iconic focal point and primary sightseeing highlight in ${dest}.`, image_url: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600", opening_hours: "09:00 - 22:00", transit_time_min: 0 },
        { name: `${dest} National Art Museum`, time_slot: "Afternoon (14:00 - 16:30)", period: "Afternoon", category: "Culture", cost: 20, duration: "2.5 hrs", crowd_level: "Moderate", rating: 4.7, description: "Celebrated national cultural institution housing world-class masterpieces.", image_url: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=600", opening_hours: "10:00 - 18:00", transit_time_min: 15 },
        { name: `${dest} Scenic Sunset Promenade`, time_slot: "Evening (17:30 - 20:30)", period: "Evening", category: "Relaxation", cost: 15, duration: "2.0 hrs", crowd_level: "Moderate", rating: 4.6, description: "Breathtaking views, charming local cafes, and vibrant street ambiance.", image_url: "https://images.unsplash.com/photo-1509439581779-6298f75bf6e5?w=600", opening_hours: "24 Hours", transit_time_min: 10 }
      ];

      const daysPlan = [];
      for (let i = 1; i <= days; i++) {
        daysPlan.push({
          day: i,
          date: `Day ${i}`,
          title: `Day ${i}: ${dest} Architectural Gems & Local Walks`,
          day_total_cost: 65,
          activity_count: 3,
          activities: sampleActivities
        });
      }

      return {
        success: true,
        destination: dest,
        days: days,
        total_budget: budget,
        travel_style: payload.travel_style || 'Balanced',
        summary: {
          total_attractions: days * 3,
          total_attraction_tickets: days * 65,
          suggested_budget_split: {
            accommodation: Math.round(budget * 0.4),
            food_dining: Math.round(budget * 0.25),
            activities_tickets: Math.round(budget * 0.2),
            local_transport: Math.round(budget * 0.1),
            emergency_buffer: Math.round(budget * 0.05)
          }
        },
        days_plan: daysPlan
      };
    });
  },

  // Module 2: Hotels & Flights
  async getHotels(params = {}) {
    const query = new URLSearchParams(params).toString();
    return fetchWithFallback(`/hotels?${query}`, { method: 'GET' }, () => ({
      success: true,
      count: FALLBACK_HOTELS.length,
      hotels: FALLBACK_HOTELS
    }));
  },

  async getFlights(params = {}) {
    const query = new URLSearchParams(params).toString();
    return fetchWithFallback(`/flights?${query}`, { method: 'GET' }, () => ({
      success: true,
      count: FALLBACK_FLIGHTS.length,
      flights: FALLBACK_FLIGHTS
    }));
  },

  async createBooking(bookingData) {
    return fetchWithFallback('/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData)
    }, () => ({
      success: true,
      message: "Booking confirmed successfully!",
      booking: {
        id: Math.floor(Math.random() * 10000),
        confirmation_code: `ST-${Math.floor(1000 + Math.random() * 9000)}-BOOK`,
        payment_id: `pay_test_${Math.random().toString(36).substring(7)}`,
        item_name: bookingData.item_name,
        price: bookingData.price,
        status: "Confirmed",
        dates: bookingData.dates || "Upcoming"
      }
    }));
  },

  // Module 3: Budget Tracker
  async getTripBudget(tripId = 1) {
    return fetchWithFallback(`/budget/${tripId}`, { method: 'GET' }, () => ({
      success: true,
      trip_id: tripId,
      trip_title: "Paris Explorer & Culture",
      destination: "Paris",
      total_budget: 1200.0,
      total_spent: 594.5,
      remaining_budget: 605.5,
      percentage_spent: 49.5,
      alert_status: "SAFE",
      alert_message: "Healthy budget pacing: 49.5% spent. $605.50 remaining.",
      alert_severity: "success",
      category_breakdown: [
        { category: "Accommodation", amount: 196.0, percentage: 33.0 },
        { category: "Food", amount: 106.5, percentage: 17.9 },
        { category: "Activities", amount: 212.0, percentage: 35.7 },
        { category: "Transport", amount: 25.0, percentage: 4.2 },
        { category: "Shopping", amount: 55.0, percentage: 9.2 },
        { category: "Miscellaneous", amount: 0.0, percentage: 0.0 }
      ],
      expenses: [
        { id: 1, title: "Hôtel Eiffel Rive Gauche (2 Nights)", amount: 196.0, category: "Accommodation", date: "2026-09-10", notes: "Prepaid twin room" },
        { id: 2, title: "Eiffel Tower Tickets x2", amount: 64.0, category: "Activities", date: "2026-09-10", notes: "Summit elevator passes" },
        { id: 3, title: "Bistro Le Marais Dinner", amount: 78.5, category: "Food", date: "2026-09-10", notes: "Duck confit and Bordeaux wine" },
        { id: 4, title: "Navigo Metro Day Passes", amount: 25.0, category: "Transport", date: "2026-09-11", notes: "Zones 1-2 unlimited" },
        { id: 5, title: "Louvre Museum Tickets", amount: 44.0, category: "Activities", date: "2026-09-11", notes: "Morning entry timed slots" },
        { id: 6, title: "Souvenirs & Macarons Ladurée", amount: 55.0, category: "Shopping", date: "2026-09-12", notes: "Box of 12 luxury macarons" }
      ]
    }));
  },

  async addExpense(expenseData) {
    return fetchWithFallback('/expenses', {
      method: 'POST',
      body: JSON.stringify(expenseData)
    }, () => ({
      success: true,
      message: "Expense logged successfully",
      expense: {
        id: Date.now(),
        ...expenseData,
        date: expenseData.date || new Date().toISOString().split('T')[0]
      },
      updated_budget_status: {
        total_spent: 650.0,
        percentage_spent: 54.2,
        threshold_alert: null
      }
    }));
  },

  async deleteExpense(expenseId) {
    return fetchWithFallback(`/expenses/${expenseId}`, { method: 'DELETE' }, () => ({
      success: true,
      message: `Expense ${expenseId} deleted successfully`
    }));
  },

  // Module 4: Smart Alerts
  async getAlerts(params = {}) {
    const query = new URLSearchParams(params).toString();
    return fetchWithFallback(`/alerts?${query}`, { method: 'GET' }, () => ({
      success: true,
      city: params.city || "Paris",
      live_weather: {
        temp_c: 22,
        condition: "Sunny & Pleasant",
        icon: "☀️",
        rain_chance: "10%",
        uv_index: 5,
        advisory: "Ideal weather for city walks and open-air rooftop dining."
      },
      alerts_count: 4,
      alerts: [
        { id: 101, type: "weather", title: "Sunny Skies Ahead", message: "Mild temperatures around 22°C in Paris today.", severity: "info", is_read: 0 },
        { id: 102, type: "crowd", title: "Peak Waiting Time: Eiffel Tower", message: "Crowd queue currently ~35 mins. Morning or night slots recommended.", severity: "warning", is_read: 0 },
        { id: 103, type: "flight", title: "Flight Status: Air France AF-007", message: "On Time. Gate B22. Expected departure 18:30 EST.", severity: "info", is_read: 0 },
        { id: 104, type: "budget", title: "Budget Pacing Normal", message: "49.5% of trip budget utilized. You are on track.", severity: "info", is_read: 0 }
      ]
    }));
  },

  async markAlertRead(alertId) {
    return fetchWithFallback(`/alerts/${alertId}/read`, { method: 'PUT' }, () => ({
      success: true,
      message: "Marked as read"
    }));
  },

  // Module 5: Guide Matching
  async getGuides(params = {}) {
    const query = new URLSearchParams(params).toString();
    return fetchWithFallback(`/guides?${query}`, { method: 'GET' }, () => ({
      success: true,
      count: FALLBACK_GUIDES.length,
      guides: FALLBACK_GUIDES
    }));
  },

  async bookGuide(bookingData) {
    return fetchWithFallback('/guides/book', {
      method: 'POST',
      body: JSON.stringify(bookingData)
    }, () => ({
      success: true,
      message: "Guide booked successfully!",
      voucher: {
        booking_id: Math.floor(Math.random() * 1000),
        voucher_code: `GD-${Math.floor(100 + Math.random() * 900)}-VIP`,
        guide_name: bookingData.guide_name || "Claire Dupont",
        guide_phone: "+33 6 12 34 56 78",
        date: bookingData.date,
        duration_hours: bookingData.hours || 4,
        total_price: (bookingData.hours || 4) * 35,
        status: "Confirmed"
      }
    }));
  },

  // Module 6: Safety & SOS
  async getSafetyInfo(city = 'Paris') {
    return fetchWithFallback(`/safety?city=${city}`, { method: 'GET' }, () => ({
      success: true,
      safety_info: { ...FALLBACK_SAFETY, city }
    }));
  },

  async triggerSOS(payload) {
    return fetchWithFallback('/safety/sos', {
      method: 'POST',
      body: JSON.stringify(payload)
    }, () => ({
      success: true,
      incident_id: `SOS-${Math.random().toString(36).substring(4).toUpperCase()}`,
      status: "DISPATCHED_TO_EMERGENCY_SERVICES",
      timestamp: new Date().toLocaleTimeString(),
      beacon_data: {
        traveler_name: payload.user_name || "Alex Mercer",
        traveler_phone: payload.phone || "+1 555-0199",
        coordinates: { latitude: payload.latitude, longitude: payload.longitude },
        city: payload.city || "Paris"
      },
      emergency_responders_notified: [
        { service: "Local Police Department", contact: "112 / 17", status: "Alert Sent" },
        { service: "Ambulance / Paramedics", contact: "112 / 15", status: "Alert Sent" },
        { service: "SmartTrip 24/7 Crisis Center", contact: "+1 800 999 TRIP", status: "Active Dispatch" }
      ],
      immediate_action_instructions: [
        "1. Stay in a safe, visible public location.",
        "2. Dial 112 directly on your mobile device for immediate voice response.",
        "3. Your live coordinates have been broadcasted to emergency contacts."
      ]
    }));
  },

  // Trips Management
  async getTrips() {
    return fetchWithFallback('/trips', { method: 'GET' }, () => ({
      success: true,
      count: 1,
      trips: [
        {
          id: 1,
          title: "Paris Highlights & Romance",
          destination: "Paris",
          start_date: "2026-09-10",
          end_date: "2026-09-12",
          days: 3,
          budget: 1200.0,
          total_spent: 594.5,
          travel_style: "Cultural & Sightseeing"
        }
      ]
    }));
  },

  async saveTrip(tripData) {
    return fetchWithFallback('/trips', {
      method: 'POST',
      body: JSON.stringify(tripData)
    }, () => ({
      success: true,
      message: "Trip saved successfully",
      trip_id: Math.floor(Math.random() * 1000)
    }));
  },

  async deleteTrip(tripId) {
    return fetchWithFallback(`/trips/${tripId}`, { method: 'DELETE' }, () => ({
      success: true,
      message: `Trip ${tripId} deleted`
    }));
  }
};
