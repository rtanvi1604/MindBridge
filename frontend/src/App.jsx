import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Chat from './pages/Chat';
import Assessment from './pages/Assessment';
import Dashboard from './pages/Dashboard';
import Learn from './pages/Learn';
import './styles/global.css';

const SESSION_ID = `session_${Date.now()}`;

export default function App() {
  const [sessionId] = useState(SESSION_ID);
  const [phq9Done, setPhq9Done] = useState(false);
  const [phq9Score, setPhq9Score] = useState(null);

  return (
    <Router>
      <div className="app-root">
        <Navbar />
        <main className="app-main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/chat"
              element={
                <Chat
                  sessionId={sessionId}
                  phq9Done={phq9Done}
                  phq9Score={phq9Score}
                />
              }
            />
            <Route
              path="/assessment"
              element={
                <Assessment
                  sessionId={sessionId}
                  onComplete={(score) => {
                    setPhq9Done(true);
                    setPhq9Score(score);
                  }}
                />
              }
            />
            <Route path="/dashboard" element={<Dashboard sessionId={sessionId} />} />
            <Route path="/learn" element={<Learn />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
