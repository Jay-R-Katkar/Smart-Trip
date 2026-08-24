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

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        phone TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS attractions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        city TEXT NOT NULL,
        name TEXT NOT NULL,
        category TEXT DEFAULT 'Sightseeing',
        cost REAL DEFAULT 0.0,
        duration REAL DEFAULT 2.0,
        rating REAL DEFAULT 4.5,
        latitude REAL NOT NULL,
        longitude REAL NOT NULL,
        opening_hours TEXT DEFAULT '09:00 - 18:00',
        crowd_pattern TEXT DEFAULT 'Moderate',
        description TEXT,
        image_url TEXT
    );
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS hotels (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        city TEXT NOT NULL,
        price REAL NOT NULL,
        rating REAL DEFAULT 4.0,
        stars INTEGER DEFAULT 3,
        latitude REAL,
        longitude REAL,
        amenities TEXT,
        image_url TEXT,
        comparison_prices TEXT
    );
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS flights (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        origin TEXT NOT NULL,
        destination TEXT NOT NULL,
        airline TEXT NOT NULL,
        flight_number TEXT NOT NULL,
        departure_time TEXT NOT NULL,
        arrival_time TEXT NOT NULL,
        duration TEXT NOT NULL,
        price REAL NOT NULL,
        stops INTEGER DEFAULT 0
    );
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS guides (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        city TEXT NOT NULL,
        rating REAL DEFAULT 4.8,
        languages TEXT NOT NULL,
        expertise TEXT NOT NULL,
        price_per_hour REAL NOT NULL,
        price_per_day REAL NOT NULL,
        availability TEXT DEFAULT 'Available',
        verified INTEGER DEFAULT 1,
        phone TEXT,
        avatar_url TEXT,
        bio TEXT
    );
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS trips (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER DEFAULT 1,
        title TEXT NOT NULL,
        destination TEXT NOT NULL,
        start_date TEXT,
        end_date TEXT,
        days INTEGER NOT NULL DEFAULT 3,
        budget REAL NOT NULL DEFAULT 1000.0,
        travel_style TEXT DEFAULT 'Balanced',
        itinerary TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS expenses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        trip_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        amount REAL NOT NULL,
        category TEXT NOT NULL,
        date TEXT NOT NULL,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS bookings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        trip_id INTEGER,
        item_type TEXT NOT NULL,
        item_id INTEGER,
        item_name TEXT NOT NULL,
        dates TEXT,
        price REAL NOT NULL,
        status TEXT DEFAULT 'Confirmed',
        payment_id TEXT,
        confirmation_code TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS safety_info (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        city TEXT UNIQUE NOT NULL,
        safety_score INTEGER DEFAULT 85,
        police_number TEXT DEFAULT '112',
        ambulance_number TEXT DEFAULT '112',
        tourist_helpline TEXT,
        safe_areas TEXT,
        caution_areas TEXT,
        nearest_hospitals TEXT,
        emergency_tips TEXT
    );
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS alerts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        trip_id INTEGER,
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
