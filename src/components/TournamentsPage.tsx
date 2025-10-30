import React, { useEffect, useState } from 'react';


import React, { useEffect, useState } from 'react';

const TournamentsPage: React.FC = () => {
  const [tournaments, setTournaments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        setLoading(true);
        const res = await fetch('http://localhost:5000/api/tournaments');
        if (!res.ok) throw new Error('Failed to fetch tournaments');
        const data = await res.json();
        setTournaments(data.tournaments || []);
      } catch (e: any) {
        console.error('Error fetching tournaments:', e);
        setError(e.message || 'Failed to load tournaments');
      } finally {
        setLoading(false);
      }
    };
    fetchTournaments();
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  useEffect(() => {
    // Simulate loading tournaments data
    setTimeout(() => {
      setTournaments([
        {
          id: 1,
          name: "Daily DeFi Battle",
          category: "Daily",
          participants: 156,
          prizePool: 2500,
          duration: "24h",
          status: "active"
        },
        {
          id: 2,
          name: "Weekly Championship",
          category: "Weekly", 
          participants: 89,
          prizePool: 10000,
          duration: "7d",
          status: "active"
        },
        {
          id: 3,
          name: "Monthly Masters",
          category: "Monthly",
          participants: 45,
          prizePool: 50000,
          duration: "30d",
          status: "upcoming"
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <section className="page active" id="tournaments">
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
        {/* Tournament Stats Overview */}
        <div className="stats-grid" style={{ marginBottom: '2rem' }}>
          <div className="stat-card">
            <div className="stat-value" id="activeTournaments">{tournaments.filter(t => t.status === 'active').length}</div>
            <div className="stat-label">Active Tournaments</div>
            <div className="stat-change positive" id="tournamentsChange">+0</div>
          </div>
          <div className="stat-card">
            <div className="stat-value" id="totalParticipants">{tournaments.reduce((sum, t) => sum + t.participants, 0)}</div>
            <div className="stat-label">Total Participants</div>
            <div className="stat-change positive" id="participantsChange">+0</div>
          </div>
          <div className="stat-card">
            <div className="stat-value" id="totalPrizePool">{formatCurrency(tournaments.reduce((sum, t) => sum + t.prizePool, 0))}</div>
            <div className="stat-label">Total Prize Pool</div>
            <div className="stat-change positive" id="prizePoolChange">+0%</div>
          </div>
          <div className="stat-card">
            <div className="stat-value" id="avgTournamentDuration">24h</div>
            <div className="stat-label">Avg Duration</div>
            <div className="stat-change positive" id="durationChange">+0h</div>
          </div>
        </div>

        {/* Tournament Categories */}
        <div className="card" style={{ marginBottom: '2rem' }}>
          <div className="card-header">
            <h3 className="card-title">Tournament Categories</h3>
            <div className="status-indicator">
              <div className="status-dot"></div>
              <span>Live Zerion Data</span>
            </div>
          </div>
          <div className="grid grid-cols-3" style={{ gap: '1rem' }}>
            <div className="tournament-category" style={{ padding: '1.5rem', background: 'var(--glass)', borderRadius: '12px', border: '1px solid var(--glass-border)', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🏆</div>
              <h4 style={{ color: 'var(--white)', marginBottom: '0.5rem' }}>Daily Battles</h4>
              <p style={{ color: 'var(--gray-light)', fontSize: '0.875rem', marginBottom: '1rem' }}>24-hour portfolio competitions</p>
              <div className="stat-value" style={{ fontSize: '1.25rem', color: 'var(--primary)' }} id="dailyBattles">{tournaments.filter(t => t.category === 'Daily').length}</div>
              <div className="stat-label" style={{ fontSize: '0.75rem', color: 'var(--gray-light)' }}>Active</div>
            </div>
            <div className="tournament-category" style={{ padding: '1.5rem', background: 'var(--glass)', borderRadius: '12px', border: '1px solid var(--glass-border)', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⚡</div>
              <h4 style={{ color: 'var(--white)', marginBottom: '0.5rem' }}>Weekly Championships</h4>
              <p style={{ color: 'var(--gray-light)', fontSize: '0.875rem', marginBottom: '1rem' }}>7-day strategic competitions</p>
              <div className="stat-value" style={{ fontSize: '1.25rem', color: 'var(--success)' }} id="weeklyChampionships">{tournaments.filter(t => t.category === 'Weekly').length}</div>
              <div className="stat-label" style={{ fontSize: '0.75rem', color: 'var(--gray-light)' }}>Active</div>
            </div>
            <div className="tournament-category" style={{ padding: '1.5rem', background: 'var(--glass)', borderRadius: '12px', border: '1px solid var(--glass-border)', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>👑</div>
              <h4 style={{ color: 'var(--white)', marginBottom: '0.5rem' }}>Monthly Masters</h4>
              <p style={{ color: 'var(--gray-light)', fontSize: '0.875rem', marginBottom: '1rem' }}>30-day elite competitions</p>
              <div className="stat-value" style={{ fontSize: '1.25rem', color: 'var(--warning)' }} id="monthlyMasters">{tournaments.filter(t => t.category === 'Monthly').length}</div>
              <div className="stat-label" style={{ fontSize: '0.75rem', color: 'var(--gray-light)' }}>Active</div>
            </div>
          </div>
        </div>

        {/* Active Tournaments */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Active Tournaments</h2>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div className="status-indicator">
                <div className="status-dot"></div>
                <span>Live Updates</span>
              </div>
              <button className="btn btn-secondary" onClick={() => alert('Create Tournament feature coming soon!')}>
                <i className="fas fa-plus"></i>
                Create Tournament
              </button>
            </div>
          </div>
          <div id="tournamentsList">
            {loading ? (
              <div className="loading">
                <div className="spinner"></div>
              </div>
            ) : tournaments.length > 0 ? (
              tournaments.map(tournament => (
                <div key={tournament.id} className="card" style={{ marginBottom: '1rem', padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <div>
                      <h3 style={{ color: 'var(--white)', marginBottom: '0.5rem' }}>{tournament.name}</h3>
                      <p style={{ color: 'var(--gray-light)', fontSize: '0.875rem' }}>{tournament.category} • {tournament.duration}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--primary)' }}>{formatCurrency(tournament.prizePool)}</div>
                      <div style={{ fontSize: '0.875rem', color: 'var(--gray-light)' }}>Prize Pool</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '2rem' }}>
                      <div>
                        <div style={{ fontSize: '1.125rem', fontWeight: '600', color: 'var(--white)' }}>{tournament.participants}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--gray-light)' }}>Participants</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '1.125rem', fontWeight: '600', color: tournament.status === 'active' ? 'var(--success)' : 'var(--warning)' }}>
                          {tournament.status === 'active' ? 'Live' : 'Upcoming'}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--gray-light)' }}>Status</div>
                      </div>
                    </div>
                    <button className="btn">
                      <i className="fas fa-play"></i>
                      Join Tournament
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--gray-light)' }}>
                <i className="fas fa-trophy" style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.5 }}></i>
                <p>No tournaments available</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TournamentsPage;
