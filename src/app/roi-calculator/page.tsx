'use client';

import { useState, useMemo } from 'react';

export default function ROICalculator() {
  // State for user inputs
  const [weeklyHours, setWeeklyHours] = useState(8);
  const [numStaff, setNumStaff] = useState(3);
  const [hourlyRate, setHourlyRate] = useState(50);
  const [errorRate, setErrorRate] = useState(8.5);
  const [reportsPerYear, setReportsPerYear] = useState(160);
  const [dataPointsPerReport, setDataPointsPerReport] = useState(50);
  const [costPerError, setCostPerError] = useState(100);
  const [toolConsolidation, setToolConsolidation] = useState(3200);

  // Constants
  const AUTOREPORT_HOURS_WEEKLY = 1.5;
  const AUTOREPORT_ERROR_RATE = 0.5;
  const ANNUAL_WEEKS = 52;
  const AUTOREPORT_ANNUAL_COST = 1200;
  const DISCOUNT_RATE = 0.1; // 10% for NPV calculation

  // Calculations
  const calculations = useMemo(() => {
    // Time Savings
    const hoursPerWeekSaved = weeklyHours - AUTOREPORT_HOURS_WEEKLY;
    const totalHoursSavedWeekly = hoursPerWeekSaved * numStaff;
    const annualHoursSaved = totalHoursSavedWeekly * ANNUAL_WEEKS;
    const annualTimeSavingsValue = annualHoursSaved * hourlyRate;

    // Error Reduction
    const baselineErrorsPerYear =
      (errorRate / 100) * reportsPerYear * dataPointsPerReport;
    const autoreportErrorsPerYear =
      (AUTOREPORT_ERROR_RATE / 100) * reportsPerYear * dataPointsPerReport;
    const errorsEliminated = baselineErrorsPerYear - autoreportErrorsPerYear;
    const errorReductionPercent =
      ((errorRate - AUTOREPORT_ERROR_RATE) / errorRate) * 100;
    const annualErrorSavings = errorsEliminated * costPerError;

    // Tool Consolidation
    const annualToolSavings = toolConsolidation;

    // Total Value
    const totalAnnualValue =
      annualTimeSavingsValue + annualErrorSavings + annualToolSavings;
    const annualSoftwareCost = AUTOREPORT_ANNUAL_COST * numStaff;
    const netAnnualBenefit = totalAnnualValue - annualSoftwareCost;

    // ROI Metrics
    const roiMultiple = totalAnnualValue / annualSoftwareCost;
    const paybackPeriodDays = (annualSoftwareCost / netAnnualBenefit) * 365;

    // 5-Year NPV
    let npv = 0;
    for (let year = 1; year <= 5; year++) {
      const annualBenefit = netAnnualBenefit;
      const discountFactor = Math.pow(1 + DISCOUNT_RATE, year);
      npv += annualBenefit / discountFactor;
    }

    // 5-Year Cumulative
    const fiveYearCumulativeValue =
      totalAnnualValue * 5 - annualSoftwareCost * 5;

    return {
      hoursPerWeekSaved,
      totalHoursSavedWeekly,
      annualHoursSaved,
      annualTimeSavingsValue,
      baselineErrorsPerYear,
      autoreportErrorsPerYear,
      errorsEliminated,
      errorReductionPercent,
      annualErrorSavings,
      annualToolSavings,
      totalAnnualValue,
      annualSoftwareCost,
      netAnnualBenefit,
      roiMultiple,
      paybackPeriodDays,
      npv,
      fiveYearCumulativeValue,
    };
  }, [
    weeklyHours,
    numStaff,
    hourlyRate,
    errorRate,
    reportsPerYear,
    dataPointsPerReport,
    costPerError,
    toolConsolidation,
  ]);

  const handleReset = () => {
    setWeeklyHours(8);
    setNumStaff(3);
    setHourlyRate(50);
    setErrorRate(8.5);
    setReportsPerYear(160);
    setDataPointsPerReport(50);
    setCostPerError(100);
    setToolConsolidation(3200);
  };

  return (
    <main style={styles.container}>
      <div style={styles.header}>
        <h1>AutoReport ROI Calculator</h1>
        <p style={styles.subtitle}>
          Calculate your savings: time, accuracy, and tool consolidation
        </p>
      </div>

      <div style={styles.content}>
        <div style={styles.inputSection}>
          <h2>Your Situation</h2>
          <p style={styles.sectionDescription}>
            Customize these inputs to match your agency's workflow
          </p>

          <div style={styles.inputGrid}>
            {/* Row 1: Time Inputs */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>
                Weekly Reporting Hours (Baseline)
              </label>
              <div style={styles.inputRow}>
                <input
                  type="range"
                  min="4"
                  max="12"
                  step="0.5"
                  value={weeklyHours}
                  onChange={(e) => setWeeklyHours(parseFloat(e.target.value))}
                  style={styles.slider}
                />
                <span style={styles.valueDisplay}>{weeklyHours} hrs</span>
              </div>
              <p style={styles.hint}>How many hours per week do you spend on client reporting?</p>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Number of Marketing Staff</label>
              <div style={styles.inputRow}>
                <input
                  type="range"
                  min="1"
                  max="20"
                  step="1"
                  value={numStaff}
                  onChange={(e) => setNumStaff(parseInt(e.target.value))}
                  style={styles.slider}
                />
                <span style={styles.valueDisplay}>{numStaff} staff</span>
              </div>
              <p style={styles.hint}>How many people use reporting tools at your agency?</p>
            </div>

            {/* Row 2: Cost Inputs */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>Blended Hourly Rate (Loaded)</label>
              <div style={styles.inputRow}>
                <input
                  type="range"
                  min="35"
                  max="75"
                  step="5"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(parseFloat(e.target.value))}
                  style={styles.slider}
                />
                <span style={styles.valueDisplay}>${hourlyRate}/hr</span>
              </div>
              <p style={styles.hint}>Salary + 40% overhead (benefits, equipment, etc.)</p>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Error Cost Per Incident</label>
              <div style={styles.inputRow}>
                <input
                  type="range"
                  min="50"
                  max="300"
                  step="25"
                  value={costPerError}
                  onChange={(e) => setCostPerError(parseFloat(e.target.value))}
                  style={styles.slider}
                />
                <span style={styles.valueDisplay}>${costPerError}</span>
              </div>
              <p style={styles.hint}>Direct correction + client impact + lost trust</p>
            </div>

            {/* Row 3: Error & Reporting Inputs */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>Baseline Error Rate (%)</label>
              <div style={styles.inputRow}>
                <input
                  type="range"
                  min="3"
                  max="12"
                  step="0.5"
                  value={errorRate}
                  onChange={(e) => setErrorRate(parseFloat(e.target.value))}
                  style={styles.slider}
                />
                <span style={styles.valueDisplay}>{errorRate}%</span>
              </div>
              <p style={styles.hint}>Errors in your manual reporting process (copy-paste, formula, extraction)</p>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Reports Per Year</label>
              <div style={styles.inputRow}>
                <input
                  type="range"
                  min="48"
                  max="260"
                  step="4"
                  value={reportsPerYear}
                  onChange={(e) => setReportsPerYear(parseInt(e.target.value))}
                  style={styles.slider}
                />
                <span style={styles.valueDisplay}>{reportsPerYear}</span>
              </div>
              <p style={styles.hint}>Weekly frequency × clients (e.g., 4 clients × 52 weeks = 208)</p>
            </div>

            {/* Row 4: Advanced Inputs */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>Data Points Per Report</label>
              <div style={styles.inputRow}>
                <input
                  type="range"
                  min="20"
                  max="100"
                  step="5"
                  value={dataPointsPerReport}
                  onChange={(e) =>
                    setDataPointsPerReport(parseInt(e.target.value))
                  }
                  style={styles.slider}
                />
                <span style={styles.valueDisplay}>{dataPointsPerReport}</span>
              </div>
              <p style={styles.hint}>KPIs, metrics, dimensions per client report</p>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Annual Tool Consolidation Savings</label>
              <div style={styles.inputRow}>
                <input
                  type="range"
                  min="0"
                  max="5000"
                  step="200"
                  value={toolConsolidation}
                  onChange={(e) =>
                    setToolConsolidation(parseFloat(e.target.value))
                  }
                  style={styles.slider}
                />
                <span style={styles.valueDisplay}>
                  ${toolConsolidation.toLocaleString()}
                </span>
              </div>
              <p style={styles.hint}>Supermetrics, DataBox, or other tools you can eliminate</p>
            </div>
          </div>

          <button onClick={handleReset} style={styles.resetButton}>
            Reset to Defaults
          </button>
        </div>

        <div style={styles.resultsSection}>
          <h2>Your ROI Results</h2>

          {/* Summary Cards */}
          <div style={styles.cardGrid}>
            <div style={styles.card}>
              <div style={styles.cardValue}>
                {calculations.hoursPerWeekSaved.toFixed(1)}
              </div>
              <div style={styles.cardLabel}>Hours Saved Per Week</div>
              <div style={styles.cardSubtext}>
                {((calculations.hoursPerWeekSaved / weeklyHours) * 100).toFixed(0)}% reduction
              </div>
            </div>

            <div style={styles.card}>
              <div style={styles.cardValue}>
                ${(calculations.annualTimeSavingsValue / 1000).toFixed(1)}K
              </div>
              <div style={styles.cardLabel}>Annual Time Savings</div>
              <div style={styles.cardSubtext}>
                For {numStaff} staff × {ANNUAL_WEEKS} weeks
              </div>
            </div>

            <div style={styles.card}>
              <div style={styles.cardValue}>
                {calculations.errorReductionPercent.toFixed(0)}%
              </div>
              <div style={styles.cardLabel}>Error Rate Reduction</div>
              <div style={styles.cardSubtext}>
                From {errorRate.toFixed(1)}% to {AUTOREPORT_ERROR_RATE}%
              </div>
            </div>

            <div style={styles.card}>
              <div style={styles.cardValue}>
                ${(calculations.annualErrorSavings / 1000).toFixed(1)}K
              </div>
              <div style={styles.cardLabel}>Annual Error Savings</div>
              <div style={styles.cardSubtext}>
                {Math.round(calculations.errorsEliminated)} errors eliminated
              </div>
            </div>
          </div>

          {/* Detailed Breakdown */}
          <div style={styles.breakdownSection}>
            <h3>Value Breakdown</h3>
            <div style={styles.breakdownItem}>
              <span>Time Savings Value</span>
              <span style={styles.breakdownValue}>
                ${calculations.annualTimeSavingsValue.toLocaleString()}
              </span>
            </div>
            <div style={styles.breakdownItem}>
              <span>Error Reduction Value</span>
              <span style={styles.breakdownValue}>
                ${calculations.annualErrorSavings.toLocaleString()}
              </span>
            </div>
            <div style={styles.breakdownItem}>
              <span>Tool Consolidation Savings</span>
              <span style={styles.breakdownValue}>
                ${calculations.annualToolSavings.toLocaleString()}
              </span>
            </div>
            <div style={styles.breakdownItem} style={styles.totalItem}>
              <span>Total Annual Value</span>
              <span style={styles.totalValue}>
                ${calculations.totalAnnualValue.toLocaleString()}
              </span>
            </div>
            <div style={styles.breakdownItem}>
              <span>Annual Software Cost</span>
              <span style={styles.breakdownValue}>
                ${calculations.annualSoftwareCost.toLocaleString()}
              </span>
            </div>
            <div style={styles.breakdownItem} style={styles.netItem}>
              <span>Net Annual Benefit</span>
              <span style={styles.netValue}>
                ${calculations.netAnnualBenefit.toLocaleString()}
              </span>
            </div>
          </div>

          {/* ROI Metrics */}
          <div style={styles.metricsSection}>
            <h3>ROI Metrics</h3>
            <div style={styles.metricGrid}>
              <div style={styles.metric}>
                <div style={styles.metricLabel}>ROI Multiple</div>
                <div style={styles.metricValue}>
                  {calculations.roiMultiple.toFixed(1)}x
                </div>
                <div style={styles.metricSubtext}>
                  {calculations.roiMultiple > 5 ? '✓ Exceptional' : '○ Standard'}
                </div>
              </div>

              <div style={styles.metric}>
                <div style={styles.metricLabel}>Payback Period</div>
                <div style={styles.metricValue}>
                  {Math.round(calculations.paybackPeriodDays)} days
                </div>
                <div style={styles.metricSubtext}>
                  {calculations.paybackPeriodDays < 90 ? '✓ Quick' : '○ Standard'}
                </div>
              </div>

              <div style={styles.metric}>
                <div style={styles.metricLabel}>5-Year Net Value</div>
                <div style={styles.metricValue}>
                  ${(calculations.fiveYearCumulativeValue / 1000).toFixed(0)}K
                </div>
                <div style={styles.metricSubtext}>
                  At {numStaff} users
                </div>
              </div>

              <div style={styles.metric}>
                <div style={styles.metricLabel}>5-Year NPV (10% discount)</div>
                <div style={styles.metricValue}>
                  ${(calculations.npv / 1000).toFixed(0)}K
                </div>
                <div style={styles.metricSubtext}>
                  Present value of future benefits
                </div>
              </div>
            </div>
          </div>

          {/* Key Insights */}
          <div style={styles.insightSection}>
            <h3>Key Insights</h3>
            <ul style={styles.insightList}>
              <li>
                <strong>Per User Value:</strong> Each marketing manager saves{' '}
                <strong>${(calculations.annualTimeSavingsValue / numStaff).toLocaleString()}</strong>{' '}
                annually in time alone.
              </li>
              <li>
                <strong>Time Impact:</strong> Across your team, that's{' '}
                <strong>
                  {(calculations.annualHoursSaved / ANNUAL_WEEKS).toFixed(0)} hours
                  per week
                </strong>{' '}
                freed up for strategy work.
              </li>
              <li>
                <strong>Quality Improvement:</strong> Error reduction prevents{' '}
                <strong>
                  {Math.round(calculations.errorsEliminated)} mistakes per year
                </strong>
                , protecting client relationships.
              </li>
              <li>
                <strong>Cost per Report:</strong> Your current cost is ~$
                {((calculations.annualSoftwareCost / (reportsPerYear * numStaff)) * 100).toFixed(0)}/report
                ; AutoReport enables enterprise-scale reporting at{' '}
                <strong>
                  $
                  {((AUTOREPORT_ANNUAL_COST / reportsPerYear) * 100).toFixed(0)}/report
                </strong>
                .
              </li>
            </ul>
          </div>

          {/* Call-to-Action */}
          <div style={styles.ctaSection}>
            <h3>Ready to transform your reporting?</h3>
            <p>
              This ROI is achievable in your first month. Start your 14-day free
              trial to see these numbers in action.
            </p>
            <button style={styles.ctaButton}>Start Free Trial</button>
          </div>
        </div>
      </div>
    </main>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: '2rem',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    backgroundColor: '#f5f7fa',
    minHeight: '100vh',
  },
  header: {
    marginBottom: '3rem',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: '1.1rem',
    color: '#666',
    marginTop: '0.5rem',
  },
  content: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '2rem',
    maxWidth: '1400px',
    margin: '0 auto',
  },
  inputSection: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  },
  sectionDescription: {
    color: '#666',
    fontSize: '0.95rem',
    marginBottom: '1.5rem',
  },
  inputGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '1.5rem',
    marginBottom: '2rem',
  },
  inputGroup: {
    borderBottom: '1px solid #eee',
    paddingBottom: '1.5rem',
  },
  label: {
    display: 'block',
    fontWeight: '600',
    marginBottom: '0.75rem',
    color: '#333',
  },
  inputRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '0.5rem',
  },
  slider: {
    flex: 1,
    height: '6px',
    borderRadius: '3px',
    background: '#ddd',
    outline: 'none',
    cursor: 'pointer',
  },
  valueDisplay: {
    fontWeight: '600',
    color: '#0066cc',
    minWidth: '60px',
    textAlign: 'right',
  },
  hint: {
    fontSize: '0.85rem',
    color: '#999',
    marginTop: '0.5rem',
    margin: '0.5rem 0 0 0',
  },
  resetButton: {
    backgroundColor: '#f0f0f0',
    border: '1px solid #ddd',
    padding: '0.75rem 1.5rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: '600',
    color: '#333',
    marginTop: '1rem',
  },
  resultsSection: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  },
  cardGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1.5rem',
    marginBottom: '2rem',
  },
  card: {
    backgroundColor: '#f9fbfc',
    border: '1px solid #e0e6ed',
    borderRadius: '6px',
    padding: '1.5rem',
    textAlign: 'center',
  },
  cardValue: {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#0066cc',
    marginBottom: '0.5rem',
  },
  cardLabel: {
    fontSize: '0.95rem',
    fontWeight: '600',
    color: '#333',
    marginBottom: '0.25rem',
  },
  cardSubtext: {
    fontSize: '0.85rem',
    color: '#666',
  },
  breakdownSection: {
    marginBottom: '2rem',
    paddingBottom: '2rem',
    borderBottom: '1px solid #eee',
  },
  breakdownItem: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingBottom: '0.75rem',
    fontSize: '0.95rem',
    color: '#666',
  },
  totalItem: {
    paddingTop: '0.75rem',
    borderTop: '2px solid #ddd',
    fontWeight: '600',
    color: '#333',
  },
  breakdownValue: {
    fontWeight: '600',
    color: '#333',
  },
  totalValue: {
    fontSize: '1.1rem',
    color: '#0066cc',
  },
  netItem: {
    backgroundColor: '#f0f8ff',
    paddingLeft: '1rem',
    paddingRight: '1rem',
    marginLeft: '-2rem',
    marginRight: '-2rem',
    paddingTop: '0.75rem',
    paddingBottom: '0.75rem',
  },
  netValue: {
    fontSize: '1.1rem',
    color: '#00aa00',
  },
  metricsSection: {
    marginBottom: '2rem',
    paddingBottom: '2rem',
    borderBottom: '1px solid #eee',
  },
  metricGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1.5rem',
  },
  metric: {
    padding: '1rem',
    backgroundColor: '#f5f7fa',
    borderRadius: '6px',
    borderLeft: '4px solid #0066cc',
  },
  metricLabel: {
    fontSize: '0.85rem',
    color: '#666',
    marginBottom: '0.5rem',
  },
  metricValue: {
    fontSize: '1.75rem',
    fontWeight: '700',
    color: '#0066cc',
    marginBottom: '0.25rem',
  },
  metricSubtext: {
    fontSize: '0.8rem',
    color: '#999',
  },
  insightSection: {
    marginBottom: '2rem',
    paddingBottom: '2rem',
    borderBottom: '1px solid #eee',
  },
  insightList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  ctaSection: {
    backgroundColor: '#f0f8ff',
    border: '1px solid #b3d9ff',
    borderRadius: '6px',
    padding: '1.5rem',
    textAlign: 'center',
  },
  ctaButton: {
    backgroundColor: '#0066cc',
    color: 'white',
    border: 'none',
    padding: '0.75rem 2rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '1rem',
    marginTop: '1rem',
  },
};
