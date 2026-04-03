"""
Crisis risk triage module.
Detects high-risk language and routes to appropriate helplines.
This is a SAFETY-FIRST module — conservative thresholds by design.
"""

CRISIS_KEYWORDS = [
    "end my life", "want to die", "kill myself", "no reason to live",
    "suicide", "suicidal", "self harm", "hurt myself", "not worth living",
    "better off dead", "can't go on", "give up on life", "ending it all",
    "don't want to exist", "no point living", "खुद को नुकसान",  # Hindi
    "जीना नहीं चाहता", "मरना चाहता हूं"
]

HIGH_RISK_EMOTIONS = ["sadness", "fear", "anger"]

HELPLINES = [
    {
        "name": "iCall (TISS)",
        "number": "9152987821",
        "hours": "Mon–Sat, 8am–10pm",
        "description": "Professional counseling by trained psychologists",
        "website": "icallhelpline.org"
    },
    {
        "name": "Vandrevala Foundation",
        "number": "1860-2662-345",
        "hours": "24/7",
        "description": "Free mental health support, 24 hours",
        "website": "vandrevalafoundation.com"
    },
    {
        "name": "Tele-MANAS (Govt. of India)",
        "number": "14416",
        "hours": "24/7",
        "description": "National mental health helpline by Ministry of Health",
        "website": "nimhans.ac.in"
    },
    {
        "name": "NIMHANS",
        "number": "080-46110007",
        "hours": "Mon–Sat, 9am–1pm",
        "description": "National Institute of Mental Health & Neurosciences",
        "website": "nimhans.ac.in"
    },
    {
        "name": "Snehi",
        "number": "044-24640050",
        "hours": "Mon–Sat, 8am–10pm",
        "description": "Emotional support and suicide prevention",
        "website": "snehi.org"
    }
]


def assess_risk(text: str, phq9_score: int = None, emotion: str = None) -> dict:
    """
    Multi-factor risk assessment combining keyword detection,
    PHQ-9 score, and detected emotion.
    Returns risk level: low / moderate / high / crisis
    """
    text_lower = text.lower()

    # Keyword-based crisis detection
    keyword_crisis = any(kw in text_lower for kw in CRISIS_KEYWORDS)

    # Score-based risk
    score_crisis = phq9_score is not None and phq9_score >= 15
    score_high = phq9_score is not None and 10 <= phq9_score < 15

    # Emotion-based risk
    emotion_risk = emotion in HIGH_RISK_EMOTIONS

    if keyword_crisis or score_crisis:
        risk_level = "crisis"
        message = (
            "I'm really concerned about what you've shared. "
            "You don't have to face this alone — please reach out to one of these helplines right now. "
            "Trained counselors are available to help you."
        )
    elif score_high or (emotion_risk and score_high):
        risk_level = "high"
        message = (
            "Your responses suggest you're going through something really difficult. "
            "Speaking with a mental health professional can make a real difference. "
            "Here are some free resources available to you."
        )
    elif emotion_risk:
        risk_level = "moderate"
        message = (
            "It sounds like you're having a tough time. "
            "Would you like to try a quick calming exercise, or talk to someone?"
        )
    else:
        risk_level = "low"
        message = None

    return {
        "risk_level": risk_level,
        "message": message,
        "show_helplines": risk_level in ["crisis", "high"],
        "helplines": HELPLINES if risk_level in ["crisis", "high"] else [],
        "keyword_triggered": keyword_crisis,
        "score_triggered": score_crisis or score_high,
    }
