import json
import sqlite3
import os
import sys

sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))
from database import get_db_connection, init_db

def seed_database():
    """Populates the database with rich travel data for all destinations."""
    init_db()
    conn = get_db_connection()
    cursor = conn.cursor()

    # Check if destinations already seeded
    cursor.execute("SELECT COUNT(*) FROM destinations")
    if cursor.fetchone()[0] > 0:
        conn.close()
        return

    # 1. 21 Verified Destinations
    destinations = [
        # Spiritual
        ("uj", "Ujjain", "Mahakaleshwar Jyotirlinga, Ram Ghat & Ancient Avanti", "Spiritual", "INR", 1000.0,
         "https://images.unsplash.com/photo-1548013146-72479768bada?w=800",
         json.dumps(["Mahakaleshwar Bhasma Aarti", "Harsiddhi Mata Shaktipeeth", "Ram Ghat Evening Kshipra Aarti", "Kal Bhairav Mandir Prasad", "Mangalnath Mandir Parikrama"]),
         23.1765, 75.7885),
        ("ay", "Ayodhya", "Ram Janmabhoomi, Kanak Bhawan & Saryu Aarti", "Spiritual", "INR", 1100.0,
         "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800",
         json.dumps(["Shri Ram Mandir Sanctum Darshan", "Hanuman Garhi Fort Ascent", "Kanak Bhawan Royal Darshan", "Saryu River Evening Deepotsav Aarti", "Ram Ki Paidi Ghat Parikrama"]),
         26.7922, 82.1998),
        ("var", "Varanasi", "Kashi Vishwanath, 84 Ghats & Subah-e-Banaras", "Spiritual", "INR", 1200.0,
         "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800",
         json.dumps(["Kashi Vishwanath Corridor Darshan", "Dashashwamedh Maha Aarti", "Sunrise Boat Cruise Assi to Manikarnika", "Sarnath Buddha Dhamekh Stupa", "Kal Bhairav & Sankat Mochan"]),
         25.3176, 82.9739),
        ("pur", "Puri", "Shree Jagannath Mahaprabhu & Golden Sea Beach", "Spiritual", "INR", 1000.0,
         "https://images.unsplash.com/photo-1620674156044-52b714665d46?w=800",
         json.dumps(["Jagannath Temple Patita Pavana Darshan", "Ananda Bazar 56 Bhog Mahaprasad", "Puri Golden Beach Sand Art & Sunset", "Gundicha Temple Heritage", "Chilika Lake Irrawaddy Dolphin Excursion"]),
         19.8135, 85.8312),
        ("amr", "Amritsar", "Golden Temple (Harmandir Sahib) & Wagah Border", "Spiritual", "INR", 900.0,
         "https://images.unsplash.com/photo-1514222134-b57cbb8ce073?w=800",
         json.dumps(["Harmandir Sahib Night Palki Sahib Sewa", "Guru Ka Langar Community Dining", "Jallianwala Bagh Historic Memorial", "Wagah Border Beating Retreat Ceremony", "Gobindgarh Fort Light & Sound Show"]),
         31.6340, 74.8723),
        ("som", "Somnath", "First Jyotirlinga on Arabian Sea Shore", "Spiritual", "INR", 1100.0,
         "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800",
         json.dumps(["Somnath Mahadev Sea-Facing Darshan", "Evening Ocean Sound & Light Show", "Bhalka Teerth Shri Krishna Parikrama", "Triveni Sangam Holy Snan", "Gita Mandir & Laxminarayan Temple"]),
         20.8880, 70.4012),
        ("tir", "Tirupati", "Sri Venkateswara Swamy Temple (Balaji Tirumala)", "Spiritual", "INR", 1300.0,
         "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800",
         json.dumps(["Tirumala Venkateswara VIP Darshan", "Srivari Laddu Prasadam Experience", "Alipiri Footpath Steps Pilgrimage Trek", "Kapila Theertham Waterfalls & Temple", "Sri Padmavathi Ammavari Temple"]),
         13.6288, 79.4192),
        ("ked", "Kedarnath", "Himalayan Jyotirlinga, Mandakini & Garhwal Peaks", "Spiritual", "INR", 2500.0,
         "https://images.unsplash.com/photo-1605649487212-47bdab064df8?w=800",
         json.dumps(["Kedarnath Jyotirlinga Morning Aarti", "Gaurikund to Kedarnath 16km Trek / Helicopter", "Bhairavnath Mandir Panoramic Ridge", "Mandakini River Ghat Meditation", "Gandhi Sarovar Alpine Glacier Trail"]),
         30.7352, 79.0669),

        # Heritage
        ("jai", "Jaipur", "Amer Fort, Hawa Mahal & Pink City Royal Circuit", "Heritage", "INR", 1400.0,
         "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800",
         json.dumps(["Amer Fort Elephant & Jeep Safari", "Hawa Mahal & City Palace Royal Museum", "Jantar Mantar Astronomical Observatory", "Nahargarh Fort Sunset Skyline View", "Chokhi Dhani Rajasthani Cultural Dinner"]),
         26.9124, 75.7873),
        ("agr", "Agra", "Taj Mahal, Agra Fort & Fatehpur Sikri", "Heritage", "INR", 1500.0,
         "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800",
         json.dumps(["Taj Mahal Sunrise White Marble Tour", "Agra Fort Red Sandstone Mughal Palaces", "Mehtab Bagh Moonlight River Reflection", "Fatehpur Sikri Buland Darwaza Excursion", "Sadar Bazar Petha & Marble Inlay Craft"]),
         27.1767, 78.0081),
        ("ham", "Hampi", "UNESCO Vijayanagara Ruins, Virupaksha & Stone Chariot", "Heritage", "INR", 1100.0,
         "https://images.unsplash.com/photo-1600100397608-f010f444f41a?w=800",
         json.dumps(["Virupaksha Temple Riverfront Heritage", "Vijaya Vittala Musical Pillars & Stone Chariot", "Matanga Hill 360-Degree Sunrise Panorama", "Coracle Boat Ride across Tungabhadra River", "Lotus Mahal & Elephant Stables"]),
         15.3350, 76.4600),
        ("kha", "Khajuraho", "UNESCO Chandela Sculptures & Light Show", "Heritage", "INR", 1200.0,
         "https://images.unsplash.com/photo-1600100397608-f010f444f41a?w=800",
         json.dumps(["Western Group Kandariya Mahadeva Temple", "Eastern Group Jain Temples Tour", "Sound and Light Evening Show", "Raneh Falls Canyons Excursion", "Panna National Park Tiger Buffer Drive"]),
         24.8318, 79.9199),
        ("uda", "Udaipur", "City Palace, Lake Pichola & Jagmandir Island", "Heritage", "INR", 1800.0,
         "https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?w=800",
         json.dumps(["City Palace Architectural Complex Tour", "Lake Pichola Sunset Boat Cruise", "Saheliyon Ki Bari Royal Gardens", "Bagore Ki Haveli Folk Dance & Puppet Show", "Sajjangarh Monsoon Palace Hilltop View"]),
         24.5854, 73.7125),

        # Nature & Eco-Resorts
        ("rish", "Rishikesh", "Ganga Aarti, Yoga Capital & River Rafting", "Nature", "INR", 1200.0,
         "https://images.unsplash.com/photo-1544717305-2782549b5136?w=800",
         json.dumps(["Triveni Ghat Evening Maha Aarti", "White Water River Rafting Marine Drive", "Beatles Ashram Spiritual Wall Murals", "Neelkanth Mahadev Mountain Temple", "Bungee Jumping & Cliff Jumping Mohan Chatti"]),
         30.0869, 78.2676),
        ("man", "Manali", "Rohtang Pass, Solang Valley & Old Manali Cafes", "Nature", "INR", 1500.0,
         "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800",
         json.dumps(["Solang Valley Paragliding & Zorbing", "Rohtang Pass Snow Glacier Excursion", "Hadimba Devi Ancient Pine Forest Mandir", "Old Manali Hippie Cafes & Live Music", "Atal Tunnel & Sissu Valley Drive"]),
         32.2432, 77.1892),
        ("lad", "Ladakh", "Pangong Tso, Nubra Valley & Khardung La Pass", "Nature", "INR", 2200.0,
         "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?w=800",
         json.dumps(["Pangong Tso High Altitude Blue Lake", "Nubra Valley Hunder Double-Humped Camels", "Khardung La Pass 18,380ft Summit", "Thiksey & Hemis Ancient Monasteries", "Magnetic Hill & Indus Zanskar Confluence"]),
         34.1526, 77.5771),
        ("goa", "Goa", "Sun-Kissed Beaches, Portuguese Forts & Cruise", "Nature", "INR", 1800.0,
         "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800",
         json.dumps(["Baga & Calangute Beach Water Sports", "Fort Aguada & Chapora Fort Sunset", "Basilica of Bom Jesus Old Goa UNESCO", "Mandovi River Evening Luxury Cruise", "Dudhsagar Waterfalls Jungle Safari"]),
         15.2993, 74.1240),

        # International
        ("dub", "Dubai", "Burj Khalifa, Desert Safari & Palm Jumeirah", "International", "AED", 7000.0,
         "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800",
         json.dumps(["Burj Khalifa 124th Floor Observation Deck", "Red Dune Desert Safari & BBQ Dinner", "Dubai Mall & Fountain Dancing Show", "Dubai Marina Luxury Dhow Cruise", "Museum of the Future Architectural Tour"]),
         25.2048, 55.2708),
        ("swi", "Switzerland", "Jungfraujoch, Mount Titlis & Lucerne Lake", "International", "CHF", 15000.0,
         "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=800",
         json.dumps(["Jungfraujoch Top of Europe Glacier Train", "Titlis Rotair Revolving Cable Car", "Lake Lucerne Steam Boat Panoramic Cruise", "Interlaken Adventure Paragliding", "Zermatt Matterhorn Glacier Paradise"]),
         46.8182, 8.2275),
        ("bal", "Bali", "Ubud Rice Terraces, Tanah Lot & Nusa Penida", "International", "USD", 3500.0,
         "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800",
         json.dumps(["Tanah Lot Ocean Cliff Sunset Temple", "Ubud Tegallalang Rice Terrace & Bali Swing", "Uluwatu Temple Kecak Fire Dance", "Nusa Penida Kelingking T-Rex Beach Trip", "Mount Batur Sunrise Volcano Trek"]),
         -8.4095, 115.1889),
        ("tok", "Tokyo", "Shibuya Crossing, Mount Fuji & Shinto Temples", "International", "USD", 8500.0,
         "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800",
         json.dumps(["Shibuya Crossing & Sky High Observation", "Sensō-ji Temple & Asakusa Traditional Market", "Mount Fuji 5th Station Day Tour", "Akihabara Tech & Anime Wonderland", "TeamLab Planets Immersive Digital Art"]),
         35.6762, 139.6503),
        ("par", "Paris", "Eiffel Tower, Louvre Museum & Seine River Cruise", "International", "EUR", 10000.0,
         "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800",
         json.dumps(["Eiffel Tower Summit Panoramic Ascent", "Louvre Museum Mona Lisa Art Tour", "Seine River Evening Illumination Cruise", "Montmartre & Sacré-Cœur Artists Hill", "Palace of Versailles Hall of Mirrors"]),
         48.8566, 2.3522)
    ]

    for d in destinations:
        cursor.execute("""
        INSERT INTO destinations (id, name, title, category, default_currency, min_daily_rate, image, activities, latitude, longitude)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, d)

    # 2. Verified Guides Seed
    guides = [
        ("Pt. Shivam Shastri", "Ujjain", 4.9, 340, "Hindi, Sanskrit, Gujarati", "Bhasma Aarti Vidhi, Jyotirlinga Mahatmya & Sanskrit Rituals", 1500.0, "+91 98260 11223", "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400", "Gold medalist Sanskrit Acharya with 14 years serving Mahakal pilgrims."),
        ("Acharya Anand Tripathi", "Ayodhya", 5.0, 410, "Hindi, Awadhi, English", "Ramcharitmanas Recitation, Temple History & Saryu Parikrama", 1600.0, "+91 94150 44556", "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400", "Vedic scholar blessed by Ayodhya Peeth with deep insights into Ramayana circuits."),
        ("Vedic Murari Mishra", "Varanasi", 4.9, 520, "Hindi, English, Bengali", "Ghat Heritage, Corridor Architecture & Subah-e-Banaras", 1800.0, "+91 98390 77889", "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400", "7th generation Kashi teerth purohit guiding pilgrims through Vishwanath corridors."),
        ("Pt. Jagabandhu Panda", "Puri", 4.8, 290, "Odia, Hindi, Bengali", "Jagannath Temple Chhatisa Nijoga Customs & 56 Bhog Secrets", 1400.0, "+91 94370 22334", "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400", "Servitor Panda guiding yatris for Mahaprasad and temple traditions.")
    ]

    for g in guides:
        cursor.execute("""
        INSERT INTO guides (name, city, rating, reviews, languages, expertise, price_per_day, phone, avatar_url, bio)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, g)

    # 3. Default User
    cursor.execute("""
    INSERT OR IGNORE INTO users (id, name, email, password, role, travel_interest, saved_trips)
    VALUES (1, 'Rahul Sharma', 'rahul.sharma@smarttrip.in', 'password123', 'VIP Pilgrim', 'Spiritual', 4)
    """)

    # 4. Sample Booked Transit Ticket
    cursor.execute("""
    INSERT OR IGNORE INTO transit_tickets (id, user_id, pnr_code, transit_mode, operator_name, route_number, origin_city, destination_city, departure_time, arrival_time, travel_date, passenger_count, travel_class, total_price, status)
    VALUES (1, 1, 'ST-TRN-8821', 'Train', 'Vande Bharat Express (IRCTC)', '20911', 'Mumbai', 'Ujjain', '06:10 AM', '01:30 PM', '2026-08-28', 1, '3A (3-Tier AC)', 1680.0, 'Confirmed')
    """)

    # 5. Sample Booked Stay
    cursor.execute("""
    INSERT OR IGNORE INTO bookings (id, trip_id, user_id, item_type, item_name, city, dates, price, status, confirmation_code, guest_name)
    VALUES (1, 1, 1, 'Satvik Ashram', 'Shri Mahakal Bhakt Ashram', 'Ujjain', '2 Days (Ujjain Circuit)', 2300.0, 'Confirmed', 'ST-BK-7492', 'Rahul Sharma')
    """)

    # 6. Sample Initial Expenses
    sample_expenses = [
        (1, 1, 1, 'Shri Mahakal Bhakt Ashram (2 Nights)', 2300.0, 'Stay', '2026-08-27', 'Satvik AC Room'),
        (2, 1, 1, 'Vande Bharat Express Ticket (Mumbai -> Ujjain)', 1680.0, 'Transport', '2026-08-27', 'PNR: ST-TRN-8821'),
        (3, 1, 1, 'Mahakal Sugam Darshan Pass x2', 500.0, 'Darshan', '2026-08-27', 'VIP Entry'),
        (4, 1, 1, 'Satvik Thali & Mahaprasad', 380.0, 'Food', '2026-08-27', 'Annakshetra Bhojan')
    ]

    for exp in sample_expenses:
        cursor.execute("""
        INSERT OR IGNORE INTO expenses (id, trip_id, user_id, title, amount, category, date, notes)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, exp)

    conn.commit()
    conn.close()

if __name__ == '__main__':
    seed_database()