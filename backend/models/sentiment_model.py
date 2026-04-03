"""
Emotion and sentiment analysis.
Uses a fast keyword-based classifier that works without downloading any models.
For production, swap analyze_emotion() with the HuggingFace pipeline version below.
"""

import re

# ── Keyword dictionaries ──────────────────────────────────────────────────────
EMOTION_KEYWORDS = {
    "sadness": [
        "sad", "unhappy", "depressed", "hopeless", "miserable", "down",
        "cry", "crying", "tears", "grief", "loss", "lonely", "alone",
        "worthless", "empty", "numb", "heartbroken", "devastated", "low",
        "gloomy", "sorrowful", "dukhi", "udaas"
    ],
    "fear": [
        "scared", "afraid", "anxious", "anxiety", "nervous", "worried",
        "panic", "terror", "dread", "fearful", "uneasy", "stress", "stressed",
        "overwhelmed", "phobia", "paranoid", "tense", "restless", "helpless",
        "dar", "chinta", "ghabrahat"
    ],
    "anger": [
        "angry", "furious", "rage", "mad", "frustrated", "irritated",
        "annoyed", "hate", "bitter", "hostile", "resentful", "outraged",
        "fed up", "sick of", "disgusted", "gussa"
    ],
    "joy": [
        "happy", "great", "wonderful", "excited", "good", "joy", "joyful",
        "amazing", "fantastic", "positive", "blessed", "grateful", "thankful",
        "cheerful", "content", "delighted", "okay", "fine", "well", "better",
        "khush", "accha"
    ],
    "disgust": [
        "disgusted", "gross", "awful", "horrible", "sick", "revolting",
        "nauseated", "appalled", "repulsed"
    ],
    "surprise": [
        "surprised", "shocked", "unexpected", "sudden", "unbelievable",
        "stunned", "astonished", "amazed"
    ],
}

NEGATIONS = {"not", "no", "never", "dont", "doesn't", "didn't", "can't",
             "won't", "isn't", "aren't", "wasn't", "weren't", "don't"}


def _tokenize(text):
    return re.findall(r"\b\w+\b", text.lower())


def analyze_emotion(text):
    """
    Fast keyword-based emotion detection.
    Returns top emotion and confidence score.
    """
    if not text or len(text.strip()) < 2:
        return {"top_emotion": "neutral", "scores": {}, "confidence": 0.5}

    tokens = _tokenize(text)
    token_set = set(tokens)
    negated = bool(token_set & NEGATIONS)
    scores = {emotion: 0.0 for emotion in EMOTION_KEYWORDS}

    for emotion, keywords in EMOTION_KEYWORDS.items():
        for kw in keywords:
            kw_tokens = kw.split()
            if len(kw_tokens) == 1:
                if kw in token_set:
                    scores[emotion] += 1.0
            else:
                if kw in text.lower():
                    scores[emotion] += 1.5

    if negated and scores["joy"] > 0:
        scores["sadness"] += scores["joy"] * 0.7
        scores["joy"] *= 0.3

    total = sum(scores.values())

    if total == 0:
        return {"top_emotion": "neutral", "scores": {}, "confidence": 0.5}

    normalized = {k: round(v / total, 4) for k, v in scores.items()}
    top_emotion = max(normalized, key=normalized.get)
    confidence = normalized[top_emotion]

    if confidence < 0.35:
        top_emotion = "neutral"

    return {
        "top_emotion": top_emotion,
        "confidence": confidence,
        "scores": normalized,
    }


def analyze_sentiment(text):
    result = analyze_emotion(text)
    emotion = result["top_emotion"]
    if emotion == "joy":
        return {"label": "positive", "score": result["confidence"]}
    elif emotion in {"sadness", "fear", "anger", "disgust"}:
        return {"label": "negative", "score": result["confidence"]}
    return {"label": "neutral", "score": 0.5}


EMOTION_TO_MOOD = {
    "joy":      {"mood": "positive",      "emoji": "😊", "color": "#4CAF50"},
    "neutral":  {"mood": "neutral",       "emoji": "😐", "color": "#9E9E9E"},
    "sadness":  {"mood": "low",           "emoji": "😢", "color": "#5C6BC0"},
    "anger":    {"mood": "distressed",    "emoji": "😠", "color": "#EF5350"},
    "fear":     {"mood": "anxious",       "emoji": "😨", "color": "#FF7043"},
    "disgust":  {"mood": "uncomfortable", "emoji": "😞", "color": "#8D6E63"},
    "surprise": {"mood": "unsettled",     "emoji": "😮", "color": "#FFA726"},
}


def get_mood_context(emotion):
    return EMOTION_TO_MOOD.get(emotion, EMOTION_TO_MOOD["neutral"])
