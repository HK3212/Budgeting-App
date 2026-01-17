/**
 * Retirement calculation utilities
 * All pure functions for compound interest and projection calculations
 */

/**
 * Calculate future value with compound interest
 * Formula: FV = P(1 + r/n)^(nt) + PMT * [((1 + r/n)^(nt) - 1) / (r/n)]
 */
export const calculateFutureValue = (
  principal,
  monthlyContribution,
  annualRate,
  years
) => {
  if (years <= 0) return principal

  const monthlyRate = annualRate / 12
  const months = years * 12

  if (monthlyRate === 0) {
    return principal + monthlyContribution * months
  }

  // FV of lump sum
  const fvPrincipal = principal * Math.pow(1 + monthlyRate, months)

  // FV of annuity (monthly contributions)
  const fvContributions =
    monthlyContribution *
    ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate)

  return fvPrincipal + fvContributions
}

/**
 * Calculate balance after withdrawals during retirement
 */
export const calculateWithdrawalBalance = (
  startingBalance,
  monthlyWithdrawal,
  annualRate,
  years
) => {
  if (years <= 0) return startingBalance

  const monthlyRate = annualRate / 12
  let balance = startingBalance

  for (let month = 0; month < years * 12; month++) {
    balance = balance * (1 + monthlyRate) - monthlyWithdrawal
    if (balance < 0) return 0
  }

  return Math.max(0, balance)
}

/**
 * Generate full projection from current age to life expectancy
 */
export const generateProjection = (inputs) => {
  const {
    currentAge,
    retirementAge,
    lifeExpectancy,
    currentSavings,
    monthlyContribution,
    annualReturnRate,
    inflationRate,
    monthlyRetirementSpending,
  } = inputs

  // Use real return rate (nominal - inflation) for more accurate projections
  const realReturnRate = annualReturnRate - inflationRate

  const projection = []
  const currentYear = new Date().getFullYear()
  let balance = currentSavings
  let totalContributions = currentSavings
  let totalInterest = 0

  // Accumulation phase (working years)
  for (let age = currentAge; age <= lifeExpectancy; age++) {
    const year = currentYear + (age - currentAge)
    const isRetired = age >= retirementAge

    if (!isRetired) {
      // Working: add contributions and earn interest
      const yearStartBalance = balance
      const yearlyContribution = monthlyContribution * 12
      const endBalance = calculateFutureValue(
        yearStartBalance,
        monthlyContribution,
        realReturnRate,
        1
      )

      const interestEarned = endBalance - yearStartBalance - yearlyContribution
      totalContributions += yearlyContribution
      totalInterest += interestEarned
      balance = endBalance

      projection.push({
        age,
        year,
        balance: Math.round(balance),
        contributions: Math.round(totalContributions),
        interest: Math.round(totalInterest),
        phase: "accumulation",
        yearlyContribution: Math.round(yearlyContribution),
        yearlyInterest: Math.round(interestEarned),
      })
    } else {
      // Retired: withdraw and earn reduced interest
      const yearStartBalance = balance
      const yearlyWithdrawal = monthlyRetirementSpending * 12
      const endBalance = calculateWithdrawalBalance(
        yearStartBalance,
        monthlyRetirementSpending,
        realReturnRate * 0.6, // More conservative in retirement
        1
      )

      const interestEarned = Math.max(
        0,
        endBalance - yearStartBalance + yearlyWithdrawal
      )
      totalInterest += interestEarned
      balance = endBalance

      projection.push({
        age,
        year,
        balance: Math.round(balance),
        contributions: Math.round(totalContributions),
        interest: Math.round(totalInterest),
        phase: "retirement",
        yearlyWithdrawal: Math.round(yearlyWithdrawal),
        yearlyInterest: Math.round(interestEarned),
      })
    }
  }

  return projection
}

/**
 * Calculate breakdown for compound interest visualization
 */
export const calculateCompoundBreakdown = (inputs) => {
  const {
    currentAge,
    retirementAge,
    currentSavings,
    monthlyContribution,
    annualReturnRate,
    inflationRate,
  } = inputs

  // Use real return rate (nominal - inflation)
  const realReturnRate = annualReturnRate - inflationRate

  const years = retirementAge - currentAge
  const totalContributions = currentSavings + monthlyContribution * 12 * years
  const finalBalance = calculateFutureValue(
    currentSavings,
    monthlyContribution,
    realReturnRate,
    years
  )
  const totalInterest = finalBalance - totalContributions

  // Year-by-year breakdown for the table
  const yearlyBreakdown = []
  let runningBalance = currentSavings
  let runningContributions = currentSavings
  let runningInterest = 0

  for (let year = 0; year <= years; year++) {
    if (year > 0) {
      const yearStart = runningBalance
      const yearlyContrib = monthlyContribution * 12
      runningBalance = calculateFutureValue(
        yearStart,
        monthlyContribution,
        realReturnRate,
        1
      )
      const yearInterest = runningBalance - yearStart - yearlyContrib
      runningContributions += yearlyContrib
      runningInterest += yearInterest
    }

    yearlyBreakdown.push({
      year,
      age: currentAge + year,
      balance: Math.round(runningBalance),
      contributions: Math.round(runningContributions),
      interest: Math.round(runningInterest),
    })
  }

  return {
    totalContributions: Math.round(totalContributions),
    totalInterest: Math.round(totalInterest),
    finalBalance: Math.round(finalBalance),
    interestMultiplier:
      totalContributions > 0
        ? (totalInterest / totalContributions).toFixed(2)
        : 0,
    yearlyBreakdown,
  }
}

/**
 * Calculate different investment scenarios
 */
export const calculateScenarios = (inputs) => {
  const { currentAge, retirementAge, currentSavings, monthlyContribution } =
    inputs

  const years = retirementAge - currentAge

  const scenarios = [
    {
      name: "Conservative",
      rate: 0.04,
      description: "Bond-heavy portfolio",
      color: "#3b82f6",
    },
    {
      name: "Moderate",
      rate: 0.07,
      description: "Balanced portfolio",
      color: "#10b981",
    },
    {
      name: "Aggressive",
      rate: 0.1,
      description: "Stock-heavy portfolio",
      color: "#f59e0b",
    },
  ]

  return scenarios.map((scenario) => ({
    ...scenario,
    finalBalance: Math.round(
      calculateFutureValue(
        currentSavings,
        monthlyContribution,
        scenario.rate,
        years
      )
    ),
  }))
}

/**
 * Calculate financial independence milestones
 */
export const calculateMilestones = (inputs, projection) => {
  const {
    monthlyRetirementSpending,
    retirementAge,
    annualReturnRate,
    inflationRate,
  } = inputs

  // Use real return rate (nominal - inflation)
  const realReturnRate = annualReturnRate - inflationRate

  const annualSpending = monthlyRetirementSpending * 12

  // Common FI numbers (using 4% rule: need 25x annual spending)
  const leanFI = annualSpending * 15 // Can cover basics with 4% withdrawal
  const regularFI = annualSpending * 25 // Standard 4% rule
  const fatFI = annualSpending * 35 // Comfortable buffer

  const milestones = [
    {
      name: "Coast FI",
      description: "Can stop contributing, investments will grow to goal",
      target: null, // Calculated differently
      achieved: false,
      age: null,
    },
    {
      name: "Lean FI",
      description: "Covers basic expenses (15x annual spending)",
      target: leanFI,
      achieved: false,
      age: null,
    },
    {
      name: "Financial Independence",
      description: "Standard 4% rule (25x annual spending)",
      target: regularFI,
      achieved: false,
      age: null,
    },
    {
      name: "Fat FI",
      description: "Comfortable cushion (35x annual spending)",
      target: fatFI,
      achieved: false,
      age: null,
    },
    {
      name: "Target Retirement",
      description: `Age ${retirementAge}`,
      target: null,
      achieved: false,
      age: retirementAge,
    },
  ]

  // Find when each milestone is reached
  projection.forEach((point) => {
    milestones.forEach((milestone) => {
      if (
        !milestone.achieved &&
        milestone.target &&
        point.balance >= milestone.target
      ) {
        milestone.achieved = true
        milestone.age = point.age
      }
    })
  })

  // Mark target retirement
  const retirementMilestone = milestones.find(
    (m) => m.name === "Target Retirement"
  )
  if (retirementMilestone) {
    retirementMilestone.achieved = true
  }

  // Calculate Coast FI (simplified: when current balance will grow to FI by retirement)
  const coastMilestone = milestones.find((m) => m.name === "Coast FI")
  if (coastMilestone) {
    for (const point of projection) {
      if (point.phase === "accumulation") {
        const yearsToRetirement = retirementAge - point.age
        const futureValue = calculateFutureValue(
          point.balance,
          0, // No more contributions
          realReturnRate,
          yearsToRetirement
        )
        if (futureValue >= regularFI) {
          coastMilestone.achieved = true
          coastMilestone.age = point.age
          coastMilestone.target = point.balance
          break
        }
      }
    }
  }

  return milestones
}

/**
 * Format currency for display
 */
export const formatCurrency = (value) => {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`
  }
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(0)}K`
  }
  return `$${value.toFixed(0)}`
}
