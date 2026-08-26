import sqlite3
import os

BASE_DIR = os.path.abspath(os.path.dirname(__file__))
DATABASE_PATH = os.environ.get('DATABASE_PATH', os.path.join(BASE_DIR, 'smarttrip.db'))

def get_db_connection():
    """Returns a sqlite3 connection with Row factory enabled."""
    conn = sqlite3.connect(DATABASE_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON;")
    return conn

def init_db():
    """Initializes all database tables if they do not exist."""
    conn = get_db_connection()
    cursor = conn.cursor()

    # 1. Users Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        phone TEXT,
        role TEXT DEFAULT 'VIP Pilgrim',
        travel_interest TEXT DEFAULT 'Spiritual',
        saved_trips INTEGER DEFAULT 4,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    # 2. Destinations Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS destinations (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        title TEXT NOT NULL,
        category TEXT NOT NULL,
        default_currency TEXT DEFAULT 'INR',
        min_daily_rate REAL DEFAULT 1000.0,
        image TEXT,
        activities TEXT,
        latitude REAL,
        longitude REAL
    );
    """)

    # 3. Stays & Ashrams Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS stays (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        city TEXT NOT NULL,
        type TEXT NOT NULL,
        category TEXT NOT NULL,
        price_inr REAL NOT NULL,
        rating REAL DEFAULT 4.8,
        reviews INTEGER DEFAULT 150,
        distance TEXT,
        amenities TEXT,
        image TEXT
    );
    """)

    # 4. Transit & Tickets Table (Trains, Flights, Buses, Tempo Travellers & Cabs)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS transit_tickets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER DEFAULT 1,
        pnr_code TEXT UNIQUE NOT NULL,
        transit_mode TEXT NOT NULL,
        operator_name TEXT NOT NULL,
        route_number TEXT,
        origin_city TEXT NOT NULL,
        destination_city TEXT NOT NULL,
        departure_time TEXT,
        arrival_time TEXT,
        travel_date TEXT,
        passenger_count INTEGER DEFAULT 1,
        travel_class TEXT,
        total_price REAL NOT NULL,
        status TEXT DEFAULT 'Confirmed',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    # 5. Stays & General Bookings Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS bookings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        trip_id INTEGER DEFAULT 1,
        user_id INTEGER DEFAULT 1,
        item_type TEXT NOT NULL,
        item_name TEXT NOT NULL,
        city TEXT,
        dates TEXT,
        price REAL NOT NULL,
        status TEXT DEFAULT 'Confirmed',
        confirmation_code TEXT UNIQUE,
        guest_name TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    # 6. Verified Guides Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS guides (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        city TEXT NOT NULL,
        rating REAL DEFAULT 4.9,
        reviews INTEGER DEFAULT 200,
        languages TEXT NOT NULL,
        expertise TEXT NOT NULL,
        price_per_day REAL NOT NULL,
        phone TEXT,
        avatar_url TEXT,
        bio TEXT,
        verified INTEGER DEFAULT 1
    );
    """)

    # 7. Trips Table (Single & Group Itineraries)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS trips (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER DEFAULT 1,
        title TEXT NOT NULL,
        destination TEXT NOT NULL,
        days INTEGER NOT NULL DEFAULT 2,
        traveler_type TEXT DEFAULT 'single',
        traveler_count INTEGER DEFAULT 1,
        currency TEXT DEFAULT 'INR',
        budget REAL NOT NULL DEFAULT 15000.0,
        plan_style TEXT DEFAULT 'standard',
        itinerary TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    # 8. Budget Tracker Expenses Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS expenses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        trip_id INTEGER DEFAULT 1,
        user_id INTEGER DEFAULT 1,
        title TEXT NOT NULL,
        amount REAL NOT NULL,
        category TEXT NOT NULL,
        date TEXT NOT NULL,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    # 9. Safety Info Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS safety_info (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        city TEXT UNIQUE NOT NULL,
        safety_score INTEGER DEFAULT 90,
        police_number TEXT DEFAULT '112',
        ambulance_number TEXT DEFAULT '108',
        tourist_helpline TEXT DEFAULT '1363',
        safe_areas TEXT,
        caution_areas TEXT,
        nearest_hospitals TEXT,
        emergency_tips TEXT
    );
    """)

    # 10. Smart Alerts Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS alerts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        city TEXT,
        type TEXT NOT NULL,
        title TEXT NOT NULL,
        message TEXT NOT NULL,
        severity TEXT DEFAULT 'info',
        is_read INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    conn.commit()
    conn.close()

if __name__ == '__main__':
    init_db()
