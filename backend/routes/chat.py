from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional

from models.sentiment_model import analyze_emotion, get_mood_context
from models.risk_classifier import assess_risk
from utils.cbt_recommender import recommend_exercises
from utils.llm_response import generate_llm_response
router = APIRouter()

# In-memory session storage
_session_turns = {}
_session_history = {}


class ChatRequest(BaseModel):
    message: str
    session_id: str = "default"
    phq9_done: bool = False
    phq9_score: Optional[int] = None


class ChatResponse(BaseModel):
    reply: str
    emotion: str
    emotion_emoji: str
    risk_level: str
    suggest_assessment: bool
    suggest_exercise: bool
    exercises: list = []
    helplines: list = []
    show_crisis_banner: bool = False


@router.post("/", response_model=ChatResponse)
async def chat(req: ChatRequest):

    if not req.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty")

    # -------------------------------
    # 1. Track conversation turns
    # -------------------------------
    turn = _session_turns.get(req.session_id, 0) + 1
    _session_turns[req.session_id] = turn

    # -------------------------------
    # 2. Maintain conversation history
    # -------------------------------
    history = _session_history.get(req.session_id, [])

    history.append({
        "role": "user",
        "content": req.message
    })

    # -------------------------------
    # 3. Analyze emotion
    # -------------------------------
    emotion_result = analyze_emotion(req.message)
    emotion = emotion_result.get("top_emotion", "neutral")
    mood_ctx = get_mood_context(emotion)

    # -------------------------------
    # 4. Risk assessment
    # -------------------------------
    risk = assess_risk(
        text=req.message,
        phq9_score=req.phq9_score,
        emotion=emotion
    )

    # -------------------------------
    # 5. Generate response (WITH MEMORY)
    # -------------------------------
    response = generate_llm_response(
        user_message=req.message,
        emotion=emotion,
        risk_level=risk["risk_level"],
        history=history
    )

    # -------------------------------
    # 6. Store AI response in history
    # -------------------------------
    history.append({
        "role": "ai",
        "content": response["message"]
    })

    _session_history[req.session_id] = history

    # -------------------------------
    # 7. Recommend exercises
    # -------------------------------
    exercises = []
    if response.get("suggest_exercise"):
        exercises = recommend_exercises(emotion, count=1)

    # -------------------------------
    # 8. Return response
    # -------------------------------
    return ChatResponse(
        reply=response["message"],
        emotion=emotion,
        emotion_emoji=mood_ctx["emoji"],
        risk_level=risk["risk_level"],
        suggest_assessment=response.get("suggest_assessment", False),
        suggest_exercise=response.get("suggest_exercise", False),
        exercises=exercises,
        helplines=risk.get("helplines", []),
        show_crisis_banner=risk["risk_level"] == "crisis"
    )


# -------------------------------
# Reset session (FIXED)
# -------------------------------
@router.get("/session/{session_id}/reset")
async def reset_session(session_id: str):
    _session_turns.pop(session_id, None)
    _session_history.pop(session_id, None)   # ✅ IMPORTANT FIX
    return {"message": f"Session {session_id} reset"}