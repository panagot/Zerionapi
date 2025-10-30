import React, { useEffect, useState } from 'react';

type Wallet = {
  address: string;
  name: string;
  totalValue: number;
  totalPnL: number;
  score: number;
  description?: string;
  portfolio?: {
    positionsCount?: number;
  };
  winRate?: number;
};

const HomePage: React.FC = () => {
  const [leaderboard, setLeaderboard] = useState<Wallet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/leaderboard');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        console.log('HomePage - Fetched data:', data);
        setLeaderboard(data.wallets || []);
      } catch (e: any) {
        console.error('HomePage - Error fetching data:', e);
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
    <section className="page active" id="home">
      {/* Project Overview (Hackathon requirement) */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div className="card-header">
          <h2 className="card-title">What is Portfolio Battle Arena?</h2>
          
        </div>
        <div style={{ color: 'var(--gray-light)', lineHeight: 1.6 }}>
          <p style={{ marginBottom: '1rem' }}>
            Portfolio Battle Arena is a social trading and analytics app where onchain portfolios compete in a live
            leaderboard. Users discover elite wallets, analyze strategies, and join tournaments — all rendered with
            real-time onchain data.
          </p>
          <div className="grid grid-cols-3" style={{ gap: '1rem' }}>
            <div style={{ background: 'var(--glass)', border: '1px solid var(--glass-border)', borderRadius: '12px', padding: '1rem' }}>
              <h4 style={{ color: 'var(--white)', marginBottom: '.5rem' }}>Concept</h4>
              <p>
                Gamified portfolio tracking: addresses are ranked by value, PnL, and risk-adjusted performance.
                Each wallet has a detailed profile (Overview, Assets, Performance, Transactions, Social).
              </p>
            </div>
            <div style={{ background: 'var(--glass)', border: '1px solid var(--glass-border)', borderRadius: '12px', padding: '1rem' }}>
              <h4 style={{ color: 'var(--white)', marginBottom: '.5rem' }}>Target Users</h4>
              <p>
                DeFi traders, analysts, and communities who want transparent onchain performance, copy-trading
                inspiration, and tournament-style competition.
              </p>
            </div>
            <div style={{ background: 'var(--glass)', border: '1px solid var(--glass-border)', borderRadius: '12px', padding: '1rem' }}>
              <h4 style={{ color: 'var(--white)', marginBottom: '.5rem' }}>Zerion API Usage</h4>
              <ul style={{ marginLeft: '1rem' }}>
                <li>Wallet portfolio, PnL, and positions for real asset breakdowns</li>
                <li>Transactions for activity feeds and analysis</li>
                <li>Asset metadata and prices for charts and rankings</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="hero">
        <h1>Portfolio Battle Arena</h1>
        
        <p className="hero-subtitle">
          The ultimate social trading platform where DeFi meets competition. Track 55+ blockchains, discover new tokens, and battle with the world's best traders using real-time Zerion data. From memecoins to DeFi protocols - manage it all in one place.
        </p>
        <div className="hero-features">
          {[
            { icon: 'fa-chart-line', label: 'Real-time PnL Tracking' },
            { icon: 'fa-users', label: 'Social Trading' },
            { icon: 'fa-trophy', label: 'Competitive Battles' },
            { icon: 'fa-search', label: 'Token Discovery' },
            { icon: 'fa-copy', label: 'Copytrading' },
            { icon: 'fa-bell', label: 'Notifications' },
            { icon: 'fa-wallet', label: 'Multi-chain Wallets' },
            { icon: 'fa-bolt', label: 'Real-time Webhooks' },
            { icon: 'fa-chart-bar', label: 'Advanced Analytics' },
            { icon: 'fa-shield-alt', label: 'Risk Controls' },
            { icon: 'fa-sync', label: 'Auto-Rebalance' },
            { icon: 'fa-star', label: 'Strategy Ratings' },
            { icon: 'fa-fire', label: 'Trending Tokens' },
            { icon: 'fa-network-wired', label: 'DeFi Protocols' },
            { icon: 'fa-comments', label: 'Community Chat' },
            { icon: 'fa-bullseye', label: 'Goals & Milestones' }
          ].map((f, idx) => (
            <div key={idx} className="hero-feature">
              <i className={`fas ${f.icon}`}></i>
              <span>{f.label}</span>
            </div>
          ))}
        </div>
        
        {/* Live Stats Dashboard */}
        <div style={{ marginBottom: '3rem', marginTop: '3rem' }}>
          <div className="stats-grid" style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div className="stat-card">
              <div className="stat-value" style={{ fontSize: '1.5rem', color: 'var(--primary)' }}>
                {formatCurrency(leaderboard.reduce((sum, w) => sum + (w.totalValue || 0), 0))}
              </div>
              <div className="stat-label">Total Portfolio Value</div>
              <div className="stat-change positive">+0%</div>
            </div>
            <div className="stat-card">
              <div className="stat-value" style={{ fontSize: '1.5rem', color: 'var(--success)' }}>
                {leaderboard.length}
              </div>
              <div className="stat-label">Active Traders</div>
              <div className="stat-change positive">+0</div>
            </div>
            <div className="stat-card">
              <div className="stat-value" style={{ fontSize: '1.5rem', color: 'var(--warning)' }}>
                {leaderboard.reduce((sum, w) => sum + (w.portfolio?.positionsCount || 0), 0)}
              </div>
              <div className="stat-label">Total Trades</div>
              <div className="stat-change positive">+0</div>
            </div>
            <div className="stat-card">
              <div className="stat-value" style={{ fontSize: '1.5rem', color: '#3b82f6' }}>
                {leaderboard.length > 0
                  ? `${(((leaderboard.reduce((sum, w) => sum + (w.winRate || 0), 0)) / leaderboard.length) * 100).toFixed(1)}%`
                  : '0%'}
              </div>
              <div className="stat-label">Avg Win Rate</div>
              <div className="stat-change positive">+0%</div>
            </div>
            <div className="stat-card">
              <div className="stat-value" style={{ fontSize: '1.5rem', color: 'var(--white)' }}>
                {formatCurrency(leaderboard.reduce((sum, w) => sum + (w.totalPnL || 0), 0))}
              </div>
              <div className="stat-label">Total PnL</div>
              <div className="stat-change positive">+0%</div>
            </div>
            <div className="stat-card">
              <div className="stat-value" style={{ fontSize: '1.5rem', color: '#8b5cf6' }}>
                {leaderboard.reduce((sum, w) => sum + (w.portfolio?.positionsCount || 0), 0)}
              </div>
              <div className="stat-label">Total Positions</div>
              <div className="stat-change positive">+0</div>
            </div>
            <div className="stat-card">
              <div className="stat-value" style={{ fontSize: '1.5rem', color: 'var(--success)' }}>
                {leaderboard.length}
              </div>
              <div className="stat-label">Live Wallets</div>
              <div className="stat-change positive">+0</div>
            </div>
            <div className="stat-card">
              <div className="stat-value" style={{ fontSize: '1.5rem', color: 'var(--primary)' }}>
                {leaderboard.length > 0 ? formatCurrency(leaderboard.reduce((sum, w) => sum + (w.totalValue || 0), 0) / leaderboard.length) : '$0'}
              </div>
              <div className="stat-label">Avg Portfolio Value</div>
              <div className="stat-change positive">+0%</div>
            </div>
          </div>
          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <div className="status-indicator" style={{ display: 'inline-flex', padding: '8px 16px', background: 'var(--glass)', borderRadius: '20px', border: '1px solid var(--glass-border)' }}>
              <div className="status-dot" style={{ width: '8px', height: '8px' }}></div>
              <span style={{ fontSize: '0.875rem' }}>Live Zerion Data • 55+ Blockchains • Real-time Updates</span>
            </div>
          </div>
        </div>
      </div>

      {/* Join the Arena Form */}
      <section className="card wallet-form">
        <div className="card-header">
          <h2 className="card-title">Join the Arena</h2>
          <p className="card-subtitle">Enter your wallet to start competing</p>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); }}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="address" className="form-label">
                <i className="fas fa-wallet"></i>
                Wallet Address *
              </label>
              <input type="text" id="address" name="address" className="form-input" placeholder="0x..." required />
            </div>
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                <i className="fas fa-user"></i>
                Display Name
              </label>
              <input type="text" id="name" name="name" className="form-input" placeholder="Your professional trading name" />
            </div>
            <div className="form-group" style={{ flex: '0 0 auto' }}>
              <button type="submit" className="btn" style={{ height: 'fit-content', padding: '1rem 2rem', whiteSpace: 'nowrap' }}>
                <i className="fas fa-rocket"></i>
                Enter Battle Arena
              </button>
            </div>
          </div>
          <div className="form-group full-width">
            <label htmlFor="description" className="form-label">
              <i className="fas fa-info-circle"></i>
              Trading Strategy (Optional)
            </label>
            <textarea id="description" name="description" className="form-input" placeholder="Describe your trading approach, risk tolerance, and specializations..." rows={2}></textarea>
          </div>
        </form>
      </section>

      {/* Powered by Zerion API Showcase */}
      <section className="card" style={{ marginTop: '3rem' }}>
        <div className="card-header">
          <h3 className="card-title">Zerion API Capabilities</h3>
          <div className="status-indicator">
            <div className="status-dot"></div>
            <span>Live Data</span>
          </div>
        </div>
        <div className="zerion-showcase">
          <div className="showcase-grid">
            <div className="showcase-item">
              <div className="showcase-icon">
                <i className="fas fa-chart-line"></i>
              </div>
              <h4>Real-time Portfolio & PnL</h4>
              <p>Track balances, positions, and profit & loss across 55+ blockchains in real-time</p>
            </div>
            <div className="showcase-item">
              <div className="showcase-icon">
                <i className="fas fa-history"></i>
              </div>
              <h4>Transactions & History</h4>
              <p>Decoded swaps, transfers, approvals, and even bundled transactions</p>
            </div>
            <div className="showcase-item">
              <div className="showcase-icon">
                <i className="fas fa-chart-bar"></i>
              </div>
              <h4>Charts & Market Data</h4>
              <p>Price charts, asset metadata, and token discovery across all chains</p>
            </div>
            <div className="showcase-item">
              <div className="showcase-icon">
                <i className="fas fa-bell"></i>
              </div>
              <h4>Webhooks & Notifications</h4>
              <p>Address activity, transfers, and contract interactions in real-time</p>
            </div>
          </div>
        </div>
      </section>

      {/* Top Performers Preview */}
      <section className="card" style={{ marginTop: '3rem' }}>
        <div className="card-header">
          <h3 className="card-title">Top Performers</h3>
          <div className="status-indicator">
            <div className="status-dot"></div>
            <span>Live Rankings</span>
          </div>
        </div>
        <div className="leaderboard-preview">
          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
            </div>
          ) : error ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--danger)' }}>
              <i className="fas fa-exclamation-triangle" style={{ fontSize: '2rem', marginBottom: '1rem' }}></i>
              <p>{error}</p>
            </div>
          ) : leaderboard.length > 0 ? (
            leaderboard.slice(0, 5).map((wallet, index) => (
              <div key={wallet.address} className="leaderboard-item">
                <div className="rank">#{index + 1}</div>
                <div className="wallet-info">
                  <div className="avatar">{wallet.name.charAt(0).toUpperCase()}</div>
                  <div className="wallet-details">
                    <h3>{wallet.name}</h3>
                    <p>{wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}</p>
                  </div>
                </div>
                <div className="wallet-stats">
                  <div className="value">{formatCurrency(wallet.totalValue || 0)}</div>
                  <div className={`pnl ${(wallet.totalPnL || 0) >= 0 ? 'positive' : 'negative'}`}>
                    {formatCurrency(wallet.totalPnL || 0)}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--gray-light)' }}>
              <i className="fas fa-trophy" style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.5 }}></i>
              <p>No wallets found</p>
            </div>
          )}
        </div>
        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <button className="btn btn-secondary">
            <i className="fas fa-trophy"></i>
            View Full Leaderboard
          </button>
        </div>
      </section>

      {/* Stats Overview (Bottom) */}
      <section className="stats-grid" style={{ marginTop: '3rem' }}>
        <div className="stat-card">
          <div className="stat-value">{leaderboard.length}</div>
          <div className="stat-label">Active Traders</div>
          <div className="stat-change positive">+0%</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{formatCurrency(leaderboard.reduce((sum, w) => sum + (w.totalValue || 0), 0))}</div>
          <div className="stat-label">Total Portfolio Value</div>
          <div className="stat-change positive">+0%</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{leaderboard[0]?.score || 0}</div>
          <div className="stat-label">Highest Score</div>
          <div className="stat-change positive">+0%</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">
            {leaderboard.length > 0 ? `${(leaderboard.reduce((sum, w) => sum + ((w.totalPnL || 0) / (w.totalValue || 1)), 0) / leaderboard.length * 100).toFixed(1)}%` : '0%'}
          </div>
          <div className="stat-label">Average PnL</div>
          <div className="stat-change positive">+0%</div>
        </div>
      </section>
    </section>
  );
};

export default HomePage;
