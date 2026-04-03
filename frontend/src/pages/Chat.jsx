import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import CrisisBanner from '../components/CrisisBanner';
import ExerciseCard from '../components/ExerciseCard';

const API = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const QUICK_PROMPTS = [
  "I've been feeling really anxious lately",
  "I can't sleep and feel hopeless",
  "I'm overwhelmed with stress",
  "I feel lonely and disconnected",
  "I'm feeling okay today actually",
];

function TypingIndicator() {
  return (
    <div style={{ display: 'flex', gap: 5, padding: '12px 16px', alignItems: 'center' }}>
      {[0, 1, 2].map(i => (
        <div key={i} style={{
          width: 7, height: 7, borderRadius: '50%',
          background: 'var(--text-muted)',
          animation: 'pulse 1.2s ease-in-out infinite',
          animationDelay: `${i * 0.2}s`
        }} />
      ))}
    </div>
  );
}

export default function Chat({ sessionId, phq9Done, phq9Score }) {
  const [messages, setMessages] = useState([
    {
      role: 'ai',
      text: "Hi, I'm MindBridge. This is a safe, judgment-free space. How are you feeling today?",
      emotion: null,
      exercises: [],
      helplines: [],
      showCrisis: false,
      suggestAssessment: false,
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [moodLogged, setMoodLogged] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = async (text) => {
    const userText = text || input.trim();
    if (!userText || loading) return;
    setInput('');

    const userMsg = { role: 'user', text: userText };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const { data } = await axios.post(`${API}/api/chat/`, {
        message: userText,
        session_id: sessionId,
        phq9_done: phq9Done,
        phq9_score: phq9Score,
      });

      const aiMsg = {
        role: 'ai',
        text: data.reply,
        emotion: data.emotion,
        emotionEmoji: data.emotion_emoji,
        riskLevel: data.risk_level,
        exercises: data.exercises || [],
        helplines: data.helplines || [],
        showCrisis: data.show_crisis_banner,
        suggestAssessment: data.suggest_assessment,
      };
      setMessages(prev => [...prev, aiMsg]);

      // Auto-log mood if emotion detected
      if (data.emotion && data.emotion !== 'neutral' && !moodLogged) {
        const emotionToScore = {
          joy: 8, neutral: 5, sadness: 3, fear: 3, anger: 3, disgust: 3, surprise: 5
        };
        await axios.post(`${API}/api/mood/log`, {
          session_id: sessionId,
          score: emotionToScore[data.emotion] || 5,
          emotion: data.emotion,
          note: userText.slice(0, 80),
        }).catch(() => {});
        setMoodLogged(true);
      }
    } catch (err) {
      const isOffline = !err.response || err.code === 'ECONNREFUSED' || err.message?.includes('Network');
      setMessages(prev => [...prev, {
        role: 'ai',
        text: isOffline
          ? "⚠️ Backend server is not running. Please start it with:\n\ncd backend\npip install -r requirements.txt\nuvicorn app:app --reload --port 8000"
          : "I'm having trouble connecting right now. Please try again in a moment.",
        emotion: null, exercises: [], helplines: [], showCrisis: false, suggestAssessment: false
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const RISK_COLORS = {
    crisis: 'var(--danger)', high: '#fb923c',
    moderate: 'var(--warning)', low: 'var(--accent)'
  };

  return (
    <div style={{
      maxWidth: 760, margin: '0 auto', padding: '24px 24px 0',
      display: 'flex', flexDirection: 'column', height: 'calc(100vh - 60px)'
    }}>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: 4 }}>
        Chat Support
      </h2>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: 16 }}>
        Speak freely — everything here is private and judgment-free.
      </p>

      {/* Messages */}
      <div style={{
        flex: 1, overflowY: 'auto', display: 'flex',
        flexDirection: 'column', gap: 12, paddingBottom: 16
      }}>
        {messages.map((msg, i) => (
          <div key={i} className="fade-in" style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start',
          }}>
            <div style={{
              maxWidth: '78%',
              padding: '12px 16px',
              borderRadius: msg.role === 'user'
                ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
              background: msg.role === 'user'
                ? 'var(--accent-soft)' : 'var(--bg-card)',
              border: '1px solid',
              borderColor: msg.role === 'user'
                ? 'rgba(110,231,183,0.2)' : 'var(--border)',
              fontSize: '0.9rem',
              lineHeight: 1.6,
            }}>
              {msg.text}
            </div>

            {/* Emotion tag */}
            {msg.role === 'ai' && msg.emotion && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: 6,
                marginTop: 5, marginLeft: 6
              }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {msg.emotionEmoji} {msg.emotion}
                </span>
                {msg.riskLevel && msg.riskLevel !== 'low' && (
                  <span style={{
                    fontSize: '0.7rem', padding: '2px 8px',
                    borderRadius: 99, background: 'rgba(0,0,0,0.3)',
                    color: RISK_COLORS[msg.riskLevel]
                  }}>
                    {msg.riskLevel} risk
                  </span>
                )}
              </div>
            )}

            {/* Crisis banner */}
            {msg.showCrisis && <CrisisBanner helplines={msg.helplines} />}

            {/* Suggest assessment */}
            {msg.suggestAssessment && !phq9Done && (
              <div className="card fade-in" style={{
                marginTop: 10, maxWidth: '78%',
                borderColor: 'rgba(129,140,248,0.25)'
              }}>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: 10 }}>
                  📋 Would you like to take a 2-minute clinical check-in? It helps understand your mental health more precisely.
                </p>
                <Link to="/assessment" className="btn btn-secondary btn-sm">
                  Take PHQ-9 Assessment →
                </Link>
              </div>
            )}

            {/* Exercises */}
            {msg.exercises?.map((ex, j) => (
              <div key={j} style={{ maxWidth: '78%', width: '100%' }}>
                <ExerciseCard exercise={ex} />
              </div>
            ))}
          </div>
        ))}

        {loading && (
          <div style={{ display: 'flex', alignItems: 'flex-start' }}>
            <div className="card" style={{ padding: 0 }}>
              <TypingIndicator />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick prompts */}
      {messages.length === 1 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
          {QUICK_PROMPTS.map((p, i) => (
            <button key={i}
              className="btn btn-secondary btn-sm"
              onClick={() => sendMessage(p)}
              style={{ fontSize: '0.78rem' }}
            >
              {p}
            </button>
          ))}
        </div>
      )}

      {/* Input area */}
      <div style={{
        display: 'flex', gap: 10, paddingBottom: 24,
        borderTop: '1px solid var(--border)', paddingTop: 16
      }}>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="How are you feeling? (Press Enter to send)"
          style={{ minHeight: 48, maxHeight: 120, resize: 'none', flex: 1 }}
          disabled={loading}
        />
        <button
          className="btn btn-primary"
          onClick={() => sendMessage()}
          disabled={loading || !input.trim()}
          style={{ alignSelf: 'flex-end', height: 48, paddingInline: 20 }}
        >
          {loading ? '...' : '→'}
        </button>
      </div>
    </div>
  );
}
