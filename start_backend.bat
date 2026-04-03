@echo off
echo 🧠 Starting MindBridge Backend...
echo.

cd backend

if not exist venv (
  echo 📦 Creating virtual environment...
  python -m venv venv
)

echo ⚡ Activating virtual environment...
call venv\Scripts\activate

echo 📥 Installing dependencies...
pip install -r requirements.txt -q

if not exist .env (
  copy ..\.env.example .env
  echo ✅ Created .env from template
)

echo.
echo 🚀 Backend starting at http://localhost:8000
echo 📖 API docs at  http://localhost:8000/docs
echo.

uvicorn app:app --reload --host 0.0.0.0 --port 8000
