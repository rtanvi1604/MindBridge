"""
Basic API tests for MindBridge backend.
Run with: pytest tests/
"""
import pytest
from fastapi.testclient import TestClient
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'backend'))

from app import app

client = TestClient(app)


def test_root():
    r = client.get("/")
    assert r.status_code == 200
    assert r.json()["status"] == "healthy"


def test_health():
    r = client.get("/health")
    assert r.status_code == 200


def test_phq9_questions():
    r = client.get("/api/assess/phq9/questions")
    assert r.status_code == 200
    data = r.json()
    assert len(data["questions"]) == 9


def test_phq9_score_minimal():
    r = client.post("/api/assess/phq9/score", json={"answers": [0]*9})
    assert r.status_code == 200
    data = r.json()
    assert data["severity"] == "Minimal"
    assert data["total_score"] == 0


def test_phq9_score_severe():
    r = client.post("/api/assess/phq9/score", json={"answers": [3]*9})
    assert r.status_code == 200
    data = r.json()
    assert data["severity"] == "Severe"
    assert data["total_score"] == 27


def test_phq9_score_invalid():
    r = client.post("/api/assess/phq9/score", json={"answers": [0]*5})
    assert r.status_code == 400


def test_gad7_questions():
    r = client.get("/api/assess/gad7/questions")
    assert r.status_code == 200
    assert len(r.json()["questions"]) == 7


def test_mood_log():
    r = client.post("/api/mood/log", json={
        "session_id": "test_session",
        "score": 7,
        "emotion": "joy",
        "note": "Feeling good today"
    })
    assert r.status_code == 200
    assert r.json()["success"] is True


def test_mood_summary():
    r = client.get("/api/mood/summary/test_session")
    assert r.status_code == 200


def test_chat_basic():
    r = client.post("/api/chat/", json={
        "message": "I feel a bit sad today",
        "session_id": "test_chat"
    })
    assert r.status_code == 200
    data = r.json()
    assert "reply" in data
    assert "emotion" in data
    assert "risk_level" in data


def test_chat_crisis_keyword():
    r = client.post("/api/chat/", json={
        "message": "I want to end my life",
        "session_id": "test_crisis"
    })
    assert r.status_code == 200
    data = r.json()
    assert data["risk_level"] == "crisis"
    assert data["show_crisis_banner"] is True
    assert len(data["helplines"]) > 0
