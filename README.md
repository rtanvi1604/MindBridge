# 🧠 MindBridge — AI Mental Health First Responder for India

> **Codecure AI Hackathon · SPIRIT 2026 · IIT (BHU) Varanasi**

MindBridge is an AI-powered mental health triage and support platform designed to address India's mental health crisis — where **197 million people** need care but **70–92% receive no professional help**.

[![Python](https://img.shields.io/badge/Python-3.11-blue)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.111-green)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18-61dafb)](https://reactjs.org)
[![HuggingFace](https://img.shields.io/badge/🤗-Transformers-yellow)](https://huggingface.co)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ed)](https://docker.com)

---

## 📌 Problem Statement

India faces a severe mental health crisis:
- **197 million** Indians live with a mental disorder (1 in 7)
- Only **0.75 psychiatrists** per 100,000 people (WHO recommends 3)
- **70–92%** of affected individuals receive **no professional help**
- Treatment gap driven by stigma, geography, cost, and awareness

*Sources: Global Burden of Disease Study, WHO, NCRB 2025*

---

## 🌟 Features

| Feature | Description |
|---|---|
| 💬 **AI Chat** | Empathetic conversational AI with emotion detection |
| 📋 **PHQ-9 Screening** | Clinically validated depression assessment |
| 📋 **GAD-7 Screening** | Clinically validated anxiety assessment |
| 🚨 **Crisis Detection** | Real-time keyword + score based risk triage |
| 🧘 **CBT Coping Plans** | Evidence-based exercises tailored to emotion |
| 📊 **Mood Dashboard** | Daily mood logging + trend visualization |
| 📚 **Health Literacy** | Psychoeducation cards to reduce stigma |
| 🌐 **India-first** | Tele-MANAS, iCall, NIMHANS helpline integration |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, React Router, Recharts, Axios |
| **Backend** | Python 3.11, FastAPI, Uvicorn |
| **AI / NLP** | HuggingFace Transformers (`distilroberta-base`) |
| **Emotion Model** | `j-hartmann/emotion-english-distilroberta-base` |
| **PHQ-9 / GAD-7** | Clinical rule-based scoring engine |
| **Storage** | In-memory (dev) / Firebase Firestore (prod) |
| **Containerization** | Docker + Docker Compose |
| **Deployment** | Render (backend) + Vercel (frontend) |

---

## 🏗️ Project Structure

```
mindbridge/
├── backend/
│   ├── app.py                  # FastAPI application entry point
│   ├── config.py               # Environment configuration
│   ├── requirements.txt
│   ├── models/
│   │   ├── sentiment_model.py  # HuggingFace emotion classifier
│   │   ├── phq9_scorer.py      # PHQ-9 & GAD-7 clinical scoring
│   │   └── risk_classifier.py  # Crisis risk triage engine
│   ├── routes/
│   │   ├── chat.py             # POST /api/chat
│   │   ├── assessment.py       # GET/POST /api/assess
│   │   └── mood.py             # POST/GET /api/mood
│   ├── utils/
│   │   ├── cbt_recommender.py  # CBT exercise recommendation
│   │   ├── response_generator.py # AI response generation
│   │   └── mood_store.py       # Mood logging store
│   └── data/
│       └── psychoeducation.json
├── frontend/
│   └── src/
│       ├── pages/
│       │   ├── Home.jsx        # Landing page
│       │   ├── Chat.jsx        # Chat interface
│       │   ├── Assessment.jsx  # PHQ-9 / GAD-7 forms
│       │   ├── Dashboard.jsx   # Mood tracker
│       │   └── Learn.jsx       # Health literacy
│       └── components/
│           ├── CrisisBanner.jsx
│           └── ExerciseCard.jsx
├── tests/
│   └── test_api.py
├── docker/
│   ├── Dockerfile.backend
│   └── Dockerfile.frontend
└── docker-compose.yml
```

---

## ⚙️ Technical Workflow

```
User Input (Text)
       │
       ▼
┌─────────────────────────┐
│   Emotion Analysis      │  ← HuggingFace distilroberta
│   (anger/sadness/fear…) │
└────────────┬────────────┘
             │
       ┌─────▼──────┐
       │ Risk Triage │  ← Keyword detection + PHQ-9 score
       └─────┬───────┘
             │
    ┌────────▼────────────────┐
    │  Crisis? → Helplines    │  ← 14416, 9152987821, etc.
    │  High?   → Professional │
    │  Low?    → CBT Exercise  │  ← CBT exercise engine
    └────────────────────────-┘
             │
       ┌─────▼───────┐
       │ AI Response  │  ← Emotion-aware empathy templates
       └─────────────┘
             │
       ┌─────▼────────┐
       │ Mood Logging  │  ← Auto-logged per session
       └──────────────┘
```

---

## 🚀 Installation & Setup

### Prerequisites
- Python 3.11+
- Node.js 18+
- Git

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/mindbridge.git
cd mindbridge
```

### 2. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp ../.env.example .env
uvicorn app:app --reload --port 8000
```

### 3. Frontend Setup
```bash
cd frontend
npm install
echo "REACT_APP_API_URL=http://localhost:8000" > .env
npm start
```

### 4. Docker (Full stack)
```bash
docker-compose up --build
# Frontend: http://localhost:3000
# Backend:  http://localhost:8000
# API Docs: http://localhost:8000/docs
```

---

## 📡 API Documentation

| Endpoint | Method | Description |
|---|---|---|
| `/` | GET | Health check |
| `/api/chat/` | POST | Send message, get AI response |
| `/api/assess/phq9/questions` | GET | Fetch PHQ-9 questions |
| `/api/assess/phq9/score` | POST | Submit and score PHQ-9 |
| `/api/assess/gad7/questions` | GET | Fetch GAD-7 questions |
| `/api/assess/gad7/score` | POST | Submit and score GAD-7 |
| `/api/mood/log` | POST | Log a mood entry |
| `/api/mood/history/{id}` | GET | Get mood history |
| `/api/mood/summary/{id}` | GET | Get mood summary + trend |

Full interactive docs: `http://localhost:8000/docs`

---

## 🧪 Running Tests

```bash
cd mindbridge
pip install pytest httpx
pytest tests/ -v
```

---

## 📊 Dataset Sources

| Dataset | Source | Use |
|---|---|---|
| PHQ-9 Student Depression | [Mendeley Data](https://data.mendeley.com/datasets/kkzjk253cy/1) | PHQ-9 scoring model reference |
| Emotion NLP | [HuggingFace: dair-ai/emotion](https://huggingface.co/datasets/dair-ai/emotion) | Emotion classifier training |
| Mental Health Conversations | [HuggingFace: Amod/mental_health_counseling_conversations](https://huggingface.co/datasets/Amod/mental_health_counseling_conversations) | Chat response patterns |

---

## 🔮 Future Scope

- **Multilingual support** — Hindi, Tamil, Telugu via IndicTrans2
- **Wearable integration** — Heart rate, sleep data for passive monitoring
- **ASHA worker module** — Training interface for community health workers
- **EHR integration** — ABDM (Ayushman Bharat Digital Mission) compatibility
- **Regional helpline mapping** — State-wise crisis resource directory
- **Voice input** — Speech-to-text for accessibility

---

## ⚠️ Medical Disclaimer

MindBridge is a **screening and support tool only**. It is **not a substitute** for professional medical advice, diagnosis, or treatment. If you are in crisis:

- **Tele-MANAS**: 14416 (24/7, Free, Govt. of India)
- **iCall (TISS)**: 9152987821
- **Vandrevala Foundation**: 1860-2662-345

---

## 📚 References

1. Global Burden of Disease Study — Mental Disorders (2019)
2. WHO Mental Health Atlas 2022
3. NCRB Accidental Deaths & Suicides in India Report 2024
4. Kroenke K, Spitzer RL. The PHQ-9: A New Depression Diagnostic and Severity Measure. *Psychiatric Annals*, 2002
5. Spitzer RL et al. A Brief Measure for Assessing Generalized Anxiety Disorder. *Archives of Internal Medicine*, 2006
6. NIMHANS National Mental Health Survey 2015–16
7. Hartmann J et al. *Emotion English DistilRoBERTa-base*. HuggingFace, 2022

---

## 👩‍💻 Team - By, Tanvi R

Built for **Codecure AI Hackathon · SPIRIT 2026 · IIT (BHU) Varanasi**

*Addressing India's mental health treatment gap through responsible, human-centered AI.*
