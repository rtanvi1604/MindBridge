import React from 'react';
import { Link } from 'react-router-dom';

const STATS = [
  { value: '197M', label: 'Indians with a mental disorder' },
  { value: '92%', label: 'receive no professional help' },
  { value: '0.75', label: 'psychiatrists per 100,000 people' },
  { value: '14416', label: 'Tele-MANAS helpline (24/7, free)' },
];

const FEATURES = [
  { emoji: '💬', title: 'AI Chat Support', desc: 'Talk to our empathetic AI — it listens, responds with care, and helps you understand what you\'re feeling.' },
  { emoji: '📋', title: 'PHQ-9 & GAD-7 Assessment', desc: 'Clinically validated tools for depression and anxiety screening used by mental health professionals worldwide.' },
  { emoji: '🚨', title: 'Crisis Detection', desc: 'Real-time risk triage automatically surfaces crisis helplines if signs of high risk are detected.' },
  { emoji: '🧘', title: 'CBT Coping Plans', desc: 'Evidence-based Cognitive Behavioral Therapy exercises tailored to your detected emotional state.' },
  { emoji: '📊', title: 'Mood Dashboard', desc: 'Track your mood daily and visualize your emotional trend over time with clear, simple charts.' },
  { emoji: '📚', title: 'Health Literacy', desc: 'Bite-sized psychoeducation cards that bust myths and reduce the stigma around mental health in India.' },
];

export default function Home() {
  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px' }}>

      {/* Hero */}
      <section style={{ padding: '72px 0 56px', textAlign: 'center' }}>
        <div className="badge badge-green" style={{ marginBottom: 20, fontSize: '0.8rem' }}>
          IIT BHU · SPIRIT 2026 · Codecure AI Hackathon
        </div>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(2.4rem, 5vw, 3.6rem)',
          lineHeight: 1.1,
          maxWidth: 680,
          margin: '0 auto'
        }}>
          Mental health support,<br />
          <em style={{ color: 'var(--accent)' }}>for every Indian.</em>
        </h1>
        <p style={{
          color: 'var(--text-secondary)',
          fontSize: '1.05rem',
          maxWidth: 520,
          margin: '20px auto 0',
          lineHeight: 1.7
        }}>
          MindBridge is an AI-powered first responder for mental health — providing
          empathetic chat support, clinical screening, crisis detection, and
          evidence-based coping tools, entirely free.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 32, flexWrap: 'wrap' }}>
          <Link to="/chat" className="btn btn-primary btn-lg">
            Start Talking →
          </Link>
          <Link to="/assessment" className="btn btn-secondary btn-lg">
            Take Assessment
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: 16, marginBottom: 64
      }}>
        {STATS.map((s, i) => (
          <div key={i} className="card" style={{ textAlign: 'center' }}>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: '2rem',
              color: i === 3 ? 'var(--accent)' : 'var(--text-primary)'
            }}>
              {s.value}
            </div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: 6 }}>
              {s.label}
            </div>
          </div>
        ))}
      </section>

      {/* Features */}
      <section style={{ marginBottom: 64 }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', marginBottom: 24 }}>
          What MindBridge does
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
          {FEATURES.map((f, i) => (
            <div key={i} className="card">
              <div style={{ fontSize: '1.8rem', marginBottom: 12 }}>{f.emoji}</div>
              <h3 style={{ fontSize: '1rem', marginBottom: 8 }}>{f.title}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Disclaimer */}
      <div className="card" style={{
        borderColor: 'rgba(251,191,36,0.2)',
        background: 'rgba(251,191,36,0.04)',
        marginBottom: 48
      }}>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
          ⚠️ <strong style={{ color: 'var(--warning)' }}>Medical Disclaimer:</strong>{' '}
          MindBridge is a mental health support tool, not a substitute for professional
          medical advice, diagnosis, or treatment. If you are in crisis, please call
          <strong style={{ color: 'var(--accent)' }}> Tele-MANAS: 14416</strong> or{' '}
          <strong style={{ color: 'var(--accent)' }}>iCall: 9152987821</strong> immediately.
        </p>
      </div>
    </div>
  );
}
