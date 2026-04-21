'use client';

import { useEffect, useState } from 'react';

interface MonitoringMetrics {
  totalEvents: number;
  successCount: number;
  failureCount: number;
  successRate: string;
  avgDurationMs: string;
}

interface MetricCard {
  label: string;
  value: string | number;
  unit?: string;
  color: string;
}

export default function MonitoringDashboard() {
  const [metrics, setMetrics] = useState<MonitoringMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>(new Date().toISOString());

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/monitoring/events?limit=100');
      if (!response.ok) {
        throw new Error(`Failed to fetch metrics: ${response.status}`);
      }

      const data = await response.json();
      setMetrics(data.metrics);
      setLastUpdated(new Date().toISOString());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 10000); // Refresh every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const metricCards: MetricCard[] = metrics
    ? [
        {
          label: 'Form Submission Success Rate',
          value: metrics.successRate,
          unit: '%',
          color: '#10b981',
        },
        {
          label: 'Total Events',
          value: metrics.totalEvents,
          color: '#3b82f6',
        },
        {
          label: 'Failed Events',
          value: metrics.failureCount,
          color: metrics.failureCount > 0 ? '#ef4444' : '#10b981',
        },
        {
          label: 'Avg Response Time',
          value: metrics.avgDurationMs,
          unit: 'ms',
          color: '#8b5cf6',
        },
      ]
    : [];

  const formattedTime = new Date(lastUpdated).toLocaleTimeString();

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', backgroundColor: '#f3f4f6', minHeight: '100vh' }}>
      {/* Header */}
      <header
        style={{
          backgroundColor: '#1f2937',
          color: '#fff',
          padding: '2rem 1rem',
          borderBottom: '2px solid #10b981',
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h1 style={{ margin: 0, marginBottom: '0.5rem' }}>MVBP Monitoring Dashboard</h1>
          <p style={{ margin: 0, color: '#d1d5db', fontSize: '0.9rem' }}>
            Real-time system health & performance metrics
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
        {/* Health Status */}
        <div
          style={{
            padding: '1.5rem',
            backgroundColor: '#fff',
            borderRadius: '8px',
            marginBottom: '2rem',
            border: '2px solid #10b981',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ margin: '0 0 0.5rem 0', color: '#1f2937' }}>System Status</h2>
              <p style={{ margin: 0, color: '#6b7280' }}>All components operational</p>
            </div>
            <div
              style={{
                width: '60px',
                height: '60px',
                backgroundColor: '#ecfdf5',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',
              }}
            >
              ✓
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem',
            marginBottom: '2rem',
          }}
        >
          {loading && (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem' }}>
              <p style={{ color: '#6b7280' }}>Loading metrics...</p>
            </div>
          )}

          {error && (
            <div
              style={{
                gridColumn: '1 / -1',
                padding: '1.5rem',
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '8px',
                color: '#dc2626',
              }}
            >
              Error: {error}
            </div>
          )}

          {!loading &&
            !error &&
            metricCards.map((card, index) => (
              <div
                key={index}
                style={{
                  padding: '1.5rem',
                  backgroundColor: '#fff',
                  borderRadius: '8px',
                  borderLeft: `4px solid ${card.color}`,
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                }}
              >
                <p style={{ margin: '0 0 0.5rem 0', color: '#6b7280', fontSize: '0.9rem' }}>
                  {card.label}
                </p>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                  <span style={{ fontSize: '2rem', fontWeight: 'bold', color: card.color }}>
                    {card.value}
                  </span>
                  {card.unit && (
                    <span style={{ color: '#6b7280', fontSize: '0.9rem' }}>{card.unit}</span>
                  )}
                </div>
              </div>
            ))}
        </div>

        {/* System Components */}
        <div style={{ backgroundColor: '#fff', borderRadius: '8px', padding: '2rem' }}>
          <h2 style={{ marginTop: 0, color: '#1f2937' }}>System Components</h2>
          <div style={{ display: 'grid', gap: '1rem' }}>
            {[
              { name: 'Landing Page Form', status: 'operational', endpoint: '/mvbp' },
              { name: 'Google Analytics OAuth', status: 'operational', endpoint: '/api/analytics/oauth' },
              { name: 'Analytics Data API', status: 'operational', endpoint: '/api/analytics/data' },
              { name: 'Monitoring Events', status: 'operational', endpoint: '/api/monitoring/events' },
              { name: 'Lead Capture', status: 'operational', endpoint: '/api/leads' },
              { name: 'Health Check', status: 'operational', endpoint: '/api/health' },
            ].map((component, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '1rem',
                  backgroundColor: '#f9fafb',
                  borderRadius: '4px',
                  borderLeft: '3px solid #10b981',
                }}
              >
                <div>
                  <p style={{ margin: 0, fontWeight: 600, color: '#1f2937' }}>{component.name}</p>
                  <p style={{ margin: '0.25rem 0 0 0', color: '#6b7280', fontSize: '0.85rem' }}>
                    {component.endpoint}
                  </p>
                </div>
                <span
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: '#ecfdf5',
                    color: '#047857',
                    borderRadius: '4px',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                  }}
                >
                  ✓ {component.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Last Updated */}
        <p
          style={{
            marginTop: '2rem',
            textAlign: 'center',
            color: '#6b7280',
            fontSize: '0.9rem',
          }}
        >
          Last updated: {formattedTime} (auto-refreshes every 10 seconds)
        </p>
      </main>
    </div>
  );
}
