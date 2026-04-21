/**
 * End-to-End MVBP Tests
 * Verifies complete user flows for form submission and analytics integration
 */

describe('MVBP End-to-End Flows', () => {
  const API_BASE = 'http://localhost:3000';

  // ============ FULL FORM SUBMISSION FLOW ============
  describe('Form Submission Flow', () => {
    it('should complete full signup flow from form to database', async () => {
      const testEmail = `e2e-test-${Date.now()}@example.com`;
      const leadData = {
        email: testEmail,
        company: 'E2E Test Agency',
        fullName: 'E2E Test User',
      };

      // Step 1: Submit form
      const submitResponse = await fetch(`${API_BASE}/api/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadData),
      });

      expect(submitResponse.status).toBe(201);
      const submitData = await submitResponse.json();
      expect(submitData.success).toBe(true);
      const leadId = submitData.leadId;

      // Step 2: Log event to monitoring
      const eventResponse = await fetch(`${API_BASE}/api/monitoring/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'form_submission',
          status: 'success',
          duration: 245,
          details: { leadId, email: testEmail },
        }),
      });

      expect(eventResponse.status).toBe(201);

      // Step 3: Verify lead in database
      const listResponse = await fetch(`${API_BASE}/api/leads`);
      const listData = await listResponse.json();
      const foundLead = listData.data.find((l: any) => l.id === leadId);
      expect(foundLead).toBeDefined();
      expect(foundLead.email).toBe(testEmail.toLowerCase());
    });

    it('should handle rapid consecutive submissions', async () => {
      const submissions = await Promise.all(
        Array(3)
          .fill(null)
          .map((_, i) =>
            fetch(`${API_BASE}/api/leads`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                email: `rapid-test-${i}-${Date.now()}@example.com`,
                company: 'Test Co',
                fullName: 'Test User',
              }),
            })
          )
      );

      for (const response of submissions) {
        expect(response.status).toBe(201);
      }
    });
  });

  // ============ GOOGLE ANALYTICS INTEGRATION FLOW ============
  describe('Google Analytics Integration Flow', () => {
    it('should complete OAuth flow to data retrieval', async () => {
      // Step 1: Exchange auth code for token
      const tokenResponse = await fetch(`${API_BASE}/api/analytics/oauth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'exchange_code',
          authCode: 'test-auth-code-e2e-001',
        }),
      });

      expect(tokenResponse.status).toBe(200);
      const tokenData = await tokenResponse.json();
      const accessToken = tokenData.token.access_token;

      // Step 2: Log OAuth success event
      const oauthEventResponse = await fetch(`${API_BASE}/api/monitoring/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'oauth_success',
          status: 'success',
          duration: 156,
          details: { tokenType: tokenData.token.token_type },
        }),
      });

      expect(oauthEventResponse.status).toBe(201);

      // Step 3: Retrieve GA4 properties
      const propertiesResponse = await fetch(`${API_BASE}/api/analytics/oauth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ action: 'get_properties' }),
      });

      expect(propertiesResponse.status).toBe(200);
      const propertiesData = await propertiesResponse.json();
      expect(propertiesData.properties.length).toBeGreaterThan(0);
      const propertyId = propertiesData.properties[0].propertyId;

      // Step 4: Fetch analytics data
      const dataResponse = await fetch(
        `${API_BASE}/api/analytics/data?propertyId=${propertyId}&startDate=2026-04-20&endDate=2026-04-22`,
        {
          headers: { 'Authorization': `Bearer ${accessToken}` },
        }
      );

      expect(dataResponse.status).toBe(200);
      const analyticsData = await dataResponse.json();
      expect(analyticsData.data.length).toBeGreaterThan(0);

      // Step 5: Log data pull event
      const dataPullEventResponse = await fetch(`${API_BASE}/api/monitoring/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'data_pull',
          status: 'success',
          duration: 873,
          details: {
            propertyId,
            rowsRetrieved: analyticsData.data.length,
          },
        }),
      });

      expect(dataPullEventResponse.status).toBe(201);
    });

    it('should handle missing properties gracefully', async () => {
      const tokenResponse = await fetch(`${API_BASE}/api/analytics/oauth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'exchange_code',
          authCode: 'test-auth-code-e2e-002',
        }),
      });

      const tokenData = await tokenResponse.json();
      const accessToken = tokenData.token.access_token;

      // Attempt to retrieve data without propertyId
      const dataResponse = await fetch(
        `${API_BASE}/api/analytics/data?startDate=2026-04-20&endDate=2026-04-22`,
        {
          headers: { 'Authorization': `Bearer ${accessToken}` },
        }
      );

      expect(dataResponse.status).toBe(400);
    });
  });

  // ============ DASHBOARD MONITORING FLOW ============
  describe('Monitoring Dashboard Flow', () => {
    it('should generate metrics from logged events', async () => {
      // Log several events
      const eventTypes = ['form_submission', 'oauth_success', 'data_pull'];
      const startTime = Date.now();

      for (let i = 0; i < 3; i++) {
        await fetch(`${API_BASE}/api/monitoring/events`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: eventTypes[i % eventTypes.length],
            status: 'success',
            duration: Math.random() * 1000,
          }),
        });
      }

      // Wait a moment for events to be recorded
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Retrieve metrics
      const metricsResponse = await fetch(`${API_BASE}/api/monitoring/events?limit=100`);
      expect(metricsResponse.status).toBe(200);
      const metricsData = await metricsResponse.json();

      expect(metricsData.metrics.totalEvents).toBeGreaterThanOrEqual(3);
      expect(metricsData.metrics.successCount).toBeGreaterThanOrEqual(3);
      expect(metricsData.metrics.failureCount).toBeGreaterThanOrEqual(0);
    });
  });

  // ============ ERROR RECOVERY FLOW ============
  describe('Error Handling and Recovery', () => {
    it('should gracefully handle and log submission errors', async () => {
      const invalidData = {
        email: 'invalid-email-format',
        company: 'Test',
        fullName: 'Test',
      };

      const response = await fetch(`${API_BASE}/api/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invalidData),
      });

      expect(response.status).toBe(400);

      // Log error event
      const errorEventResponse = await fetch(`${API_BASE}/api/monitoring/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'error',
          status: 'failure',
          duration: 45,
          details: { errorCode: 400, reason: 'Invalid email format' },
        }),
      });

      expect(errorEventResponse.status).toBe(201);
    });

    it('should recover from transient failures', async () => {
      const validData = {
        email: `recovery-test-${Date.now()}@example.com`,
        company: 'Recovery Test',
        fullName: 'Recovery User',
      };

      // Attempt submission
      const response = await fetch(`${API_BASE}/api/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validData),
      });

      expect(response.status).toBe(201);

      // Verify it can be retried successfully
      const retryResponse = await fetch(`${API_BASE}/api/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...validData,
          email: `recovery-test-retry-${Date.now()}@example.com`,
        }),
      });

      expect(retryResponse.status).toBe(201);
    });
  });

  // ============ PERFORMANCE TESTS ============
  describe('Performance Benchmarks', () => {
    it('should complete form submission within 500ms', async () => {
      const startTime = performance.now();

      await fetch(`${API_BASE}/api/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: `perf-test-${Date.now()}@example.com`,
          company: 'Perf Test',
          fullName: 'Perf User',
        }),
      });

      const duration = performance.now() - startTime;
      expect(duration).toBeLessThan(500);
    });

    it('should retrieve analytics data within 2000ms', async () => {
      const tokenResponse = await fetch(`${API_BASE}/api/analytics/oauth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'exchange_code',
          authCode: 'perf-test-code',
        }),
      });

      const tokenData = await tokenResponse.json();
      const accessToken = tokenData.token.access_token;

      const startTime = performance.now();

      await fetch(
        `${API_BASE}/api/analytics/data?propertyId=123&startDate=2026-04-20&endDate=2026-04-22`,
        {
          headers: { 'Authorization': `Bearer ${accessToken}` },
        }
      );

      const duration = performance.now() - startTime;
      expect(duration).toBeLessThan(2000);
    });

    it('should return health check within 100ms', async () => {
      const startTime = performance.now();
      await fetch(`${API_BASE}/api/health`);
      const duration = performance.now() - startTime;
      expect(duration).toBeLessThan(100);
    });
  });
});
