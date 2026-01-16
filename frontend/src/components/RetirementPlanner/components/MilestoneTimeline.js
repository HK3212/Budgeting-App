import React from "react"
import styles from "../RetirementPlanner.module.scss"
import { formatCurrency } from "../utils/retirementCalculations"

const MilestoneTimeline = ({ milestones, currentAge, retirementAge }) => {
  const sortedMilestones = [...milestones]
    .filter((m) => m.age !== null)
    .sort((a, b) => a.age - b.age)

  const minAge = currentAge
  const maxAge = Math.max(
    retirementAge + 5,
    ...sortedMilestones.map((m) => m.age || 0)
  )
  const range = maxAge - minAge

  const getPosition = (age) => {
    return ((age - minAge) / range) * 100
  }

  return (
    <div className={styles.milestoneTimeline}>
      <h2 className={styles.sectionTitle}>Financial Milestones</h2>
      <p className={styles.milestoneSubtitle}>
        Track your progress toward financial independence
      </p>

      <div className={styles.timeline}>
        <div className={styles.timelineTrack}>
          <div
            className={styles.timelineProgress}
            style={{ width: `${getPosition(currentAge)}%` }}
          ></div>
        </div>

        <div
          className={styles.currentMarker}
          style={{ left: `${getPosition(currentAge)}%` }}
        >
          <div className={styles.markerDot}></div>
          <span className={styles.markerLabel}>Now</span>
        </div>

        {sortedMilestones.map((milestone, index) => (
          <div
            key={milestone.name}
            className={`${styles.milestoneMarker} ${milestone.achieved ? styles.achieved : ""}`}
            style={{ left: `${getPosition(milestone.age)}%` }}
          >
            <div className={styles.milestonePoint}></div>
            <div
              className={styles.milestoneInfo}
              style={{ top: index % 2 === 0 ? "-60px" : "25px" }}
            >
              <span className={styles.milestoneName}>{milestone.name}</span>
              <span className={styles.milestoneAge}>Age {milestone.age}</span>
              {milestone.target && (
                <span className={styles.milestoneTarget}>
                  {formatCurrency(milestone.target)}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className={styles.milestoneCards}>
        {milestones.map((milestone) => (
          <div
            key={milestone.name}
            className={`${styles.milestoneCard} ${milestone.achieved ? styles.achievedCard : ""}`}
          >
            <div className={styles.milestoneStatus}>
              {milestone.achieved ? (
                <span className={styles.checkmark}>&#10003;</span>
              ) : (
                <span className={styles.pending}>&#9675;</span>
              )}
            </div>
            <div className={styles.milestoneContent}>
              <h4>{milestone.name}</h4>
              <p>{milestone.description}</p>
              {milestone.age && (
                <span className={styles.milestoneAgeTag}>
                  Age {milestone.age}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MilestoneTimeline
