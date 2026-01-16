import React from "react"
import { NumericFormat } from "react-number-format"
import styles from "../RetirementPlanner.module.scss"

const RetirementInputForm = ({ inputs, onChange }) => {
  const handleNumberChange = (field) => (values) => {
    const value = values.floatValue || 0
    onChange(field, value)
  }

  const handleSliderChange = (field) => (event) => {
    onChange(field, parseFloat(event.target.value))
  }

  return (
    <div className={styles.inputForm}>
      <h2 className={styles.formTitle}>Your Information</h2>

      <div className={styles.inputGroup}>
        <label className={styles.label}>Current Age</label>
        <NumericFormat
          value={inputs.currentAge}
          onValueChange={handleNumberChange("currentAge")}
          className={styles.input}
          allowNegative={false}
          decimalScale={0}
          isAllowed={(values) => values.floatValue <= 100}
        />
      </div>

      <div className={styles.inputGroup}>
        <label className={styles.label}>Retirement Age</label>
        <NumericFormat
          value={inputs.retirementAge}
          onValueChange={handleNumberChange("retirementAge")}
          className={styles.input}
          allowNegative={false}
          decimalScale={0}
          isAllowed={(values) =>
            values.floatValue <= 100 && values.floatValue > inputs.currentAge
          }
        />
      </div>

      <div className={styles.inputGroup}>
        <label className={styles.label}>Life Expectancy</label>
        <NumericFormat
          value={inputs.lifeExpectancy}
          onValueChange={handleNumberChange("lifeExpectancy")}
          className={styles.input}
          allowNegative={false}
          decimalScale={0}
          isAllowed={(values) => values.floatValue <= 120}
        />
      </div>

      <div className={styles.inputGroup}>
        <label className={styles.label}>Current Savings</label>
        <NumericFormat
          value={inputs.currentSavings}
          onValueChange={handleNumberChange("currentSavings")}
          className={styles.input}
          prefix="$"
          thousandSeparator={true}
          allowNegative={false}
          decimalScale={0}
        />
      </div>

      <div className={styles.inputGroup}>
        <label className={styles.label}>Monthly Contribution</label>
        <NumericFormat
          value={inputs.monthlyContribution}
          onValueChange={handleNumberChange("monthlyContribution")}
          className={styles.input}
          prefix="$"
          thousandSeparator={true}
          allowNegative={false}
          decimalScale={0}
        />
      </div>

      <div className={styles.inputGroup}>
        <label className={styles.label}>
          Expected Annual Return: {(inputs.annualReturnRate * 100).toFixed(1)}%
        </label>
        <input
          type="range"
          min="0"
          max="0.15"
          step="0.005"
          value={inputs.annualReturnRate}
          onChange={handleSliderChange("annualReturnRate")}
          className={styles.slider}
        />
        <div className={styles.sliderLabels}>
          <span>0%</span>
          <span>15%</span>
        </div>
      </div>

      <div className={styles.inputGroup}>
        <label className={styles.label}>
          Inflation Rate: {(inputs.inflationRate * 100).toFixed(1)}%
        </label>
        <input
          type="range"
          min="0"
          max="0.08"
          step="0.005"
          value={inputs.inflationRate}
          onChange={handleSliderChange("inflationRate")}
          className={styles.slider}
        />
        <div className={styles.sliderLabels}>
          <span>0%</span>
          <span>8%</span>
        </div>
      </div>

      <div className={styles.inputGroup}>
        <label className={styles.label}>Monthly Retirement Spending</label>
        <NumericFormat
          value={inputs.monthlyRetirementSpending}
          onValueChange={handleNumberChange("monthlyRetirementSpending")}
          className={styles.input}
          prefix="$"
          thousandSeparator={true}
          allowNegative={false}
          decimalScale={0}
        />
      </div>
    </div>
  )
}

export default RetirementInputForm
