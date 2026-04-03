import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid
} from 'recharts';

const API = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const EMOTIONS = ['joy', 'neutral', 'sadness', 'fear', 'anger', 'surprise', 'disgust'];
const EMOTION_EMOJIS = {
  joy: '😊', neutral: '😐', sadness: '😢',
  fear: '😨', anger: '😠', surprise: '😮', disgust: '😞'
};

const TREND_LABELS = {
  improving: { label: '↑ Improving', color: 'var(--accent)' },
  declining:  { label: '↓ Declining', color: 'var(--danger)' },
  stable:     { label: '→ Stable',    color: 'var(--text-secondary)' },
};

export default function Dashboard({ sessionId }) {
  const [summary, setSummary]     = useState(null);
  const [loading, setLoading]     = useState(true);
  const [logScore, setLogScore]   = useState(5);
  const [logEmotion, setLogEmotion] = useState('neutral');
  const [logNote, setLogNote]     = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [logged, setLogged]       = useState(false);

  const fetchSummary = async () => {
    try {
      const { data } = await axios.get(`${API}/api/mood/summary/${sessionId}`);
      setSummary(data);
    } catch {
      setSummary(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSummary(); }, [sessionId]);

  const submitMood = async () => {
    setSubmitting(true);
    try {
      await axios.post(`${API}/api/mood/log`, {
        session_id: sessionId,
        score: logScore,
        emotion: logEmotion,
        note: logNote,
      });
      setLogged(true);
      setLogNote('');
      await fetchSummary();
      setTimeout(() => setLogged(false), 3000);
    } catch {
      alert('Failed to log mood. Ensure backend is running.');
    } finally {
      setSubmitting(false);
    }
  };

  const chartData = summary?.history?.map(e => ({
    date: e.date.slice(5),
    score: e.score,
    emotion: e.emotion,
  })) || [];

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    const d = payload[0].payload;
    return (
      <div className="card card-sm" style={{ padding: '8px 12px', fontSize: '0.8rem' }}>
        <div>{d.date}</div>
        <div style={{ color: 'var(--accent)' }}>Score: {d.score}/10</div>
        <div style={{ color: 'var(--text-secondary)' }}>
          {EMOTION_EMOJIS[d.emotion]} {d.emotion}
        </div>
      </div>
    );
  };

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '40px 24px' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', marginBottom: 6 }}>
        Mood Dashboard
      </h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 32 }}>
        Track your emotional wellbeing over time.
      </p>

      {/* Log mood */}
      <div className="card" style={{ marginBottom: 24, borderColor: 'rgba(110,231,183,0.2)' }}>
        <h3 style={{ fontSize: '1rem', marginBottom: 16 }}>📝 Log Today's Mood</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 14 }}>
          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>
              Mood Score: <strong style={{ color: 'var(--accent)' }}>{logScore}/10</strong>
            </label>
            <input
              type="range" min={1} max={10} value={logScore}
              onChange={e => setLogScore(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--accent)', background: 'transparent', border: 'none', padding: 0 }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              <span>Very low</span><span>Very good</span>
            </div>
          </div>
          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>
              Primary Emotion
            </label>
            <select value={logEmotion} onChange={e => setLogEmotion(e.target.value)}>
              {EMOTIONS.map(em => (
                <option key={em} value={em}>{EMOTION_EMOJIS[em]} {em}</option>
              ))}
            </select>
          </div>
        </div>
        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>
            Quick note (optional)
          </label>
          <input
            type="text"
            value={logNote}
            onChange={e => setLogNote(e.target.value)}
            placeholder="What's on your mind today?"
            style={{ minHeight: 'unset' }}
          />
        </div>
        <button className="btn btn-primary" onClick={submitMood} disabled={submitting}>
          {logged ? '✓ Logged!' : submitting ? 'Saving...' : 'Log Mood'}
        </button>
      </div>

      {/* Summary stats */}
      {loading ? (
        <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: 40 }}>
          Loading your data...
        </div>
      ) : !summary || summary.message ? (
        <div className="card" style={{ textAlign: 'center', padding: 40, color: 'var(--text-secondary)' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>📊</div>
          <p>No mood data yet. Log your mood above to start tracking!</p>
        </div>
      ) : (
        <>
          {/* Stats row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14, marginBottom: 24 }}>
            {[
              { label: 'Entries logged', value: summary.total_entries, color: 'var(--text-primary)' },
              { label: 'Average score', value: `${summary.average_score}/10`, color: 'var(--accent)' },
              {
                label: 'Trend',
                value: TREND_LABELS[summary.trend]?.label || summary.trend,
                color: TREND_LABELS[summary.trend]?.color || 'var(--text-secondary)'
              },
              {
                label: 'Common mood',
                value: `${EMOTION_EMOJIS[summary.most_common_emotion] || ''} ${summary.most_common_emotion}`,
                color: 'var(--text-primary)'
              },
            ].map((s, i) => (
              <div key={i} className="card card-sm" style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: s.color }}>
                  {s.value}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          {/* Chart */}
          {chartData.length > 1 && (
            <div className="card" style={{ marginBottom: 24 }}>
              <h3 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: 16 }}>
                Mood over time
              </h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="date" tick={{ fill: '#4a5a7a', fontSize: 11 }} />
                  <YAxis domain={[0, 10]} tick={{ fill: '#4a5a7a', fontSize: 11 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone" dataKey="score"
                    stroke="var(--accent)" strokeWidth={2}
                    dot={{ fill: 'var(--accent)', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* History list */}
          <div className="card">
            <h3 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: 14 }}>
              Recent entries
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[...(summary.history || [])].reverse().map((e, i) => (
                <div key={i} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '10px 14px', background: 'var(--bg-card2)',
                  borderRadius: 8, fontSize: '0.85rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span>{EMOTION_EMOJIS[e.emotion] || '😐'}</span>
                    <div>
                      <div style={{ fontWeight: 500 }}>{e.emotion}</div>
                      {e.note && (
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                          {e.note}
                        </div>
                      )}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ color: 'var(--accent)', fontWeight: 600 }}>{e.score}/10</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{e.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
