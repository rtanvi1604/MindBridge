"""
PHQ-9 (Patient Health Questionnaire-9) and GAD-7 (Generalized Anxiety Disorder-7)
Clinical scoring logic. These are validated clinical screening tools.
"""

PHQ9_QUESTIONS = [
    "Little interest or pleasure in doing things?",
    "Feeling down, depressed, or hopeless?",
    "Trouble falling or staying asleep, or sleeping too much?",
    "Feeling tired or having little energy?",
    "Poor appetite or overeating?",
    "Feeling bad about yourself — or that you are a failure or have let yourself or your family down?",
    "Trouble concentrating on things, such as reading the newspaper or watching television?",
    "Moving or speaking so slowly that other people could have noticed? Or the opposite — being so fidgety or restless that you have been moving around a lot more than usual?",
    "Thoughts that you would be better off dead, or of hurting yourself in some way?"
]

GAD7_QUESTIONS = [
    "Feeling nervous, anxious, or on edge?",
    "Not being able to stop or control worrying?",
    "Worrying too much about different things?",
    "Trouble relaxing?",
    "Being so restless that it's hard to sit still?",
    "Becoming easily annoyed or irritable?",
    "Feeling afraid, as if something awful might happen?"
]

SCORE_OPTIONS = [
    {"label": "Not at all", "value": 0},
    {"label": "Several days", "value": 1},
    {"label": "More than half the days", "value": 2},
    {"label": "Nearly every day", "value": 3},
]


def score_phq9(answers: list[int]) -> dict:
    """
    Score PHQ-9 responses and return severity classification.
    answers: list of 9 integers (0-3 each)
    """
    if len(answers) != 9:
        raise ValueError("PHQ-9 requires exactly 9 answers (0-3 each)")

    total = sum(answers)
    crisis_flag = answers[8] >= 1  # Q9 is about self-harm

    if total <= 4:
        severity = "Minimal"
        color = "green"
        recommendation = "Your responses suggest minimal depression symptoms. Keep maintaining healthy habits."
    elif total <= 9:
        severity = "Mild"
        color = "yellow"
        recommendation = "Your responses suggest mild depression. Consider talking to a trusted person or counselor."
    elif total <= 14:
        severity = "Moderate"
        color = "orange"
        recommendation = "Moderate depression detected. We strongly recommend speaking with a mental health professional."
    elif total <= 19:
        severity = "Moderately Severe"
        color = "red"
        recommendation = "Moderately severe depression. Please reach out to a counselor or mental health helpline today."
    else:
        severity = "Severe"
        color = "darkred"
        recommendation = "Severe depression indicators present. Please contact a crisis helpline immediately."

    return {
        "total_score": total,
        "severity": severity,
        "color": color,
        "recommendation": recommendation,
        "crisis_flag": crisis_flag,
        "breakdown": {
            f"Q{i+1}": answers[i] for i in range(9)
        }
    }


def score_gad7(answers: list[int]) -> dict:
    """
    Score GAD-7 responses and return anxiety severity.
    answers: list of 7 integers (0-3 each)
    """
    if len(answers) != 7:
        raise ValueError("GAD-7 requires exactly 7 answers (0-3 each)")

    total = sum(answers)

    if total <= 4:
        severity = "Minimal Anxiety"
        recommendation = "Your anxiety levels appear minimal. Stay mindful of stress triggers."
    elif total <= 9:
        severity = "Mild Anxiety"
        recommendation = "Mild anxiety detected. Breathing exercises and mindfulness may help."
    elif total <= 14:
        severity = "Moderate Anxiety"
        recommendation = "Moderate anxiety. Consider speaking with a mental health professional."
    else:
        severity = "Severe Anxiety"
        recommendation = "Severe anxiety. Please seek professional support as soon as possible."

    return {
        "total_score": total,
        "severity": severity,
        "recommendation": recommendation,
    }


def get_phq9_questions():
    return [{"id": i, "question": q, "options": SCORE_OPTIONS} for i, q in enumerate(PHQ9_QUESTIONS)]


def get_gad7_questions():
    return [{"id": i, "question": q, "options": SCORE_OPTIONS} for i, q in enumerate(GAD7_QUESTIONS)]
