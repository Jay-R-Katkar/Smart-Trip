from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import math
import json
import random
import uuid
import os
import sys

# Ensure backend directory is in path
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))
from database import get_db_connection, init_db
from seeds import seed_database

app = FastAPI(
    title="SmartTrip API",
    description="Travel Automation Platform REST API",
    version="1.0.0"
)

# Enable CORS for frontend deployments (Render, Vercel, Netlify, localhost)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup_event():
    init_db()
    seed_database()

# --- Health Check Endpoints ---
@app.get("/")
def read_root():
    return {
        "status": "online",
        "service": "SmartTrip Automation Platform API",
        "docs": "/docs",
        "health": "/health"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}

# --- Data Models ---
class ItineraryRequest(BaseModel):
    destination: str
    days: int = 3
    budget: float = 1000.0
    travel_style: Optional[str] = "Balanced"
    start_date: Optional[str] = None

class ExpenseRequest(BaseModel):
    trip_id: int
    title: str
    amount: float
    category: str
    date: Optional[str] = None
    notes: Optional[str] = ""

class BookingRequest(BaseModel):
    trip_id: Optional[int] = 1
    item_type: str
    item_name: str
    price: float
    dates: Optional[str] = ""

class GuideBookingRequest(BaseModel):
    guide_id: int
    trip_id: Optional[int] = 1
    date: str
    hours: int = 4
    traveler_name: Optional[str] = "SmartTrip Traveler"

class SOSRequest(BaseModel):
    latitude: float = 48.8584
    longitude: float = 2.2945
    city: Optional[str] = "Paris"
    user_name: Optional[str] = "Alex Mercer"
    phone: Optional[str] = "+1 555-0199"
    emergency_note: Optional[str] = "Immediate assistance requested."

class TripRequest(BaseModel):
    title: str = "My Smart Trip"
    destination: str = "Paris"
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    days: int = 3
    budget: float = 1000.0
    travel_style: str = "Balanced"
    itinerary: Optional[dict] = None

# --- Distance Calculation Helper ---
def haversine_distance(lat1, lon1, lat2, lon2):
    R = 6371.0
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat / 2.0) ** 2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2.0) ** 2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return round(R * c, 2)

# ================= MODULE 1: ITINERARY GENERATOR =================
@app.get("/api/destinations")
def get_destinations():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT DISTINCT city FROM attractions ORDER BY city ASC")
    rows = cursor.fetchall()
    
    city_meta = {
        "Paris": {"country": "France", "hero_image": "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800", "daily_budget": 150},
        "Tokyo": {"country": "Japan", "hero_image": "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800", "daily_budget": 130},
        "Goa": {"country": "India", "hero_image": "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800", "daily_budget": 50},
        "Dubai": {"country": "UAE", "hero_image": "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800", "daily_budget": 220}
    }

    destinations = []
    for r in rows:
        city = r["city"]
        meta = city_meta.get(city, {"country": "Global", "hero_image": "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800", "daily_budget": 100})
        destinations.append({
            "city": city,
            "country": meta["country"],
            "hero_image": meta["hero_image"],
            "daily_budget_estimate": meta["daily_budget"]
        })
    conn.close()
    return {"success": True, "destinations": destinations}

@app.post("/api/itinerary")
def generate_itinerary(req: ItineraryRequest):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM attractions WHERE LOWER(city) = LOWER(?)", (req.destination,))
    attractions = [dict(r) for r in cursor.fetchall()]
    
    if not attractions:
        cursor.execute("SELECT * FROM attractions WHERE city = 'Paris'")
        attractions = [dict(r) for r in cursor.fetchall()]

    conn.close()

    time_slots = [
        {"slot": "Morning (09:00 - 12:30)", "label": "Morning"},
        {"slot": "Afternoon (14:00 - 16:30)", "label": "Afternoon"},
        {"slot": "Evening (17:30 - 20:30)", "label": "Evening"}
    ]

    days_plan = []
    used_ids = set()
    total_cost = 0.0

    for day_num in range(1, req.days + 1):
        day_activities = []
        day_cost = 0.0
        last_coords = None

        for slot in time_slots:
            avail = [a for a in attractions if a['id'] not in used_ids]
            if not avail:
                avail = attractions
            if not avail:
                break

            if last_coords:
                best = min(avail, key=lambda a: haversine_distance(last_coords[0], last_coords[1], a['latitude'], a['longitude']))
                dist = haversine_distance(last_coords[0], last_coords[1], best['latitude'], best['longitude'])
            else:
                best = avail[0]
                dist = 0.0

            used_ids.add(best['id'])
            last_coords = (best['latitude'], best['longitude'])
            cost = float(best['cost'])
            day_cost += cost
            total_cost += cost

            day_activities.append({
                "time_slot": slot["slot"],
                "name": best['name'],
                "category": best['category'],
                "cost": cost,
                "duration": f"{best['duration']} hrs",
                "rating": best['rating'],
                "crowd_level": best['crowd_pattern'],
                "description": best['description'],
                "image_url": best['image_url'],
                "distance_from_prev_km": dist
            })

        days_plan.append({
            "day": day_num,
            "date": f"Day {day_num}",
            "title": f"Day {day_num}: {req.destination} Highlights",
            "day_total_cost": round(day_cost, 2),
            "activity_count": len(day_activities),
            "activities": day_activities
        })

    return {
        "success": True,
        "destination": req.destination,
        "days": req.days,
        "total_budget": req.budget,
        "travel_style": req.travel_style,
        "summary": {
            "total_attractions": sum(len(d['activities']) for d in days_plan),
            "total_attraction_tickets": round(total_cost, 2),
            "suggested_budget_split": {
                "accommodation": round(req.budget * 0.4, 2),
                "food_dining": round(req.budget * 0.25, 2),
                "activities_tickets": round(req.budget * 0.20, 2),
                "local_transport": round(req.budget * 0.10, 2),
                "emergency_buffer": round(req.budget * 0.05, 2)
            }
        },
        "days_plan": days_plan
    }

# ================= MODULE 2: HOTELS & FLIGHTS =================
@app.get("/api/hotels")
def get_hotels(city: Optional[str] = None):
    conn = get_db_connection()
    cursor = conn.cursor()
    if city:
        cursor.execute("SELECT * FROM hotels WHERE LOWER(city) = LOWER(?)", (city,))
    else:
        cursor.execute("SELECT * FROM hotels")
    
    rows = cursor.fetchall()
    conn.close()
    hotels = []
    for r in rows:
        h = dict(r)
        if h.get('comparison_prices'):
            try:
                h['comparison_prices'] = json.loads(h['comparison_prices'])
            except Exception:
                h['comparison_prices'] = {"Booking.com": h['price'], "Agoda": h['price'] * 0.95}
        if h.get('amenities'):
            h['amenities_list'] = [a.strip() for a in h['amenities'].split(',')]
        hotels.append(h)
    return {"success": True, "count": len(hotels), "hotels": hotels}

@app.get("/api/flights")
def get_flights(destination: Optional[str] = None):
    conn = get_db_connection()
    cursor = conn.cursor()
    if destination:
        cursor.execute("SELECT * FROM flights WHERE LOWER(destination) = LOWER(?)", (destination,))
    else:
        cursor.execute("SELECT * FROM flights")
    flights = [dict(r) for r in cursor.fetchall()]
    conn.close()
    return {"success": True, "count": len(flights), "flights": flights}

@app.post("/api/bookings")
def create_booking(req: BookingRequest):
    conf_code = f"ST-{random.randint(1000, 9999)}-{uuid.uuid4().hex[:4].upper()}"
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO bookings (trip_id, item_type, item_name, dates, price, status, confirmation_code)
        VALUES (?, ?, ?, ?, ?, 'Confirmed', ?)
    """, (req.trip_id, req.item_type, req.item_name, req.dates, req.price, conf_code))
    conn.commit()
    conn.close()
    return {
        "success": True,
        "message": "Booking confirmed!",
        "confirmation_code": conf_code,
        "item_name": req.item_name,
        "price": req.price
    }

# ================= MODULE 3: BUDGET TRACKER =================
@app.get("/api/budget/{trip_id}")
def get_budget(trip_id: int):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM trips WHERE id = ?", (trip_id,))
    trip = cursor.fetchone()
    total_budget = float(trip['budget']) if trip else 1200.0

    cursor.execute("SELECT * FROM expenses WHERE trip_id = ? ORDER BY id DESC", (trip_id,))
    expenses = [dict(r) for r in cursor.fetchall()]
    conn.close()

    total_spent = sum(e['amount'] for e in expenses)
    remaining = max(0.0, total_budget - total_spent)
    pct = round((total_spent / total_budget * 100.0) if total_budget > 0 else 0.0, 1)

    return {
        "success": True,
        "trip_id": trip_id,
        "total_budget": total_budget,
        "total_spent": round(total_spent, 2),
        "remaining_budget": round(remaining, 2),
        "percentage_spent": pct,
        "is_warning_80": pct >= 80.0,
        "is_over_budget": pct >= 100.0,
        "expenses": expenses
    }

@app.post("/api/expenses")
def add_expense(req: ExpenseRequest):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO expenses (trip_id, title, amount, category, date, notes)
        VALUES (?, ?, ?, ?, COALESCE(?, DATE('now')), ?)
    """, (req.trip_id, req.title, req.amount, req.category, req.date, req.notes))
    exp_id = cursor.lastrowid
    conn.commit()
    conn.close()
    return {"success": True, "id": exp_id, "message": "Expense logged successfully"}

@app.delete("/api/expenses/{expense_id}")
def delete_expense(expense_id: int):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM expenses WHERE id = ?", (expense_id,))
    conn.commit()
    conn.close()
    return {"success": True, "message": "Expense deleted"}

# ================= MODULE 4: SMART ALERTS =================
@app.get("/api/alerts")
def get_alerts(city: str = "Paris"):
    weather_map = {
        "Paris": {"temp_c": 22, "condition": "Sunny & Pleasant", "rain_chance": "10%", "uv_index": 5},
        "Tokyo": {"temp_c": 24, "condition": "Clear Sky", "rain_chance": "5%", "uv_index": 6},
        "Goa": {"temp_c": 30, "condition": "Warm Breeze", "rain_chance": "20%", "uv_index": 8},
        "Dubai": {"temp_c": 35, "condition": "Hot & Sunny", "rain_chance": "0%", "uv_index": 10}
    }
    w = weather_map.get(city, {"temp_c": 22, "condition": "Pleasant", "rain_chance": "10%", "uv_index": 5})
    
    alerts = [
        {"id": 1, "type": "weather", "title": f"Live Weather in {city}", "message": f"{w['condition']} ({w['temp_c']}°C). Low rain probability ({w['rain_chance']}).", "severity": "info"},
        {"id": 2, "type": "crowd", "title": "Attraction Queue Alert", "message": "Peak hours active at central landmarks (~30m wait time).", "severity": "warning"},
        {"id": 3, "type": "flight", "title": "Flight Status", "message": "Air France & Partner connections on time.", "severity": "info"}
    ]
    return {"success": True, "city": city, "live_weather": w, "alerts": alerts}

# ================= MODULE 5: LOCAL GUIDES =================
@app.get("/api/guides")
def get_guides(city: Optional[str] = None):
    conn = get_db_connection()
    cursor = conn.cursor()
    if city:
        cursor.execute("SELECT * FROM guides WHERE LOWER(city) = LOWER(?)", (city,))
    else:
        cursor.execute("SELECT * FROM guides")
    rows = cursor.fetchall()
    conn.close()
    guides = []
    for r in rows:
        g = dict(r)
        g['languages_list'] = [l.strip() for l in g['languages'].split(',')]
        guides.append(g)
    return {"success": True, "count": len(guides), "guides": guides}

@app.post("/api/guides/book")
def book_guide(req: GuideBookingRequest):
    voucher_code = f"GD-{random.randint(100, 999)}-{uuid.uuid4().hex[:4].upper()}"
    return {
        "success": True,
        "message": "Guide booked successfully!",
        "voucher_code": voucher_code,
        "date": req.date,
        "hours": req.hours
    }

# ================= MODULE 6: SAFETY & SOS =================
@app.get("/api/safety")
def get_safety(city: str = "Paris"):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM safety_info WHERE LOWER(city) = LOWER(?)", (city,))
    row = cursor.fetchone()
    if not row:
        cursor.execute("SELECT * FROM safety_info WHERE city = 'Paris'")
        row = cursor.fetchone()
    conn.close()
    info = dict(row)
    info['safe_areas_list'] = [a.strip() for a in info['safe_areas'].split(',')] if info.get('safe_areas') else []
    info['caution_areas_list'] = [a.strip() for a in info['caution_areas'].split(',')] if info.get('caution_areas') else []
    return {"success": True, "safety_info": info}

@app.post("/api/safety/sos")
def trigger_sos(req: SOSRequest):
    incident_id = f"SOS-{uuid.uuid4().hex[:6].upper()}"
    return {
        "success": True,
        "status": "DISPATCHED_TO_EMERGENCY_SERVICES",
        "incident_id": incident_id,
        "coordinates": {"latitude": req.latitude, "longitude": req.longitude},
        "city": req.city,
        "responders": [
            {"service": "Local Police", "number": "112 / 17", "status": "Alert Sent"},
            {"service": "Medical Paramedics", "number": "112 / 15", "status": "Alert Sent"}
        ]
    }

# ================= TRIPS CRUD =================
@app.get("/api/trips")
def get_trips():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM trips ORDER BY id DESC")
    trips = [dict(r) for r in cursor.fetchall()]
    conn.close()
    return {"success": True, "trips": trips}

@app.post("/api/trips")
def save_trip(req: TripRequest):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO trips (title, destination, start_date, end_date, days, budget, travel_style, itinerary)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """, (req.title, req.destination, req.start_date, req.end_date, req.days, req.budget, req.travel_style, json.dumps(req.itinerary) if req.itinerary else None))
    trip_id = cursor.lastrowid
    conn.commit()
    conn.close()
    return {"success": True, "trip_id": trip_id, "message": "Trip saved successfully"}

@app.delete("/api/trips/{trip_id}")
def delete_trip(trip_id: int):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM trips WHERE id = ?", (trip_id,))
    conn.commit()
    conn.close()
    return {"success": True, "message": f"Trip {trip_id} deleted"}

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 5000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
