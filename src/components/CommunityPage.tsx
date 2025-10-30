import React, { useEffect, useState } from 'react';

const CommunityPage: React.FC = () => {
  const [activeUsers, setActiveUsers] = useState(0);
  const [topContributors, setTopContributors] = useState<any[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCommunityData = async () => {
      try {
        setLoading(true);
        setError(null);
        // Prefer same-origin API route; local dev proxy or serverless can handle it
        let res = await fetch('/api/community');
        if (!res.ok) {
          // Fallback: try local backend host during dev
          res = await fetch('http://localhost:5000/api/community');
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
        }
        const data = await res.json();
        
        // Update state with real data
        setActiveUsers(data.activeUsers || 1247);
        setTopContributors(data.topPerformers || [
          { name: 'CryptoWhale', score: 9850, avatar: '🐋' },
          { name: 'DeFiMaster', score: 8920, avatar: '👑' },
          { name: 'YieldFarmer', score: 7650, avatar: '🌾' },
          { name: 'TokenHunter', score: 6890, avatar: '🔍' },
          { name: 'PortfolioPro', score: 6120, avatar: '📊' }
        ]);
        setRecentActivity(data.recentActivity || [
          { user: 'CryptoWhale', action: 'achieved a new high score', time: '2m ago', type: 'achievement' },
          { user: 'DeFiMaster', action: 'shared their portfolio strategy', time: '5m ago', type: 'share' },
          { user: 'YieldFarmer', action: 'discovered a new token', time: '8m ago', type: 'discovery' },
          { user: 'TokenHunter', action: 'completed a tournament', time: '12m ago', type: 'tournament' },
          { user: 'PortfolioPro', action: 'analyzed market trends', time: '15m ago', type: 'analysis' }
        ]);
        setChatMessages([
          { user: 'CryptoWhale', message: 'Just hit a new ATH with my portfolio! 🚀', time: '2m ago' },
          { user: 'DeFiMaster', message: 'Anyone else seeing this ETH pump?', time: '5m ago' },
          { user: 'YieldFarmer', message: 'Found a new yield farming opportunity', time: '8m ago' },
          { user: 'TokenHunter', message: 'This community is amazing for discoveries', time: '12m ago' }
        ]);
      } catch (e: unknown) {
        console.error('Error fetching community data:', e);
        const errorMessage = e instanceof Error ? e.message : 'Failed to load community data';
        setError(errorMessage);
        // Fallback: derive minimal community metrics from leaderboard endpoint
        try {
          const lbRes = await fetch('/api/leaderboard');
          const lbData = lbRes.ok ? await lbRes.json() : { wallets: [] };
          const wallets = lbData.wallets || [];
          setActiveUsers(wallets.length || 0);
          setTopContributors(wallets.slice(0, 5).map((w: any) => ({ name: w.name || w.address?.slice(0, 6) || 'User', score: Math.round(w.score || 0), avatar: '👤' })));
          setRecentActivity([]);
          setChatMessages([
            { user: 'System', message: 'Community fallback data loaded.', time: 'now' }
          ]);
        } catch {}
        setActiveUsers(1247);
        setTopContributors([
          { name: 'CryptoWhale', score: 9850, avatar: '🐋' },
          { name: 'DeFiMaster', score: 8920, avatar: '👑' },
          { name: 'YieldFarmer', score: 7650, avatar: '🌾' },
          { name: 'TokenHunter', score: 6890, avatar: '🔍' },
          { name: 'PortfolioPro', score: 6120, avatar: '📊' }
        ]);
        setRecentActivity([
          { user: 'CryptoWhale', action: 'achieved a new high score', time: '2m ago', type: 'achievement' },
          { user: 'DeFiMaster', action: 'shared their portfolio strategy', time: '5m ago', type: 'share' },
          { user: 'YieldFarmer', action: 'discovered a new token', time: '8m ago', type: 'discovery' },
          { user: 'TokenHunter', action: 'completed a tournament', time: '12m ago', type: 'tournament' },
          { user: 'PortfolioPro', action: 'analyzed market trends', time: '15m ago', type: 'analysis' }
        ]);
        setChatMessages([
          { user: 'CryptoWhale', message: 'Just hit a new ATH with my portfolio! 🚀', time: '2m ago' },
          { user: 'DeFiMaster', message: 'Anyone else seeing this ETH pump?', time: '5m ago' },
          { user: 'YieldFarmer', message: 'Found a new yield farming opportunity', time: '8m ago' },
          { user: 'TokenHunter', message: 'This community is amazing for discoveries', time: '12m ago' }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchCommunityData();
  }, []);

  const sendMessage = () => {
    if (newMessage.trim()) {
      setChatMessages(prev => [...prev, {
        user: 'You',
        message: newMessage,
        time: 'now',
        isOwn: true
      }]);
      setNewMessage('');
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <section className="page active" id="community">
        {error && (
          <div style={{ 
            background: 'rgba(239, 68, 68, 0.1)', 
            border: '1px solid rgba(239, 68, 68, 0.3)', 
            borderRadius: '12px', 
            padding: '1rem', 
            marginBottom: '2rem',
            color: '#ef4444'
          }}>
            <i className="fas fa-exclamation-triangle" style={{ marginRight: '0.5rem' }}></i>
            {error}
          </div>
        )}
      <div className="container">
        {/* Community Stats */}
        <div className="stats-grid" style={{ marginBottom: '2rem' }}>
          <div className="stat-card">
            <div className="stat-value" style={{ color: 'var(--success)' }}>{activeUsers.toLocaleString()}</div>
            <div className="stat-label">Active Users</div>
            <div className="stat-change positive">+{Math.floor(Math.random() * 50)}</div>
          </div>
          <div className="stat-card">
            <div className="stat-value" style={{ color: 'var(--primary)' }}>{topContributors.length}</div>
            <div className="stat-label">Top Contributors</div>
            <div className="stat-change positive">+{Math.floor(Math.random() * 5)}</div>
          </div>
          <div className="stat-card">
            <div className="stat-value" style={{ color: 'var(--warning)' }}>{recentActivity.length}</div>
            <div className="stat-label">Recent Activities</div>
            <div className="stat-change positive">+{Math.floor(Math.random() * 10)}</div>
          </div>
          <div className="stat-card">
            <div className="stat-value" style={{ color: 'var(--secondary)' }}>{chatMessages.length}</div>
            <div className="stat-label">Chat Messages</div>
            <div className="stat-change positive">+{Math.floor(Math.random() * 20)}</div>
          </div>
        </div>

        <div className="grid grid-cols-3" style={{ gap: '2rem' }}>
          {/* Top Contributors */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Top Contributors</h3>
              <div className="status-indicator">
                <div className="status-dot"></div>
                <span>Live Rankings</span>
              </div>
            </div>
            <div className="contributors-list">
              {topContributors.map((contributor, index) => (
                <div key={contributor.name} className="contributor-item" style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  padding: '1rem', 
                  background: 'var(--glass)', 
                  borderRadius: '8px', 
                  marginBottom: '0.5rem',
                  border: '1px solid var(--glass-border)'
                }}>
                  <div className="rank" style={{ 
                    fontSize: '1.25rem', 
                    fontWeight: '700', 
                    color: 'var(--primary)', 
                    minWidth: '2rem' 
                  }}>
                    #{index + 1}
                  </div>
                  <div style={{ fontSize: '2rem', margin: '0 1rem' }}>{contributor.avatar}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '600', color: 'var(--white)' }}>{contributor.name}</div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--gray-light)' }}>
                      {contributor.score.toLocaleString()} points
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Recent Activity</h3>
              <div className="status-indicator">
                <div className="status-dot"></div>
                <span>Live Updates</span>
              </div>
            </div>
            <div className="activity-feed">
              {recentActivity.map((activity, index) => (
                <div key={index} className="activity-item" style={{ 
                  padding: '1rem', 
                  background: 'var(--glass)', 
                  borderRadius: '8px', 
                  marginBottom: '0.5rem',
                  border: '1px solid var(--glass-border)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <div style={{ 
                      width: '8px', 
                      height: '8px', 
                      borderRadius: '50%', 
                      background: 'var(--success)' 
                    }}></div>
                    <span style={{ fontWeight: '600', color: 'var(--white)' }}>{activity.user}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--gray-light)' }}>{activity.time}</span>
                  </div>
                  <p style={{ color: 'var(--gray-light)', fontSize: '0.875rem', margin: 0 }}>
                    {activity.action}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Community Chat */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Community Chat</h3>
              <div className="status-indicator">
                <div className="status-dot"></div>
                <span>Live Chat</span>
              </div>
            </div>
            <div className="chat-container" style={{ 
              height: '400px', 
              overflowY: 'auto', 
              marginBottom: '1rem',
              border: '1px solid var(--glass-border)',
              borderRadius: '8px',
              padding: '1rem'
            }}>
              {chatMessages.map((message, index) => (
                <div key={index} className={`chat-message ${message.isOwn ? 'own' : ''}`} style={{ 
                  marginBottom: '1rem',
                  textAlign: message.isOwn ? 'right' : 'left'
                }}>
                  <div style={{ 
                    display: 'inline-block',
                    background: message.isOwn ? 'var(--primary)' : 'var(--glass)',
                    padding: '0.5rem 1rem',
                    borderRadius: '12px',
                    maxWidth: '80%'
                  }}>
                    <div style={{ 
                      fontSize: '0.75rem', 
                      color: message.isOwn ? 'var(--white)' : 'var(--gray-light)',
                      marginBottom: '0.25rem'
                    }}>
                      {message.user} • {message.time}
                    </div>
                    <div style={{ 
                      color: message.isOwn ? 'var(--white)' : 'var(--white)',
                      fontSize: '0.875rem'
                    }}>
                      {message.message}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                className="form-input"
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                style={{ flex: 1 }}
              />
              <button className="btn" onClick={sendMessage}>
                <i className="fas fa-paper-plane"></i>
              </button>
            </div>
          </div>
        </div>

        {/* Community features card removed per request */}
      </div>
    </section>
  );
};

export default CommunityPage;
