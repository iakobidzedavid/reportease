'use client';

import { useState } from 'react';

interface FormData {
  // Section 1: Current Workflow
  timeSpent: string;
  currentTools: string[];
  painPoint: string;
  
  // Section 2: Starter Pricing
  starterAccept: string;
  starterMaxWtp: string;
  starterFeatures: string[];
  
  // Section 3: Standard Pricing
  standardAccept: string;
  standardMaxWtp: string;
  standardFeatures: string[];
  
  // Section 4: Premium Pricing
  premiumAccept: string;
  premiumMaxWtp: string;
  premiumFeatures: string[];
  
  // Section 5: Demographics
  companySize: string;
  annualRevenue: string;
  decisionAuthority: string;
  email: string;
}

const toolsOptions = [
  'Google Analytics',
  'HubSpot',
  'Sprout Social',
  'Manually Assembled',
  'Other',
];

const starterFeatures = [
  'Automation',
  'Scheduling',
  'Basic Dashboard',
  'Multi-platform Integration',
];

const standardFeatures = [
  'Advanced Dashboard',
  'Real-time Sync',
  'Unlimited Users',
  'HubSpot Integration',
  'Slack Integration',
];

const premiumFeatures = [
  'Custom Templates',
  'API Access',
  'White-label Options',
  'Dedicated Support',
  'Strategy Calls',
];

export default function PricingSurvey() {
  const [currentSection, setCurrentSection] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    timeSpent: '',
    currentTools: [],
    painPoint: '',
    starterAccept: '',
    starterMaxWtp: '',
    starterFeatures: [],
    standardAccept: '',
    standardMaxWtp: '',
    standardFeatures: [],
    premiumAccept: '',
    premiumMaxWtp: '',
    premiumFeatures: [],
    companySize: '',
    annualRevenue: '',
    decisionAuthority: '',
    email: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleCheckboxChange = (field: string, value: string) => {
    setFormData((prev) => {
      const array = prev[field as keyof FormData] as string[];
      if (Array.isArray(array)) {
        if (array.includes(value)) {
          return {
            ...prev,
            [field]: array.filter((item) => item !== value),
          };
        } else {
          return {
            ...prev,
            [field]: [...array, value],
          };
        }
      }
      return prev;
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prepare submission data
    const submission = {
      timestamp: new Date().toISOString(),
      data: formData,
    };

    try {
      // Send to backend (or email service)
      const response = await fetch('/api/submit-survey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submission),
      });

      if (response.ok) {
        setSubmitted(true);
        // Also save to localStorage for offline support
        const existing = JSON.parse(localStorage.getItem('survey_submissions') || '[]');
        localStorage.setItem('survey_submissions', JSON.stringify([...existing, submission]));
      }
    } catch (err) {
      console.error('Submission error:', err);
      // Fallback: save to localStorage
      const existing = JSON.parse(localStorage.getItem('survey_submissions') || '[]');
      localStorage.setItem('survey_submissions', JSON.stringify([...existing, submission]));
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <main style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <h1>Thank You! 🎉</h1>
          <p style={{ fontSize: '1.1rem', color: '#666' }}>
            Your survey response has been recorded. We'll send your $50 Amazon gift card within 24 hours.
          </p>
          <p style={{ color: '#999', marginTop: '1rem' }}>
            Watch your inbox for confirmation and delivery details.
          </p>
        </div>
      </main>
    );
  }

  const isSection1Complete = formData.timeSpent && formData.currentTools.length > 0 && formData.painPoint;
  const isSection2Complete = formData.starterAccept && formData.starterMaxWtp && formData.starterFeatures.length > 0;
  const isSection3Complete = formData.standardAccept && formData.standardMaxWtp && formData.standardFeatures.length > 0;
  const isSection4Complete = formData.premiumAccept && formData.premiumMaxWtp && formData.premiumFeatures.length > 0;
  const isSection5Complete = formData.companySize && formData.annualRevenue && formData.decisionAuthority && formData.email;

  const canProceed =
    currentSection === 1 ? isSection1Complete :
    currentSection === 2 ? isSection2Complete :
    currentSection === 3 ? isSection3Complete :
    currentSection === 4 ? isSection4Complete :
    isSection5Complete;

  return (
    <main style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1>AutoReport Pricing Survey</h1>
        <p style={{ color: '#666' }}>Help us price AutoReport right for marketing agencies</p>
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
          {[1, 2, 3, 4, 5].map((num) => (
            <div
              key={num}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: currentSection >= num ? '#0066cc' : '#ddd',
                color: currentSection >= num ? 'white' : '#999',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
              }}
            >
              {num}
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* SECTION 1 */}
        {currentSection === 1 && (
          <div>
            <h2>Your Current Workflow</h2>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                How much time do you spend on weekly client reporting?
              </label>
              <select
                value={formData.timeSpent}
                onChange={(e) => handleInputChange('timeSpent', e.target.value)}
                style={{ width: '100%', padding: '0.5rem', fontSize: '1rem' }}
              >
                <option value="">Select...</option>
                <option value="<2">Less than 2 hours</option>
                <option value="2-4">2-4 hours</option>
                <option value="4-6">4-6 hours</option>
                <option value="6-8">6-8 hours</option>
                <option value="8+">8+ hours</option>
              </select>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                What tools do you currently use? (Select all that apply)
              </label>
              {toolsOptions.map((tool) => (
                <label key={tool} style={{ display: 'block', marginBottom: '0.5rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.currentTools.includes(tool)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        handleCheckboxChange('currentTools', tool);
                      } else {
                        handleCheckboxChange('currentTools', tool);
                      }
                    }}
                    style={{ marginRight: '0.5rem' }}
                  />
                  {tool}
                </label>
              ))}
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                What's your biggest pain point with current reporting?
              </label>
              <textarea
                value={formData.painPoint}
                onChange={(e) => handleInputChange('painPoint', e.target.value)}
                placeholder="E.g., Takes too long, error-prone, hard to consolidate multiple sources..."
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  fontSize: '1rem',
                  minHeight: '100px',
                  fontFamily: 'inherit',
                }}
              />
            </div>
          </div>
        )}

        {/* SECTION 2 */}
        {currentSection === 2 && (
          <div>
            <h2>Starter Tier — $800/year</h2>
            <div style={{ backgroundColor: '#f5f5f5', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
              <p style={{ marginBottom: '0.5rem' }}>
                <strong>Includes:</strong>
              </p>
              <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
                <li>Automated reports from Google Analytics + 2 ad platforms</li>
                <li>Weekly scheduled PDF reports + basic dashboard</li>
                <li>3 team members access</li>
                <li>Email support</li>
              </ul>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                Would you pay $800/year for Starter?
              </label>
              {['Yes', 'No', 'Maybe'].map((option) => (
                <label key={option} style={{ display: 'block', marginBottom: '0.5rem', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="starterAccept"
                    value={option}
                    checked={formData.starterAccept === option}
                    onChange={(e) => handleInputChange('starterAccept', e.target.value)}
                    style={{ marginRight: '0.5rem' }}
                  />
                  {option}
                </label>
              ))}
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                What is the maximum you'd pay for Starter? ($/year)
              </label>
              <input
                type="number"
                value={formData.starterMaxWtp}
                onChange={(e) => handleInputChange('starterMaxWtp', e.target.value)}
                placeholder="e.g., 600, 750, 1000"
                style={{ width: '100%', padding: '0.5rem', fontSize: '1rem' }}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                Which features matter most at this tier? (Select all that apply)
              </label>
              {starterFeatures.map((feature) => (
                <label key={feature} style={{ display: 'block', marginBottom: '0.5rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.starterFeatures.includes(feature)}
                    onChange={(e) => handleCheckboxChange('starterFeatures', feature)}
                    style={{ marginRight: '0.5rem' }}
                  />
                  {feature}
                </label>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 3 */}
        {currentSection === 3 && (
          <div>
            <h2>Standard Tier — $1,200/year</h2>
            <div style={{ backgroundColor: '#f5f5f5', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
              <p style={{ marginBottom: '0.5rem' }}>
                <strong>Includes all Starter features, plus:</strong>
              </p>
              <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
                <li>5 ad platform integrations (not just 2)</li>
                <li>HubSpot integration</li>
                <li>Daily scheduled reports (not weekly)</li>
                <li>Interactive dashboard with real-time sync</li>
                <li>Unlimited team members</li>
                <li>Email + Slack support</li>
              </ul>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                Would you pay $1,200/year for Standard?
              </label>
              {['Yes', 'No', 'Maybe'].map((option) => (
                <label key={option} style={{ display: 'block', marginBottom: '0.5rem', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="standardAccept"
                    value={option}
                    checked={formData.standardAccept === option}
                    onChange={(e) => handleInputChange('standardAccept', e.target.value)}
                    style={{ marginRight: '0.5rem' }}
                  />
                  {option}
                </label>
              ))}
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                What is the maximum you'd pay for Standard? ($/year)
              </label>
              <input
                type="number"
                value={formData.standardMaxWtp}
                onChange={(e) => handleInputChange('standardMaxWtp', e.target.value)}
                placeholder="e.g., 1000, 1200, 1500"
                style={{ width: '100%', padding: '0.5rem', fontSize: '1rem' }}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                Which features matter most at this tier? (Select all that apply)
              </label>
              {standardFeatures.map((feature) => (
                <label key={feature} style={{ display: 'block', marginBottom: '0.5rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.standardFeatures.includes(feature)}
                    onChange={(e) => handleCheckboxChange('standardFeatures', feature)}
                    style={{ marginRight: '0.5rem' }}
                  />
                  {feature}
                </label>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 4 */}
        {currentSection === 4 && (
          <div>
            <h2>Premium Tier — $1,800/year</h2>
            <div style={{ backgroundColor: '#f5f5f5', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
              <p style={{ marginBottom: '0.5rem' }}>
                <strong>Includes all Standard features, plus:</strong>
              </p>
              <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
                <li>Custom report template builder</li>
                <li>White-label/reseller options</li>
                <li>API access for custom integrations</li>
                <li>Dedicated Slack channel support</li>
                <li>Quarterly strategy calls with our team</li>
                <li>Usage analytics & optimization recommendations</li>
              </ul>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                Would you pay $1,800/year for Premium?
              </label>
              {['Yes', 'No', 'Maybe'].map((option) => (
                <label key={option} style={{ display: 'block', marginBottom: '0.5rem', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="premiumAccept"
                    value={option}
                    checked={formData.premiumAccept === option}
                    onChange={(e) => handleInputChange('premiumAccept', e.target.value)}
                    style={{ marginRight: '0.5rem' }}
                  />
                  {option}
                </label>
              ))}
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                What is the maximum you'd pay for Premium? ($/year)
              </label>
              <input
                type="number"
                value={formData.premiumMaxWtp}
                onChange={(e) => handleInputChange('premiumMaxWtp', e.target.value)}
                placeholder="e.g., 1500, 1800, 2500"
                style={{ width: '100%', padding: '0.5rem', fontSize: '1rem' }}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                Which features matter most at this tier? (Select all that apply)
              </label>
              {premiumFeatures.map((feature) => (
                <label key={feature} style={{ display: 'block', marginBottom: '0.5rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.premiumFeatures.includes(feature)}
                    onChange={(e) => handleCheckboxChange('premiumFeatures', feature)}
                    style={{ marginRight: '0.5rem' }}
                  />
                  {feature}
                </label>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 5 */}
        {currentSection === 5 && (
          <div>
            <h2>About Your Company</h2>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                Company size
              </label>
              <select
                value={formData.companySize}
                onChange={(e) => handleInputChange('companySize', e.target.value)}
                style={{ width: '100%', padding: '0.5rem', fontSize: '1rem' }}
              >
                <option value="">Select...</option>
                <option value="10-20">10-20 people</option>
                <option value="21-35">21-35 people</option>
                <option value="36-50">36-50 people</option>
                <option value="50+">50+ people</option>
              </select>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                Annual agency revenue
              </label>
              <select
                value={formData.annualRevenue}
                onChange={(e) => handleInputChange('annualRevenue', e.target.value)}
                style={{ width: '100%', padding: '0.5rem', fontSize: '1rem' }}
              >
                <option value="">Select...</option>
                <option value="500k-1m">$500K - $1M</option>
                <option value="1m-5m">$1M - $5M</option>
                <option value="5m-10m">$5M - $10M</option>
                <option value="10m+">$10M+</option>
              </select>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                Your decision-making authority
              </label>
              <select
                value={formData.decisionAuthority}
                onChange={(e) => handleInputChange('decisionAuthority', e.target.value)}
                style={{ width: '100%', padding: '0.5rem', fontSize: '1rem' }}
              >
                <option value="">Select...</option>
                <option value="i-decide">I make the final decision</option>
                <option value="i-influence">I heavily influence it</option>
                <option value="i-advise">I provide input</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                Email (for $50 Amazon gift card)
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="you@company.com"
                style={{ width: '100%', padding: '0.5rem', fontSize: '1rem' }}
              />
            </div>
          </div>
        )}

        {/* Navigation */}
        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
          <button
            type="button"
            onClick={() => setCurrentSection(Math.max(1, currentSection - 1))}
            disabled={currentSection === 1}
            style={{
              padding: '0.75rem 1.5rem',
              fontSize: '1rem',
              cursor: currentSection === 1 ? 'not-allowed' : 'pointer',
              opacity: currentSection === 1 ? 0.5 : 1,
              backgroundColor: '#f0f0f0',
              border: '1px solid #ccc',
              borderRadius: '4px',
            }}
          >
            Back
          </button>

          {currentSection < 5 ? (
            <button
              type="button"
              onClick={() => setCurrentSection(currentSection + 1)}
              disabled={!canProceed}
              style={{
                padding: '0.75rem 1.5rem',
                fontSize: '1rem',
                cursor: canProceed ? 'pointer' : 'not-allowed',
                opacity: canProceed ? 1 : 0.5,
                backgroundColor: canProceed ? '#0066cc' : '#ccc',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
              }}
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              disabled={!canProceed}
              style={{
                padding: '0.75rem 1.5rem',
                fontSize: '1rem',
                cursor: canProceed ? 'pointer' : 'not-allowed',
                opacity: canProceed ? 1 : 0.5,
                backgroundColor: canProceed ? '#00b300' : '#ccc',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
              }}
            >
              Submit Survey
            </button>
          )}
        </div>
      </form>
    </main>
  );
}
