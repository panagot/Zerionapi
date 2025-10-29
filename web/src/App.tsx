import React, { useEffect, useState } from 'react';

type Wallet = {
  address: string;
  name: string;
  totalValue: number;
  totalPnL: number;
  score: number;
  description?: string;
};

export default function App() {
  const [leaderboard, setLeaderboard] = useState<Wallet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await fetch('/api/leaderboard');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setLeaderboard(data.leaderboard || []);
      } catch (e: any) {
        setError(e.message || 'Failed to load leaderboard');
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  return (
    <div className="container">
      {/* Header */}
      <header className="header">
        <nav className="nav">
          <a href="#" className="logo">🏆 Portfolio Battle Arena</a>
          <ul className="nav-links">
            <li><a href="#leaderboard">Leaderboard</a></li>
            <li><a href="#tournaments">Tournaments</a></li>
            <li><a href="#analytics">Analytics</a></li>
            <li><a href="#community">Community</a></li>
          </ul>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <h1>Portfolio Battle Arena</h1>
        <p>DeFi meets competition. Track, battle, and dominate across 55+ blockchains with real-time Zerion API data.</p>
        <div className="status-indicator">
          <div className="status-dot"></div>
          <span>Live Zerion Data • 55+ Blockchains • Real-time Updates</span>
        </div>
      </section>

      {/* Leaderboard Section */}
      <section className="card">
        <div className="card-header">
          <h2 className="card-title">🏆 Live Leaderboard</h2>
          <div className="status-indicator">
            <div className="status-dot"></div>
            <span>Live Rankings</span>
          </div>
        </div>

        {loading && (
          <div className="loading">
            <div className="spinner"></div>
          </div>
        )}

        {error && (
          <div style={{ color: 'var(--danger)', textAlign: 'center', padding: '2rem' }}>
            <i className="fas fa-exclamation-triangle" style={{ fontSize: '2rem', marginBottom: '1rem' }}></i>
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && leaderboard.length > 0 && (
          <div>
            {leaderboard.map((wallet, index) => (
              <div key={wallet.address} className="leaderboard-item">
                <div className="rank">#{index + 1}</div>
                <div className="wallet-info">
                  <div className="avatar">
                    {wallet.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="wallet-details">
                    <h3>{wallet.name}</h3>
                    <p>{wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}</p>
                    {wallet.description && (
                      <p style={{ fontSize: '0.75rem', color: 'var(--gray)' }}>{wallet.description}</p>
                    )}
                  </div>
                </div>
                <div className="wallet-stats">
                  <div className="value">{formatCurrency(wallet.totalValue || 0)}</div>
                  <div className={`pnl ${(wallet.totalPnL || 0) >= 0 ? 'positive' : 'negative'}`}>
                    {formatCurrency(wallet.totalPnL || 0)}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--gray-light)', marginTop: '0.25rem' }}>
                    Score: {wallet.score || 0}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && !error && leaderboard.length === 0 && (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--gray-light)' }}>
            <i className="fas fa-trophy" style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.5 }}></i>
            <p>No wallets found. Add some addresses to see the leaderboard!</p>
          </div>
        )}
      </section>

      {/* Stats Section */}
      <section className="card">
        <div className="card-header">
          <h2 className="card-title">📊 Live Statistics</h2>
          <div className="status-indicator">
            <div className="status-dot"></div>
            <span>Real-time Data</span>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div style={{ textAlign: 'center', padding: '1.5rem', background: 'var(--glass)', borderRadius: '12px' }}>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--primary)', marginBottom: '0.5rem' }}>
              {leaderboard.length}
            </div>
            <div style={{ color: 'var(--gray-light)' }}>Active Wallets</div>
          </div>
          <div style={{ textAlign: 'center', padding: '1.5rem', background: 'var(--glass)', borderRadius: '12px' }}>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--success)', marginBottom: '0.5rem' }}>
              {formatCurrency(leaderboard.reduce((sum, w) => sum + (w.totalValue || 0), 0))}
            </div>
            <div style={{ color: 'var(--gray-light)' }}>Total Portfolio Value</div>
          </div>
          <div style={{ textAlign: 'center', padding: '1.5rem', background: 'var(--glass)', borderRadius: '12px' }}>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--warning)', marginBottom: '0.5rem' }}>
              {formatCurrency(leaderboard.reduce((sum, w) => sum + (w.totalPnL || 0), 0))}
            </div>
            <div style={{ color: 'var(--gray-light)' }}>Total PnL</div>
          </div>
          <div style={{ textAlign: 'center', padding: '1.5rem', background: 'var(--glass)', borderRadius: '12px' }}>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--secondary)', marginBottom: '0.5rem' }}>
              {leaderboard[0]?.score || 0}
            </div>
            <div style={{ color: 'var(--gray-light)' }}>Top Score</div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ textAlign: 'center', padding: '2rem 0', marginTop: '4rem', borderTop: '1px solid var(--glass-border)' }}>
        <p style={{ color: 'var(--gray-light)', marginBottom: '1rem' }}>
          <strong>Powered by Zerion API</strong> • Real-time portfolio data across 55+ blockchains
        </p>
        <p style={{ fontSize: '0.875rem', color: 'var(--gray)' }}>
          Built for the Zerion x Cypherpunk Hackathon • Live Data • No Mock Data
        </p>
      </footer>
    </div>
  );
}


