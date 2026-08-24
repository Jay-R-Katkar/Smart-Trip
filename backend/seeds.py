import json
import sqlite3
import os
import sys

sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))
from database import get_db_connection, init_db

def seed_database():
    """Populates the database with rich travel data for major cities."""
    init_db()
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT COUNT(*) FROM attractions")
    if cursor.fetchone()[0] > 0:
        conn.close()
        return

    # Attractions
    attractions = [
        # Paris
        ("Paris", "Eiffel Tower", "Monument", 32.0, 2.5, 4.8, 48.8584, 2.2945, "09:00 - 23:45", "High (Sunset Peak)", "Iconic wrought-iron lattice tower on the Champ de Mars.", "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=600"),
        ("Paris", "Louvre Museum", "Culture", 22.0, 3.5, 4.7, 48.8606, 2.3376, "09:00 - 18:00", "High (Morning Peak)", "World's largest art museum housing Mona Lisa.", "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=600"),
        ("Paris", "Cathédrale Notre-Dame", "Historical", 0.0, 1.5, 4.7, 48.8529, 2.3500, "08:00 - 18:45", "Moderate", "Gothic masterpiece on Île de la Cité.", "https://images.unsplash.com/photo-1549144511-f099e773c147?w=600"),
        ("Paris", "Montmartre & Sacré-Cœur", "Sightseeing", 0.0, 2.5, 4.6, 48.8867, 2.3431, "06:00 - 22:30", "Moderate", "Hilltop artists quarter with stunning views.", "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600"),
        
        # Tokyo
        ("Tokyo", "Shibuya Crossing", "Sightseeing", 0.0, 1.5, 4.8, 35.6595, 139.7004, "24 Hours", "High (Evening)", "World's busiest pedestrian crossing.", "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=600"),
        ("Tokyo", "Sensō-ji Temple", "Culture", 0.0, 2.5, 4.7, 35.7148, 139.7967, "06:00 - 17:00", "High (Midday)", "Tokyo's oldest Buddhist temple in Asakusa.", "https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?w=600"),
        
        # Goa
        ("Goa", "Baga & Calangute Beach", "Relaxation", 0.0, 3.5, 4.5, 15.5553, 73.7517, "24 Hours", "High (Evening)", "Vibrant North Goa beach with shacks and water sports.", "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600"),
        ("Goa", "Fort Aguada", "Historical", 2.0, 2.0, 4.6, 15.4926, 73.7737, "09:30 - 18:00", "Moderate", "17th-century Portuguese fortress overlooking Arabian Sea.", "https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?w=600"),

        # Dubai
        ("Dubai", "Burj Khalifa & Deck", "Sightseeing", 45.0, 2.5, 4.8, 25.1972, 55.2744, "08:30 - 23:00", "High (Sunset)", "The tallest building in the world at 828 meters.", "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600")
    ]

    for att in attractions:
        cursor.execute("""
        INSERT INTO attractions (city, name, category, cost, duration, rating, latitude, longitude, opening_hours, crowd_pattern, description, image_url)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, att)

    # Hotels
    hotels = [
        ("Le Grand Quartier", "Paris", 145.0, 4.6, 4, 48.8741, 2.3611, "Free WiFi, Rooftop Bar, Breakfast, AC", "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600", json.dumps({"Booking.com": 145, "Agoda": 139, "Expedia": 152, "Direct": 142})),
        ("Hôtel Eiffel Rive Gauche", "Paris", 98.0, 4.2, 3, 48.8570, 2.3015, "Free WiFi, Eiffel Views, Breakfast", "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600", json.dumps({"Booking.com": 98, "Agoda": 95, "Expedia": 104, "Direct": 96})),
        ("Shinjuku Granbell Hotel", "Tokyo", 115.0, 4.5, 4, 35.6961, 139.7065, "Free WiFi, Sky Lounge, Subway Access", "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=600", json.dumps({"Booking.com": 115, "Agoda": 108, "Expedia": 120, "Direct": 112})),
        ("Taj Exotica Resort & Spa", "Goa", 190.0, 4.8, 5, 15.2530, 73.9270, "Private Beach, Mediterranean Architecture, Golf Course", "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600", json.dumps({"Booking.com": 190, "Agoda": 182, "Expedia": 200, "Direct": 185})),
        ("Rove Downtown Dubai", "Dubai", 85.0, 4.6, 3, 25.2010, 55.2815, "Burj Khalifa Views, Outdoor Pool, Cinema", "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=600", json.dumps({"Booking.com": 85, "Agoda": 80, "Expedia": 92, "Direct": 82}))
    ]

    for hotel in hotels:
        cursor.execute("""
        INSERT INTO hotels (name, city, price, rating, stars, latitude, longitude, amenities, image_url, comparison_prices)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, hotel)

    # Flights
    flights = [
        ("New York", "Paris", "Air France", "AF-007", "18:30", "07:45 (+1)", "7h 15m", 540.0, 0),
        ("London", "Paris", "British Airways", "BA-308", "08:15", "10:35", "1h 20m", 89.0, 0),
        ("Mumbai", "Goa", "IndiGo", "6E-512", "11:20", "12:35", "1h 15m", 55.0, 0),
        ("New York", "Tokyo", "Japan Airlines", "JL-005", "11:45", "15:20 (+1)", "14h 35m", 890.0, 0)
    ]

    for f in flights:
        cursor.execute("""
        INSERT INTO flights (origin, destination, airline, flight_number, departure_time, arrival_time, duration, price, stops)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, f)

    # Guides
    guides = [
        ("Claire Dupont", "Paris", 4.9, "English, French, Spanish", "Art & Architecture History, Hidden Parisian Cafes", 35.0, 220.0, "Available Today", 1, "+33 6 12 34 56 78", "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300", "Certified tour guide and art historian."),
        ("Kenji Takahashi", "Tokyo", 5.0, "English, Japanese", "Anime & Tech Culture, Shinto Heritage, Street Food", 38.0, 240.0, "Available Today", 1, "+81 90 1234 5678", "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300", "Tokyo native passionate about temple traditions and tech."),
        ("Savio Fernandes", "Goa", 4.9, "English, Hindi, Portuguese", "Portuguese Heritage Mansions, Backwater Kayaking", 15.0, 90.0, "Available Today", 1, "+91 9822 123456", "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300", "Heritage enthusiast sharing untold stories of Goa.")
    ]

    for g in guides:
        cursor.execute("""
        INSERT INTO guides (name, city, rating, languages, expertise, price_per_hour, price_per_day, availability, verified, phone, avatar_url, bio)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, g)

    # Safety records
    safety = [
        ("Paris", 88, "112 / 17", "112 / 15", "+33 1 43 17 53 53", "Marais, Saint-Germain, Latin Quarter", "Watch for pickpockets around Eiffel Tower", "Hôpital Hôtel-Dieu (+33 1 42 34 82 34)", "Keep wallets in front pockets; emergency SMS via 114."),
        ("Tokyo", 96, "110", "119", "+81 3 3201 3331", "Ginza, Asakusa, Shibuya, Shinjuku", "Kabukicho late night bars", "St. Luke's International Hospital (+81 3 3541 5151)", "Tokyo is one of the safest global cities; use Koban police boxes."),
        ("Goa", 86, "112 / 100", "112 / 108", "+91 832 2427972", "Panaji, Candolim, Benaulim", "Avoid swimming during high monsoon red flag tides", "Goa Medical College (+91 832 2458700)", "Tourist Police available across beaches."),
        ("Dubai", 95, "999", "998", "+971 800 4888", "Downtown, Marina, JBR, Palm Jumeirah", "Afternoon summer heat", "Rashid Hospital (+971 4 219 2000)", "Strict laws on public decency; dial 999 for police.")
    ]

    for s in safety:
        cursor.execute("""
        INSERT INTO safety_info (city, safety_score, police_number, ambulance_number, tourist_helpline, safe_areas, caution_areas, nearest_hospitals, emergency_tips)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, s)

    # Default Trip & Expenses
    cursor.execute("""
    INSERT INTO trips (id, user_id, title, destination, start_date, end_date, days, budget, travel_style, itinerary)
    VALUES (1, 1, 'Paris Explorer', 'Paris', '2026-09-10', '2026-09-12', 3, 1200.0, 'Cultural Heritage', '{"days": 3}')
    """)

    sample_expenses = [
        (1, "Hôtel Eiffel Rive Gauche", 196.0, "Accommodation", "2026-09-10", "Prepaid room"),
        (1, "Eiffel Tower Tickets x2", 64.0, "Activities", "2026-09-10", "Summit tickets"),
        (1, "Bistro Le Marais Dinner", 78.5, "Food", "2026-09-10", "Dinner"),
        (1, "Navigo Metro Passes", 25.0, "Transport", "2026-09-11", "Zones 1-2")
    ]

    for exp in sample_expenses:
        cursor.execute("""
        INSERT INTO expenses (trip_id, title, amount, category, date, notes)
        VALUES (?, ?, ?, ?, ?, ?)
        """, exp)

    conn.commit()
    conn.close()

if __name__ == '__main__':
    seed_database()