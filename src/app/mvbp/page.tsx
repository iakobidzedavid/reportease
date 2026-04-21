'use client';

import { useState } from 'react';

export default function MVBPLanding() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    company: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    const startTime = performance.now();

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const duration = performance.now() - startTime;

      // Log monitoring event
      await fetch('/api/monitoring/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'form_submission',
          status: response.ok ? 'success' : 'failure',
          duration: Math.round(duration),
          details: {
            email: formData.email,
            statusCode: response.status,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();

      setSubmitStatus({
        type: 'success',
        message: `✓ Lead submitted successfully! We'll be in touch at ${formData.email}`,
      });
      setFormData({ fullName: '', email: '', company: '' });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      setSubmitStatus({
        type: 'error',
        message: `✗ Submission failed: ${errorMsg}. Please try again.`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', backgroundColor: '#f9fafb' }}>
      {/* Hero Section */}
      <section style={{ padding: '3rem 1rem', textAlign: 'center', backgroundColor: '#fff' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: '#1f2937' }}>
          ReportEase AutoReport
        </h1>
        <p style={{ fontSize: '1.25rem', color: '#6b7280', marginBottom: '1.5rem' }}>
          Your Time-Saving Reporting Assistant
        </p>
        <p style={{ fontSize: '1rem', color: '#6b7280', maxWidth: '600px', margin: '0 auto' }}>
          Automated marketing reporting that cuts reporting time from 8+ hours/week to under 2
          hours.
        </p>
      </section>

      {/* Value Props Section */}
      <section
        style={{
          padding: '3rem 1rem',
          backgroundColor: '#f3f4f6',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem',
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
        <div style={{ padding: '1.5rem', backgroundColor: '#fff', borderRadius: '8px' }}>
          <h3 style={{ color: '#1f2937', marginBottom: '0.5rem' }}>⏱️ Time Savings</h3>
          <p style={{ color: '#6b7280' }}>Reclaim 6 hours/week from manual reporting tasks.</p>
        </div>
        <div style={{ padding: '1.5rem', backgroundColor: '#fff', borderRadius: '8px' }}>
          <h3 style={{ color: '#1f2937', marginBottom: '0.5rem' }}>✓ Accuracy</h3>
          <p style={{ color: '#6b7280' }}>Eliminate manual data-entry errors automatically.</p>
        </div>
        <div style={{ padding: '1.5rem', backgroundColor: '#fff', borderRadius: '8px' }}>
          <h3 style={{ color: '#1f2937', marginBottom: '0.5rem' }}>📊 Visualization</h3>
          <p style={{ color: '#6b7280' }}>Interactive dashboards for stakeholder engagement.</p>
        </div>
      </section>

      {/* Lead Capture Form */}
      <section
        style={{
          padding: '3rem 1rem',
          backgroundColor: '#fff',
          maxWidth: '500px',
          margin: '2rem auto',
        }}
      >
        <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: '#1f2937' }}>
          Start Your Free Trial
        </h2>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label
              htmlFor="fullName"
              style={{ display: 'block', marginBottom: '0.5rem', color: '#374151', fontWeight: 500 }}
            >
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              required
              disabled={isSubmitting}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                fontSize: '1rem',
                boxSizing: 'border-box',
              }}
              placeholder="John Doe"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              style={{ display: 'block', marginBottom: '0.5rem', color: '#374151', fontWeight: 500 }}
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              disabled={isSubmitting}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                fontSize: '1rem',
                boxSizing: 'border-box',
              }}
              placeholder="you@company.com"
            />
          </div>

          <div>
            <label
              htmlFor="company"
              style={{ display: 'block', marginBottom: '0.5rem', color: '#374151', fontWeight: 500 }}
            >
              Company
            </label>
            <input
              type="text"
              id="company"
              name="company"
              value={formData.company}
              onChange={handleInputChange}
              required
              disabled={isSubmitting}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                fontSize: '1rem',
                boxSizing: 'border-box',
              }}
              placeholder="Your Company"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              padding: '0.75rem',
              backgroundColor: isSubmitting ? '#9ca3af' : '#2563eb',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              fontSize: '1rem',
              fontWeight: 600,
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              marginTop: '0.5rem',
            }}
          >
            {isSubmitting ? 'Submitting...' : 'Start Free Trial'}
          </button>
        </form>

        {submitStatus.type && (
          <div
            style={{
              marginTop: '1rem',
              padding: '1rem',
              borderRadius: '4px',
              backgroundColor: submitStatus.type === 'success' ? '#ecfdf5' : '#fef2f2',
              color: submitStatus.type === 'success' ? '#047857' : '#dc2626',
              border: `1px solid ${submitStatus.type === 'success' ? '#a7f3d0' : '#fecaca'}`,
            }}
          >
            {submitStatus.message}
          </div>
        )}
      </section>

      {/* Features Section */}
      <section style={{ padding: '3rem 1rem', backgroundColor: '#f9fafb' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: '#1f2937' }}>How It Works</h2>
        <div
          style={{
            maxWidth: '900px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '2rem',
          }}
        >
          <div style={{ padding: '1.5rem', backgroundColor: '#fff', borderRadius: '8px' }}>
            <h3 style={{ color: '#2563eb', marginBottom: '0.5rem' }}>1. Connect</h3>
            <p style={{ color: '#6b7280' }}>Securely connect your Google Analytics and marketing platforms.</p>
          </div>
          <div style={{ padding: '1.5rem', backgroundColor: '#fff', borderRadius: '8px' }}>
            <h3 style={{ color: '#2563eb', marginBottom: '0.5rem' }}>2. Configure</h3>
            <p style={{ color: '#6b7280' }}>Customize report templates for your specific needs.</p>
          </div>
          <div style={{ padding: '1.5rem', backgroundColor: '#fff', borderRadius: '8px' }}>
            <h3 style={{ color: '#2563eb', marginBottom: '0.5rem' }}>3. Automate</h3>
            <p style={{ color: '#6b7280' }}>Generate and deliver reports on a schedule automatically.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          padding: '2rem',
          textAlign: 'center',
          backgroundColor: '#1f2937',
          color: '#d1d5db',
        }}
      >
        <p>&copy; 2026 ReportEase. All rights reserved.</p>
      </footer>
    </div>
  );
}
