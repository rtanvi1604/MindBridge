import React, { useState } from 'react';

const CARDS = [
  { id: 1, category: 'depression', emoji: '🧠', title: 'What is Depression?',
    content: 'Depression is a medical condition — not a personal weakness or character flaw. It affects how you think, feel, and function. It\'s as real as diabetes or heart disease.',
    fact: 'Globally, over 280 million people live with depression. You are not alone.',
    action: 'If you\'ve felt persistently sad for more than 2 weeks, speak to a doctor or counselor.' },
  { id: 2, category: 'anxiety', emoji: '💭', title: 'Understanding Anxiety',
    content: 'Anxiety is your body\'s natural response to stress. But when it\'s constant, overwhelming, or out of proportion — it may be an anxiety disorder that can be treated.',
    fact: 'Anxiety disorders are the most common mental health condition worldwide, affecting 1 in 13 people.',
    action: 'Controlled breathing and gradual exposure are proven ways to reduce anxiety.' },
  { id: 3, category: 'stigma', emoji: '💪', title: 'Breaking the Stigma',
    content: 'In India, over half of people still view mental illness as weakness. This stigma prevents millions from seeking help. Mental illness is not weakness — it is biology.',
    fact: '70–92% of Indians with mental health conditions receive no professional help, largely due to stigma.',
    action: 'Talk openly about mental health. Normalize the conversation.' },
  { id: 4, category: 'sleep', emoji: '🌙', title: 'Sleep & Mental Health',
    content: 'Poor sleep and mental health create a vicious cycle — depression worsens sleep, and bad sleep worsens depression. Improving sleep is one of the most impactful things you can do.',
    fact: 'People with insomnia are 10x more likely to develop clinical depression.',
    action: 'Maintain a fixed sleep time, avoid screens 1 hour before bed, and keep your room cool and dark.' },
  { id: 5, category: 'exercise', emoji: '🚶', title: 'Movement as Medicine',
    content: 'Exercise is one of the most evidence-backed treatments for mild to moderate depression. It releases endorphins, reduces cortisol, and improves neuroplasticity.',
    fact: '30 minutes of moderate exercise 3x/week is as effective as antidepressants for mild depression.',
    action: 'Start with a 10-minute walk daily. Consistency matters more than intensity.' },
  { id: 6, category: 'seeking_help', emoji: '🤝', title: 'When to Seek Help',
    content: 'You don\'t need to be in crisis to see a therapist. If your feelings are affecting your work, relationships, or daily life — that\'s enough reason to reach out.',
    fact: 'The average person waits 11 years between first experiencing symptoms and seeking treatment.',
    action: 'Reach out today. iCall: 9152987821 | Tele-MANAS: 14416' },
  { id: 7, category: 'self_care', emoji: '🌸', title: 'Self-Care is Not Selfish',
    content: 'Rest, boundaries, saying no, taking breaks — these are not luxuries. They are essential for mental health, especially for students under academic pressure.',
    fact: 'Chronic academic stress is one of the top contributors to anxiety among Indian college students.',
    action: 'Schedule 20 minutes of personal time daily — no phone, no studying. Just rest.' },
  { id: 8, category: 'connection', emoji: '❤️', title: 'The Power of Connection',
    content: 'Social isolation significantly worsens mental health. Even brief, meaningful conversations can reduce cortisol and increase oxytocin.',
    fact: 'Loneliness has the same health impact as smoking 15 cigarettes a day.',
    action: 'Send one message to someone you haven\'t talked to in a while.' },
];

const CATEGORIES = ['all', 'depression', 'anxiety', 'stigma', 'sleep', 'exercise', 'seeking_help', 'self_care', 'connection'];

export default function Learn() {
  const [active, setActive] = useState('all');
  const [expanded, setExpanded] = useState(null);

  const filtered = active === 'all' ? CARDS : CARDS.filter(c => c.category === active);

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 24px' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', marginBottom: 6 }}>
        Mental Health Literacy
      </h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 28 }}>
        Evidence-based knowledge to understand, destigmatize, and take action on mental health.
      </p>

      {/* Filter tabs */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 28 }}>
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={`btn btn-sm ${active === cat ? 'btn-primary' : 'btn-secondary'}`}
            style={{ textTransform: 'capitalize' }}
          >
            {cat.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Cards grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
        {filtered.map(card => (
          <div
            key={card.id}
            className="card"
            style={{
              cursor: 'pointer',
              borderColor: expanded === card.id ? 'rgba(110,231,183,0.3)' : 'var(--border)',
              transition: 'all 0.2s'
            }}
            onClick={() => setExpanded(expanded === card.id ? null : card.id)}
          >
            <div style={{ fontSize: '2rem', marginBottom: 10 }}>{card.emoji}</div>
            <span className="badge badge-purple" style={{ marginBottom: 8, textTransform: 'capitalize' }}>
              {card.category.replace('_', ' ')}
            </span>
            <h3 style={{ fontSize: '1rem', marginBottom: 8 }}>{card.title}</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.6 }}>
              {card.content}
            </p>

            {expanded === card.id && (
              <div className="fade-in" style={{ marginTop: 14 }}>
                <div style={{
                  background: 'var(--accent-soft)', borderRadius: 8,
                  padding: '10px 12px', marginBottom: 10
                }}>
                  <p style={{ fontSize: '0.8rem', color: 'var(--accent)' }}>
                    📊 <strong>Did you know?</strong> {card.fact}
                  </p>
                </div>
                <div style={{
                  background: 'var(--bg-card2)', borderRadius: 8,
                  padding: '10px 12px'
                }}>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    ✅ <strong style={{ color: 'var(--text-primary)' }}>Take action:</strong> {card.action}
                  </p>
                </div>
              </div>
            )}

            <div style={{ marginTop: 12, color: 'var(--text-muted)', fontSize: '0.75rem' }}>
              {expanded === card.id ? '▲ Show less' : '▼ Learn more'}
            </div>
          </div>
        ))}
      </div>

      {/* Helpline strip */}
      <div className="card" style={{
        marginTop: 40, background: 'rgba(110,231,183,0.04)',
        borderColor: 'rgba(110,231,183,0.2)', textAlign: 'center'
      }}>
        <h3 style={{ fontSize: '1rem', marginBottom: 12, color: 'var(--accent)' }}>
          🆘 Need help right now?
        </h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 16 }}>
          {[
            { name: 'iCall (TISS)', number: '9152987821', hours: 'Mon–Sat 8am–10pm' },
            { name: 'Vandrevala', number: '1860-2662-345', hours: '24/7 free' },
            { name: 'Tele-MANAS', number: '14416', hours: '24/7 Govt.' },
            { name: 'NIMHANS', number: '080-46110007', hours: 'Mon–Sat 9am–1pm' },
          ].map((h, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', color: 'var(--accent)' }}>
                {h.number}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{h.name} · {h.hours}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
