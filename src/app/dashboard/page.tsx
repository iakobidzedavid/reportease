'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface DashboardMetrics {
  sessions: number;
  users: number;
  pageviews: number;
  bounceRate: number;
  avgSessionDuration: string;
  topPages: Array<{
    page: string;
    views: number;
    conversionRate: number;
  }>;
  lastUpdated: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        console.log('[DASHBOARD] Fetching metrics from GA API', {
          timestamp: new Date().toISOString(),
        });

        const response = await fetch('/api/analytics/metrics', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        if (response.status === 401) {
          console.error('[DASHBOARD] Authentication required', {
            status: response.status,
            timestamp: new Date().toISOString(),
          });
          router.push('/');
          return;
        }

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `API Error: ${response.status}`);
        }

        const data = await response.json();
        
        console.log('[DASHBOARD] Metrics retrieved successfully', {
          sessions: data.sessions,
          users: data.users,
          timestamp: new Date().toISOString(),
        });

        setMetrics(data);
        setError(null);
        setLastRefresh(new Date());
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch metrics';
        
        console.error('[DASHBOARD] Error fetching metrics', {
          error: errorMessage,
          timestamp: new Date().toISOString(),
        });

        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();

    // Set up auto-refresh every 5 minutes
    const refreshInterval = setInterval(fetchMetrics, 5 * 60 * 1000);

    return () => clearInterval(refreshInterval);
  }, [router]);

  const handleManualRefresh = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/analytics/metrics');
      if (!response.ok) throw new Error('Failed to refresh');
      
      const data = await response.json();
      setMetrics(data);
      setLastRefresh(new Date());
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Refresh failed';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ margin: 0, marginBottom: '0.5rem' }}>Dashboard</h1>
          <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>
            Last updated: {lastRefresh.toLocaleTimeString()}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            onClick={handleManualRefresh}
            disabled={loading}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? 'Refreshing...' : 'Refresh Now'}
          </button>
          <a
            href="/reports"
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#28a745',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '4px',
            }}
          >
            Generate Report
          </a>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div style={{
          backgroundColor: '#f8d7da',
          border: '1px solid #f5c6cb',
          color: '#721c24',
          padding: '1rem',
          borderRadius: '4px',
          marginBottom: '2rem',
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Loading State */}
      {loading && !metrics && (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <div style={{
            display: 'inline-block',
            width: '40px',
            height: '40px',
            border: '4px solid #ddd',
            borderTop: '4px solid #007bff',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }}></div>
          <p>Loading dashboard...</p>
        </div>
      )}

      {/* Metrics Grid */}
      {metrics && (
        <>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem',
            marginBottom: '2rem',
          }}>
            {/* Sessions Card */}
            <div style={{
              backgroundColor: 'white',
              padding: '1.5rem',
              borderRadius: '8px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            }}>
              <p style={{ margin: '0 0 0.5rem 0', color: '#666', fontSize: '0.9rem' }}>Sessions</p>
              <p style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold', color: '#007bff' }}>
                {metrics.sessions.toLocaleString()}
              </p>
            </div>

            {/* Users Card */}
            <div style={{
              backgroundColor: 'white',
              padding: '1.5rem',
              borderRadius: '8px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            }}>
              <p style={{ margin: '0 0 0.5rem 0', color: '#666', fontSize: '0.9rem' }}>Users</p>
              <p style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold', color: '#28a745' }}>
                {metrics.users.toLocaleString()}
              </p>
            </div>

            {/* Pageviews Card */}
            <div style={{
              backgroundColor: 'white',
              padding: '1.5rem',
              borderRadius: '8px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            }}>
              <p style={{ margin: '0 0 0.5rem 0', color: '#666', fontSize: '0.9rem' }}>Pageviews</p>
              <p style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold', color: '#ffc107' }}>
                {metrics.pageviews.toLocaleString()}
              </p>
            </div>

            {/* Bounce Rate Card */}
            <div style={{
              backgroundColor: 'white',
              padding: '1.5rem',
              borderRadius: '8px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            }}>
              <p style={{ margin: '0 0 0.5rem 0', color: '#666', fontSize: '0.9rem' }}>Bounce Rate</p>
              <p style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold', color: '#dc3545' }}>
                {(metrics.bounceRate * 100).toFixed(1)}%
              </p>
            </div>

            {/* Avg Session Duration Card */}
            <div style={{
              backgroundColor: 'white',
              padding: '1.5rem',
              borderRadius: '8px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            }}>
              <p style={{ margin: '0 0 0.5rem 0', color: '#666', fontSize: '0.9rem' }}>Avg Duration</p>
              <p style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold', color: '#17a2b8' }}>
                {metrics.avgSessionDuration}
              </p>
            </div>
          </div>

          {/* Top Pages Section */}
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          }}>
            <h2 style={{ margin: '0 0 1.5rem 0' }}>Top Pages</h2>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
            }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #ddd' }}>
                  <th style={{ textAlign: 'left', padding: '0.75rem', color: '#666' }}>Page</th>
                  <th style={{ textAlign: 'right', padding: '0.75rem', color: '#666' }}>Pageviews</th>
                  <th style={{ textAlign: 'right', padding: '0.75rem', color: '#666' }}>Conversion Rate</th>
                </tr>
              </thead>
              <tbody>
                {metrics.topPages.map((page, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '0.75rem', color: '#007bff' }}>{page.page}</td>
                    <td style={{ textAlign: 'right', padding: '0.75rem' }}>
                      {page.views.toLocaleString()}
                    </td>
                    <td style={{ textAlign: 'right', padding: '0.75rem' }}>
                      {(page.conversionRate).toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Info Box */}
          <div style={{
            backgroundColor: '#e7f3ff',
            border: '1px solid #b3d9ff',
            color: '#004085',
            padding: '1rem',
            borderRadius: '4px',
            marginTop: '2rem',
            fontSize: '0.9rem',
          }}>
            <strong>Note:</strong> Conversion event data is currently unavailable due to API permissions. Please update your Google Analytics OAuth scopes to view conversion metrics.
          </div>
        </>
      )}

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
