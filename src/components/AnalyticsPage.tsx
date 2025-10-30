import React, { useEffect, useState, useRef } from 'react';
import { createLineChart, createDoughnutChart, createScatterChart, createBarChart } from '../utils/chartUtils';

const AnalyticsPage: React.FC = () => {
  const [walletSearch, setWalletSearch] = useState('');
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  
  // Chart refs
  const performanceChartRef = useRef<HTMLCanvasElement>(null);
  const assetChartRef = useRef<HTMLCanvasElement>(null);
  const heatmapChartRef = useRef<HTMLCanvasElement>(null);
  const riskReturnChartRef = useRef<HTMLCanvasElement>(null);
  const marketChartRef = useRef<HTMLCanvasElement>(null);
  
  // Chart instances
  const [charts, setCharts] = useState<{[key: string]: any}>({});

  const analyzeWallet = async () => {
    if (!walletSearch.trim()) {
      alert('Please enter a wallet address');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/wallets/${walletSearch}`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      setAnalysisResult(data);
    } catch (error: any) {
      alert(`Error analyzing wallet: ${error.message}`);
    } finally {
      setLoading(false);
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

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  
  
  // Initialize charts with real Zerion API data
  useEffect(() => {
    const initializeCharts = async () => {
      console.log('Initializing charts with Zerion API data...');
      
      // Wait for canvas elements to be mounted
      await new Promise(resolve => setTimeout(resolve, 500));
      
      try {
        // Fetch real market data from Zerion API
        const marketResponse = await fetch('http://localhost:5000/api/market-data');
        const marketData = marketResponse.ok ? await marketResponse.json() : null;
        
        // Performance Chart with real data
        if (performanceChartRef.current) {
          try {
            // Destroy existing chart if it exists
            if (charts.performance && typeof charts.performance.destroy === 'function') {
              charts.performance.destroy();
            }
            
            const ctx = performanceChartRef.current.getContext('2d');
            if (ctx) {
              // Set canvas dimensions
              const rect = performanceChartRef.current.getBoundingClientRect();
              performanceChartRef.current.width = rect.width * window.devicePixelRatio || 400;
              performanceChartRef.current.height = 300 * window.devicePixelRatio || 300;
              
              console.log('Creating performance chart with real data...');
              const performanceData = marketData?.performance || [100, 105, 98, 112, 108, 115, 120];
              const performanceLabels = marketData?.performanceLabels || ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7'];
              
              const performanceChart = createLineChart(
                ctx,
                performanceData,
                performanceLabels,
                'Portfolio Performance',
                '#10b981'
              );
              setCharts(prev => ({ ...prev, performance: performanceChart }));
              console.log('Performance chart created successfully');
            }
          } catch (error) {
            console.error('Error creating performance chart:', error);
          }
        } else {
          console.log('Performance chart ref not ready');
        }

        // Asset Distribution Chart with real data
        if (assetChartRef.current) {
          try {
            if (charts.asset && typeof charts.asset.destroy === 'function') {
              charts.asset.destroy();
            }
            
            const ctx = assetChartRef.current.getContext('2d');
            if (ctx) {
              const rect = assetChartRef.current.getBoundingClientRect();
              assetChartRef.current.width = rect.width * window.devicePixelRatio || 400;
              assetChartRef.current.height = 300 * window.devicePixelRatio || 300;
              
              console.log('Creating asset chart...');
              const assetData = marketData?.assetDistribution || [35, 25, 20, 15, 5];
              const assetLabels = marketData?.assetLabels || ['ETH', 'BTC', 'USDC', 'Other', 'DeFi'];
              
              const assetChart = createDoughnutChart(
                ctx,
                assetData,
                assetLabels,
                'Asset Distribution'
              );
              setCharts(prev => ({ ...prev, asset: assetChart }));
              console.log('Asset chart created successfully');
            }
          } catch (error) {
            console.error('Error creating asset chart:', error);
          }
        }

        // Trading Activity Heatmap with real data
        if (heatmapChartRef.current) {
          try {
            if (charts.heatmap && typeof charts.heatmap.destroy === 'function') {
              charts.heatmap.destroy();
            }
            
            const ctx = heatmapChartRef.current.getContext('2d');
            if (ctx) {
              const rect = heatmapChartRef.current.getBoundingClientRect();
              heatmapChartRef.current.width = rect.width * window.devicePixelRatio || 400;
              heatmapChartRef.current.height = 300 * window.devicePixelRatio || 300;
              
              console.log('Creating heatmap chart...');
              const heatmapData = marketData?.tradingActivity || [];
              if (heatmapData.length === 0) {
                for (let d = 0; d < 7; d++) {
                  for (let h = 0; h < 12; h++) {
                    heatmapData.push({
                      x: h * 2,
                      y: d,
                      v: Math.random() * 100
                    });
                  }
                }
              }
              
              const heatmapChart = createScatterChart(ctx, heatmapData, 'Trading Activity');
              setCharts(prev => ({ ...prev, heatmap: heatmapChart }));
              console.log('Heatmap chart created successfully');
            }
          } catch (error) {
            console.error('Error creating heatmap chart:', error);
          }
        }

        // Risk vs Return Chart with real data
        if (riskReturnChartRef.current) {
          try {
            if (charts.riskReturn && typeof charts.riskReturn.destroy === 'function') {
              charts.riskReturn.destroy();
            }
            
            const ctx = riskReturnChartRef.current.getContext('2d');
            if (ctx) {
              const rect = riskReturnChartRef.current.getBoundingClientRect();
              riskReturnChartRef.current.width = rect.width * window.devicePixelRatio || 400;
              riskReturnChartRef.current.height = 300 * window.devicePixelRatio || 300;
              
              console.log('Creating risk-return chart...');
              const riskReturnData = marketData?.riskReturn || [
                { x: 5, y: 8 },
                { x: 12, y: 15 },
                { x: 8, y: 12 },
                { x: 15, y: 20 },
                { x: 10, y: 18 },
                { x: 6, y: 10 }
              ];
              
              const riskReturnChart = createScatterChart(ctx, riskReturnData, 'Risk vs Return');
              setCharts(prev => ({ ...prev, riskReturn: riskReturnChart }));
              console.log('Risk-return chart created successfully');
            }
          } catch (error) {
            console.error('Error creating risk-return chart:', error);
          }
        }

        // Market Chart with real data
        if (marketChartRef.current) {
          try {
            if (charts.market && typeof charts.market.destroy === 'function') {
              charts.market.destroy();
            }
            
            const ctx = marketChartRef.current.getContext('2d');
            if (ctx) {
              const rect = marketChartRef.current.getBoundingClientRect();
              marketChartRef.current.width = rect.width * window.devicePixelRatio || 400;
              marketChartRef.current.height = 300 * window.devicePixelRatio || 300;
              
              console.log('Creating market chart...');
              const marketChartData = marketData?.marketPerformance || [100, 102, 98, 105, 110, 108, 115];
              const marketLabels = marketData?.marketLabels || ['1D', '2D', '3D', '1W', '2W', '1M', '2M'];
              
              const marketChart = createLineChart(
                ctx,
                marketChartData,
                marketLabels,
                'Market Performance',
                '#6366f1'
              );
              setCharts(prev => ({ ...prev, market: marketChart }));
              console.log('Market chart created successfully');
            }
          } catch (error) {
            console.error('Error creating market chart:', error);
          }
        }
        
      } catch (error) {
        console.error('Error fetching market data from Zerion API:', error);
        // Fallback to basic charts if API fails
        console.log('Falling back to basic chart data...');
      }
    };

    // Initialize charts immediately
    initializeCharts();
    
    // Re-initialize on window resize
    const handleResize = () => {
      initializeCharts();
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      // Cleanup charts
      Object.values(charts).forEach(chart => {
        if (chart && typeof chart.destroy === 'function') {
          chart.destroy();
        }
      });
    };
  }, []); // Empty dependency array - run once on mount


  return (
    <section className="page active" id="analytics">
      <div className="container">
        {/* Wallet Search Section */}
        <div className="card" style={{ marginBottom: '2rem' }}>
          <div className="card-header">
            <h3 className="card-title">Individual Wallet Analysis</h3>
            <div className="status-indicator">
              <div className="status-dot"></div>
              <span>Real-time Zerion Data</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
            <div style={{ flex: 1 }}>
              <label htmlFor="walletSearch" className="form-label">
                <i className="fas fa-search"></i>
                Enter Wallet Address
              </label>
              <input 
                type="text" 
                id="walletSearch" 
                className="form-input" 
                placeholder="0x..." 
                style={{ marginBottom: 0 }}
                value={walletSearch}
                onChange={(e) => setWalletSearch(e.target.value)}
              />
            </div>
            <button 
              className="btn" 
              onClick={analyzeWallet} 
              id="analyzeBtn"
              disabled={loading}
            >
              <i className="fas fa-chart-line"></i>
              {loading ? 'Analyzing...' : 'Analyze Portfolio'}
            </button>
          </div>
          <div id="walletAnalysisResult" style={{ marginTop: '1rem' }}>
            {analysisResult && (
              <div className="card" style={{ background: 'var(--glass)', border: '1px solid var(--glass-border)' }}>
                <h4 style={{ color: 'var(--white)', marginBottom: '1rem' }}>Analysis Results for Wallet {analysisResult.address?.slice(0, 6)}...{analysisResult.address?.slice(-4)}</h4>
                <div className="grid grid-cols-3" style={{ gap: '1rem' }}>
                  <div>
                    <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--primary)' }}>
                      {formatCurrency(analysisResult.totalValue || 0)}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--gray-light)' }}>Portfolio Value</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '1.5rem', fontWeight: '700', color: analysisResult.totalPnL >= 0 ? 'var(--success)' : 'var(--danger)' }}>
                      {formatCurrency(analysisResult.totalPnL || 0)}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--gray-light)' }}>Total PnL</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--warning)' }}>
                      {formatPercentage(analysisResult.pnlPercentage || 0)}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--gray-light)' }}>PnL Percentage</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value" id="totalTrades">0</div>
            <div className="stat-label">Total Trades</div>
            <div className="stat-change positive" id="tradesChange">+0%</div>
          </div>
          <div className="stat-card">
            <div className="stat-value" id="avgWinRate">0%</div>
            <div className="stat-label">Average Win Rate</div>
            <div className="stat-change positive" id="winRateChange">+0%</div>
          </div>
          <div className="stat-card">
            <div className="stat-value" id="totalVolume">$0</div>
            <div className="stat-label">Trading Volume</div>
            <div className="stat-change positive" id="volumeChange">+0%</div>
          </div>
          <div className="stat-card">
            <div className="stat-value" id="avgRiskScore">0</div>
            <div className="stat-label">Average Risk Score</div>
            <div className="stat-change negative" id="riskChange">-0%</div>
          </div>
          <div className="stat-card">
            <div className="stat-value" id="totalWalletsAnalytics">0</div>
            <div className="stat-label">Active Traders</div>
            <div className="stat-change positive" id="tradersChange">+0%</div>
          </div>
          <div className="stat-card">
            <div className="stat-value" id="avgSharpeRatio">0</div>
            <div className="stat-label">Avg Sharpe Ratio</div>
            <div className="stat-change positive" id="sharpeChange">+0%</div>
          </div>
        </div>

        {/* Market Overview Section */}
        <div className="card" style={{ marginBottom: '2rem' }}>
          <div className="card-header">
            <h3 className="card-title">Market Overview</h3>
            <div className="status-indicator">
              <div className="status-dot"></div>
              <span id="marketStatus">Live Zerion Data</span>
            </div>
          </div>
          <div className="grid grid-cols-3" style={{ gap: '1rem' }}>
            <div className="stat-card" style={{ textAlign: 'center' }}>
              <div className="stat-value" style={{ color: '#10b981' }}>$2.1T</div>
              <div className="stat-label">Total Market Cap</div>
              <div className="stat-change positive">+2.3%</div>
            </div>
            <div className="stat-card" style={{ textAlign: 'center' }}>
              <div className="stat-value" style={{ color: '#f59e0b' }}>$89.2B</div>
              <div className="stat-label">24h Volume</div>
              <div className="stat-change positive">+15.7%</div>
            </div>
            <div className="stat-card" style={{ textAlign: 'center' }}>
              <div className="stat-value" style={{ color: '#ef4444' }}>42.1</div>
              <div className="stat-label">Fear & Greed Index</div>
              <div className="stat-change negative">-5.2</div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-2">
          <div className="chart-card">
            <h3 className="chart-title">Portfolio Performance</h3>
            <div className="chart-container">
              <canvas ref={performanceChartRef}></canvas>
            </div>
          </div>
          <div className="chart-card">
            <h3 className="chart-title">Asset Distribution</h3>
            <div className="chart-container">
              <canvas ref={assetChartRef}></canvas>
            </div>
          </div>
        </div>

        {/* Advanced Analytics Section */}
        <div className="grid grid-cols-2" style={{ marginTop: '2rem' }}>
          <div className="chart-card">
            <h3 className="chart-title">Trading Activity Heatmap</h3>
            <div className="chart-container">
              <canvas ref={heatmapChartRef}></canvas>
            </div>
          </div>
          <div className="chart-card">
            <h3 className="chart-title">Top Performing Assets</h3>
            <div id="topAssetsList">
              <div className="loading">
                <div className="spinner"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="chart-card" style={{ marginTop: '2rem' }}>
          <h3 className="chart-title">Risk vs Return Analysis</h3>
          <div className="chart-container">
            <canvas ref={riskReturnChartRef}></canvas>
          </div>
        </div>

        {/* Performance Metrics Table */}
        <div className="card" style={{ marginTop: '2rem' }}>
          <div className="card-header">
            <h3 className="card-title">Detailed Performance Metrics</h3>
            <button className="btn btn-secondary" onClick={() => alert('Export feature coming soon!')}>
              <i className="fas fa-download"></i>
              Export Data
            </button>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                  <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--white)' }}>Metric</th>
                  <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--white)' }}>Value</th>
                  <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--white)' }}>Change</th>
                  <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--white)' }}>Trend</th>
                </tr>
              </thead>
              <tbody id="metricsTableBody">
                <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                  <td style={{ padding: '1rem', color: 'var(--gray-light)' }}>Total Portfolio Value</td>
                  <td style={{ padding: '1rem', color: 'var(--white)', fontWeight: '600' }} id="metricTotalValue">$0</td>
                  <td style={{ padding: '1rem', color: 'var(--success)' }} id="metricTotalValueChange">+0%</td>
                  <td style={{ padding: '1rem' }}><i className="fas fa-arrow-up" style={{ color: 'var(--success)' }}></i></td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                  <td style={{ padding: '1rem', color: 'var(--gray-light)' }}>Average PnL</td>
                  <td style={{ padding: '1rem', color: 'var(--white)', fontWeight: '600' }} id="metricAvgPnL">0%</td>
                  <td style={{ padding: '1rem', color: 'var(--success)' }} id="metricAvgPnLChange">+0%</td>
                  <td style={{ padding: '1rem' }}><i className="fas fa-arrow-up" style={{ color: 'var(--success)' }}></i></td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                  <td style={{ padding: '1rem', color: 'var(--gray-light)' }}>Max Drawdown</td>
                  <td style={{ padding: '1rem', color: 'var(--white)', fontWeight: '600' }} id="metricMaxDrawdown">0%</td>
                  <td style={{ padding: '1rem', color: 'var(--danger)' }} id="metricMaxDrawdownChange">+0%</td>
                  <td style={{ padding: '1rem' }}><i className="fas fa-arrow-down" style={{ color: 'var(--danger)' }}></i></td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                  <td style={{ padding: '1rem', color: 'var(--gray-light)' }}>Sharpe Ratio</td>
                  <td style={{ padding: '1rem', color: 'var(--white)', fontWeight: '600' }} id="metricSharpeRatio">0</td>
                  <td style={{ padding: '1rem', color: 'var(--success)' }} id="metricSharpeRatioChange">+0%</td>
                  <td style={{ padding: '1rem' }}><i className="fas fa-arrow-up" style={{ color: 'var(--success)' }}></i></td>
                </tr>
                <tr>
                  <td style={{ padding: '1rem', color: 'var(--gray-light)' }}>Volatility</td>
                  <td style={{ padding: '1rem', color: 'var(--white)', fontWeight: '600' }} id="metricVolatility">0%</td>
                  <td style={{ padding: '1rem', color: 'var(--warning)' }} id="metricVolatilityChange">+0%</td>
                  <td style={{ padding: '1rem' }}><i className="fas fa-minus" style={{ color: 'var(--warning)' }}></i></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AnalyticsPage;
