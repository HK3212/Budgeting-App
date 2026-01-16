import React, { useState, useMemo } from "react"
import styles from "./RetirementPlanner.module.scss"
import RetirementInputForm from "./components/RetirementInputForm"
import ProjectionChart from "./components/ProjectionChart"
import CompoundInterestVisual from "./components/CompoundInterestVisual"
import ScenarioComparison from "./components/ScenarioComparison"
import MilestoneTimeline from "./components/MilestoneTimeline"
import {
  generateProjection,
  calculateCompoundBreakdown,
  calculateScenarios,
  calculateMilestones,
} from "./utils/retirementCalculations"

const DEFAULT_INPUTS = {
  currentAge: 30,
  retirementAge: 65,
  lifeExpectancy: 90,
  currentSavings: 50000,
  monthlyContribution: 500,
  annualReturnRate: 0.07,
  inflationRate: 0.03,
  monthlyRetirementSpending: 4000,
}

const RetirementPlanner = () => {
  const [inputs, setInputs] = useState(DEFAULT_INPUTS)

  const handleInputChange = (field, value) => {
    setInputs((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const projection = useMemo(() => generateProjection(inputs), [inputs])

  const compoundBreakdown = useMemo(
    () => calculateCompoundBreakdown(inputs),
    [inputs]
  )

  const scenarios = useMemo(() => calculateScenarios(inputs), [inputs])

  const milestones = useMemo(
    () => calculateMilestones(inputs, projection),
    [inputs, projection]
  )

  const retirementBalance = useMemo(() => {
    const retirementPoint = projection.find(
      (p) => p.age === inputs.retirementAge
    )
    return retirementPoint ? retirementPoint.balance : 0
  }, [projection, inputs.retirementAge])

  return (
    <div className={styles.retirementPlanner}>
      <div className={styles.header}>
        <h1 className={styles.title}>Retirement Planner</h1>
        <p className={styles.subtitle}>
          Plan your financial future with compound interest projections
        </p>
      </div>

      <div className={styles.mainContent}>
        <div className={styles.inputSection}>
          <RetirementInputForm inputs={inputs} onChange={handleInputChange} />
        </div>

        <div className={styles.chartSection}>
          <ProjectionChart
            projection={projection}
            retirementAge={inputs.retirementAge}
          />
          <div className={styles.projectionSummary}>
            <span className={styles.summaryLabel}>
              Projected balance at retirement:
            </span>
            <span className={styles.summaryValue}>
              ${retirementBalance.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      <div className={styles.compoundSection}>
        <CompoundInterestVisual breakdown={compoundBreakdown} inputs={inputs} />
      </div>

      <div className={styles.bottomSection}>
        <div className={styles.scenarioSection}>
          <ScenarioComparison scenarios={scenarios} />
        </div>

        <div className={styles.milestoneSection}>
          <MilestoneTimeline
            milestones={milestones}
            currentAge={inputs.currentAge}
            retirementAge={inputs.retirementAge}
          />
        </div>
      </div>
    </div>
  )
}

export default RetirementPlanner
