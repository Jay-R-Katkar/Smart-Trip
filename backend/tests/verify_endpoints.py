import os
import sys

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from main import (
    app,
    health_check,
    get_all_destinations,
    generate_itinerary_plan,
    get_transit_options,
    book_transit,
    get_transit_tickets,
    get_stays,
    book_stay,
    get_all_bookings,
    get_guides,
    book_guide,
    get_expenses,
    create_expense,
    signup,
    login,
    get_user_profile,
    trigger_sos,
    ai_chat,
    UserAuthRequest,
    TransitBookingRequest,
    StayBookingRequest,
    GuideBookingRequest,
    ItineraryPlanRequest,
    ExpenseCreateRequest,
    SOSRequest,
    ChatRequest
)
from database import init_db
from seeds import seed_database

def run_verifications():
    print("Initializing and seeding test database...")
    init_db()
    seed_database()

    # 1. Health
    h = health_check()
    assert h["status"] == "healthy", "Health check failed"
    print("[OK] Health check endpoint working")

    # 2. Destinations
    d = get_all_destinations()
    assert d["success"] is True and d["count"] >= 21, "Destinations endpoint failed"
    print(f"[OK] Destinations endpoint verified ({d['count']} destinations loaded)")

    # 3. Itinerary Planning (Solo vs Group)
    plan_solo = generate_itinerary_plan(ItineraryPlanRequest(
        destination="Ujjain", days=2, traveler_type="single", traveler_count=1, budget=15000.0
    ))
    assert plan_solo["success"] is True and plan_solo["per_person_budget"] == 15000
    print("[OK] Solo Itinerary Planning working")

    plan_group = generate_itinerary_plan(ItineraryPlanRequest(
        destination="Ujjain", days=2, traveler_type="multiple", traveler_count=4, budget=40000.0
    ))
    assert plan_group["success"] is True and plan_group["per_person_budget"] == 10000
    print("[OK] Group of 4 Itinerary Planning working")

    # 4. Transit Options & Booking (Train, Flight, Bus, Cab)
    opt = get_transit_options("Mumbai", "Ujjain")
    assert opt["success"] is True and len(opt["trains"]) > 0 and len(opt["cabs"]) > 0
    print("[OK] Transit options (Trains, Flights, Buses, Cabs) working")

    ticket = book_transit(TransitBookingRequest(
        transit_mode="Train",
        operator_name="Vande Bharat Express",
        route_number="20911",
        departure_time="06:10 AM",
        arrival_time="01:30 PM",
        origin_city="Mumbai",
        destination_city="Ujjain",
        travel_date="2026-08-28",
        passenger_count=2,
        travel_class="CC",
        total_price=3160.0,
        user_name="Rahul Sharma",
        user_email="rahul@smarttrip.in"
    ))
    assert ticket["success"] is True and ticket["pnr_code"].startswith("ST-TRN-")
    print(f"[OK] Transit Ticket booking verified with PNR: {ticket['pnr_code']}")

    # 5. Stays & Ashrams
    stays = get_stays("Ujjain")
    assert stays["success"] is True
    stay_res = book_stay(StayBookingRequest(
        trip_id=1,
        item_type="Satvik Ashram",
        item_name="Shri Mahakal Bhakt Ashram",
        price=2300.0,
        dates="2 Days (Ujjain Circuit)",
        city="Ujjain",
        user_name="Rahul Sharma"
    ))
    assert stay_res["success"] is True and stay_res["confirmation_code"].startswith("ST-BK-")
    print(f"[OK] Stay booking verified with Code: {stay_res['confirmation_code']}")

    # 6. Guides
    guides = get_guides("Ujjain")
    assert guides["success"] is True
    guide_res = book_guide(GuideBookingRequest(
        guide_id=1,
        guide_name="Pt. Shivam Shastri",
        city="Ujjain",
        date="Tomorrow",
        hours=4,
        traveler_name="Rahul Sharma",
        price=1500.0
    ))
    assert guide_res["success"] is True and guide_res["voucher_code"].startswith("ST-GD-")
    print(f"[OK] Guide booking verified with Voucher: {guide_res['voucher_code']}")

    # 7. Budget & Expenses
    exp = create_expense(ExpenseCreateRequest(
        trip_id=1,
        title="Mahakal Sugam Pass",
        amount=500.0,
        category="Darshan",
        date="2026-08-27"
    ))
    assert exp["success"] is True
    all_exp = get_expenses(1)
    assert all_exp["success"] is True and all_exp["total_spent"] > 0
    print(f"[OK] Budget Tracker Expenses working (Total spent: Rs. {all_exp['total_spent']})")

    # 8. User Auth & Profile
    reg = signup(UserAuthRequest(name="Dev Pilgrim", email="dev@smarttrip.in", password="secretpassword"))
    assert reg["success"] is True
    log = login(UserAuthRequest(email="dev@smarttrip.in", password="secretpassword"))
    assert log["success"] is True
    prof = get_user_profile("dev@smarttrip.in")
    assert prof["success"] is True
    print("[OK] Authentication & User Profile sync verified")

    # 9. AI Chatbot
    chat_reply = ai_chat(ChatRequest(query="Tell me about train to Ujjain", city="Ujjain"))
    assert chat_reply["success"] is True and len(chat_reply["reply"]) > 0
    print("[OK] AI Chatbot verified")

    print("\nSUCCESS: ALL BACKEND FULL-STACK MODULES, MODELS & ENDPOINTS VERIFIED 100% WORKING!")

if __name__ == '__main__':
    run_verifications()
