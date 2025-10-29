import React, { useEffect, useState } from 'react';

type Wallet = {
  address: string;
  name: string;
  totalValue: number;
  totalPnL: number;
  score: number;
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

  return (
    <div style={{ padding: 24, maxWidth: 960, margin: '0 auto', color: '#fff', background: '#0b0c10', minHeight: '100vh' }}>
      <h1>Portfolio Battle Arena (React)</h1>
      <p>Powered by Zerion API • Live Data</p>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: '#ef4444' }}>{error}</p>}
      {!loading && !error && (
        <div>
          <h2>Leaderboard</h2>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {leaderboard.map((w, idx) => (
              <li key={w.address} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', background: 'rgba(255,255,255,0.05)', marginBottom: 8, borderRadius: 8 }}>
                <div>
                  <strong>#{idx + 1} {w.name}</strong>
                  <div style={{ fontSize: 12, color: '#9ca3af' }}>{w.address.slice(0, 6)}...{w.address.slice(-4)}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div>${(w.totalValue || 0).toLocaleString()}</div>
                  <div style={{ color: (w.totalPnL || 0) >= 0 ? '#10b981' : '#ef4444' }}>
                    ${(w.totalPnL || 0).toLocaleString()}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}


