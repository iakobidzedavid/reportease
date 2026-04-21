'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Report {
  id: string;
  name: string;
  template: string;
  schedule: string;
  recipients: string[];
  createdAt: string;
  lastGenerated?: string;
  status: 'active' | 'paused';
}

export default function ReportsPage() {
  const router = useRouter();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    template: 'weekly',
    recipients: '',
    schedule: 'weekly',
  });

  useEffect(() => {
    const fetchReports = async () => {
      try {
        console.log('[REPORTS] Fetching reports list', {
          timestamp: new Date().toISOString(),
        });

        const response = await fetch('/api/reports/list');

        if (response.status === 401) {
          router.push('/');
          return;
        }

        if (!response.ok) {
          throw new Error(`Failed to fetch reports: ${response.status}`);
        }

        const data = await response.json();
        setReports(data.reports || []);
        setError(null);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load reports';
        console.error('[REPORTS] Error fetching reports', {
          error: errorMessage,
          timestamp: new Date().toISOString(),
        });
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [router]);

  const handleCreateReport = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      console.log('[REPORTS] Creating new report', {
        name: formData.name,
        template: formData.template,
        timestamp: new Date().toISOString(),
      });

      const response = await fetch('/api/reports/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          template: formData.template,
          recipients: formData.recipients.split(',').map(r => r.trim()),
          schedule: formData.schedule,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create report');
      }

      const newReport = await response.json();
      
      console.log('[REPORTS] Report created successfully', {
        reportId: newReport.id,
        timestamp: new Date().toISOString(),
      });

      setReports([...reports, newReport]);
      setShowModal(false);
      setFormData({ name: '', template: 'weekly', recipients: '', schedule: 'weekly' });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create report';
      console.error('[REPORTS] Error creating report', {
        error: errorMessage,
        timestamp: new Date().toISOString(),
      });
      setError(errorMessage);
    }
  };

  const handleGenerateNow = async (reportId: string) => {
    try {
      console.log('[REPORTS] Generating report immediately', {
        reportId,
        timestamp: new Date().toISOString(),
      });

      const response = await fetch(`/api/reports/${reportId}/generate`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to generate report');
      }

      const data = await response.json();
      
      console.log('[REPORTS] Report generation initiated', {
        reportId,
        downloadUrl: data.downloadUrl ? '***' : 'pending',
        timestamp: new Date().toISOString(),
      });

      // Download the PDF
      if (data.downloadUrl) {
        const a = document.createElement('a');
        a.href = data.downloadUrl;
        a.download = `${data.filename}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate report';
      console.error('[REPORTS] Error generating report', {
        error: errorMessage,
        reportId,
        timestamp: new Date().toISOString(),
      });
      setError(errorMessage);
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ margin: 0 }}>Reports</h1>
        <button
          onClick={() => setShowModal(true)}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Create New Report
        </button>
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
      {loading && (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <p>Loading reports...</p>
        </div>
      )}

      {/* Reports List */}
      {!loading && reports.length === 0 && (
        <div style={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '8px',
          textAlign: 'center',
          color: '#666',
        }}>
          <p>No reports created yet. Create your first report to get started.</p>
        </div>
      )}

      {!loading && reports.length > 0 && (
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          overflow: 'hidden',
        }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
          }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #ddd' }}>
                <th style={{ textAlign: 'left', padding: '1rem', color: '#666' }}>Name</th>
                <th style={{ textAlign: 'left', padding: '1rem', color: '#666' }}>Template</th>
                <th style={{ textAlign: 'left', padding: '1rem', color: '#666' }}>Schedule</th>
                <th style={{ textAlign: 'left', padding: '1rem', color: '#666' }}>Recipients</th>
                <th style={{ textAlign: 'left', padding: '1rem', color: '#666' }}>Last Generated</th>
                <th style={{ textAlign: 'center', padding: '1rem', color: '#666' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '1rem' }}>
                    <strong>{report.name}</strong>
                  </td>
                  <td style={{ padding: '1rem' }}>{report.template}</td>
                  <td style={{ padding: '1rem' }}>{report.schedule}</td>
                  <td style={{ padding: '1rem', fontSize: '0.9rem', color: '#666' }}>
                    {report.recipients.length} recipient{report.recipients.length !== 1 ? 's' : ''}
                  </td>
                  <td style={{ padding: '1rem', fontSize: '0.9rem', color: '#666' }}>
                    {report.lastGenerated ? new Date(report.lastGenerated).toLocaleDateString() : 'Never'}
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'center' }}>
                    <button
                      onClick={() => handleGenerateNow(report.id)}
                      style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                      }}
                    >
                      Generate Now
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Report Modal */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '8px',
            maxWidth: '500px',
            width: '90%',
          }}>
            <h2 style={{ marginTop: 0, marginBottom: '1.5rem' }}>Create New Report</h2>
            
            <form onSubmit={handleCreateReport}>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                  Report Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    boxSizing: 'border-box',
                  }}
                  placeholder="e.g., Weekly Client Report"
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                  Template
                </label>
                <select
                  value={formData.template}
                  onChange={(e) => setFormData({ ...formData, template: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    boxSizing: 'border-box',
                  }}
                >
                  <option value="weekly">Weekly Summary</option>
                  <option value="executive">Executive Dashboard</option>
                  <option value="client">Client-Facing Report</option>
                </select>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                  Recipients (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.recipients}
                  onChange={(e) => setFormData({ ...formData, recipients: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    boxSizing: 'border-box',
                  }}
                  placeholder="email1@example.com, email2@example.com"
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                  Schedule
                </label>
                <select
                  value={formData.schedule}
                  onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    boxSizing: 'border-box',
                  }}
                >
                  <option value="weekly">Weekly (Monday 9 AM)</option>
                  <option value="biweekly">Bi-weekly (Friday 5 PM)</option>
                  <option value="monthly">Monthly (Last day at 8 AM)</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: '#ddd',
                    color: '#333',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  Create Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
