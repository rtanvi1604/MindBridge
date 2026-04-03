import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CrisisBanner from '../components/CrisisBanner';
import ExerciseCard from '../components/ExerciseCard';

const API = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const OPTIONS = [
  { label: 'Not at all', value: 0 },
  { label: 'Several days', value: 1 },
  { label: 'More than half the days', value: 2 },
  { label: 'Nearly every day', value: 3 },
];

const SEVERITY_COLORS = {
  Minimal: 'var(--accent)',
  'Minimal Anxiety': 'var(--accent)',
  Mild: '#a3e635',
  'Mild Anxiety': '#a3e635',
  Moderate: 'var(--warning)',
  'Moderate Anxiety': 'var(--warning)',
  'Moderately Severe': '#fb923c',
  Severe: 'var(--danger)',
  'Severe Anxiety': 'var(--danger)',
};

function QuestionCard({ index, question, value, onChange }) {
  return (
    <div className="card" style={{ marginBottom: 12 }}>
      <p style={{ fontSize: '0.9rem', marginBottom: 14, lineHeight: 1.5 }}>
        <span style={{ color: 'var(--accent)', fontWeight: 600, marginRight: 8 }}>
          {index + 1}.
        </span>
        {question}
      </p>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {OPTIONS.map(opt => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            style={{
              padding: '7px 14px',
              borderRadius: 8,
              border: '1px solid',
              borderColor: value === opt.value ? 'var(--accent)' : 'var(--border)',
              background: value === opt.value ? 'var(--accent-soft)' : 'var(--bg-card2)',
              color: value === opt.value ? 'var(--accent)' : 'var(--text-secondary)',
              cursor: 'pointer',
              fontSize: '0.8rem',
              fontFamily: 'var(--font-body)',
              transition: 'all 0.15s',
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function ScoreBar({ score, max }) {
  const pct = Math.min((score / max) * 100, 100);
  const color = pct < 20 ? 'var(--accent)' : pct < 50 ? 'var(--warning)' : 'var(--danger)';
  return (
    <div style={{ background: 'var(--bg-card2)', borderRadius: 99, height: 10, marginTop: 10, overflow: 'hidden' }}>
      <div style={{
        height: '100%', width: `${pct}%`, borderRadius: 99,
        background: color, transition: 'width 0.8s ease'
      }} />
    </div>
  );
}

export default function Assessment({ sessionId, onComplete }) {
  const [mode, setMode] = useState('pick'); // pick | phq9 | gad7 | result
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState('phq9');

  const loadQuestions = async (t) => {
    setLoading(true);
    setType(t);
    try {
      const { data } = await axios.get(`${API}/api/assess/${t}/questions`);
      setQuestions(data.questions);
      setAnswers(new Array(data.questions.length).fill(null));
      setMode(t);
    } catch {
      alert('Could not load questions. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const submit = async () => {
    if (answers.some(a => a === null)) {
      alert('Please answer all questions before submitting.');
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.post(`${API}/api/assess/${type}/score`, {
        answers,
        session_id: sessionId,
      });
      setResult({ ...data, type });
      setMode('result');
      if (type === 'phq9' && onComplete) onComplete(data.total_score);
    } catch {
      alert('Submission failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const answered = answers.filter(a => a !== null).length;
  const total = questions.length;

  if (mode === 'pick') return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: '40px 24px' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', marginBottom: 8 }}>
        Clinical Assessment
      </h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 32 }}>
        These are validated screening tools used by mental health professionals worldwide.
        They take 2–3 minutes and help identify how you're feeling more precisely.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {[
          {
            key: 'phq9', emoji: '😔', title: 'PHQ-9',
            subtitle: 'Depression Screening', time: '2 min',
            desc: 'Measures depression severity across 9 dimensions including mood, sleep, energy, and concentration.',
          },
          {
            key: 'gad7', emoji: '😟', title: 'GAD-7',
            subtitle: 'Anxiety Screening', time: '90 sec',
            desc: 'Measures generalized anxiety disorder severity across 7 symptoms.',
          },
        ].map(q => (
          <div key={q.key} className="card" style={{ cursor: 'pointer' }}
            onClick={() => loadQuestions(q.key)}>
            <div style={{ fontSize: '2rem', marginBottom: 10 }}>{q.emoji}</div>
            <div className="badge badge-green" style={{ marginBottom: 8 }}>{q.time}</div>
            <h3 style={{ fontSize: '1.1rem' }}>{q.title}</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: 4 }}>
              {q.subtitle}
            </p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: 8, lineHeight: 1.5 }}>
              {q.desc}
            </p>
            <button className="btn btn-primary btn-sm" style={{ marginTop: 16 }}
              disabled={loading}>
              Start →
            </button>
          </div>
        ))}
      </div>
      <div className="card" style={{
        marginTop: 24, background: 'rgba(251,191,36,0.04)',
        borderColor: 'rgba(251,191,36,0.2)'
      }}>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          ⚠️ These tools are for <strong>screening only</strong>, not diagnosis.
          A score does not replace a clinical evaluation by a qualified professional.
        </p>
      </div>
    </div>
  );

  if (mode === 'phq9' || mode === 'gad7') return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: '40px 24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem' }}>
          {type === 'phq9' ? 'PHQ-9 — Depression Screening' : 'GAD-7 — Anxiety Screening'}
        </h2>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          {answered}/{total} answered
        </span>
      </div>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: 20 }}>
        Over the last 2 weeks, how often have you been bothered by the following?
      </p>

      {/* Progress bar */}
      <div style={{ background: 'var(--bg-card2)', borderRadius: 99, height: 4, marginBottom: 24 }}>
        <div style={{
          height: '100%', borderRadius: 99, background: 'var(--accent)',
          width: `${(answered / total) * 100}%`, transition: 'width 0.3s'
        }} />
      </div>

      {questions.map((q, i) => (
        <QuestionCard
          key={i} index={i} question={q.question}
          value={answers[i]}
          onChange={v => { const a = [...answers]; a[i] = v; setAnswers(a); }}
        />
      ))}

      <button
        className="btn btn-primary"
        style={{ marginTop: 8, width: '100%' }}
        onClick={submit}
        disabled={loading || answered < total}
      >
        {loading ? 'Scoring...' : `Submit ${total} Answers →`}
      </button>
      <button className="btn btn-secondary" style={{ marginTop: 8, width: '100%' }}
        onClick={() => setMode('pick')}>
        ← Back
      </button>
    </div>
  );

  if (mode === 'result' && result) {
    const severityColor = SEVERITY_COLORS[result.severity] || 'var(--text-primary)';
    const maxScore = result.type === 'phq9' ? 27 : 21;
    return (
      <div style={{ maxWidth: 700, margin: '0 auto', padding: '40px 24px' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', marginBottom: 24 }}>
          Your Results
        </h2>

        {/* Score card */}
        <div className="card" style={{ marginBottom: 20, borderColor: `${severityColor}33` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div className="badge badge-green" style={{ marginBottom: 8 }}>
                {result.type === 'phq9' ? 'PHQ-9 Result' : 'GAD-7 Result'}
              </div>
              <h3 style={{ fontSize: '2.5rem', fontFamily: 'var(--font-display)', color: severityColor }}>
                {result.total_score} / {maxScore}
              </h3>
              <p style={{ color: severityColor, fontWeight: 600, fontSize: '1.1rem', marginTop: 4 }}>
                {result.severity}
              </p>
            </div>
          </div>
          <ScoreBar score={result.total_score} max={maxScore} />
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: 16, lineHeight: 1.7 }}>
            {result.recommendation}
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: 8 }}>
            Next step: {result.next_step}
          </p>
        </div>

        {/* Crisis */}
        {result.risk?.show_helplines && (
          <CrisisBanner helplines={result.risk.helplines} />
        )}

        {/* Exercises */}
        {result.exercises?.map((ex, i) => (
          <ExerciseCard key={i} exercise={ex} />
        ))}

        <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
          <button className="btn btn-secondary" style={{ flex: 1 }}
            onClick={() => { setMode('pick'); setResult(null); }}>
            Take Another
          </button>
          <button className="btn btn-primary" style={{ flex: 1 }}
            onClick={() => window.location.href = '/chat'}>
            Talk to MindBridge →
          </button>
        </div>
      </div>
    );
  }

  return null;
}
