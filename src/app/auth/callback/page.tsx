'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Authenticating with Google...');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get('code');
        const state = searchParams.get('state');
        const error = searchParams.get('error');

        // Log callback initiation
        console.log('[AUTH_CALLBACK] OAuth callback received', {
          code: code ? '***REDACTED***' : null,
          state: state ? '***REDACTED***' : null,
          error,
          timestamp: new Date().toISOString(),
        });

        // Handle OAuth errors
        if (error) {
          const errorDesc = searchParams.get('error_description') || 'Unknown error';
          throw new Error(`OAuth Error: ${error} - ${errorDesc}`);
        }

        if (!code) {
          throw new Error('No authorization code received from Google');
        }

        // Exchange code for tokens
        setMessage('Exchanging authorization code for tokens...');
        const tokenResponse = await fetch('/api/auth/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code, state }),
        });

        if (!tokenResponse.ok) {
          const errorData = await tokenResponse.json();
          throw new Error(`Token exchange failed: ${errorData.message}`);
        }

        const tokenData = await tokenResponse.json();
        
        console.log('[AUTH_CALLBACK] Token exchange successful', {
          userId: tokenData.userId,
          email: tokenData.email,
          timestamp: new Date().toISOString(),
        });

        // Create session
        setMessage('Establishing session...');
        const sessionResponse = await fetch('/api/auth/session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            accessToken: tokenData.accessToken,
            refreshToken: tokenData.refreshToken,
            userId: tokenData.userId,
            email: tokenData.email,
          }),
        });

        if (!sessionResponse.ok) {
          throw new Error('Failed to establish session');
        }

        setStatus('success');
        setMessage('Authentication successful. Redirecting to dashboard...');
        
        // Redirect to dashboard
        setTimeout(() => {
          router.push('/dashboard');
        }, 1000);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown authentication error';
        
        console.error('[AUTH_CALLBACK] Authentication failed', {
          error: errorMessage,
          timestamp: new Date().toISOString(),
        });

        setStatus('error');
        setMessage(errorMessage);
      }
    };

    handleCallback();
  }, [searchParams, router]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      fontFamily: 'system-ui, sans-serif',
      backgroundColor: status === 'error' ? '#fff3cd' : '#f8f9fa',
    }}>
      <div style={{ maxWidth: '500px', textAlign: 'center', padding: '2rem' }}>
        <h1>ReportEase Authentication</h1>
        
        {status === 'loading' && (
          <>
            <div style={{
              display: 'inline-block',
              width: '40px',
              height: '40px',
              border: '4px solid #ddd',
              borderTop: '4px solid #007bff',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '2rem 0',
            }}></div>
            <p>{message}</p>
          </>
        )}
        
        {status === 'success' && (
          <>
            <div style={{ color: '#28a745', fontSize: '3rem', margin: '1rem 0' }}>✓</div>
            <p style={{ color: '#28a745' }}>{message}</p>
          </>
        )}
        
        {status === 'error' && (
          <>
            <div style={{ color: '#dc3545', fontSize: '3rem', margin: '1rem 0' }}>✗</div>
            <p style={{ color: '#dc3545', marginBottom: '1rem' }}>{message}</p>
            <p style={{ fontSize: '0.9rem', color: '#666' }}>
              Please try logging in again, or contact support if the issue persists.
            </p>
            <a 
              href="/"
              style={{
                display: 'inline-block',
                marginTop: '1rem',
                padding: '0.75rem 1.5rem',
                backgroundColor: '#007bff',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '4px',
              }}
            >
              Return to Home
            </a>
          </>
        )}
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
