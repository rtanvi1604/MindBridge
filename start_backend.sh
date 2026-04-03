#!/bin/bash
# MindBridge Backend Startup Script
# Run this from the project root: bash start_backend.sh

echo "🧠 Starting MindBridge Backend..."
echo ""

cd backend

# Check if venv exists
if [ ! -d "venv" ]; then
  echo "📦 Creating virtual environment..."
  python3 -m venv venv
fi

# Activate venv
echo "⚡ Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "📥 Installing dependencies..."
pip install -r requirements.txt -q

# Copy .env if not exists
if [ ! -f ".env" ]; then
  cp ../.env.example .env
  echo "✅ Created .env from template"
fi

echo ""
echo "🚀 Backend starting at http://localhost:8000"
echo "📖 API docs at  http://localhost:8000/docs"
echo ""

uvicorn app:app --reload --host 0.0.0.0 --port 8000
