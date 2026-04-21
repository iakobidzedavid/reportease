export default function Home() {
  return (
    <main style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif', maxWidth: '1000px', margin: '0 auto' }}>
      <h1>ReportEase — AutoReport</h1>
      <p style={{ fontSize: '1.1rem', color: '#666', marginTop: '0.5rem' }}>
        Your Time-Saving Reporting Assistant
      </p>
      <p style={{ fontSize: '1rem', color: '#555', marginTop: '1rem', lineHeight: '1.6' }}>
        Automated marketing reporting that cuts reporting time from 8+ hours/week to under 2 hours.
      </p>

      <section style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: '#f5f7fa', borderRadius: '8px' }}>
        <h2>Value Proposition</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
          <div>
            <h3 style={{ color: '#0066cc', marginTop: 0 }}>⏱ Time Savings</h3>
            <p>Reclaim 6 hours/week. <strong>$16,900/year per user</strong></p>
          </div>
          <div>
            <h3 style={{ color: '#0066cc', marginTop: 0 }}>✓ Accuracy</h3>
            <p>Eliminate 94% of manual data-entry errors</p>
          </div>
          <div>
            <h3 style={{ color: '#0066cc', marginTop: 0 }}>📊 Visualization</h3>
            <p>Replace multiple tools with one interactive dashboard</p>
          </div>
          <div>
            <h3 style={{ color: '#0066cc', marginTop: 0 }}>💰 ROI</h3>
            <p>21x ROI. 21-day payback period.</p>
          </div>
        </div>
      </section>

      <section style={{ marginTop: '2rem' }}>
        <h2>Tools & Resources</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ marginBottom: '1rem', padding: '1rem', backgroundColor: '#f0f8ff', borderRadius: '6px', borderLeft: '4px solid #0066cc' }}>
            <strong><a href="/roi-calculator" style={{ color: '#0066cc', textDecoration: 'none' }}>📊 AutoReport ROI Calculator</a></strong>
            <p style={{ margin: '0.5rem 0 0 0', color: '#666', fontSize: '0.95rem' }}>
              Customize inputs (hours, staff, error rate, etc.) and calculate your specific ROI. See how much your agency can save.
            </p>
          </li>
        </ul>
      </section>

      <section style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: '#fffacd', borderRadius: '8px', borderLeft: '4px solid #ff9800' }}>
        <h3 style={{ marginTop: 0, color: '#ff6f00' }}>🚀 Coming Soon</h3>
        <ul style={{ marginBottom: 0 }}>
          <li>Interactive product dashboard with Google Analytics integration</li>
          <li>Pre-built report templates for common marketing KPIs</li>
          <li>Case studies from early pilot customers</li>
          <li>14-day free trial</li>
        </ul>
      </section>

      <section style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
        <h2>What AutoReport Does</h2>
        <p>
          A SaaS tool that automatically pulls data from marketing platforms (Google Analytics, HubSpot, Google Ads, Meta, LinkedIn, etc.), 
          generates scheduled reports from customizable templates, and renders them on interactive dashboards with real-time syncing.
        </p>
        <p style={{ marginTop: '1rem' }}>
          <strong>Target Market:</strong> Digital marketing agencies (10-50 person shops) in the US
        </p>
        <p>
          <strong>Beachhead Customer:</strong> Marketing Manager, 30-45, drowning in weekly client reports
        </p>
      </section>

      <section style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: '#f0f0f0', borderRadius: '8px' }}>
        <h2>Product Documentation</h2>
        <p style={{ color: '#666' }}>
          View detailed research, analysis, and strategic planning documents:
        </p>
        <ul style={{ marginTop: '1rem' }}>
          <li><strong>Value Proposition Analysis</strong> — Complete ROI quantification and value drivers</li>
          <li><strong>One-Pager</strong> — Landing page copy, cold email templates, FAQ</li>
          <li><strong>Competitive ROI Matrix</strong> — Detailed comparison vs. Supermetrics, DataBox, Whatagraph</li>
        </ul>
        <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#999' }}>
          All documents available in <code>documents/</code> directory
        </p>
      </section>
    </main>
  );
}
