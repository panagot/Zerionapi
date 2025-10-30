import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import HomePage from './components/HomePage';
import LeaderboardPage from './components/LeaderboardPage';
import TournamentsPage from './components/TournamentsPage';
import AnalyticsPage from './components/AnalyticsPage';
import CommunityPage from './components/CommunityPage';
import ErrorBoundary from './components/ErrorBoundary';

const Navigation: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="header">
      <nav className="nav">
        <Link to="/" className="logo">🏆 Portfolio Battle Arena</Link>
        <ul className="nav-links">
          <li><Link to="/" className={isActive('/') ? 'active' : ''}>Home</Link></li>
          <li><Link to="/leaderboard" className={isActive('/leaderboard') ? 'active' : ''}>Leaderboard</Link></li>
          <li><Link to="/tournaments" className={isActive('/tournaments') ? 'active' : ''}>Tournaments</Link></li>
          <li><Link to="/analytics" className={isActive('/analytics') ? 'active' : ''}>Analytics</Link></li>
          <li><Link to="/community" className={isActive('/community') ? 'active' : ''}>Community</Link></li>
        </ul>
        <div className="status-indicator">
          <div className="status-dot"></div>
          <span>Live Zerion Data</span>
        </div>
      </nav>
    </header>
  );
};

const Footer: React.FC = () => (
  <footer style={{ textAlign: 'center', padding: '2rem 0', marginTop: '4rem', borderTop: '1px solid var(--glass-border)' }}>
    <p style={{ color: 'var(--gray-light)', marginBottom: '1rem' }}>
      <strong>Powered by Zerion API</strong> • Real-time portfolio data across 55+ blockchains
    </p>
    <p style={{ fontSize: '0.875rem', color: 'var(--gray)' }}>
      Built for the Zerion x Cypherpunk Hackathon • Live Data • No Mock Data
    </p>
  </footer>
);

const App: React.FC = () => {
  return (
    <Router>
      <div className="container">
        <Navigation />
        
        <main className="main-content">
          <ErrorBoundary>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/leaderboard" element={<LeaderboardPage />} />
              <Route path="/tournaments" element={<TournamentsPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/community" element={<CommunityPage />} />
            </Routes>
          </ErrorBoundary>
        </main>
        
        <Footer />
      </div>
    </Router>
  );
};

export default App;