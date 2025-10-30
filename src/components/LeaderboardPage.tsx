import React, { useEffect, useState, useRef } from 'react';
import { createLineChart } from '../utils/chartUtils';

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

const LeaderboardPage: React.FC = () => {
  const [leaderboard, setLeaderboard] = useState<Wallet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'assets' | 'performance' | 'transactions' | 'social'>('overview');
  const [walletDetails, setWalletDetails] = useState<any>(null);
  const [detailsLoading, setDetailsLoading] = useState<boolean>(false);
  
  // Chart refs
  const marketChartRef = useRef<HTMLCanvasElement>(null);
  const [marketChart, setMarketChart] = useState<any>(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/leaderboard');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        console.log('LeaderboardPage - Fetched data:', data);
        setLeaderboard(data.wallets || []);
      } catch (e: any) {
        console.error('LeaderboardPage - Error fetching data:', e);
        setError(e.message || 'Failed to load leaderboard');
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

    // Initialize market chart
  useEffect(() => {
    const initializeChart = () => {
      console.log('Initializing market chart...');
      if (marketChartRef.current) {
        try {
          const ctx = marketChartRef.current.getContext('2d');
          if (ctx) {
            console.log('Creating market chart...');
            const chart = createLineChart(
              ctx,
              [100, 102, 98, 105, 110, 108, 115],
              ['1D', '2D', '3D', '1W', '2W', '1M', '2M'],
              'Market Performance',
              '#6366f1'
            );
            setMarketChart(chart);
            console.log('Market chart created successfully');
          }
        } catch (error) {
          console.error('Error creating market chart:', error);
        }
      } else {
        console.log('Market chart ref not ready');
      }
    };

    // Initialize chart after a delay to ensure DOM is ready
    const timer = setTimeout(initializeChart, 1000);
    return () => clearTimeout(timer);
  }, []); // Empty dependency array - run once on mount

    const viewWalletDetails = (wallet: Wallet) => {
    console.log('Opening wallet details for:', wallet);
    setSelectedWallet(wallet);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedWallet(null);
    setActiveTab('overview');
    setWalletDetails(null);
  };

  // Cleanup chart on unmount
  useEffect(() => {
    return () => {
      if (marketChart && typeof marketChart.destroy === 'function') {
        marketChart.destroy();
      }
    };
  }, [marketChart]);

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

  // Fetch detailed wallet data when modal opens
  useEffect(() => {
    const fetchDetails = async () => {
      if (!showModal || !selectedWallet) return;
      try {
        setDetailsLoading(true);
        const res = await fetch(`http://localhost:5000/api/wallets/${selectedWallet.address}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setWalletDetails(data);
      } catch (e) {
        console.error('Failed to fetch wallet details:', e);
      } finally {
        setDetailsLoading(false);
      }
    };
    fetchDetails();
  }, [showModal, selectedWallet]);

  return (
    <section className="page active" id="leaderboard">
      <div className="container">
        <div className="grid grid-cols-3">
          {/* Sidebar */}
          <div className="grid-cols-1">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Market Overview</h3>
              </div>
              <div className="chart-container">
                <canvas ref={marketChartRef}></canvas>
              </div>
            </div>
            
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Top Performers</h3>
              </div>
              <div id="topPerformers">
                {loading ? (
                  <div className="loading">
                    <div className="spinner"></div>
                  </div>
                ) : leaderboard.length > 0 ? (
                  leaderboard.slice(0, 3).map((wallet, index) => (
                    <div key={wallet.address} className="leaderboard-item" style={{ marginBottom: '0.5rem' }}>
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
                    <i className="fas fa-trophy" style={{ fontSize: '2rem', marginBottom: '1rem', opacity: 0.5 }}></i>
                    <p>No data available</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid-cols-2">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Battle Leaderboard</h3>
                <p className="card-subtitle" id="leaderboardCount">{leaderboard.length} warriors competing</p>
              </div>
              <div id="leaderboard">
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
                  leaderboard.map((wallet, index) => (
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
                      <button 
                        className="btn btn-secondary" 
                        style={{ marginLeft: '1rem' }}
                        onClick={() => viewWalletDetails(wallet)}
                      >
                        View Details
                      </button>
                    </div>
                  ))
                ) : (
                  <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--gray-light)' }}>
                    <i className="fas fa-trophy" style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.5 }}></i>
                    <p>No wallets found</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Wallet Details Modal */}
      {showModal && selectedWallet && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="wallet-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-section">
                <div className="modal-avatar">{selectedWallet.name.charAt(0).toUpperCase()}</div>
                <div className="modal-title-info">
                  <h3 className="modal-title">{selectedWallet.name}</h3>
                  <p className="modal-subtitle">{selectedWallet.address}</p>
                </div>
              </div>
              <button className="modal-close" onClick={closeModal}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="modal-content">
              <div className="modal-tabs">
                <button className={`modal-tab ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>Overview</button>
                <button className={`modal-tab ${activeTab === 'assets' ? 'active' : ''}`} onClick={() => setActiveTab('assets')}>Assets</button>
                <button className={`modal-tab ${activeTab === 'performance' ? 'active' : ''}`} onClick={() => setActiveTab('performance')}>Performance</button>
                <button className={`modal-tab ${activeTab === 'transactions' ? 'active' : ''}`} onClick={() => setActiveTab('transactions')}>Transactions</button>
                <button className={`modal-tab ${activeTab === 'social' ? 'active' : ''}`} onClick={() => setActiveTab('social')}>Social</button>
              </div>

              <div className="modal-tab-content">
                {activeTab === 'overview' && (
                <>
                <div className="modal-stats-grid">
                  <div className="modal-stat">
                    <div className="modal-stat-value">{selectedWallet.score?.toLocaleString() || '0'}</div>
                    <div className="modal-stat-label">Battle Score</div>
                  </div>
                  <div className="modal-stat">
                    <div className="modal-stat-value">{formatCurrency(selectedWallet.totalValue || 0)}</div>
                    <div className="modal-stat-label">Total Value</div>
                  </div>
                  <div className="modal-stat">
                    <div className="modal-stat-value">{formatCurrency(selectedWallet.totalPnL || 0)}</div>
                    <div className="modal-stat-label">Total PnL</div>
                  </div>
                  <div className="modal-stat">
                    <div className="modal-stat-value">{formatPercentage((selectedWallet.totalPnL || 0) / (selectedWallet.totalValue || 1) * 100)}</div>
                    <div className="modal-stat-label">PnL %</div>
                  </div>
                </div>

                <div className="modal-details">
                  <div className="modal-detail-row">
                    <span className="modal-detail-label">Win Rate:</span>
                    <span className="modal-detail-value">{((selectedWallet.winRate || 0) * 100).toFixed(1)}%</span>
                  </div>
                  <div className="modal-detail-row">
                    <span className="modal-detail-label">Risk Score:</span>
                    <span className="modal-detail-value">{(selectedWallet.portfolio?.riskScore || 0).toFixed(1)}/100</span>
                  </div>
                  <div className="modal-detail-row">
                    <span className="modal-detail-label">Sharpe Ratio:</span>
                    <span className="modal-detail-value">{(selectedWallet.portfolio?.sharpeRatio || 0).toFixed(2)}</span>
                  </div>
                  <div className="modal-detail-row">
                    <span className="modal-detail-label">Max Drawdown:</span>
                    <span className="modal-detail-value">{(selectedWallet.portfolio?.maxDrawdown || 0).toFixed(1)}%</span>
                  </div>
                  <div className="modal-detail-row">
                    <span className="modal-detail-label">Positions:</span>
                    <span className="modal-detail-value">{selectedWallet.portfolio?.positionsCount || 0}</span>
                  </div>
                  <div className="modal-detail-row">
                    <span className="modal-detail-label">Avg Trade Size:</span>
                    <span className="modal-detail-value">{formatCurrency(selectedWallet.portfolio?.avgTradeSize || 0)}</span>
                  </div>
                </div>

                {selectedWallet.description && (
                  <div className="modal-description">
                    <h4>Strategy Description</h4>
                    <p>{selectedWallet.description}</p>
                  </div>
                )}
                </>
                )}

                {activeTab === 'assets' && (
                  <div>
                    {detailsLoading ? (
                      <div className="loading"><div className="spinner"></div></div>
                    ) : (
                      (() => {
                        // Normalize possible Zerion shapes
                        const raw = walletDetails || {};
                        const positions =
                          raw.positions?.data ||
                          raw.positions ||
                          raw.data?.positions?.data ||
                          raw.data?.positions ||
                          raw.data?.data ||
                          [];
                        const list = Array.isArray(positions) ? positions : [];
                        if (!list.length) {
                          return (
                            <div style={{ textAlign: 'center', color: 'var(--gray-light)' }}>
                              No assets found from Zerion API
                            </div>
                          );
                        }
                        return (
                          <div className="modal-details">
                            {list.slice(0, 12).map((p: any, idx: number) => {
                              const attrs = p.attributes || p.data?.attributes || {};
                              const asset = attrs.asset || p.asset || {};
                              const symbol = asset.symbol || asset.ticker || asset.name || 'Asset';
                              const valueUsd = attrs.value_usd ?? attrs.valueUsd ?? attrs.net_value_usd ?? 0;
                              return (
                                <div key={idx} className="modal-detail-row">
                                  <span className="modal-detail-label">{symbol}</span>
                                  <span className="modal-detail-value">{formatCurrency(Number(valueUsd) || 0)}</span>
                                </div>
                              );
                            })}
                          </div>
                        );
                      })()
                    )}
                  </div>
                )}

                {activeTab === 'performance' && (
                  <div className="modal-details">
                    <div className="modal-detail-row">
                      <span className="modal-detail-label">Sharpe Ratio</span>
                      <span className="modal-detail-value">{(selectedWallet.portfolio?.sharpeRatio || 0).toFixed(2)}</span>
                    </div>
                    <div className="modal-detail-row">
                      <span className="modal-detail-label">Max Drawdown</span>
                      <span className="modal-detail-value">{(selectedWallet.portfolio?.maxDrawdown || 0).toFixed(1)}%</span>
                    </div>
                  </div>
                )}

                {activeTab === 'transactions' && (
                  <div>
                    {detailsLoading ? (
                      <div className="loading"><div className="spinner"></div></div>
                    ) : (
                      (() => {
                        const raw = walletDetails || {};
                        const txs = raw.transactions?.data || raw.transactions || raw.data?.transactions?.data || [];
                        const list = Array.isArray(txs) ? txs : [];
                        if (!list.length) {
                          return (
                            <div style={{ textAlign: 'center', color: 'var(--gray-light)' }}>No transactions found</div>
                          );
                        }
                        return (
                          <div className="modal-details">
                            {list.slice(0, 12).map((tx: any, idx: number) => {
                              const attrs = tx.attributes || tx.data?.attributes || {};
                              return (
                                <div key={idx} className="modal-detail-row">
                                  <span className="modal-detail-label">{attrs.type || 'Transaction'}</span>
                                  <span className="modal-detail-value">{new Date(attrs.mined_at || attrs.timestamp || Date.now()).toLocaleString()}</span>
                                </div>
                              );
                            })}
                          </div>
                        );
                      })()
                    )}
                  </div>
                )}

                {activeTab === 'social' && (
                  <div style={{ textAlign: 'center', color: 'var(--gray-light)' }}>
                    Social metrics coming from Zerion soon
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default LeaderboardPage;
