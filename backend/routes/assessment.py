from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from models.phq9_scorer import score_phq9, score_gad7, get_phq9_questions, get_gad7_questions
from models.risk_classifier import assess_risk
from utils.cbt_recommender import recommend_exercises

router = APIRouter()


class PHQ9Request(BaseModel):
    answers: list[int]  # 9 integers, each 0-3
    session_id: str = "default"


class GAD7Request(BaseModel):
    answers: list[int]  # 7 integers, each 0-3
    session_id: str = "default"


@router.get("/phq9/questions")
async def get_phq9():
    """Return PHQ-9 questions with answer options."""
    return {
        "questionnaire": "PHQ-9",
        "description": "Patient Health Questionnaire — Depression Screening",
        "instructions": "Over the last 2 weeks, how often have you been bothered by any of the following problems?",
        "questions": get_phq9_questions()
    }


@router.post("/phq9/score")
async def submit_phq9(req: PHQ9Request):
    """Score PHQ-9 answers and return severity classification."""
    if len(req.answers) != 9:
        raise HTTPException(status_code=400, detail="PHQ-9 requires exactly 9 answers")
    if not all(0 <= a <= 3 for a in req.answers):
        raise HTTPException(status_code=400, detail="Each answer must be between 0 and 3")

    result = score_phq9(req.answers)

    # Risk assessment based on score
    risk = assess_risk(
        text="",
        phq9_score=result["total_score"],
        emotion="sadness" if result["total_score"] > 9 else "neutral"
    )

    # Get exercises based on severity
    exercises = []
    if result["total_score"] > 4:
        exercises = recommend_exercises("sadness", count=2)

    return {
        **result,
        "risk": risk,
        "exercises": exercises,
        "next_step": "Please discuss these results with a mental health professional." if result["total_score"] > 9 else "Continue monitoring your mood daily."
    }


@router.get("/gad7/questions")
async def get_gad7():
    """Return GAD-7 questions with answer options."""
    return {
        "questionnaire": "GAD-7",
        "description": "Generalized Anxiety Disorder Assessment",
        "instructions": "Over the last 2 weeks, how often have you been bothered by any of the following problems?",
        "questions": get_gad7_questions()
    }


@router.post("/gad7/score")
async def submit_gad7(req: GAD7Request):
    """Score GAD-7 answers and return anxiety severity."""
    if len(req.answers) != 7:
        raise HTTPException(status_code=400, detail="GAD-7 requires exactly 7 answers")
    if not all(0 <= a <= 3 for a in req.answers):
        raise HTTPException(status_code=400, detail="Each answer must be between 0 and 3")

    result = score_gad7(req.answers)
    exercises = recommend_exercises("fear", count=2)

    return {
        **result,
        "exercises": exercises,
        "next_step": "Please discuss these results with a mental health professional." if result["total_score"] > 9 else "Continue monitoring your mood daily."
    }
