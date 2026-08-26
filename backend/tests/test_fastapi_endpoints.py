import pytest
import os
import sys
from fastapi.testclient import TestClient

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from main import app
from database import init_db
from seeds import seed_database

@pytest.fixture(scope="module")
def client():
    init_db()
    seed_database()
    with TestClient(app) as test_client:
        yield test_client

def test_health(client):
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_get_destinations(client):
    response = client.get("/api/destinations")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["count"] >= 21
    names = [d["name"] for d in data["destinations"]]
    assert "Ujjain" in names
    assert "Kedarnath" in names
    assert "Puri" in names
    assert "Hampi" in names

def test_itinerary_planning_single_vs_group(client):
    # 1. Solo Traveler
    solo_res = client.post("/api/itinerary/plan", json={
        "destination": "Ujjain",
        "days": 2,
        "traveler_type": "single",
        "traveler_count": 1,
        "budget": 15000.0
    })
    assert solo_res.status_code == 200
    solo_data = solo_res.json()
    assert solo_data["success"] is True
    assert solo_data["per_person_budget"] == 15000
    assert len(solo_data["schedule"]) == 2

    # 2. Group of 4 Travelers
    group_res = client.post("/api/itinerary/plan", json={
        "destination": "Ujjain",
        "days": 2,
        "traveler_type": "multiple",
        "traveler_count": 4,
        "budget": 40000.0
    })
    assert group_res.status_code == 200
    group_data = group_res.json()
    assert group_data["success"] is True
    assert group_data["per_person_budget"] == 10000
    assert group_data["traveler_count"] == 4

def test_transit_options_and_booking(client):
    # 1. Fetch transit options
    options_res = client.get("/api/transit/options?origin=Mumbai&destination=Ujjain")
    assert options_res.status_code == 200
    options_data = options_res.json()
    assert options_data["success"] is True
    assert len(options_data["trains"]) > 0
    assert len(options_data["flights"]) > 0
    assert len(options_data["buses"]) > 0
    assert len(options_data["cabs"]) > 0

    # 2. Book a Vande Bharat Train Ticket
    book_res = client.post("/api/transit/book", json={
        "transit_mode": "Train",
        "operator_name": "Vande Bharat Express",
        "route_number": "20911",
        "departure_time": "06:10 AM",
        "arrival_time": "01:30 PM",
        "origin_city": "Mumbai",
        "destination_city": "Ujjain",
        "travel_date": "2026-08-28",
        "passenger_count": 2,
        "travel_class": "CC (Chair Car)",
        "total_price": 3160.0,
        "user_name": "Rahul Sharma",
        "user_email": "rahul.sharma@smarttrip.in"
    })
    assert book_res.status_code == 200
    book_data = book_res.json()
    assert book_data["success"] is True
    assert book_data["pnr_code"].startswith("ST-TRN-")
    assert book_data["passenger_count"] == 2

def test_stays_and_booking(client):
    # 1. Fetch stays
    stays_res = client.get("/api/stays?city=Ujjain")
    assert stays_res.status_code == 200
    assert stays_res.json()["success"] is True

    # 2. Book a stay
    book_stay_res = client.post("/api/stays/book", json={
        "trip_id": 1,
        "item_type": "Satvik Ashram",
        "item_name": "Shri Mahakal Bhakt Ashram",
        "price": 2300.0,
        "dates": "2 Days (Ujjain Circuit)",
        "city": "Ujjain",
        "user_name": "Rahul Sharma"
    })
    assert book_stay_res.status_code == 200
    assert book_stay_res.json()["success"] is True
    assert book_stay_res.json()["confirmation_code"].startswith("ST-BK-")

def test_guides_and_booking(client):
    guides_res = client.get("/api/guides?city=Ujjain")
    assert guides_res.status_code == 200
    assert guides_res.json()["success"] is True

    book_guide_res = client.post("/api/guides/book", json={
        "guide_id": 1,
        "guide_name": "Pt. Shivam Shastri",
        "city": "Ujjain",
        "date": "Tomorrow",
        "hours": 4,
        "traveler_name": "Rahul Sharma",
        "price": 1500.0
    })
    assert book_guide_res.status_code == 200
    assert book_guide_res.json()["success"] is True
    assert book_guide_res.json()["voucher_code"].startswith("ST-GD-")

def test_budget_expenses_crud(client):
    exp_res = client.post("/api/budget/expenses", json={
        "trip_id": 1,
        "title": "Mahakal Prasad & Souvenir",
        "amount": 450.0,
        "category": "Darshan",
        "date": "2026-08-27"
    })
    assert exp_res.status_code == 200
    assert exp_res.json()["success"] is True

    list_res = client.get("/api/budget/expenses?trip_id=1")
    assert list_res.status_code == 200
    assert list_res.json()["count"] > 0

def test_auth_and_profile(client):
    signup_res = client.post("/api/auth/signup", json={
        "name": "Test Pilgrim",
        "email": "test.pilgrim@smarttrip.in",
        "password": "testpassword",
        "travel_interest": "Spiritual"
    })
    assert signup_res.status_code == 200
    assert signup_res.json()["success"] is True

    login_res = client.post("/api/auth/login", json={
        "email": "test.pilgrim@smarttrip.in",
        "password": "testpassword"
    })
    assert login_res.status_code == 200
    assert login_res.json()["success"] is True
    assert login_res.json()["user"]["name"] == "Test Pilgrim"
