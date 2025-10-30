import React, { useEffect, useState } from 'react';

const ApiTest: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const testApi = async () => {
      try {
        console.log('Testing API call...');
        const res = await fetch('http://localhost:5000/api/leaderboard');
        console.log('Response status:', res.status);
        console.log('Response headers:', res.headers);
        
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        
        const data = await res.json();
        console.log('API Response:', data);
        setData(data);
      } catch (e: any) {
        console.error('API Error:', e);
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    
    testApi();
  }, []);

  if (loading) return <div>Loading API test...</div>;
  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;
  
  return (
    <div style={{ padding: '1rem', background: 'var(--glass)', borderRadius: '8px', margin: '1rem' }}>
      <h3>API Test Results</h3>
      <p>Data received: {data ? 'Yes' : 'No'}</p>
      <p>Wallets count: {data?.wallets?.length || 0}</p>
      <p>Data source: {data?.dataSource || 'Unknown'}</p>
      <pre style={{ fontSize: '0.75rem', overflow: 'auto', maxHeight: '200px' }}>
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
};

export default ApiTest;
