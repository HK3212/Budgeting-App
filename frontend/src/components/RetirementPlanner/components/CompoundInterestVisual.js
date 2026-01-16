import React, { useState } from "react"
import styles from "../RetirementPlanner.module.scss"
import { formatCurrency } from "../utils/retirementCalculations"

const CompoundInterestVisual = ({ breakdown, inputs }) => {
  const [showTable, setShowTable] = useState(false)

  const {
    totalContributions,
    totalInterest,
    finalBalance,
    interestMultiplier,
    yearlyBreakdown,
  } = breakdown

  const contributionPercent = (totalContributions / finalBalance) * 100
  const interestPercent = (totalInterest / finalBalance) * 100

  return (
    <div className={styles.compoundInterest}>
      <h2 className={styles.sectionTitle}>The Power of Compound Interest</h2>

      <div className={styles.compoundContent}>
        <div className={styles.visualSection}>
          <div className={styles.stackedBar}>
            <div
              className={styles.contributionBar}
              style={{ height: `${contributionPercent}%` }}
            >
              <span className={styles.barLabel}>Your Contributions</span>
            </div>
            <div
              className={styles.interestBar}
              style={{ height: `${interestPercent}%` }}
            >
              <span className={styles.barLabel}>Interest Earned</span>
            </div>
          </div>

          <div className={styles.legend}>
            <div className={styles.legendItem}>
              <span
                className={styles.legendColor}
                style={{ background: "#3b82f6" }}
              ></span>
              <span>Contributions: {formatCurrency(totalContributions)}</span>
            </div>
            <div className={styles.legendItem}>
              <span
                className={styles.legendColor}
                style={{ background: "#10b981" }}
              ></span>
              <span>Interest: {formatCurrency(totalInterest)}</span>
            </div>
          </div>
        </div>

        <div className={styles.explanationSection}>
          <div className={styles.formula}>
            <h3>Compound Interest Formula</h3>
            <div className={styles.formulaText}>
              A = P(1 + r/n)<sup>nt</sup> + PMT × [(1 + r/n)<sup>nt</sup> - 1] /
              (r/n)
            </div>
            <div className={styles.formulaLegend}>
              <p>
                <strong>A</strong> = Final Amount
              </p>
              <p>
                <strong>P</strong> = Principal ($
                {inputs.currentSavings.toLocaleString()})
              </p>
              <p>
                <strong>r</strong> = Annual Rate (
                {(inputs.annualReturnRate * 100).toFixed(1)}%)
              </p>
              <p>
                <strong>n</strong> = Compounds per year (12)
              </p>
              <p>
                <strong>t</strong> = Years (
                {inputs.retirementAge - inputs.currentAge})
              </p>
              <p>
                <strong>PMT</strong> = Monthly Payment ($
                {inputs.monthlyContribution.toLocaleString()})
              </p>
            </div>
          </div>

          <div className={styles.insight}>
            <div className={styles.insightCard}>
              <span className={styles.insightValue}>{interestMultiplier}x</span>
              <span className={styles.insightLabel}>
                Your money earned {interestMultiplier}x what you contributed!
              </span>
            </div>
            <p className={styles.insightText}>
              Over {inputs.retirementAge - inputs.currentAge} years, you
              contribute <strong>{formatCurrency(totalContributions)}</strong>,
              but compound interest generates an additional{" "}
              <strong>{formatCurrency(totalInterest)}</strong> — that's the
              "interest on interest" effect working for you.
            </p>
          </div>
        </div>
      </div>

      <button
        className={styles.toggleButton}
        onClick={() => setShowTable(!showTable)}
      >
        {showTable ? "Hide" : "Show"} Year-by-Year Breakdown
      </button>

      {showTable && (
        <div className={styles.breakdownTable}>
          <table>
            <thead>
              <tr>
                <th>Year</th>
                <th>Age</th>
                <th>Total Contributions</th>
                <th>Interest Earned</th>
                <th>Balance</th>
              </tr>
            </thead>
            <tbody>
              {yearlyBreakdown
                .filter(
                  (_, i) => i % 5 === 0 || i === yearlyBreakdown.length - 1
                )
                .map((row) => (
                  <tr key={row.year}>
                    <td>{row.year}</td>
                    <td>{row.age}</td>
                    <td>{formatCurrency(row.contributions)}</td>
                    <td>{formatCurrency(row.interest)}</td>
                    <td>{formatCurrency(row.balance)}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default CompoundInterestVisual
