"""
CBT (Cognitive Behavioral Therapy) exercise recommender.
Maps detected emotions to evidence-based coping strategies.
"""

import json
import os
import random

CBT_EXERCISES = {
    "sadness": [
        {
            "title": "Behavioral Activation",
            "duration": "10 min",
            "description": "When sadness makes you want to withdraw, small actions break the cycle.",
            "steps": [
                "Write down one small activity you used to enjoy (a walk, music, cooking).",
                "Commit to doing it for just 10 minutes today.",
                "Notice how you feel before vs. after — even a tiny shift matters.",
                "Schedule one more activity for tomorrow."
            ],
            "why_it_works": "Sadness reduces motivation, but action precedes motivation — not the other way around."
        },
        {
            "title": "Gratitude Journaling",
            "duration": "5 min",
            "description": "Redirect cognitive focus toward what's present and positive.",
            "steps": [
                "Open a notebook or your phone notes.",
                "Write 3 things that happened today — no matter how small.",
                "For each one, write one sentence about why it matters.",
                "Read it back slowly."
            ],
            "why_it_works": "Gratitude journaling rewires the brain to notice positive events more readily."
        }
    ],
    "fear": [
        {
            "title": "4-7-8 Breathing",
            "duration": "3 min",
            "description": "A clinically validated technique to calm the nervous system in minutes.",
            "steps": [
                "Sit comfortably and close your eyes.",
                "Exhale completely through your mouth.",
                "Inhale quietly through your nose for 4 seconds.",
                "Hold your breath for 7 seconds.",
                "Exhale completely through your mouth for 8 seconds.",
                "Repeat 4 times."
            ],
            "why_it_works": "The extended exhale activates the parasympathetic nervous system, reducing cortisol."
        },
        {
            "title": "5-4-3-2-1 Grounding",
            "duration": "5 min",
            "description": "Anchor yourself to the present moment when anxiety feels overwhelming.",
            "steps": [
                "Name 5 things you can SEE right now.",
                "Name 4 things you can TOUCH — reach out and feel them.",
                "Name 3 things you can HEAR.",
                "Name 2 things you can SMELL.",
                "Name 1 thing you can TASTE."
            ],
            "why_it_works": "Engages your senses to interrupt the anxiety thought loop."
        }
    ],
    "anger": [
        {
            "title": "Cognitive Reframing",
            "duration": "10 min",
            "description": "Change the story you're telling yourself about the situation.",
            "steps": [
                "Write down what made you angry in one sentence.",
                "Ask: What am I assuming about this situation?",
                "Write 2 alternative explanations for what happened.",
                "Ask: Which story serves me better right now?",
                "Write one constructive action you can take."
            ],
            "why_it_works": "Anger often stems from cognitive distortions — reframing interrupts the cycle."
        },
        {
            "title": "Progressive Muscle Relaxation",
            "duration": "8 min",
            "description": "Release physical tension stored in the body during anger.",
            "steps": [
                "Sit or lie down comfortably.",
                "Starting with your feet: tense all muscles tightly for 5 seconds.",
                "Release and notice the relaxation for 10 seconds.",
                "Move up: calves → thighs → abdomen → chest → arms → face.",
                "End with 3 deep breaths."
            ],
            "why_it_works": "Anger creates muscle tension — releasing it physically reduces emotional intensity."
        }
    ],
    "neutral": [
        {
            "title": "Mindful Check-in",
            "duration": "3 min",
            "description": "A quick scan to understand what you're actually feeling.",
            "steps": [
                "Close your eyes and take 3 deep breaths.",
                "Ask yourself: 'What am I feeling right now?' — name it without judgment.",
                "Ask: 'Where do I feel this in my body?'",
                "Ask: 'What does this feeling need?'",
                "Open your eyes and write one word about what you noticed."
            ],
            "why_it_works": "Emotional labeling reduces the intensity of difficult feelings."
        }
    ],
    "joy": [
        {
            "title": "Savoring Exercise",
            "duration": "5 min",
            "description": "Amplify and lock in positive emotions for lasting wellbeing.",
            "steps": [
                "Think of something good happening in your life right now.",
                "Close your eyes and spend 2 minutes fully imagining it.",
                "Notice where you feel it physically (warmth, lightness).",
                "Share it with one person today — even a text counts.",
                "Write it down so you can return to it later."
            ],
            "why_it_works": "Positive emotions are fleeting — savoring extends their neurological benefits."
        }
    ],
    "disgust": [
        {
            "title": "Values Clarification",
            "duration": "10 min",
            "description": "Reconnect with what matters most when something feels wrong.",
            "steps": [
                "Write down what triggered the feeling of disgust or discomfort.",
                "Ask: 'What value of mine is being violated here?'",
                "List your top 5 personal values.",
                "Identify one action aligned with your values you can take today.",
                "Commit to it."
            ],
            "why_it_works": "Disgust often signals a values mismatch — clarity creates a path forward."
        }
    ],
    "surprise": [
        {
            "title": "Journaling for Clarity",
            "duration": "8 min",
            "description": "Process unexpected events to reduce cognitive overload.",
            "steps": [
                "Write down what happened that surprised or unsettled you.",
                "Write: 'I feel _____ about this because _____.'",
                "Write: 'What I can control about this is _____.'",
                "Write: 'One thing I'll do next is _____.'",
                "Read it back and take 3 slow breaths."
            ],
            "why_it_works": "Writing transforms vague feelings into specific, actionable thoughts."
        }
    ]
}

BREATHING_QUICK = {
    "title": "Box Breathing",
    "duration": "2 min",
    "steps": ["Inhale for 4 counts", "Hold for 4 counts", "Exhale for 4 counts", "Hold for 4 counts", "Repeat 4 times"]
}


def recommend_exercises(emotion: str, count: int = 2) -> list:
    """
    Return CBT exercises based on detected emotion.
    Falls back to neutral exercises if emotion not found.
    """
    exercises = CBT_EXERCISES.get(emotion, CBT_EXERCISES["neutral"])
    return random.sample(exercises, min(count, len(exercises)))


def get_quick_exercise(emotion: str) -> dict:
    """Return a single quick exercise for the given emotion."""
    exercises = CBT_EXERCISES.get(emotion, CBT_EXERCISES["neutral"])
    return exercises[0] if exercises else BREATHING_QUICK


def get_all_exercises() -> dict:
    return CBT_EXERCISES
