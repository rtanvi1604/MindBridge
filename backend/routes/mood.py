from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from utils.mood_store import log_mood, get_mood_history, get_mood_summary

router = APIRouter()


class MoodLogRequest(BaseModel):
    session_id: str = "default"
    score: int       # 1–10 self-reported
    emotion: str     # user selected or AI detected
    note: str = ""


@router.post("/log")
async def log_mood_entry(req: MoodLogRequest):
    """Log a daily mood entry."""
    if not 1 <= req.score <= 10:
        raise HTTPException(status_code=400, detail="Score must be between 1 and 10")

    entry = log_mood(
        session_id=req.session_id,
        score=req.score,
        emotion=req.emotion,
        note=req.note
    )
    return {"success": True, "entry": entry}


@router.get("/history/{session_id}")
async def mood_history(session_id: str):
    """Get mood history for a session."""
    history = get_mood_history(session_id)
    return {"session_id": session_id, "entries": history, "count": len(history)}


@router.get("/summary/{session_id}")
async def mood_summary(session_id: str):
    """Get mood summary and trend analysis."""
    return get_mood_summary(session_id)
