import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const links = [
  { to: '/', label: 'Home' },
  { to: '/chat', label: '💬 Chat' },
  { to: '/assessment', label: '📋 Assessment' },
  { to: '/dashboard', label: '📊 Dashboard' },
  { to: '/learn', label: '📚 Learn' },
];

export default function Navbar() {
  const { pathname } = useLocation();
  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        🧠 Mind<span>Bridge</span>
      </Link>
      <div className="navbar-links">
        {links.map(l => (
          <Link
            key={l.to}
            to={l.to}
            className={`nav-link${pathname === l.to ? ' active' : ''}`}
          >
            {l.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
