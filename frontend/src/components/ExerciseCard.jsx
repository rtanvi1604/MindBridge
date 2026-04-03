import React, { useState } from 'react';

export default function ExerciseCard({ exercise }) {
  const [open, setOpen] = useState(false);
  if (!exercise) return null;
  return (
    <div className="card fade-in" style={{ borderColor: 'rgba(110,231,183,0.2)', marginTop: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span className="badge badge-green" style={{ marginBottom: 6 }}>
            🧘 Coping Exercise
          </span>
          <h4 style={{ fontSize: '1rem', marginTop: 4 }}>{exercise.title}</h4>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.83rem', marginTop: 4 }}>
            ⏱ {exercise.duration} · {exercise.description}
          </p>
        </div>
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => setOpen(o => !o)}
          style={{ flexShrink: 0, marginLeft: 16 }}
        >
          {open ? 'Hide' : 'Try it →'}
        </button>
      </div>

      {open && (
        <div style={{ marginTop: 16 }}>
          <ol style={{ paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {exercise.steps.map((s, i) => (
              <li key={i} style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                {s}
              </li>
            ))}
          </ol>
          {exercise.why_it_works && (
            <p style={{
              marginTop: 12, padding: '10px 14px',
              background: 'var(--accent-soft)', borderRadius: 8,
              fontSize: '0.8rem', color: 'var(--accent)'
            }}>
              💡 <strong>Why it works:</strong> {exercise.why_it_works}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
