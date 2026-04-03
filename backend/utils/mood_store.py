"""
In-memory mood store for development.
In production, replace with Firebase Firestore or PostgreSQL.
"""

from datetime import datetime
from collections import defaultdict

# In-memory store: { session_id: [ {date, score, emotion, note}, ... ] }
_mood_store = defaultdict(list)


def log_mood(session_id: str, score: int, emotion: str, note: str = "") -> dict:
    """
    Log a mood entry for a session.
    score: 1-10 (user self-reported)
    emotion: detected or self-reported emotion
    """
    entry = {
        "id": f"{session_id}_{len(_mood_store[session_id])}",
        "date": datetime.now().strftime("%Y-%m-%d"),
        "time": datetime.now().strftime("%H:%M"),
        "score": score,
        "emotion": emotion,
        "note": note,
        "timestamp": datetime.now().isoformat()
    }
    _mood_store[session_id].append(entry)
    return entry


def get_mood_history(session_id: str) -> list:
    """Return all mood entries for a session."""
    return _mood_store.get(session_id, [])


def get_mood_summary(session_id: str) -> dict:
    """Return summary stats for mood history."""
    history = _mood_store.get(session_id, [])
    if not history:
        return {"message": "No mood data yet. Start logging your mood daily!"}

    scores = [e["score"] for e in history]
    emotions = [e["emotion"] for e in history]

    avg_score = round(sum(scores) / len(scores), 1)
    most_common_emotion = max(set(emotions), key=emotions.count)

    trend = "stable"
    if len(scores) >= 3:
        recent = scores[-3:]
        if recent[-1] > recent[0]:
            trend = "improving"
        elif recent[-1] < recent[0]:
            trend = "declining"

    return {
        "total_entries": len(history),
        "average_score": avg_score,
        "most_common_emotion": most_common_emotion,
        "trend": trend,
        "last_entry": history[-1] if history else None,
        "history": history[-7:]  # last 7 days
    }
