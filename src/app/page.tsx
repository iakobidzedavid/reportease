'use client';

import React, { useState, useRef } from 'react';

interface FormData {
  email: string;
  name: string;
  company: string;
}

interface SubmissionState {
  status: 'idle' | 'loading' | 'success' | 'error';
  message: string;
  errorField?: string;
}

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validateName = (name: string): boolean => {
  return name.trim().length >= 2 && name.trim().length <= 100;
};

const validateCompany = (company: string): boolean => {
  return company.trim().length >= 2 && company.trim().length <= 150;
};

export default function Home() {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    name: '',
    company: '',
  });

  const [submission, setSubmission] = useState<SubmissionState>({
    status: 'idle',
    message: '',
  });

  const formRef = useRef<HTMLFormElement>(null);
  const submitTimeoutRef = useRef<NodeJS.Timeout>();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Clear error message when user starts typing
    if (submission.status === 'error') {
      setSubmission({ status: 'idle', message: '' });
    }
  };

  const validateForm = (): { valid: boolean; field?: string; message?: string } => {
    if (!formData.email.trim()) {
      return { valid: false, field: 'email', message: 'Email is required' };
    }
    if (!validateEmail(formData.email)) {
      return { valid: false, field: 'email', message: 'Invalid email format' };
    }
    if (!formData.name.trim()) {
      return { valid: false, field: 'name', message: 'Name is required' };
    }
    if (!validateName(formData.name)) {
      return { valid: false, field: 'name', message: 'Name must be 2-100 characters' };
    }
    if (!formData.company.trim()) {
      return { valid: false, field: 'company', message: 'Company is required' };
    }
    if (!validateCompany(formData.company)) {
      return { valid: false, field: 'company', message: 'Company must be 2-150 characters' };
    }
    return { valid: true };
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate form
    const validation = validateForm();
    if (!validation.valid) {
      setSubmission({
        status: 'error',
        message: validation.message || 'Please check your input',
        errorField: validation.field,
      });
      return;
    }

    setSubmission({ status: 'loading', message: '' });

    // Clear any existing timeout
    if (submitTimeoutRef.current) {
      clearTimeout(submitTimeoutRef.current);
    }

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setSubmission({
          status: 'error',
          message: data.error || 'Failed to submit form. Please try again.',
          errorField: data.field,
        });
        return;
      }

      // Success
      setSubmission({
        status: 'success',
        message: `Thank you ${formData.name}! We'll be in touch soon.`,
      });

      // Reset form
      setFormData({ email: '', name: '', company: '' });
      if (formRef.current) {
        formRef.current.reset();
      }

      // Reset submission state after 5 seconds
      submitTimeoutRef.current = setTimeout(() => {
        setSubmission({ status: 'idle', message: '' });
      }, 5000);
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmission({
        status: 'error',
        message: 'Network error. Please check your connection and try again.',
      });
    }
  };

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#ffffff',
      fontFamily: 'system-ui, -apple-system, sans-serif',
    },
    navbar: {
      backgroundColor: '#f8f9fa',
      borderBottom: '1px solid #e0e0e0',
      padding: '1rem 2rem',
    },
    navBrand: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: '#1a73e8',
      margin: 0,
    },
    hero: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '4rem 2rem',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '3rem',
      alignItems: 'center',
    },
    heroContent: {
      maxWidth: '500px',
    },
    h1: {
      fontSize: '2.5rem',
      fontWeight: 'bold',
      color: '#202124',
      margin: '0 0 1rem 0',
      lineHeight: '1.2',
    },
    tagline: {
      fontSize: '1.1rem',
      color: '#5f6368',
      margin: '0 0 1.5rem 0',
      lineHeight: '1.6',
    },
    valueProps: {
      listStyle: 'none',
      padding: 0,
      margin: '2rem 0',
    },
    valueProp: {
      display: 'flex',
      alignItems: 'flex-start',
      marginBottom: '1.5rem',
    },
    checkmark: {
      color: '#34a853',
      fontSize: '1.5rem',
      marginRight: '1rem',
      marginTop: '-2px',
    },
    propText: {
      color: '#202124',
      fontSize: '1rem',
      margin: 0,
    },
    formSection: {
      backgroundColor: '#f8f9fa',
      padding: '2.5rem',
      borderRadius: '8px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    },
    formTitle: {
      fontSize: '1.3rem',
      fontWeight: '600',
      color: '#202124',
      margin: '0 0 1.5rem 0',
    },
    formGroup: {
      marginBottom: '1.5rem',
    },
    label: {
      display: 'block',
      marginBottom: '0.5rem',
      fontSize: '0.9rem',
      fontWeight: '500',
      color: '#202124',
    },
    input: {
      width: '100%',
      padding: '0.75rem',
      border: '1px solid #dadce0',
      borderRadius: '4px',
      fontSize: '1rem',
      fontFamily: 'inherit',
      boxSizing: 'border-box' as const,
      transition: 'border-color 0.2s',
    },
    inputFocus: {
      borderColor: '#1a73e8',
      outline: 'none',
    },
    inputError: {
      borderColor: '#d33b27',
    },
    errorMessage: {
      color: '#d33b27',
      fontSize: '0.85rem',
      marginTop: '0.35rem',
      display: 'block',
    },
    button: {
      width: '100%',
      padding: '0.75rem 1.5rem',
      backgroundColor: '#1a73e8',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      fontSize: '1rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'background-color 0.2s',
      marginTop: '0.5rem',
    },
    buttonHover: {
      backgroundColor: '#1665d0',
    },
    buttonLoading: {
      backgroundColor: '#a0aec0',
      cursor: 'not-allowed',
    },
    messageContainer: {
      marginTop: '1.5rem',
      padding: '1rem',
      borderRadius: '4px',
      fontSize: '0.95rem',
      display: 'none' as const,
    },
    successMessage: {
      backgroundColor: '#e6f4ea',
      color: '#188038',
      border: '1px solid #81c995',
      display: 'block' as const,
    },
    errorMsg: {
      backgroundColor: '#fce5e5',
      color: '#c5221f',
      border: '1px solid #f5959d',
      display: 'block' as const,
    },
    loadingText: {
      color: '#1a73e8',
    },
  };

  const messageContainerStyle = {
    ...styles.messageContainer,
    ...(submission.status === 'success' ? styles.successMessage : {}),
    ...(submission.status === 'error' ? styles.errorMsg : {}),
  };

  return (
    <div style={styles.container}>
      {/* Navigation */}
      <nav style={styles.navbar}>
        <h2 style={styles.navBrand}>ReportEase</h2>
      </nav>

      {/* Hero Section */}
      <div style={styles.hero}>
        {/* Content */}
        <div style={styles.heroContent}>
          <h1 style={styles.h1}>
            Automated Marketing Reporting
          </h1>
          <p style={styles.tagline}>
            Cut weekly reporting time from 8+ hours to under 2 hours. 
            Eliminate manual errors. Impress your clients with interactive dashboards.
          </p>

          <ul style={styles.valueProps}>
            <li style={styles.valueProp}>
              <span style={styles.checkmark}>✓</span>
              <p style={styles.propText}>
                <strong>Reclaim 6 hours/week</strong> — Automated report generation from 8+ data sources
              </p>
            </li>
            <li style={styles.valueProp}>
              <span style={styles.checkmark}>✓</span>
              <p style={styles.propText}>
                <strong>Eliminate data-entry errors</strong> — Real-time data syncing from Google Analytics, HubSpot, and ad platforms
              </p>
            </li>
            <li style={styles.valueProp}>
              <span style={styles.checkmark}>✓</span>
              <p style={styles.propText}>
                <strong>Interactive dashboards</strong> — Customize templates, share with clients, impress stakeholders
              </p>
            </li>
          </ul>
        </div>

        {/* Form */}
        <div style={styles.formSection}>
          <h3 style={styles.formTitle}>Start Your Free Trial</h3>
          <form ref={formRef} onSubmit={handleSubmit}>
            {/* Email Field */}
            <div style={styles.formGroup}>
              <label htmlFor="email" style={styles.label}>
                Work Email *
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="you@company.com"
                style={{
                  ...styles.input,
                  ...(submission.errorField === 'email' ? styles.inputError : {}),
                }}
                required
                disabled={submission.status === 'loading'}
              />
              {submission.errorField === 'email' && submission.status === 'error' && (
                <span style={styles.errorMessage}>{submission.message}</span>
              )}
            </div>

            {/* Name Field */}
            <div style={styles.formGroup}>
              <label htmlFor="name" style={styles.label}>
                Full Name *
              </label>
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="John Doe"
                style={{
                  ...styles.input,
                  ...(submission.errorField === 'name' ? styles.inputError : {}),
                }}
                required
                disabled={submission.status === 'loading'}
              />
              {submission.errorField === 'name' && submission.status === 'error' && (
                <span style={styles.errorMessage}>{submission.message}</span>
              )}
            </div>

            {/* Company Field */}
            <div style={styles.formGroup}>
              <label htmlFor="company" style={styles.label}>
                Company Name *
              </label>
              <input
                id="company"
                type="text"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                placeholder="Your Agency"
                style={{
                  ...styles.input,
                  ...(submission.errorField === 'company' ? styles.inputError : {}),
                }}
                required
                disabled={submission.status === 'loading'}
              />
              {submission.errorField === 'company' && submission.status === 'error' && (
                <span style={styles.errorMessage}>{submission.message}</span>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              style={{
                ...styles.button,
                ...(submission.status === 'loading' ? styles.buttonLoading : {}),
              }}
              disabled={submission.status === 'loading'}
            >
              {submission.status === 'loading' ? 'Submitting...' : 'Get Started Free'}
            </button>

            {/* Message Container */}
            {submission.message && (
              <div style={messageContainerStyle}>
                {submission.status === 'loading' && (
                  <span style={styles.loadingText}>Loading...</span>
                )}
                {submission.status === 'success' && submission.message}
                {submission.status === 'error' && !submission.errorField && submission.message}
              </div>
            )}
          </form>

          <p style={{
            fontSize: '0.8rem',
            color: '#5f6368',
            marginTop: '1rem',
            textAlign: 'center',
          }}>
            No credit card required. 14-day free trial.
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer style={{
        backgroundColor: '#f8f9fa',
        padding: '2rem',
        borderTop: '1px solid #e0e0e0',
        textAlign: 'center',
        marginTop: '4rem',
      }}>
        <p style={{
          color: '#5f6368',
          margin: 0,
          fontSize: '0.9rem',
        }}>
          © 2026 ReportEase, Inc. All rights reserved. Your data is secure and never shared.
        </p>
      </footer>
    </div>
  );
}
