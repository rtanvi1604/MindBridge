"""
AI response generator for the mental health chat interface.
Upgraded: Context-aware + non-repetitive responses
"""

import random

EMPATHY_OPENERS = {
    "sadness": [
        "I hear you. Feeling sad is really hard, and it takes courage to express it.",
        "Thank you for sharing that with me. What you're feeling is completely valid.",
        "That sounds really painful. I'm here with you.",
    ],
    "fear": [
        "It's okay to feel scared. Anxiety can feel overwhelming, but you're not alone.",
        "I understand. That sounds really stressful.",
        "Fear can be exhausting. Let's take this step by step.",
    ],
    "anger": [
        "Your frustration makes sense. It's okay to feel angry.",
        "I hear that you're upset. That's completely valid.",
        "Anger often comes from something that really matters to us.",
    ],
    "joy": [
        "That's wonderful to hear! I'm really glad you're feeling positive.",
        "That sounds like a good moment — hold onto it.",
    ],
    "neutral": [
        "I'm here and listening. Tell me more.",
        "I appreciate you sharing that.",
    ]
}

FOLLOW_UP_QUESTIONS = [
    "How long have you been feeling this way?",
    "What do you think is causing this feeling?",
    "Have you spoken to anyone about this?",
    "How has your sleep been lately?",
    "What has been the hardest part recently?",
]

TRANSITION_TO_ASSESSMENT = (
    "Would you like to take a quick 2-minute mental health check? "
    "It can help understand your situation better."
)

SUGGEST_EXERCISE = (
    "I can suggest a small exercise that might help you feel a bit better."
)


def generate_chat_response(
    user_message: str,
    emotion: str,
    risk_level: str,
    conversation_turn: int,
    phq9_done: bool = False,
    history=None   # ✅ FIX ADDED
) -> dict:

    # -------------------------------
    # Context Awareness
    # -------------------------------
    last_user_msg = ""
    if history and len(history) > 1:
        last_user_msg = history[-2]["content"].lower()

    user_lower = user_message.lower()

    response_parts = []

    # -------------------------------
    # Smart Context-Based Replies
    # -------------------------------
    if "future" in user_lower:
        response_parts.append(
            "It sounds like you're feeling uncertain about your future. That can feel really overwhelming."
        )

    elif "anxious" in user_lower or "anxiety" in user_lower:
        response_parts.append(
            "I'm really glad you shared that. Anxiety can feel intense, but you're not alone in this."
        )

    elif "tired" in user_lower or "exhausted" in user_lower:
        response_parts.append(
            "It sounds like you're really drained. That can be both physically and emotionally tough."
        )

    else:
        opener = random.choice(EMPATHY_OPENERS.get(emotion, EMPATHY_OPENERS["neutral"]))
        response_parts.append(opener)

    # -------------------------------
    # Risk Handling (Improved)
    # -------------------------------
    if risk_level == "crisis":
        return {
            "message": (
                "I'm really concerned about what you're going through. "
                "Please reach out to a helpline right now — you don’t have to face this alone."
            ),
            "suggest_assessment": False,
            "suggest_exercise": False,
        }

    elif risk_level == "high":
        variations = [
            "What you're going through sounds really heavy. You don’t have to handle it alone.",
            "I can hear how intense this feels for you. Getting support could really help.",
            "This seems like a tough situation. Talking to someone trained might make a big difference."
        ]
        response_parts.append(random.choice(variations))

    else:
        # -------------------------------
        # Smart Flow Control
        # -------------------------------
        if not phq9_done and conversation_turn >= 2 and emotion in ["sadness", "fear", "anger"]:
            response_parts.append(TRANSITION_TO_ASSESSMENT)

        elif risk_level in ["moderate", "low"]:
            response_parts.append(SUGGEST_EXERCISE)

        else:
            follow_up = random.choice(FOLLOW_UP_QUESTIONS)
            response_parts.append(follow_up)

    # -------------------------------
    # Final Response
    # -------------------------------
    return {
        "message": " ".join(response_parts),
        "suggest_assessment": not phq9_done and conversation_turn >= 2,
        "suggest_exercise": risk_level in ["low", "moderate"],
    }