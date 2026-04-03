import requests
from utils.response_generator import generate_chat_response  # fallback

API_KEY = "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"


def generate_llm_response(user_message, emotion, risk_level, history=None):

    prompt = f"""
        You are a compassionate AI mental health assistant.

        User Emotion: {emotion}
        Risk Level: {risk_level}

        User: {user_message}

        Respond empathetically and naturally. Ask a helpful follow-up.
        """

    try:
        response = requests.post(
            url="https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {API_KEY}",
                "Content-Type": "application/json"
            },
            json={
                "model": "openai/gpt-3.5-turbo",   # ✅ FIXED
                "messages": [{"role": "user", "content": prompt}]
            }
        )

        data = response.json()

        # ✅ SAFE CHECK
        if "choices" in data:
            return {
                "message": data["choices"][0]["message"]["content"],
                "suggest_assessment": False,
                "suggest_exercise": risk_level in ["low", "moderate"]
            }
        else:
            print("⚠️ API Error:", data)

            # 🔥 FALLBACK
            return generate_chat_response(
                user_message=user_message,
                emotion=emotion,
                risk_level=risk_level,
                conversation_turn=1,
                phq9_done=False,
                history=history
            )

    except Exception as e:
        print("LLM Error:", e)

        return generate_chat_response(
            user_message=user_message,
            emotion=emotion,
            risk_level=risk_level,
            conversation_turn=1,
            phq9_done=False,
            history=history
        )