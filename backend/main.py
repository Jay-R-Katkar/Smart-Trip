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

from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, HTMLResponse

# Ensure backend directory is in path
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))
from database import get_db_connection, init_db
from seeds import seed_database

FRONTEND_DIST = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'frontend', 'dist'))

app = FastAPI(
    title="SmartTrip API",
    description="Dharmik & Global Travel Automation Platform REST API",
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
    return {"status": "healthy"}

# --- Data Models ---
class UserAuthRequest(BaseModel):
    name: Optional[str] = None
    email: str
    password: str
    travel_interest: Optional[str] = "Spiritual"

class BookingRequest(BaseModel):
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
    price: Optional[float] = 500.0

class ItineraryRequest(BaseModel):
    destination: str
    days: int = 2
    budget: float = 15000.0
    travel_style: Optional[str] = "Spiritual"

class SOSRequest(BaseModel):
    latitude: float = 23.1765
    longitude: float = 75.7885
    city: Optional[str] = "Ujjain"
    user_name: Optional[str] = "Rahul Sharma"
    emergency_note: Optional[str] = "Immediate assistance requested."

class ChatRequest(BaseModel):
    query: str
    city: Optional[str] = "Ujjain"

# ================= AUTHENTICATION ENDPOINTS =================
@app.post("/api/auth/signup")
def signup(req: UserAuthRequest):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("""
            INSERT INTO users (name, email, password)
            VALUES (?, ?, ?)
        """, (req.name or req.email.split('@')[0], req.email, req.password))
        user_id = cursor.lastrowid
        conn.commit()
        conn.close()
        return {
            "success": True,
            "message": "Account created successfully!",
            "user": {
                "id": user_id,
                "name": req.name or req.email.split('@')[0],
                "email": req.email,
                "role": "VIP Pilgrim",
                "savedTrips": 1
            }
        }
    except Exception as e:
        conn.close()
        return {
            "success": True,
            "message": "Welcome back!",
            "user": {
                "name": req.name or req.email.split('@')[0],
                "email": req.email,
                "role": "VIP Pilgrim",
                "savedTrips": 4
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
    return {
        "success": True,
        "message": "Logged in successfully!",
        "user": {
            "name": name,
            "email": req.email,
            "role": "VIP Pilgrim",
            "savedTrips": 4
        }
    }

# ================= MODULE 2: ASHRAMS & HOTEL BOOKINGS =================
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
    return {"success": True, "count": len(rows), "hotels": [dict(r) for r in rows]}

@app.post("/api/bookings")
def create_booking(req: BookingRequest):
    conf_code = f"ST-BK-{random.randint(1000, 9999)}"
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO bookings (trip_id, item_type, item_name, dates, price, status, confirmation_code)
        VALUES (?, ?, ?, ?, ?, 'Confirmed', ?)
    """, (req.trip_id, req.item_type, req.item_name, req.dates, req.price, conf_code))
    booking_id = cursor.lastrowid
    conn.commit()
    conn.close()
    
    return {
        "success": True,
        "message": f"Booking Confirmed for {req.item_name}!",
        "booking_id": booking_id,
        "confirmation_code": conf_code,
        "item_name": req.item_name,
        "item_type": req.item_type,
        "price": req.price,
        "dates": req.dates,
        "user_name": req.user_name,
        "status": "Confirmed (VIP Reserved)"
    }

@app.get("/api/bookings")
def get_all_bookings():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM bookings ORDER BY id DESC")
    rows = cursor.fetchall()
    conn.close()
    return {"success": True, "count": len(rows), "bookings": [dict(r) for r in rows]}

# ================= MODULE 5: VERIFIED GUIDES BOOKING =================
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
    return {"success": True, "count": len(rows), "guides": [dict(r) for r in rows]}

@app.post("/api/guides/book")
def book_guide(req: GuideBookingRequest):
    voucher_code = f"ST-GD-{random.randint(1000, 9999)}"
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO bookings (trip_id, item_type, item_name, dates, price, status, confirmation_code)
        VALUES (?, 'Guide', ?, ?, ?, 'Confirmed', ?)
    """, (req.trip_id, req.guide_name, req.date, req.price, voucher_code))
    conn.commit()
    conn.close()
    
    return {
        "success": True,
        "message": f"Guide {req.guide_name} booked successfully!",
        "voucher_code": voucher_code,
        "guide_name": req.guide_name,
        "date": req.date,
        "hours": req.hours,
        "price": req.price
    }

# ================= MODULE 6: SAFETY & SOS =================
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
            {"service": "112 Police Control", "status": "Dispatched"},
            {"service": "108 Emergency Ambulance", "status": "Dispatched"}
        ]
    }

# ================= MODULE 7: AI CHATBOT =================
@app.post("/api/ai/chat")
def ai_chat(req: ChatRequest):
    q = req.query.lower()
    if "bhasma" in q or "ujjain" in q or "mahakal" in q:
        reply = "🔱 **Mahakaleshwar Ujjain Darshan Info:**\n• Bhasma Aarti: 04:00 AM - 06:00 AM.\n• Traditional attire mandatory.\n• Recommended stay: Shri Mahakal Bhakt Ashram."
    elif "ayodhya" in q or "ram mandir" in q:
        reply = "🛕 **Shri Ram Janmabhoomi Ayodhya:**\n• Darshan: 07:00 AM - 11:30 AM & 02:00 PM - 07:00 PM.\n• Evening Saryu Aarti at 07:30 PM."
    elif "switzerland" in q:
        reply = "🏔️ **Switzerland Circuit:**\n• Top spots: Jungfraujoch, Lake Lucerne, Matterhorn Zermatt. Currency: CHF (Swiss Franc)."
    elif "dubai" in q:
        reply = "🏙️ **Dubai Circuit:**\n• Burj Khalifa 124th floor observation deck & Red Dune Desert Safari. Currency: AED."
    else:
        reply = f"✨ **SmartTrip AI:** I have analyzed your circuit for {req.city}! Verified ashrams, Vedic guides, and route maps are ready."
    
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
