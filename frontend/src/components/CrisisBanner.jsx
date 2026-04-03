import React from 'react';

export default function CrisisBanner({ helplines = [] }) {
  return (
    <div className="crisis-banner fade-in">
      <h3>🚨 You are not alone — help is available right now</h3>
      <p>
        If you're having thoughts of hurting yourself, please reach out to a
        crisis counselor immediately. It's free, confidential, and available 24/7.
      </p>
      <div className="helpline-list">
        {helplines.map((h, i) => (
          <div key={i} className="helpline-chip">
            <strong>{h.number}</strong>
            {h.name} · {h.hours}
          </div>
        ))}
      </div>
    </div>
  );
}
