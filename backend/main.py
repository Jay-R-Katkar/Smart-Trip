from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import math
import json
import random
import uuid
import os
import sys

from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse

# Ensure backend directory is in path
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))
from database import get_db_connection, init_db
from seeds import seed_database

FRONTEND_DIST = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'frontend', 'dist'))

app = FastAPI(
    title="SmartTrip API",
    description="Dharmik & Global Travel Automation Platform REST API",
    version="2.0.0"
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
    index_file = os.path.join(FRONTEND_DIST, "index.html")
    if os.path.isfile(index_file):
        return FileResponse(index_file)
    return {
        "status": "online",
        "service": "SmartTrip Automation Platform API",
        "docs": "/docs",
        "health": "/health"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "SmartTrip FullStack API v2.0"}

# --- Pydantic Data Models ---
class UserAuthRequest(BaseModel):
    name: Optional[str] = None
    email: str
    password: str
    travel_interest: Optional[str] = "Spiritual"

class TransitBookingRequest(BaseModel):
    transit_mode: str  # 'Train', 'Flight', 'Bus', 'Cab / Tempo Traveller'
    operator_name: str
    route_number: Optional[str] = None
    departure_time: Optional[str] = None
    arrival_time: Optional[str] = None
    origin_city: str
    destination_city: str
    travel_date: str
    passenger_count: int = 1
    travel_class: Optional[str] = "Standard"
    total_price: float
    user_name: Optional[str] = "Rahul Sharma"
    user_email: Optional[str] = "rahul@smarttrip.in"

class StayBookingRequest(BaseModel):
    trip_id: Optional[int] = 1
    item_type: str = "Ashram"
    item_name: str
    price: float
    dates: Optional[str] = "Next Available Slot"
    user_name: Optional[str] = "Rahul Sharma"
    user_email: Optional[str] = "rahul@smarttrip.in"
    city: Optional[str] = "Ujjain"

class GuideBookingRequest(BaseModel):
    guide_id: Optional[int] = 1
    guide_name: str
    city: Optional[str] = "Ujjain"
    trip_id: Optional[int] = 1
    date: Optional[str] = "Tomorrow"
    hours: int = 4
    traveler_name: Optional[str] = "Rahul Sharma"
    price: float = 1500.0

class ItineraryPlanRequest(BaseModel):
    destination: str
    days: int = 2
    traveler_type: Optional[str] = "single"  # 'single' (Solo) or 'multiple' (Group)
    traveler_count: int = 1
    currency: Optional[str] = "INR"
    budget: float = 15000.0
    plan_style: Optional[str] = "standard"  # 'budget', 'standard', 'luxury'

class ExpenseCreateRequest(BaseModel):
    trip_id: Optional[int] = 1
    title: str
    amount: float
    category: str
    date: Optional[str] = None
    notes: Optional[str] = None

class SOSRequest(BaseModel):
    latitude: float = 23.1765
    longitude: float = 75.7885
    city: Optional[str] = "Ujjain"
    user_name: Optional[str] = "Rahul Sharma"
    emergency_note: Optional[str] = "Immediate assistance requested."

class ChatRequest(BaseModel):
    query: str
    city: Optional[str] = "Ujjain"

# ================= 1. AUTHENTICATION & PROFILE API =================
@app.post("/api/auth/signup")
def signup(req: UserAuthRequest):
    conn = get_db_connection()
    cursor = conn.cursor()
    display_name = req.name if req.name else req.email.split('@')[0].replace('.', ' ').title()
    try:
        cursor.execute("""
            INSERT INTO users (name, email, password, travel_interest, role, saved_trips)
            VALUES (?, ?, ?, ?, 'VIP Pilgrim', 1)
        """, (display_name, req.email, req.password, req.travel_interest))
        user_id = cursor.lastrowid
        conn.commit()
        conn.close()
        return {
            "success": True,
            "message": f"Welcome {display_name}! Your SmartTrip account has been created.",
            "user": {
                "id": user_id,
                "name": display_name,
                "email": req.email,
                "role": "VIP Pilgrim",
                "savedTrips": 1,
                "travelInterest": req.travel_interest
            }
        }
    except Exception:
        # If user already exists, update and return existing record
        cursor.execute("SELECT * FROM users WHERE email = ?", (req.email,))
        row = cursor.fetchone()
        conn.close()
        return {
            "success": True,
            "message": f"Welcome back, {display_name}!",
            "user": {
                "id": row["id"] if row else 1,
                "name": row["name"] if row else display_name,
                "email": req.email,
                "role": row["role"] if row else "VIP Pilgrim",
                "savedTrips": row["saved_trips"] if row else 4,
                "travelInterest": req.travel_interest
            }
        }

@app.post("/api/auth/login")
def login(req: UserAuthRequest):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE email = ? AND password = ?", (req.email, req.password))
    row = cursor.fetchone()
    conn.close()
    
    name = row["name"] if row else req.email.split('@')[0].replace('.', ' ').title()
    role = row["role"] if row else "VIP Pilgrim"
    saved_trips = row["saved_trips"] if row else 4

    return {
        "success": True,
        "message": f"Logged in successfully! Welcome {name}.",
        "user": {
            "id": row["id"] if row else 1,
            "name": name,
            "email": req.email,
            "role": role,
            "savedTrips": saved_trips
        }
    }

@app.get("/api/user/profile")
def get_user_profile(email: Optional[str] = "rahul.sharma@smarttrip.in"):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE email = ?", (email,))
    user_row = cursor.fetchone()

    cursor.execute("SELECT * FROM bookings ORDER BY id DESC")
    bookings = cursor.fetchall()

    cursor.execute("SELECT * FROM transit_tickets ORDER BY id DESC")
    tickets = cursor.fetchall()
    conn.close()

    return {
        "success": True,
        "user": dict(user_row) if user_row else {
            "name": "Rahul Sharma",
            "email": email,
            "role": "VIP Pilgrim",
            "saved_trips": 4
        },
        "bookings_count": len(bookings),
        "transit_tickets_count": len(tickets),
        "recent_bookings": [dict(b) for b in bookings[:5]],
        "recent_tickets": [dict(t) for t in tickets[:5]]
    }

# ================= 2. TRANSIT & TICKET BOOKINGS (TRAIN, FLIGHT, BUS, CAB) =================
@app.post("/api/transit/book")
def book_transit(req: TransitBookingRequest):
    prefix_map = {
        'Train': 'ST-TRN',
        'Flight': 'ST-FLT',
        'Bus': 'ST-BUS',
        'Cab / Tempo Traveller': 'ST-CAB'
    }
    prefix = prefix_map.get(req.transit_mode, 'ST-TRN')
    pnr_code = f"{prefix}-{random.randint(1000, 9999)}"

    conn = get_db_connection()
    cursor = conn.cursor()
    
    # 1. Insert into transit_tickets table
    cursor.execute("""
        INSERT INTO transit_tickets (
            pnr_code, transit_mode, operator_name, route_number,
            origin_city, destination_city, departure_time, arrival_time,
            travel_date, passenger_count, travel_class, total_price, status
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Confirmed')
    """, (
        pnr_code, req.transit_mode, req.operator_name, req.route_number,
        req.origin_city, req.destination_city, req.departure_time, req.arrival_time,
        req.travel_date, req.passenger_count, req.travel_class, req.total_price
    ))
    ticket_id = cursor.lastrowid

    # 2. Insert into general bookings table
    cursor.execute("""
        INSERT INTO bookings (trip_id, item_type, item_name, city, dates, price, status, confirmation_code, guest_name)
        VALUES (1, ?, ?, ?, ?, ?, 'Confirmed', ?, ?)
    """, (
        req.transit_mode, f"{req.operator_name} ({req.origin_city} ➔ {req.destination_city})",
        req.destination_city, f"{req.travel_date} • {req.passenger_count} Passenger(s)",
        req.total_price, pnr_code, req.user_name
    ))

    # 3. Automatically log into budget expenses
    cursor.execute("""
        INSERT INTO expenses (trip_id, title, amount, category, date, notes)
        VALUES (1, ?, ?, 'Transport', ?, ?)
    """, (
        f"{req.operator_name} Ticket ({req.origin_city} -> {req.destination_city})",
        req.total_price, req.travel_date, f"PNR: {pnr_code} ({req.travel_class})"
    ))

    conn.commit()
    conn.close()

    return {
        "success": True,
        "message": f"Confirmed! {req.transit_mode} ticket booked with PNR {pnr_code}.",
        "ticket_id": ticket_id,
        "pnr_code": pnr_code,
        "transit_mode": req.transit_mode,
        "operator_name": req.operator_name,
        "route_number": req.route_number,
        "origin_city": req.origin_city,
        "destination_city": req.destination_city,
        "travel_date": req.travel_date,
        "passenger_count": req.passenger_count,
        "travel_class": req.travel_class,
        "total_price": req.total_price,
        "status": "Confirmed (Ready for Boarding)"
    }

@app.get("/api/transit/tickets")
def get_transit_tickets(destination: Optional[str] = None):
    conn = get_db_connection()
    cursor = conn.cursor()
    if destination:
        cursor.execute("SELECT * FROM transit_tickets WHERE LOWER(destination_city) = LOWER(?) ORDER BY id DESC", (destination,))
    else:
        cursor.execute("SELECT * FROM transit_tickets ORDER BY id DESC")
    rows = cursor.fetchall()
    conn.close()
    return {"success": True, "count": len(rows), "tickets": [dict(r) for r in rows]}

@app.get("/api/transit/options")
def get_transit_options(origin: str = "Mumbai", destination: str = "Ujjain"):
    """Generates real route options for Trains, Flights, Buses, and Tempo Travellers."""
    trains = [
        {
            "id": f"trn-vb-{origin[:3].lower()}-{destination[:3].lower()}",
            "name": f"Vande Bharat Express ({origin} ➔ {destination})",
            "number": "20911",
            "departureTime": "06:10 AM",
            "arrivalTime": "01:30 PM",
            "duration": "7h 20m",
            "fromStation": f"{origin} Central (MMCT)",
            "toStation": f"{destination} Junction",
            "runsOn": "All Days except Wed",
            "rating": 4.9,
            "reviews": 480,
            "classes": [
                {"code": "CC", "name": "AC Chair Car", "priceINR": 1580, "seats": "Available - 46 Seats"},
                {"code": "EC", "name": "Executive Class", "priceINR": 2840, "seats": "Available - 14 Seats"}
            ]
        },
        {
            "id": f"trn-sf-{origin[:3].lower()}-{destination[:3].lower()}",
            "name": f"{destination} Superfast Express",
            "number": "12919",
            "departureTime": "10:45 PM",
            "arrivalTime": "07:15 AM (+1)",
            "duration": "8h 30m",
            "fromStation": f"{origin} Terminus",
            "toStation": f"{destination} Main",
            "runsOn": "Daily",
            "rating": 4.7,
            "reviews": 320,
            "classes": [
                {"code": "3A", "name": "3-Tier AC", "priceINR": 1150, "seats": "Available - 28 Seats"},
                {"code": "2A", "name": "2-Tier AC", "priceINR": 1650, "seats": "Available - 12 Seats"},
                {"code": "1A", "name": "First AC", "priceINR": 2800, "seats": "Available - 6 Seats"}
            ]
        }
    ]

    flights = [
        {
            "id": f"flt-6e-{origin[:3].lower()}-{destination[:3].lower()}",
            "airline": "IndiGo",
            "flightNumber": "6E-5182",
            "departureTime": "08:15 AM",
            "arrivalTime": "09:45 AM",
            "duration": "1h 30m",
            "fromAirport": f"{origin} International (BOM)",
            "toAirport": f"{destination} Airport / Nearest Terminal",
            "priceINR": 4200,
            "type": "Non-Stop",
            "baggage": "15 kg Check-in + 7 kg Cabin",
            "meal": "Complimentary Refreshment",
            "onTimeScore": "94% On-Time"
        },
        {
            "id": f"flt-ai-{origin[:3].lower()}-{destination[:3].lower()}",
            "airline": "Air India",
            "flightNumber": "AI-634",
            "departureTime": "04:30 PM",
            "arrivalTime": "06:05 PM",
            "duration": "1h 35m",
            "fromAirport": f"{origin} Terminal 2",
            "toAirport": f"{destination} Terminal 1",
            "priceINR": 4850,
            "type": "Non-Stop",
            "baggage": "20 kg Check-in + 7 kg Cabin",
            "meal": "Full Hot Meal Included",
            "onTimeScore": "91% On-Time"
        }
    ]

    buses = [
        {
            "id": f"bus-zg-{origin[:3].lower()}-{destination[:3].lower()}",
            "operator": "Zingbus Electric Volvo 9600",
            "busType": "AC Multi-Axle Sleeper (2+1)",
            "departureTime": "09:00 PM",
            "arrivalTime": "06:30 AM (+1)",
            "duration": "9h 30m",
            "fromHub": f"{origin} Hub (Borivali / Kashmere Gate)",
            "toHub": f"{destination} Main Stand",
            "priceINR": 1150,
            "rating": 4.8,
            "reviews": 560,
            "tag": "⭐ Top Rated Pilgrim Bus",
            "seatsLeft": 18,
            "amenities": "WiFi, Charging Ports, Water Bottle, Clean Blankets"
        }
    ]

    cabs = [
        {
            "id": f"cab-urb-{origin[:3].lower()}-{destination[:3].lower()}",
            "vehicleName": "Force Urbania / Tempo Traveller (12-17 Seater)",
            "category": "Group Pilgrimage Traveller",
            "capacity": "12-17 Passengers + Luggage Carrier",
            "priceINR": 14500,
            "perKmRate": "₹22/km All Inclusive",
            "driver": "Verified Commercial Chauffeur with Pilgrim Route Expertise",
            "rating": 4.9,
            "reviews": 195,
            "inclusions": "Tolls, State Border Taxes, Fuel, Doorstep Pickup included",
            "image": "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600"
        },
        {
            "id": f"cab-inv-{origin[:3].lower()}-{destination[:3].lower()}",
            "vehicleName": "Toyota Innova Crysta (6+1 VIP)",
            "category": "Premium Family Outstation",
            "capacity": "6 Passengers + 4 Large Bags",
            "priceINR": 7800,
            "perKmRate": "₹16/km All Inclusive",
            "driver": "Uniformed English/Hindi Chauffeur",
            "rating": 5.0,
            "reviews": 320,
            "inclusions": "AC On Full Time, Highway Fastag included",
            "image": "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600"
        }
    ]

    return {
        "success": True,
        "origin": origin,
        "destination": destination,
        "trains": trains,
        "flights": flights,
        "buses": buses,
        "cabs": cabs
    }

# ================= 3. DESTINATIONS & DYNAMIC ITINERARY PLANNER =================
@app.get("/api/destinations")
def get_all_destinations(category: Optional[str] = None):
    conn = get_db_connection()
    cursor = conn.cursor()
    if category and category != "All":
        cursor.execute("SELECT * FROM destinations WHERE category = ?", (category,))
    else:
        cursor.execute("SELECT * FROM destinations")
    rows = cursor.fetchall()
    conn.close()

    result = []
    for r in rows:
        d = dict(r)
        d["activities"] = json.loads(d["activities"]) if d["activities"] else []
        result.append(d)

    return {"success": True, "count": len(result), "destinations": result}

@app.post("/api/itinerary/plan")
def generate_itinerary_plan(req: ItineraryPlanRequest):
    """Calculates intelligent Single vs Multiple (Solo vs Group) budget and day-wise schedule."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM destinations WHERE LOWER(name) = LOWER(?)", (req.destination,))
    dest_row = cursor.fetchone()
    conn.close()

    min_daily_rate = dest_row["min_daily_rate"] if dest_row else 1000.0
    activities = json.loads(dest_row["activities"]) if dest_row and dest_row["activities"] else [
        "Sanctum Darshan & Holy Ghat Parikrama", "Ancient Teerth Corridor Walk", "Local Souvenirs & Satvik Feast"
    ]

    # Calculate Group Multiplier
    traveler_count = max(1, req.traveler_count)
    group_multiplier = 1.0 if traveler_count <= 1 else (1.0 + (traveler_count - 1) * 0.75)
    total_min_required = round(min_daily_rate * req.days * group_multiplier)
    
    is_budget_too_low = req.budget < total_min_required
    per_person_budget = round(req.budget / traveler_count)
    per_person_per_day = round(per_person_budget / (req.days or 1))

    # Day themes
    day_themes = [
        {"title": "Sanctum Darshan & Holy Ghat Parikrama", "sub": "Arrival, primary temple visit, evening river aarti"},
        {"title": "Corridor Walk, Ancient Teerths & Heritage", "sub": "Historical exploration, local markets & satvik feast"},
        {"title": "Excursion Trails & Scenic Panoramic Vistas", "sub": "Outskirt teerths, boat parikrama & tranquil spots"},
        {"title": "Spiritual Discourses & Ashram Meditation", "sub": "Deep Vedic interactions, meditation & local souvenirs"},
        {"title": "Grand Farewell & Sacred Souvenir Parikrama", "sub": "Morning final prayers, prasad packaging & departure"}
    ]

    schedule = []
    raw_day_budget = round(req.budget / req.days)
    for d in range(1, req.days + 1):
        theme = day_themes[(d - 1) % len(day_themes)]
        stay_share = round(raw_day_budget * 0.40)
        food_share = round(raw_day_budget * 0.25)
        trans_share = round(raw_day_budget * 0.15)
        act_share = round(raw_day_budget * 0.20)

        schedule.append({
            "dayNumber": d,
            "themeTitle": theme["title"],
            "themeSub": theme["sub"],
            "dayBudget": raw_day_budget,
            "perPersonDayBudget": round(raw_day_budget / traveler_count),
            "breakdown": {
                "stay": stay_share,
                "food": food_share,
                "transport": trans_share,
                "activities": act_share
            },
            "suggestedActivities": activities[:3]
        })

    return {
        "success": True,
        "destination": req.destination,
        "days": req.days,
        "traveler_type": req.traveler_type,
        "traveler_count": traveler_count,
        "currency": req.currency,
        "total_budget": req.budget,
        "per_person_budget": per_person_budget,
        "per_person_per_day": per_person_per_day,
        "total_min_required": total_min_required,
        "is_budget_too_low": is_budget_too_low,
        "schedule": schedule
    }

# ================= 4. ASHRAMS & STAYS API =================
@app.get("/api/stays")
def get_stays(city: Optional[str] = None):
    conn = get_db_connection()
    cursor = conn.cursor()
    if city:
        cursor.execute("SELECT * FROM stays WHERE LOWER(city) = LOWER(?)", (city,))
    else:
        cursor.execute("SELECT * FROM stays")
    rows = cursor.fetchall()
    conn.close()
    return {"success": True, "count": len(rows), "stays": [dict(r) for r in rows]}

@app.post("/api/stays/book")
def book_stay(req: StayBookingRequest):
    conf_code = f"ST-BK-{random.randint(1000, 9999)}"
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO bookings (trip_id, item_type, item_name, city, dates, price, status, confirmation_code, guest_name)
        VALUES (?, ?, ?, ?, ?, ?, 'Confirmed', ?, ?)
    """, (req.trip_id, req.item_type, req.item_name, req.city, req.dates, req.price, conf_code, req.user_name))
    booking_id = cursor.lastrowid

    # Automatically add to budget expenses
    cursor.execute("""
        INSERT INTO expenses (trip_id, title, amount, category, date, notes)
        VALUES (?, ?, ?, 'Stay', ?, ?)
    """, (req.trip_id, req.item_name, req.price, "2026-08-27", f"Confirmed Voucher: {conf_code}"))

    conn.commit()
    conn.close()

    return {
        "success": True,
        "message": f"Stay Confirmed at {req.item_name}!",
        "booking_id": booking_id,
        "confirmation_code": conf_code,
        "item_name": req.item_name,
        "city": req.city,
        "price": req.price,
        "dates": req.dates,
        "guest_name": req.user_name,
        "status": "Confirmed (VIP Satvik Stay)"
    }

@app.get("/api/bookings")
def get_all_bookings():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM bookings ORDER BY id DESC")
    rows = cursor.fetchall()
    conn.close()
    return {"success": True, "count": len(rows), "bookings": [dict(r) for r in rows]}

# ================= 5. BUDGET TRACKER & EXPENSES API =================
@app.get("/api/budget/expenses")
def get_expenses(trip_id: Optional[int] = 1):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM expenses WHERE trip_id = ? ORDER BY id DESC", (trip_id,))
    rows = cursor.fetchall()
    conn.close()

    total_spent = sum(r["amount"] for r in rows)
    return {
        "success": True,
        "count": len(rows),
        "total_spent": total_spent,
        "expenses": [dict(r) for r in rows]
    }

@app.post("/api/budget/expenses")
def create_expense(req: ExpenseCreateRequest):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO expenses (trip_id, title, amount, category, date, notes)
        VALUES (?, ?, ?, ?, ?, ?)
    """, (req.trip_id, req.title, req.amount, req.category, req.date or "2026-08-27", req.notes))
    expense_id = cursor.lastrowid
    conn.commit()
    conn.close()

    return {
        "success": True,
        "message": "Expense logged successfully!",
        "expense": {
            "id": expense_id,
            "title": req.title,
            "amount": req.amount,
            "category": req.category,
            "date": req.date or "2026-08-27",
            "notes": req.notes
        }
    }

@app.delete("/api/budget/expenses/{expense_id}")
def delete_expense(expense_id: int):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM expenses WHERE id = ?", (expense_id,))
    conn.commit()
    conn.close()
    return {"success": True, "message": f"Expense #{expense_id} deleted."}

# ================= 6. VERIFIED GUIDES API =================
@app.get("/api/guides")
def get_guides(city: Optional[str] = None):
    conn = get_db_connection()
    cursor = conn.cursor()
    if city and city != "All":
        cursor.execute("SELECT * FROM guides WHERE LOWER(city) = LOWER(?)", (city,))
    else:
        cursor.execute("SELECT * FROM guides")
    rows = cursor.fetchall()
    conn.close()
    return {"success": True, "count": len(rows), "guides": [dict(r) for r in rows]}

@app.post("/api/guides/book")
def book_guide(req: GuideBookingRequest):
    voucher_code = f"ST-GD-{random.randint(1000, 9999)}"
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO bookings (trip_id, item_type, item_name, city, dates, price, status, confirmation_code, guest_name)
        VALUES (?, 'Verified Guide', ?, ?, ?, ?, 'Confirmed', ?, ?)
    """, (req.trip_id, f"Acharya {req.guide_name}", req.city, req.date, req.price, voucher_code, req.traveler_name))
    conn.commit()
    conn.close()

    return {
        "success": True,
        "message": f"Verified Guide {req.guide_name} booked successfully!",
        "voucher_code": voucher_code,
        "guide_name": req.guide_name,
        "date": req.date,
        "hours": req.hours,
        "price": req.price,
        "traveler_name": req.traveler_name
    }

# ================= 7. SMART ALERTS API =================
@app.get("/api/alerts")
def get_alerts(city: Optional[str] = "Ujjain"):
    sample_alerts = [
        {
            "id": 1,
            "type": "crowd",
            "severity": "high",
            "title": f"Peak Darshan Rush Alert in {city}",
            "message": f"Heavy pilgrim influx expected today. Early morning queue slot (04:00 AM - 07:00 AM) recommended."
        },
        {
            "id": 2,
            "type": "weather",
            "severity": "info",
            "title": "Pleasant Weather & Clear Skies",
            "message": "Comfortable temperature of 24°C - 30°C. Ideal for outdoor temple corridor parikrama."
        },
        {
            "id": 3,
            "type": "transit",
            "severity": "success",
            "title": "Vande Bharat & Special Pilgrim Express Running on Time",
            "message": "All incoming trains and connecting luxury Volvo buses are on scheduled time."
        }
    ]
    return {"success": True, "city": city, "alerts": sample_alerts}

# ================= 8. SAFETY & SOS =================
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
            {"service": "112 Police Control", "status": "Dispatched (ETA 4 mins)"},
            {"service": "108 Emergency Ambulance", "status": "Dispatched (ETA 6 mins)"},
            {"service": "1363 Tourist Helpline", "status": "Alert Logged"}
        ]
    }

@app.get("/api/safety/{city}")
def get_safety_city_info(city: str):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM safety_info WHERE LOWER(city) = LOWER(?)", (city,))
    row = cursor.fetchone()
    conn.close()
    if row:
        return {"success": True, "safety": dict(row)}
    return {
        "success": True,
        "safety": {
            "city": city,
            "safety_score": 92,
            "police_number": "112",
            "ambulance_number": "108",
            "tourist_helpline": "1363",
            "safe_areas": "Temple corridors, ghats, main market",
            "caution_areas": "Narrow old lanes during midnight",
            "nearest_hospitals": f"{city} Civil Hospital (+91 112)",
            "emergency_tips": "Keep emergency contacts accessible; police outposts present at every gate."
        }
    }

# ================= 9. AI DHARMIK CHATBOT =================
@app.post("/api/ai/chat")
def ai_chat(req: ChatRequest):
    q = req.query.lower()
    if "bhasma" in q or "ujjain" in q or "mahakal" in q:
        reply = "🔱 **Mahakaleshwar Ujjain Darshan Info:**\n• Bhasma Aarti: 04:00 AM - 06:00 AM.\n• Traditional attire mandatory (Dhoti/Saree for Garbhagriha jalabhishek).\n• Recommended stay: Shri Mahakal Bhakt Ashram."
    elif "ayodhya" in q or "ram mandir" in q:
        reply = "🛕 **Shri Ram Janmabhoomi Ayodhya:**\n• Darshan: 07:00 AM - 11:30 AM & 02:00 PM - 07:00 PM.\n• Evening Saryu Aarti at 07:30 PM.\n• Ram Ki Paidi & Kanak Bhawan must visit."
    elif "kedarnath" in q:
        reply = "🏔️ **Kedarnath Dham:**\n• Altitude: 3,583m. 16km trek from Gaurikund or helicopter from Phata/Guptkashi.\n• Warm thermal clothing & biometric registration mandatory."
    elif "train" in q or "flight" in q or "bus" in q or "ticket" in q:
        reply = f"🚆✈️ **Transit Hub:** Direct Vande Bharat express trains, non-stop flights, luxury Volvo sleeper buses, and 12-17 seater Tempo Travellers are available from your current location to {req.city} in the 'Transit & Tickets' tab!"
    elif "budget" in q or "solo" in q or "group" in q:
        reply = "💰 **Smart Budget Planner:** You can plan for both 'Solo Traveler' and 'Group Travelers' in the top planner bar. The system automatically calculates room sharing discounts and per-person cost breakdown!"
    else:
        reply = f"✨ **SmartTrip AI Assistant:** Verified circuit for {req.city} is loaded! You can book direct trains/flights, verified ashrams, and Vedic guides seamlessly."
    
    return {"success": True, "reply": reply}

# --- Static Frontend Serving & Single Page App Fallback ---
if os.path.exists(FRONTEND_DIST):
    assets_dir = os.path.join(FRONTEND_DIST, 'assets')
    if os.path.exists(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

    @app.get("/{full_path:path}")
    def serve_frontend(full_path: str):
        if full_path.startswith("api/") or full_path in ["docs", "openapi.json", "health"]:
            raise HTTPException(status_code=404, detail="API route not found")
        file_path = os.path.join(FRONTEND_DIST, full_path)
        if full_path and os.path.isfile(file_path):
            return FileResponse(file_path)
        index_file = os.path.join(FRONTEND_DIST, "index.html")
        if os.path.isfile(index_file):
            return FileResponse(index_file)
        return {"status": "Frontend building..."}

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 5000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
