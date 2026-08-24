import pytest
import json
import os
import sys
from flask import Flask

# Ensure backend directory is on sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from routes import (
    itinerary_bp,
    hotels_flights_bp,
    budget_bp,
    alerts_bp,
    guides_bp,
    safety_bp,
    trips_bp
)
from database import init_db
from seeds import seed_database

@pytest.fixture
def client(tmp_path):
    """Creates a test client with a fresh temporary test database."""
    test_db = str(tmp_path / "test_smarttrip.db")
    os.environ['DATABASE_PATH'] = test_db
    
    # Initialize and seed temporary test database
    seed_database(test_db)

    app = Flask(__name__)
    app.config['TESTING'] = True
    app.config['DATABASE_PATH'] = test_db

    # Register all 6 module blueprints
    app.register_blueprint(itinerary_bp)
    app.register_blueprint(hotels_flights_bp)
    app.register_blueprint(budget_bp)
    app.register_blueprint(alerts_bp)
    app.register_blueprint(guides_bp)
    app.register_blueprint(safety_bp)
    app.register_blueprint(trips_bp)

    with app.test_client() as client:
        yield client

def test_get_destinations(client):
    """Test getting supported destinations."""
    response = client.get('/api/destinations')
    assert response.status_code == 200
    data = response.get_json()
    assert data['success'] is True
    assert len(data['destinations']) >= 8
    cities = [d['city'] for d in data['destinations']]
    assert "Paris" in cities
    assert "Tokyo" in cities

def test_generate_itinerary(client):
    """Test Module 1: Itinerary generation logic with 3-day plan."""
    payload = {
        "destination": "Paris",
        "days": 3,
        "budget": 1500.0,
        "travel_style": "Culture"
    }
    response = client.post('/api/itinerary', json=payload)
    assert response.status_code == 200
    data = response.get_json()
    assert data['success'] is True
    assert data['days'] == 3
    assert len(data['days_plan']) == 3
    assert data['summary']['total_attractions'] > 0

def test_hotels_search_and_comparison(client):
    """Test Module 2: Hotels search and multi-platform comparison."""
    response = client.get('/api/hotels?city=Paris')
    assert response.status_code == 200
    data = response.get_json()
    assert data['success'] is True
    assert len(data['hotels']) > 0
    hotel = data['hotels'][0]
    assert 'comparison_prices' in hotel
    assert 'best_deal' in hotel

def test_flight_search(client):
    """Test flight search comparison."""
    response = client.get('/api/flights?origin=New%20York&destination=Paris')
    assert response.status_code == 200
    data = response.get_json()
    assert data['success'] is True
    assert len(data['flights']) > 0

def test_budget_tracking_and_80_percent_alert(client):
    """Test Module 3: Budget tracking with 80% threshold detection."""
    # Check initial budget
    response = client.get('/api/budget/1')
    assert response.status_code == 200
    data = response.get_json()
    assert data['success'] is True
    assert 'percentage_spent' in data
    assert 'category_breakdown' in data

    # Add expense to push over 80% threshold (budget is 1200, current spent ~594, adding 450 pushes to >80%)
    exp_payload = {
        "trip_id": 1,
        "title": "Luxury Dining Experience",
        "amount": 450.0,
        "category": "Food",
        "date": "2026-09-11"
    }
    post_res = client.post('/api/expenses', json=exp_payload)
    assert post_res.status_code == 201
    post_data = post_res.get_json()
    assert post_data['updated_budget_status']['percentage_spent'] >= 80.0
    assert post_data['updated_budget_status']['threshold_alert'] is not None

def test_smart_alerts(client):
    """Test Module 4: Smart alerts with live weather and crowd alerts."""
    response = client.get('/api/alerts?city=Tokyo')
    assert response.status_code == 200
    data = response.get_json()
    assert data['success'] is True
    assert 'live_weather' in data
    assert len(data['alerts']) > 0

def test_guide_matching_and_booking(client):
    """Test Module 5: Guide search and voucher generation."""
    response = client.get('/api/guides?city=Paris&language=English')
    assert response.status_code == 200
    data = response.get_json()
    assert data['success'] is True
    assert len(data['guides']) > 0
    guide_id = data['guides'][0]['id']

    # Book the guide
    book_payload = {
        "guide_id": guide_id,
        "trip_id": 1,
        "date": "2026-09-12",
        "hours": 3,
        "traveler_name": "Alex Mercer"
    }
    book_res = client.post('/api/guides/book', json=book_payload)
    assert book_res.status_code == 201
    voucher = book_res.get_json()['voucher']
    assert voucher['status'] == "Confirmed"
    assert voucher['voucher_code'].startswith("GD-")

def test_safety_and_sos(client):
    """Test Module 6: Safety info and SOS dispatch."""
    response = client.get('/api/safety?city=Paris')
    assert response.status_code == 200
    data = response.get_json()
    assert data['success'] is True
    assert data['safety_info']['safety_score'] > 0

    # Test SOS trigger
    sos_payload = {
        "latitude": 48.8584,
        "longitude": 2.2945,
        "city": "Paris",
        "user_name": "Alex Mercer"
    }
    sos_res = client.post('/api/safety/sos', json=sos_payload)
    assert sos_res.status_code == 200
    sos_data = sos_res.get_json()
    assert sos_data['status'] == "DISPATCHED_TO_EMERGENCY_SERVICES"
    assert len(sos_data['emergency_responders_notified']) > 0
