/**
 * MVBP API Test Suite
 * Tests for: Form submission, OAuth flow, Analytics data, Health checks, Monitoring
 */

describe('MVBP API Endpoints', () => {
  const API_BASE = 'http://localhost:3000';

  // ============ HEALTH CHECK TESTS ============
  describe('GET /api/health', () => {
    it('should return 200 OK with healthy status', async () => {
      const response = await fetch(`${API_BASE}/api/health`);
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.status).toBe('healthy');
      expect(data.checks).toBeDefined();
    });

    it('should include system metadata in response', async () => {
      const response = await fetch(`${API_BASE}/api/health`);
      const data = await response.json();
      expect(data.timestamp).toBeDefined();
      expect(data.version).toBeDefined();
      expect(data.environment).toBeDefined();
    });
  });

  // ============ LEAD CAPTURE TESTS ============
  describe('POST /api/leads - Form Submission', () => {
    it('should reject submission with missing fields', async () => {
      const response = await fetch(`${API_BASE}/api/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test@example.com' }),
      });
      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.success).toBe(false);
      expect(data.error).toContain('Missing required fields');
    });

    it('should reject submission with invalid email', async () => {
      const response = await fetch(`${API_BASE}/api/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'invalid-email',
          company: 'Test Co',
          fullName: 'John Doe',
        }),
      });
      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toContain('Invalid email format');
    });

    it('should successfully submit valid lead data', async () => {
      const leadData = {
        email: 'mvbp-test-001@example.com',
        company: 'Test Agency Inc',
        fullName: 'MVBP Test User',
      };

      const response = await fetch(`${API_BASE}/api/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadData),
      });

      expect(response.status).toBe(201);
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.leadId).toBeDefined();
      expect(data.data.email).toBe(leadData.email.toLowerCase());
    });

    it('should normalize email to lowercase', async () => {
      const response = await fetch(`${API_BASE}/api/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'TEST@EXAMPLE.COM',
          company: 'Test Co',
          fullName: 'John Doe',
        }),
      });

      const data = await response.json();
      expect(data.data.email).toBe('test@example.com');
    });

    it('should include timestamp in submission', async () => {
      const response = await fetch(`${API_BASE}/api/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'timestamp-test@example.com',
          company: 'Test Co',
          fullName: 'John Doe',
        }),
      });

      const data = await response.json();
      expect(data.data.createdAt).toBeDefined();
      expect(new Date(data.data.createdAt)).toBeInstanceOf(Date);
    });
  });

  describe('GET /api/leads - Retrieve Submissions', () => {
    it('should return array of leads', async () => {
      const response = await fetch(`${API_BASE}/api/leads`);
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(Array.isArray(data.data)).toBe(true);
      expect(data.count).toBeDefined();
    });
  });

  // ============ GOOGLE ANALYTICS OAUTH TESTS ============
  describe('POST /api/analytics/oauth - OAuth Flow', () => {
    it('should reject token exchange without authCode', async () => {
      const response = await fetch(`${API_BASE}/api/analytics/oauth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'exchange_code' }),
      });

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toContain('authCode is required');
    });

    it('should successfully exchange auth code for token', async () => {
      const response = await fetch(`${API_BASE}/api/analytics/oauth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'exchange_code',
          authCode: 'test-auth-code-12345',
        }),
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.token.access_token).toBeDefined();
      expect(data.token.refresh_token).toBeDefined();
      expect(data.token.expires_in).toBe(3600);
    });

    it('should reject property retrieval without authorization header', async () => {
      const response = await fetch(`${API_BASE}/api/analytics/oauth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'get_properties' }),
      });

      expect(response.status).toBe(401);
      const data = await response.json();
      expect(data.error).toContain('Missing authorization header');
    });

    it('should retrieve GA4 properties with valid token', async () => {
      const response = await fetch(`${API_BASE}/api/analytics/oauth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer test-token-12345',
        },
        body: JSON.stringify({ action: 'get_properties' }),
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(Array.isArray(data.properties)).toBe(true);
      expect(data.count).toBeGreaterThan(0);
    });
  });

  // ============ ANALYTICS DATA TESTS ============
  describe('GET /api/analytics/data', () => {
    const validToken = 'Bearer test-token-12345';

    it('should reject request without authorization header', async () => {
      const response = await fetch(`${API_BASE}/api/analytics/data?propertyId=123&startDate=2026-04-20&endDate=2026-04-22`);
      expect(response.status).toBe(401);
    });

    it('should reject request with missing date range parameters', async () => {
      const response = await fetch(
        `${API_BASE}/api/analytics/data?propertyId=123`,
        {
          headers: { 'Authorization': validToken },
        }
      );

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toContain('Missing required parameters');
    });

    it('should return analytics data with valid parameters', async () => {
      const response = await fetch(
        `${API_BASE}/api/analytics/data?propertyId=123456789&startDate=2026-04-20&endDate=2026-04-22`,
        {
          headers: { 'Authorization': validToken },
        }
      );

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(Array.isArray(data.data)).toBe(true);
      expect(data.data.length).toBeGreaterThan(0);
    });

    it('should include all required metrics in response', async () => {
      const response = await fetch(
        `${API_BASE}/api/analytics/data?propertyId=123456789&startDate=2026-04-20&endDate=2026-04-22`,
        {
          headers: { 'Authorization': validToken },
        }
      );

      const data = await response.json();
      const firstRow = data.data[0];
      expect(firstRow.date).toBeDefined();
      expect(firstRow.users).toBeDefined();
      expect(firstRow.sessions).toBeDefined();
      expect(firstRow.pageviews).toBeDefined();
      expect(firstRow.bounceRate).toBeDefined();
      expect(firstRow.avgSessionDuration).toBeDefined();
    });

    it('should return API latency in response', async () => {
      const response = await fetch(
        `${API_BASE}/api/analytics/data?propertyId=123456789&startDate=2026-04-20&endDate=2026-04-22`,
        {
          headers: { 'Authorization': validToken },
        }
      );

      const data = await response.json();
      expect(data.apiLatency).toBeDefined();
      expect(data.apiLatency).toMatch(/\d+(\.\d+)?ms/);
    });
  });

  // ============ MONITORING EVENTS TESTS ============
  describe('POST /api/monitoring/events - Event Logging', () => {
    it('should reject event without required fields', async () => {
      const response = await fetch(`${API_BASE}/api/monitoring/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'form_submission' }),
      });

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toContain('Missing required fields');
    });

    it('should successfully log a form submission event', async () => {
      const response = await fetch(`${API_BASE}/api/monitoring/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'form_submission',
          status: 'success',
          duration: 234,
          details: { email: 'test@example.com' },
        }),
      });

      expect(response.status).toBe(201);
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.eventId).toBeDefined();
    });

    it('should successfully log OAuth events', async () => {
      const response = await fetch(`${API_BASE}/api/monitoring/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'oauth_success',
          status: 'success',
          duration: 567,
        }),
      });

      expect(response.status).toBe(201);
    });

    it('should successfully log data pull events', async () => {
      const response = await fetch(`${API_BASE}/api/monitoring/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'data_pull',
          status: 'success',
          duration: 1234,
          details: { rowsRetrieved: 847 },
        }),
      });

      expect(response.status).toBe(201);
    });
  });

  describe('GET /api/monitoring/events - Metrics Retrieval', () => {
    it('should return metrics with all required fields', async () => {
      const response = await fetch(`${API_BASE}/api/monitoring/events`);
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.metrics).toBeDefined();
      expect(data.metrics.totalEvents).toBeDefined();
      expect(data.metrics.successCount).toBeDefined();
      expect(data.metrics.failureCount).toBeDefined();
      expect(data.metrics.successRate).toBeDefined();
      expect(data.metrics.avgDurationMs).toBeDefined();
    });

    it('should filter events by type', async () => {
      const response = await fetch(`${API_BASE}/api/monitoring/events?type=form_submission`);
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(Array.isArray(data.events)).toBe(true);
    });

    it('should respect limit parameter', async () => {
      const response = await fetch(`${API_BASE}/api/monitoring/events?limit=5`);
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.events.length).toBeLessThanOrEqual(5);
    });
  });
});
